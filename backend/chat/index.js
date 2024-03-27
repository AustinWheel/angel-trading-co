const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
    },
});

io.on("connection", (socket) => {
    socket.on("join_room", (data) => {
        socket.join(data);
    });

    socket.on("send_msg", ({ messageText, room }) => {
        // Emit the message to all clients in the room except the sender
        socket.to(room).emit("receive_msg", { text: messageText });
    });
});


server.listen(3001, () => {
    console.log("Server is running");
})