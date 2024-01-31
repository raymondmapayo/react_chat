const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require("socket.io");

app.use(cors({
    origin: "http://localhost:5173",  // Replace with your frontend origin
    methods: ["GET", "POST"],
}));

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",  // Replace with your frontend origin
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("join_room", (room) => {
        socket.join(room);
        console.log(`User ${socket.id} joined room: ${room}`);
    });

    socket.on("send_message", (messageData) => {
        // Process the messageData as needed
        // You might want to broadcast the message to all clients in the room
        if (socket.id !== messageData.senderId) {
            socket.to(messageData.room).emit("receive_message", messageData);
        }
    });

    socket.on("disconnect", () => {
        console.log(`User Disconnected: ${socket.id}`);
    });
});



server.listen(3001, () => {
    console.log("SERVER RUNNING!");
});
