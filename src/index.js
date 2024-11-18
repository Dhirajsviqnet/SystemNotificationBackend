import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*', // Allow requests from your frontend URL
    methods: ['GET', 'POST'],       // Allow GET and POST methods
    allowedHeaders: ['Content-Type'], // Optional, if you want to specify headers
    credentials: true,               // If you are using cookies, you can enable this
  }
});

const PORT = process.env.PORT || 5000;

// Serve basic HTTP response
app.get('/', (req, res) => {
  res.send('Socket.IO server is running');
});

const groups = {};

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Handle client joining a group
  socket.on('joinGroup', (groupId) => {
    if (!groups[groupId]) {
      groups[groupId] = [];
    }
    groups[groupId].push(socket.id);
    socket.join(groupId);
    console.log(`Client ${socket.id} joined group ${groupId}`);
  });

  // Handle sending messages to a group
  socket.on('sendMessage', (groupId, message) => {
    io.to(groupId).emit('receiveMessage', { sender: socket.id, message });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`Client ${socket.id} disconnected`);
    for (let groupId in groups) {
      groups[groupId] = groups[groupId].filter((id) => id !== socket.id);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
