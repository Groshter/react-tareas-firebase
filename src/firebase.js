import firebase from 'firebase/app'
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyDNLaiR5CdTnBnynvqS9DgnWZk2BK2_3ds",
    authDomain: "crud-firebase-14b0b.firebaseapp.com",
    projectId: "crud-firebase-14b0b",
    storageBucket: "crud-firebase-14b0b.appspot.com",
    messagingSenderId: "233625373362",
    appId: "1:233625373362:web:298e59b9671584ce9557ab"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export {firebase};