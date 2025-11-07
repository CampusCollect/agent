const express = require('express');
const orchestrator = require('../services/agentOrchestrator');
const sessionStore = require('../services/sessionStore');
const pluginManager = require('../services/pluginManager');
const config = require('../config/env');

const router = express.Router();
const feedback = [];

router.get('/mission', (_req, res) => {
  res.json({ mission: config.missionStatement, ethics: config.ethics });
});

router.get('/plugins', (_req, res) => {
  res.json({ plugins: pluginManager.list() });
});

router.post('/plan', (req, res, next) => {
  try {
    const { plan, riskProfile } = orchestrator.createPlan(req.body || {});
    const session = sessionStore.createSession(plan);
    plan.id = session.id;
    res.json({ sessionId: session.id, plan, riskProfile });
  } catch (error) {
    next(error);
  }
});

router.post('/execute', async (req, res, next) => {
  try {
    const { sessionId } = req.body || {};
    if (!sessionId) {
      throw new Error('sessionId is required');
    }
    const results = await orchestrator.executePlan(sessionId);
    res.json({ sessionId, results, status: 'completed' });
  } catch (error) {
    next(error);
  }
});

router.get('/sessions/:sessionId', (req, res, next) => {
  try {
    const session = sessionStore.getSession(req.params.sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    res.json({ session });
  } catch (error) {
    next(error);
  }
});

router.get('/sessions/:sessionId/logs', (req, res, next) => {
  try {
    const session = sessionStore.getSession(req.params.sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    res.json({ logs: session.logs });
  } catch (error) {
    next(error);
  }
});

router.post('/feedback', (req, res) => {
  const entry = {
    id: feedback.length + 1,
    submittedAt: new Date().toISOString(),
    message: req.body?.message || '',
    email: req.body?.email || null
  };
  feedback.push(entry);
  res.json({ status: 'received', entry });
});

router.get('/roadmap', (_req, res) => {
  res.json({ roadmap: config.roadmap, feedbackCount: feedback.length });
});

module.exports = router;
