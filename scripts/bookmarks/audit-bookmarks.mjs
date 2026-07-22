import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const classificationNames = {
  featured: "Featured Public",
  library: "Public Library",
  personal: "Personal Only",
  university: "University Private",
  account: "Account-Specific",
  duplicate: "Duplicate",
  broken: "Broken or Unreachable",
  archive: "Archive Candidate",
  confirmation: "Requires Confirmation",
};

const decodeHtml = (value) => value
  .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
  .replace(/&#([0-9]+);/g, (_, code) => String.fromCodePoint(Number.parseInt(code, 10)))
  .replaceAll("&amp;", "&")
  .replaceAll("&quot;", "\"")
  .replaceAll("&#39;", "'")
  .replaceAll("&lt;", "<")
  .replaceAll("&gt;", ">");

const stripTags = (value) => decodeHtml(value.replace(/<[^>]*>/g, "").trim());
const hash = (value) => createHash("sha256").update(value).digest("hex");

export function parseChromeBookmarks(html) {
  const stack = [];
  const folders = [];
  const entries = [];
  let pendingFolder = null;

  for (const line of html.split(/\r?\n/)) {
    const folderMatch = line.match(/<H3\b[^>]*>([\s\S]*?)<\/H3>/i);
    if (folderMatch) {
      pendingFolder = stripTags(folderMatch[1]);
      continue;
    }

    if (/<DL><p>/i.test(line)) {
      if (pendingFolder) {
        stack.push(pendingFolder);
        folders.push(stack.join(" / "));
        pendingFolder = null;
      }
      continue;
    }

    if (/<\/DL><p>/i.test(line)) {
      stack.pop();
      continue;
    }

    const bookmarkMatch = line.match(/<A\b[^>]*HREF="([^"]*)"[^>]*>([\s\S]*?)<\/A>/i);
    if (!bookmarkMatch) continue;

    entries.push({
      folderPath: stack.join(" / "),
      title: stripTags(bookmarkMatch[2]),
      originalUrl: decodeHtml(bookmarkMatch[1]),
    });
  }

  return { entries, folders };
}

const featuredNames = new Set([
  "GitHub",
  "Hugging Face",
  "Docker",
  "OpenRouter",
  "Supabase",
  "Firebase",
  "vercel",
  "JetBrains",
  "Codewars",
  "Exercism",
  "LeetCode",
  "MDN Docs",
  "GitHub Docs",
  "Free for Dev",
  "Next.js",
  "openEuler",
  "Cloudflare",
]);

const publicLibraryNames = new Set([
  "Google AI Studio",
  "Docker Docs",
  "DevDocs API",
  "Python Doc",
  "React Docs",
  "Git Docs",
  "MOOC.fi",
  "FCC",
  "Excalidraw",
  "Draw.io",
  "Figma",
  "Photopea",
  "Canva",
  "Krita",
  "Monkeytype",
]);

const confirmationNames = new Set([
  "Gemini",
  "ChatGPT",
  "Claude",
  "Kimi",
  "Z.ai",
  "Qwen",
  "Manus",
  "DeepSeek",
  "Perplexity",
  "Copilot",
  "Papers with Code",
  "SteamDB",
  "X",
  "Reddit",
  "Tumblr",
  "Pinterest",
  "YouTube",
  "Spotify",
  "Twitch",
]);

const accountDomains = new Set([
  "web.whatsapp.com",
  "web.telegram.org",
  "discord.com",
  "app.slack.com",
  "app.raindrop.io",
]);

const classify = (entry, normalizedUrlCounts) => {
  let url;
  try {
    url = new URL(entry.originalUrl);
  } catch {
    return classificationNames.broken;
  }

  const normalized = `${url.protocol}//${url.host}${url.pathname.replace(/\/$/, "")}`;
  if ((normalizedUrlCounts.get(normalized) ?? 0) > 1) return classificationNames.duplicate;
  if (entry.folderPath.includes("COLLEGE")) return classificationNames.university;
  if (accountDomains.has(url.hostname.toLowerCase())) return classificationNames.account;
  if (entry.title === "Notion") return classificationNames.personal;
  if (entry.folderPath.includes("DOWNLOADERS")) return classificationNames.archive;
  if (["CINEMA.BZ", "Miruro"].includes(entry.title)) return classificationNames.archive;
  if (featuredNames.has(entry.title)) return classificationNames.featured;
  if (publicLibraryNames.has(entry.title)) return classificationNames.library;
  if (confirmationNames.has(entry.title)) return classificationNames.confirmation;
  return classificationNames.confirmation;
};

const isLikelyLoginSpecific = (entry, classification) => {
  if ([classificationNames.university, classificationNames.account, classificationNames.personal].includes(classification)) return true;
  try {
    const url = new URL(entry.originalUrl);
    return url.pathname.includes("dashboard")
      || url.pathname.includes("/files/team/")
      || url.hostname.startsWith("app.")
      || url.hostname.startsWith("web.");
  } catch {
    return false;
  }
};

export function createSanitizedAudit(html, sourceName) {
  const { entries, folders } = parseChromeBookmarks(html);
  const normalizedUrlCounts = new Map();
  const domainCounts = new Map();

  for (const entry of entries) {
    try {
      const url = new URL(entry.originalUrl);
      const normalized = `${url.protocol}//${url.host}${url.pathname.replace(/\/$/, "")}`;
      normalizedUrlCounts.set(normalized, (normalizedUrlCounts.get(normalized) ?? 0) + 1);
      const domain = url.hostname.toLowerCase().replace(/^www\./, "");
      domainCounts.set(domain, (domainCounts.get(domain) ?? 0) + 1);
    } catch {
      // Invalid URLs are classified later without exposing their contents.
    }
  }

  const ledger = entries.map((entry) => {
    const classification = classify(entry, normalizedUrlCounts);
    return {
      sourceId: hash(entry.originalUrl).slice(0, 16),
      classification,
      hasQueryParameters: (() => {
        try { return Boolean(new URL(entry.originalUrl).search); } catch { return false; }
      })(),
      hasFragment: (() => {
        try { return Boolean(new URL(entry.originalUrl).hash); } catch { return false; }
      })(),
      likelyLoginSpecific: isLikelyLoginSpecific(entry, classification),
    };
  });

  const classificationCounts = Object.values(classificationNames).reduce((result, name) => {
    result[name] = ledger.filter((entry) => entry.classification === name).length;
    return result;
  }, {});

  const folderEntryCounts = new Map();
  for (const entry of entries) {
    folderEntryCounts.set(entry.folderPath, (folderEntryCounts.get(entry.folderPath) ?? 0) + 1);
  }
  const usedFolders = new Set(folderEntryCounts.keys());
  const duplicateDomains = [...domainCounts.entries()]
    .filter(([, count]) => count > 1)
    .map(([domain, count]) => ({ domain, count }))
    .sort((a, b) => b.count - a.count || a.domain.localeCompare(b.domain));

  return {
    schemaVersion: 1,
    source: {
      fileName: basename(sourceName),
      sha256: hash(html),
    },
    summary: {
      bookmarkCount: entries.length,
      folderCount: folders.length,
      leafFolderCount: usedFolders.size,
      emptyFolderCount: folders.filter((folder) => !usedFolders.has(folder)).length,
      exactDuplicateUrlCount: entries.length - new Set(entries.map((entry) => entry.originalUrl)).size,
      normalizedDuplicateUrlCount: [...normalizedUrlCounts.values()].filter((count) => count > 1).reduce((sum, count) => sum + count - 1, 0),
      duplicateDomainCount: duplicateDomains.length,
      queryParameterCount: ledger.filter((entry) => entry.hasQueryParameters).length,
      fragmentCount: ledger.filter((entry) => entry.hasFragment).length,
      likelyLoginSpecificCount: ledger.filter((entry) => entry.likelyLoginSpecific).length,
      classificationCounts,
    },
    folderLedger: folders.map((folder) => ({
      sourceId: hash(folder).slice(0, 16),
      bookmarkCount: folderEntryCounts.get(folder) ?? 0,
    })),
    duplicateDomainLedger: duplicateDomains.map(({ domain, count }) => ({
      sourceId: hash(domain).slice(0, 16),
      bookmarkCount: count,
    })),
    entryLedger: ledger,
    privacyNote: "The audit intentionally excludes bookmark titles, URLs, URL parameters, domains, and folder paths. Reconcile sourceId values only against the external source export.",
  };
}

const getArgument = (name) => {
  const index = process.argv.indexOf(name);
  return index === -1 ? null : process.argv[index + 1] ?? null;
};

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const source = getArgument("--source");
  const output = getArgument("--output");
  if (!source) {
    console.error("Usage: node scripts/bookmarks/audit-bookmarks.mjs --source <bookmarks.html> [--output <audit.json>]");
    process.exitCode = 1;
  } else {
    const html = await readFile(resolve(source), "utf8");
    const audit = createSanitizedAudit(html, source);
    const serialized = `${JSON.stringify(audit, null, 2)}\n`;
    if (output) {
      const outputPath = resolve(output);
      await mkdir(dirname(outputPath), { recursive: true });
      await writeFile(outputPath, serialized, "utf8");
      console.log(`Wrote sanitized bookmark audit: ${outputPath}`);
    } else {
      console.log(serialized);
    }
  }
}
