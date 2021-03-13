const colores = [
    "#6EE744",
    "#D0E744",
    "#E744A6",
    "#44E7C0",
    "#44E78F", 
    "#44C9E7",
    "#8244E7",
    "#E7446B",
];
const colPrim = colores[Math.floor(Math.random()*colores.length)];
let root = document.documentElement;
root.style.setProperty('--main_color', colPrim);
var coloresUtilizados = [colPrim];

for (let i = 1; i < 5; i++) {
    let str = "--secondary_color-"+i;
    root.style.setProperty(str, seleccionarColor());
}

console.log(root.style.getPropertyValue("--secondary_color-1"))

function seleccionarColor() {
    let color = colores[Math.floor(Math.random()*colores.length)];
    if(coloresUtilizados.includes(color)){
        return seleccionarColor();
    } else{
        coloresUtilizados.push(color);
        return color;
    }
}