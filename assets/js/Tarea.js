class Tarea{
    /**@type {String} */
    descripcion;
    /**@type {Date} */
    fechaLimiteEntrega;
    /**@type {Boolean} */
    habilitada;
    /**@type {Number} */
    numeroIntentos;
    /**@type {Array<Problema>} */
    problemas;
    /**@type {String} */
    titulo;
    ref;
    constructor(){}
    getEntregas(){
        let collection = this.ref.collection('entregas').withConverter(TareaEntregaConverter).get();
        return collection.docs.map(doc=>doc.data())
    }
    async getProblemas(){
        return this.problemas.map(async problema=>{
            return (await problema.withConverter(ProblemaConverter).get()).data()
        })
    }
}

class TareaEntrega{
    calificacion;
    comentarios;
    estudiante;
    fechaDeEntrega;
    ref;
    constructor(){}
}


const TareaConverter = {
    toFirestore: (/**@type {Tarea} */ tarea)=>({
        descripcion: tarea.descripcion, 
        fechaLimiteEntrega: new firebase.firestore.Timestamp(tarea.fechaLimiteEntrega.getTime()),
        habilitada: tarea.habilitada, 
        numeroIntentos: tarea.numeroIntentos, 
        problemas: tarea.problemas, 
        titulo: tarea.titulo
    }),
    fromFirestore: (snapshot, options)=>{
        const data = snapshot.data(options);
        let tarea = new Tarea();
        Object.assign(tarea, data);
        tarea.ref = snapshot.ref;
        return tarea;
    }
}

const TareaEntregaConverter = {
    toFirestore: (/**@type {TareaEntrega}*/ tareaEntrega)=>({
        calificacion: tareaEntrega.calificacion, 
        comentarios: tareaEntrega.comentarios, 
        estudiante: tareaEntrega.estudiante, 
        fechaDeEntrega: tareaEntrega.fechaDeEntrega
    }),
    fromFirestore: (snapshot, options)=>{
        const data = snapshot.data(options);
        let tareaEntrega = new TareaEntrega();
        Object.assign(tareaEntrega, data);
        tareaEntrega.ref = snapshot.ref;
        return tareaEntrega;
    }
}