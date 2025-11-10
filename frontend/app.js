const API_BASE = 'http://localhost:4000/api';

const LLM_MODELS = {
  mistral: {
    name: 'Mistral 7B',
    pitch: 'Fast iteration for lean founding teams tackling go-to-market experiments.'
  },
  llama3: {
    name: 'Llama 3 70B',
    pitch: 'Deep strategic reasoning for fundraising narratives and complex product bets.'
  },
  mixtral: {
    name: 'Mixtral 8x7B',
    pitch: 'Balanced creativity and cost control for testing new venture lines safely.'
  }
};

const DEFAULT_FOUNDER_GOAL = 'Define your first milestone above.';
const DEFAULT_WORKFLOW_GOAL = 'We align the studio around the milestone you outline in Mission Control.';

const state = {
  sessionId: null,
  plan: null,
  risk: null,
  mission: null,
  plugins: [],
  selectedLLM: 'mistral'
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
  feedbackMessage: document.getElementById('feedbackMessage'),
  goalInput: document.getElementById('goalInput'),
  founderGoal: document.getElementById('founderGoal'),
  workflowGoal: document.getElementById('workflowGoal'),
  llmStatus: document.getElementById('llmSelectionStatus'),
  llmInputs: Array.from(document.querySelectorAll('input[name="llmChoice"]')),
  llmCards: Array.from(document.querySelectorAll('.llm-card'))
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
  const constraintsValue = document.getElementById('constraintsInput').value;
  const constraints = constraintsValue ? [constraintsValue] : [];
  return {
    goal: selectors.goalInput.value,
    industry: document.getElementById('industryInput').value,
    region: document.getElementById('regionInput').value,
    persona: document.getElementById('personaInput').value,
    constraints,
    llm: state.selectedLLM
  };
}

function getSelectedModel() {
  return LLM_MODELS[state.selectedLLM] || { name: state.selectedLLM, pitch: '' };
}

function updateGoalFocus() {
  if (!selectors.goalInput) return;
  const goal = selectors.goalInput.value.trim();
  if (selectors.founderGoal) {
    selectors.founderGoal.textContent = goal || DEFAULT_FOUNDER_GOAL;
  }
  if (selectors.workflowGoal) {
    selectors.workflowGoal.textContent = goal
      ? `Every sprint ladders up to: ${goal}.`
      : DEFAULT_WORKFLOW_GOAL;
  }
}

function markActiveLLM() {
  selectors.llmCards.forEach((card) => {
    const input = card.querySelector('input[name="llmChoice"]');
    const isActive = input && input.value === state.selectedLLM;
    card.classList.toggle('is-active', Boolean(isActive));
  });
}

function updateLLMStatus() {
  const model = getSelectedModel();
  if (selectors.llmStatus) {
    selectors.llmStatus.innerHTML = `<strong>${model.name}</strong> — ${model.pitch}`;
  }
}

function renderPlan(plan, risk) {
  if (!plan) return;
  selectors.planPanel.hidden = false;
  selectors.planSummary.innerHTML = '';

  const missionLine = document.createElement('p');
  missionLine.textContent = `Mission: ${plan.mission}. Goal: ${plan.context.goal}. Industry: ${plan.context.industry}. Region: ${plan.context.region}.`;
  selectors.planSummary.appendChild(missionLine);

  const llmLine = document.createElement('p');
  const model = getSelectedModel();
  llmLine.textContent = `Open-source copilot: ${model.name}. ${model.pitch}`;
  selectors.planSummary.appendChild(llmLine);

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

  if (selectors.workflowGoal) {
    selectors.workflowGoal.textContent = `The current sprint is anchored on: ${plan.context.goal}.`;
  }
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
    selectors.executePlanBtn.textContent = 'Run autonomy sprint';
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
    selectors.executePlanBtn.textContent = 'Re-run autonomy sprint';
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

selectors.llmInputs.forEach((input) => {
  input.addEventListener('change', () => {
    state.selectedLLM = input.value;
    markActiveLLM();
    updateLLMStatus();
  });
});

if (selectors.goalInput) {
  selectors.goalInput.addEventListener('input', updateGoalFocus);
}

markActiveLLM();
updateLLMStatus();
updateGoalFocus();
bootstrap();
