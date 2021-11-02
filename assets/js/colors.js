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
    numberOfSecondaryColors = 5;

    seleccionarColor() {
        let color = Colors.colores[Math.floor(Math.random()*Colors.colores.length)];
        if(this.coloresUtilizados.includes(color)){
            return this.seleccionarColor();
        } else{
            this.coloresUtilizados.push(color);
            return color;
        }
    }

    generateBlobsInDiv(div, times){
        for(let i = 0; i<times; i++){
            var r = Math.floor(Math.random()*this.numberOfSecondaryColors)+1;
            const svgString = blobs2.svg(
                {
                    seed: Math.random(),
                    extraPoints: Math.floor(Math.random()*5)+3,
                    randomness: Math.floor(Math.random()*5)+1,
                    size: Math.random()*300 + 100,
                },
                {
                    fill: `var(--secondary_color-${r})`,
                },
            );
            
            div.innerHTML+=svgString;
        }
    }

    
}











