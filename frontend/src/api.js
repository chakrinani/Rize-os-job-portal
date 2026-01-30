const API_BASE = process.env.REACT_APP_API_URL || '';

export function getToken() {
  return localStorage.getItem('token');
}

export async function signup(email, password) {
  const res = await fetch(`${API_BASE}/api/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Signup failed');
  return data;
}

export async function login(email, password) {
  const res = await fetch(`${API_BASE}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Login failed');
  return data;
}

export function setAuth(token, user) {
  if (token) {
    localStorage.setItem('token', token);
    if (user && user.email) localStorage.setItem('userEmail', user.email);
  } else {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
  }
}

export function getStoredUserEmail() {
  return localStorage.getItem('userEmail') || '';
}

export function isAuthenticated() {
  return !!getToken();
}

export async function api(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export async function getJobs() {
  // Public endpoint - no auth required
  const res = await fetch(`${API_BASE}/api/jobs`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to fetch jobs');
  return data;
}

export async function createJob(job) {
  return api('/api/jobs', { method: 'POST', body: JSON.stringify(job) });
}

export async function getProfile() {
  return api('/api/profile');
}

export async function updateProfile(profile) {
  return api('/api/profile', { method: 'PUT', body: JSON.stringify(profile) });
}

export async function verifyPayment(txHash, walletAddress) {
  const res = await fetch(`${API_BASE}/api/verify-payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(getToken() && { Authorization: `Bearer ${getToken()}` }),
    },
    body: JSON.stringify({ txHash, walletAddress }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Verification failed');
  return data;
}
