const TIMEFRAME_OPTIONS = [
  { id: '7d', label: '7D', description: 'Weekly pulse' },
  { id: '30d', label: '30D', description: 'Monthly momentum' },
  { id: '90d', label: '90D', description: 'Quarter-to-date' }
];

const SUMMARY_VARIANTS = {
  '7d': {
    headline: 'Weekly growth momentum is compounding across revenue and hiring.',
    tagline: 'Operate like a modern CRO: share the story behind revenue, people, and pipeline in minutes.',
    subhead: 'Seven-day pulse distilled for board updates and executive standups.',
    cards: [
      { label: 'Revenue generated', value: '$410K', change: '+$38K WoW' },
      { label: 'Deals added', value: '21', change: '13 enterprise leads' },
      { label: 'People hired', value: '4', change: '2 strategic roles closed' },
      { label: 'Expansions', value: '$88K', change: '+11% vs last week' }
    ]
  },
  '30d': {
    headline: 'Revenue, pipeline, and people momentum are accelerating.',
    tagline: 'Orchestrate revenue, talent, and customer outcomes with investor-grade clarity.',
    subhead: 'Track the KPIs powering the next funding milestone with narrative context.',
    cards: [
      { label: 'Revenue generated', value: '$5.1M ARR', change: '+48% YoY' },
      { label: 'Weighted pipeline', value: '$4.2M', change: '61 deals in motion' },
      { label: 'People hired', value: '9', change: '5 critical roles onboarding' },
      { label: 'Net retention', value: '134%', change: '+4 pts vs plan' }
    ]
  },
  '90d': {
    headline: 'Quarter-to-date performance is beating revenue and efficiency targets.',
    tagline: 'Bring the Robinhood-like clarity of a modern portfolio to your operating metrics.',
    subhead: 'Quarterly legend showing compounding gains and capital efficiency.',
    cards: [
      { label: 'Revenue generated', value: '$14.9M ARR', change: '+52% QoQ' },
      { label: 'Weighted pipeline', value: '$12.1M', change: '182 opportunities' },
      { label: 'People hired', value: '18', change: 'Hiring plan 86% complete' },
      { label: 'Gross margin', value: '78%', change: '+3 pts QoQ' }
    ]
  }
};

const HERO_VARIANTS = {
  '7d': {
    label: 'Active revenue balance',
    value: '$910K',
    change: '+6.4% WoW',
    trend: [640, 662, 675, 688, 704, 721, 728]
  },
  '30d': {
    label: 'Operating growth balance',
    value: '$3.4M',
    change: '+18.6% MoM',
    trend: [2100, 2250, 2310, 2480, 2655, 2890, 3400]
  },
  '90d': {
    label: 'Quarterly growth balance',
    value: '$9.6M',
    change: '+41% QoQ',
    trend: [3200, 3520, 3780, 4150, 4580, 5060, 6120]
  }
};

const METRIC_TEMPLATE = [
  {
    id: 'mrr',
    label: 'Monthly Recurring Revenue',
    category: 'Revenue',
    target: 'Next milestone: $500K MRR by July.',
    note: 'Runway at 18.4 months with current burn plan.'
  },
  {
    id: 'arr',
    label: 'Net New ARR',
    category: 'Revenue',
    target: 'Stretch goal: $180K net new per month.',
    note: 'Enterprise expansion driving 68% of growth.'
  },
  {
    id: 'activation',
    label: 'Enterprise Activation',
    category: 'Product',
    target: 'Goal: 70% activation by May.',
    note: 'Post-sale concierge improving day-7 actions.'
  },
  {
    id: 'nrr',
    label: 'Net Revenue Retention',
    category: 'Revenue',
    target: 'Hold above 130% through Q3.',
    note: 'Churn steady at 1.8%; expansion plans landing.'
  },
  {
    id: 'hires',
    label: 'Critical Roles Filled',
    category: 'People',
    target: 'Finance lead signing offer this week.',
    note: 'Hiring plan 82% complete for go-to-market.'
  },
  {
    id: 'efficiency',
    label: 'LTV to CAC',
    category: 'Efficiency',
    target: 'Maintain above 5x while scaling ads.',
    note: 'CAC payback now 7.8 months.'
  }
];

const METRIC_VARIANTS = {
  '7d': {
    mrr: { value: '$410K', change: '+3.1% WoW', trend: [362, 368, 374, 381, 392, 401, 410] },
    arr: { value: '$58K', change: '+18% vs plan', trend: [34, 36, 40, 44, 48, 53, 58] },
    activation: { value: '61%', change: '+4 pts', trend: [48, 49, 51, 54, 56, 59, 61] },
    nrr: { value: '132%', change: '+3 pts', trend: [118, 119, 121, 123, 126, 129, 132] },
    hires: { value: '4', change: '+2 this week', trend: [1, 1, 2, 2, 3, 4, 4] },
    efficiency: { value: '5.3x', change: '+0.2x', trend: [4.7, 4.8, 4.9, 5.1, 5.2, 5.2, 5.3] }
  },
  '30d': {
    mrr: { value: '$428K', change: '+12.4% MoM', trend: [320, 335, 348, 360, 385, 402, 428] },
    arr: { value: '$146K', change: '+28% vs target', trend: [68, 72, 88, 102, 119, 134, 146] },
    activation: { value: '63%', change: '+6 pts', trend: [44, 47, 51, 55, 58, 60, 63] },
    nrr: { value: '134%', change: '+4 pts', trend: [118, 120, 122, 125, 128, 130, 134] },
    hires: { value: '9', change: '+3 this month', trend: [1, 2, 2, 3, 4, 6, 9] },
    efficiency: { value: '5.6x', change: '+0.4x', trend: [4.1, 4.3, 4.6, 4.8, 5.1, 5.3, 5.6] }
  },
  '90d': {
    mrr: { value: '$452K', change: '+29% QoQ', trend: [285, 300, 328, 356, 382, 416, 452] },
    arr: { value: '$402K', change: '+54% vs last quarter', trend: [120, 142, 188, 236, 278, 334, 402] },
    activation: { value: '68%', change: '+11 pts', trend: [42, 46, 51, 55, 60, 64, 68] },
    nrr: { value: '139%', change: '+7 pts', trend: [120, 122, 126, 129, 132, 135, 139] },
    hires: { value: '18', change: '+7 this quarter', trend: [6, 8, 10, 11, 13, 15, 18] },
    efficiency: { value: '5.9x', change: '+0.7x', trend: [4.2, 4.4, 4.9, 5.2, 5.4, 5.6, 5.9] }
  }
};

const PIPELINE_VARIANTS = {
  '7d': [
    { stage: 'Qualified Pipeline', value: '$1.1M', conversion: '31% win rate', velocity: '12.8 day avg', owner: 'Growth Pod A' },
    { stage: 'Negotiation', value: '$860K', conversion: '58% win rate', velocity: '9.1 day avg', owner: 'Enterprise Pod' },
    { stage: 'Commit', value: '$540K', conversion: '84% win rate', velocity: '6.9 day avg', owner: 'Executive Sponsor' }
  ],
  '30d': [
    { stage: 'Qualified Pipeline', value: '$1.7M', conversion: '34% win rate', velocity: '11.2 day avg', owner: 'Growth Pod A' },
    { stage: 'Negotiation', value: '$1.3M', conversion: '62% win rate', velocity: '8.4 day avg', owner: 'Enterprise Pod' },
    { stage: 'Commit', value: '$820K', conversion: '88% win rate', velocity: '6.1 day avg', owner: 'Executive Sponsor' }
  ],
  '90d': [
    { stage: 'Qualified Pipeline', value: '$2.6M', conversion: '36% win rate', velocity: '10.6 day avg', owner: 'Growth Pod A' },
    { stage: 'Negotiation', value: '$2.1M', conversion: '64% win rate', velocity: '8.1 day avg', owner: 'Enterprise Pod' },
    { stage: 'Commit', value: '$1.6M', conversion: '89% win rate', velocity: '5.6 day avg', owner: 'Executive Sponsor' }
  ]
};

const PEOPLE_HIGHLIGHTS = [
  { label: 'Headcount', value: '68', change: '+11 QoQ' },
  { label: 'Revenue / FTE', value: '$75K', change: '+12% YoY' },
  { label: 'Engagement', value: '+46 eNPS', change: '+8 pts' }
];

const HIRES = [
  {
    role: 'Director of Growth Marketing',
    impact: 'Orchestrating multi-touch campaigns to fill enterprise pipeline.',
    status: 'Offer signed',
    startDate: 'Apr 22',
    team: 'Go-to-Market'
  },
  {
    role: 'Staff Data Scientist',
    impact: 'Deploying predictive scoring that lifted win rates by 9 pts.',
    status: 'In onboarding',
    startDate: 'Apr 8',
    team: 'Product Intelligence'
  },
  {
    role: 'People Ops Partner',
    impact: 'Accelerating hiring cycle time and manager enablement.',
    status: 'Final interviews',
    startDate: 'Target May 6',
    team: 'People'
  }
];

const INITIATIVES = [
  {
    title: 'PLG activation sprint',
    detail: 'Lifecycle squad launching usage-based nudges for self-serve pipeline.',
    owner: 'Product Marketing'
  },
  {
    title: 'Hiring pipeline automation',
    detail: 'RevOps + People Ops automating top-of-funnel scorecards to cut time-to-hire.',
    owner: 'People Ops'
  },
  {
    title: 'Investor spotlight tour',
    detail: 'Executive team preparing curated dashboards for partner briefings.',
    owner: 'Leadership'
  }
];

const LEADS = [
  {
    company: 'Helios Robotics',
    value: '$280K ARR',
    source: 'Warm intro – Series B partner',
    owner: 'Dana',
    stage: 'Demo booked',
    contacted: false
  },
  {
    company: 'Northwind Energy',
    value: '$190K ARR',
    source: 'Outbound – ABM campaign',
    owner: 'Luis',
    stage: 'Business case review',
    contacted: false
  },
  {
    company: 'Atlas Bio',
    value: '$86K ARR',
    source: 'Product qualified lead',
    owner: 'Shreya',
    stage: 'Legal redlines',
    contacted: true
  }
];

function deepClone(value) {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value));
}

function buildMetrics(timeframe) {
  const variants = METRIC_VARIANTS[timeframe] || {};
  return METRIC_TEMPLATE.map((metric) => {
    const variant = variants[metric.id] || {};
    return {
      ...metric,
      value: variant.value ?? '',
      change: variant.change ?? '',
      trend: variant.trend ? [...variant.trend] : []
    };
  });
}

function buildSnapshots() {
  return TIMEFRAME_OPTIONS.reduce((acc, option) => {
    acc[option.id] = {
      summary: deepClone(SUMMARY_VARIANTS[option.id]),
      metrics: buildMetrics(option.id),
      pipeline: deepClone(PIPELINE_VARIANTS[option.id]),
      hero: deepClone(HERO_VARIANTS[option.id])
    };
    return acc;
  }, {});
}

export function escapeHtml(value = '') {
  return value
    .toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function getChangeDirection(change) {
  if (!change) return 'up';
  const trimmed = change.toString().trim();
  return trimmed.startsWith('-') ? 'down' : 'up';
}

export function buildSparkline(trend = [], id) {
  if (!trend.length || !id) {
    return '';
  }

  const width = 120;
  const height = 48;
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
    <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" aria-hidden="true" class="sparkline">
      <defs>
        <linearGradient id="gradient-${escapeHtml(id)}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="rgba(81,255,231,0.45)" />
          <stop offset="100%" stop-color="rgba(81,255,231,0.05)" />
        </linearGradient>
      </defs>
      <path d="${areaPath}" fill="url(#gradient-${escapeHtml(id)})" class="sparkline-area"></path>
      <path d="${linePath}" class="sparkline-line"></path>
      <circle cx="${last.x.toFixed(2)}" cy="${last.y.toFixed(2)}" r="3.6" class="sparkline-dot"></circle>
    </svg>
  `;
}

export function renderMetricCard(metric, isFavorite = false) {
  const direction = getChangeDirection(metric.change);
  return `
    <article class="metric-card" data-metric-id="${escapeHtml(metric.id)}">
      <header class="metric-card__header">
        <div>
          <span class="metric-card__category">${escapeHtml(metric.category)}</span>
          <h3>${escapeHtml(metric.label)}</h3>
        </div>
        <button class="favorite-toggle" type="button" data-metric-id="${escapeHtml(metric.id)}" aria-pressed="${isFavorite}">
          <span class="favorite-toggle__icon" aria-hidden="true">${isFavorite ? '★' : '☆'}</span>
          <span class="sr-only">${isFavorite ? 'Remove from focus metrics' : 'Add to focus metrics'}</span>
        </button>
      </header>
      <div class="metric-card__body">
        <strong>${escapeHtml(metric.value)}</strong>
        <small data-direction="${direction}">${escapeHtml(metric.change)}</small>
      </div>
      ${buildSparkline(metric.trend, `${metric.id}-card`)}
      <footer>
        <span>${escapeHtml(metric.note)}</span>
        <span class="metric-card__target">${escapeHtml(metric.target)}</span>
      </footer>
    </article>
  `;
}

export function renderFavoriteTile(metric) {
  const direction = getChangeDirection(metric.change);
  return `
    <article class="favorite-card" data-metric-id="${escapeHtml(metric.id)}">
      <header>
        <span>${escapeHtml(metric.category)}</span>
        <button class="favorite-toggle" type="button" data-metric-id="${escapeHtml(metric.id)}" aria-pressed="true">
          <span class="favorite-toggle__icon" aria-hidden="true">★</span>
          <span class="sr-only">Remove ${escapeHtml(metric.label)} from focus metrics</span>
        </button>
      </header>
      <strong>${escapeHtml(metric.value)}</strong>
      <small data-direction="${direction}">${escapeHtml(metric.change)}</small>
      ${buildSparkline(metric.trend, `${metric.id}-favorite`)}
    </article>
  `;
}

export function renderCustomWidget(widget) {
  const direction = getChangeDirection(widget.change);
  return `
    <article class="widget-card">
      <header>
        <div>
          <span class="widget-card__category">${escapeHtml(widget.category)}</span>
          <h3>${escapeHtml(widget.title)}</h3>
        </div>
        ${widget.change
          ? `<small data-direction="${direction}">${escapeHtml(widget.change)}</small>`
          : ''}
      </header>
      <strong>${escapeHtml(widget.value)}</strong>
      ${widget.note ? `<p>${escapeHtml(widget.note)}</p>` : ''}
    </article>
  `;
}

export function getFilteredMetrics(metrics = [], category = 'All') {
  if (category === 'All') return metrics;
  return metrics.filter((metric) => metric.category === category);
}

export function getActiveSnapshot(state) {
  if (!state) return { summary: { cards: [] }, metrics: [], pipeline: [], hero: {} };
  return state.snapshots[state.timeframe] || { summary: { cards: [] }, metrics: [], pipeline: [], hero: {} };
}

export function setActiveTimeframe(state, timeframeId) {
  if (!state || !state.snapshots?.[timeframeId]) {
    return false;
  }
  if (state.timeframe === timeframeId) {
    return false;
  }
  state.timeframe = timeframeId;
  return true;
}

export function toggleFavorite(state, metricId) {
  if (!state || !metricId) return [];
  const favorites = state.favoriteMetricIds || [];
  const index = favorites.indexOf(metricId);
  if (index > -1) {
    favorites.splice(index, 1);
  } else {
    favorites.unshift(metricId);
  }
  state.favoriteMetricIds = Array.from(new Set(favorites)).slice(0, 4);
  return state.favoriteMetricIds;
}

export function createWidgetPayload({ title, value, change = '', category = 'Impact', note = '' }) {
  if (!title || !value) {
    throw new Error('Title and value are required');
  }
  return {
    title: escapeHtml(title.trim()),
    value: escapeHtml(value.trim()),
    change: change ? escapeHtml(change.trim()) : '',
    category: escapeHtml(category.trim() || 'Impact'),
    note: note ? escapeHtml(note.trim()) : ''
  };
}

export function createInitialState() {
  return {
    timeframe: '30d',
    timeframeOptions: deepClone(TIMEFRAME_OPTIONS),
    selectedCategory: 'All',
    snapshots: buildSnapshots(),
    peopleHighlights: deepClone(PEOPLE_HIGHLIGHTS),
    hires: deepClone(HIRES),
    initiatives: deepClone(INITIATIVES),
    leads: deepClone(LEADS),
    favoriteMetricIds: ['mrr', 'nrr', 'activation'],
    customWidgets: [],
    widgetFeedback: '',
    bannerMessage: ''
  };
}
