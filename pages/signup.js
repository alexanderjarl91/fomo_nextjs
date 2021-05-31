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
        <p>Sign in with one click to discover more events and features!</p>
        <button
          onClick={() => {
            signInWithGoogle();
          }}
        >
          Sign in with Google <img src="/google_icon.svg" alt="" />
        </button>

        <button
          onClick={() => {
            // signInWithFacebook();
          }}
        >
          Sign in with Facebook <img src="/facebook_icon.svg" alt="" />
        </button>

        <p>no registration required</p>
      </div>
    </div>
  );
}
