class Grupo{
    /**@type {String} */
    idGrupo;
    /**@type {String} */
    nombre;
    /**@type {String} */
    descripcion;
    /**@type {String} */
    esPublico;
    /**@type {Vector<Usuario>} */
    estudiantes;
    /**@type {Vector<Usuario>} */
    profesores;
    ref;
    constructor(){}
    async getEstudiantes(){
        return this.estudiantes.map(async estudiante=>{
            return (await estudiante.withConverter(UsuarioConverter).get()).data()
        })
    }
    async getProfesores(){
        return this.profesores.map(async profesor=>{
            return (await profesor.withConverter(UsuarioConverter).get()).data()
        })
    }
    async getTareas(){
        let collection = await this.ref.collection('tareas').withConverter(TareaConverter).get();
        return collection.docs.map(doc=>doc.data())
    }

    async crearTarea(/** @type {Tarea} */ tarea){
        return await this.ref.collection('taras').withConverter(TareaConverter).add(tarea);
    } 

}

const GrupoConverter = {
    toFirestore: (/** @type {Grupo} */ grupo)=>({
        idGrupo: grupo.idGrupo,
        nombre: grupo.nombre,
        descripcion: grupo.descripcion, 
        esPublico: grupo.esPublico,
        estudiantes: grupo.estudiantes,
        profesores: grupo.profesores
    }),
    fromFirestore: (snapshot, options)=>{
        const data = snapshot.data(options);
        let grupo = new Grupo();
        Object.assign(grupo, data);
        grupo.ref = snapshot.ref;
        return grupo;
    }
}