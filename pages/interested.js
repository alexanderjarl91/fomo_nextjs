import React, { useState, useEffect, useContext } from "react";
import Navbar from "../components/Navbar";
import fire from "../firebase";
import styles from "../styles/Interested.module.css";
import { UsersContext, DataContext } from "../context";

export default function interested() {
  const [cards, setCards] = useState([]);
  const { userData } = useContext(UsersContext);

  //get users interested array and set to cards state
  useEffect(() => {
    if (!userData) return;
    setCards(userData.interested);
  }, [userData]);

  return (
    <div className={styles.interested__container}>
      <Navbar />

      <div className={styles.cards}>
        <h3>interested</h3>
        {cards.map((card) => (
          <div
            className={styles.card}
            key={card.title}
            style={{
              background: `linear-gradient( rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7) ), url(${card.image})`,
            }}
          >
            <h1>{card.title}</h1>
            <div className={styles.info__container}>
              <div>
                <img src="/location_pin.svg" alt="" />
                <p>{card.location}</p>
              </div>
              <div>
                <img src="/date.svg" alt="" />
                <p>{card.date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
