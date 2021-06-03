import React, { useState, useEffect, useContext } from "react";

import fire from "../firebase";
import styles from "../styles/MyEvents.module.css";
import { UsersContext, DataContext } from "../context";

import Navbar from "../components/Navbar";
export default function myEvents() {
  // context data
  const { userData, showMenu, setShowMenu } = useContext(UsersContext);

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
    <div className={styles.container}>
      <h2>Your events</h2>
      <h3>Total events: x</h3>

      {events.map((event) => (
        <div className={styles.event__container} key={event.eventId}>
          <div>
            <p>Event</p>
            <p>duration: x days</p>
          </div>

          <h1>{event.title}</h1>
          <p>Live from x. may until x. may</p>
          <p># of interested: XX</p>
          <hr className={styles.line} />
          <div>
            <p>2990 ISK</p>
            {event.status == "pending" && (
              <span className={styles.pending}>PENDING</span>
            )}
            {event.status == "active" && (
              <span className={styles.active}>ACTIVE</span>
            )}
            {event.status == "passed" && (
              <span className={styles.passed}>PASSED</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
