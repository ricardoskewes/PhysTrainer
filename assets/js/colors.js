//Array colores disponibles


class Colors {
    
    constructor(){
        this.colPrim = Colors.colores[Math.floor(Math.random()*Colors.colores.length)];
        this.coloresUtilizados = [this.colPrim];
        this.root.style.setProperty('--main_color', this.colPrim);
        
        for (let i = 1; i <= this.numberOfSecondaryColors; i++) {
            let str = "--secondary_color-"+i;
            this.root.style.setProperty(str, this.seleccionarColor());
            
        }
    }
    static colores = [
        "#6EE744",
        "#D0E744",
        "#E744A6",
        "#44E7C0",
        "#44E78F", 
        "#44C9E7",
        "#8244E7",
        "#E7446B",
    ];

    root = document.documentElement;
    numberOfSecondaryColors = 7;

    seleccionarColor() {
        let color = Colors.colores[Math.floor(Math.random()*Colors.colores.length)];
        if(this.coloresUtilizados.includes(color)){
            return this.seleccionarColor();
        } else{
            this.coloresUtilizados.push(color);
            return color;
        }
    }

    //Este método sirve para elegir un color de entre los secundarios 
    //ya seleccionados, que no se incluya entre aquellos del parámetro arr
    seleccionarColorSecundario(arr) {
        let color = this.coloresUtilizados[Math.floor(Math.random()*this.coloresUtilizados.length)];
        if(arr.includes(color) || color===this.colPrim){
            return this.seleccionarColorSecundario(arr);
        } else{
            return color;
        }
    }

    

    generateBlobsInDiv(div, times){
        let coloresDeBlobUtilizados = [];
        for(let i = 0; i<times; i++){
            let colorBlob = this.seleccionarColorSecundario(coloresDeBlobUtilizados);
            coloresDeBlobUtilizados.push(colorBlob);
            const svgString = blobs2.svg(
                {
                    seed: Math.random(),
                    extraPoints: Math.floor(Math.random()*5)+3,
                    randomness: Math.floor(Math.random()*5)+1,
                    size: Math.random()*300 + 100,
                },
                {
                    fill: colorBlob
                },
            );

            div.innerHTML+=svgString;
            var ultimoBlob = div.querySelector("svg:last-of-type");
            ultimoBlob.style.opacity = 0.3+Math.random()*0.6;
            ultimoBlob.style.position = 'absolute';
            ultimoBlob.style.bottom =  (-20 + Math.random()*70) + "%";
            ultimoBlob.style.left = (-10 + Math.random()*90) + "%";


            }            
        

    }

    
}











