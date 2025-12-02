/* global process */
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

// Import config and utils
import connectDB from './config/database.js';
import socketHandler from './utils/socketHandler.js';
import errorHandler from './middleware/errorMiddleware.js';

// Import Routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import groupRoutes from './routes/groups.js';
import expenseRoutes from './routes/expenses.js';
import paymentRoutes from './routes/payments.js';


console.log('✅ Server starting...');
dotenv.config();

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 5000;

// Body Parsing First
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log('Incoming Request:', req.method, req.url);
  next();
});

// Security Middleware
app.use(helmet());
// Update CORS to allow both dev and production
// Replace current CORS with:
app.use(cors({
  origin: [
    'http://localhost:5173',  // Dev frontend
    'https://splitmate.vercel.app',  // We'll update after deployment
    'https://splitmate.vercel.app'  // Your actual frontend URL
  ],
  credentials: true
}));

// OR for development, allow all (temporarily):
app.use(cors({
  origin: '*',  // Allow all in development
  credentials: true
}));

// Rate Limiting
// Development-friendly rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // ↑ Increased to 50 for auth routes
  message: 'Too many attempts, please try again later',
  skip: (req) => process.env.NODE_ENV === 'development' // ← Skip in dev!
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200, // ↑ Increased for general API
  skip: (req) => process.env.NODE_ENV === 'development' // ← Skip in dev!
});

app.use('/api/auth', authLimiter);
app.use('/api/', generalLimiter);

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/expense-splitter')
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/payments', paymentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running healthy! 🚀',
    timestamp: new Date().toISOString()
  });
});

// Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});
socketHandler(io);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Error Handler (MUST BE LAST)
app.use(errorHandler);

// Start Server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export { app, io };