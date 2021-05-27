import React, { useContext, useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { UsersContext } from "../context";
import { useRouter } from "next/router";
import fire from "../firebase";
import styles from "../styles/Profile.module.css";

import Menu from "../components/Menu";

export default function profile() {
  //context data
  const { userData, signOut, showMenu, setShowMenu } = useContext(UsersContext);

  //initialize router
  const router = useRouter();

  return (
    <div className={styles.profile__container}>
      {/* NAVBAR & MENU */}
      <Navbar />
      {showMenu ? <Menu showMenu={showMenu} setShowMenu={setShowMenu} /> : null}

      {/* PAGE CONTENT */}
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
