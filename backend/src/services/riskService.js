function calculateRiskProfile(plan) {
  const qualitative = plan.steps.map((step) => ({
    stepId: step.id,
    title: step.title,
    impact: step.impact || 'medium',
    likelihood: step.likelihood || 'medium',
    mitigation: step.mitigation || 'Pair step with compliance review and stakeholder communication.'
  }));

  const aggregateScore = qualitative.reduce((acc, current) => {
    const impactScore = current.impact === 'high' ? 3 : current.impact === 'medium' ? 2 : 1;
    const likelihoodScore = current.likelihood === 'high' ? 3 : current.likelihood === 'medium' ? 2 : 1;
    return acc + impactScore * likelihoodScore;
  }, 0);

  return {
    qualitative,
    aggregateScore,
    rating: aggregateScore > plan.steps.length * 6 ? 'high' : aggregateScore > plan.steps.length * 3 ? 'medium' : 'low'
  };
}

module.exports = { calculateRiskProfile };
