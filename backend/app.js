const express = require('express');

function createApp({ ollamaClient, defaultModel }) {
  if (!ollamaClient) {
    throw new Error('An Ollama client instance must be provided.');
  }

  const app = express();

  app.use(express.json());

  app.get('/', (req, res) => {
    res.send('Agentic web app backend');
  });

  app.get('/api/llm/models', async (req, res) => {
    try {
      const result = await ollamaClient.list();
      res.json({ models: result.models || [] });
    } catch (error) {
      console.error('Failed to list models', error);
      res.status(503).json({
        error: 'Unable to reach the Ollama service to list models.',
        details: error.message,
      });
    }
  });

  app.post('/api/llm/generate', async (req, res) => {
    const { prompt, model, options } = req.body || {};

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'The "prompt" field is required and must be a string.' });
    }

    const selectedModel = model || defaultModel;

    try {
      const response = await ollamaClient.generate({
        model: selectedModel,
        prompt,
        options,
      });

      res.json({
        model: selectedModel,
        response: response.response,
        created_at: response.created_at,
        eval_count: response.eval_count,
        eval_duration: response.eval_duration,
        load_duration: response.load_duration,
        total_duration: response.total_duration,
      });
    } catch (error) {
      console.error('LLM generation failed', error);
      res.status(503).json({
        error: 'Unable to generate a response from the Ollama service.',
        details: error.message,
      });
    }
  });

  return app;
}

module.exports = { createApp };
