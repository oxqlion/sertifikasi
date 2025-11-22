const express = require('express');
const cors = require('cors');
const participantRoutes = require('./routes/participantRoutes');
const instructorRoutes = require('./routes/instructorRoutes');
const classRoutes = require('./routes/classRoutes');
const registrationRoutes = require('./routes/registrationRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/participants', participantRoutes);
app.use('/api/instructors', instructorRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/registrations', registrationRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'SkillHub API is running' });
});

module.exports = app;