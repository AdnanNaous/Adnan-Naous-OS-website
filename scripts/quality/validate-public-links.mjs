import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const publicSource = await readFile(resolve(root, "src/data/public.ts"), "utf8");
const transpiled = ts.transpileModule(publicSource, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;
const moduleUrl = `data:text/javascript;base64,${Buffer.from(transpiled).toString("base64")}`;
const { publicData } = await import(moduleUrl);

const links = new Map();
const add = (id, url, category) => {
  if (!url?.startsWith("https://")) return;
  const existing = links.get(url);
  if (existing) {
    existing.ids.push(id);
    return;
  }
  links.set(url, { ids: [id], url, category });
};

for (const contact of publicData.profile.contacts) add(`contact:${contact.id}`, contact.href, "contact");
for (const profile of publicData.profile.socialProfiles) add(`social:${profile.id}`, profile.url, "social");
for (const project of publicData.projects) {
  add(`project-repository:${project.id}`, project.repositoryUrl, "project");
  add(`project-live:${project.id}`, project.liveUrl, "project");
  for (const link of project.caseStudy?.evidenceLinks ?? []) {
    add(`project-evidence:${project.id}:${link.kind}`, link.href, "project");
  }
}
for (const repository of publicData.github.repositories) {
  add(`github:${repository.id}`, repository.repositoryUrl, "github");
  add(`github-live:${repository.id}`, repository.liveDeploymentUrl, "github");
}
for (const bookmark of publicData.bookmarks) add(`bookmark:${bookmark.id}`, bookmark.canonicalUrl, "bookmark");

async function validate(entry) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12_000);
  try {
    let response = await fetch(entry.url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
      headers: { "user-agent": "Adnan-Naous-OS-Website-Link-Validator/1.0" },
    });
    if ([403, 405].includes(response.status)) {
      response = await fetch(entry.url, {
        method: "GET",
        redirect: "follow",
        signal: controller.signal,
        headers: {
          "user-agent": "Adnan-Naous-OS-Website-Link-Validator/1.0",
          range: "bytes=0-0",
        },
      });
    }
    return {
      ids: entry.ids,
      category: entry.category,
      status: response.status,
      ok: response.ok,
      redirected: response.redirected,
      finalOrigin: new URL(response.url).origin,
    };
  } catch (error) {
    return {
      ids: entry.ids,
      category: entry.category,
      status: null,
      ok: false,
      redirected: false,
      error: error instanceof Error ? error.name : "UnknownError",
    };
  } finally {
    clearTimeout(timer);
  }
}

const queue = [...links.values()];
const results = [];
const workerCount = 6;
let index = 0;

await Promise.all(Array.from({ length: workerCount }, async () => {
  while (index < queue.length) {
    const entry = queue[index++];
    results.push(await validate(entry));
  }
}));

results.sort((left, right) => left.ids[0].localeCompare(right.ids[0]));
const summary = {
  total: results.length,
  valid: results.filter((result) => result.ok).length,
  redirected: results.filter((result) => result.redirected).length,
  uncertain: results.filter((result) => !result.ok).length,
  results,
};

console.log(JSON.stringify(summary, null, 2));
if (summary.uncertain > 0) process.exitCode = 2;
