import React, { useState, useContext, createRef, useEffect } from "react";
// import TinderCard from "react-tinder-card";
import TinderCard from "../components/TinderCard";
import styles from "../styles/EventCards.module.css";
import fire from "../firebase";
import { UsersContext, DataContext } from "../context";
import { useRouter } from "next/router";
import Buttons from "./Buttons";
import cx from "../utils/cx";
import { MdLocationSearching } from "react-icons/md";
import { FaSearchLocation } from "react-icons/fa";

function EventCards() {
  const router = useRouter();
  const {
    getCards,
    activeCardIndex,
    setActiveCardIndex,
    filteredEvents,
    userLocation,
    setUserLocation,
    setFilteredEvents,
  } = useContext(DataContext);
  const { userData } = useContext(UsersContext);
  const [cardRefs, setCardRefs] = useState([]);
  const [showAnimation, setShowAnimation] = useState(false);

  //get events & user location on mount
  useEffect(() => {
    getCards();
    getUserLocation();
  }, []);

  //sort events by date everytime event array changes
  useEffect(() => {
    filteredEvents?.sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    });
  }, [filteredEvents]);

  // get user location function
  const getUserLocation = () => {
    //check if location is available in users browser
    if ("geolocation" in navigator) {
      console.log("Available");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(position);
          setUserLocation(position.coords);
        },
        (err) => setUserLocation(err),
        { maximumAge: 60000, timeout: 5000, enableHighAccuracy: true }
      );
    } else {
      console.log("Geolocation Not Available in browser");
    }
  };

  //handle function when like button is clicked
  const handleLike = () => {
    //throw card to the right
    cardRefs[activeCardIndex].current.swipe("right");
  };

  //handle swipe
  const handleSwipe = async (dir, index) => {
    setActiveCardIndex(index - 1);
    //save event if swiped right
    if (dir == "right") {
      console.log("active", index);
      //animate
      const cardNotifications = document.querySelectorAll(".cardAnimate");
      const cardNotification = document.getElementById(`animate-${index}`);
      cardNotifications.forEach((item) => (item.style.display = "none"));
      cardNotification.style.display = "block";
      const activeCard = filteredEvents[index];

      await saveToInterested(activeCard);
    }
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
    console.log("event saved to interested:", activeCard);
  };

  //create an array of references for each event card whenever filteredEvents array updates
  useEffect(() => {
    if (!filteredEvents) return;
    setCardRefs(filteredEvents?.map(() => createRef(null)));
  }, [filteredEvents]);

  //go to event dynamic page
  const goToEvent = (cardIndex) => {
    console.log(`cardIndex`, cardIndex);
    console.log(filteredEvents[cardIndex]);
    router.push(`/events/${filteredEvents[cardIndex].eventId}`);
    // router.push(`/events/${cards[cardIndex].eventId}`);
  };

  useEffect(() => {
    console.log("permissions", navigator.permissions);
  }, []);

  
  return (
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
            {activeCardIndex < 0 && fire.auth().currentUser ? (
              <div className={styles.noCards__container}>
                <p>
                  No more events in your area.. change your filter or swipe
                  again
                </p>
                <button>
                  <a
                    onClick={() => {
                      getCards();
                    }}
                  >
                    Reshuffle cards
                  </a>
                </button>
              </div>
            ) : null}

            {/* IF USER IS NOT LOGGED IN AND HAS SWIPED ALL CARDS */}
            {activeCardIndex < 0 && !fire.auth().currentUser ? (
              <div className={styles.noCards__container}>
                <p>
                  Sign in with Google or Facebook to discover more events around
                  you!
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
                  {filteredEvents?.map((card, index) => (
                    <TinderCard
                      className={cx(
                        { [styles.swipe]: true }
                        // { [styles.animateOut]: showAnimation }
                      )}
                      key={card.title}
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
                            <p>{card.location?.name}</p>
                          </div>
                         
                          <div className={styles.date__container}>
                            <img src="/date.svg" alt="" />
                            <p>
                              {new Date(card.date)
                                .toDateString()
                                .substr(
                                  0,
                                  new Date(card.date).toDateString().length - 5
                                )}
                            </p>
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
                    {filteredEvents?.slice(0, 3).map((card, index) => (
                      <TinderCard
                        className={cx(
                          { [styles.swipe]: true }
                          // { [styles.animateOut]: showAnimation }
                        )}
                        key={card.title}
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
                              <p>{card.location?.name}</p>
                            </div>
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
                              </p>
                              <p>300m away</p>
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
        <Buttons handleLike={handleLike} showAnimation={showAnimation} />
      ) : null}
    </div>
  );
}

export default EventCards;
