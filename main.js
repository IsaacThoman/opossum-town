const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});
app.use(express.static('public'));

server.listen(3000, () => {
    console.log('listening on *:3000');
});

io.on("connection", (socket) => {
    // send a message to the client
    socket.emit("serverMessage", 'hello');

});