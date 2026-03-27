import chalk from 'chalk';
import { fmt } from './analyze.js';

const COL = 72; // max output width

// ─── Primitives ──────────────────────────────────────────────────────────────

function rule(label) {
  const pad = COL - label.length - 2;
  console.log('\n' + chalk.cyan(label) + ' ' + chalk.dim('─'.repeat(pad)));
}

function kv(label, value, width = 18) {
  const pad = ' '.repeat(Math.max(0, width - label.length));
  console.log('  ' + chalk.dim(label + pad) + chalk.yellow(value));
}

/**
 * Renders a horizontal bar for a percentage value.
 *
 * TODO: Implement this function.
 *
 * @param {number} pct     The item's percentage (0–100)
 * @param {number} maxPct  The largest percentage in the dataset (used to scale)
 * @param {number} width   Total character width of the bar (filled + empty)
 * @returns {string}       A bar string like "████████░░░░░░░░"
 *
 * Hints to consider:
 *  - How many '█' chars should appear? Scale pct relative to maxPct.
 *  - Fill the rest with '░' so every bar is the same total width.
 *  - Math.round() prevents fractional char counts.
 *  - What should you return if pct is 0?
 */
function renderBar(pct, maxPct, width) {
  if (maxPct === 0) return '░'.repeat(width);
  const filled = Math.round((pct / maxPct) * width);
  return '█'.repeat(filled) + '░'.repeat(width - filled);
}

// ─── Sections ────────────────────────────────────────────────────────────────

export function renderProfile(user) {
  const joined = new Date(user.created_at).getFullYear();
  const name = user.name ? `${user.login}  ${chalk.bold(user.name)}` : user.login;

  console.log('\n' + chalk.bold.white('  ' + name));

  if (user.bio) console.log('  ' + chalk.dim(user.bio));

  const loc = user.location ? `📍 ${user.location}  ` : '';
  const blog = user.blog ? `🔗 ${user.blog}  ` : '';
  if (loc || blog) console.log('  ' + chalk.dim(loc + blog));

  console.log(
    '\n  ' +
      [
        chalk.white(`${fmt(user.public_repos)} repos`),
        chalk.white(`${fmt(user.followers)} followers`),
        chalk.white(`${fmt(user.following)} following`),
        chalk.dim(`since ${joined}`),
      ].join(chalk.dim('  ·  '))
  );
}

export function renderLanguages(languages) {
  if (languages.length === 0) return;
  rule('Languages');

  const maxPct = languages[0].pct; // already sorted descending
  const BAR_WIDTH = 24;
  const labelWidth = Math.max(...languages.map((l) => l.lang.length)) + 2;

  for (const { lang, pct } of languages) {
    const label = lang.padEnd(labelWidth);
    const bar = renderBar(pct, maxPct, BAR_WIDTH);
    const pctStr = pct.toFixed(1).padStart(5) + '%';
    console.log(`  ${chalk.white(label)} ${chalk.green(bar)} ${chalk.dim(pctStr)}`);
  }
}

export function renderRepos(repos) {
  if (repos.length === 0) return;
  rule('Top Repositories');

  const nameWidth = Math.max(...repos.map((r) => r.name.length)) + 2;

  for (const repo of repos) {
    const name = repo.name.padEnd(nameWidth);
    const stars = chalk.yellow(`★ ${fmt(repo.stargazers_count).padStart(5)}`);
    const forks = chalk.dim(`⑂ ${fmt(repo.forks_count).padStart(5)}`);
    const lang = repo.language ? chalk.cyan(repo.language) : chalk.dim('—');
    const forked = repo.fork ? chalk.dim(' fork') : '';
    console.log(`  ${chalk.white(name)} ${stars}  ${forks}  ${lang}${forked}`);
  }
}

export function renderActivity(activity) {
  if (activity.length === 0) return;
  rule('Activity  (last 90 days)');

  const maxCount = activity[0].count;
  const BAR_WIDTH = 28;
  const labelWidth = Math.max(...activity.map((a) => a.type.length)) + 2;

  for (const { type, count } of activity) {
    const label = type.padEnd(labelWidth);
    const bar = renderBar(count, maxCount, BAR_WIDTH);
    console.log(`  ${chalk.white(label)} ${chalk.blue(bar)} ${chalk.dim(count)}`);
  }
}
