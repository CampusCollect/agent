# Agentic Business Studio

The Agentic Business Studio is an open-source application designed to help founders and teams autonomously research, plan,
and launch ethical businesses. It combines multi-agent orchestration, transparent execution logs, and a community-driven
roadmap to keep the mission aligned with social impact.

## Key Capabilities

- **Agentic Autonomy** – Generate mission-aligned plans that cover research, finance, compliance, operations, and ethics.
- **Multi-Agent Collaboration** – Pluggable agent framework with out-of-the-box plugins for intelligence, stewardship, and
  impact review.
- **Explainable Execution** – Session store and logs surface every action, keeping decisions auditable.
- **Community Feedback Loop** – Built-in roadmap endpoint and feedback form for rapid iteration.
- **Offline Ready** – No external SaaS dependencies; package as a desktop executable for private deployments.

## Structure

- `backend/` – Node.js Express API server powering plan generation, execution, and community endpoints.
- `frontend/` – Vanilla HTML/CSS/JS interface for visualising agent plans, logs, and ethics metrics.
- `ios/` – Placeholder for future mobile client integrations.
- `docs/` – Architecture notes, roadmap, and contributor guidance.

## Getting Started

```bash
# Backend
cd backend
npm install
npm run start

# Frontend
cd ../frontend
npx serve .   # or host the static files via your preferred web server
```

Visit `http://localhost:4000/api/health` to confirm the backend is running, then open the `frontend/index.html` file in a
browser (or host statically). Configure desktop packaging by bundling both tiers into an Electron/Tauri shell for offline use.

## Mission

> To empower individuals and teams to build businesses, create value, manage risk, and access global financial tools
> autonomously and ethically, leveraging the best of AI/agentic technology and the open-source community.

See [`docs/roadmap.md`](docs/roadmap.md) for future enhancements and contribution workflow.
