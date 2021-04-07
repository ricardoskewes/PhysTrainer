const Login = {
    /**
     * @type {Usuario}
     */
    usuarioActual: undefined, 
    crearUsuario: async (data)=>{
        try{
            let usuarioAuthCredencial = await firebase.auth().createUserWithEmailAndPassword( data.email, data.password );
            let usuario = new Usuario();
            usuario.uid = usuarioAuthCredencial.user.uid;
            usuario.nombre = data.nombre;
            usuario.idUsuario = data.idUsuario;
            usuario.photoURL = data.photoURL;
            await usuarioAuthCredencial.user.sendEmailVerification();
            await usuario.push();
            Login.usuarioActual = usuario;
        } catch (e) {
            Login.usuarioActual = undefined
            console.error('Login.creaUsuario', e);
            throw e;
        }
    }, 
    iniciarSesion: async (data)=>{
        try{
            await firebase.auth().signInWithEmailAndPassword(data.email, data.password);
        } catch (e) {
            Login.usuarioActual = undefined
            console.error('Login.iniciarSesion', e);
            throw e;
        }
    },
    cerrarSesion: async ()=>{
        try{
            await firebase.auth().signOut();
            Login.usuarioActual.estaEnLinea = false;
            await Login.usuarioActual.push();
            Login.usuarioActual = undefined;
        } catch (e){
            throw e;
        }
    },
    requerirInicio: async (callback)=>new Promise((resolve, reject)=>{
        firebase.auth().onAuthStateChanged(async user=>{
            if(user){
                await Login.obtenerUsuarioActual();
                resolve();
            } else {
                reject();
                if(window.location.pathname != '/login.html') window.location.href = '/login.html'
            }
        })
    }),

    obtenerUsuarioActual: (callback=function(){}) => {
        if(firebase.auth().currentUser == undefined) return;
        firebase.firestore().collection('usuarios')
            .withConverter(UsuarioConverter)
            .doc(firebase.auth().currentUser.uid)
            .onSnapshot(doc=>{
                Login.usuarioActual = doc.data()
                callback(doc.data())
            })
    }
}
