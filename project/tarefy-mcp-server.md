# Servidor MCP para o Tarefy

## O que é o [Tarefy](https://tarefy.com)

Tarefy é uma plataforma de gestão de tarefas e produtividade voltada principalmente para equipes, empresas e freelancers que querem organizar atividades, acompanhar projetos e monitorar resultados em um único lugar. Ele funciona como um hub de tarefas e processos, onde você pode:

- Criar tarefas
- Atribuir responsáveis
- Definir prazos
- Acompanhar progresso
- Centralizar comunicação da equipe

O principal objetivo deste servidor MCP é oferecer informações completas sobre tasks, de modo que essas informações sejam usadas por agentes de inteligência artificial.

## API do tarefy

### Endpoints

- Obter dados gerais de uma task

```bash
GET https://app.tarefy.com/nodeapi/v2/tasks/{{taskId}}

# taskId -> ID da task (mesmo ID presente na URL da task https://app.tarefy.com/task/{{taskId}})

# Retorno: Informações gerais da task (sem as conversas internas e sem a conversas públicas).
```

- Obter conversas internas (ocultas para o cliente)

```bash
GET https://app.tarefy.com/nodeapi/task/comments?id={{ticketId}}
# ticketId -> Campo `id` proveniente dos dados gerais da task

# Retorno: Conversas internas da equipe (ocultas para o cliente) usadas para alinhamentos técnicos a respeito do ticket, além de informações sistêmicas como, por exemplo, quando o chamado mudou de área.
```

- Obter conversas públicas (visíveis para o cliente)

```bash
GET https://app.tarefy.com/nodeapi/task/comments/client?id={{ticketId}}
# ticketId -> Campo `id` proveniente dos dados gerais da task

# Retorno: Conversas públicas (visíveis para o cliente), usadas, principalmente, para alinhamentos com o cliente como aprovações de layout e desenvolvimento, alinhamento de prazos, pedido de dados necessários, dúvidas etc)
```

### Headers

```bash
Content-Type: application/json
Authorization: {{token}} # Autenticação - Token do tipo `Bearer eyJhbG...`
```

## Instalação do MCP

```json
// ~/cursor/mcp.json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["@alanvncs/tarefy-mcp@latest"]
    }
  }
}
```

## Ferramentas do MCP

**Ferramenta**: `login`

**Inputs**:
`email` (opcional) - Email do usuário que, se informado, será preenchido automaticamente no navegador

**Funcionamento**:

1. Abre o Chrome (Playwright), acessa a [página de login](https://app.tarefy.com/login) e aguarda o usuário efetuar login (se o email do usuário foi recebido, preenche automaticamente).

2. Obtém o cookie de nome `tarefy`, que é, na verdade, o token de autenticação para uso da API HTTP do Tarefy.

3. Salva o token na pasta pessoal do usuário, onde será lido por outras ferramentas do MCP

---

**Tool**: `get-task`

**Inputs**:
`prompt` (opcional) - É usado para descrever como deve ser a resposta. O agente pode informar quais dados está buscando, o formato da resposta ou qualquer coisa que julgar pertinente. Se quiser todos os dados, basta não enviar o prompt.

**Descrição**:

1. Obtém os dados gerais da task, as conversas internas e as conversas públicas

2. Com os dados obtidos no passo anterior e o prompt recebido, devolve a resposta correspondente. Caso não haja prompt, manta e devolve um JSON com todos os dados. Obs.: Montar JSON com o formato `{...task, comments, publicComments}`
