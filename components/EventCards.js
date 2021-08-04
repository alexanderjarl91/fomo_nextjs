import React, {
  useState,
  useContext,
  createRef,
  useRef,
  useEffect,
} from "react";
import TinderCard from "../components/TinderCard";
import styles from "../styles/EventCards.module.css";
import fire from "../firebase";
import { DataContext } from "../context";
import { useRouter } from "next/router";
import Buttons from "./Buttons";
import cx from "../utils/cx";
import { FaSearchLocation } from "react-icons/fa";
import { render } from "react-dom";
import { set } from "date-fns";

function EventCards() {
  const router = useRouter();
  const {
    getEvents,
    futureEventsWithDistance,
    userLocation,
    setUserLocation,
    clearSeen,
    userData,
    refreshData,
    maxDistance,
  } = useContext(DataContext);
  const [renderedEvents, setRenderedEvents] = useState();
  const [eventsWithoutSeen, setEventsWithoutSeen] = useState();
  const [cardRefs, setCardRefs] = useState([]);
  const [showAnimation, setShowAnimation] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState();
  const [country, setCountry] = useState();
  const [showCountryError, setShowCountryError] = useState();
  const [activeId, setActiveId] = useState();
  
  //get events on mount
  useEffect(() => {
    getEvents();
  }, []);

  const removeSeen = (array) => {
    //if there is no user data, return unaltered array
    if (!userData) return array;
    let unseenEvents = [];
    const seenEvents = userData.seen;
    if (fire.auth().currentUser && userData) {
      unseenEvents = array?.filter(
        (item) => !seenEvents.includes(item.eventId)
      );
    }
    return unseenEvents;
  };

  useEffect(() => {
    //clearing renderedEvents
    setRenderedEvents([])
    setEventsWithoutSeen(removeSeen(futureEventsWithDistance));
    setActiveCardIndex(futureEventsWithDistance?.length - 1);
  }, [futureEventsWithDistance]);

  useEffect(() => {
    setActiveCardIndex(eventsWithoutSeen?.length - 1);
    setRenderedEvents(eventsWithoutSeen);
  }, [eventsWithoutSeen]);

  const getUserCountry = () => {
    fetch("https://extreme-ip-lookup.com/json/")
      .then((res) => res.json())
      .then((response) => {
        setCountry(response.country);
        if (response.country == "Iceland") {
          setShowCountryError(false);
        } else {
          setShowCountryError(true);
        }
      })
      .catch((data, status) => {
        console.log("Request failed");
      });
  };

  useEffect(() => {
    getUserCountry();
  }, []);
  // get user location function
  const getUserLocation = () => {
    //check if location is available in users browser
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (country && country === "Iceland") {
            setUserLocation(position.coords);
          } else {
            setUserLocation({ latitude: 64.13, longitude: -21.9 });
          }
        },
        (err) => setUserLocation(err),
        { maximumAge: 60000, timeout: 5000, enableHighAccuracy: true }
      );
    } else {
      console.log("Geolocation Not Available");
    }
  };

  //get user location on mount
  useEffect(() => {
    getUserLocation();
  }, [country]);

  //handle function when like button is clicked
  const handleLike = (dir, index, id) => {
    console.log(dir, index, id);
    // if (activeCardIndex < 0) return;

    // cardRefs[index].current.swipe("right");

    // renderedEvents.map((el, i) => {
    //   console.log(el.eventId, activeId);
    //   if (i == index) {
    //     if (el.eventId == activeId) {
    //       cardRefs[i].current.swipe("right");

    //       // document.getElementById(`card-${i - 1}`).swipe("right");
    //     } else {
    //       console.log(i, "iiiii", index);
    //       console.log(activeId, el.eventId);
    //       cardRefs[index].current.swipe("right");
    //     }
    //   }
    // });
    cardRefs[activeCardIndex].current.swipe(dir, index, id);
    // renderedEvents.map((el, i) => {
    //   if (i == activeCardIndex) {
    //     if (el.eventId == activeId) {
    //       cardRefs[activeCardIndex].current.swipe(dir,activeCardIndex,id);
    //     } else {
    //       cardRefs[i].current.swipe(dir,i,id);
    //     }
    //   }
    // });
  };

  //handle swipe
  const handleSwipe = async (dir, index, id) => {
    setActiveId(id);
    const currentEventId = renderedEvents[index].eventId;
    //set card to seen
    const saveToSeen = async () => {
      console.log('saveToSeen called')
      if (!fire.auth().currentUser) return;
      //get authenticated user
      const userRef = await fire
        .firestore()
        .collection("users")
        .doc(fire.auth().currentUser.email);
      // //get auth users data
      const doc = await userRef.get();
      let tempSeen = doc.data().seen;
      // if (!doc.exists) return;
      //prevent duplicates
      if (tempSeen.includes(currentEventId)) {
        console.log("found duplicate");
        return;
      }
      //push new events ID to copy of array
      tempSeen.push(currentEventId);
      //post new array to database
      userRef.update({ seen: tempSeen });
    };
    await saveToSeen();
    //save event if swiped right
    if (dir === "right") {
      //animate
      const cardNotifications = document.querySelectorAll(".cardAnimate");
      const cardNotification = document.getElementById(`animate-${id}`);
      cardNotifications.forEach((item) => (item.style.display = "none"));
      cardNotification.style.display = "block";
      const activeCard = renderedEvents[activeCardIndex];
      console.log("id", id);
      await saveToInterested(id);
      // setActiveCardIndex(activeCardIndex);
    }
    setActiveCardIndex(index);
    fire.analytics().logEvent("swipe");
  };

  const saveToInterested = async (id) => {
    //if user is not logged in, cancel function
    if (!fire.auth().currentUser) return;
    // get current users interested array
    const userRef = await fire
      .firestore()
      .collection("users")
      .doc(fire.auth().currentUser.email);
    const doc = await userRef.get();
    // create a temp array and fill it with firestore data
    let tempInterested = [];
    //if no doc was found, cancel function
    if (!doc.exists) {
      console.log("!doc doesnt exist");
      return;
    }
    //if doc had an interested array, save a temp version of it
    if (doc.data().interested) {
      tempInterested = doc.data().interested;
    }
    // // cancel if item is already
    if (tempInterested.includes(id)) {
      console.log("doc already exists");
      return;
    }

    // push activeCards eventId to temporary interested array
    tempInterested.push(id);
    // save new interested array to firestore
    userRef.update({ interested: tempInterested });
    console.log("saving...");
  };


  //create an array of references for each event card whenever filteredEvents array updates
  useEffect(() => {
    if (!renderedEvents) return;
    setCardRefs(renderedEvents?.map(() => createRef()));
    setActiveId(renderedEvents[renderedEvents.length - 1]?.eventId);
  }, [renderedEvents]);

  const reshuffleCards = async () => {
    await clearSeen();
  };

  const [loggedOutEvents, setLoggedOutEvents] = useState();

  useEffect(() => {
    setLoggedOutEvents(
      renderedEvents?.slice(Math.max(renderedEvents.length - 3, 0))
    );
  }, [renderedEvents]);

  // useEffect(() => {
  //   console.log(`renderedEvents`, renderedEvents);
  // }, [renderedEvents]);

  // useEffect(() => {
  //   console.log("filteredEvents", filteredEvents);
  // }, [filteredEvents]);

  useEffect(()=> {
    console.log(`eventsWithoutSeen`, eventsWithoutSeen)
  }, [eventsWithoutSeen])

  return (
    <div style={{ overflow: "hidden", position: "relative" }}>
      <div className={styles.container}>
        {showCountryError && (
          <div className={styles.wrongCountry__container} id="countryError">
            <div className={styles.wrongCountry__content}>
              <p>
                <strong>Woops!</strong> Looks like you're trying to access from{" "}
                {country} but fomo is currently only available in Iceland. Your
                location will automatically be set to Downtown Reykjavík,
                Iceland.
              </p>
              <p>
                If you want us in your hometown, contact us at
                alexander@pippen.is
              </p>
              <button onClick={(e) => setShowCountryError(false)}>
                Continue
              </button>
            </div>
          </div>
        )}

        <div className={styles.cards__container}>
          {/* DISPLAY ERROR IF LOCATION IS DISABLED */}
          {userLocation?.code ? (
            <div style={{ maxWidth: "200px", textAlign: "center" }}>
              <h2> 📍 Location disabled</h2>
              <p>
                Please enable your browsers or device location services to view
                events around you.
              </p>
            </div>
          ) : (
            <>
              {/* IF USER LOCATION IS UNDEFINED, SHOW SEARCH ANIMATION */}
              {!userLocation && (
                <div className={styles.pulse}>
                  <FaSearchLocation size="2em" />
                  <p style={{ marginTop: "5px" }}>finding events</p>
                  <p>near you..</p>
                </div>
              )}

              {/* IF USER IS LOGGED IN & HAS SWIPED ALL CARDS */}
              {userLocation && fire.auth().currentUser && eventsWithoutSeen ? (
                <div className={styles.noCards__container}>
                  <p>
                    No more events in your area.. change your filter or swipe
                    again
                  </p>
                  <button onClick={async () => await reshuffleCards()}>
                    Reshuffle cards
                  </button>
                </div>
              ) : null}

              {/* IF USER IS NOT LOGGED IN AND HAS SWIPED ALL CARDS */}
              {userLocation &&
              !fire.auth().currentUser &&
              loggedOutEvents?.length > 0 ? (
                <div className={styles.noCards__container}>
                  <p>
                    Sign in with Google or Facebook to discover more events
                    around you!
                  </p>
                  <button>
                    <a href="/signup">Sign in</a>
                  </button>
                </div>
              ) : null}

              {fire.auth().currentUser && userLocation ? (
                <>
                  <>
                    {/* RENDER CARDS */}
                    {renderedEvents?.map((card, index) => {
                      return (
                        <>
                          <TinderCard
                            className={cx({ [styles.swipe]: true })}
                            key={card.eventId}
                            ref={cardRefs[index]}
                            preventSwipe={["up", "down"]}
                            onCardLeftScreen={() => {}}
                            onSwipe={async (dir) =>
                              handleSwipe(dir, index, card.eventId)
                            }
                            onClick={() => {
                              router.push(`/events/${card.eventId}`);
                            }}
                          >
                            <div
                              id={`card-${index}`}
                              data-id={card.eventId}
                              className={cx({ [styles.card]: true })}
                            >
                              <div
                                className={styles.card__front}
                                style={{
                                  backgroundImage: `linear-gradient( rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2) ), url(${card.image})`,
                                }}
                              >
                                <img
                                  src="heart_fill.svg"
                                  id={`animate-${card.eventId}`}
                                  className="cardAnimate"
                                  style={{
                                    display: "none",
                                    position: "absolute",
                                    top: "20%",
                                    left: "30%",
                                    marginLeft: "-2rem",
                                    width: "250px",
                                    opacity: "0.8",
                                  }}
                                />

                                <div className={styles.gradient}></div>
                                <h3>{card.title}</h3>

                                <div className={styles.location__container}>
                                  <img src="/location_pin.svg" alt="" />
                                  <p>
                                    {card.location.name.length > 30
                                      ? `${card.location?.name.substring(
                                          0,
                                          30
                                        )}..`
                                      : card.location.name}
                                  </p>
                                </div>
                                <p className={styles.card__distance}>
                                  {Math.round(card.distance * 100) / 100} km
                                  away
                                </p>

                                <div className={styles.date__container}>
                                  <img src="/date.svg" alt="" />
                                  <p>
                                    {new Date(card.date)
                                      .toDateString()
                                      .substr(
                                        0,
                                        new Date(card.date).toDateString()
                                          .length - 5
                                      )}
                                    , {card.time}
                                  </p>
                                </div>
                                <div className={styles.categories__container}>
                                  {card.categories.map((category) => (
                                    <p key={category}>{category}</p>
                                  ))}
                                </div>
                                {userData?.interested?.includes(
                                  card.eventId
                                ) ? (
                                  <div>
                                    <img
                                      className={styles.card__heart}
                                      src="/heart_fill.svg"
                                      alt=""
                                    />
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          </TinderCard>
                        </>
                      );
                    })}
                  </>
                </>
              ) : (
                <>
                  {/* RENDER 3 CARDS IF USER IS NOT LOGGED IN */}
                  {userLocation && (
                    <>
                      {loggedOutEvents?.map((card, index) => (
                        <TinderCard
                          className={cx(
                            { [styles.swipe]: true }
                            // { [styles.animateOut]: showAnimation }
                          )}
                          key={card.eventId}
                          ref={cardRefs[index]}
                          preventSwipe={["up", "down"]}
                          onSwipe={(dir) => handleSwipe(dir, index)}
                          onClick={() => {
                            router.push(`/events/${card.eventId}`);
                          }}
                        >
                          <div
                            id={`card-${index}`}
                            className={cx({ [styles.card]: true })}
                          >
                            <div
                              className={styles.card__front}
                              style={{
                                backgroundImage: `linear-gradient( rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2) ), url(${card.image})`,
                              }}
                            >
                              <img
                                src="heart_fill.svg"
                                id={`animate-${index}`}
                                className="cardAnimate"
                                style={{
                                  display: "none",
                                  position: "absolute",
                                  top: "20%",
                                  left: "30%",
                                  marginLeft: "-2rem",
                                  width: "250px",
                                  opacity: "0.8",
                                }}
                              />

                              <div className={styles.gradient}></div>
                              <h3>{card.title}</h3>
                              <div className={styles.location__container}>
                                <img src="/location_pin.svg" alt="" />
                                <p>
                                  {card.location.name.length > 30
                                    ? `${card.location?.name.substring(
                                        0,
                                        30
                                      )}..`
                                    : card.location.name}
                                </p>
                              </div>
                              <p className={styles.card__distance}>
                                {Math.round(card.distance * 100) / 100} km away
                              </p>
                              <div className={styles.date__container}>
                                <img src="/date.svg" alt="" />
                                <p>
                                  {new Date(card.date)
                                    .toDateString()
                                    .substr(
                                      0,
                                      new Date(card.date).toDateString()
                                        .length - 5
                                    )}
                                  , {card.time}
                                </p>
                              </div>
                              <div className={styles.categories__container}>
                                {card.categories.map((category) => (
                                  <p key={category}>{category}</p>
                                ))}
                              </div>

                              <div className={styles.date__container}>
                                <img src="/date.svg" alt="" />
                                <p>
                                  {new Date(card.date)
                                    .toDateString()
                                    .substr(
                                      0,
                                      new Date(card.date).toDateString()
                                        .length - 5
                                    )}
                                </p>
                              </div>
                            </div>
                          </div>
                        </TinderCard>
                      ))}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </div>
        {/* SHOW BUTTONS WHEN USER LOCATION IS FOUND */}
        {userLocation?.latitude ? (
          <Buttons
            handleLike={() => handleLike(activeCardIndex)}
            showAnimation={showAnimation}
            activeCardIndex={activeCardIndex}
            setActiveCardIndex={setActiveCardIndex}
            renderedEvents={renderedEvents}
            id={activeId}
          />
        ) : null}
      </div>
    </div>
  );
}

export default EventCards;
