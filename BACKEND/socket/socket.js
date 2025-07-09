import {Server} from "socket.io";
import express from "express";
import http from "http";

const app = express();

const server = http.createServer (app);

const io = new Server (server, {
    cors: {
        origin: 'http://localhost:5173',
        method: ['GET', 'POST']
    }
})

const userSocketMap = {}; // This map stores socketId corresponding to the userId

export const getReceiverSocketId = (receiverId) => userSocketMap[receiverId];

io.on ('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketMap[userId] = socket.id;
        console.log (`User connected: UserId=${userId}, SocketId=${socket.id}`);
    }
    io.emit ('getOnlineUsers', Object.keys(userSocketMap));

    socket.on ('disconnected', () => {
        if (userId) {
            console.log (`User disconnected: UserId=${userId}, SocketId=${socket.id}`);
            delete userSocketMap[userId];
        }
        io.emit ('getOnlineUsers', Object.keys(userSocketMap));
    })
})

export {app, server, io};