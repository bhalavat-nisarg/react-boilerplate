const { deepmerge } = require('deepmerge-ts');

// Jest only uses the two-input function and .all, with default array concatenation.
module.exports = Object.assign((target, source) => deepmerge(target, source), {
  all: objects => deepmerge(...objects),
});
