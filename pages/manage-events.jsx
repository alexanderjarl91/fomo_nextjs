import React, {useState, useEffect} from 'react'
import styles from "../styles/ManageEvents.module.css"
import fire from "../firebase";
import { useRouter } from "next/router";


export default function manageevents() {
    const router = useRouter()

    const [pendingEvents, setPendingEvents] = useState()

    const getPendingEvents = async () => {
        const eventsRef = fire.firestore().collection('events')
        const snapshot = await eventsRef.where('status', '==', "pending").get()
        if (snapshot.empty) {
            console.log('no matching documents')
        }

        let tempPendingEvents = [];
        snapshot.forEach(doc => {
            console.log(doc.id, '=>', doc.data())
            tempPendingEvents = [...tempPendingEvents, doc.data()]
        })
        console.log(tempPendingEvents)
        setPendingEvents(tempPendingEvents)
    }

    useEffect(()=> {
        getPendingEvents()
    }, [])


    const approveEvent = async(eventTitle) => {
        const eventRef = await fire.firestore().collection('events').doc(eventTitle)
        if (eventRef) {
            await eventRef.set({
                status: 'approved'
            }, {merge: true})
        }

        getPendingEvents()

    }

    const declineEvent = async(eventTitle) => {
        const eventRef = fire.firestore().collection('events').doc(eventTitle)

        await eventRef.set({
            status: 'declined'
        }, {merge: true})

    }

    useEffect(()=> {
        setTimeout(()=> {
            if (!fire.auth().currentUser || fire.auth().currentUser.email !== 'alexanderjarl91@gmail.com') {
                router.push('/')
            }

        }, 1000)
    }, [])

    return (
        <div className={styles.body}>

        <div className={styles.container} >
            {fire.auth().currentUser?.email == "alexanderjarl91@gmail.com"? <>
            
            <h1>Manage events</h1>

            {pendingEvents?.length == 0 && <p>no more events to review :)</p>}
            
            {pendingEvents?.map((event) => (
                <div key={event.eventId} className={styles.event}>
                    <h3>{event.title}</h3>
                    <img style={{height: "100px", width: "auto"}} src={event.image} alt="" />
                    <div style={{display: 'flex'}}>
                        <p style={{marginRight: '8px', fontWeight: '600'}}>eventId:</p>
                        <p>{event.eventId}</p>
                    </div>
                    <div style={{display: 'flex'}}>
                        <p style={{marginRight: '8px', fontWeight: '600'}}>userId:</p>
                        <p>{event.uid}</p>
                    </div>
                    <div style={{display: 'flex'}}>
                        <p style={{marginRight: '8px', fontWeight: '600'}}>promoter:</p>
                        <p>{event.promoter}</p>
                    </div>
                    <div style={{display: 'flex'}}>
                        <p style={{marginRight: '8px', fontWeight: '600'}}>date:</p>
                        <p>{event.date}</p>
                    </div>
                    <div style={{display: 'flex'}}>
                        <p style={{marginRight: '8px', fontWeight: '600'}}>time:</p>
                        <p>{event.time}</p>
                    </div>
                    <div style={{display: 'flex'}}>
                        <p style={{marginRight: '8px', fontWeight: '600'}}>location:</p>
                        <p>{event.location.name}</p>
                    </div>
                    <div style={{display: 'flex'}}>
                        <p style={{marginRight: '8px', fontWeight: '600'}}>action button:</p>
                        <p>{event.actionButton}</p>
                    </div>
                    <div style={{display: 'flex'}}>
                        <p style={{marginRight: '8px', fontWeight: '600'}}>URL:</p>
                        <a href={event.url}>EVENT LINK</a>
                    </div>
                    
                    <div style={{display: 'flex'}}>
                        <p style={{marginRight: '8px', fontWeight: '600'}}>categories:</p>
                        {event.categories.map((category) => (
                            <p key={category}>{category}</p>
                            ))}
                    </div>

                    <div style={{display: 'flex'}}>
                        <p style={{marginRight: '8px', fontWeight: '600'}}>description:</p>
                        <p>{event.description}</p>
                    </div>
                    
                    <div className={styles.buttonContainer} style={{display: 'flex', color: 'white'}}>
                        <button onClick={()=> {
                            declineEvent(event.title)
                        }}>DECLINE</button>

                        <button style={{backgroundColor: '#30C974', color: 'white'}} onClick={()=> {
                            approveEvent(event.title)
                        }}>APPROVE</button>
                        </div>
                        
                    </div>

))}
            
            </>
            : null}
        </div>
            </div>
    )
}
