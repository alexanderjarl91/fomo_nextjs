import React, { useState, useContext } from "react";
import TinderCard from "react-tinder-card";
import styles from "../styles/EventCards.module.css";

import { DataContext } from "../context";
import { useRouter } from "next/router";

function EventCards() {
  const router = useRouter();
  const { activeCardIndex, setActiveCardIndex, cards } =
    useContext(DataContext);

  //when card is swiped, set active card index to the next one
  const handleSwipe = (dir, index) => {
    setActiveCardIndex(index - 1);
  };

  //go to event dynamic page
  const goToEvent = () => {
    console.log(cards[activeCardIndex].eventId);
    console.log("routing to event..");
    router.push(`/events/${cards[activeCardIndex].eventId}`);
  };

  return (
    <div>
      <div className={styles.cards__container}>
        {activeCardIndex < 0 ? (
          <div className={styles.noCards__container}>
            <p>
              No more events in your area.. change your filter or swipe again
            </p>
            <button>
              <a href="/">Reshuffle cards</a>
            </button>
          </div>
        ) : null}
        {cards.map((card, index) => (
          <TinderCard
            className={`test ${styles.swipe}`}
            key={card.title}
            preventSwipe={["up", "down"]}
            onSwipe={(dir) => handleSwipe(dir, index)}
          >
            <div onClick={goToEvent} className={styles.card}>
              {/* FRONTSIDE */}
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
                  <p>{card.location}</p>
                </div>
                <div className={styles.date__container}>
                  <img src="/date.svg" alt="" />
                  <p>{card.date}</p>
                </div>
              </div>
            </div>
          </TinderCard>
        ))}
      </div>
    </div>
  );
}

export default EventCards;
