# Backend

The backend powers the Agentic Business Studio APIs, orchestrating autonomous plans, executing multi-agent workflows, and
serving mission/roadmap data to the UI or future desktop shells.

## Features

- Express 5 server with JSON + CORS configuration
- Mission and ethics endpoints for transparency
- Plan generation and execution via the `agentOrchestrator`
- Plugin registry with default agents (research, finance, compliance, operations, impact)
- Session store with timeline logging and risk analysis
- Community feedback capture and public roadmap metadata

## Scripts

```bash
npm install      # install dependencies
npm run start    # start the production server on port 4000
npm run dev      # start with development-friendly NODE_ENV
```

## Extending the Backend

- Add plugins in `src/services/plugins/*.js` and ensure they export `{ id, name, execute }`.
- Replace the in-memory session store with a database adapter to persist plans across restarts.
- Wrap the server in a desktop runtime to distribute an offline executable.
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
