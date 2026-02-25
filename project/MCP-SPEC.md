# Servidor MCP para o Tarefy

## Índice

1. [O que é o Tarefy](#o-que-é-o-tarefy)
2. [API do Tarefy](#api-do-tarefy)
3. [Instalação do MCP](#instalação-do-mcp)
4. [Ferramentas do MCP](#ferramentas-do-mcp)

---

## O que é o [Tarefy](https://tarefy.com)

Tarefy é uma plataforma de gestão de tarefas e produtividade voltada principalmente para equipes, empresas e freelancers que querem organizar atividades, acompanhar projetos e monitorar resultados em um único lugar. Funciona como um hub de tarefas e processos, onde você pode:

- Criar tarefas
- Atribuir responsáveis
- Definir prazos
- Acompanhar progresso
- Centralizar comunicação da equipe

O objetivo deste servidor MCP é expor informações completas sobre tasks para uso por agentes de IA.

---

## API do Tarefy

### Headers

```http
Content-Type: application/json
Authorization: {{token}}
```

Onde `{{token}}` é um token do tipo `Bearer eyJhbG...`.

### Endpoints

#### Dados gerais de uma task

```http
GET https://app.tarefy.com/nodeapi/v2/tasks/{{taskId}}
```

- **taskId**: ID da task (o mesmo da URL: `https://app.tarefy.com/task/{{taskId}}`).
- **Retorno**: Dados gerais da task (sem conversas internas e sem conversas públicas).

#### Conversas internas (ocultas para o cliente)

```http
GET https://app.tarefy.com/nodeapi/task/comments?id={{ticketId}}
```

- **ticketId**: Campo `id` dos dados gerais da task.
- **Retorno**: Conversas internas da equipe (ocultas para o cliente), alinhamentos técnicos e eventos sistêmicos (ex.: mudança de área).

#### Conversas públicas (visíveis para o cliente)

```http
GET https://app.tarefy.com/nodeapi/task/comments/client?id={{ticketId}}
```

- **ticketId**: Campo `id` dos dados gerais da task.
- **Retorno**: Conversas públicas (visíveis para o cliente): aprovações, prazos, pedidos de dados, dúvidas etc.

---

## Instalação do MCP

Em `~/cursor/mcp.json` (ou equivalente):

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

---

## Ferramentas do MCP

### `login`

**Inputs**

| Nome   | Tipo    | Descrição |
|--------|---------|-----------|
| `email` | opcional | Email do usuário; se informado, é preenchido automaticamente no navegador. |

**Funcionamento**

1. Abre o Chrome (Playwright), acessa a [página de login](https://app.tarefy.com/login) e aguarda o usuário efetuar login (se o email foi informado, preenche o campo).
2. Obtém o cookie `tarefy`, que corresponde ao token de autenticação da API HTTP do Tarefy.
3. Salva o token na pasta pessoal do usuário para uso pelas demais ferramentas do MCP.

---

### `get-task`

**Inputs**

| Nome    | Tipo    | Descrição |
|---------|---------|-----------|
| `prompt` | opcional | Instruções sobre o formato/conteúdo da resposta (quais dados incluir, formato etc.). Se omitido, retorna todos os dados. |

**Funcionamento**

1. Obtém os dados gerais da task, as conversas internas e as conversas públicas.
2. Com esses dados e o `prompt` (se houver), monta e devolve a resposta. Sem `prompt`, monta e devolve um JSON no formato `{ ...task, comments, publicComments }`.
