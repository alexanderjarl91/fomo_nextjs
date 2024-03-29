import React, { useContext, useRef, useEffect } from "react";

import styles from "../styles/Buttons.module.css";
import { DataContext, UsersContext } from "../context";
import fire from "../firebase";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

export default function Buttons({
  handleLike,
  showAnimation,
  activeCardIndex,
  setActiveCardIndex,
  renderedEvents,
  id,
}) {
  const { filteredEvents } = useContext(DataContext);
  const { setShowFilter, showFilter } = useContext(UsersContext);

  const heartRef = useRef(null);

  const router = useRouter();
  // show filter
  const handleShowFilter = () => {
    setShowFilter(!showFilter);
  };

  //get previous card
  const handleLastCard = async () => {
    console.log('index from lastCard', activeCardIndex)
    //if first card, cancel function
    if (activeCardIndex === renderedEvents.length - 1) {
      console.log("you are on first card");
      return;
    }
    //save event if swiped right
    const lastCardIndex = activeCardIndex + 1;
    setActiveCardIndex(lastCardIndex);

    const cardNotifications = document.querySelectorAll(".cardAnimate");
    cardNotifications.forEach((element) => {
      element.style.display = "none";
    });
    // get big heart dom and hide it

    const lastCardDOM = document.getElementById(
      `card-${activeCardIndex + 1}`
    ).parentElement;

    //bring it back
    lastCardDOM.style.transition = "0.3s linear";
    lastCardDOM.style.transform = "translate(0px, 0px) rotate(0deg";
    lastCardDOM.style.visibility = "visible";
    lastCardDOM.style.opacity = 1;
  };

  
  return (
    <div className={styles.container}>
      <motion.div
        className={styles.notification}
        animate={{
          opacity: showAnimation ? 0.7 : 0,
        }}
      >
        {/* <img src="/heart_fill.svg" alt="" /> */}
      </motion.div>
      <div className={styles.swipeButtons}>
        {/* BACK BUTTON */}
        {fire.auth().currentUser ? (
          <div
            className={styles.event__button}
            onClick={() => {
              handleLastCard();
            }}
          >
            <img src="/back_arrow2.svg" alt="" />
          </div>
        ) : (
          <div
            className={styles.event__button}
            onClick={() => {
              router.push("/signup");
            }}
          >
            <img src="/back_arrow2.svg" alt="" />
          </div>
        )}

        {/* INTERESTED BUTTON */}
        {fire.auth().currentUser ? (
          // <div style={{ textAlign: "center" }}>
          //   <p>
          //     swipe events <br></br>tap to see more
          //   </p>
          // </div>
                    <div
            onClick={() => {
              handleLike(activeCardIndex);
            }}
            className={styles.interested__button}
          >
            <img src="/interested.svg" alt="" />
          </div>
        ) : (
          // <div
          //   onClick={() => {
          //     handleLike(activeCardIndex);
          //   }}
          //   className={styles.interested__button}
          // >
          //   <img src="/interested.svg" alt="" />
          // </div>
          <div
            onClick={() => {
              router.push("/signup");
            }}
            className={styles.interested__button}
          >
            <img src="/interested.svg" alt="" />
          </div>
        )}
        {fire.auth().currentUser ? (
          <>
            <div onClick={handleShowFilter} className={styles.event__button}>
              <img src="/filter_icon.svg" alt="" />
            </div>
          </>
        ) : (
          <div
            onClick={() => {
              router.push("/signup");
            }}
            className={styles.event__button}
          >
            <img src="/filter_icon.svg" alt="" />
          </div>
        )}
      </div>
      {/* <div className={styles.activeFilter}></div> */}
    </div>
  );
}
