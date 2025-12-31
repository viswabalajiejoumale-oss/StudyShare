const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path: string, opts: RequestInit = {}) {
  const headers = { 'Content-Type': 'application/json', ...authHeaders(), ...(opts.headers || {}) } as any;
  let res: Response;
  try {
    res = await fetch(API_URL + path, { ...opts, headers, credentials: 'include' });
  } catch (err: any) {
    const msg = err?.message || String(err);
    throw new Error(`Network error: could not reach API at ${API_URL}. ${msg}`);
  }

  const text = await res.text();
  let data: any;
  try { data = JSON.parse(text); } catch { data = text; }
  if (!res.ok) {
    const message = (data && (data.error || data.message)) || res.statusText || 'Request failed';
    throw new Error(typeof message === 'string' ? message : JSON.stringify(message));
  }
  return data;
}

export function setAuthToken(token?: string) {
  if (token) localStorage.setItem('token', token);
  else localStorage.removeItem('token');
}

export function getStoredToken() { return localStorage.getItem('token') || undefined; }

// Auth
export async function signup(payload: { email: string; password: string; displayName?: string }) {
  return await request('/api/auth/signup', { method: 'POST', body: JSON.stringify(payload) });
}
export async function login(payload: { email: string; password: string }) {
  return await request('/api/auth/login', { method: 'POST', body: JSON.stringify(payload) });
}
export async function getMe() { return await request('/api/auth/me'); }

export async function updateProfile(userId: string, payload: any) { return await request(`/api/profiles/${userId}`, { method: 'PUT', body: JSON.stringify(payload) }); }
export async function fetchProfile(userId: string) { return await request(`/api/profiles/${userId}`); }

// Notes
export async function fetchNotes(params?: any) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : '';
  return await request(`/api/notes${qs}`);
}
export async function fetchNote(id: string) { return await request(`/api/notes/${id}`); }
export async function createNote(payload: any) { return await request('/api/notes', { method: 'POST', body: JSON.stringify(payload) }); }
export async function updateNote(id: string, payload: any) { return await request(`/api/notes/${id}`, { method: 'PUT', body: JSON.stringify(payload) }); }
export async function deleteNoteAdmin(id: string) { return await request(`/api/notes/${id}`, { method: 'DELETE' }); }
export async function incrementDownload(id: string) { return await request(`/api/notes/${id}/increment-download`, { method: 'POST' }); }

// Admin
export async function getBanned() { return await request('/api/admin/banned'); }
export async function banUserAdmin(userId: string) { return await request('/api/admin/ban', { method: 'POST', body: JSON.stringify({ userId }) }); }
export async function unbanUserAdmin(userId: string) { return await request(`/api/admin/ban/${userId}`, { method: 'DELETE' }); }

// Likes
export async function likeNote(id: string) { return await request(`/api/${id}/like`, { method: 'POST' }); }
export async function unlikeNote(id: string) { return await request(`/api/${id}/like`, { method: 'DELETE' }); }
export async function getLikes(params?: any) { const qs = params ? '?' + new URLSearchParams(params).toString() : ''; return await request(`/api/likes${qs}`); }

// Ratings
export async function rateNote(id: string, rating: number) { return await request(`/api/${id}/rating`, { method: 'POST', body: JSON.stringify({ rating }) }); }
export async function getRatings(params?: any) { const qs = params ? '?' + new URLSearchParams(params).toString() : ''; return await request(`/api/ratings${qs}`); }

// Comments
export async function fetchComments(noteId: string) { return await request(`/api/${noteId}/comments`); }
export async function postComment(noteId: string, content: string) { return await request(`/api/${noteId}/comments`, { method: 'POST', body: JSON.stringify({ content }) }); }
export async function deleteComment(commentId: string) { return await request(`/api/comment/${commentId}`, { method: 'DELETE' }); }

// Uploads (multipart)
export async function uploadFiles(form: FormData) {
  const token = localStorage.getItem('token');
  const res = await fetch(API_URL + '/api/uploads', { method: 'POST', body: form, headers: token ? { Authorization: `Bearer ${token}` } : undefined });
  const json = await res.json();
  return json;
}
export async function getUploads() { return await request('/api/uploads'); }

// Drive upload
export async function driveUpload(payload: any) { return await request('/api/drive-upload', { method: 'POST', body: JSON.stringify(payload) }); }

export default { request }
