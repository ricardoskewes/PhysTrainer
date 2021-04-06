
let scripts = [
    'https://www.gstatic.com/firebasejs/8.2.10/firebase-app.js',
    'https://www.gstatic.com/firebasejs/8.2.10/firebase-analytics.js',
    'https://www.gstatic.com/firebasejs/8.2.10/firebase-auth.js',
    'https://www.gstatic.com/firebasejs/8.2.10/firebase-firestore.js',
    './assets/js/Usuario.js',
    './assets/js/ListaProblemas.js',
    './assets/js/Problema.js',
    './assets/js/Grupo.js',
    './assets/js/Tarea.js',
    './assets/js/firebase.js',
    './assets/js/Login.js',
]

let addScript = (src)=>new Promise((resolve, reject)=>{
    let script = document.createElement('script');
    script.setAttribute('src', src);
    document.body.appendChild(script);
    script.onload = resolve;
})

let includeScripts = async ()=>{
    for(let src of scripts){
        await addScript(src);
    }
}
