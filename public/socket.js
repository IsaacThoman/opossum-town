const socket = io();
// send a message to the server

// receive a message from the server
socket.on('serverMessage', function(msg) {
    onlinePlayerData = [];
    for(let i = 0; i<msg.length; i++)
        if(typeof msg[i].id == 'number'&&msg[i].id != player.id)
            onlinePlayerData.push(msg[i]);

lastServerMessageTime = utcTime();
});

let lastServerMessageTime = 0;
let lastUpload = {};
let lastUploadTime = 0;
function uploadPlayerData() {
    let lastUploadNew = 'x'+player.x+'y'+player.y+'sD'+player.speedDampened;
    if((lastUploadNew!=lastUpload&& utcTime()-lastUploadTime>0.1) || (utcTime()-lastUploadTime>3)) {
        socket.emit('playerData', player);
        lastUploadTime = utcTime();
        lastUpload = lastUploadNew;
    }

}

function utcTime(){
    return (new Date()).getTime() / 1000;
}
