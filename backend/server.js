// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const helmet = require('helmet');
// const rateLimit = require('express-rate-limit');
// require('dotenv').config();

// const authRoutes = require('./routes/auth');
// const userRoutes = require('./routes/users');
// const planRoutes = require('./routes/plans');
// const progressRoutes = require('./routes/progress');
// const chatbotRoutes = require('./routes/chatbot');

// const app = express();

// // Add this near the top of your server file, before your rate limiting middleware
// app.set('trust proxy', 1);

// // If you're using express-rate-limit, make sure it's configured properly:
// const rateLimit = require('express-rate-limit');

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
//   message: 'Too many requests from this IP, please try again later.',
//   standardHeaders: true,
//   legacyHeaders: false,
// });

// app.use(limiter);

// // Security middleware
// app.use(helmet());
// // In your main server file (app.js or server.js)

// // Or if you're behind multiple proxies:
// // app.set('trust proxy', true);
// // Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100 // limit each IP to 100 requests per windowMs
// });
// app.use(limiter);

// // CORS configuration
// app.use(cors({
//   origin: process.env.FRONTEND_URL || 'http://localhost:3000',
//   credentials: true
// }));

// // Body parsing middleware
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// // MongoDB connection
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fitgenie', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// db.once('open', () => {
//   console.log('Connected to MongoDB');
// });

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/plans', planRoutes);
// app.use('/api/progress', progressRoutes);
// app.use('/api/chatbot', chatbotRoutes);
// // app.use('/api', coachRoutes); // Add coach routes

// // Health check endpoint
// app.get('/api/health', (req, res) => {
//   res.json({
//     status: 'OK',
//     message: 'FitGenie Backend is running!',
//     timestamp: new Date().toISOString()
//   });
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({
//     success: false,
//     message: 'Something went wrong!',
//     error: process.env.NODE_ENV === 'development' ? err.message : {}
//   });
// });

// // 404 handler
// app.use('*', (req, res) => {
//   res.status(404).json({
//     success: false,
//     message: 'API endpoint not found'
//   });
// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`FitGenie Backend Server running on port ${PORT}`);
// });

// module.exports = app;

//**Existed */
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const helmet = require('helmet');
// const rateLimit = require('express-rate-limit');
// require('dotenv').config();

// const authRoutes = require('./routes/auth');
// const userRoutes = require('./routes/users');
// const planRoutes = require('./routes/plans');
// const progressRoutes = require('./routes/progress');
// const chatbotRoutes = require('./routes/chatbot');

// const app = express();

// // Configure trust proxy for rate limiting
// app.set('trust proxy', 1);

// // Security middleware
// app.use(helmet());

// // Rate limiting configuration
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
//   message: 'Too many requests from this IP, please try again later.',
//   standardHeaders: true,
//   legacyHeaders: false,
// });

// app.use(limiter);

// // CORS configuration
// app.use(cors({
//   origin: process.env.FRONTEND_URL || 'http://localhost:3000',
//   credentials: true
// }));

// // Body parsing middleware
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// // MongoDB connection
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fitgenie', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// db.once('open', () => {
//   console.log('Connected to MongoDB');
// });

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/plans', planRoutes);
// app.use('/api/progress', progressRoutes);
// app.use('/api/chatbot', chatbotRoutes);
// // app.use('/api', coachRoutes); // Add coach routes

// // Health check endpoint
// app.get('/api/health', (req, res) => {
//   res.json({
//     status: 'OK',
//     message: 'FitGenie Backend is running!',
//     timestamp: new Date().toISOString()
//   });
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({
//     success: false,
//     message: 'Something went wrong!',
//     error: process.env.NODE_ENV === 'development' ? err.message : {}
//   });
// });

// // 404 handler
// app.use('*', (req, res) => {
//   res.status(404).json({
//     success: false,
//     message: 'API endpoint not found'
//   });
// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`FitGenie Backend Server running on port ${PORT}`);
// });

// module.exports = app;

//******After Server Functionality */

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const http = require("http");
const socketIo = require("socket.io");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Configure trust proxy for rate limiting
app.set("trust proxy", 1);

// Security middleware
app.use(helmet());

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// CORS configuration - more permissive for development
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || "http://localhost:3000",
      "http://localhost:3000",
      "http://localhost:3001",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Make io available to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// MongoDB connection with updated options (removing deprecated ones)
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/fitgenie")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("MongoDB connection established successfully");
});

// Import routes with error handling
const loadRoute = (path, name) => {
  try {
    return require(path);
  } catch (error) {
    console.warn(`Warning: ${name} routes not found at ${path}, skipping...`);
    return null;
  }
};

const authRoutes = loadRoute("./routes/auth", "Auth");
const userRoutes = loadRoute("./routes/users", "User");
const planRoutes = loadRoute("./routes/plans", "Plan");
const progressRoutes = loadRoute("./routes/progress", "Progress");
const chatbotRoutes = loadRoute("./routes/chatbot", "Chatbot");
const coachRoutes = loadRoute("./routes/coaches", "Coach");
const chatRoutes = loadRoute("./routes/chat", "Chat");
const reviewRoutes = loadRoute("./routes/reviews", "Review");

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "FitGenie Backend is running!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Test endpoint for development
app.get("/api/test", (req, res) => {
  res.json({
    message: "Backend is working!",
    timestamp: new Date().toISOString(),
  });
});

// Routes - only use routes that were successfully loaded
if (authRoutes) app.use("/api/auth", authRoutes);
if (userRoutes) app.use("/api/users", userRoutes);
if (planRoutes) app.use("/api/plans", planRoutes);
if (progressRoutes) app.use("/api/progress", progressRoutes);
if (chatbotRoutes) app.use("/api/chatbot", chatbotRoutes);
if (coachRoutes) app.use("/api/coaches", coachRoutes);
if (chatRoutes) app.use("/api/chat", chatRoutes);
if (reviewRoutes) app.use("/api/reviews", reviewRoutes);

// Socket.io for real-time chat
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join request-specific room for chat
  socket.on("join_request", (requestId) => {
    socket.join(`request_${requestId}`);
    console.log(`User joined request room: request_${requestId}`);
  });

  // Leave request room
  socket.on("leave_request", (requestId) => {
    socket.leave(`request_${requestId}`);
    console.log(`User left request room: request_${requestId}`);
  });

  // Handle new message
  socket.on("send_message", (data) => {
    // Broadcast message to all users in the request room
    socket.to(`request_${data.requestId}`).emit("new_message", {
      messageId: data.messageId,
      senderId: data.senderId,
      message: data.message,
      timestamp: data.timestamp,
      senderType: data.senderType,
    });
  });

  // Handle typing indicators
  socket.on("typing", (data) => {
    socket.to(`request_${data.requestId}`).emit("user_typing", {
      userId: data.userId,
      isTyping: data.isTyping,
    });
  });

  // Handle coach status updates
  socket.on("coach_status_update", (data) => {
    socket.broadcast.emit("coach_status_changed", {
      coachId: data.coachId,
      status: data.status,
    });
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err.stack);

  // Don't leak error details in production
  const errorResponse = {
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Something went wrong!"
        : err.message,
    timestamp: new Date().toISOString(),
  };

  // Include stack trace in development
  if (process.env.NODE_ENV === "development") {
    errorResponse.stack = err.stack;
  }

  res.status(err.status || 500).json(errorResponse);
});

// 404 handler - must be last route
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
    path: req.originalUrl,
    timestamp: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 FitGenie Backend Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(
    `🌐 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:3000"}`
  );
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully...");
  server.close(() => {
    console.log("Process terminated");
    mongoose.connection.close();
  });
});

module.exports = app;
