// Login here
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyAt21y6iMy45pQ814LMy93hlYmqSKCn4Lo",
    authDomain: "physolympiadtrainer.firebaseapp.com",
    databaseURL: "https://physolympiadtrainer.firebaseio.com",
    projectId: "physolympiadtrainer",
    storageBucket: "physolympiadtrainer.appspot.com",
    messagingSenderId: "205173611989",
    appId: "1:205173611989:web:55c0ccbc684dfd4300b15c",
    measurementId: "G-FRR34SGL67"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

// Al dar submit al registro
    
document.querySelector('form').addEventListener('submit', async e=>{
    e.preventDefault();
    let name = document.querySelector("#name").value;
    let email = document.querySelector("#email").value;
    let password = document.querySelector("#password").value;
    try{
        // Registrar
        let user = await firebase.auth().createUserWithEmailAndPassword(email, password);
        // Despues de registrar
        firebase.auth().onAuthStateChanged(async function(user) {
            if (user) {
                // Cambiar nombre
                user.updateProfile({name})
                // Enviar correo de verificacion
                await user.sendEmailVerification()
            } else {
                console.log("PUS Q SAD");
            }
        });

        alert("Inicio de sesion")
    } catch(e){
        alert(e.message);
        console.log(e.code);
    }
})

