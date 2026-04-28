const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http'); // Import http
const { Server } = require('socket.io'); // Import socket.io
require('dotenv').config();

const app = express();
const server = http.createServer(app); // Create HTTP server
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Your frontend URL
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/dukaansetu';

mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Make io accessible in routes
app.set('socketio', io);

io.on('connection', (socket) => {
    // console.log('A user connected:', socket.id); // Silent connection
    
    socket.on('join', (userId) => {
        socket.join(userId);
        // console.log(`User ${userId} joined their room`);
    });

    socket.on('disconnect', () => {
        // console.log('User disconnected');
    });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/reviews', require('./routes/reviews'));

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
