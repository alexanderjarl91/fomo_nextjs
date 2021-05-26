import React, { useState, useEffect, useContext } from "react";
import Navbar from "../components/Navbar";
import fire from "../firebase";
import styles from "../styles/Interested.module.css";
import { UsersContext, DataContext } from "../context";
export default function interested() {
  const { userData } = useContext(UsersContext);
  const [cards, setCards] = useState([]);

  //get users interested array and set to cards state
  useEffect(() => {
    if (!userData) return;
    console.log("test1");
    console.log(userData, "userdata");
    setCards(getInterestedEvents());
  }, [userData]);

  useEffect(() => {
    console.log(cards, "cards");
  }, [cards]);

  const getInterestedEvents = () => {
    let tempCards = [];
    userData.interested?.forEach(async (item) => {
      const eventsRef = fire.firestore().collection("events");
      const snapshot = await eventsRef.where("eventId", "==", item).get();

      snapshot.forEach((doc) => {
        // let tempCards = [...cards, doc.data()]
        tempCards.push(doc.data());
        // console.log(tempCards,'tempCards')
      });
    });

    return tempCards;
  };
  return (
    <div className={styles.interested__container}>
      <Navbar />
      <div className={styles.cards}>
        <h3>interested</h3>
        {cards ? (
          <>
            {cards.map((card) => (
              <div
                className={styles.card}
                key={card.title}
                style={{
                  background: `linear-gradient( rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7) ), url(${card.image})`,
                }}
                onClick={() => {
                  openCard();
                }}
              >
                <div className={styles.closed__content}>
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
              </div>
            ))}
          </>
        ) : null}
      </div>
    </div>
  );
}
