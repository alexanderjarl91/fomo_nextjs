import React, { useContext } from "react";
import { DataContext, UsersContext } from "../context";
import styles from "../styles/Filter.module.css";

export default function Filter() {
    const { setShowFilter, showFilter } = useContext(UsersContext);

    const handleFilter = () => {
        setShowFilter(!showFilter)
    }
    return (
        <div className={styles.container}>
            <div className={styles.filter}>
                <div className={styles.header}>
                <h1>FILTER</h1>
                <p onClick={handleFilter}>x</p>
                </div>
            </div>
        </div>
    )
}
