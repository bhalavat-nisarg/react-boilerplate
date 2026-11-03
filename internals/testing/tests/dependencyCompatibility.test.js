/** @jest-environment node */
const path = require('path');
const minimatch = require('minimatch');
const { globSync } = require('glob');
const merge = require('deepmerge');

it('supports legacy callable matchers and modern glob consumers', () => {
  expect(minimatch('feature.chunk.js', '*.chunk.js')).toBe(true);
  expect(minimatch('feature.js', '*.chunk.js')).toBe(false);
  expect(minimatch.match(['a.js', 'b.css'], '*.{js,jsx}')).toEqual(['a.js']);
  expect(new minimatch.Minimatch('app/**/!(*.test).js').match('app/a.js')).toBe(
    true,
  );
  expect(
    globSync('internals/testing/tests/*.test.js', { posix: true }),
  ).toContain('internals/testing/tests/dependencyCompatibility.test.js');
  const legacyGlob = require('@babel/cli/node_modules/glob'); // eslint-disable-line global-require
  expect(legacyGlob.sync('internals/testing/tests/*.test.js')).toContain(
    'internals/testing/tests/dependencyCompatibility.test.js',
  );
  const absolutePattern = path.resolve('internals/testing/tests/*.test.js');
  const absoluteFile = path.resolve(
    'internals/testing/tests/dependencyCompatibility.test.js',
  );
  expect(new minimatch.Minimatch(absolutePattern).match(absoluteFile)).toBe(
    true,
  );
  expect(minimatch(absoluteFile, absolutePattern)).toBe(true);
});

it('merges Jest presets and globals without mutating inputs or inheriting poisoned keys', () => {
  const defaults = { nested: { first: true }, setupFiles: ['first.js'] };
  const override = { nested: { second: true }, setupFiles: ['second.js'] };
  expect(merge.all([defaults, override])).toEqual({
    nested: { first: true, second: true },
    setupFiles: ['first.js', 'second.js'],
  });
  expect(defaults.nested).toEqual({ first: true });
  const result = merge({}, JSON.parse('{"__proto__":{"polluted":true}}'));
  expect(result.polluted).toBeUndefined();
  expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
});
