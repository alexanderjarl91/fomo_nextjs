import React, { useState, useContext, useEffect } from "react";
import { DataContext, UsersContext } from "../context";
import styles from "../styles/Filter.module.css";
import Slider, { Range } from "rc-slider";
import "rc-slider/assets/index.css";

export default function Filter() {
  const { setShowFilter, showFilter } = useContext(UsersContext);
  const {
    categoryItems,
    setActiveCategories,
    activeCategories,
    dateFilters,
    dateFilter,
    setDateFilter,
    filteredEvents,
    filteredEventsByDate,
  } = useContext(DataContext);
  const [maxDistance, setMaxDistance] = useState(50);

  const handleFilter = () => {
    setShowFilter(!showFilter);
  };

  //push category to activeCategories
  const handleActiveCategories = (flag) => {
    if (activeCategories.includes(flag)) {
      setActiveCategories(activeCategories.filter((item) => item != flag));
      return;
    }
    setActiveCategories((prev) => [...prev, flag]);
  };

  //push date to active dates
  const handleActiveDates = (flag) => {
    //if flag is already in array, remove it and set to state
    if (dateFilter.includes(flag)) {
      setDateFilter(dateFilter.filter((item) => item != flag));
      return;
    }
    setDateFilter((prev) => [...prev, flag]);
  };

  //toggle active class on buttons
  const handleSelect = (element) => {
    element.classList.toggle(styles.active);
  };

  const handleMaxDistance = (value) => {
    setMaxDistance(value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.filter}>
        <div className={styles.header}>
          <h1>FILTER</h1>
          <img onClick={handleFilter} src={"/close_filter.svg"} alt="" />
        </div>
        <div className={styles.filter__content}>
          {/* WHAT? */}
          <div className={styles.what__container}>
            <div className={styles.what__headline}>
              <h3>what?</h3>
              <p>deselecting all will show all categories</p>
            </div>

            <div className={styles.what__buttonContainer}>
              {categoryItems?.map((flag, i) => (
                <li
                  key={i}
                  onClick={(e) => {
                    handleActiveCategories(flag);
                    handleSelect(e.target);
                  }}
                >
                  {flag}
                </li>
              ))}
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
              {dateFilters.map((dateFlag, i) => {
                return (
                  <li
                    key={i}
                    onClick={(e) => {
                      handleActiveDates(dateFlag);
                      handleSelect(e.target);
                    }}
                  >
                    {dateFlag}
                  </li>
                );
              })}
            </div>
          </div>
          <span className={styles.line}></span>

          {/* WHERE? */}
          <div className={styles.what__container}>
            <div className={styles.what__headline}>
              <h3>when?</h3>
              <p>deselect all to show all</p>
              <h2>within {maxDistance}km</h2>
            </div>
            <Slider
              className={styles.slider}
              defaultValue={50}
              min={5}
              max={100}
              step={5}
              onChange={handleMaxDistance}
            />
          </div>

          <p className={styles.tinyText}>
            showing x events happening today within 10km
          </p>
        </div>
        <button>clear filter</button>
      </div>
    </div>
  );
}
