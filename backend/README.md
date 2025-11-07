# Backend

This directory contains the Node.js Express API server for the agentic web app.

## Setup

1. Install dependencies with `npm install`.
2. (Optional) Configure the connection to an [Ollama](https://github.com/ollama/ollama) deployment by setting:
   - `OLLAMA_HOST` – the base URL of the Ollama server (defaults to `http://127.0.0.1:11434`).
   - `OLLAMA_MODEL` – the default model to load when none is provided in the request (defaults to `phi3:mini`).
3. Start the server with `node index.js`.

## API

- `GET /api/llm/models` – Lists the models available from the configured Ollama instance.
- `POST /api/llm/generate` – Generates a completion. Provide a JSON body with:
  - `prompt` (string, required)
  - `model` (string, optional, overrides `OLLAMA_MODEL`)
  - `options` (object, optional, forwarded to Ollama)
