import React, { useState } from "react";
import TinderCard from "react-tinder-card";
import styles from "../styles/EventCards.module.css";

function EventCards() {
  // fire.firestore().collection('events').doc

  const [people, setPeople] = useState([
    {
      name: "Kevin Hart í Hörpunni",
      location: "Harpan",
      date: "29. ágúst",
      image:
        "https://occ-0-1068-92.1.nflxso.net/dnm/api/v6/E8vDc_W8CLv7-yMQu8KMEC7Rrr8/AAAABQ-ROQc7T66Tb-Yt8fgCB3lhmxaWdY9X4EwhH1LV5O2lKqvlFQ74H0nHDND-UihVqsJd_daCJ4myu2Vq1pEvEAAS-QJW.jpg?r=152",
    },
    {
      name: "Reggaeton Beach Festival",
      location: "San Pedro",
      date: "30. ágúst",
      image:
        "https://s3.eu-west-3.amazonaws.com/rbfweb/festivals/October2019/62nk9yp9FJdRbNHG1Zgz.jpg",
    },
  ]);
  return (
    <div>
      <div className={styles.cards__container}>
        {people.map((person) => (
          <TinderCard
            className={styles.swipe}
            key={person.name}
            preventSwipe={["up", "down"]}
          >
            <div
              className={styles.card}
              style={{
                backgroundImage: `linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url(${person.image})`,
              }}
            >
              <h3>{person.name}</h3>
              <div className={styles.location__container}>
                <img src="/location_pin.svg" alt="" />
                <p>{person.location}</p>
              </div>
              <div className={styles.date__container}>
                <img src="/date.svg" alt="" />
                <p>{person.date}</p>
              </div>
            </div>
          </TinderCard>
        ))}
      </div>
    </div>
  );
}

export default EventCards;
