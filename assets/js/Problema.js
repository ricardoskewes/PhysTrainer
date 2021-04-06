/**
 * FASE 2
 * IMPORTANTE!!
 * Deberá dedicarse bastante tiempo para planear bien los problemas
 */

class ProblemaInciso{
    enunciado;
    pistas;
    pregunta;
    puntaje;
    respuesta;
    solucion;
    tipo;
    constructor(){}

    responder(respuesta){
        if(this.tipo == 'simbolico'){
            return KAS.compare( KAS.parse(this.respuesta).expr, KAS.parse(respuesta).expr ).equal;
        }
    }

}
class Problema{
    comentarios;
    dificultad;
    tagsProblema;
    titulo;
    votosDificultad;
    incisos;
    constructor(){}
    agregarInciso(){

    }
}

const ProblemaConverter = {
    toFirestore: (/**@type {Problema} */ problema)=>({
        comentarios: problema.comentarios,
        dificultad: problema.dificultad, 
        tagsProblema: problema.tagsProblema, 
        titulo: problema.titulo, 
        votosDificultad: problema.votosDificultad, 
        incisos: problema.incisos.map(( /**@type {ProblemaInciso} */ inciso)=>({
            enunciado: inciso.enunciado,
            pistas: inciso.pistas, 
            puntaje: inciso.puntaje, 
            respuesta: inciso.respuesta, 
            solucion: inciso.solucion, 
            tipo: inciso.tipo
        }))
    }), 
    fromFirestore: (snapshot, options)=>{
        const data = snapshot.data(options);
        let problema = new Problema();
        data.incisos = data.incisos.map(d=>{
            let inciso = new ProblemaInciso();
            Object.assign(inciso, d);
            return inciso;
        })
        Object.assign(problema, data);
        return problema;
    }
}