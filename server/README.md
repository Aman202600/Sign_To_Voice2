# Sign-to-Voice Backend Server

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file in the server directory with:
```
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=development
```

### 3. Start MongoDB
Make sure MongoDB is running locally on port 27017:
```bash
mongod
```

### 4. Start the Server
```bash
npm start
```

The server will start on http://localhost:5000

## API Endpoints

### Authentication
- `POST /register` - User registration
- `POST /login` - User login
- `GET /profile` - Get user profile (protected)

### Translations
- `POST /translations` - Save translation (protected)
- `GET /translations` - Get user's translation history (protected)
- `DELETE /translations/:id` - Delete specific translation (protected)
- `DELETE /translations` - Clear all translations (protected)

### Health
- `GET /health` - Server health check
- `GET /` - API information

## Database
- MongoDB database: `sign-to-voice`
- Collections: `users`, `translations`

## Features
- JWT-based authentication
- Password hashing with bcrypt
- User registration and login
- Translation history storage
- Protected API routes
- Error handling and validation
