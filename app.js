const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const path = require('path');
const errorHandler = require('./middleware/error');

// Load env vars
dotenv.config();

// Initialize DB and MOCK_DB hooking
require('./config/db')();

const app = express();
app.set('trust proxy', 1);

// Security middlewares
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3000', 'https://xebia-internship-fh43.vercel.app'],
  credentials: true
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 200,
  message: 'Too many requests from this IP, please try again after 10 minutes',
});
app.use('/api', limiter);

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount routers
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/resume', require('./routes/resumeRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'CareerGenie Backend API is running smoothly' });
});

// Error handler (must be after routes)
app.use(errorHandler);

module.exports = app;
// Force server to listen and stay active on port 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Asli Server live ho gaya hai port ${PORT} par!`);
});
