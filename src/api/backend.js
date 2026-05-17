export const API_BASE = 'http://localhost:8888';

export function isSuccessfulResponse(data) {
    return data?.success === true || data?.success === 'true';
}

export function getModelUrl(data) {
    if (!data) return null;
    if (data.path) {
        return `${API_BASE}/${String(data.path).replace(/^\/+/, '')}`;
    }
    return data.url || null;
}

export async function parseBackendResponse(response) {
    let data;
    try {
        data = await response.json();
    } catch {
        data = null;
    }

    if (!response.ok) {
        const message = data?.detail || data?.error || `Backend returned ${response.status}`;
        throw new Error(message);
    }

    return data;
}
