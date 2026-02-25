import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { homedir } from "node:os";

const DIR_NAME = ".tarefy-mcp";
const TOKEN_FILE = "token.txt";

function getTokenDir(): string {
  return join(homedir(), DIR_NAME);
}

function getTokenPath(): string {
  return join(getTokenDir(), TOKEN_FILE);
}

/**
 * Salva o token de autenticação do Tarefy na pasta do usuário (~/.tarefy-mcp/token.txt).
 */
export async function saveToken(token: string): Promise<void> {
  const dir = getTokenDir();
  await mkdir(dir, { recursive: true });
  await writeFile(getTokenPath(), token.trim(), "utf8");
}

/**
 * Lê o token salvo. Retorna null se não existir ou estiver vazio.
 */
export async function loadToken(): Promise<string | null> {
  try {
    const content = await readFile(getTokenPath(), "utf8");
    const token = content.trim();
    return token.length > 0 ? token : null;
  } catch {
    return null;
  }
}
