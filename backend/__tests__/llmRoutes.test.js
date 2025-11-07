const request = require('supertest');
const { createApp } = require('../app');

describe('LLM routes', () => {
  const defaultModel = 'phi3:mini';
  let listMock;
  let generateMock;
  let app;

  beforeEach(() => {
    listMock = jest.fn();
    generateMock = jest.fn();
    const ollamaClient = {
      list: listMock,
      generate: generateMock,
    };

    app = createApp({ ollamaClient, defaultModel });
  });

  describe('GET /api/llm/models', () => {
    it('returns a list of models from the Ollama client', async () => {
      listMock.mockResolvedValue({ models: [{ name: 'phi3:mini' }, { name: 'llama3:8b' }] });

      const response = await request(app).get('/api/llm/models');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ models: [{ name: 'phi3:mini' }, { name: 'llama3:8b' }] });
      expect(listMock).toHaveBeenCalledTimes(1);
    });

    it('returns a 503 error when the Ollama client fails', async () => {
      const error = new Error('network down');
      listMock.mockRejectedValue(error);

      const response = await request(app).get('/api/llm/models');

      expect(response.status).toBe(503);
      expect(response.body).toEqual({
        error: 'Unable to reach the Ollama service to list models.',
        details: 'network down',
      });
    });
  });

  describe('POST /api/llm/generate', () => {
    const prompt = 'Explain AI.';

    it('returns generated content from the Ollama client', async () => {
      const ollamaResponse = {
        response: 'AI stands for Artificial Intelligence.',
        created_at: '2024-01-01T00:00:00Z',
        eval_count: 42,
        eval_duration: 1000,
        load_duration: 2000,
        total_duration: 3000,
      };
      generateMock.mockResolvedValue(ollamaResponse);

      const response = await request(app)
        .post('/api/llm/generate')
        .send({ prompt });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        model: defaultModel,
        ...ollamaResponse,
      });
      expect(generateMock).toHaveBeenCalledWith({
        model: defaultModel,
        prompt,
        options: undefined,
      });
    });

    it('allows overriding the model and options', async () => {
      generateMock.mockResolvedValue({ response: 'ok' });
      const model = 'custom:model';
      const options = { temperature: 0.2 };

      await request(app)
        .post('/api/llm/generate')
        .send({ prompt, model, options });

      expect(generateMock).toHaveBeenCalledWith({
        model,
        prompt,
        options,
      });
    });

    it('returns 400 when prompt is missing or invalid', async () => {
      const response = await request(app).post('/api/llm/generate').send({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'The "prompt" field is required and must be a string.',
      });
      expect(generateMock).not.toHaveBeenCalled();
    });

    it('returns 503 when the Ollama client fails', async () => {
      const error = new Error('timeout');
      generateMock.mockRejectedValue(error);

      const response = await request(app)
        .post('/api/llm/generate')
        .send({ prompt });

      expect(response.status).toBe(503);
      expect(response.body).toEqual({
        error: 'Unable to generate a response from the Ollama service.',
        details: 'timeout',
      });
    });
  });
});
