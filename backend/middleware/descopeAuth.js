const DescopeClient = require('@descope/node-sdk');

// Initialize Descope client
let descopeClient;
try {
  descopeClient = DescopeClient({ 
    projectId: process.env.DESCOPE_PROJECT_ID || 'P32DkUA0pWtepx1OMHKokTnUEnJ2' 
  });
} catch (error) {
  console.error("Failed to initialize Descope client in middleware: " + error);
}

/**
 * Middleware to validate Descope session tokens
 */
const validateDescopeSession = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Missing or invalid Authorization header'
      });
    }

    const sessionToken = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!descopeClient) {
      return res.status(500).json({
        success: false,
        message: 'Authentication service not available'
      });
    }

    // Validate session with Descope
    const authInfo = await descopeClient.validateSession(sessionToken);
    
    console.log("✅ Successfully validated user session:", authInfo.sub);

    // Add user information to request object
    req.user = authInfo;
    req.sessionToken = sessionToken;

    next();
  } catch (error) {
    console.log("❌ Session validation failed:", error.message);
    
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired session',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Optional middleware to validate Descope session but continue if no session
 */
const optionalDescopeSession = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No session provided, continue without user info
      req.user = null;
      return next();
    }

    const sessionToken = authHeader.substring(7);

    if (!descopeClient) {
      req.user = null;
      return next();
    }

    const authInfo = await descopeClient.validateSession(sessionToken);
    req.user = authInfo;
    req.sessionToken = sessionToken;

    next();
  } catch (error) {
    // Session validation failed, but continue without user info
    console.log("⚠️ Optional session validation failed:", error.message);
    req.user = null;
    next();
  }
};

/**
 * Middleware to check if user has admin role
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  // Check if user has admin role
  const userRoles = req.user.roles || [];
  const isAdmin = userRoles.includes('admin') || userRoles.includes('Admin');

  if (!isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }

  next();
};

module.exports = {
  validateDescopeSession,
  optionalDescopeSession,
  requireAdmin
};
