#!/usr/bin/env node
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { program } from 'commander';
import { analyzeProfile } from '../src/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const { version } = JSON.parse(
  readFileSync(join(__dirname, '../package.json'), 'utf8')
);

program
  .name('gh-peek')
  .description('Analyze any GitHub profile from your terminal')
  .version(version)
  .argument('<username>', 'GitHub username to analyze')
  .option('-t, --token <token>', 'GitHub personal access token (or set GITHUB_TOKEN)')
  .option('--top <n>', 'Number of top repos to display', '5')
  .addHelpText(
    'after',
    `
Examples:
  $ gh-peek torvalds
  $ gh-peek sindresorhus --top 10
  $ GITHUB_TOKEN=ghp_xxx gh-peek octocat
  $ gh-peek octocat --token ghp_xxx`
  )
  .action(async (username, options) => {
    await analyzeProfile(username, options);
  });

program.parse();
