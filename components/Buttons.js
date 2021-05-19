import React from 'react'
import styles from '../styles/Buttons.module.css'

export default function Buttons() {
    return (
        <div className={styles.swipeButtons}>
            <div className={styles.event__button}>
            <img src="/back_arrow.svg" alt="" />
            </div>
            <div className={styles.interested__button}>
               
            </div>
            <div className={styles.event__button}>
            <img src="/filter_icon.svg" alt="" />
            </div>
        </div>
    )
}


