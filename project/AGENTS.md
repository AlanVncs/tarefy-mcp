# Agente de desenvolvimento do servidor MCP para Tarefy

## Papel do agente

O agente é responsável por atender as solicitações de desenvolvimento, seguindo as diretivas aqui estabelecidas e as melhores práticas de desenvolvimento.

O funcionamento do servidor MCP está descrito em **[MCP-SPEC.md](./MCP-SPEC.md)**.

## Diretivas de desenvolvimento

- Gerar workflows de publicação do pacote no npm (`@alanvncs/tarefy-mcp`).
- Formatação e lint com **Prettier** e **ESLint** (apenas regras do Prettier para formatação).
- Gerar testes unitários com foco principal nas **tools** do MCP.
- Ao final do que foi solicitado, quando pertinente, rodar testes ou orientar o usuário a fazê-lo (mostrando como).
- Manter a documentação do projeto em um **README.md** na raiz do repositório.
- Conforme alterações no projeto, atualizar também este arquivo de forma coerente com o que foi feito.

## Stack de tecnologias

- **Node**
- **Bun** (gerenciador de pacotes)
- **Zod**
- **Playwright**
- **Cursor**

*(Não é obrigatório usar todos; escolher conforme a necessidade.)*
