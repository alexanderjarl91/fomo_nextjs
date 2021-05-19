import React, { useState, useEffect, useMemo } from "react";
import TinderCard from "react-tinder-card";
import styles from "../styles/EventCards.module.css";
import fire from "../firebase";

function EventCards() {
  const [cards, setCards] = useState([]);
  const [activeCard, setActiveCard] = useState(0);

  useEffect(() => {
    // fetch event data, shuffle them and set to state
    const getCards = async () => {
      const cardsRef = fire.firestore().collection("events");
      const snapshot = await cardsRef.get();
      let tempCards = [];
      await snapshot.forEach((doc) => {
        tempCards = [...tempCards, doc.data()];
      });
      // set cards
      shuffleArray(tempCards);
      setCards(tempCards);
      setActiveCard(tempCards.length - 1);
    };
    getCards();
  }, []);

// callback to log the active cards index
  useEffect(() => {
    console.log("current active card index:", activeCard);
  }, [activeCard]);

  // randomize order of array
  const shuffleArray = (array) => {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  };

  const handleSwipe = () => {
    setActiveCard(() => {
      return activeCard - 1});
  };


  return (
    <div>
      <div className={styles.cards__container}>
        <div className={styles.noCards__container}>
          <p>No more events in your area.. change your filter or swipe again</p>
          <button>Reshuffle cards</button>
        </div>
        {cards.map((card) => (
          <TinderCard
            className={styles.swipe}
            key={card.title}
            preventSwipe={["up", "down"]}
            onSwipe={ handleSwipe }
            onCardLeftScreen={handleSwipe}

          >
            <div
              className={styles.card}
              style={{
                backgroundImage: `linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url(${card.image})`,
              }}
            >
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
          </TinderCard>
        ))}
      </div>
    <h1 onClick={()=>{
      console.log(activeCard)
    }}>ACTIVE CARD</h1>
    </div>
  );
}

export default EventCards;
