import React, { useContext, useRef } from "react";

import styles from "../styles/Buttons.module.css";
import { DataContext, UsersContext } from "../context";
import fire from "../firebase";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

export default function Buttons({ handleLike, showAnimation }) {
  const { cards, activeCardIndex } = useContext(DataContext);
  const { setShowFilter, showFilter } = useContext(UsersContext);

  const heartRef = useRef(null);

  const router = useRouter();
  // show filter
  const handleShowFilter = () => {
    setShowFilter(!showFilter);
    console.log(showFilter);
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
        <div
          className={styles.event__button}
          onClick={() => {
            handleLike();
          }}
        >
          <img src="/back_arrow2.svg" alt="" />
        </div>

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
          ></div>
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
