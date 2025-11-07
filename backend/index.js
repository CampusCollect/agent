const { Ollama } = require('ollama');
const { createApp } = require('./app');

const port = process.env.PORT || 3000;
const ollamaHost = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434';
const defaultModel = process.env.OLLAMA_MODEL || 'phi3:mini';

const ollamaClient = new Ollama({
  host: ollamaHost,
});

const app = createApp({ ollamaClient, defaultModel });

function start() {
  return app.listen(port, () => {
    console.log(`Backend listening on port ${port}`);
    console.log(`Using Ollama host: ${ollamaHost}`);
    console.log(`Default model: ${defaultModel}`);
  });
}

if (require.main === module) {
  start();
}

module.exports = { app, start };
