# Interactive Goal Tracker API

A RESTful API for tracking personal goals with GitHub OAuth integration. Built with Node.js, Express, and MongoDB.

## Features

- GitHub OAuth authentication
- CRUD operations for goals
- Goal progress tracking
- Milestone management
- Input validation
- Error handling
- API documentation with Swagger

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- GitHub OAuth credentials

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd interactive-goal-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/goal-tracker
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
JWT_SECRET=your_jwt_secret
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

4. Set up GitHub OAuth:
   - Go to GitHub Settings > Developer Settings > OAuth Apps
   - Create a new OAuth application
   - Set the callback URL to `http://localhost:3000/api/auth/github/callback`
   - Copy the Client ID and Client Secret to your `.env` file

5. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Documentation

Once the server is running, visit `http://localhost:3000/api-docs` to view the Swagger documentation.

## API Endpoints

### Authentication
- `GET /api/auth/github` - GitHub OAuth login
- `GET /api/auth/github/callback` - GitHub OAuth callback
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Goals
- `POST /api/goals` - Create a new goal
- `GET /api/goals` - Get all goals
- `GET /api/goals/:id` - Get a specific goal
- `PUT /api/goals/:id` - Update a goal
- `DELETE /api/goals/:id` - Delete a goal
- `PUT /api/goals/:id/progress` - Update goal progress

## Error Handling

The API uses standard HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error

## Security

- JWT-based authentication
- GitHub OAuth integration
- Input validation
- Error handling
- Environment variables for sensitive data

## License

MIT 