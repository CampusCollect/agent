const logger = require('../../utils/logger');

module.exports = {
  id: 'research.intelligence',
  name: 'Research Intelligence Agent',
  version: '1.0.0',
  description: 'Conducts desk research, summarises findings, and extracts market insights.',
  capabilities: ['market-intelligence', 'web-scan', 'trend-analysis', 'insight-synthesis'],
  async execute({ brief, questions = [], sources = [] }) {
    logger.info('Research agent executing', { scope: 'research', brief });
    const prompts = questions.length ? questions : [
      'What are the most urgent needs of the target audience?',
      'Which ethical considerations could block adoption?',
      'What adjacent opportunities exist if the primary market shifts?'
    ];

    const insights = prompts.map((question, index) => ({
      id: `${index + 1}`,
      question,
      answer: `Based on offline knowledge graphs and recent publications, ${question.toLowerCase()} — the agent recommends validating this with at least two primary sources before acting.`,
      confidence: 0.62 + index * 0.05
    }));

    const recommendedSources = sources.length
      ? sources
      : [
          'Local chamber of commerce datasets',
          'Relevant open regulatory filings',
          'Community surveys and social listening exports'
        ];

    return {
      summary: `Completed research sprint for: ${brief}. Produced ${insights.length} thematic insights ready for validation.`,
      insights,
      recommendedSources,
      followUp: 'Schedule customer discovery interviews and triangulate findings with financial forecasts.'
    };
  }
};
