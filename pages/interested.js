import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import fire from "../firebase";
import styles from "../styles/Interested.module.css";

export default function interested() {
  const [cards, setCards] = useState([]);

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
      setCards(tempCards);
    };
    getCards();
  }, []);

  return (
    <div>
      <Navbar />
      <h3>interested</h3>

      <div className={styles.cards}>
      {cards.map((card) => ( 
        <div className={styles.card} key={card.title} style={{background: `linear-gradient( rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7) ), url(${card.image})`}}>
          <h1>{card.title}</h1>
          <div className={styles.info__container}>
            <div>
              <img src="/location_pin.svg" alt="" />
              <p>{card.location}</p>
            </div>
            <div>
              <img src="/date.svg" alt="" />
              <p>{card.date}</p>
            </div>
          </div>
        </div>
        ))}
      </div>
    </div>
  );
}
