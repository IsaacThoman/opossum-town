const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let assets = {};
let keys = {};
let player = {x:0, y:0, baseSpeed:2 ,speed:0, speedDampened:0};
let worldObjects =
assets["opossum"] = new Asset('assets/opossum.webp', 80,44);
assets["building"] = new Asset('assets/Untitled-1.png', 160,160);
assets["bg"] = new Asset('assets/roadtest2.png', 1024,1024);
function Asset(texture, w, h){
    this.texture = new Image(); this.texture.src = texture;
    this.w = w;
    this.h = h;
    this.draw = function(ctx2, x, y, s){
        ctx2.drawImage(this.texture, x-(this.w*s)/2, y-(this.h*s)/2, this.w*s, this.h*s);
    };
}
function WorldObject(asset, x, y, s){
    this.asset = asset;
    this.x = x;
    this.y = y;
    this.s = s;
    this.draw = function(ctx2){
       asset.draw(ctx2,x+screen.x +screen.w/2,y+screen.y +screen.h/2,s);
    };
}

let frameOn=0;
let xVals = [];
let bg = new WorldObject(assets["bg"],0,0,1)
function doFrame(){

    updateRes();
    screen.x = player.x; screen.y = player.y;
    clearScreen();
    bg.draw(ctx);

    assets["opossum"].draw(ctx, screen.w/2, screen.h/2+(player.speedDampened*3/player.baseSpeed*Math.sin(frameOn/3)),1);
    player.speedDampened = player.speedDampened + (player.speed-player.speedDampened)*0.2;




//xVals[frameOn] = player.x;
//console.log(xVals[frameOn]-xVals[frameOn-15])

    processInputs();

    frameOn++;
    requestAnimationFrame(doFrame);
}
requestAnimationFrame(doFrame);


let screen = {res:320, w:0,h:0, x:0, y:0};
function updateRes(){

    let ratio = window.innerWidth/window.innerHeight;
    screen.w = screen.res*ratio;
    screen.h = screen.res;

    ctx.canvas.width = screen.w;
    ctx.canvas.height = screen.h;

    canvas.style.width = window.innerWidth+"px";
    canvas.style.height = window.innerHeight+"px";
}

function clearScreen(){
    ctx.fillStyle = "#6c6c6c";
    ctx.beginPath();
    ctx.fillRect(0,0,10000,10000);
    ctx.closePath();


    ctx.fillStyle = "#a12929";
    ctx.beginPath();
    ctx.fillRect(0,0,42,42);
    ctx.closePath();

}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
function keyDownHandler(e){keys[e.key] = true;}
function keyUpHandler(e){keys[e.key] = false;}
function keyDown(key){
    if(!(key in keys))
        return false;
    return keys[key];
}
function keysDown(keysIn){
    for(let i = 0; i<keysIn.length; i++)
        if(keyDown(keysIn[i]))
            return true;
    return false;
}

let lastAngle = 0;
function processInputs(){
    let xC = 0;
    let yC = 0;
    player.speed = 0;
    if(keyDown('w')) yC+=1;
    if(keyDown('s')) yC-=1;
    if(keyDown('a')) xC+=1;
    if(keyDown('d')) xC-=1;
    let angle = Math.atan2(yC,xC);
    if(keysDown(['w','a','s','d'])){ player.speed = player.baseSpeed; lastAngle = angle};




        player.x += player.speedDampened*Math.cos(lastAngle);
        player.y += player.speedDampened*Math.sin(lastAngle);


}