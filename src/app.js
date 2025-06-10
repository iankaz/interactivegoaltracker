require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Import routes
const authRoutes = require('./routes/auth.routes');
const goalRoutes = require('./routes/goal.routes');
const milestoneRoutes = require('./routes/milestone.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Interactive Goal Tracker API',
    documentation: `${BASE_URL}/api-docs`,
    endpoints: {
      auth: `${BASE_URL}/api/auth`,
      goals: `${BASE_URL}/api/goals`
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
        API for tracking personal goals with GitHub OAuth integration
        
        To authenticate:
        1. Click the "Authorize" button at the top of the page
        2. In the "bearerAuth" field, enter your JWT token (without the word "Bearer")
        3. Click "Authorize"
        4. Close the dialog
        5. You can now test the authenticated endpoints
      `,
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://cse341-rlcp.onrender.com' 
          : 'http://localhost:3000',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token here. Example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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
      goals: '/api/goals'
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

const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://cse341-rlcp.onrender.com'
  : `http://localhost:${PORT}`;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API Documentation available at ${BASE_URL}/api-docs`);
  console.log(`Base URL: ${BASE_URL}`);
}); 