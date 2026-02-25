const BASE = "https://app.tarefy.com";

export interface TarefyTask {
  id?: number;
  [key: string]: unknown;
}

export interface TarefyComment {
  [key: string]: unknown;
}

/**
 * Cliente HTTP para a API do Tarefy.
 * Headers: Content-Type: application/json, Authorization: Bearer <token>
 */
export async function fetchTask(
  taskId: string,
  token: string
): Promise<TarefyTask> {
  const url = `${BASE}/nodeapi/v2/tasks/${encodeURIComponent(taskId)}`;
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Tarefy API task: ${res.status} ${res.statusText} - ${text}`
    );
  }
  return (await res.json()) as TarefyTask;
}

/**
 * Conversas internas (ocultas para o cliente).
 * GET .../nodeapi/task/comments?id={{ticketId}}
 */
export async function fetchInternalComments(
  ticketId: number,
  token: string
): Promise<TarefyComment[]> {
  const url = `${BASE}/nodeapi/task/comments?id=${ticketId}`;
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Tarefy API comments: ${res.status} ${res.statusText} - ${text}`
    );
  }
  const data = (await res.json()) as
    | TarefyComment[]
    | { comments?: TarefyComment[] };
  if (Array.isArray(data)) return data;
  if (
    data &&
    typeof data === "object" &&
    "comments" in data &&
    Array.isArray(data.comments)
  )
    return data.comments;
  return [];
}

/**
 * Conversas públicas (visíveis para o cliente).
 * GET .../nodeapi/task/comments/client?id={{ticketId}}
 */
export async function fetchPublicComments(
  ticketId: number,
  token: string
): Promise<TarefyComment[]> {
  const url = `${BASE}/nodeapi/task/comments/client?id=${ticketId}`;
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Tarefy API client comments: ${res.status} ${res.statusText} - ${text}`
    );
  }
  const data = (await res.json()) as
    | TarefyComment[]
    | { comments?: TarefyComment[] };
  if (Array.isArray(data)) return data;
  if (
    data &&
    typeof data === "object" &&
    "comments" in data &&
    Array.isArray(data.comments)
  )
    return data.comments;
  return [];
}
