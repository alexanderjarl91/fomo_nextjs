import React, { useState, useEffect, useContext } from "react";

import fire from "../firebase";
import styles from "../styles/MyEvents.module.css";
import { UsersContext, DataContext } from "../context";

import Navbar from "../components/Navbar";
export default function myEvents() {
  // context data
  const { userData } = useContext(UsersContext);

  const [events, setEvents] = useState([]);

  const getEvents = async () => {
    if (!fire.auth().currentUser) return;

    // GET INTERESTED EVENT ID ARRAY FROM FIRESTORE
    const userRef = await fire
      .firestore()
      .collection("users")
      .doc(fire.auth().currentUser.email);
    const doc = await userRef.get();
    const myEventIds = doc.data().events;

    // FIND MATCHING EVENT ID IN EVENTS COLLECTION
    let tempCards = [];
    myEventIds.forEach(async (id) => {
      const eventsRef = await fire.firestore().collection("events");
      const snapshot = await eventsRef.where("eventId", "==", id).get();
      snapshot.forEach((doc) => {
        tempCards = [...tempCards, doc.data()];
      });
      setEvents(tempCards);
    });
  };

  useEffect(() => {
    if (!fire.auth().currentUser) return;
    getEvents();
  }, [userData]);

  return (
    <div
      className={styles.body}
      style={{
        overflowY: "scroll",
        zIndex: "-10",
        marginTop: "6rem",
      }}
    >
      <div className={styles.container}>
        <h2 className={styles.headline}>My events</h2>
        <p>Review and manage your events</p>
        {events.reverse().map((event) => (
          <div className={styles.event__container} key={event.eventId}>
            <div>
              <h1>{event.title}</h1>
              <p>duration: x days</p>
            </div>

            <p>Live from x. may until y. may</p>

            <hr className={styles.line} />
            <div className={styles.bottom}>
              <p>FREE OF CHARGE (beta)</p>
              {event.status == "pending" && (
                <span className={styles.pending}>PENDING</span>
              )}
              {event.status == "approved" && (
                <span className={styles.active}>APPROVED</span>
              )}
              {event.status == "declined" && (
                <span className={styles.declined}>DECLINED</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
