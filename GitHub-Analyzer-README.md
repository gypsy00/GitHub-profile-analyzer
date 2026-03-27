# gh-profile-peek

A CLI tool that analyzes any GitHub profile from your terminal — languages, top repos, and recent activity rendered as colored bar charts.

![npm version](https://img.shields.io/npm/v/gh-profile-peek)
![License](https://img.shields.io/badge/license-MIT-blue)
![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)

## Quick Start

```bash
npx gh-profile-peek torvalds
```

Or install globally:

```bash
npm install -g gh-profile-peek
gh-peek torvalds
```

## Example Output

```
  torvalds  Linus Torvalds
  📍 Portland, OR

  11 repos  ·  293,325 followers  ·  0 following  ·  since 2011

Languages ─────────────────────────────────────────────────────────
  C          ████████████████████████  97.7%
  Assembly   ░░░░░░░░░░░░░░░░░░░░░░░░   0.7%
  Shell      ░░░░░░░░░░░░░░░░░░░░░░░░   0.4%
  Rust       ░░░░░░░░░░░░░░░░░░░░░░░░   0.3%

Top Repositories ──────────────────────────────────────────────────
  linux         ★ 225,374  ⑂ 61,242  C
  AudioNoise    ★  4,303   ⑂    203  C
  uemacs        ★  1,954   ⑂    307  C

Activity  (last 90 days) ──────────────────────────────────────────
  Push           ████████████████████████████ 75
  IssueComment   █░░░░░░░░░░░░░░░░░░░░░░░░░░░ 2
```

## Usage

```
gh-peek <username> [options]
```

### Options

| Flag | Description |
|------|-------------|
| `-t, --token <token>` | GitHub personal access token |
| `--top <n>` | Number of top repos to display (default: 5) |
| `-V, --version` | Show version number |
| `-h, --help` | Show help |

### Examples

```bash
# Basic usage
gh-peek sindresorhus

# Show top 10 repos
gh-peek sindresorhus --top 10

# Authenticate for higher rate limits (5,000 req/hr vs 60)
gh-peek octocat --token ghp_xxxxxxxxxxxx

# Or use an environment variable
export GITHUB_TOKEN=ghp_xxxxxxxxxxxx
gh-peek octocat
```

## What It Analyzes

- **Profile** — name, bio, location, follower/following counts, account age
- **Languages** — aggregated byte counts across up to 30 repos, rendered as percentage bar charts
- **Top Repositories** — ranked by stars, showing fork count and primary language
- **Recent Activity** — public events from the last 90 days grouped by type (Push, PullRequest, Issues, etc.)

## Tech Stack

| Tool | Purpose |
|------|---------|
| **Node.js 18+** | Runtime (native `fetch`, no polyfills) |
| **Commander** | CLI argument parsing |
| **Chalk v5** | Terminal colors (pure ESM) |
| **Ora** | Loading spinners |
| **GitHub REST API v3** | Data source |

Zero backend. Zero build step. Pure ESM (`"type": "module"`).

## Project Structure

```
GitHub-profile-analyzer/
├── bin/
│   └── cli.js           # Entry point — shebang, commander setup
├── src/
│   ├── api.js           # GitHub REST API calls (fetch-native)
│   ├── analyze.js       # Data processing — language %, top repos, activity
│   ├── display.js       # Terminal rendering — bars, boxes, formatting
│   └── index.js         # Orchestrator — fetch → analyze → render
├── package.json         # npm config — bin field, ESM, engines
└── .npmignore           # Keeps .env and test files out of the tarball
```

## How It Works

1. **Fetch** — hits 3 GitHub API endpoints: `/users/:username`, `/users/:username/repos`, and `/repos/:owner/:repo/languages` for each repo
2. **Analyze** — merges language byte counts into percentages, ranks repos by stars, groups events by type
3. **Render** — prints colored output with bar charts scaled relative to the max value (not 100%), so bars always fill the available width

### Rate Limits

| Auth | Limit |
|------|-------|
| No token | 60 requests/hour |
| With `--token` or `GITHUB_TOKEN` | 5,000 requests/hour |

The tool samples up to 30 repos for language analysis to stay well within limits.

## Getting a GitHub Token

1. Go to [github.com/settings/tokens](https://github.com/settings/tokens)
2. Click **Generate new token (classic)**
3. Select scopes: `public_repo`, `read:user`
4. Copy the token and use it with `--token` or set `GITHUB_TOKEN`

## Publishing to npm

```bash
npm login
npm publish
```

Requires 2FA enabled on your [npmjs.com](https://www.npmjs.com) account.

After publishing, anyone can run:

```bash
npx gh-profile-peek <username>
```

## Known Limitations

- Only analyzes **public** repositories and events
- Language analysis samples the **30 most recently pushed** repos
- Activity data covers the **last 90 days** of public events (GitHub API limit)
- Events endpoint returns a max of 100 events

## Future Enhancements

- [ ] `--json` flag for machine-readable output
- [ ] `--compare user1 user2` for side-by-side profiles
- [ ] Color-coded language dots matching GitHub's language colors
- [ ] Contribution streak calculation
- [ ] Export to PNG/SVG

## License

MIT
