
//  Apps Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyB3CyftB9QKqJ8XPtk7uc0jkXfqM_JegXI",
    authDomain: "love-your-car.firebaseapp.com",
    databaseURL: "https://love-your-car.firebaseio.com",
    projectId: "love-your-car",
    storageBucket: "",
    messagingSenderId: "891854078602",
    appId: "1:891854078602:web:58b10fab3abb5f11"
  };
//  Initialize Firebase
firebase.initializeApp(firebaseConfig);
// Create a variable to reference the database.

const auth=firebase.auth();
// const db=firebase.firestore(); 
const database=firebase.database();
