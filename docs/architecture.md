# Architecture Overview

The Agentic Business Studio is composed of a modular Node.js backend and a lightweight, framework-free frontend that together
deliver an autonomous, multi-agent business-building experience. The design intentionally favours extensibility, transparency,
and offline-first operation so that the application can be packaged as a desktop experience.

## High-Level Components

| Layer | Description |
| --- | --- |
| **Backend (`backend/`)** | Express 5 application exposing mission control APIs, multi-agent orchestration, plugin registry, and community feedback endpoints. |
| **Frontend (`frontend/`)** | Static HTML/CSS/JS experience for visualising plans, logs, and impact metrics with minimal dependencies. |
| **Docs (`docs/`)** | Living documentation for architecture decisions, roadmap, and developer onboarding. |

```
┌──────────────────────────────────────────────────────────┐
│                      Frontend (UI)                       │
│ Mission form • plan visualisation • execution timeline   │
│ Ethics/impact metrics • community feedback               │
└──────────────────────────────────────────────────────────┘
                 ▲                           │
                 │ JSON/HTTP APIs            │
                 │                           ▼
┌──────────────────────────────────────────────────────────┐
│                      Backend (API)                        │
│ Express app + agent routes                                │
│  ├─ Session store & timeline logs                         │
│  ├─ Agent orchestrator (plan builder + executor)          │
│  ├─ Plugin manager (research, finance, compliance, etc.)  │
│  └─ Risk & ethics engine                                  │
└──────────────────────────────────────────────────────────┘
```

### Backend Modules

- **`src/app.js`** – Configures Express, JSON parsing, CORS, error handling, and wires the `/api` routes.
- **`src/routes/agentRoutes.js`** – REST endpoints for mission info, plan creation, execution, session logs, plugin listing, roadmap, and community feedback ingestion.
- **`src/services/agentOrchestrator.js`** – Generates end-to-end business plans, executes multi-agent workflows, updates the session store, and emits log entries.
- **`src/services/pluginManager.js`** – Registry for agent plugins with runtime execution, enabling plug-and-play extension.
- **`src/services/plugins/*`** – Default agent implementations for research, financial stewardship, compliance, operations automation, and ethics/impact analysis.
- **`src/services/sessionStore.js`** – In-memory timeline and plan persistence with UUID-backed sessions (swap for database for production/offline builds).
- **`src/services/riskService.js`** – Calculates aggregate risk ratings for every generated plan.
- **`src/config/env.js`** – Central location for mission statement, ethics principles, and community roadmap metadata.
- **`src/utils/logger.js`** – Structured logging to keep actions explainable.

### Frontend Highlights

- **Mission Control Form** collects goals, industries, regions, and constraints, and triggers plan creation.
- **Plan Visualisation** renders the orchestrated steps, success criteria, and live risk badge.
- **Execution Timeline** displays streaming logs and agent outputs for transparency and auditability.
- **Ethics & Impact Panel** surfaces mission alignment and core ethical principles.
- **Plugin Grid** lists available agents, illustrating the multi-agent ecosystem.
- **Community Roadmap & Feedback** enables a contribution loop aligned with the open-source mission.

### Extensibility

- Add new agents by dropping files into `backend/src/services/plugins` and registering them with the plugin manager.
- Swap `sessionStore` for persistent storage to support offline desktop builds.
- Integrate additional UI components by extending the vanilla JavaScript orchestrator or embedding in a desktop wrapper (e.g., Tauri, Electron).

### Offline & Packaging Considerations

- The backend operates without external SaaS dependencies by default, enabling bundling as an offline executable.
- Future desktop builds can start both the backend server and static frontend locally, maintaining data privacy.
