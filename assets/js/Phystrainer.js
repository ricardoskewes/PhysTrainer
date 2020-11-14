


/*
const magX = "volumen";
const magY = "masa";
const rangoX = hallarRangoLog(magnitudes[magX][0], magnitudes[magX][1]);
const rangoY = hallarRangoLog(magnitudes[magY][0], magnitudes[magY][1]);
const parametros = generarParamLineal(rangoX, rangoY);
 */


    




//Creo que esto lo vamos a tener que cambiar... :(
const aleatorioEntre = (min, max) => Math.random() * (max - min) + min;
class PhysTrainerProblem{
    constructor(relacion, o={}){
        this.relacion = relacion;

        //Unidades fundamentales: [m, g, s, A, K, cd, mol] (NOTA: La Unidad Fundamental de masa en el SI es kg, pero se tomará como g para simplificar el código)
        this.magnitudes = {
            masa: [-4,5, "m", [0,1,0,0,0,0,0]],
            densidad: [-3, 5, "rho" ,[-3,1,0,0,0,0,0]],
            volumen: [-9, 1, "V" ,[3,0,0,0,0,0,0]],
            area: [-6, 1, "A" ,[2,0,0,0,0,0,0]],
            longitud: [-4,1, "l" ,[1,0,0,0,0,0,0]],
            velocidad: [-3, 2, "v" ,[1,0,-1,0,0,0,0]],
            tiempo: [-2, 3, "t", [0,0,1,0,0,0,0]],
            aceleracion: [-2, 1.2, "a", [1,0,-2,0,0,0,0]],
            fuerza: [-1, 7, "F", [1,1,-2,0,0,0,0]],
            velAngular: [-2, 1, "omega", [0,0,-1,0,0,0,0]],
            voltaje: [-1, 5, "V", [2, 1, -3, -1, 0, 0, 0]],
            corriente: [-5, -1, "I", [0,0,0,1,0,0,0]],
            temperatura:[2.38, 2.77, "T", [0,0,0,0,1,0,0]],
            torque: [0, 9, "tau", [2,1,-2,0,0,0,0]], 
            resistencia: [-1, 10, "R", [2, 1, -3, -2]],
            coefFriccion: [-2, 0.05, "mu", [0,0,0,0,0,0,0]]
        }
        //Escoger qué graficar en X y en Y
        this.magX = this._escogerMagnitud();
        this.magY = this._escogerMagnitud();
        //Hallar rango característico para X y Y
        this.rangoX = this.hallarRangoLog(this.magnitudes[this.magX][0], this.magnitudes[this.magX][1]);
        this.rangoY = this.hallarRangoLog(this.magnitudes[this.magY][0], this.magnitudes[this.magY][1]);

        //Generar parámetros y función para experimento [A, B, C]:
        this._generarFuncionYParametros();

        /* // a
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
        this._generarValores(); */
    }

    _escogerMagnitud(){
        var keys = Object.keys(this.magnitudes);
        return keys[ keys.length * Math.random() << 0];
    }
    //Encontrar mínimo y máximo a través de escala log
    _hallarRangoLog(expMin, expMax) {
        do {
            lim1 = aleatorioEntre(expMin, expMax);
            lim2 = aleatorioEntre(expMin, expMax);
        } while (Math.abs(lim1-lim2)>2);
    
        return [lim1, lim2];
    }

    //y = Ax + B
    _generarParamLineal(limX, limY) {
        A_lim = Math.abs((Math.pow(10,limY[1])-Math.pow(10,limX[0]))/(Math.pow(10,limX[1])-Math.pow(10,limY[0])))
        //Pendiente
        A = aleatorioEntre(-A_lim, A_lim);
        //Punto Pruebaf
        x0 = aleatorioEntre(Math.pow(10,limX[0]), Math.pow(10,limX[1]));
        y0 = aleatorioEntre(Math.pow(10,limY[0]), Math.pow(10,limY[1]));
        //Ordenada
        B = y0-A*x0;
        return [A, B];
    }

    // y = Ae^(Bx)
    _generarParamExponencial(limX,limY) {
        P_log_lim = Math.abs((limY[1]-limY[0])/(Math.pow(10,limX[1])-Math.pow(10,limX[0])));
        //Pendiente
        P_log = aleatorioEntre(-P_log_lim, P_log_lim);
        //Punto Prueba
        x0 = aleatorioEntre(Math.pow(10, limX[0]), Math.pow(10,limX[1]));
        y0 = aleatorioEntre(limY[0], limY[1]);
        //Ordenada 
        O_log = y0-P_log*x0;
        
        A = Math.pow(10, O_log);
        B = P_log/Math.log10(Math.E);

        return [A, B];
    }

    // y = Ax^B
    _generarParamPotencial(limX,limY) {
        B_lim = Math.abs((limY[1]-limY[0])/(limX[1]-limX[0]));
        //Pendiente
        B = aleatorioEntre(-B_lim, B_lim);
        //Punto Prueba
        x0 = aleatorioEntre(limX[0], limX[1]);
        y0 = aleatorioEntre(limY[0], limY[1]);
        //Ordenada 
        O_log = y0-B*x0;
        
        A = Math.pow(10, O_log);

        return [A, B];
    }


    _generarFuncionYParametros() {
        switch(this.relacion){
            case 'lineal':
                this.param = generarParamLineal(this.rangoX, this.rangoY);
                this.funcion = (x) => this.param[0]*x + this.param[1];
                break;
            case 'potencial':
                this.param = this._generarParamPotencial(this.rangoX, this.rangoY);
                this.funcion =  (x) => this.param[0]*Math.pow(x, this.param[1]);
                break;
            case 'exponencial':
                this.param = this._generarParamExponencial(this.rangoX, this.rangoY);
                this.funcion = (x) => this.param[0]*Math.exp(this.param[1]*x);
                break;
            /*
            case 'sinusoidal':
                this.param = this._generarParamSinusoidal(this.rangoX, this.rangoY);
                funcion = (x) => param[0]*Math.cos(param[1]*x - param[2]);
                break
            */
            default:
                funcion = (x) => 0;
        }
        return funcion;
    }
    
    //Error gaussiano. DISTRIBUCIÓN NORMAL USANDO LA TRANSFORMACIÓN DE BOX-MULLER.
    _randn_bm(mu, delta) {
        var u = 0, v = 0, sigma = delta*mu;
        while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
        while(v === 0) v = Math.random();
        return sigma*Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v )+mu;
        
    }


    static calcularValores(x){
        let medicion = this._randn_bm(this.funcion(x), .05)
        document.getElementById("#variable-dependiente-valor").innerHTML = medicion;
        console.log(medicion)
    }

}


/*  
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


*/