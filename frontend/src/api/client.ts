const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000';

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`);
  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(body?.message ?? 'Request failed');
  }

  return body as T;
}
