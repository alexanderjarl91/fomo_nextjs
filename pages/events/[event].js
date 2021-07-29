import React, { useState, useEffect, useContext } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Modal from "react-modal";
import Link from "next/link";
import fire from "../../firebase";
import styles from "../../styles/Event.module.css";
import { UsersContext, DataContext } from "../../context";
import {
  FacebookShareButton,
  WhatsappShareButton,
  TwitterShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  EmailIcon,
} from "react-share";
import { FiShare2 } from "react-icons/fi";

//components
import Navbar from "../../components/Navbar";
import EventMap from "../../components/EventMap";

export default function Event() {
  //context data
  const { userData } = useContext(UsersContext);

  //initialize router
  const router = useRouter();

  //states
  const [event, setEvent] = useState();
  const [isInterested, setIsInterested] = useState();
  const [coordinates, setCoordinates] = useState();
  const [linkCopied, setLinkCopied] = useState(false);

  // get the data when component mounts
  useEffect(() => {
    matchEventWithQuery();
  }, [router.query]);

  useEffect(() => {
    if (event) {
      setCoordinates(event.location.coordinates);
    }
  }, [event]);

  // get clicked event data
  const matchEventWithQuery = async () => {
    const eventsRef = fire.firestore().collection("events");
    const queryRef = eventsRef.where("eventId", "==", `${router.query.event}`);
    const foundEvent = await queryRef.get();
    foundEvent.forEach((doc) => setEvent(doc.data()));
  };

  //check if users interested array includes the eventId from query, set boolean state accordingly
  const checkIfUserIsInterested = () => {
    setIsInterested(userData?.interested?.includes(router.query.event));
  };

  //if userdata exists, run check functions. do this every time userData changes.
  useEffect(() => {
    if (!userData) return;
    checkIfUserIsInterested();
  }, [userData]);

  //convert date from dd/mm/yy to string
  const convertDate = () => {
    const date = new Date(event.date);
    const tempEvent = event;
    tempEvent.date = date.toDateString();
    setEvent(tempEvent);
  };

  useEffect(() => {
    if (!event) return;
    convertDate();
  }, [event]);

  // BUILD THE SET AS INTERESTED/REMOVE FROM INTERESTED FUNCTION
  const saveToInterested = async () => {
    const currentEventId = router.query.event;
    // get current users interested array
    const userRef = await fire
      .firestore()
      .collection("users")
      .doc(fire.auth().currentUser.email);
    const doc = await userRef.get();
    // // create a temp array and fill it with firestore data
    let tempInterested = [];
    if (!doc.exists) return;
    if (doc.data().interested) {
      tempInterested = doc.data().interested;
    }

    // if user is already interested in this event, remove it
    if (tempInterested.includes(currentEventId)) {
      const newTemp = tempInterested.filter((e) => e !== currentEventId);
      userRef.update({ interested: newTemp });

      return;
    }
    // push current eventId to temporary interested array
    tempInterested.push(currentEventId);
    // save new interested array to firestore
    userRef.update({ interested: tempInterested });
  };

  //SHARE MODAL
  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const customStyles = {
    overlay: {
      // backgroundColor: "rgba(255,255,255,0.8)",
      backgroundColor: "rgba(0,0,0,0.8)",
    },
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      maxWidth: "200px",
      backgroundColor: "#0e0e0e",
      border: "none",
      borderRadius: "16px",
      height: "35%",
      maxHeight: "260px",
      minWidth: "350px",
      display: "flex",
      flexDirection: "column",
      textAlign: "center",
    },
  };

  const handleLinkCopied = () => {
    setLinkCopied(true);
  };

  useEffect(() => {
    console.log("link copied?", linkCopied);
  }, [linkCopied]);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="title" content="EVENT NAME" />
        <meta property="description" content="description" />
        <meta property="image" content="header_img.png" />
        {event && <title>{event.title} | fomo</title>}
        <meta property="og:title" content={event.title} key="ogtitle" />
        <meta
          property="og:description"
          content="the description"
          key="ogdesc"
        />
      </Head>

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
          {event && (
            <div className={styles.content}>
              {/* TITLE */}
              <h1>{event.title}</h1>

              {/* TOP INFO */}
              <div className={styles.header__info}>
                <div>
                  {/* <img src="/location_pin.svg" alt="" /> */}
                  <p>{event.categories[0]}</p>
                </div>
                <div>
                  {/* <img src="/date.svg" alt="" /> */}
                  <p>{event.date}</p>
                </div>
                <div>
                  {/* <img src="/time_icon.svg" alt="" /> */}
                  <p>{event.time}</p>
                </div>
              </div>

              <p className={styles.description}>{event.description}</p>

              <EventMap coordinates={coordinates} />

              <div className={styles.footer__btns}>
                <a
                  className={styles.action__btn}
                  href={`${event.url}`}
                  target="_blank"
                >
                  KAUPA MIÐA
                </a>
                <div className={styles.bottom__btns}>
                  {/* MODAL */}
                  <div>
                    <div
                      onClick={openModal}
                      style={{
                        color: "white",
                        width: "30px",
                        cursor: "pointer",
                      }}
                    >
                      <FiShare2 size="1.5em" />
                    </div>
                    <Modal
                      isOpen={modalIsOpen}
                      onRequestClose={closeModal}
                      style={customStyles}
                      contentLabel="Example Modal"
                    >
                      <h1
                        style={{
                          fontSize: "24px",
                          marginBottom: "8px",
                          marginTop: "12px",
                        }}
                      >
                        Share this event
                      </h1>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-around",
                          width: "260px",
                          margin: "0 auto",
                        }}
                      >
                        <FacebookShareButton url={window.location.href}>
                          <FacebookIcon size={50} borderRadius={12} />
                        </FacebookShareButton>

                        <TwitterShareButton url={window.location.href}>
                          <TwitterIcon size={50} borderRadius={12} />
                        </TwitterShareButton>
                        <WhatsappShareButton url={window.location.href}>
                          <WhatsappIcon size={50} borderRadius={12} />
                        </WhatsappShareButton>
                        <EmailShareButton url={window.location.href}>
                          <EmailIcon size={50} borderRadius={12} />
                        </EmailShareButton>
                      </div>
                      <h2 style={{ fontSize: "18px", marginTop: "12px" }}>
                        Or copy link
                      </h2>
                      <input
                        className={styles.linkInput}
                        onClick={() => {
                          document.execCommand("copy");
                          handleLinkCopied();
                        }}
                        type="text"
                        value={window.location.href}
                      />
                      {linkCopied && <p>copied!</p>}
                    </Modal>
                  </div>

                  {/* HEART BUTTON */}
                  {!fire.auth().currentUser && (
                    <Link href="/signup">
                      <img src="/heart_empty.svg" alt="" />
                    </Link>
                  )}

                  {fire.auth().currentUser && (
                    <>
                      {isInterested ? (
                        <img
                          className={styles.heart_btn}
                          src="/heart_fill.svg"
                          alt=""
                          onClick={() => {
                            saveToInterested();
                          }}
                        />
                      ) : (
                        <img
                          className={styles.heart_btn}
                          src="/heart_empty.svg"
                          alt=""
                          onClick={() => {
                            saveToInterested();
                          }}
                        />
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
