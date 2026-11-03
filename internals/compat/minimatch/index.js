const modern = require('minimatch-modern');

const legacyOptions = options => ({
  windowsPathsNoEscape: process.platform === 'win32',
  ...options,
});

class Minimatch extends modern.Minimatch {
  constructor(pattern, options) {
    super(pattern, legacyOptions(options));
    // Glob 7 reads this metadata to decide whether to include dotfiles.
    this.set.forEach(parts => {
      parts.forEach(part => {
        if (part && typeof part === 'object') {
          Object.defineProperties(part, {
            _glob: { value: part.pattern },
            [Symbol.match]: {
              value: value => (part.test(value) ? [value] : null),
            },
          });
        }
      });
    });
  }
}

// Older Babel, Istanbul, ESLint and offline-plugin consumers expect a callable export.
module.exports = Object.assign(
  (file, pattern, options) =>
    modern.minimatch(file, pattern, legacyOptions(options)),
  modern,
  {
    Minimatch,
    match: (files, pattern, options) =>
      modern.match(files, pattern, legacyOptions(options)),
    filter: (pattern, options) =>
      modern.filter(pattern, legacyOptions(options)),
  },
);
