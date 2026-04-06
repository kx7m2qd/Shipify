const express = require('express');
const router  = express.Router();
const { getHistory, getGenerationById } = require('../services/dbService');
const logger = require('../utils/logger');

// GET /api/history
router.get('/', async (req, res) => {
  try {
    res.json({ success: true, history: await getHistory(20) });
  } catch (err) {
    logger.error('Failed to fetch history', { error: err.message });
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// GET /api/history/:id
router.get('/:id', async (req, res) => {
  try {
    const generation = await getGenerationById(req.params.id);
    if (!generation) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true, generation });
  } catch (err) {
    logger.error('Failed to fetch generation', { error: err.message });
    res.status(500).json({ error: 'Failed to fetch generation' });
  }
});

module.exports = router;
