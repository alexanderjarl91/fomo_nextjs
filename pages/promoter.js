import React, { useEffect, useContext } from "react";
import Navbar from "../components/Navbar";
import styles from "../styles/Promoter.module.css";
import fire from "../firebase";
import { useRouter } from "next/router";
import { UsersContext } from "../context";
export default function promoter() {
  const { user, userData } = useContext(UsersContext);
  console.log(`userData`, userData);

  const router = useRouter();

  // ROUTE RESTRICTION
  useEffect(() => {
    //if no user found, redirect to home
    if (!fire.auth().currentUser) {
      router.push("/signup");
      return;
    }
    //if user is already promoter, redirect to home
    if (userData.promoter == true) {
      router.push("/");
    }
  }, []);

  // upgrade account to promoter
  const upgradeAccount = async () => {
    const userRef = fire
      .firestore()
      .collection("users")
      .doc(fire.auth().currentUser.email);
    const doc = await userRef.get();

    if (!doc.exists) {
      console.log("No such document!");
    } else {
      await userRef.update({ promoter: true }).then(() => {
        router.push("/profile");
      });
    }
  };

  return (
    <div>
      <Navbar />

      <div className={styles.content}>
        <h1>Promote your own events</h1>
        <p>
          By becoming a official fomo promoter you can promote your event to
          millions of nobodies in your area. Click the button below to upgrade
          to a promoter account
        </p>
        <p>
          <i>
            note: upgrading to a promoter and publishing events is free of
            charge
          </i>
        </p>
      </div>
      <button onClick={upgradeAccount} className={styles.upgrade__btn}>
        Upgrade to promoter
      </button>
    </div>
  );
}