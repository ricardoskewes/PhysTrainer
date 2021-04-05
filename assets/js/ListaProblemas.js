class ListaProblemas{
    creador;
    /**@type {Date} */
    fechaCreacion;
    /**@type {String} */
    descripcion;
    /**@type {String} */
    nombre;
    /**@type {Boolean} */
    estatusPublico;
    /**@type {Number} */
    likes;
    /**@type {Array} */
    probs = [];
    /**@type {Array} */
    tags = [];
    ref;
    constructor(){}
    /** Lee la referencia y devuelve un objeto con el creador
     * @returns {Promise<Usuario>}
     */
    async getCreador(){
        return (await this.creador.withConverter(UsuarioConverter).get()).data();
    }
    async getProblemas(){
        return this.probs.map(async problema=>{
            return (await problema.withConverter(ProblemaConverter).get()).data()
        })
    }
    async push(){
        if(this.ref == undefined){
            this.ref = await firebase.firestore().collection('listasProblemas').add({});
        }
        this.ref.withConverter(ListaProblemasConverter).set(this);
    }
}

const ListaProblemasConverter = {
    toFirestore: (/**@type {ListaProblemas} */ listaProblemas)=>({
        creador: listaProblemas.creador,
        fechaCreacion: listaProblemas.fechaCreacion, 
        descripcion: listaProblemas.descripcion, 
        nombre: listaProblemas.nombre, 
        estatusPublico: listaProblemas.estatusPublico, 
        likes: listaProblemas.likes, 
        probs: listaProblemas.probs,
        tags: listaProblemas.tags,
    }),
    fromFirestore: (snapshot, options)=>{
        const data = snapshot.data(options);
        let listaProblemas = new ListaProblemas();
        Object.assign(listaProblemas, data);
        listaProblemas.ref = snapshot.ref;
        return listaProblemas;
    }
}