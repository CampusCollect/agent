const express = require('express');
const cors = require('cors');
const agentRoutes = require('./routes/agentRoutes');
const logger = require('./utils/logger');

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api', agentRoutes);

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  logger.error(err.message, { stack: err.stack });
  res.status(400).json({ error: err.message });
});

module.exports = app;
