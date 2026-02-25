import { loadToken } from "../auth/token-store.js";
import {
  fetchTask,
  fetchInternalComments,
  fetchPublicComments,
  type TarefyTask,
  type TarefyComment,
} from "../api/tarefy.js";

export interface GetTaskInput {
  taskId: string;
  prompt?: string;
}

export interface TaskPayload {
  task: TarefyTask;
  comments: TarefyComment[];
  publicComments: TarefyComment[];
}

/**
 * Obtém dados gerais da task, conversas internas e públicas.
 * Se `prompt` for informado, pode ser usado para formatar/filtrar a resposta
 * (por simplicidade, sem LLM: retornamos JSON; o prompt fica como contexto para o cliente).
 */
export async function runGetTask(input: GetTaskInput): Promise<string> {
  const token = await loadToken();
  if (!token) {
    throw new Error(
      "Token não encontrado. Use a ferramenta 'login' primeiro para autenticar."
    );
  }

  const task = await fetchTask(input.taskId, token);
  const ticketId = task.id;
  if (ticketId == null || typeof ticketId !== "number") {
    throw new Error(
      "Resposta da API da task não contém o campo 'id' (ticketId)."
    );
  }

  const [comments, publicComments] = await Promise.all([
    fetchInternalComments(ticketId, token),
    fetchPublicComments(ticketId, token),
  ]);

  const payload: TaskPayload = {
    task,
    comments,
    publicComments,
  };

  if (input.prompt?.trim()) {
    // Sem LLM no servidor: retornamos JSON completo e o prompt como instrução.
    // O cliente/agente pode usar o prompt para interpretar ou reformatar.
    return [
      "Instruções (prompt):",
      input.prompt.trim(),
      "",
      "Dados (JSON):",
      JSON.stringify(payload, null, 2),
    ].join("\n");
  }

  return JSON.stringify(payload, null, 2);
}
