import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const root = join(__dirname, "..");
const pkgPath = join(root, "package.json");

function exec(cmd: string): string {
  return execSync(cmd, { cwd: root, encoding: "utf8" });
}

// Verifica working tree limpo
const status = exec("git status --porcelain");
if (status.trim() !== "") {
  console.error("Há alterações não commitadas. Faça commit ou stash antes de rodar o release.");
  process.exit(1);
}

// Verifica se o último commit é WIP
const lastSubject = exec("git log -1 --pretty=%s");
if (/wip/i.test(lastSubject)) {
  console.error(
    'O último commit está marcado como WIP ("' +
      lastSubject.trim() +
      '"). Remova o WIP ou faça um novo commit antes do release.'
  );
  process.exit(1);
}

type Bump = "patch" | "minor" | "major";

const bump = (process.argv[2] ?? "patch") as Bump;
if (!["patch", "minor", "major"].includes(bump)) {
  console.error("Uso: bun run scripts/release.ts [patch|minor|major]");
  process.exit(1);
}

interface PackageJson {
  version: string;
  [key: string]: unknown;
}

const pkg: PackageJson = JSON.parse(readFileSync(pkgPath, "utf8"));
const [major, minor, patch] = pkg.version.split(".").map(Number);

let nextVersion: string;
if (bump === "patch") {
  nextVersion = `${major}.${minor}.${patch + 1}`;
} else if (bump === "minor") {
  nextVersion = `${major}.${minor + 1}.0`;
} else {
  nextVersion = `${major + 1}.0.0`;
}

pkg.version = nextVersion;
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf8");

const tag = `v${nextVersion}`;
execSync("git add package.json", { cwd: root, stdio: "inherit" });
execSync(`git commit -m "${tag}"`, { cwd: root, stdio: "inherit" });
execSync(`git tag ${tag}`, { cwd: root, stdio: "inherit" });

console.log(
  `Release ${tag} criado (commit + tag). O comando release fará push do branch e das tags em seguida.`
);
