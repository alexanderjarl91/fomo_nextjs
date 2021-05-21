import React, { useContext, useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { UsersContext } from "../context";
import { useRouter } from "next/router";
import fire from "../firebase";
import styles from "../styles/Profile.module.css";

export default function profile() {
  const { userData, signOut } = useContext(UsersContext);
  const router = useRouter();

  return (
    <div className={styles.profile__container}>
      <Navbar />

      {fire.auth().currentUser ? (
        <div className={styles.profile__header}>
          <img src={fire.auth().currentUser.photoURL} alt="" />
          <h1>{fire.auth().currentUser.displayName}</h1>
          {!userData ? null : (
            <>
              {userData && userData.promoter == true ? (
                <h2>Promoter</h2>
              ) : (
                <h2>Festival lover</h2>
              )}
            </>
          )}

          <p>Reykjavík, Iceland</p>
        </div>
      ) : null}

      <button
        className={styles.logout__btn}
        onClick={() => {
          signOut();
          router.push("/");
        }}
      >
        LOG OUT
      </button>
    </div>
  );
}
