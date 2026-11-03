const OfflinePlugin = require('offline-plugin');

module.exports = class extends OfflinePlugin {
  resolveToolPaths(tool, key, compiler) {
    super.resolveToolPaths(tool, key, compiler);
    // The upstream plugin joins URL paths with the host's filesystem separator.
    Object.assign(tool, { location: tool.location.replace(/\\/g, '/') });
  }
};
