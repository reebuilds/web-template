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

## License

MIT
