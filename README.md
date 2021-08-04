### technology list

- nextjs
- css modules
- react-tinder-card package
- geolocation api
- context api
- firestore data persistence
- user authentication with firebase auth
- 1-click sign up & sign in with google



### to-do

- reshuffle after clear events not working (events without seen hasnt been updated when function is called..)

- lastCard button not working after map key is event.id instead of index (activeCardIndex not being used anymore..)

- like button not working after map key is event.id instead of index..



### Data flow

1. All events are fetched from database and those that are in the future and have been approved by admin are set to allEvents state.

2. AllEvents then go through the users filter (distance, category, date), duplicates removed and are set to filteredEvents state.

3. 