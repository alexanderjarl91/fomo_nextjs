import React, { useState, useEffect, useContext } from "react";
import fire from "../firebase";
import styles from "../styles/Interested.module.css";
import { UsersContext, DataContext } from "../context";

//components
import Navbar from "../components/Navbar";
import Menu from "../components/Menu";

export default function interested() {
  //context data
  const { userData, showMenu, setShowMenu } = useContext(UsersContext);

  //states
  const [cards, setCards] = useState([]);

  //get users interested array and set to cards state
  useEffect(() => {
    if (!userData) return;
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
        tempCards.push(doc.data());
      });
    });
    return tempCards;
  };

  return (
    <div className={styles.interested__container}>
      {/* NAVBAR & MENU */}
      {showMenu ? <Menu showMenu={showMenu} setShowMenu={setShowMenu} /> : null}
      <Navbar />

      {/* PAGE CONTENT */}
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
