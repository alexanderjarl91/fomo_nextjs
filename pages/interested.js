import React, { useState, useEffect, useContext } from "react";
import Link from "next/link";

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

  const getEvents = async () => {
    if (!fire.auth().currentUser) return;

    // GET INTERESTED EVENT ID ARRAY FROM FIRESTORE
    const userRef = await fire
      .firestore()
      .collection("users")
      .doc(fire.auth().currentUser.email);
    const doc = await userRef.get();
    const interestedEventIds = doc.data().interested;

    // FIND MATCHING EVENT ID IN EVENTS COLLECTION
    let tempCards = [];
    interestedEventIds.forEach(async (id) => {
      const eventsRef = await fire.firestore().collection("events");
      const snapshot = await eventsRef.where("eventId", "==", id).get();

      snapshot.forEach((doc) => {
        tempCards = [...tempCards, doc.data()];
      });
      setCards(tempCards);
    });
  };

  useEffect(() => {
    getEvents();
  }, [fire.auth().currentUser]);

  //get users interested array and set to cards state
  useEffect(() => {
    if (!userData) return;
    setCards(getInterestedEvents());
  }, [userData]);

  const getInterestedEvents = () => {
    let tempCards = userData.interested;
    userData.interested?.forEach(async (item) => {
      const eventsRef = fire.firestore().collection("events");
      const snapshot = await eventsRef.where("eventId", "==", item).get();
      snapshot.forEach((doc) => {
        tempCards.push(doc.data());
      });
    });
    return tempCards;
  };

  // useEffect(() => {
  //   console.log(cards, "cards");
  // }, [cards]);

  useEffect(() => {
    console.log("showMenu state:", showMenu);
  }, [showMenu]);

  return (
    <div className={styles.interested__container}>
      {/* PAGE CONTENT */}
      <div className={styles.cards}>
        <h3>interested</h3>
        {cards ? (
          <>
            {cards.map((card) => (
              <Link href={`events/${card.eventId}`}>
                <div
                  className={styles.card}
                  key={card.eventId}
                  style={{
                    background: `linear-gradient( rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7) ), url(${card.image})`,
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
              </Link>
            ))}
          </>
        ) : null}
      </div>
    </div>
  );
}
