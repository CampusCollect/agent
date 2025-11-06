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
