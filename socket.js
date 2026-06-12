// backend/socket.js
const { createServer } = require('http');
const { Server } = require('socket.io');
const app = require('./app'); // Express app

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('Socket client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Socket client disconnected:', socket.id);
  });
});

module.exports = { httpServer, io };
