import {
  createInitialState,
  createWidgetPayload,
  escapeHtml,
  getActiveSnapshot,
  getFilteredMetrics,
  renderCustomWidget,
  renderFavoriteTile,
  renderMetricCard,
  setActiveTimeframe,
  toggleFavorite
} from './dashboard.js';

const appState = createInitialState();

function renderApp(state) {
  const root = document.getElementById('root');
  if (!root) return;

  const snapshot = getActiveSnapshot(state);
  const summary = snapshot.summary ?? { headline: '', subhead: '', tagline: '', cards: [] };
  const metrics = Array.isArray(snapshot.metrics) ? snapshot.metrics : [];
  const filteredMetrics = getFilteredMetrics(metrics, state.selectedCategory);
  const favoriteMetrics = state.favoriteMetricIds
    .map((id) => metrics.find((metric) => metric.id === id))
    .filter(Boolean);
  const hasHeroTrend = Array.isArray(snapshot.hero?.trend) && snapshot.hero.trend.length > 0;
  const heroTrendMarkup = hasHeroTrend
    ? `<div class="hero-spark">${renderHeroSpark(snapshot.hero.trend, state.timeframe)}</div>`
    : '';
  const heroChange = snapshot.hero?.change ?? '';
  const heroDirection = heroChange.toString().trim().startsWith('-') ? 'down' : 'up';
  const pipelineRows = Array.isArray(snapshot.pipeline) ? snapshot.pipeline : [];

  root.innerHTML = `
    <div class="app-shell">
      <header class="top-bar">
        <div class="brand">
          <div class="brand-icon" aria-hidden="true">AX</div>
          <div>
            <h1>AgentX Growth Legend</h1>
            <p>${escapeHtml(summary.tagline ?? '')}</p>
          </div>
        </div>
        <div class="timeframe-toggle" role="group" aria-label="Select timeframe">
          ${state.timeframeOptions
            .map(
              (option) => `
                <button
                  class="timeframe-btn"
                  type="button"
                  data-timeframe-id="${option.id}"
                  aria-pressed="${state.timeframe === option.id}"
                  title="${escapeHtml(option.description)}"
                >
                  ${escapeHtml(option.label)}
                </button>
              `
            )
            .join('')}
        </div>
        <div class="action-group">
          <button class="action-btn" type="button" id="share-update">
            <span aria-hidden="true">📊</span> Share investor update
          </button>
          <button class="action-btn primary" type="button" id="jump-to-widget">
            <span aria-hidden="true">➕</span> Add dashboard widget
          </button>
        </div>
      </header>

      <section class="hero-grid">
        <article class="hero-card">
          <header>
            <h2>${escapeHtml(summary.headline ?? '')}</h2>
            <p>${escapeHtml(summary.subhead ?? '')}</p>
          </header>
          <div class="hero-card__balance">
            <div>
              <span>${escapeHtml(snapshot.hero.label ?? '')}</span>
              <strong>${escapeHtml(snapshot.hero.value ?? '')}</strong>
            </div>
            <small data-direction="${heroDirection}">
              ${escapeHtml(heroChange)}
            </small>
          </div>
          ${heroTrendMarkup}
        </article>
        <article class="focus-banner" aria-label="Executive summary">
          <div class="focus-banner__headline">
            <span>Executive signal</span>
            <strong>${escapeHtml(summary.headline ?? '')}</strong>
            <p>${escapeHtml(summary.subhead ?? '')}</p>
          </div>
          <div class="focus-metrics">
            ${summary.cards
              .map(
                (card) => `
                  <article class="focus-card">
                    <span>${escapeHtml(card.label)}</span>
                    <strong>${escapeHtml(card.value)}</strong>
                    <small>${escapeHtml(card.change)}</small>
                  </article>
                `
              )
              .join('')}
          </div>
        </article>
      </section>

      ${state.bannerMessage ? `<div class="app-banner" role="status">${escapeHtml(state.bannerMessage)}</div>` : ''}

      <section class="favorite-dock" aria-labelledby="favorites-heading">
        <div class="favorite-dock__header">
          <h2 id="favorites-heading">Focus metrics</h2>
          <p>Pin revenue, people, and efficiency KPIs to monitor like a trading legend.</p>
        </div>
        ${favoriteMetrics.length
          ? `<div class="favorite-dock__grid">${favoriteMetrics
              .map((metric) => renderFavoriteTile(metric))
              .join('')}</div>`
          : '<div class="empty-state">Select the star icon on any card to build your focus strip.</div>'}
      </section>

      <main class="layout">
        <div class="column">
          <section class="panel" id="metrics" aria-labelledby="metrics-heading">
            <div class="panel__header">
              <div>
                <h2 id="metrics-heading">North star metrics</h2>
                <p>All operating metrics visualized with Robinhood-style clarity.</p>
              </div>
              <div class="filter-chips" role="group" aria-label="Filter metrics by category">
                ${['All', 'Revenue', 'Product', 'People', 'Efficiency']
                  .map((category) => {
                    const isActive = state.selectedCategory === category;
                    return `
                      <button class="filter-chip" type="button" data-category="${category}" aria-pressed="${isActive}">
                        ${category}
                      </button>
                    `;
                  })
                  .join('')}
              </div>
            </div>
            ${filteredMetrics.length
              ? `<div class="metrics-grid">${filteredMetrics
                  .map((metric) => renderMetricCard(metric, state.favoriteMetricIds.includes(metric.id)))
                  .join('')}</div>`
              : '<div class="empty-state">No metrics found for this filter yet.</div>'}
          </section>

          <section class="panel" id="pipeline" aria-labelledby="pipeline-heading">
            <div class="panel__header">
              <div>
                <h2 id="pipeline-heading">Pipeline momentum</h2>
                <p>Assess coverage, velocity, and ownership to forecast revenue confidence.</p>
              </div>
            </div>
            <table class="pipeline-table">
              <thead>
                <tr>
                  <th scope="col">Stage</th>
                  <th scope="col">Weighted value</th>
                  <th scope="col">Conversion</th>
                  <th scope="col">Velocity</th>
                  <th scope="col">Owner</th>
                </tr>
              </thead>
              <tbody>
                ${pipelineRows
                  .map(
                    (row) => `
                      <tr>
                        <th scope="row">${escapeHtml(row.stage)}</th>
                        <td>${escapeHtml(row.value)}</td>
                        <td>${escapeHtml(row.conversion)}</td>
                        <td>${escapeHtml(row.velocity)}</td>
                        <td>${escapeHtml(row.owner)}</td>
                      </tr>
                    `
                  )
                  .join('')}
              </tbody>
            </table>
            <div class="initiative-list" role="list">
              ${state.initiatives
                .map(
                  (item) => `
                    <div class="initiative-card" role="listitem">
                      <header>
                        <h3>${escapeHtml(item.title)}</h3>
                        <span class="badge">${escapeHtml(item.owner)}</span>
                      </header>
                      <p>${escapeHtml(item.detail)}</p>
                    </div>
                  `
                )
                .join('')}
            </div>
          </section>

          <section class="panel" id="leads" aria-labelledby="leads-heading">
            <div class="panel__header">
              <div>
                <h2 id="leads-heading">Priority leads</h2>
                <p>High intent accounts driving near-term revenue impact.</p>
              </div>
            </div>
            <div class="lead-list" role="list">
              ${state.leads
                .map((lead, index) => {
                  const action = lead.contacted
                    ? '<span class="badge badge--success">Contacted</span>'
                    : `<button type="button" data-lead-index="${index}" class="lead-action">Log outreach</button>`;
                  return `
                    <article class="lead-card" role="listitem">
                      <header>
                        <div>
                          <h3>${escapeHtml(lead.company)}</h3>
                          <p>${escapeHtml(lead.source)}</p>
                        </div>
                        <span class="badge">${escapeHtml(lead.stage)}</span>
                      </header>
                      <div class="lead-card__meta">
                        <span>${escapeHtml(lead.value)}</span>
                        <span>Owner: ${escapeHtml(lead.owner)}</span>
                      </div>
                      ${action}
                    </article>
                  `;
                })
                .join('')}
            </div>
          </section>
        </div>

        <div class="column">
          <section class="panel" id="people" aria-labelledby="people-heading">
            <div class="panel__header">
              <div>
                <h2 id="people-heading">People impact</h2>
                <p>Track headcount, morale, and talent outcomes in one glance.</p>
              </div>
            </div>
            <div class="people-highlight-grid">
              ${state.peopleHighlights
                .map(
                  (highlight) => `
                    <article class="people-highlight">
                      <span>${escapeHtml(highlight.label)}</span>
                      <strong>${escapeHtml(highlight.value)}</strong>
                      <small>${escapeHtml(highlight.change)}</small>
                    </article>
                  `
                )
                .join('')}
            </div>
            <div class="hire-list" role="list">
              ${state.hires
                .map(
                  (hire) => `
                    <article class="hire-card" role="listitem">
                      <header>
                        <div>
                          <h3>${escapeHtml(hire.role)}</h3>
                          <p>${escapeHtml(hire.team)}</p>
                        </div>
                        <span class="badge">${escapeHtml(hire.status)}</span>
                      </header>
                      <p>${escapeHtml(hire.impact)}</p>
                      <footer>Start: ${escapeHtml(hire.startDate)}</footer>
                    </article>
                  `
                )
                .join('')}
            </div>
          </section>

          <section class="panel" id="dashboard" aria-labelledby="dashboard-heading">
            <div class="panel__header">
              <div>
                <h2 id="dashboard-heading">My dashboard</h2>
                <p>Create a personal command center that mirrors your leadership scorecard.</p>
              </div>
            </div>
            <form id="custom-widget-form" class="widget-form">
              <label for="custom-widget-title">
                Metric title
                <input id="custom-widget-title" name="title" type="text" placeholder="e.g. Revenue per rep" required />
              </label>
              <label for="custom-widget-value">
                Current value
                <input id="custom-widget-value" name="value" type="text" placeholder="e.g. $86K" required />
              </label>
              <label for="custom-widget-change">
                Momentum (optional)
                <input id="custom-widget-change" name="change" type="text" placeholder="e.g. +12% vs last month" />
              </label>
              <label for="custom-widget-category">
                Category
                <select id="custom-widget-category" name="category">
                  <option value="Revenue">Revenue</option>
                  <option value="Product">Product</option>
                  <option value="People">People</option>
                  <option value="Efficiency">Efficiency</option>
                  <option value="Impact">Impact</option>
                </select>
              </label>
              <label for="custom-widget-note">
                Narrative (optional)
                <textarea id="custom-widget-note" name="note" placeholder="Context to share with stakeholders"></textarea>
              </label>
              <div class="form-actions">
                <button class="action-btn primary" type="submit">Add metric tile</button>
                <button class="action-btn" type="reset">Reset</button>
              </div>
              <div class="widget-feedback" id="widget-feedback">${escapeHtml(state.widgetFeedback)}</div>
            </form>
            ${state.customWidgets.length
              ? `<div class="widget-grid">${state.customWidgets
                  .map((widget) => renderCustomWidget(widget))
                  .join('')}</div>`
              : '<div class="empty-state">Design your investor-ready dashboard by adding tiles above.</div>'}
          </section>
        </div>
      </main>

      <footer class="footer">
        <span>AgentX • Growth intelligence synced to boardroom outcomes.</span>
        <span>Data refresh: ${new Date().toLocaleString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </footer>
    </div>
  `;

  registerInteractions();
}

function renderHeroSpark(trend, timeframe) {
  const width = 220;
  const height = 88;
  const max = Math.max(...trend);
  const min = Math.min(...trend);
  const diff = max - min || 1;
  const step = trend.length > 1 ? width / (trend.length - 1) : width;

  const points = trend.map((value, index) => {
    const x = trend.length > 1 ? step * index : width / 2;
    const y = height - ((value - min) / diff) * height;
    return { x, y };
  });

  const first = points[0];
  const last = points[points.length - 1];
  const linePath = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
    .join(' ');
  const areaPath = `M${first.x.toFixed(2)} ${height.toFixed(2)} ${points
    .map((point) => `L${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
    .join(' ')} L${last.x.toFixed(2)} ${height.toFixed(2)} Z`;

  return `
    <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" class="hero-sparkline" aria-label="${escapeHtml(
      timeframe
    )} performance trend">
      <defs>
        <linearGradient id="hero-gradient-${escapeHtml(timeframe)}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="rgba(90,123,255,0.55)" />
          <stop offset="100%" stop-color="rgba(90,123,255,0.05)" />
        </linearGradient>
      </defs>
      <path d="${areaPath}" fill="url(#hero-gradient-${escapeHtml(timeframe)})" class="sparkline-area"></path>
      <path d="${linePath}" class="sparkline-line"></path>
      <circle cx="${last.x.toFixed(2)}" cy="${last.y.toFixed(2)}" r="4.2" class="sparkline-dot"></circle>
    </svg>
  `;
}

function registerInteractions() {
  document.querySelectorAll('.filter-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      const category = chip.getAttribute('data-category');
      if (!category) return;
      if (appState.selectedCategory === category) {
        appState.selectedCategory = 'All';
      } else {
        appState.selectedCategory = category;
      }
      renderApp(appState);
    });
  });

  document.querySelectorAll('.favorite-toggle').forEach((button) => {
    button.addEventListener('click', () => {
      const metricId = button.getAttribute('data-metric-id');
      toggleFavorite(appState, metricId);
      renderApp(appState);
    });
  });

  document.querySelectorAll('[data-timeframe-id]').forEach((button) => {
    button.addEventListener('click', () => {
      const timeframe = button.getAttribute('data-timeframe-id');
      if (!timeframe) return;
      if (setActiveTimeframe(appState, timeframe)) {
        appState.bannerMessage = `${button.textContent.trim()} snapshot loaded.`;
        renderApp(appState);
      }
    });
  });

  document.querySelectorAll('[data-lead-index]').forEach((button) => {
    button.addEventListener('click', () => {
      const index = Number(button.getAttribute('data-lead-index'));
      if (Number.isNaN(index)) return;
      appState.leads[index].contacted = true;
      appState.bannerMessage = `${appState.leads[index].company} logged as contacted.`;
      renderApp(appState);
    });
  });

  const widgetForm = document.getElementById('custom-widget-form');
  if (widgetForm) {
    widgetForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(widgetForm);
      const title = formData.get('title')?.toString() ?? '';
      const value = formData.get('value')?.toString() ?? '';
      const change = formData.get('change')?.toString() ?? '';
      const category = formData.get('category')?.toString() ?? 'Impact';
      const note = formData.get('note')?.toString() ?? '';

      try {
        const widget = createWidgetPayload({ title, value, change, category, note });
        appState.customWidgets.unshift(widget);
        appState.widgetFeedback = `${title.trim()} added to your dashboard.`;
        widgetForm.reset();
      } catch (error) {
        appState.widgetFeedback = 'Add a title and value to create a tile.';
      }

      renderApp(appState);
    });
  }

  const shareButton = document.getElementById('share-update');
  if (shareButton) {
    shareButton.addEventListener('click', () => {
      appState.bannerMessage = 'Investor snapshot exported to shared drive.';
      renderApp(appState);
    });
  }

  const jumpButton = document.getElementById('jump-to-widget');
  if (jumpButton) {
    jumpButton.addEventListener('click', () => {
      const titleField = document.getElementById('custom-widget-title');
      if (titleField) {
        titleField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        window.setTimeout(() => titleField.focus(), 300);
      }
    });
  }
}

renderApp(appState);
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
