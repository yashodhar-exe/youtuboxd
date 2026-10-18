const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const db = require('./config/db'); // Initialize DB

const authRoutes = require('./routes/auth.routes');
const videoRoutes = require('./routes/video.routes');
const reviewRoutes = require('./routes/review.routes');
// const userRoutes = require('./routes/user.routes');
// const listRoutes = require('./routes/list.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/reviews', reviewRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/lists', listRoutes);

// Generic Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
