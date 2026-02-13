const supabase = require('../lib/supabase');

/**
 * JWT verification middleware for Express.
 *
 * - Extracts the Bearer token from the Authorization header
 * - Verifies it with Supabase auth
 * - Attaches the authenticated user to req.user
 * - If supabase is null (not configured), skips auth and allows the
 *   request through for local development without Supabase
 * - Returns 401 on missing or invalid tokens
 */
async function authMiddleware(req, res, next) {
  // If Supabase is not configured, skip auth entirely (dev mode)
  if (!supabase) {
    req.user = null;
    return next();
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Missing or malformed Authorization header. Expected: Bearer <token>'
    });
  }

  const token = authHeader.substring(7); // Remove 'Bearer '

  if (!token || token.trim() === '') {
    return res.status(401).json({
      success: false,
      error: 'Empty authentication token'
    });
  }

  try {
    const { data, error } = await supabase.auth.getUser(token);

    if (error) {
      console.error('Auth verification failed:', error.message);
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired authentication token'
      });
    }

    if (!data || !data.user) {
      return res.status(401).json({
        success: false,
        error: 'User not found for provided token'
      });
    }

    // Attach user to request for downstream route handlers
    req.user = data.user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(500).json({
      success: false,
      error: 'Authentication service error'
    });
  }
}

module.exports = authMiddleware;
