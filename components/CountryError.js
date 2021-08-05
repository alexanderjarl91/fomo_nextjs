import React from "react";
import styles from "../styles/EventCards.module.css";

export default function CountryError({ country, setShowCountryError }) {
  return (
    <div className={styles.wrongCountry__container} id="countryError">
      <div className={styles.wrongCountry__content}>
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Whoops!</h2>
        <p>
          Looks like you're trying to access from {country} but fomo is
          currently only available in Iceland.
          <strong>
            {" "}
            Your location will automatically be set to Downtown Reykjavík,
            Iceland.
          </strong>
        </p>

        <p>
          If you want us in your hometown, contact us at alexander@pippen.is
        </p>
        <button
          style={{ marginTop: "2rem", marginBottom: "1rem" }}
          onClick={(e) => setShowCountryError(false)}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
