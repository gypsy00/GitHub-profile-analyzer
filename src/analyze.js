/**
 * Merges per-repo language byte counts into a ranked percentage list.
 * @param {object[]} repoLanguageMaps  Array of { Language: bytes } objects
 * @returns {{ lang: string, pct: number }[]}  Top 8, sorted descending
 */
export function analyzeLanguages(repoLanguageMaps) {
  const totals = {};

  for (const map of repoLanguageMaps) {
    for (const [lang, bytes] of Object.entries(map)) {
      totals[lang] = (totals[lang] || 0) + bytes;
    }
  }

  const total = Object.values(totals).reduce((a, b) => a + b, 0);
  if (total === 0) return [];

  return Object.entries(totals)
    .map(([lang, bytes]) => ({ lang, pct: (bytes / total) * 100 }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 8);
}

/**
 * Picks the top N non-fork repos by star count.
 */
export function topRepos(repos, n = 5) {
  return [...repos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, n);
}

/**
 * Counts public event types from the last 90 days.
 * @returns {{ type: string, count: number }[]}
 */
export function analyzeActivity(events) {
  const cutoff = Date.now() - 90 * 24 * 60 * 60 * 1000;
  const counts = {};

  for (const event of events) {
    if (new Date(event.created_at).getTime() < cutoff) continue;
    // Strip "Event" suffix: "PushEvent" → "Push"
    const type = event.type.replace(/Event$/, '');
    counts[type] = (counts[type] || 0) + 1;
  }

  return Object.entries(counts)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
}

export function fmt(n) {
  return Number(n).toLocaleString();
}
