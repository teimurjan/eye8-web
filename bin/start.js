#!/usr/bin/env node
const { runSync } = require('./utils');

runSync(
  'lerna run',
  ['--scope "@eye8/app"', 'start', '--stream'],
  { shell: true },
);
