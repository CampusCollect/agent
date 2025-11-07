const logger = require('../utils/logger');

class PluginManager {
  constructor() {
    this.plugins = new Map();
  }

  register(plugin) {
    if (!plugin || !plugin.id) {
      throw new Error('Plugins must define an id');
    }
    this.plugins.set(plugin.id, plugin);
    logger.info(`Registered plugin ${plugin.id}`, { scope: 'plugin-manager' });
    return plugin;
  }

  list() {
    return Array.from(this.plugins.values()).map(({ id, name, description, capabilities, version }) => ({
      id,
      name,
      description,
      capabilities,
      version
    }));
  }

  get(id) {
    return this.plugins.get(id);
  }

  async execute(id, payload) {
    const plugin = this.plugins.get(id);
    if (!plugin) {
      throw new Error(`Plugin ${id} not found`);
    }
    if (typeof plugin.execute !== 'function') {
      throw new Error(`Plugin ${id} cannot be executed`);
    }
    return plugin.execute(payload);
  }
}

module.exports = new PluginManager();
