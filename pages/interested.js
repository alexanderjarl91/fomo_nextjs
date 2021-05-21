import React, { useState, useEffect, useContext } from "react";
import Navbar from "../components/Navbar";
import fire from "../firebase";
import styles from "../styles/Interested.module.css";
import { UsersContext, DataContext } from "../context";

export default function interested() {
  const [cards, setCards] = useState([]);
  const { userData } = useContext(UsersContext);

  const [cardOpen, setCardOpen] = useState(false)

  //get users interested array and set to cards state
  useEffect(() => {
    if (!userData) return;
    setCards(userData.interested);
  }, [userData]);


  const openCard = () => {
    setCardOpen(!cardOpen)
  }

  useEffect(()=>{
    console.log(cardOpen)
  }, [cardOpen])

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
            onClick={() => {
              openCard();
            }}
          >
              {!cardOpen && 
            <div className={styles.closed__content}>
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
          }
            
            {cardOpen &&
            <div className={styles.open__content}>
              <div className={styles.open__header}>
                <p>SENA</p>
                <h3>{card.title}</h3>
                <div className={styles.header__info}>
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

              <p>
                Kevin Hart hefur skapað sér nafn sem einn helsti grínisti,
                skemmtikraftur, höfundur og viðskiptamaður afþreyingarbransa
                samtímans. Nú leggur hann af stað í einn allra stærsta
                gríntúr fyrr og síðar og við erum svo heppin að fá
                stórstjörnuna til Íslands með nýju sýninguna sína, nánar
                tiltekið í Laugardalshöll þann 4. sept.
              </p>
              <div className={styles.open__footer}>
                <div>
                  <button>share</button>
                  <h2>13990 kr</h2>
                </div>
                <button>KAUPA MIÐA</button>
              </div>
              <button>remove event</button>
            </div>
            }
          </div>
        ))}
      </div>
    </div>
  );
}
