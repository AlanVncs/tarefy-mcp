# @alanvncs/tarefy-mcp

Servidor [MCP](https://modelcontextprotocol.io) para o [Tarefy](https://tarefy.com). Expõe tarefas, conversas internas e conversas públicas para uso por agentes de IA (por exemplo no Cursor).

## O que é o Tarefy

[Tarefy](https://tarefy.com) é uma plataforma de gestão de tarefas e produtividade para equipes, empresas e freelancers: criar tarefas, atribuir responsáveis, definir prazos, acompanhar progresso e centralizar a comunicação. Este servidor MCP expõe as informações completas das tasks (dados gerais + conversas) para agentes de IA.

---

## Instalação do MCP

No Cursor, edite `~/.cursor/mcp.json` (ou o equivalente no seu sistema) e adicione:

```json
{
  "mcpServers": {
    "tarefy": {
      "command": "npx",
      "args": ["@alanvncs/tarefy-mcp@latest"]
    }
  }
}
```

Reinicie o Cursor para carregar o servidor.

---

## Ferramentas

### `login`

Autentica no Tarefy para que as demais ferramentas possam usar a API.

| Parâmetro | Tipo     | Descrição                                                                  |
|----------|----------|----------------------------------------------------------------------------|
| `email`  | opcional | Email do usuário; se informado, o campo de email é preenchido no navegador. |

**Comportamento:**

1. Abre o Chrome (Playwright), acessa a [página de login](https://app.tarefy.com/login) e aguarda o usuário fazer login (o email é preenchido automaticamente se informado).
2. Obtém o cookie `tarefy` (token da API HTTP do Tarefy).
3. Salva o token em `~/.tarefy-mcp/token.txt` para uso pelas outras ferramentas.

**Requisito:** Chrome instalado (o Playwright usa o canal `chrome`).

---

### `get-task`

Obtém os dados completos de uma task: dados gerais, conversas internas (equipe) e conversas públicas (cliente).

| Parâmetro | Tipo        | Descrição                                                                 |
|-----------|-------------|----------------------------------------------------------------------------|
| `taskId`  | obrigatório | ID da task, o mesmo da URL: `https://app.tarefy.com/task/{{taskId}}`.     |
| `prompt`  | opcional    | Instruções sobre formato/conteúdo da resposta. Se omitido, retorna todos os dados em JSON. |

**Comportamento:**

1. Lê o token salvo por `login` (se não houver, retorna erro orientando a usar `login` primeiro).
2. Obtém os dados gerais da task, as conversas internas e as conversas públicas pela API do Tarefy.
3. Sem `prompt`: devolve um JSON no formato `{ task, comments, publicComments }`. Com `prompt`: devolve o mesmo JSON precedido das instruções informadas (para o cliente/agente interpretar ou reformatar).

---

## API do Tarefy (usada pelo servidor)

O servidor chama a API HTTP do Tarefy com os seguintes detalhes.

**Headers em todas as requisições:**

```http
Content-Type: application/json
Authorization: Bearer <token>
```

O `<token>` é o valor do cookie `tarefy` obtido após o login (salvo em `~/.tarefy-mcp/token.txt`).

**Endpoints:**

| Recurso              | Método | URL                                                                 | Observação                                                                 |
|----------------------|--------|---------------------------------------------------------------------|----------------------------------------------------------------------------|
| Dados da task        | GET    | `https://app.tarefy.com/nodeapi/v2/tasks/{{taskId}}`                | `taskId` = ID da URL da task (ex.: `/task/12345` → `12345`).               |
| Conversas internas   | GET    | `https://app.tarefy.com/nodeapi/task/comments?id={{ticketId}}`     | `ticketId` = campo `id` retornado nos dados gerais da task.                 |
| Conversas públicas   | GET    | `https://app.tarefy.com/nodeapi/task/comments/client?id={{ticketId}}` | Idem: `ticketId` = `id` dos dados gerais.                                  |

- **Conversas internas:** alinhamentos da equipe, eventos sistêmicos (ex.: mudança de área); não visíveis para o cliente.
- **Conversas públicas:** aprovações, prazos, pedidos de dados, dúvidas; visíveis para o cliente.

---

## Desenvolvimento

**Requisitos:** Node ≥ 18, [Bun](https://bun.sh) (gerenciador de pacotes).

| Comando           | Descrição                          |
|-------------------|------------------------------------|
| `bun install`    | Instalar dependências              |
| `bun run build`  | Compilar TypeScript → `build/`     |
| `bun run start`  | Rodar o servidor (`node build/index.js`) |
| `bun run dev`    | Rodar sem build (`bun run src/index.ts`) |
| `bun run inspector` | Testar o servidor com [MCP Inspector](https://modelcontextprotocol.io/legacy/tools/inspector) (build + UI em `http://localhost:6274`) |
| `bun test`       | Testes unitários                   |
| `bun run lint`   | ESLint                             |
| `bun run format` | Prettier (formatação)              |

O binário publicado no npm é `build/index.js` (uso com `npx` ou como `tarefy-mcp` após instalação global).

**Publicação no npm:** o workflow do GitHub usa [Trusted Publishing](https://docs.npmjs.com/trusted-publishers) (OIDC); não é necessário configurar `NPM_TOKEN`. É preciso registrar o Trusted Publisher uma vez em npmjs.com → Package → Settings → Trusted publishing (repositório e nome do workflow: `publish-npm.yml`). Para criar um release e dar push no GitHub (dispara o workflow): `bun run release` (bump **patch**) ou `bun run release -- minor` / `bun run release -- major`. Requer [GitHub CLI](https://cli.github.com/) (`gh`) instalado e autenticado.

---

## Licença

MIT
