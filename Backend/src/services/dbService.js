const { Pool } = require('pg');
const logger = require('../utils/logger');

// PostgreSQL in prod, in-memory fallback for local dev without a DB
let pool = null;
const inMemory = [];
let dbDisabled = false;

if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 5000, // Don't hang forever
  });
  initDB().catch(err => {
    logger.error('DB init failed on startup, falling back to in-memory', { error: err.message });
    dbDisabled = true;
  });
} else {
  logger.warn('No DATABASE_URL — using in-memory storage. History resets on restart.');
  dbDisabled = true;
}

async function initDB() {
  if (!pool || dbDisabled) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS generations (
      id             SERIAL PRIMARY KEY,
      repo_url       TEXT NOT NULL,
      repo_name      TEXT NOT NULL,
      owner          TEXT NOT NULL,
      detected_stack JSONB,
      configs        JSONB,
      summary        JSONB,
      created_at     TIMESTAMP DEFAULT NOW()
    )
  `);
  logger.info('DB ready');
}

async function saveGeneration({ repoUrl, repoName, owner, detectedStack, configs, summary }) {
  if (pool && !dbDisabled) {
    try {
      const result = await pool.query(
        `INSERT INTO generations (repo_url, repo_name, owner, detected_stack, configs, summary)
         VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
        [repoUrl, repoName, owner, JSON.stringify(detectedStack), JSON.stringify(configs), JSON.stringify(summary)]
      );
      return result.rows[0];
    } catch (err) {
      logger.error('DB save failed, falling back to in-memory', { error: err.message });
      dbDisabled = true;
    }
  }

  const r = { id: Date.now(), repoUrl, repoName, owner, detectedStack, configs, summary, createdAt: new Date() };
  inMemory.unshift(r);
  if (inMemory.length > 50) inMemory.pop();
  return r;
}

async function getHistory(limit = 20) {
  if (pool && !dbDisabled) {
    try {
      const r = await pool.query(
        `SELECT id, repo_url, repo_name, owner, summary, created_at
         FROM generations ORDER BY created_at DESC LIMIT $1`, [limit]
      );
      return r.rows;
    } catch (err) {
      logger.error('DB history fetch failed, falling back to in-memory', { error: err.message });
      dbDisabled = true;
    }
  }
  return inMemory.slice(0, limit);
}

async function getGenerationById(id) {
  if (pool && !dbDisabled) {
    try {
      const r = await pool.query('SELECT * FROM generations WHERE id = $1', [id]);
      return r.rows[0] || null;
    } catch (err) {
      logger.error('DB generation fetch failed, falling back to in-memory', { error: err.message });
      dbDisabled = true;
    }
  }
  return inMemory.find(r => r.id == id) || null;
}

module.exports = { saveGeneration, getHistory, getGenerationById };
