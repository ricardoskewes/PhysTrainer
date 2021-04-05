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
    photoURL = '/assets/img/user.png';
    listasSeguidas = [];
    ref;
    constructor(){
    }

    seguirListaProblemas(/**@type {ListaProblemas} */ listaProblemas){
        this.listasSeguidas.push(listaProblemas.ref)
    }
    dejarDeSeguirListaProblemas(/**@type {ListaProblemas} */ listaProblemas){
        let lista = this.listasSeguidas.find(l=>l.id == listaProblemas.ref.id);
        let index = this.listasSeguidas.indexOf(lista);
        this.listasSeguidas = this.listasSeguidas.splice(index, 1);
    }
    async push(){
        if(this.ref == undefined){
            this.ref = await firebase.firestore().collection('usuarios').add({})
        }
        this.ref.withConverter(UsuarioConverter).set(this);
    }
}

const UsuarioConverter = {
    toFirestore: (/**@type {Usuario} */ usuario)=>({
        estaEnLinea: usuario.estaEnLinea, 
        fechaRegistro: new firebase.firestore.Timestamp.fromDate(usuario.fechaRegistro), 
        idUsuario: usuario.idUsuario, 
        nombre: usuario.nombre, 
        privilegios: usuario.privilegios, 
        puntaje: usuario.puntaje,
        photoURL: usuario.photoURL,
        listasSeguidas: usuario.listasSeguidas
    }),
    fromFirestore: (snapshot, options)=>{
        const data = snapshot.data(options);
        data.fechaRegistro = data.fechaRegistro.toDate()
        let usuario = new Usuario();
        Object.assign(usuario, data);
        usuario.ref = snapshot.ref;
        return usuario;
    }
}