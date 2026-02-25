import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { runLogin } from "./tools/login.js";
import { runGetTask } from "./tools/get-task.js";

const server = new McpServer({
  name: "tarefy",
  version: "1.0.0",
});

server.registerTool(
  "login",
  {
    description:
      "Abre o Chrome na página de login do Tarefy, permite que o usuário faça login, obtém o cookie de autenticação e salva o token para uso pelas demais ferramentas.",
    inputSchema: {
      email: z
        .string()
        .optional()
        .describe(
          "Email do usuário; se informado, é preenchido automaticamente no navegador."
        ),
    },
  },
  async ({ email }) => {
    try {
      await runLogin({ email });
      return {
        content: [
          {
            type: "text",
            text: "Login realizado com sucesso. O token foi salvo e as demais ferramentas já podem ser usadas.",
          },
        ],
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        content: [{ type: "text", text: `Erro no login: ${message}` }],
        isError: true,
      };
    }
  }
);

server.registerTool(
  "get-task",
  {
    description:
      "Obtém os dados gerais de uma task do Tarefy, as conversas internas e as conversas públicas. Requer que o usuário já tenha feito login (ferramenta 'login').",
    inputSchema: {
      taskId: z
        .string()
        .min(1)
        .describe(
          "ID da task (o mesmo da URL: https://app.tarefy.com/task/{{taskId}})."
        ),
      prompt: z
        .string()
        .optional()
        .describe(
          "Instruções sobre o formato/conteúdo da resposta (quais dados incluir, formato etc.). Se omitido, retorna todos os dados em JSON."
        ),
    },
  },
  async ({ taskId, prompt }) => {
    try {
      const text = await runGetTask({ taskId, prompt });
      return {
        content: [{ type: "text", text }],
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        content: [{ type: "text", text: `Erro ao obter task: ${message}` }],
        isError: true,
      };
    }
  }
);

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Tarefy MCP Server running on stdio");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
