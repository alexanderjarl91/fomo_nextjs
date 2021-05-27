import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import Link from 'next/link'
import fire from "../../firebase";
import styles from "../../styles/Event.module.css";
import { UsersContext, DataContext } from "../../context";


//components
import Navbar from "../../components/Navbar";

export default function Event() {
  //context data
  const {userData} = useContext(UsersContext)

  //initialize router
  const router = useRouter();

  //states
  const [event, setEvent] = useState();
  const [isInterested, setIsInterested] = useState();

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
  
  
  const checkIfUserIsInterested = () => {
    //check if users interested array includes the eventId from query, set boolean state accordingly
    setIsInterested(userData.interested.includes(router.query.event))
  }

  useEffect(() => {
    if (!userData) return
    checkIfUserIsInterested()
  }, [userData])

  useEffect(() => {
    console.log('is user interested in this event?', isInterested)
  }, [isInterested])


  // BUILD THE SET AS INTERESTED/REMOVE FROM INTERESTED FUNCTION

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
                  <p>{event.promoter}</p>
                </div>
                <div>
                  <img src="/location_pin.svg" alt="" />
                  <p>{event.location}</p>
                </div>
              </div>
              {/* TITLE */}
              <h1>{event.title}</h1>

              {/* BELOW TITLE INFO */}
              <div className={styles.header__info}>
                <div>
                  <img src="/date.svg" alt="" />
                  <p>{event.date}</p>
                </div>
                <div>
                  <img src="/time_icon.svg" alt="" />
                  <p>19:15</p>
                </div>
              </div>

              <p className={styles.description}>{event.description}</p>

              <div className={styles.footer__btns}>

              <button className={styles.action__btn}>KAUPA MIÐA</button>
              <div className={styles.bottom__btns}>
                <button className={styles.share__btn}>SHARE</button>

                {!fire.auth().currentUser&& 
                  <Link href="/signup">
                    <img src="/heart_empty.svg" alt="" />
                  </Link>
                }
                
                {fire.auth().currentUser&&
                <>
                {isInterested? 
                <img src="/heart_fill.svg" alt="" />
              : <img src="/heart_empty.svg" alt="" />
            }
                </>
                }




              </div>
            </div>
          </div>
          )}
        </div>
      )}
    </>
  );
}
