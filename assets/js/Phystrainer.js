const aleatorioEntre = (min, max) => Math.random() * (max - min) + min;
class PhysTrainerProblem{
    constructor(relacion, o={}){
        this.relacion = relacion;
        // a
        this.a_min = o.a_min || -10;
        this.a_max = o.a_max || 10;
        // b
        this.b_min = o.b_min || -10;
        this.b_max = o.b_max || 10;
        // c
        this.c_min = o.c_min || -10;
        this.c_max = o.c_max || 10;
        // x
        this.x_min = o.x_min || -10;
        this.x_max = o.x_max || 10;
        this.x_step = o.x_step || 0.1;
        // error
        this.error_min = o.error_min || -0.8;
        this.error_max = o.error_max || 0.8;

        this._generarParametros();
        this._generarFuncion();
        this._generarValores();
    }
    // Metodo privado: asigna valores aleatorios a: a, b, c
    _generarParametros(){
        this.a = aleatorioEntre(this.a_min, this.a_max);
        this.b = aleatorioEntre(this.b_min, this.b_max);
        this.c = aleatorioEntre(this.c_min, this.c_max);
    }
    // Metodo privado: genera funcion f
    _generarFuncion(){
        switch(this.relacion){
            case 'lineal':
                this.f = (x) => this.a*x + this.b;
                break;
            case 'potencial':
                this.f = (x) => this.a*Math.pow(x, this.b);
                break;
            case 'exponencial':
                this.f = (x) => this.a*Math.exp(-this.b*x);
                break;
            case 'sinoidal':
                this.f = (x) => this.a*Math.cos(this.b*x - this.c);
                break;
            default:
                this.f = (x) => 0;
                break;
        }
        return this.f;
    }
    // Metodo privado: genera set de datos
    _generarValores(){
        this.valores = {};
        for(let x = this.x_min; x < this.x_max; x += this.x_step){
            // Generar aqui el error.
            let error = aleatorioEntre(this.error_min, this.error_max);
            this.valores[Number(x).toFixed(3)] = this.f(x)*(1+error);
        }
    }
}


