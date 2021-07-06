import React, { useContext, useRef, useEffect } from "react";

import styles from "../styles/Buttons.module.css";
import { DataContext, UsersContext } from "../context";
import fire from "../firebase";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

export default function Buttons({ handleLike, showAnimation }) {
  const { cards, activeCardIndex, setActiveCardIndex, filteredEvents } =
    useContext(DataContext);
  const { setShowFilter, showFilter } = useContext(UsersContext);

  const heartRef = useRef(null);

  const router = useRouter();
  // show filter
  const handleShowFilter = () => {
    setShowFilter(!showFilter);
    console.log(showFilter);
  };

  useEffect(() => {
    console.log("active index:", activeCardIndex);
  }, [activeCardIndex]);

  //get previous card
  const handleLastCard = async () => {
    //if first card, cancel function
    if (activeCardIndex === filteredEvents.length - 1) return;

    //save event if swiped right
    const lastCardIndex = activeCardIndex + 1;
    setActiveCardIndex(activeCardIndex + 1);

    // get big heart dom and hide it
    const cardNotification = document.getElementById(
      `animate-${lastCardIndex}`
    );
    cardNotification.style.display = "none";

    //get last card dom element
    const lastCardDOM = document.getElementById(
      `card-${lastCardIndex}`
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
          <div
            onClick={() => {
              handleLike();
            }}
            className={styles.interested__button}
          >
            <img src="/interested.svg" alt="" />
          </div>
        ) : (
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
          <div onClick={handleShowFilter} className={styles.event__button}>
            <img src="/filter_icon.svg" alt="" />
          </div>
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
    </div>
  );
}
