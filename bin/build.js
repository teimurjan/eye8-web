#!/usr/bin/env node
const { runSync } = require('./utils');

runSync('lerna run', ['--scope "@eye8/app"', 'build', '--stream', '--parallel'], { shell: true });
