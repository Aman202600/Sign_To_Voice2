const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;
const JWT_SECRET = 'your-secret-key-123';

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/sign-to-voice', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected successfully');
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
  process.exit(1);
});

// User Schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);

// Translation Schema
const translationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  prediction: {
    type: String,
    required: true
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  description: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const Translation = mongoose.model('Translation', translationSchema);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Sign-to-Voice API is running!' });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
});

// Register user
app.post('/register', async (req, res) => {
  try {
    console.log('Registration request received:', req.body);
    
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('Validation failed: missing email or password');
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (password.length < 6) {
      console.log('Validation failed: password too short');
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    console.log('Checking if user exists...');
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ error: 'User already exists' });
    }

    console.log('Hashing password...');
    // Hash password
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
      console.log('Password hashed successfully');
    } catch (hashError) {
      console.error('Password hashing failed:', hashError);
      return res.status(500).json({ error: 'Password processing failed' });
    }

    console.log('Creating new user...');
    // Create user
    const user = new User({
      email: email.toLowerCase(),
      password: hashedPassword
    });

    console.log('Saving user to database...');
    await user.save();
    console.log('User saved successfully:', user._id);

    console.log('Generating JWT token...');
    // Generate token
    let token;
    try {
      token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
      console.log('JWT token generated successfully');
    } catch (jwtError) {
      console.error('JWT generation failed:', jwtError);
      return res.status(500).json({ error: 'Token generation failed' });
    }

    console.log('Registration successful for:', email);
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        email: user.email,
        createdAt: user.createdAt
      },
      token
    });

  } catch (error) {
    console.error('Registration error details:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      name: error.name
    });
    
    if (error.code === 11000) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: validationErrors[0] });
    }
    
    res.status(500).json({ error: `Registration failed: ${error.message}` });
  }
});

// Login user
app.post('/login', async (req, res) => {
  try {
    console.log('Login request received:', req.body);
    
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        createdAt: user.createdAt
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Save translation
app.post('/translations', async (req, res) => {
  try {
    const { userId, prediction, confidence, description } = req.body;

    if (!userId || !prediction || confidence === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const translation = new Translation({
      userId,
      prediction,
      confidence,
      description: description || ''
    });

    await translation.save();

    res.status(201).json({
      message: 'Translation saved',
      translation
    });

  } catch (error) {
    console.error('Save translation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get translations
app.get('/translations/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const translations = await Translation.find({ userId })
      .sort({ timestamp: -1 })
      .limit(50);

    res.json({ translations });

  } catch (error) {
    console.error('Get translations error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
});

