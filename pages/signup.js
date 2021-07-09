import React, { useContext, useEffect, useState, useRef } from "react";
import fire from "../firebase";
import { UsersContext, DataContext } from "../context";
import { useRouter } from "next/router";
import styles from "../styles/Signup.module.css";

export default function signup({}) {
  const router = useRouter();
  const { signInWithGoogle } = useContext(UsersContext);

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
          style={{
            borderRadius: "0",
            fontSize: "18px",
            padding: "2px 14px",
            fontWeight: "500",
            backgroundColor: "#DE4A39",
            color: "white",
            width: "280px",
            alignItems: "left",
            justifyContent: "flex-start",
          }}
        >
          <img style={{ marginRight: "60px" }} src="/google_icon.png" alt="" />
          Continue with Google{" "}
        </button>

        <button
          style={{
            borderRadius: "0",
            fontSize: "18px",
            padding: "2px 14px",
            fontWeight: "500",
            backgroundColor: "#4367B2",
            color: "white",
            width: "280px",
            alignItems: "left",
            justifyContent: "flex-start",
          }}
          onClick={() => {
            // signInWithFacebook();
          }}
        >
          <img
            src="/facebook_icon.png"
            style={{
              marginLeft: "4px",
              marginRight: "60px",
              maxHeight: "24px",
              width: "auto",
            }}
            alt=""
          />
          Continue with Facebook
        </button>
      </div>
    </div>
  );
}
