const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// GitHub OAuth strategy configuration
const GitHubStrategy = require('passport-github2').Strategy;

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.NODE_ENV === 'production'
      ? 'https://cse341-rlcp.onrender.com/api/auth/github/callback'
      : 'http://localhost:3000/api/auth/github/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      console.log('GitHub Profile:', {
        id: profile.id,
        username: profile.username,
        emails: profile.emails,
        photos: profile.photos
      });

      // Check if user exists
      let user = await User.findOne({ githubId: profile.id });
      
      if (!user) {
        console.log('Creating new user for GitHub ID:', profile.id);
        // Create new user if doesn't exist
        user = await User.create({
          githubId: profile.id,
          username: profile.username,
          email: profile.emails?.[0]?.value || `${profile.username}@github.com`,
          avatar: profile.photos?.[0]?.value
        });
        console.log('New user created:', user._id);
      } else {
        console.log('Existing user found:', user._id);
        // Update last login
        user.lastLogin = Date.now();
        await user.save();
      }
      
      return done(null, user);
    } catch (error) {
      console.error('GitHub OAuth Error:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      return done(error, null);
    }
  }
));

// Generate JWT token
const generateToken = (user) => {
  if (!user || !user._id) {
    console.error('Invalid user object:', user);
    throw new Error('Invalid user object');
  }
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET || 'fallback_secret_key',
    { expiresIn: '24h' }
  );
};

// GitHub OAuth routes
exports.githubAuth = passport.authenticate('github', { 
  scope: ['user:email'],
  session: false 
});

exports.githubCallback = (req, res, next) => {
  console.log('GitHub callback received with code:', req.query.code);
  
  passport.authenticate('github', { session: false }, (err, user) => {
    if (err) {
      console.error('Authentication error:', err);
      return res.status(401).send(`
        <h2>Authentication failed</h2>
        <p>Error: ${err.message}</p>
        <p>Please try again or contact support if the problem persists.</p>
      `);
    }
    if (!user) {
      console.error('No user returned from authentication');
      return res.status(401).send(`
        <h2>Authentication failed</h2>
        <p>No user data received from GitHub.</p>
        <p>Please try again or contact support if the problem persists.</p>
      `);
    }
    try {
      const token = generateToken(user);
      console.log('Token generated successfully for user:', user._id);
      // Return a simple HTML page with the token and a copy button
      res.send(`
        <html>
          <body>
            <h2>Authentication Successful!</h2>
            <p>Copy and use this token in Swagger or Postman:</p>
            <input type="text" value="${token}" id="token" style="width:80%" readonly />
            <button onclick="copyToken()">Copy Token</button>
            <script>
              function copyToken() {
                var copyText = document.getElementById('token');
                copyText.select();
                document.execCommand('copy');
                alert('Token copied to clipboard!');
              }
            </script>
          </body>
        </html>
      `);
    } catch (error) {
      console.error('Token generation error:', error);
      res.status(500).send(`
        <h2>Token generation failed</h2>
        <p>Error: ${error.message}</p>
        <p>Please try again or contact support if the problem persists.</p>
      `);
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
    console.error('Get Current User Error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};

// Logout
exports.logout = (req, res) => {
  res.clearCookie('auth_token');
  res.json({ message: 'Logged out successfully' });
}; 