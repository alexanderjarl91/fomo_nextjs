import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import fire from "../../firebase";
import styles from "../../styles/Event.module.css";

//components
import Navbar from "../../components/Navbar";

export default function Event() {
  const router = useRouter();
  const [event, setEvent] = useState();

  // get the data when component mounts
  useEffect(() => {
    matchEventWithQuery();
  }, []);

  // get clicked event data
  const matchEventWithQuery = async () => {
    const eventsRef = fire.firestore().collection("events");
    const queryRef = eventsRef.where("eventId", "==", `${router.query.event}`);
    const foundEvent = await queryRef.get();
    foundEvent.forEach((doc) => setEvent(doc.data()));
  };

  return (
    <>
      {event && (
        <div
          styles={{
            backgroundImage: `linear-gradient( rgba(0, 0, 0, 0.5), url(${event.image})`,
            backgroundColor: "white",
          }}
        >
          <Navbar />

          {event && <h1>{event.promoter}</h1>}
        </div>
      )}
    </>
  );
}
