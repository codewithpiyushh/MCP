const express = require('express');
const router = express.Router();

// Import validation middleware if you created it
// const validateDescopeSession = require('../middleware/validateDescopeSession');

// Health check endpoint for Descope routes
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Descope auth routes are working',
    timestamp: new Date().toISOString()
  });
});

// Get current user profile using Descope session
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Missing or invalid Authorization header'
      });
    }

    const sessionToken = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Validate session with Descope (you'll need to import descopeClient)
    // const authInfo = await descopeClient.validateSession(sessionToken);

    res.json({
      success: true,
      message: 'Profile retrieved successfully',
      user: {
        // This would come from authInfo in real implementation
        userId: 'demo_user_id',
        email: 'demo@example.com',
        name: 'Demo User'
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user profile',
      error: error.message
    });
  }
});

// Update user profile
router.put('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Missing or invalid Authorization header'
      });
    }

    const { name, email } = req.body;

    // Here you would update the user profile using Descope management API
    // or your own database if you're storing additional user data

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        name,
        email
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user profile',
      error: error.message
    });
  }
});

// Logout endpoint (client-side logout mainly, but good for logging)
router.post('/logout', (req, res) => {
  // With Descope, logout is mainly handled client-side
  // This endpoint is mainly for logging purposes
  console.log('User logged out at:', new Date().toISOString());
  
  res.json({
    success: true,
    message: 'Logout successful',
    timestamp: new Date().toISOString()
  });
});

// Validate session endpoint
router.get('/validate', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Missing or invalid Authorization header',
        valid: false
      });
    }

    const sessionToken = authHeader.substring(7);

    // Validate session with Descope
    // const authInfo = await descopeClient.validateSession(sessionToken);

    res.json({
      success: true,
      message: 'Session is valid',
      valid: true,
      // user: authInfo.user,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Session validation error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid or expired session',
      valid: false,
      error: error.message
    });
  }
});

// Admin route to get all users (requires admin permissions)
router.get('/users', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Missing or invalid Authorization header'
      });
    }

    // Validate session and check admin permissions
    // const authInfo = await descopeClient.validateSession(sessionToken);
    // Check if user has admin role

    res.json({
      success: true,
      message: 'Users retrieved successfully (admin only)',
      users: [
        // This would come from Descope management API
        {
          userId: 'user1',
          email: 'user1@example.com',
          name: 'User One',
          status: 'active'
        }
      ],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get users',
      error: error.message
    });
  }
});

module.exports = router;
