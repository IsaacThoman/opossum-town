const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let assets = {};
assets["opossum"] = new Image(); assets["opossum"].src = 'assets/opossum.webp';


let frameCount = 0;
function doFrame(){

    updateRes();
    clearScreen();
    ctx.drawImage(assets["opossum"],screen.width/2-40,screen.height/2-22,80,44);

    frameCount++;


    requestAnimationFrame(doFrame);
}
requestAnimationFrame(doFrame);


let screen = {res:320, width:0,height:0};
function updateRes(){
    let ratio = window.innerWidth/window.innerHeight;
    screen.width = screen.res*ratio;
    screen.height = screen.res;

    ctx.canvas.width = screen.width;
    ctx.canvas.height = screen.height;

    canvas.style.width = window.innerWidth+"px";
    canvas.style.height = window.innerHeight+"px";
}

function clearScreen(){
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.fillRect(0,0,10000,10000);
    ctx.closePath();
}