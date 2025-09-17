# OrderKing Task

A full-stack mobile application built with Expo React Native and Node.js, featuring user authentication and dynamic QR code generation.

## Overview

This project is a mini mobile application that demonstrates full-stack development skills including authentication, real-time updates, and mobile app development. Users can register, login, and view a dynamically updating QR code that refreshes every 60 seconds.

## Demonstration

## Features

### Core Features
- **User Authentication**
  - User registration with email and password validation
  - Secure login with JWT token-based authentication
  - Automatic logout on token expiration
  - Forgot password functionality
- **Dynamic QR Code**
  - Display of QR code containing a random UUID
  - Automatic QR code refresh every 60 seconds
  - Clean, user-friendly interface
- **Security**
  - Password hashing with bcrypt
  - JWT token authentication
  - Secure token storage using Expo Secure Store
  - Input validation and sanitization

### Technical Features
- Responsive design for different screen sizes
- Proper error handling and loading states
- SQLite database integration
- RESTful API architecture
- Cross-platform compatibility (iOS, Android, Web)

## Tech Stack

### Frontend
- **React Native** (0.81.4) with **Expo** (~54.0.7)
- **TypeScript** (~5.9.2)
- **Expo Router** for navigation
- **Axios** for API calls
- **JWT Decode** for token handling
- **Expo Secure Store** for secure token storage

### Backend
- **Node.js** with **Express.js** (^5.1.0)
- **SQLite3** (^5.1.7) for database
- **JWT** (^9.0.2) for authentication
- **bcrypt** (^6.0.0) for password hashing
- **UUID** (^13.0.0) for QR code generation
- **QRCode** (^1.5.4) for QR code creation
- **Nodemailer** (^7.0.6) for email functionality
- **Express Validator** (^7.2.1) for input validation

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** or **yarn**
- **Expo CLI** (`npm install -g @expo/cli`)
- **Android Studio** (for Android development) or **Xcode** (for iOS development)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd OrderkingTask
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../my-app
   npm install
   ```

## Environment Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
JWT_SECRET = your-super-secret-jwt-key-here
PORT = 5000
DB_PATH = ./database.sqlite
SALT_ROUNDS = 10
FRONTEND_URL = http://localhost:5000/api
SMTP_HOST = localhost
SMTP_PORT = 1025
SMTP_USER = user@localhost
```

### Frontend Environment Variables

Create a `.env` file in the `my-app` directory (optional):

```env
EXPO_PUBLIC_API_BASE_URL=http://localhost:5000
```

## Running the Application

### Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Start the server:
   ```bash
   node server.js
   ```

The backend server will start on `http://localhost:5000`

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd my-app
   ```

2. Start the Expo development server:
   ```bash
   npm start
   ```

3. Run on specific platform:
   - **Android**: `npm run android`
   - **iOS**: `npm run ios` (macOS only)
   - **Web**: `npm run web`

## API Documentation

The API provides the following endpoints:

### Authentication Endpoints

#### POST /api/auth/register
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "StrongPass123!"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com"
  },
  "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
}
```

#### POST /api/auth/login
Authenticate a user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "StrongPass123!"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

#### GET /api/auth/me
Get current user information (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

#### POST /api/auth/forgot-password
Request password reset.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "message": "Password reset instructions sent to your email"
}
```

### QR Code Endpoints

#### GET /api/qr/current
Get the current QR code (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200):**
```json
{
  "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "uuid": "550e8400-e29b-41d4-a716-446655440000",
  "expiresAt": "2025-09-17T12:15:30.000Z"
}
```

#### PUT /api/qr/refresh
Refresh the QR code (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200):**
```json
{
  "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "uuid": "550e8400-e29b-41d4-a716-446655440001",
  "expiresAt": "2025-09-17T12:16:30.000Z"
}
```

## Project Structure

```
OrderkingTask/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database configuration
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   └── qrController.js       # QR code generation logic
│   ├── middleware/
│   │   ├── auth.js               # JWT authentication middleware
│   │   └── errorHandler.js       # Error handling middleware
│   ├── routes/
│   │   ├── auth.js               # Authentication routes
│   │   └── qr.js                 # QR code routes
│   ├── utils/
│   │   ├── bcrypt.js             # Password hashing utilities
│   │   ├── jwt.js                # JWT utilities
│   │   └── qr.js                 # QR code utilities
│   ├── database.sqlite           # SQLite database file
│   ├── package.json
│   └── server.js                 # Main server file
├── my-app/
│   ├── app/
│   │   ├── _layout.tsx           # Root layout
│   │   ├── login.tsx             # Login screen
│   │   ├── signup.tsx            # Registration screen
│   │   ├── forgot-password.tsx   # Forgot password screen
│   │   ├── home.tsx              # Main app screen with QR code
│   │   ├── modal.tsx             # Modal component
│   │   └── (protected)/
│   │       ├── _layout.tsx       # Protected layout
│   │       └── index.tsx         # Protected home screen
│   ├── components/
│   │   ├── ui/                   # UI components
│   │   └── ...                   # Other components
│   ├── utils/
│   │   ├── authContext.tsx       # Authentication context
│   │   └── config.ts             # Configuration utilities
│   ├── constants/
│   │   └── theme.ts              # Theme constants
│   ├── assets/                   # Static assets
│   ├── package.json
│   └── app.json                  # Expo configuration
├── TASK.md                       # Project requirements
└── README.md                     # This file
```

## Database Schema

The application uses SQLite with the following schema:

### Users Table
- `id` (INTEGER, PRIMARY KEY, AUTOINCREMENT)
- `email` (TEXT, UNIQUE, NOT NULL)
- `password` (TEXT, NOT NULL)
- `created_at` (DATETIME, DEFAULT CURRENT_TIMESTAMP)

### QR Codes Table
- `id` (INTEGER, PRIMARY KEY, AUTOINCREMENT)
- `user_id` (INTEGER, FOREIGN KEY REFERENCES users(id))
- `uuid` (TEXT, NOT NULL)
- `expires_at` (DATETIME, NOT NULL)
- `created_at` (DATETIME, DEFAULT CURRENT_TIMESTAMP)

## Security Features

- Password hashing using bcrypt with salt rounds
- JWT tokens with expiration (1 hour)
- Input validation and sanitization
- SQL injection prevention through parameterized queries
- CORS configuration for cross-origin requests
- Secure token storage on mobile devices

## Development Notes

- The QR code automatically refreshes every 60 seconds on the frontend
- JWT tokens expire after 1 hour, requiring re-authentication
- Password requirements: 8-72 characters, must include uppercase, lowercase, digit, and special character
- Email validation follows RFC standards with normalization

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

