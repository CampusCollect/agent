/* Simple logger with contextual tagging to keep agent actions explainable */
const levels = ['debug', 'info', 'warn', 'error'];

function log(level, message, meta = {}) {
  if (!levels.includes(level)) {
    throw new Error(`Unsupported log level: ${level}`);
  }
  const timestamp = new Date().toISOString();
  const context = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
  // eslint-disable-next-line no-console
  console[level === 'debug' ? 'log' : level](`[${timestamp}] [${level.toUpperCase()}] ${message}${context}`);
}

module.exports = {
  debug: (message, meta) => log('debug', message, meta),
  info: (message, meta) => log('info', message, meta),
  warn: (message, meta) => log('warn', message, meta),
  error: (message, meta) => log('error', message, meta)
};
