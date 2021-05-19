import React, { useContext, useState } from "react";
import fire from "../firebase";
import { UsersContext } from "../context";
import Navbar from "../components/Navbar";

export default function signup({}) {
  const { signInWithGoogle, signOut, showMenu, setShowMenu } =
    useContext(UsersContext);

  return (
    <div>
      <Navbar />
      <h1>SIGN UP</h1>
      <button
        onClick={() => {
          signInWithGoogle();
        }}
      >
        SIGN IN WITH GOOGLE
      </button>
      <button
        onClick={() => {
          signOut();
        }}
      >
        SIGN OUT
      </button>

      <button
        onClick={() => {
          console.log(fire.auth().currentUser);
        }}
      >
        current user
      </button>
    </div>
  );
}
