require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');
const DescopeClient = require('@descope/node-sdk'); // Import Descope SDK
const { validateDescopeSession, optionalDescopeSession, requireAdmin } = require('./middleware/descopeAuth');

// Initialize Descope Client
let descopeClient;
try {
  descopeClient = DescopeClient({ projectId: process.env.DESCOPE_PROJECT_ID || 'P32DkUA0pWtepx1OMHKokTnUEnJ2' });
  console.log('✅ Descope client initialized successfully');
} catch (error) {
  console.error("❌ Failed to initialize Descope client: " + error);
}

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:8081', // React Native Metro bundler
    'http://localhost:19006', // Expo web
    'http://192.168.1.9:8081', // Local network for mobile testing
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.use('/api/auth', require('./routes/auth')); // Original MongoDB auth routes
app.use('/api/descope', require('./routes/descopeAuth')); // Descope auth routes

// Protected routes that require Descope session validation
app.get('/api/protected/profile', validateDescopeSession, (req, res) => {
  res.json({
    success: true,
    message: 'Protected profile data',
    user: req.user,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/protected/data', validateDescopeSession, (req, res) => {
  res.json({
    success: true,
    message: 'This is protected data',
    userData: req.user,
    serverTime: new Date().toISOString()
  });
});

// Admin-only route
app.get('/api/admin/users', validateDescopeSession, requireAdmin, (req, res) => {
  res.json({
    success: true,
    message: 'Admin-only user data',
    users: [
      { id: 1, name: 'User 1', email: 'user1@example.com' },
      { id: 2, name: 'User 2', email: 'user2@example.com' }
    ],
    requestedBy: req.user.sub,
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'MCP Project API Server',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      mongodb_auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/me',
        updateProfile: 'PUT /api/auth/me',
        logout: 'POST /api/auth/logout',
        allUsers: 'GET /api/auth/users (admin only)'
      },
      descope_auth: {
        profile: 'GET /api/descope/me',
        updateProfile: 'PUT /api/descope/me',
        logout: 'POST /api/descope/logout',
        validate: 'GET /api/descope/validate',
        health: 'GET /api/descope/health',
        allUsers: 'GET /api/descope/users (admin only)'
      }
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:8081'}`);
  console.log(`🌐 API Base URL: http://localhost:${PORT}/api`);
  console.log(`📊 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});