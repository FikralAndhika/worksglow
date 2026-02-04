const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Import database
const pool = require('./config/db');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const servicesRoutes = require('./routes/servicesRoutes');
const heroRoutes = require('./routes/heroRoutes');
const contactRoutes = require('./routes/contactRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const aboutRoutes = require('./routes/aboutRoutes');

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://worksglow.vercel.app', 'https://worksglows.vercel.app'] 
    : '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (frontend HTML/CSS/JS)
app.use(express.static(path.join(__dirname, '..')));

// Serve uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Test Route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend Works Glow is running!',
    status: 'success',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test Database Connection Route
app.get('/api/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      message: 'Database connected!',
      time: result.rows[0].now,
      status: 'success'
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Database connection failed',
      error: error.message,
      status: 'error'
    });
  }
});

// Auth Routes
app.use('/api/auth', authRoutes);

// Services Routes
app.use('/api/services', servicesRoutes);

// Hero Routes
app.use('/api/hero', heroRoutes);

// Contact Routes
app.use('/api/contact', contactRoutes);

// Gallery Routes
app.use('/api/gallery', galleryRoutes);

// About Routes
app.use('/api/about', aboutRoutes);

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.path,
    status: 'error'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    status: 'error'
  });
});

// Start Server (Only in development, not in Vercel)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📂 Frontend: http://localhost:${PORT}`);
    console.log(`🔌 API: http://localhost:${PORT}/api`);
    console.log(`🖼️  Gallery API: http://localhost:${PORT}/api/gallery`);
    console.log(`📄 About API: http://localhost:${PORT}/api/about`);
  });
}

// Export for Vercel serverless functions
module.exports = app;