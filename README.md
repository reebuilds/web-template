# Fullstack TypeScript Application

A modern full-stack web application built with TypeScript, featuring authentication, protected routes, and a responsive UI.

## Tech Stack

### Backend

- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- JWT Authentication
- RESTful API

### Frontend

- React 18
- Vite
- TypeScript
- Material UI (MUI)
- Tailwind CSS
- Framer Motion
- React Router

## Features

- User authentication (register, login, logout)
- Protected routes
- Responsive UI
- User profile management
- Dashboard

## Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository:

```
git clone <repository-url>
cd web-template
```

2. Install backend dependencies:

```
cd backend
npm install
```

3. Set up environment variables:
   Create a `.env` file in the `backend` directory with the following variables:

```
PORT=5001
MONGO_URI=mongodb://localhost:27017/fullstack-app
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRE=7d
```

4. Install frontend dependencies:

```
cd ../frontend
npm install
```

### Running the Application

1. Start the backend server:

```
cd backend
npm run dev
```

2. In a separate terminal, start the frontend:

```
cd frontend
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Test Users

The application includes scripts to populate the database with test users for development and testing.

### Adding Test Users

There are several ways to add test users:

1. **Interactive Script (Recommended)**:

```
cd backend
npm run seed:interactive
```

This will launch an interactive menu where you can choose to add or remove test users.

2. **Direct Seeding**:

```
cd backend
npm run seed
```

This will add the test users directly to the database.

3. **Remove Test Users**:

```
cd backend
npm run seed:destroy
```

This will remove all test users from the database.

### Test User Credentials

The following test users will be created:

| Email             | Password    | Description  |
| ----------------- | ----------- | ------------ |
| admin@example.com | password123 | Admin user   |
| john@example.com  | password123 | Regular user |
| jane@example.com  | password123 | Regular user |
| test@example.com  | password123 | Test user    |

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/me` - Get current user (protected)

### User

- `PUT /api/users/profile` - Update user profile (protected)

## Deployment

### AWS Elastic Beanstalk Deployment

The application includes scripts to prepare and package the app for deployment to AWS Elastic Beanstalk:

1. Prepare the deployment package:

```
cd backend
npm run deploy:prepare
```

This script will:

- Build the frontend application (ignoring any TypeScript errors)
- Copy the built frontend files to the backend's public directory
- Compile the TypeScript backend code (ignoring any TypeScript errors)
- Package everything into a zip file (`deploy/eb-app.zip`) ready for Elastic Beanstalk deployment
- Include environment variables from your `.env` file in the deployment package

2. Deploy to Elastic Beanstalk:
   - Log in to your AWS Management Console
   - Navigate to Elastic Beanstalk
   - Create a new application or environment (if you haven't already)
   - Upload the `deploy/eb-app.zip` file

**Note about environment variables**: The deployment package includes your local `.env` file. Make sure it contains production-ready values before deploying. Sensitive information like database credentials and JWT secrets should be properly secured.

## AWS Lambda Functions

### User Count Report Lambda

The application includes a Lambda function that generates a report of user counts in the system:

- Total number of users
- New users in the last 30 days

This Lambda function connects to the same MongoDB database as the main application and can be scheduled to run periodically.

#### Deploying the Lambda Function

1. Prepare the Lambda package:

```
cd backend
npm run package-lambda
```

This script will:

- Copy necessary files (models, utils, services) to the Lambda directory
- Install dependencies
- Compile TypeScript
- Package everything into a zip file (`lambda/deploy/lambda-function.zip`)

The packaging is handled by a dedicated script in `backend/src/scripts/packageLambda.js` which provides detailed progress output and error handling.

2. Upload to AWS Lambda:

   - Log in to your AWS Management Console
   - Navigate to Lambda
   - Create a new function or update an existing one
   - Upload the `lambda/deploy/lambda-function.zip` file
   - Configure environment variables (MONGO_URI)
   - Set the handler to "dist/userCountReport.handler"

3. Configure a trigger:
   - You can set up an EventBridge (CloudWatch Events) rule to run this Lambda on a schedule
   - For example, set it to run daily to generate daily reports

## License

MIT
