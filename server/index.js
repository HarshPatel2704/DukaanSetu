const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  'https://dukaansetu-nine.vercel.app',
  'http://localhost:5173'
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without an origin
      // (Postman, server-to-server requests, etc.)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true
  })
);

// Handle preflight requests
// app.options('*', cors());
app.options(/.*/, cors());

// Parse JSON
app.use(express.json());


const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});


const PORT = process.env.PORT || 5000;

const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://localhost:27017/dukaansetu';


mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });


app.set('socketio', io);

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User joined room: ${userId}`);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});


app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/reviews', require('./routes/reviews'));


app.get('/', (req, res) => {
  res.json({
    message: 'DukaanSetu backend is running',
    status: 'success'
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
