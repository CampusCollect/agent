const missionStatement = `To empower individuals and teams to build businesses, create value, manage risk, and access global financial tools autonomously and ethically.`;

module.exports = {
  port: process.env.PORT || 4000,
  missionStatement,
  ethics: {
    principles: [
      'Prioritize community benefit and mindful wealth creation',
      'Ensure transparency, traceability, and accountability across all agent actions',
      'Respect privacy, data minimisation, and consent-first automation'
    ]
  },
  roadmap: {
    repoUrl: 'https://github.com/open-source/agentic-business-studio',
    communicationChannels: ['discussions', 'issues', 'community town-halls'],
    feedbackLoop: 'Contributors can submit ideas through issues or the in-app feedback channel, which feeds the public roadmap.'
  }
};
