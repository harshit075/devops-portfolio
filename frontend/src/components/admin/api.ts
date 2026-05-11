export const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function fetchJson(url: string) {
  const res = await fetch(`${API}${url}`);
  return res.json();
}

export async function postJson(url: string, body: any) {
  const res = await fetch(`${API}${url}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
  });
  return res.json();
}

export async function putJson(url: string, body?: any) {
  const res = await fetch(`${API}${url}`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined
  });
  return res.json();
}

export async function del(url: string) {
  await fetch(`${API}${url}`, { method: 'DELETE' });
}

export interface Stats {
  todos: { total: number; done: number };
  diary: { total: number };
  goals: { total: number; avgProgress: number };
}
