const test  = require('ava');
const path  = require('path');
const fs    = require('fs');
const execa = require('execa');

const cd = name => path.resolve(__dirname, name);
const readFile = filePath => fs.readFileSync(filePath, 'utf8').replace(/\n*$/, '');

test('format-yarn-outdated', t => {
  const input = readFile(cd('./fixture/outdated.json'));
  const formatDiff = (args, expected) => {
    const result = execa.sync(cd('../bin/format-yarn-outdated.js'), args, { input });
    t.is(result.stdout, expected);
  };

  const formatDiffRegex = (args, expectedRegex) => {
    const result = execa.sync(cd('../bin/format-yarn-outdated.js'), args, { input });
    t.regex(result.stdout, expectedRegex);
  };

  formatDiff([], readFile(cd('./data/expected.md')));
  formatDiff(['--format', 'markdown'], readFile(cd('./data/expected.md')));
  formatDiff(['--format', 'json'], readFile(cd('./data/expected.json')));
  formatDiff(['--changelogs', cd('./fixture/changelogs.yml')], readFile(cd('./data/expected-with-changelogs.md')));
  formatDiff(['--excludes', cd('./fixture/excludes.yml')], readFile(cd('./data/expected-with-excludes.md')));

  formatDiffRegex(['--format', 'mackerel'], /outdated_npm_packages\.(major|minor|patch)\t1\t\d+/);
});