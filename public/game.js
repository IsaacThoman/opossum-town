const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let assets = {};
let keys = {};
let player = {x:0, y:0, baseSpeed:2 ,speed:0, speedDampened:0, id:Math.random(), flip:1, flipDampened:1};

let onlinePlayerData = [];

let playerTextures = [new Image(), new Image()];
playerTextures[0].src = 'assets/opossum.webp';playerTextures[1].src = 'assets/opossum_flipped.webp';
let playerAsset = new Asset(playerTextures[0],80,44);

let onlinePlayerAsset = new Asset(playerTextures[0],80,44);
let onlinePlayerWorldObject = new WorldObject(onlinePlayerAsset,0,0,1);

for(let i = 1; i<=6; i++)
    assets["road"+i] = new Asset('assets/roads/road'+i+'.png',42,42);

function Asset(texture, w, h){
    if(typeof texture == 'string'){
        this.texture = new Image(); this.texture.src = texture;
    }else {
        this.texture = texture;
    }


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
        asset.draw(ctx2,this.x-screen.x +screen.w/2,-this.y+screen.y +screen.h/2,s);
    };
}

let frameOn=0;
let xVals = [];
let bg = new WorldObject(new Asset('assets/roadtest2.png', 1024,1024),0,0,1);
let worldObjects = [];
for(let i = -3; i<3; i++) {
    worldObjects.push(new WorldObject(assets["road2"],-42*3,i*42,1))
    worldObjects.push(new WorldObject(assets["road2"],-42*10,i*42,1))
    worldObjects.push(new WorldObject(assets["road1"],42*i-42*6,42*3,1))
    worldObjects.push(new WorldObject(assets["road1"],42*i-42*6,-42*4,1))

}
worldObjects.push(new WorldObject(assets['road3'],-42*3,42*3,1))
worldObjects.push(new WorldObject(assets['road6'],-42*3,-42*4,1))
worldObjects.push(new WorldObject(assets['road5'],-42*10,42*3,1))
worldObjects.push(new WorldObject(assets['road4'],-42*10,-42*4,1))

function doFrame(){
    clearDebug();
    updateRes();
    screen.x = player.x; screen.y = player.y;
    clearScreen();
    bg.draw(ctx);

    for(let i = 0; i<worldObjects.length; i++)
        worldObjects[i].draw(ctx);

    if(player.flipDampened>0) {playerAsset.w=80*player.flipDampened; playerAsset.texture = playerTextures[0];}
    else {playerAsset.w=80*Math.abs(player.flipDampened); playerAsset.texture = playerTextures[1];}
 //   playerAsset.h = 44+(player.speedDampened*0.5*Math.sin(frameOn/3))

    playerAsset.draw(ctx, screen.w/2, screen.h/2+(player.speedDampened*3/player.baseSpeed*Math.sin(frameOn/3)),1);

    for(let i = 0; i<onlinePlayerData.length; i++){
        onlinePlayerWorldObject.x = onlinePlayerData[i].x;
        onlinePlayerWorldObject.y = onlinePlayerData[i].y;
        if(onlinePlayerData[i].flip>0)
            onlinePlayerAsset.texture = playerTextures[0];
        else
            onlinePlayerAsset.texture = playerTextures[1];

        onlinePlayerWorldObject.draw(ctx);
    }

    addDebug('x: '+Math.floor(player.x) +' y: '+Math.floor(player.y));

    if(utcTime()-lastServerMessageTime>5) addDebug('not connected.');

    let addS = ''; if(onlinePlayerData.length>0) addS = 's';
    addDebug(onlinePlayerData.length +1+ ' player'+addS+' online');

//xVals[frameOn] = player.x;
//console.log(xVals[frameOn]-xVals[frameOn-15])

    processInputs();
    showDebugText();
    uploadPlayerData();

    frameOn++;
    if(player.x>512)player.x=512; if(player.x<-512) player.x=-512;
    if(player.y>512)player.y=512; if(player.y<-512)player.y=-512;

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
    ctx.fillStyle = "#211303";
    ctx.beginPath();
    ctx.fillRect(0,0,10000,10000);
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
    if(keyDown('a')){ xC-=1; player.flip = -1;}
    if(keyDown('d')) {xC+=1; player.flip = 1;}
    let angle = Math.atan2(yC,xC);
    if(keysDown(['w','a','s','d'])){ player.speed = player.baseSpeed; lastAngle = angle};

    player.x += player.speedDampened*Math.cos(lastAngle);
    player.y += player.speedDampened*Math.sin(lastAngle);

    if(player.speedDampened<0.001) player.speedDampened = 0;

    player.speedDampened = player.speedDampened + (player.speed-player.speedDampened)*0.2;
    player.flipDampened = player.flipDampened + (player.flip-player.flipDampened)*0.7;


}
var debugText = '';
function clearDebug(){debugText = '';}
function addDebug(text){debugText+=text+'\n'}
function showDebugText(){
    ctx.fillStyle = "#ff0000";
    ctx.font = '14px';
    let splitText = debugText.split('\n');
    for(let i = 0; i<splitText.length; i++)
        ctx.fillText(splitText[i], 2, 10*(1+i));
}