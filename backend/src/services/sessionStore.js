const { v4: uuid } = require('uuid');

class SessionStore {
  constructor() {
    this.sessions = new Map();
  }

  createSession(plan) {
    const id = uuid();
    const session = {
      id,
      createdAt: new Date().toISOString(),
      plan,
      status: 'planned',
      steps: [],
      logs: []
    };
    this.sessions.set(id, session);
    return session;
  }

  getSession(id) {
    return this.sessions.get(id);
  }

  updateSession(id, update) {
    const session = this.sessions.get(id);
    if (!session) {
      throw new Error(`Unknown session: ${id}`);
    }
    const nextSession = { ...session, ...update };
    this.sessions.set(id, nextSession);
    return nextSession;
  }

  pushLog(id, logEntry) {
    const session = this.sessions.get(id);
    if (!session) {
      throw new Error(`Unknown session: ${id}`);
    }
    const nextEntry = {
      id: uuid(),
      timestamp: new Date().toISOString(),
      ...logEntry
    };
    session.logs.push(nextEntry);
    return nextEntry;
  }

  appendStepResult(id, stepResult) {
    const session = this.sessions.get(id);
    if (!session) {
      throw new Error(`Unknown session: ${id}`);
    }
    session.steps.push(stepResult);
    return stepResult;
  }
}

module.exports = new SessionStore();
