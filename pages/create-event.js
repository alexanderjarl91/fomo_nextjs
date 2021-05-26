import React, { useContext, useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { UsersContext } from "../context";
import { useRouter } from "next/router";
import fire from "../firebase";
import styles from "../styles/CreateEvent.module.css";
import { v4 as uuidv4 } from "uuid";

export default function createEvent() {
  const router = useRouter();
  const [event, setEvent] = useState({});

  const date = new Date();

  console.log(date);

  const postEvent = () => {
    //add userId to event
    const tempEvent = event;
    tempEvent.uid = fire.auth().currentUser.uid;
    tempEvent.eventId = uuidv4();
    setEvent(tempEvent);
    // post event to firestore events collection
    fire
      .firestore()
      .collection("events")
      .doc(event.title)
      .set(event)
      .then(() => {
        router.push("/");
        saveToMyEvents();
      });
  };

  //post event to users own event collection
  const saveToMyEvents = async () => {
    //get authenticated user
    const userRef = await fire
      .firestore()
      .collection("users")
      .doc(fire.auth().currentUser.email);

    //get auth users data
    const doc = await userRef.get();
    let tempEvents = [];
    if (!doc.exists) return;

    //create a copy of users events array
    if (doc.data().events) {
      tempEvents = doc.data().events;
    }

    //push new events ID to copy of array
    tempEvents.push(event.eventId);
    //post new array to database
    userRef.update({ events: tempEvents });
  };

  return (
    <div className={styles.createEvent__container}>
      <Navbar />
      <div>
        <h2>Create Event</h2>
        <h3>Event details</h3>
        <p>
          Lets build your ad, fill in the details below for a preview of your
          event.
        </p>
      </div>

      <div className={styles.event__form}>
        <div>
          <label htmlFor="">Event title</label>
          <input
            type="text"
            name=""
            id=""
            placeholder="Whats your event called?"
            onChange={(e) => {
              const tempEvent = event;
              tempEvent.title = e.target.value;
              setEvent(tempEvent);
            }}
          />
        </div>

        <div>
          <label htmlFor="">Promoter</label>
          <input
            type="text"
            name=""
            id=""
            placeholder="Who's planning this event?"
            onChange={(e) => {
              const tempEvent = event;
              tempEvent.promoter = e.target.value;
              setEvent(tempEvent);
            }}
          />
        </div>

        <div>
          <label htmlFor="">Location</label>
          <input
            type="text"
            name=""
            id=""
            placeholder="Where is your event?"
            onChange={(e) => {
              const tempEvent = event;
              tempEvent.location = e.target.value;
              setEvent(tempEvent);
            }}
          />
        </div>

        <div>
          <label htmlFor="">Date</label>
          <input
            type="text"
            name=""
            id=""
            placeholder="When does your event take place?"
            onChange={(e) => {
              const tempEvent = event;
              tempEvent.date = e.target.value;
              setEvent(tempEvent);
            }}
          />
        </div>

        <div>
          <label htmlFor="">Time*</label>
          <input
            type="text"
            name=""
            id=""
            placeholder="At what time?"
            onChange={(e) => {
              const tempEvent = event;
              tempEvent.time = e.target.value;
              setEvent(tempEvent);
            }}
          />
        </div>

        <div>
          <label htmlFor="">Price</label>
          <input
            type="number"
            name=""
            id=""
            placeholder="Where is your event? (if it applies)"
            onChange={(e) => {
              const tempEvent = event;
              tempEvent.price = e.target.value;

              if (tempEvent > 0) {
                setEvent(tempEvent);
              }
            }}
          />
        </div>

        <div>
          <label htmlFor="">Action button text</label>
          <input
            type="text"
            name=""
            id=""
            placeholder="What should your action button say?"
            onChange={(e) => {
              const tempEvent = event;
              tempEvent.actionButton = e.target.value;
              setEvent(tempEvent);
            }}
          />
        </div>

        <div>
          <label htmlFor="">Image</label>
          <input
            type="text"
            name=""
            id=""
            placeholder="A link to your image.."
            onChange={(e) => {
              const tempEvent = event;
              tempEvent.image = e.target.value;
              setEvent(tempEvent);
            }}
          />
        </div>
      </div>

      <p>
        {" "}
        note: events are not published until they have been accepted by an admin
      </p>
      <button
        className={styles.post__button}
        onClick={() => {
          postEvent();
        }}
      >
        POST EVENT
      </button>
    </div>
  );
}
