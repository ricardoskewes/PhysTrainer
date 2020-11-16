class PhysTrainerProblem{
    static aleatorioEntre = (min, max) => Math.random() * (max - min) + min;
    //Unidades fundamentales: [m, g, s, A, K, cd, mol] (NOTA: La Unidad Fundamental de masa en el SI es kg, pero se tomará como g para simplificar el código)
    static MAGNITUDES = {
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
    //Error gaussiano. DISTRIBUCIÓN NORMAL USANDO LA TRANSFORMACIÓN DE BOX-MULLER.
    static randn_bm(mu, delta) {
        let u = 0, 
            v = 0, 
            sigma = delta*mu;
        while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
        while(v === 0) v = Math.random();
        return sigma*Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v )+mu;
        
    }
    // seleccionar valor aleatorio
    _escogerMagnitud(){
        var keys = Object.keys(PhysTrainerProblem.MAGNITUDES);
        return keys[ keys.length * Math.random() << 0];
    }
    //Encontrar mínimo y máximo a través de escala log
    _hallarRangoLog(expMin, expMax) {
        let lim1 = 0,
            lim2 = 0;
        do {
            lim1 = PhysTrainerProblem.aleatorioEntre(expMin, expMax);
            lim2 = PhysTrainerProblem.aleatorioEntre(expMin, expMax);
        } while (Math.abs(lim1-lim2)>2);
    
        return [lim1, lim2];
    }
    //y = Ax + B
    _generarParamLineal(limX, limY) {
        let A_lim = Math.abs((Math.pow(10,limY[1])-Math.pow(10,limX[0]))/(Math.pow(10,limX[1])-Math.pow(10,limY[0])))
        //Pendiente
        let A = PhysTrainerProblem.aleatorioEntre(-A_lim, A_lim);
        //Punto Pruebaf
        let x0 = PhysTrainerProblem.aleatorioEntre(Math.pow(10,limX[0]), Math.pow(10,limX[1]));
        let y0 = PhysTrainerProblem.aleatorioEntre(Math.pow(10,limY[0]), Math.pow(10,limY[1]));
        //Ordenada
        let B = y0-A*x0;
        this.params = [A, B]
        this.funcion = (x)=>A*x + B;
    }
    // y = Ae^(Bx)
    _generarParamExponencial(limX,limY) {
        let P_log_lim = Math.abs((limY[1]-limY[0])/(Math.pow(10,limX[1])-Math.pow(10,limX[0])));
        //Pendiente
        let P_log = PhysTrainerProblem.aleatorioEntre(-P_log_lim, P_log_lim);
        //Punto Prueba
        let x0 = PhysTrainerProblem.aleatorioEntre(Math.pow(10, limX[0]), Math.pow(10,limX[1]));
        let y0 = PhysTrainerProblem.aleatorioEntre(limY[0], limY[1]);
        //Ordenada 
        let O_log = y0-P_log*x0;
        // Valores de A y B
        let A = Math.pow(10, O_log);
        let B = P_log/Math.log10(Math.E);
        this.params = [A, B]
        this.funcion = (x)=>A*Math.exp(B*x);
    }
    // y = Ax^B
    _generarParamPotencial(limX,limY) {
        let B_lim = Math.abs((limY[1]-limY[0])/(limX[1]-limX[0]));
        //Pendiente
        let B = PhysTrainerProblem.aleatorioEntre(-B_lim, B_lim);
        //Punto Prueba
        let x0 = PhysTrainerProblem.aleatorioEntre(limX[0], limX[1]);
        let y0 = PhysTrainerProblem.aleatorioEntre(limY[0], limY[1]);
        //Ordenada 
        let O_log = y0-B*x0;
        // Generar A
        let A = Math.pow(10, O_log);
        this.params = [A, B]
        this.funcion = (x)=>A*Math.pow(x, B)
    }
    // Generar valores a partir del tipo de relacion
    _generarFuncionYParametros() {
        switch(this.relacion){
            case 'lineal':
                this._generarParamLineal(this.rangoX, this.rangoY);
                break;
            case 'potencial':
                this._generarParamPotencial(this.rangoX, this.rangoY);
                break;
            case 'exponencial':
                this._generarParamExponencial(this.rangoX, this.rangoY);
                break;
            /*
            case 'sinusoidal':
                this._generarParamSinusoidal(this.rangoX, this.rangoY);
                break
            */
            default:
                this.funcion = (x) => 0;
                this.params = [NaN, NaN]
        }
        return this.funcion;
    }
    
    constructor(relacion, o={}){
        this.relacion = relacion;
        //Escoger qué graficar en X y en Y
        this.magX = this._escogerMagnitud();
        this.magY = this._escogerMagnitud();
        //Hallar rango característico para X y Y
        this.rangoX = this._hallarRangoLog(PhysTrainerProblem.MAGNITUDES[this.magX][0], PhysTrainerProblem.MAGNITUDES[this.magX][1]);
        this.rangoY = this._hallarRangoLog(PhysTrainerProblem.MAGNITUDES[this.magY][0], PhysTrainerProblem.MAGNITUDES[this.magY][1]);
        //Generar parámetros y función para experimento [A, B, C]:
        this._generarFuncionYParametros();
    }
    calcularValores(x){
        let medicion = PhysTrainerProblem.randn_bm(this.funcion(x), .05)
        // document.getElementById("#variable-dependiente-valor").innerHTML = medicion;
        // console.log(medicion)
        return medicion
    }
    


    

    

    


    
    
    


    

}

