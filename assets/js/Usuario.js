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
    /**@type {Array} */
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
    getListasProblemas(){
        return this.listasSeguidas.map(async lista=>{
            return (await lista.withConverter(ListaProblemasConverter).get()).data()
        })
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

customElements.define('usuario-card', class extends HTMLElement{
    constructor(){
        super();
        if(this.attributes.length>0) this.render()
    }
    render(){
        this.estaEnLinea = this.getAttribute('estaEnLinea') || false;
        this.idUsuario = this.getAttribute('idUsuario');
        this.nombre = this.getAttribute('nombre');
        this.photoURL = this.getAttribute('photoURL');
        this.puntaje = this.getAttribute('puntaje');
        this.innerHTML = "";

        let img = Object.assign(document.createElement('img'), {
            className: 'perfil', src: this.photoURL
        });
        if(this.estaEnLinea) img.classList.add('en-linea')

        let detail = document.createElement('div');

        detail.append(
            Object.assign(document.createElement('span'), {
                className: 'nombre', innerHTML: this.nombre
            }),
            Object.assign(document.createElement('span'), {
                className: 'usuario', innerHTML: this.idUsuario
            }),
            Object.assign(document.createElement('span'), {
                className: 'puntaje', innerHTML: this.puntaje
            })
        )
        this.append(img, detail)
    }
})