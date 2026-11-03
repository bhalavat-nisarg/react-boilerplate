const modern = require('loader-utils-modern');

module.exports = {
  ...modern,
  // offline-plugin only passes its own URI-encoded `json` parameter.
  parseQuery: query =>
    Object.fromEntries(new URLSearchParams(query.replace(/^\?/, ''))),
  stringifyRequest: (context, request) =>
    JSON.stringify(context.utils.contextify(context.context, request)),
};
