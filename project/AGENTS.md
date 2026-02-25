# Agente de desenvolvimento do servidor MCP para Tarefy

## Papel desta documentação (seed do projeto)

**AGENTS.md** e **MCP-SPEC.md** formam o **seed do projeto**: com base neles o projeto pode ser gerado do zero. A cada alteração no projeto, atualize estes dois arquivos de forma coerente.

O funcionamento do servidor MCP está descrito em **[MCP-SPEC.md](./MCP-SPEC.md)**.

---

## Papel do agente

O agente é responsável por atender as solicitações de desenvolvimento, seguindo as diretivas aqui estabelecidas e as melhores práticas de desenvolvimento.

---

## Diretivas de desenvolvimento

- Gerar workflows de publicação do pacote no npm (`@alanvncs/tarefy-mcp`). A publicação deve usar **Trusted Publishing** (OIDC), sem token de longa duração; ver [npm Trusted Publishers](https://docs.npmjs.com/trusted-publishers).
- Formatação e lint com **Prettier** e **ESLint** (apenas regras do Prettier para formatação).
- Gerar testes unitários com foco principal nas **tools** do MCP.
- Ao final do que foi solicitado, quando pertinente, rodar testes ou orientar o usuário a fazê-lo (mostrando como).
- Manter a documentação do projeto em um **README.md** na raiz do repositório. O README deve ser **autossuficiente**: o usuário não deve precisar acessar outros arquivos para instalar, usar as ferramentas ou entender a API (exceto quando realmente necessário).
- **A cada alteração no projeto**, atualizar **AGENTS.md** e **MCP-SPEC.md** de forma coerente.

---

## Estado do projeto (gerado conforme esta especificação)

- Servidor MCP com **stdio**, tools `login` (Playwright + cookie) e `get-task` (API Tarefy).
- Token salvo em `~/.tarefy-mcp/token.txt`.
- Workflows: **CI** (build, test) e **Publish to npm** (em **push de tags** `v*` ou workflow_dispatch) usando **Trusted Publishing** (OIDC); permissões `id-token: write` e `contents: read`; sem `NPM_TOKEN`.
- Testes unitários para `token-store`, API Tarefy e tool `get-task`.
- Prettier + ESLint (config Prettier); TypeScript com `tsconfig.json`.
- **README.md** na raiz **autossuficiente**: contém instalação do MCP, descrição das ferramentas, API do Tarefy (headers e endpoints) e comandos de desenvolvimento, sem exigir leitura de outros arquivos.
- Script **`inspector`**: testar o servidor com MCP Inspector (`bun run inspector` → build + `npx @modelcontextprotocol/inspector node build/index.js`).
- Script **`release`**: script TypeScript em `scripts/release.ts`, executado com Bun; faz bump da versão no `package.json` (patch/minor/major), commit com mensagem `vX.Y.Z`, cria tag `vX.Y.Z` e dá push (branch + tag). O push da tag dispara o workflow de publicação. Uso: `bun run release` ou `bun run release -- minor|major`. Não depende do GitHub CLI.

---

## Stack de tecnologias

- **Node**
- **Bun** (gerenciador de pacotes)
- **Zod**
- **Playwright**
- **Cursor**

_(Não é obrigatório usar todos; escolher conforme a necessidade.)_
