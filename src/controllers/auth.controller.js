const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const OAuth2Strategy = require('passport-oauth2').Strategy;

// Configure GitHub OAuth Strategy
const callbackURL = process.env.NODE_ENV === 'production' 
  ? 'https://cse341-rlcp.onrender.com/api/auth/github/callback'
  : 'http://localhost:3000/api/auth/github/callback';

console.log('Using GitHub callback URL:', callbackURL);
console.log('GitHub Client ID:', process.env.GITHUB_CLIENT_ID ? 'Set' : 'Not Set');
console.log('GitHub Client Secret:', process.env.GITHUB_CLIENT_SECRET ? 'Set' : 'Not Set');

passport.use(new OAuth2Strategy({
    authorizationURL: 'https://github.com/login/oauth/authorize',
    tokenURL: 'https://github.com/login/oauth/access_token',
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: callbackURL,
    scope: ['user:email'],
    state: true,
    customHeaders: {
      'Accept': 'application/json'
    }
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      console.log('OAuth callback received with profile:', {
        id: profile.id,
        username: profile.username,
        displayName: profile.displayName,
        emails: profile.emails
      });

      // Find or create user
      let user = await User.findOne({ githubId: profile.id });
      
      if (!user) {
        user = await User.create({
          githubId: profile.id,
          username: profile.username,
          displayName: profile.displayName,
          email: profile.emails?.[0]?.value
        });
        console.log('Created new user:', user._id);
      } else {
        console.log('Found existing user:', user._id);
      }

      return done(null, user);
    } catch (error) {
      console.error('Error in OAuth callback:', error);
      return done(error);
    }
  }
));

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// GitHub authentication
exports.githubAuth = (req, res, next) => {
  console.log('Starting GitHub authentication...');
  console.log('Request headers:', req.headers);
  console.log('GitHub Client ID:', process.env.GITHUB_CLIENT_ID);
  
  passport.authenticate('oauth2', {
    scope: ['user:email'],
    session: false
  })(req, res, next);
};

// GitHub callback
exports.githubCallback = (req, res, next) => {
  console.log('GitHub callback received with code:', req.query.code);
  console.log('Callback URL:', req.originalUrl);
  console.log('Request headers:', req.headers);

  passport.authenticate('oauth2', {
    session: false,
    failureRedirect: '/login'
  }, async (err, user, info) => {
    if (err) {
      console.error('Authentication error:', err);
      console.error('Error stack:', err.stack);
      return res.status(500).json({
        message: 'Authentication failed',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
      });
    }

    if (!user) {
      console.error('No user returned from authentication');
      return res.status(401).json({
        message: 'Authentication failed',
        error: 'No user returned from authentication'
      });
    }

    try {
      // Generate JWT token
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Send token and user info
      res.json({
        message: 'Authentication successful',
        token,
        user: {
          id: user._id,
          username: user.username,
          displayName: user.displayName,
          email: user.email
        }
      });
    } catch (error) {
      console.error('Error generating token:', error);
      res.status(500).json({
        message: 'Error generating token',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  })(req, res, next);
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-__v');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error getting current user:', error);
    res.status(500).json({
      message: 'Error getting current user',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Logout
exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Error during logout:', err);
      return res.status(500).json({
        message: 'Error during logout',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
      });
    }
    res.json({ message: 'Logged out successfully' });
  });
}; 