#!/usr/bin/env node
const { runSync } = require('./utils');

runSync(
  'env SERVER_API_URL=http://0.0.0.0:5000 CLIENT_API_URL=http://0.0.0.0:5000 lerna run',
  ['--scope "@eye8/app"', 'dev', '--stream'],
  { shell: true },
);
