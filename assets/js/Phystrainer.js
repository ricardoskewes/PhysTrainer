class PhysTrainerProblem{
    static aleatorioEntre = (min, max) => Math.random() * (max - min) + min;
    //Unidades fundamentales: [m, g, s, A, K, cd, mol] (NOTA: La Unidad Fundamental de masa en el SI es kg, pero se tomará como g para simplificar el código)
    static MAGNITUDES = {
        masa: [-4,5, "m", [0,1,0,0,0,0,0], "Masa"],
        densidad: [-3, 5, "rho", [-3,1,0,0,0,0,0], "Densidad"],
        volumen: [-9, 1, "V" ,[3,0,0,0,0,0,0], "Volumen"],
        area: [-6, 1, "A" ,[2,0,0,0,0,0,0], "Área"],
        longitud: [-4,1, "l" ,[1,0,0,0,0,0,0], "Longitud"],
        velocidad: [-3, 2, "v" ,[1,0,-1,0,0,0,0], "Velocidad"],
        tiempo: [-2, 3, "t", [0,0,1,0,0,0,0], "Tiempo"],
        aceleracion: [-2, 1.2, "a", [1,0,-2,0,0,0,0], "Aceleración"],
        fuerza: [-1, 7, "F", [1,1,-2,0,0,0,0], "Fuerza"],
        velAngular: [-2, 1, "omega", [0,0,-1,0,0,0,0], "Velocidad Angular"],
        voltaje: [-1, 5, "V", [2, 1, -3, -1, 0, 0, 0], "Voltaje"],
        corriente: [-5, -1, "I", [0,0,0,1,0,0,0], "Corriente eléctrica"],
        temperatura:[2.38, 2.77, "T", [0,0,0,0,1,0,0], "Temperatura"],
        torque: [0, 9, "tau", [2,1,-2,0,0,0,0], "Torque"], 
        resistencia: [-1, 10, "R", [2, 1, -3, -2], "Resistencia"],
        coefFriccion: [-2, 0.05, "mu", [0,0,0,0,0,0,0], "Coeficiente de fricción"]
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
                this.params = [NaN, NaN];
        }
        return this.funcion;
    }

    //Hallar exponente apropiado para la variable independiente
    _expVariableIndep(){
        if(PhysTrainerProblem.MAGNITUDES[this.magX][0]>=0){
            return PhysTrainerProblem.MAGNITUDES[this.magX][0] - ((PhysTrainerProblem.MAGNITUDES[this.magX][0])%3);

        }else {
            return PhysTrainerProblem.MAGNITUDES[this.magX][0]-3 -(PhysTrainerProblem.MAGNITUDES[this.magX][0]-3)%3;
        }
    }


    //Elegir un prefijo correcto
    _unidadConPrefijo(aDimensional, exponente) {
        let str = "";
        var exponenteIgualAUno = false;
        //Buscar si existe algun exponente 1 para ponerlo al principio, a la derecha del prefijo. Solo basta encontrar el primero (de haberlo)
        for (let k = 0; k< aDimensional.length; k++) {
            if(aDimensional[k]==1){
                exponenteIgualAUno = k
                break;
            }
        }
        //Si no hay ningún exponente igual a uno, olvidarse de los prefijos y solo poner 10^
        if(exponenteIgualAUno===false){ //Importante el "===". De otra forma, la posición cero sería equivalente a false. 
            if(exponente != 0){//Importante que sean nested if... si no, hay casos donde se va a la condicion de abajo. Este condicional está, pues no tiene sentido escribir 10^0. 
                str += "\\times 10^{" + exponente + "}";
            }
        } else{
                switch (exponente) {
                    case -12:
                        str = "\\text{p}";
                        break;
                    case -9:
                        str = "\\text{n}";
                        break;
                    case -6:
                        str = "\\mu";
                        break;
                    case -3:
                        str = "\\text{m}";
                        break;
                    case -2:
                        str = "\\text{c}";
                        break;
                    case -1:
                        str = "\\text{m}";
                        break;
                    case 0:
                        str = "";
                        break;
                    case 1:
                        str = "\\text{da}";
                        break;
                    case 2:
                        str = "\\text{h}";
                        break;
                    case 3:
                        str = "\\text{k}";
                        break;
                    case 6:
                        str = "\\text{M}";
                        break;
                    case 9:
                        str = "\\text{G}";
                        break;
                    case 12:
                        str = "\\text{T}";
                        break;
                    default:
                        console.log("Pérdoname, pero no. Hubo un error con el método _unidadConPrefijo()");
                        break;
                
                }

        }
        

        const dimensiones = ['\\text{m}', '\\text{g}', '\\text{s}', '\\text{A}','\\text{K}', '\\text{cd}', '\\text{mol}'];
        //Iterar array dimensional [m, g, s, A, K, cd, mol]

        var primeraUnidad = true; //Identificar cuando la unidad por ponerse es la primera. De esta forma, no es necesario agregar \cdot. 

        if(exponenteIgualAUno!== false){
            str += dimensiones[exponenteIgualAUno];
            primeraUnidad = false
        }

        for (let j = 0; j< aDimensional.length; j++) {
            if(j === exponenteIgualAUno){
                continue;
            }
            if(aDimensional[j]==0){
                continue;
            } else if(aDimensional[j]==1){
                str += (primeraUnidad ? "": "\\cdot") +  dimensiones[j];
                primeraUnidad = false;
            } else{
                str += (primeraUnidad? "": "\\cdot") + dimensiones[j] + "^{" + aDimensional[j] + "}";
                primeraUnidad = false;
            }
        }

        return str ;
        


    }
    constructor(o={}){
        let relaciones = [
            "lineal",
            "exponencial",
            "potencial"
            //"sinusoidal"
          ];
        //elegir una relación al azar
        this.relacion = relaciones[Math.floor(Math.random()*relaciones.length)];
        console.log("La relación es de tipo: " + this.relacion);
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
        let medicion = PhysTrainerProblem.randn_bm(this.funcion(x), .05);
        console.log("Medición: " + medicion);
        let exponenteUnidades = 0;
        if(Math.log10(Math.abs(medicion))>=0){
            exponenteUnidades = Math.log10(Math.abs(medicion))-((Math.log10(Math.abs(medicion)))%3);

        }else {
            exponenteUnidades = (Math.log10(Math.abs(medicion))-3)-((Math.log10(Math.abs(medicion))-3)%3);
        }
        console.log("Exponente unidades: " + exponenteUnidades);
        let medicionUnidadesApropiadas = [medicion/Math.pow(10,exponenteUnidades), this._unidadConPrefijo(PhysTrainerProblem.MAGNITUDES[this.magY][3],exponenteUnidades)];
        console.log("La medición con unidades apropiadas es: " + medicionUnidadesApropiadas.toString());
        return medicionUnidadesApropiadas;

    }
    


    

    

    


    
    
    


    

}

