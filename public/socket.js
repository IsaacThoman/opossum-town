const socket = io();
// send a message to the server
socket.emit("hello from client",'ball');

// receive a message from the server
socket.on('serverMessage', function(msg) {
lastServerMessage = msg;
});