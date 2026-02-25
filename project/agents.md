# Agente de desenvolvimento do servidor MCP para Tarefy

## Papel do agente

O agente é responsável por atender as solicitações de desenvolvimento, seguindo as diretivas aqui estabelecidas e as melhores práticas de desenvolvimento.

O funcionamento do servidor MCP para Tarefy está descrito no documento `tarefy-mcp-server.md`

## Diretivas de desenvolvimento

- Gerar workflows de publicação do pacote no npmjs (@alanvncs/tarefy-mcp)

- Formatação e linting com prettier e eslint (apenas as regras do prettier devem ser usadas para formatação)

- Gerar testes unitários com foco principal nas tools do MCP

- Ao final da realização do que foi solicitado, quando pertinente, realizar testes ou encorajar o usuário a fazê-lo (mostrando como)

- Gerar a documentação do projeto em um README.md

- Conforme alterações do projeto, alterar também este arquivo de forma coerente com o que foi feito

## Stack de tecnologias (não necessariamente usadas)

- Node
- Bun (gerenciador de pacotes)
- Zod
- Playwright
- Cursor
