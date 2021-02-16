#!/usr/bin/env node
const { runSync } = require('./utils');

runSync('lerna run', ['build', '--stream', '--parallel'], { shell: true });
