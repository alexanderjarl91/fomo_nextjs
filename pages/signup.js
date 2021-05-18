import React, { useContext, useState } from "react";
import fire from "../firebase";
import { UsersContext } from "../context";
import Navbar from "../components/Navbar";
export default function signup() {
  const { signInWithGoogle, signOut } = useContext(UsersContext);
  const [showMenu, setShowMenu] = useState(false);
  return (
    <div>
      <Navbar showMenu={showMenu} setShowMenu={setShowMenu} />
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
