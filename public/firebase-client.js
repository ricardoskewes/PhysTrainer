// Import firebase libraries
import 'https://www.gstatic.com/firebasejs/8.2.10/firebase-app.js';
import 'https://www.gstatic.com/firebasejs/8.2.10/firebase-auth.js';

// Init app with custom configuration
firebase.initializeApp({
    apiKey: "AIzaSyAt21y6iMy45pQ814LMy93hlYmqSKCn4Lo",
    authDomain: "physolympiadtrainer.firebaseapp.com",
    databaseURL: "https://physolympiadtrainer.firebaseio.com",
    projectId: "physolympiadtrainer",
    storageBucket: "physolympiadtrainer.appspot.com",
    messagingSenderId: "205173611989",
    appId: "1:205173611989:web:55c0ccbc684dfd4300b15c",
    measurementId: "G-FRR34SGL67"
})


// Set auth persistance to none
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);

export default firebase;