
import React, {useContext,useState} from "react";
import Navbar from "../components/Navbar";
import { UsersContext } from "../context";
import { useRouter } from "next/router";
import fire from "../firebase";
import styles from "../styles/Profile.module.css";


export default function profile() {
  const {signOut} =
  useContext(UsersContext);
  const router = useRouter();

console.log(fire.auth().currentUser)

  return (
    <div className={styles.profile__container}>
      <Navbar />

      {fire.auth().currentUser? 
      <div className={styles.profile__header}>
        <img src={fire.auth().currentUser.photoURL} alt="" />
        <h1>{fire.auth().currentUser.displayName}</h1>
        <h2>Festival Lover</h2>
        <p>Reykjavík, Iceland</p>
      </div>
      
      : null}

      <button className={styles.logout__btn} onClick={() => {
        signOut()
        router.push('/')
      }}>LOG OUT</button>
    </div>
  );
}
