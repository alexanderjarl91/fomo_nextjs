import React, { useState, useContext, createRef, useEffect } from "react";
import TinderCard from "../components/TinderCard";
import styles from "../styles/EventCards.module.css";
import fire from "../firebase";
import { DataContext } from "../context";
import { useRouter } from "next/router";
import Buttons from "./Buttons";
import cx from "../utils/cx";
import { FaSearchLocation } from "react-icons/fa";

function EventCards() {
  const router = useRouter();
  const {
    getEvents,
    filteredEvents,
    futureEventsWithDistance,
    userLocation,
    setUserLocation,
    clearSeen,
    userData,
    refreshData,
    maxDistance,
  } = useContext(DataContext);
  const [renderedEvents, setRenderedEvents] = useState();
  const [cardRefs, setCardRefs] = useState([]);
  const [showAnimation, setShowAnimation] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState();
  useEffect(() => {
    console.log(renderedEvents, "renderedEvents");
  }, [renderedEvents]);

  //get events on mount
  useEffect(() => {
    getEvents();
  }, []);

  const removeSeen = (array) => {
    console.log("REMOVING SEEN");
    if (!userData) return;
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
    if (fire.auth().currentUser && futureEventsWithDistance) {
      const eventsWithoutSeen = removeSeen(futureEventsWithDistance);
      setActiveCardIndex(eventsWithoutSeen?.length - 1);
      setRenderedEvents(eventsWithoutSeen);
      return;
    }
    setRenderedEvents(futureEventsWithDistance);
  }, [futureEventsWithDistance]);

  // get user location function
  const getUserLocation = () => {
    //check if location is available in users browser
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation(position.coords);
          console.log("nav geo", navigator.geolocation);
        },
        (err) => setUserLocation(err),
        { maximumAge: 60000, timeout: 5000, enableHighAccuracy: true }
      );
    } else {
      console.log("Geolocation Not Available in browser");
    }
  };

  //get user location on mount
  useEffect(() => {
    getUserLocation();
  }, []);

  //handle function when like button is clicked
  const handleLike = (index) => {
    cardRefs[index].current.swipe("right");
  };

  //handle swipe
  const handleSwipe = async (dir, index) => {
    console.log("index from swipe", index);
    const currentEventId = filteredEvents[index].eventId;

    //set card to seen
    const saveToSeen = async () => {
      if (!fire.auth().currentUser) return;

      console.log("saving to seen...");
      //get swiped cards event

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
      const cardNotification = document.getElementById(`animate-${index}`);
      cardNotifications.forEach((item) => (item.style.display = "none"));
      cardNotification.style.display = "block";
      const activeCard = renderedEvents[index];
      await saveToInterested(activeCard);
    }
    setActiveCardIndex(activeCardIndex - 1);

    fire.analytics().logEvent("swipe");
  };

  const saveToInterested = async (activeCard) => {
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
    if (!doc.exists) return;
    //if doc had an interested array, save a temp version of it
    if (doc.data().interested) {
      tempInterested = doc.data().interested;
    }
    // // cancel if item is already
    if (tempInterested.includes(activeCard.eventId)) return;
    // push activeCards eventId to temporary interested array
    tempInterested.push(activeCard.eventId);
    // save new interested array to firestore
    userRef.update({ interested: tempInterested });
  };

  //create an array of references for each event card whenever filteredEvents array updates
  useEffect(() => {
    if (!renderedEvents) return;
    setCardRefs(renderedEvents?.map(() => createRef()));
  }, [renderedEvents]);

  //go to event dynamic page
  const goToEvent = (index) => {
    if (fire.auth().currentUser) {
      const activeCard = renderedEvents[index];
      router.push(`/events/${activeCard.eventId}`);
    } else {
      const activeCard = loggedOutEvents[index];
      router.push(`/events/${activeCard.eventId}`);
    }
  };

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
  //   console.log("LOGGED OUT EVENTS: ", loggedOutEvents);
  // }, [loggedOutEvents]);

  return (
    <div style={{ overflow: "hidden", position: "relative" }}>
      <div className={styles.container}>
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
              {userLocation &&
              fire.auth().currentUser &&
              renderedEvents?.length === 0 ? (
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
                    {renderedEvents?.map((card, index) => (
                      <TinderCard
                        className={cx({ [styles.swipe]: true })}
                        key={index}
                        ref={cardRefs[index]}
                        preventSwipe={["up", "down"]}
                        onSwipe={(dir) => handleSwipe(dir, index)}
                        onClick={() => {
                          goToEvent(index);
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
                                  ? `${card.location?.name.substring(0, 30)}..`
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
                                    new Date(card.date).toDateString().length -
                                      5
                                  )}
                                , {card.time}
                              </p>
                            </div>
                            <div className={styles.categories__container}>
                              {card.categories.map((category) => (
                                <p>{category}</p>
                              ))}
                            </div>

                            {userData?.interested?.includes(card.eventId) ? (
                              <img
                                className={styles.card__heart}
                                src="/heart_fill.svg"
                                alt=""
                              />
                            ) : null}
                          </div>
                        </div>
                      </TinderCard>
                    ))}
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
                          key={index}
                          ref={cardRefs[index]}
                          preventSwipe={["up", "down"]}
                          onSwipe={(dir) => handleSwipe(dir, index)}
                          onClick={() => goToEvent(index)}
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
          />
        ) : null}
      </div>
    </div>
  );
}

export default EventCards;
