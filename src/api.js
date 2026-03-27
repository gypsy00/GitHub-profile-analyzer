const BASE = 'https://api.github.com';

async function get(path, token) {
  const headers = { Accept: 'application/vnd.github.v3+json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { headers });

  if (res.status === 404) throw new Error('User not found');
  if (res.status === 403) {
    throw new Error('Rate limit hit — pass --token or set GITHUB_TOKEN to get 5,000 req/hr');
  }
  if (res.status === 401) throw new Error('Bad token — check your GITHUB_TOKEN');
  if (!res.ok) throw new Error(`GitHub API error ${res.status}`);

  return res.json();
}

export async function fetchUser(username, token) {
  return get(`/users/${username}`, token);
}

export async function fetchRepos(username, token) {
  return get(`/users/${username}/repos?sort=pushed&per_page=100`, token);
}

export async function fetchLanguages(owner, repo, token) {
  try {
    return await get(`/repos/${owner}/${repo}/languages`, token);
  } catch {
    return {};
  }
}

export async function fetchEvents(username, token) {
  return get(`/users/${username}/events/public?per_page=100`, token);
}
