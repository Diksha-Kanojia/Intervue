const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
app.use(cors());
app.use(express.json());

// Create HTTP server
const server = http.createServer(app);

// Create Socket.io server
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Connect to MongoDB if MONGODB_URI is provided
const MONGODB_URI = process.env.MONGODB_URI;
if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
} else {
  console.log('No MongoDB URI provided, running without database');
}

// In-memory storage for polls and answers (for development without MongoDB)
const polls = [];
const answers = {};

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Teacher creates a poll
  socket.on('create_poll', async (pollData) => {
    try {
      console.log('Poll created by teacher:', pollData);
      
      // Add unique ID to the poll data
      const pollId = Date.now().toString();
      const pollWithId = {
        ...pollData,
        id: pollId,
        createdAt: new Date()
      };
      
      // Store in memory
      polls.push(pollWithId);
      answers[pollId] = [];
      
      // Broadcast to all connected students
      io.emit('poll_created', pollWithId);
      
      console.log('Poll broadcasted to all students');
    } catch (error) {
      console.error('Error creating poll:', error);
    }
  });
  
  // Student submits an answer
  socket.on('submit_answer', async (answerData) => {
    try {
      console.log('Answer submitted by student:', answerData);
      
      // Add to in-memory storage
      const answer = {
        pollId: answerData.pollId,
        answer: answerData.answer,
        studentName: answerData.studentName || 'Anonymous',
        submittedAt: new Date()
      };
      
      if (answers[answerData.pollId]) {
        answers[answerData.pollId].push(answer);
      } else {
        answers[answerData.pollId] = [answer];
      }
      
      // Emit to teachers
      io.emit('answer_submitted', answer);
      
      console.log('Answer broadcasted to teachers');
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  });

  // Disconnect handler
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Define API routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Get all polls
app.get('/api/polls', (req, res) => {
  res.json(polls);
});

// Get answers for a specific poll
app.get('/api/polls/:id/answers', (req, res) => {
  const pollAnswers = answers[req.params.id] || [];
  res.json(pollAnswers);
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Socket.IO server ready for connections`);
});
