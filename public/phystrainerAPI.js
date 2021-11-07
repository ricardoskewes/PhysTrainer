import 'https://www.gstatic.com/firebasejs/8.2.10/firebase-app.js';
import 'https://www.gstatic.com/firebasejs/8.2.10/firebase-auth.js';

// Init firebase
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
firebase.auth().Persistance = 'LOCAL';

export default firebase;
/**
 * Fetch data securely from Phystrainer API
 * @param {String} url URL of resource to fetch
 * @param {RequestInit} _options 
 * @returns {Promise<Response>}
 */
const phystrainerAPI = async (url, _options = {})=>{
    if(firebase.auth().currentUser == undefined) throw "Only logged users can communicate with API";
    const idToken = await firebase.auth().currentUser?.getIdToken();
    const options = {
        ..._options, 
        headers: {
            ..._options.headers
        }
    }
    if(idToken) options.headers.Authorization = `Bearer ${idToken}`;

    return await fetch(url, options);
}

export {phystrainerAPI};

