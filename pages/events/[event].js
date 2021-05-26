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
  }, [router.query]);

  useEffect(() => {
    console.log(`event`, event);
  }, [event]);

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
          style={{ margin: "0", padding: 0 }}
          className={styles.container}
          style={{
            backgroundImage: `linear-gradient( rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8) ), url(${event.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
            backgroundRepeat: "no-repeat",
          }}
        >
          <Navbar />
          {event && (
            <div className={styles.content}>
              {/* TOP INFO */}
              <div className={styles.header__info}>
                <div>
                  <p>i</p>
                  <p>{event.promoter}</p>
                </div>
                <div>
                  <p>i</p>
                  <p>{event.location}</p>
                </div>
              </div>
              {/* TITLE */}
              <h1>{event.title}</h1>
              
              {/* BELOW TITLE INFO */}
              <div className={styles.header__info}>
                <div>
                  <p>i</p>
                  <p>{event.date}</p>
                </div>
                <div>
                  <p>i</p>
                  <p>19:15</p>
                </div>
              
              </div>

              <p className={styles.description}>{event.description}</p>
              <button className={styles.action__btn}>KAUPA MIÐA</button>
              <div className={styles.bottom__btns}>
                <button className={styles.share__btn}>SHARE</button>
                <p>i</p>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
