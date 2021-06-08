import React, { useState, useContext, createRef, useEffect } from "react";
// import TinderCard from "react-tinder-card";
import TinderCard from "../components/TinderCard";
import styles from "../styles/EventCards.module.css";
import fire from "../firebase";
import { DataContext } from "../context";
import { useRouter } from "next/router";
import Buttons from "./Buttons";
import { set } from "date-fns";
import cx from "../utils/cx";

function EventCards() {
  const router = useRouter();
  const { activeCardIndex, setActiveCardIndex, cards, filteredEvents } =
    useContext(DataContext);

  const [cardRefs, setCardRefs] = useState([]);
  const [showAnimation, setShowAnimation] = useState(false);

  //create an array of references for each event card whenever filteredEvents array updates
  useEffect(() => {
    if (!filteredEvents) return;
    setCardRefs(filteredEvents?.map(() => createRef(null)));
  }, [filteredEvents]);

  //handle function when like button is clicked
  const handleLike = () => {
    console.log("current ref", cardRefs[activeCardIndex].current);
    cardRefs[activeCardIndex].current.swipe("down");
    setShowAnimation(!showAnimation);
  };

  //when card is swiped, set active card index to the next one
  const handleSwipe = (dir, index) => {
    setActiveCardIndex(index - 1);
  };
  //go to event dynamic page
  const goToEvent = (cardIndex) => {
    router.push(`/events/${cards[cardIndex].eventId}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.cards__container}>
        {activeCardIndex < 0 && fire.auth().currentUser ? (
          <div className={styles.noCards__container}>
            <p>
              No more events in your area.. change your filter or swipe again
            </p>
            <button>
              <a href="/">Reshuffle cards</a>
            </button>
          </div>
        ) : null}

        {activeCardIndex < 0 && !fire.auth().currentUser ? (
          <div className={styles.noCards__container}>
            <p>
              Sign in with Google or Facebook to see discover more events around
              you!
            </p>
            <button>
              <a href="/">Sign in</a>
            </button>
          </div>
        ) : null}

        {fire.auth().currentUser ? (
          <>
            <>
              {/* RENDER CARDS */}
              {filteredEvents?.map((card, index) => (
                <TinderCard
                  className={cx(
                    { [styles.swipe]: true },
                    { [styles.animateOut]: showAnimation }
                  )}
                  key={card.title}
                  ref={cardRefs[index]}
                  preventSwipe={["up", "down"]}
                  onSwipe={(dir) => handleSwipe(dir, index)}
                  onClick={() => goToEvent(index)}
                >
                  <div
                    className={cx(
                      { [styles.card]: true }
                      // { [styles.redBorder]: showAnimation }
                    )}
                  >
                    <div
                      className={styles.card__front}
                      style={{
                        backgroundImage: `linear-gradient( rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2) ), url(${card.image})`,
                      }}
                    >
                      <div className={styles.gradient}></div>
                      <h3>{card.title}</h3>
                      <div className={styles.location__container}>
                        <img src="/location_pin.svg" alt="" />
                        <p>{card.location?.name}</p>
                      </div>
                      <div className={styles.date__container}>
                        <img src="/date.svg" alt="" />
                        <p>{card.date}</p>
                      </div>
                    </div>
                  </div>
                </TinderCard>
              ))}
            </>
          </>
        ) : (
          <>
            {/* RENDER 3 CARDS IF USER IS NOT LOGGED IN */}
            {filteredEvents?.slice(0, 3).map((card, index) => (
              <TinderCard
                className={`test ${styles.swipe}`}
                key={index}
                preventSwipe={["up", "down"]}
                onSwipe={(dir) => handleSwipe(dir, index)}
                onClick={() => goToEvent(index)}
              >
                <div className={styles.card}>
                  <div
                    className={styles.card__front}
                    style={{
                      backgroundImage: `linear-gradient( rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2) ), url(${card.image})`,
                    }}
                  >
                    <div className={styles.gradient}></div>
                    <h3>{card.title}</h3>
                    <div className={styles.location__container}>
                      <img src="/location_pin.svg" alt="" />
                      <p>{card.location.name}</p>
                    </div>
                    <div className={styles.date__container}>
                      <img src="/date.svg" alt="" />
                      <p>{card.date}</p>
                    </div>
                  </div>
                </div>
              </TinderCard>
            ))}
          </>
        )}
      </div>
      <Buttons handleLike={handleLike} />
    </div>
  );
}

export default EventCards;
