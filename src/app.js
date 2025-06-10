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
      description: `API for managing personal goals and tracking progress
    
To authenticate:
1. Click the "Authorize" button at the top of the page
2. In the "bearerAuth" field, enter your JWT token (without the word "Bearer")
3. Click "Authorize"
4. Close the dialog
5. You can now test the authenticated endpoints`
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://cse341-rlcp.onrender.com'
          : 'http://localhost:3000',
        description: process.env.NODE_ENV === 'production' 
          ? 'Production server'
          : 'Local development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token here.\nExample: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        }
      },
      schemas: {
        Goal: {
          type: 'object',
          required: ['title', 'description'],
          properties: {
            title: {
              type: 'string'
            },
            description: {
              type: 'string'
            },
            targetDate: {
              type: 'string',
              format: 'date'
            },
            status: {
              type: 'string',
              enum: ['pending', 'in-progress', 'completed']
            },
            progress: {
              type: 'number',
              minimum: 0,
              maximum: 100
            }
          }
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string'
            },
            username: {
              type: 'string'
            },
            email: {
              type: 'string'
            }
          }
        }
      }
    },
    paths: {
      '/api/auth/github': {
        get: {
          summary: 'Authenticate with GitHub',
          description: 'Redirects to GitHub OAuth login',
          tags: ['Auth'],
          responses: {
            '302': {
              description: 'Redirects to GitHub'
            }
          }
        }
      },
      '/api/auth/github/callback': {
        get: {
          summary: 'GitHub OAuth callback',
          description: 'Handles the callback from GitHub OAuth',
          tags: ['Auth'],
          responses: {
            '302': {
              description: 'Redirects to client with token'
            }
          }
        }
      },
      '/api/auth/me': {
        get: {
          summary: 'Get current user',
          description: 'Returns the currently authenticated user',
          tags: ['Auth'],
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'User data',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/User'
                  }
                }
              }
            },
            '401': {
              description: 'Not authenticated'
            }
          }
        }
      },
      '/api/auth/logout': {
        post: {
          summary: 'Logout user',
          description: 'Logs out the current user',
          tags: ['Auth'],
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'Logged out successfully'
            }
          }
        }
      },
      '/api/goals': {
        get: {
          summary: 'Get all goals for the authenticated user',
          tags: ['Goals'],
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'List of goals',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Goal'
                    }
                  }
                }
              }
            }
          }
        },
        post: {
          summary: 'Create a new goal',
          tags: ['Goals'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Goal'
                }
              }
            }
          },
          responses: {
            '201': {
              description: 'Goal created successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Goal'
                  }
                }
              }
            }
          }
        }
      },
      '/api/goals/{id}': {
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        get: {
          summary: 'Get a specific goal',
          tags: ['Goals'],
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'Goal details',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Goal'
                  }
                }
              }
            }
          }
        },
        put: {
          summary: 'Update a goal',
          tags: ['Goals'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Goal'
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Goal updated successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Goal'
                  }
                }
              }
            }
          }
        },
        delete: {
          summary: 'Delete a goal',
          tags: ['Goals'],
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'Goal deleted successfully'
            }
          }
        }
      },
      '/api/goals/{id}/progress': {
        put: {
          summary: 'Update goal progress',
          description: 'Updates the progress of a specific goal',
          tags: ['Goals'],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: {
                type: 'string'
              }
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['progress'],
                  properties: {
                    progress: {
                      type: 'number',
                      minimum: 0,
                      maximum: 100
                    }
                  }
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Progress updated successfully'
            },
            '400': {
              description: 'Invalid input'
            },
            '401': {
              description: 'Not authenticated'
            },
            '404': {
              description: 'Goal not found'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
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