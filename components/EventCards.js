import React, { useState, useContext } from "react";
import TinderCard from "react-tinder-card";
import styles from "../styles/EventCards.module.css";

import { DataContext } from "../context";

function EventCards() {
  const { activeCardIndex, setActiveCardIndex, cards, setCards } =
    useContext(DataContext);
    
const [classlist, setClasslist] = useState(styles.card)
  const [flipFront, setFlipFront] = useState(styles.flipFront);
  const [flipBack, setFlipBack] = useState(styles.flipBack);

  const handleSwipe = (dir, index) => {
    // console.log("swiped:", dir, index);
    setActiveCardIndex(index - 1);
  };

  // show last card
  const showLastCard = () => {
    let lastCard = cards[activeCardIndex + 1];
    console.log(lastCard);

    const tester = document.querySelector(".test");

    const text = document.createElement("div");
    text.classList.add(`${styles.card}`);
    text.innerHTML = `<h1>CLASS?</h1>`;
    tester.appendChild(text);
  };

  
  const flip = () => {
    if (classlist == styles.card) {
      setClasslist(() => {
        return styles.card, flipFront, flipBack
      })
    } else {
      setClasslist(styles.card)
    }
  };


  return (
    <div>
      <div className={styles.cards__container}>
        {activeCardIndex < 0 ? (
          <div className={styles.noCards__container}>
            <p>
              No more events in your area.. change your filter or swipe again
            </p>
           <button><a href="/">Reshuffle cards</a></button>
          </div>
        ) : null}

        {cards.map((card, index) => (
          <TinderCard
            className={`test ${styles.swipe}`}
            key={card.title}
            preventSwipe={["up", "down"]}
            onSwipe={(dir) => handleSwipe(dir, index)          
            }
          >
            <div
              onClick={()=> flip() }
              className={classlist}
            >
              {/* FRONTSIDE */}
              <div
                className={styles.card__front}
                style={{
                  backgroundImage: `linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url(${card.image})`,
                }}
              >
                <h3>{card.title}</h3>
                <div className={styles.location__container}>
                  <img src="/location_pin.svg" alt="" />
                  <p>{card.location}</p>
                </div>
                <div className={styles.date__container}>
                  <img src="/date.svg" alt="" />
                  <p>{card.date}</p>
                </div>
              </div>

              {/* BACKSIDE */}
              <div
                className={styles.card__back}
                style={{
                  backgroundImage: `linear-gradient( rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8) ), url(${card.image})`,
                }}
              >
                <div className={styles.backside__content}>
                  <div className={styles.backside__header}>
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
                  <div className={styles.backside__footer}>
                    <div>
                      <button>share</button>
                      <h2>13990 kr</h2>
                    </div>
                    <button>KAUPA MIÐA</button>
                  </div>
                </div>
              </div>
            </div>
          </TinderCard>
        ))}
      </div>
      <h3
        onClick={() => {
          showLastCard();
        }}
      >
        last card
      </h3>
    </div>
  );
}

export default EventCards;
