import React, { useState, useContext, useEffect } from "react";
import { DataContext, UsersContext } from "../context";
import styles from "../styles/Filter.module.css";
import Slider, { Range } from "rc-slider";
import "rc-slider/assets/index.css";

export default function Filter() {
  const { setShowFilter, showFilter } = useContext(UsersContext);
  const {
    maxDistance,
    setMaxDistance,
    categoryItems,
    setActiveCategories,
    activeCategories,
    dateFilters,
    dateFilter,
    setDateFilter,
    maxRange,
    clearSeen,
  } = useContext(DataContext);

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

  const handleMaxDistance = (value) => {
    setMaxDistance(value);
  };

  useEffect(() => {
    console.log("max distance is:", maxDistance);
  }, [maxDistance]);

  const trackStyles = {
    color: "green",
    backgroundColor: "white",
    width: "30px",
  };
  return (
    <div className={styles.container}>
      <div className={styles.filter}>
        <div className={styles.header}>
          <div>
            <img src="/filter_icon.svg" alt="" />
            <h1>FILTER</h1>
            <img
              className={styles.close_btn}
              onClick={handleFilter}
              src={"/close_filter.svg"}
              alt=""
            />
          </div>
          <p className={styles.tinyText}>
            find exactly what you're looking for
          </p>
        </div>
        <div className={styles.filter__content}>
          {/* WHAT? */}
          <div className={styles.what__container}>
            <div className={styles.what__headline}>
              <h3>what?</h3>
              <p>deselect to show all</p>
            </div>

            <div className={styles.what__buttonContainer}>
              {categoryItems?.map((flag, i) => (
                <li
                  className={
                    activeCategories.includes(flag) ? styles.active : null
                  }
                  key={i}
                  onClick={() => {
                    handleActiveCategories(flag);
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
              <p>deselect to show all</p>
            </div>
            <div className={styles.when__buttonContainer}>
              {dateFilters.map((dateFlag, i) => {
                return (
                  <li
                    className={
                      dateFilter.includes(dateFlag) ? styles.active : null
                    }
                    key={i}
                    onClick={() => {
                      handleActiveDates(dateFlag);
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
            <div className={styles.where__headline}>
              <h3>where?</h3>
              <h3 className={styles.maxKmText}>within {maxDistance}km</h3>
            </div>
            <Slider
              className={styles.slider}
              defaultValue={maxDistance}
              min={2}
              max={maxRange}
              step={2}
              onAfterChange={handleMaxDistance}
              // trackStyle={{ backgroundColor: "white", height: "12px" }}
              trackStyle={{
                backgroundColor: "#CCCCCC",
                height: "8px",
                marginTop: "1px",
              }}
              railStyle={{
                height: "8px",
                backgroundColor: "#CCCCCC",
                marginTop: "1px",
              }}
              handleStyle={{
                width: "20px",
                height: "20px",
                border: "none",
                backgroundColor: "#FFFFFF",
              }}
            />
          </div>
          <p className={styles.tinyText}>
            showing {activeCategories.length === 0 && "all"}{" "}
            {activeCategories.length == 1 && activeCategories[0]}{" "}
            {activeCategories.length > 1 &&
              activeCategories.map((category) => `${category}, `)}
            events happening {dateFilter.length === 0 && "anytime"}
            {dateFilter.length > 0 &&
              dateFilter.map((date) => `${date}, `)}{" "}
            within {maxDistance} km
          </p>
        </div>
        {/* <button onClick={async ()=> {
          await clearSeen()
        }}>clear seen events</button> */}
      </div>
    </div>
  );
}
