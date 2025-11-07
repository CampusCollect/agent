# Frontend

The frontend renders the Agentic Business Studio interface using lightweight, dependency-free HTML/CSS/JS. It visualises the
agent plans, execution timeline, ethics guardrails, and community roadmap.

## Running Locally

1. Ensure the backend is running on `http://localhost:4000`.
2. Open `index.html` directly in a browser, or serve the directory:

```bash
npx serve .
```

3. Generate a plan, execute the agents, and review logs from the UI.

## Customising

- Update `style.css` for branding or theming.
- Extend `app.js` to integrate desktop-specific capabilities (e.g., file system access, local notifications).
- Wrap in Electron/Tauri to distribute a private desktop application.
