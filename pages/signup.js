import React, { useContext, useEffect, useState } from "react";
import fire from "../firebase";
import { UsersContext } from "../context";
import { useRouter } from "next/router";
import styles from "../styles/Signup.module.css";

import Navbar from "../components/Navbar";
import Menu from "../components/Menu";

export default function signup({}) {
  const router = useRouter();
  const { signInWithGoogle, showMenu, setShowMenu } = useContext(UsersContext);

  //route restriction - if user is logged in, redirect to index
  useEffect(() => {
    if (fire.auth().currentUser) {
      router.push("/");
    }
  }, [fire.auth().currentUser]);

  return (
    <div>
      {/* PAGE CONTENT */}
      <div className={styles.signup__container}>
        <h1>Sign in</h1>
        <p>
          Sign in with either your Google or Facebook account to discover more
          events and features!
        </p>
        <button
          onClick={() => {
            signInWithGoogle();
          }}
        >
          <img src="/google_icon.svg" alt="" />
          Continue with Google
        </button>

        <button
          onClick={() => {
            // signInWithFacebook();
          }}
        >
          <img src="/facebook_icon.svg" alt="" />
          Continue with Facebook
        </button>
      </div>
    </div>
  );
}
