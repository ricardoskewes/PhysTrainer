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

customElements.define('grupo-card', class extends HTMLElement{
    constructor(){
        super();
        if(this.attributes.length>0) this.render();
    }
    render(){
        this.innerHTML = "";
        this.nombre = this.getAttribute('nombre');
        this.descripcion = this.getAttribute('descripcion');

        let grupo = Object.assign(document.createElement('span'), {className: 'grupo', innerHTML: 'grupo'})
        let nombre = Object.assign(document.createElement('span'), {className: 'nombre', innerHTML: this.nombre})
        let descripcion = Object.assign(document.createElement('span'), {className: 'descripcion', innerHTML: this.descripcion})

        this.append(grupo, nombre, descripcion)

    }
})