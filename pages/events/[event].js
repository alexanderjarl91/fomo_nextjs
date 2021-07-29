import React, { useState, useEffect, useContext } from "react";
import Head from "next/head";
import router, { useRouter } from "next/router";
import Modal from "react-modal";
import Link from "next/link";
import fire from "../../firebase";
import styles from "../../styles/Event.module.css";
import { UsersContext, DataContext } from "../../context";
import {
  FacebookShareButton,
  WhatsappShareButton,
  TwitterShareButton,
  // EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  // EmailIcon,
} from "next-share";
import { FiShare2 } from "react-icons/fi";

//components
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
        <title>{event?.title || "fomo events"}</title>
        <meta
          name="description"
          content={event?.description || "description missing"}
        />
        <meta http-equiv="content-language" content="en" />
        <meta name="keywords" content="" />
        <meta
          property="og:image"
          content={
            event?.image
              ? event.image
              : "data:image/png;base64,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"
          }
          key="ogimage"
        />
        <meta property="image" content={event?.image} />
        <meta property="og:site_name" content="fomo" key="ogsitename" />
        <meta property="og:title" content={event?.title} key="ogtitle" />
        <meta
          property="og:description"
          content={event?.description}
          key="ogdesc"
        />
        <meta property="twitter:title" content={event?.title} />
        <meta property="twitter:description" content={event?.description} />
        <meta name="twitter:image" content={event?.image} />
        <meta name="twitter:card" content="summary_large_image" />
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
                        <FacebookShareButton
                          url={window.location.href}
                          quote={event.title}
                        >
                          <FacebookIcon size={50} borderRadius={12} />
                        </FacebookShareButton>

                        <TwitterShareButton url={window.location.href}>
                          <TwitterIcon size={50} borderRadius={12} />
                        </TwitterShareButton>
                        <WhatsappShareButton url={window.location.href}>
                          <WhatsappIcon size={50} borderRadius={12} />
                        </WhatsappShareButton>
                        {/* <EmailShareButton url={window.location.href}>
                          <EmailIcon size={50} borderRadius={12} />
                        </EmailShareButton> */}
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

// export async function getServerSideProps(context) {
//   const test = "test23";
//   console.log(context, "context....");
//   // const res = await fetch(`https://.../data`)
//   // const data = await res.json()
//   // if (!data) {
//   //   return {
//   //     redirect: {
//   //       destination: '/',
//   //       permanent: false,
//   //     },
//   //   }
//   // }
//   return {
//     props: { test }, // will be passed to the page component as props
//   };
// }
