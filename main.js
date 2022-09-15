const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
function utcTime(){
    return (new Date()).getTime() / 1000;
}
let playerData = [];
let lastEmit = utcTime();
let lastClean = utcTime();

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});
app.use(express.static('public'));

server.listen(3000, () => {
    console.log('listening on *:3000');
});
let count = 0;
io.on("connection", (socket) => {
    // send a message to the client

    socket.on('playerData', (msg) => {
        enterPlayerData(msg);
        if(utcTime()-lastEmit>0.06) {
            io.emit("serverMessage", playerData);
            lastEmit = utcTime();
        }
        if(utcTime()-lastClean>1) {
            cleanPlayerData();
            lastClean = utcTime();
        }
    })

});

function enterPlayerData(player){
    if(typeof player.x != 'number' || typeof player.y != 'number' || typeof player.speedDampened != 'number') return;
    let updated = false;
    player.lastUpdate = utcTime();
    for(let i = 0; i<playerData.length; i++)
        if(playerData[i].id == player.id) {playerData[i] = player; updated = true;}

    if(!updated)
        playerData.push(player);

}

function cleanPlayerData(){
    let newPlayerData = [];
    for(let i = 0; i<playerData.length; i++){
        if(utcTime() - playerData[i].lastUpdate<5)
            newPlayerData.push(playerData[i]);
    }
    playerData = newPlayerData;
}