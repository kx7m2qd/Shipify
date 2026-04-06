require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const analyzeRoutes = require('./routes/analyze');
const historyRoutes = require('./routes/history');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json());

// 20 req/hour per IP — Gemini free tier has limits
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: { error: 'Too many requests. Try again in an hour.' }
});
app.use('/api/analyze', limiter);

app.use('/api/analyze', analyzeRoutes);
app.use('/api/history', historyRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
  logger.error(err.message);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => logger.info(`Shipify backend on port ${PORT}`));
module.exports = app;
