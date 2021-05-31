import React, { useContext } from "react";
import { DataContext, UsersContext } from "../context";
import styles from "../styles/Filter.module.css";

export default function Filter() {
  const { setShowFilter, showFilter } = useContext(UsersContext);

  const handleFilter = () => {
    setShowFilter(!showFilter);
  };
  return (
    <div className={styles.container}>
      <div className={styles.filter}>
        <div className={styles.header}>
          <h1>FILTER</h1>
          <p onClick={handleFilter}>x</p>
        </div>
        <div className={styles.filter__content}>
          {/* WHAT? */}
          <div className={styles.what__container}>
            <div className={styles.what__headline}>
              <h3>what?</h3>
              <p>deselecting all will show all categories</p>
            </div>

            <div className={styles.what__buttonContainer}>
              <li>music</li>
              <li>nightlife</li>
              <li>art</li>
              <li>sports</li>
              <li>food</li>
              <li>other</li>
            </div>
          </div>

          <span className={styles.line}></span>

          {/* WHEN? */}
          <div className={styles.what__container}>
            <div className={styles.what__headline}>
              <h3>when?</h3>
              <p>deselect all to show all</p>
            </div>

            <div className={styles.what__buttonContainer}>
              <li>today</li>
              <li>tomorrow</li>
              <li>this week</li>
              <li>this month</li>
            </div>
          </div>
          <span className={styles.line}></span>

          {/* WHERE? */}
          <div className={styles.what__container}>
            <div className={styles.what__headline}>
              <h3>when?</h3>
              <p>deselect all to show all</p>
            </div>

            <div>
              <span></span>
            </div>
          </div>

          <button className={styles.save__btn}>SAVE</button>
        </div>
      </div>
    </div>
  );
}
