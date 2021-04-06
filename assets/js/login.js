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
            let usuarioAuth = await firebase.auth().signInWithEmailAndPassword(data.email, data.password);
            let usuario = await firebase.firestore().collection('usuarios')
                .doc(usuarioAuth.user.uid)
                .withConverter(UsuarioConverter)
                .get();
            Login.usuarioActual = usuario.data();
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
    requerirInicio: async ()=>{
        firebase.auth().onAuthStateChanged(async user=>{
            if(user){
                let usuario = await firebase.firestore().collection('usuarios')
                .doc(firebase.auth().currentUser.uid)
                .withConverter(UsuarioConverter)
                .get();
                Login.usuarioActual = usuario.data();
                Login.usuarioActual.estaEnLinea = true;
                await Login.usuarioActual.push();
            } else {
                if(window.location.pathname != '/login.html') window.location.href = '/login.html'
            }
        })
    }
}

