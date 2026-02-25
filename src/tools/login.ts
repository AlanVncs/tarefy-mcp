import { chromium } from "playwright";
import { saveToken } from "../auth/token-store.js";

const LOGIN_URL = "https://app.tarefy.com/login";
const COOKIE_NAME = "tarefy";

export interface LoginInput {
  email?: string;
}

/**
 * Abre o Chrome (Playwright), acessa a página de login do Tarefy,
 * opcionalmente preenche o email, aguarda o usuário fazer login,
 * extrai o cookie `tarefy` (token) e salva em ~/.tarefy-mcp/token.txt.
 */
export async function runLogin(input: LoginInput): Promise<string> {
  const browser = await chromium.launch({
    headless: false,
    channel: "chrome",
  });

  try {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(LOGIN_URL, { waitUntil: "networkidle" });

    if (input.email?.trim()) {
      const emailSelector =
        'input[type="email"], input[name="email"], input[id="email"]';
      const el = await page.locator(emailSelector).first();
      if ((await el.count()) > 0) {
        await el.fill(input.email.trim());
      }
    }

    // Aguardar navegação após login (redirecionamento para app)
    await page.waitForURL(/tarefy\.com\/(?!login)/, { timeout: 300_000 });

    const cookies = await context.cookies();
    const tarefyCookie = cookies.find((c) => c.name === COOKIE_NAME);
    if (!tarefyCookie?.value) {
      throw new Error("Cookie 'tarefy' não encontrado após o login.");
    }

    await saveToken(tarefyCookie.value);
    return tarefyCookie.value;
  } finally {
    await browser.close();
  }
}
