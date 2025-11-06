const API_BASE = 'http://localhost:4000/api';

const state = {
  sessionId: null,
  plan: null,
  risk: null,
  mission: null,
  plugins: []
};

const selectors = {
  createPlanBtn: document.getElementById('createPlanBtn'),
  executePlanBtn: document.getElementById('executePlanBtn'),
  refreshLogsBtn: document.getElementById('refreshLogsBtn'),
  planForm: document.getElementById('planForm'),
  planPanel: document.getElementById('planPanel'),
  planSummary: document.getElementById('planSummary'),
  planSteps: document.getElementById('planSteps'),
  riskBadge: document.getElementById('riskBadge'),
  executionPanel: document.getElementById('executionPanel'),
  executionTimeline: document.getElementById('executionTimeline'),
  ethicsContent: document.getElementById('ethicsContent'),
  pluginList: document.getElementById('pluginList'),
  roadmapContent: document.getElementById('roadmapContent'),
  feedbackForm: document.getElementById('feedbackForm'),
  feedbackStatus: document.getElementById('feedbackStatus'),
  feedbackEmail: document.getElementById('feedbackEmail'),
  feedbackMessage: document.getElementById('feedbackMessage')
};

async function fetchJSON(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || response.statusText);
  }
  return response.json();
}

function serializeForm() {
  return {
    goal: document.getElementById('goalInput').value,
    industry: document.getElementById('industryInput').value,
    region: document.getElementById('regionInput').value,
    persona: document.getElementById('personaInput').value,
    constraints: document.getElementById('constraintsInput').value
      ? [document.getElementById('constraintsInput').value]
      : []
  };
}

function renderPlan(plan, risk) {
  if (!plan) return;
  selectors.planPanel.hidden = false;
  selectors.planSummary.textContent = `Mission: ${plan.mission}. Goal: ${plan.context.goal}. Industry: ${plan.context.industry}. Region: ${plan.context.region}.`;
  selectors.planSteps.innerHTML = '';
  plan.steps.forEach((step) => {
    const item = document.createElement('li');
    item.innerHTML = `
      <h3>${step.title}</h3>
      <p>${step.description}</p>
      <p><strong>Agent:</strong> ${step.agentId}</p>
      <p><strong>Success criteria:</strong> ${step.successCriteria}</p>
    `;
    selectors.planSteps.appendChild(item);
  });
  selectors.riskBadge.textContent = `Risk: ${risk.rating.toUpperCase()} (score ${risk.aggregateScore})`;
}

function renderExecution(results) {
  selectors.executionPanel.hidden = false;
  selectors.executionTimeline.innerHTML = '';
  results.forEach((result) => {
    const entry = document.createElement('div');
    entry.className = 'timeline-entry';
    entry.innerHTML = `
      <h4>${result.title}</h4>
      <p>${result.output.summary}</p>
      <details>
        <summary>See details</summary>
        <pre>${JSON.stringify(result.output, null, 2)}</pre>
      </details>
    `;
    selectors.executionTimeline.appendChild(entry);
  });
}

function renderLogs(logs = []) {
  selectors.executionPanel.hidden = false;
  selectors.executionTimeline.innerHTML = '';
  logs.forEach((log) => {
    const entry = document.createElement('div');
    entry.className = 'timeline-entry';
    entry.innerHTML = `
      <h4>${log.message}</h4>
      <p><strong>Type:</strong> ${log.type}</p>
      <p><strong>Timestamp:</strong> ${new Date(log.timestamp).toLocaleString()}</p>
      ${log.outputSummary ? `<p><strong>Summary:</strong> ${log.outputSummary}</p>` : ''}
    `;
    selectors.executionTimeline.appendChild(entry);
  });
}

function renderEthics(data) {
  if (!data) return;
  selectors.ethicsContent.innerHTML = '';
  const missionBlock = document.createElement('div');
  missionBlock.innerHTML = `<strong>Mission:</strong> ${data.mission}`;
  selectors.ethicsContent.appendChild(missionBlock);
  const list = document.createElement('ul');
  data.ethics.principles.forEach((principle) => {
    const li = document.createElement('li');
    li.textContent = principle;
    list.appendChild(li);
  });
  selectors.ethicsContent.appendChild(list);
}

function renderPlugins(plugins) {
  selectors.pluginList.innerHTML = '';
  plugins.forEach((plugin) => {
    const card = document.createElement('div');
    card.className = 'plugin-card';
    card.innerHTML = `
      <h3>${plugin.name}</h3>
      <p>${plugin.description}</p>
      <p><strong>Capabilities:</strong> ${plugin.capabilities.join(', ')}</p>
      <p><strong>Version:</strong> ${plugin.version}</p>
    `;
    selectors.pluginList.appendChild(card);
  });
}

function renderRoadmap(roadmap, feedbackCount) {
  selectors.roadmapContent.innerHTML = `
    <p><strong>Repository:</strong> ${roadmap.repoUrl}</p>
    <p><strong>Channels:</strong> ${roadmap.communicationChannels.join(', ')}</p>
    <p><strong>Feedback Loop:</strong> ${roadmap.feedbackLoop}</p>
    <p><strong>Community Feedback Received:</strong> ${feedbackCount}</p>
  `;
}

async function bootstrap() {
  try {
    const [missionData, pluginData, roadmapData] = await Promise.all([
      fetchJSON('/mission'),
      fetchJSON('/plugins'),
      fetchJSON('/roadmap')
    ]);
    state.mission = missionData;
    state.plugins = pluginData.plugins;
    renderEthics(missionData);
    renderPlugins(state.plugins);
    renderRoadmap(roadmapData.roadmap, roadmapData.feedbackCount);
  } catch (error) {
    console.error('Failed to bootstrap UI', error);
  }
}

selectors.createPlanBtn.addEventListener('click', async () => {
  try {
    const body = serializeForm();
    const data = await fetchJSON('/plan', {
      method: 'POST',
      body: JSON.stringify(body)
    });
    state.sessionId = data.sessionId;
    state.plan = data.plan;
    state.risk = data.riskProfile;
    renderPlan(state.plan, state.risk);
    selectors.executePlanBtn.disabled = false;
    selectors.executePlanBtn.textContent = 'Run Autonomy Sprint';
  } catch (error) {
    alert(`Unable to create plan: ${error.message}`);
  }
});

selectors.executePlanBtn.addEventListener('click', async () => {
  if (!state.sessionId) return;
  selectors.executePlanBtn.disabled = true;
  selectors.executePlanBtn.textContent = 'Executing…';
  try {
    const data = await fetchJSON('/execute', {
      method: 'POST',
      body: JSON.stringify({ sessionId: state.sessionId })
    });
    renderExecution(data.results);
    await loadLogs();
  } catch (error) {
    alert(`Execution failed: ${error.message}`);
  } finally {
    selectors.executePlanBtn.disabled = false;
    selectors.executePlanBtn.textContent = 'Re-run Autonomy Sprint';
  }
});

async function loadLogs() {
  if (!state.sessionId) return;
  try {
    const data = await fetchJSON(`/sessions/${state.sessionId}/logs`);
    renderLogs(data.logs);
  } catch (error) {
    console.error('Unable to load logs', error);
  }
}

selectors.refreshLogsBtn.addEventListener('click', loadLogs);

selectors.feedbackForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  try {
    const payload = {
      email: selectors.feedbackEmail.value,
      message: selectors.feedbackMessage.value
    };
    const data = await fetchJSON('/feedback', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    selectors.feedbackStatus.textContent = `Thanks for sharing! Entry #${data.entry.id} logged.`;
    selectors.feedbackForm.reset();
    const roadmapData = await fetchJSON('/roadmap');
    renderRoadmap(roadmapData.roadmap, roadmapData.feedbackCount);
  } catch (error) {
    selectors.feedbackStatus.textContent = `Feedback failed: ${error.message}`;
  }
});

bootstrap();
