const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// GitHub OAuth strategy configuration
const GitHubStrategy = require('passport-github2').Strategy;

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/api/auth/github/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user exists
      let user = await User.findOne({ githubId: profile.id });
      
      if (!user) {
        // Create new user if doesn't exist
        user = await User.create({
          githubId: profile.id,
          username: profile.username,
          email: profile.emails[0].value,
          avatar: profile.photos[0].value
        });
      } else {
        // Update last login
        user.lastLogin = Date.now();
        await user.save();
      }
      
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// GitHub OAuth routes
exports.githubAuth = passport.authenticate('github', { scope: ['user:email'] });

exports.githubCallback = passport.authenticate('github', { 
  failureRedirect: '/login',
  session: false 
}, (req, res) => {
  const token = generateToken(req.user);
  res.redirect(`${process.env.CLIENT_URL}?token=${token}`);
});

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-__v');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Logout
exports.logout = (req, res) => {
  res.json({ message: 'Logged out successfully' });
}; 