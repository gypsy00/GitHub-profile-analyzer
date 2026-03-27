import ora from 'ora';
import chalk from 'chalk';
import { fetchUser, fetchRepos, fetchLanguages, fetchEvents } from './api.js';
import { analyzeLanguages, topRepos, analyzeActivity } from './analyze.js';
import { renderProfile, renderLanguages, renderRepos, renderActivity } from './display.js';

export async function analyzeProfile(username, { token, top = 5 }) {
  const resolvedToken = token || process.env.GITHUB_TOKEN;
  const spinner = ora(`Fetching ${chalk.cyan(username)}`).start();

  try {
    // 1. User profile
    spinner.text = `Fetching profile for ${chalk.cyan(username)}`;
    const user = await fetchUser(username, resolvedToken);

    // 2. Repos + languages (in parallel, capped at 30 repos to stay within rate limits)
    spinner.text = 'Fetching repositories…';
    const repos = await fetchRepos(username, resolvedToken);
    const sample = repos.slice(0, 30);

    spinner.text = 'Analyzing languages…';
    const langMaps = await Promise.all(
      sample.map((r) => fetchLanguages(r.owner.login, r.name, resolvedToken))
    );

    // 3. Recent public events
    spinner.text = 'Fetching recent activity…';
    let events = [];
    try {
      events = await fetchEvents(username, resolvedToken);
    } catch {
      // Events endpoint can be empty for private accounts — not fatal
    }

    spinner.succeed(chalk.green(`${username} — done`));

    // ── Render ──────────────────────────────────────────────────────────────
    renderProfile(user);
    renderLanguages(analyzeLanguages(langMaps));
    renderRepos(topRepos(repos, Number(top)));
    renderActivity(analyzeActivity(events));
    console.log('');
  } catch (err) {
    spinner.fail(chalk.red(err.message));
    process.exit(1);
  }
}
