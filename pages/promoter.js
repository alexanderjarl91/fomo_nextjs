import React from "react";
import Navbar from "../components/Navbar";
import styles from "../styles/Promoter.module.css";
import fire from "../firebase";
import { useRouter } from "next/router";


export default function promoter() {
    const router = useRouter()
// upgrade account to promoter
    const upgradeAccount = async() => {
        const userRef = fire.firestore().collection('users').doc(fire.auth().currentUser.email)
        const doc = await userRef.get()
        
        if (!doc.exists) {
            console.log('No such document!');
          } else {
            await userRef.update({promoter: true}).then(()=> {
                router.push('/profile')
            })
          }
    }



  return (
    <div>
      <Navbar />

      <div className={styles.content}>
        <h1>Promote your own events</h1>
        <p>By becoming a official fomo promoter you can 
        promote your event to millions of nobodies in your area. Click the button below to upgrade to a promoter account
        </p>
        <p><i>note: upgrading to a promoter and publishing events is free of charge</i></p>
        </div>
        <button onClick={upgradeAccount}className={styles.upgrade__btn}>Upgrade to promoter</button>
    </div>
  );
}
