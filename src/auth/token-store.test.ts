import { describe, expect, it } from "bun:test";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

// Testa a mesma lógica de save/load do token-store (sem mockar node:os)
const TEST_BASE = join(tmpdir(), `tarefy-mcp-test-${Date.now()}`);
const DIR_NAME = ".tarefy-mcp";
const TOKEN_FILE = "token.txt";

async function saveTokenToDir(token: string, dir: string): Promise<void> {
  const fullDir = join(dir, DIR_NAME);
  await mkdir(fullDir, { recursive: true });
  await writeFile(join(fullDir, TOKEN_FILE), token.trim(), "utf8");
}

async function loadTokenFromDir(dir: string): Promise<string | null> {
  try {
    const path = join(dir, DIR_NAME, TOKEN_FILE);
    const content = await readFile(path, "utf8");
    const token = content.trim();
    return token.length > 0 ? token : null;
  } catch {
    return null;
  }
}

describe("token-store (lógica save/load)", () => {
  it("salva e carrega token", async () => {
    const dir = join(TEST_BASE, "1");
    await saveTokenToDir("meu-token-123", dir);
    expect(await loadTokenFromDir(dir)).toBe("meu-token-123");
  });

  it("faz trim no token ao salvar", async () => {
    const dir = join(TEST_BASE, "2");
    await saveTokenToDir("  token  ", dir);
    expect(await loadTokenFromDir(dir)).toBe("token");
  });

  it("retorna null quando arquivo não existe", async () => {
    const loaded = await loadTokenFromDir(join(TEST_BASE, "nao-existe"));
    expect(loaded).toBeNull();
  });

  it("retorna null quando conteúdo é só espaços", async () => {
    const dir = join(TEST_BASE, "3");
    await mkdir(join(dir, DIR_NAME), { recursive: true });
    await writeFile(join(dir, DIR_NAME, TOKEN_FILE), "   ", "utf8");
    expect(await loadTokenFromDir(dir)).toBeNull();
  });
});
