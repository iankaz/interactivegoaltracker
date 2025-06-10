require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Import routes
const authRoutes = require('./routes/auth.routes');
const goalRoutes = require('./routes/goal.routes');
const milestoneRoutes = require('./routes/milestone.routes');

const app = express();

// Trust proxy
app.set('trust proxy', 1);

// Session configuration
const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
};

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://cse341-rlcp.onrender.com'
    : 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Interactive Goal Tracker API',
    documentation: 'https://cse341-rlcp.onrender.com/api-docs',
    endpoints: {
      auth: 'https://cse341-rlcp.onrender.com/api/auth',
      goals: 'https://cse341-rlcp.onrender.com/api/goals',
      milestones: 'https://cse341-rlcp.onrender.com/api/milestones'
    }
  });
});

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Interactive Goal Tracker API',
      version: '1.0.0',
      description: `
# Interactive Goal Tracker API Documentation

## Authentication
This API uses GitHub OAuth for authentication. To get started:

1. Visit [https://cse341-rlcp.onrender.com/api/auth/github](https://cse341-rlcp.onrender.com/api/auth/github)
2. Authorize the application with your GitHub account
3. Copy the JWT token provided
4. Click the "Authorize" button at the top of this page
5. In the "bearerAuth" field, enter your JWT token (without the word "Bearer")
6. Click "Authorize"
7. Close the dialog
8. You can now test the authenticated endpoints

## Available Endpoints

### Authentication
- \`GET /api/auth/github\` - Start GitHub OAuth flow
- \`GET /api/auth/me\` - Get current user info
- \`POST /api/auth/logout\` - Logout user

### Goals
- \`GET /api/goals\` - Get all goals
- \`POST /api/goals\` - Create a new goal
- \`GET /api/goals/:id\` - Get a specific goal
- \`PUT /api/goals/:id\` - Update a goal
- \`DELETE /api/goals/:id\` - Delete a goal

### Milestones
- \`GET /api/milestones\` - Get all milestones
- \`POST /api/milestones\` - Create a new milestone
- \`GET /api/milestones/:id\` - Get a specific milestone
- \`PUT /api/milestones/:id\` - Update a milestone
- \`DELETE /api/milestones/:id\` - Delete a milestone

## Example Requests

### Create a Goal
\`\`\`json
{
  "title": "Learn Node.js",
  "description": "Master Node.js and Express framework",
  "dueDate": "2024-12-31",
  "priority": "high"
}
\`\`\`

### Create a Milestone
\`\`\`json
{
  "title": "Complete Basic Express Course",
  "description": "Finish the Express.js fundamentals course",
  "dueDate": "2024-06-30",
  "goalId": "goal_id_here",
  "priority": "medium"
}
\`\`\`

## Error Responses
All endpoints return appropriate HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error
      `,
    },
    servers: [
      {
        url: 'https://cse341-rlcp.onrender.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token here (without the word "Bearer"). You can get this token by authenticating with GitHub at /api/auth/github'
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./src/routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "Interactive Goal Tracker API Documentation",
  customfavIcon: "/favicon.ico"
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/milestones', milestoneRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: {
      root: '/',
      docs: '/api-docs',
      auth: '/api/auth',
      goals: '/api/goals',
      milestones: '/api/milestones'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Get port from environment variable or use default
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://cse341-rlcp.onrender.com'
  : `http://localhost:${PORT}`;

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('Server Configuration:');
  console.log('-------------------');
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Port: ${PORT}`);
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`API Documentation: ${BASE_URL}/api-docs`);
  console.log('-------------------');
  console.log('GitHub OAuth Configuration:');
  console.log(`Client ID: ${process.env.GITHUB_CLIENT_ID ? 'Set' : 'Not Set'}`);
  console.log(`Client Secret: ${process.env.GITHUB_CLIENT_SECRET ? 'Set' : 'Not Set'}`);
  console.log(`Callback URL: ${BASE_URL}/api/auth/github/callback`);
  console.log('-------------------');
  console.log('Database:');
  console.log(`MongoDB URI: ${process.env.MONGODB_URI ? 'Set' : 'Not Set'}`);
  console.log('-------------------');
  console.log('Session:');
  console.log(`Secret: ${process.env.SESSION_SECRET ? 'Set' : 'Not Set'}`);
  console.log(`Secure: ${sessionConfig.cookie.secure}`);
  console.log('-------------------');
});

// Handle server errors
server.on('error', (error) => {
  console.error('Server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
    process.exit(1);
  }
}); 