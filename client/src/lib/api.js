const TOKEN_KEY = 'cairn.token';

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

async function request(method, path, body) {
  const headers = { 'Content-Type': 'application/json' };
  const token = tokenStore.get();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`/api${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) {
    const err = new Error(data.error || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  // auth
  register: (body) => request('POST', '/auth/register', body),
  login: (body) => request('POST', '/auth/login', body),
  me: () => request('GET', '/auth/me'),

  // goals
  listGoals: () => request('GET', '/goals'),
  getGoal: (id) => request('GET', `/goals/${id}`),
  createGoal: (body) => request('POST', '/goals', body),
  updateGoal: (id, body) => request('PATCH', `/goals/${id}`, body),
  deleteGoal: (id) => request('DELETE', `/goals/${id}`),
  reorderGoals: (order) => request('PATCH', '/goals/reorder', { order }),

  // tasks
  listTasks: (query = {}) => {
    const qs = new URLSearchParams(query).toString();
    return request('GET', `/tasks${qs ? `?${qs}` : ''}`);
  },
  createTask: (body) => request('POST', '/tasks', body),
  updateTask: (id, body) => request('PATCH', `/tasks/${id}`, body),
  deleteTask: (id) => request('DELETE', `/tasks/${id}`),

  // stats
  dashboard: () => request('GET', '/stats/dashboard'),
  history: () => request('GET', '/stats/history'),
  activity: () => request('GET', '/stats/activity'),
};
