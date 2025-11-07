const pluginManager = require('./pluginManager');
const sessionStore = require('./sessionStore');
const { calculateRiskProfile } = require('./riskService');
const logger = require('../utils/logger');
const config = require('../config/env');

// Register the default plugins exactly once when the module loads.
const plugins = [
  require('./plugins/researchPlugin'),
  require('./plugins/financialPlugin'),
  require('./plugins/compliancePlugin'),
  require('./plugins/operationsPlugin'),
  require('./plugins/impactPlugin')
];

plugins.forEach((plugin) => {
  if (!pluginManager.get(plugin.id)) {
    pluginManager.register(plugin);
  }
});

class AgentOrchestrator {
  createPlan({
    goal,
    industry,
    region,
    persona,
    constraints = [],
    mission = config.missionStatement
  }) {
    if (!goal) {
      throw new Error('Goal is required to generate a plan.');
    }

    const contextSummary = {
      mission,
      goal,
      industry: industry || 'general',
      region: region || 'global',
      persona: persona || 'founder'
    };

    const steps = [
      {
        id: 'step-1',
        title: 'Deep Market & Needs Research',
        agentId: 'research.intelligence',
        description: 'Gather audience pains, emerging trends, and ethical considerations.',
        successCriteria: 'Research digest with top insights, recommended sources, and validation paths.',
        payload: {
          brief: goal,
          questions: [
            `How does ${goal} solve a present problem in ${industry || 'the target industry'}?`,
            `Which communities benefit most from pursuing ${goal}?`
          ]
        },
        impact: 'medium',
        likelihood: 'medium'
      },
      {
        id: 'step-2',
        title: 'Financial Blueprint & Stewardship',
        agentId: 'finance.steward',
        description: 'Model forecasts, ethical guardrails, and automation for financial operations.',
        successCriteria: 'Multi-month budget, funding recommendations, and automation checklist delivered.',
        payload: {
          objective: goal,
          horizonMonths: 12,
          constraints
        },
        impact: 'high',
        likelihood: 'medium'
      },
      {
        id: 'step-3',
        title: 'Compliance & Risk Alignment',
        agentId: 'compliance.guardian',
        description: 'Outline obligations, risk mitigations, and ethical commitments.',
        successCriteria: 'Compliance obligations mapped to responsible owners with review cadence.',
        payload: {
          jurisdiction: region || 'global',
          industry: industry || 'general',
          mission
        },
        impact: 'high',
        likelihood: 'low'
      },
      {
        id: 'step-4',
        title: 'Operations & Automation Launchpad',
        agentId: 'operations.autopilot',
        description: 'Translate strategy into actionable tasks, automation recipes, and integration plan.',
        successCriteria: 'Actionable task queue with integration prerequisites and automation statuses.',
        payload: {
          playbook: [],
          integrations: []
        },
        impact: 'medium',
        likelihood: 'medium'
      },
      {
        id: 'step-5',
        title: 'Ethics & Impact Review',
        agentId: 'impact.ethics',
        description: 'Evaluate plan against mission, stakeholder impact, and ethical commitments.',
        successCriteria: 'Impact scores and governance checkpoints shared with operators.',
        payload: {
          mission,
          planSteps: []
        },
        impact: 'medium',
        likelihood: 'low'
      }
    ];

    const plan = {
      id: undefined,
      createdAt: new Date().toISOString(),
      context: contextSummary,
      steps,
      ethics: config.ethics,
      mission,
      constraints
    };

    const riskProfile = calculateRiskProfile(plan);

    return { plan, riskProfile };
  }

  async executePlan(sessionId) {
    const session = sessionStore.getSession(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    const { plan } = session;
    const results = [];

    logger.info('Executing plan', { sessionId });
    sessionStore.updateSession(sessionId, { status: 'running' });

    for (const step of plan.steps) {
      sessionStore.pushLog(sessionId, {
        type: 'step:start',
        message: `Starting step: ${step.title}`,
        stepId: step.id
      });

      const payload = { ...step.payload };
      if (step.agentId === 'impact.ethics') {
        payload.planSteps = plan.steps;
      }

      const output = await pluginManager.execute(step.agentId, payload);
      const result = {
        stepId: step.id,
        agentId: step.agentId,
        title: step.title,
        output
      };

      results.push(result);
      sessionStore.appendStepResult(sessionId, result);
      sessionStore.pushLog(sessionId, {
        type: 'step:complete',
        message: `Completed step: ${step.title}`,
        stepId: step.id,
        outputSummary: output.summary
      });
    }

    sessionStore.updateSession(sessionId, { status: 'completed', completedAt: new Date().toISOString() });

    logger.info('Plan execution complete', { sessionId, steps: results.length });
    return results;
  }
}

module.exports = new AgentOrchestrator();
