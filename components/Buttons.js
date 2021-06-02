import React, { useContext } from "react";

import styles from "../styles/Buttons.module.css";
import { DataContext, UsersContext } from "../context";
import fire from "../firebase";
import { useRouter } from "next/router";

export default function Buttons() {
  const { cards, activeCardIndex } = useContext(DataContext);
  const { setShowFilter, showFilter } = useContext(UsersContext);

  const router = useRouter();
  // show filter
  const handleShowFilter = () => {
    setShowFilter(!showFilter);
    console.log(showFilter);
  };

  const saveToInterested = async () => {
    const activeCard = cards[activeCardIndex];
    // get current users interested array
    const userRef = await fire
      .firestore()
      .collection("users")
      .doc(fire.auth().currentUser.email);
    const doc = await userRef.get();
    // create a temp array and fill it with firestore data
    let tempInterested = [];
    if (!doc.exists) return;
    if (doc.data().interested) {
      tempInterested = doc.data().interested;
    }
    // cancel if item is already
    if (tempInterested.includes(activeCard.eventId)) return;
    // push activeCards eventId to temporary interested array
    tempInterested.push(activeCard.eventId);
    // save new interested array to firestore
    userRef.update({ interested: tempInterested });
  };

  return (
    <div className={styles.swipeButtons}>
      {/* BACK BUTTON */}
      <div className={styles.event__button}>
        <img src="/back_arrow2.svg" alt="" />
      </div>

      {/* INTERESTED BUTTON */}
      {fire.auth().currentUser ? (
        <div
          onClick={() => {
            saveToInterested();
          }}
          className={styles.interested__button}
        >
          <img src="/buttons/heart_btn.svg" alt="" />
        </div>
      ) : (
        <div
          onClick={() => {
            router.push("/signup");
          }}
          className={styles.interested__button}
        ></div>
      )}

      <div onClick={handleShowFilter} className={styles.event__button}>
        <img src="/filter_icon.svg" alt="" />
      </div>
    </div>
  );
}
