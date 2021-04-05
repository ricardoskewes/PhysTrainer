class Usuario{
    /**@type {Boolean} */
    estaEnLinea;
    /**@type {Date} */
    fechaRegistro;
    /**@type {String} */
    idUsuario;
    /**@type {String} */
    nombre;
    /**@type {String} */
    privilegios;
    /**@type {Number} */
    puntaje;
    /**@type {String} */
    photoURL = '/assets/img/user.png'
    constructor(){}
}

const UsuarioConverter = {
    toFirestore: (/**@type {Usuario} */ usuario)=>({
        estaEnLinea: usuario.estaEnLinea, 
        fechaRegistro: new firebase.firestore.Timestamp(usuario.fechaRegistro.getTime()), 
        idUsuario: usuario.idUsuario, 
        nombre: usuario.nombre, 
        privilegios: usuario.privilegios, 
        puntaje: usuario.puntaje,
        photoURL: usuario.photoURL,
    }),
    fromFirestore: (snapshot, options)=>{
        const data = snapshot.data(options);
        data.fechaRegistro = data.fechaRegistro.toDate()
        let usuario = new Usuario();
        Object.assign(usuario, data);
        return usuario;
    }
}