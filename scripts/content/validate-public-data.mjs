import { readdir, readFile } from "node:fs/promises";
import { dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const publicSourcePath = resolve(root, "src/data/public.ts");
const searchSourcePath = resolve(root, "src/data/search.ts");
const profileSourcePath = resolve(root, "src/data/profile.ts");
const educationSourcePath = resolve(root, "src/data/education.ts");

const [publicSource, searchSource, profileSource, educationSource] = await Promise.all([
  readFile(publicSourcePath, "utf8"),
  readFile(searchSourcePath, "utf8"),
  readFile(profileSourcePath, "utf8"),
  readFile(educationSourcePath, "utf8"),
]);

const transpiled = ts.transpileModule(publicSource, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;
const moduleUrl = `data:text/javascript;base64,${Buffer.from(transpiled).toString("base64")}`;
const { publicData } = await import(moduleUrl);
const serialized = JSON.stringify(publicData);

const errors = [];
const assert = (condition, message) => {
  if (!condition) errors.push(message);
};

const runtimeImports = [...publicSource.matchAll(/^import(?!\s+type\b).*$/gm)].map((match) => match[0]);
assert(runtimeImports.length === 0, "public.ts must not have runtime imports");

const searchRuntimeImports = [...searchSource.matchAll(/^import(?!\s+type\b).*?from\s+["']([^"']+)["'];?$/gm)]
  .map((match) => match[1]);
assert(searchRuntimeImports.length === 1 && searchRuntimeImports[0] === "./public", "search.ts must import runtime data only from ./public");

assert(/fullName:\s*\{[\s\S]*?value:\s*null[\s\S]*?verification:\s*"user-confirmed"[\s\S]*?visibility:\s*"private"/.test(profileSource), "full legal name must remain null and private");

assert(/grade:\s*\{[\s\S]*?value:\s*"3\.43 \/ 4\.00"[\s\S]*?verification:\s*"user-confirmed"[\s\S]*?visibility:\s*"hidden"[\s\S]*?conflictStatus:\s*"resolved"[\s\S]*?resumeEligible:\s*true/.test(educationSource), "confirmed GPA record is missing or incorrectly classified");
assert(!educationSource.includes("conflictingValues"), "resolved GPA still carries conflicting values");
assert(!serialized.includes("3.43 / 4.00"), "hidden GPA entered publicData");

for (const forbiddenKey of [
  "fullName",
  "nationality",
  "extendedSummary",
  "grade",
  "originalUrl",
  "originalUrlHash",
  "originalTitle",
  "originalFolder",
  "evidence",
  "reviewNote",
  "conflictingValues",
]) {
  assert(!serialized.includes(`"${forbiddenKey}"`), `forbidden key entered publicData: ${forbiddenKey}`);
}

assert(!/github_pat_|\bscl_[A-Za-z0-9_-]{8,}/.test(serialized), "credential-like value entered publicData");
assert(!/Oxford|Level 8/i.test(serialized), "unverified Oxford content entered publicData");
assert(
  publicData.profile.extendedBiography.en === "A Computer Science and Artificial Intelligence student building practical software projects after previously studying Human Medicine. Currently focused on software development, continuous learning, experimentation, and building maintainable personal tools.",
  "approved English biography is missing or changed",
);
assert(
  publicData.profile.extendedBiography.ar === "طالب في علوم الحاسوب والذكاء الاصطناعي، يبني مشاريع برمجية عملية بعد دراسة سابقة في الطب البشري. يركّز حاليًا على تطوير البرمجيات، والتعلم المستمر، والتجربة، وبناء أدوات شخصية قابلة للصيانة والتطوير.",
  "approved Arabic biography is missing or changed",
);
assert(!serialized.includes("Medical Data Processor"), "unsupported Medical Data Processor placeholder entered publicData");
assert(!serialized.includes("AI Integration Tools"), "unsupported AI Integration Tools placeholder entered publicData");
assert(publicData.resume.readyForPublicDownload === false, "resume must remain unavailable");
assert(publicData.resume.downloadPath === null, "resume download path must remain null");
assert(publicData.bookmarks.length === 19, "public bookmark projection must contain 19 validation-approved records");
assert(publicData.bookmarks.filter((bookmark) => bookmark.featured).length === 12, "public bookmark projection must contain 12 featured records");
assert(publicData.bookmarks.every((bookmark) => ["valid", "redirected", "requires-login"].includes(bookmark.validationStatus)), "public bookmark has an unacceptable validation status");
assert(publicData.bookmarks.every((bookmark) => {
  const url = new URL(bookmark.canonicalUrl);
  return url.protocol === "https:" && !url.search && !url.username && !url.password;
}), "public bookmark has an unsafe canonical URL");

const excludedDirectories = new Set([".git", ".next", "node_modules"]);
const textExtensions = new Set([".js", ".json", ".md", ".mjs", ".ts", ".tsx", ".txt", ".yaml", ".yml"]);
const extendedLegalNamePattern = /\bAdnan(?:\s+[A-Za-z][A-Za-z'-]*){1,3}\s+Naous\b/i;

const findExtendedLegalNames = async (directory) => {
  const matches = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (excludedDirectories.has(entry.name)) continue;
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      matches.push(...await findExtendedLegalNames(path));
    } else if (textExtensions.has(extname(entry.name).toLowerCase())) {
      const content = await readFile(path, "utf8");
      if (extendedLegalNamePattern.test(content)) matches.push(path);
    }
  }
  return matches;
};

const findRawBookmarkExports = async (directory) => {
  const matches = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (excludedDirectories.has(entry.name)) continue;
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      matches.push(...await findRawBookmarkExports(path));
    } else if (/bookmarks.*\.html$/i.test(entry.name)) {
      matches.push(path);
    }
  }
  return matches;
};

assert((await findExtendedLegalNames(root)).length === 0, "a private extended legal name exists inside the repository");
assert((await findRawBookmarkExports(root)).length === 0, "raw bookmark export exists inside the repository");

if (errors.length > 0) {
  for (const error of errors) console.error(`FAIL: ${error}`);
  process.exitCode = 1;
} else {
  console.log(JSON.stringify({
    status: "passed",
    publicBookmarks: publicData.bookmarks.length,
    featuredBookmarks: publicData.bookmarks.filter((bookmark) => bookmark.featured).length,
    resumeReady: publicData.resume.readyForPublicDownload,
    runtimeImportsInPublicData: runtimeImports.length,
    rawBookmarkExportsInRepository: 0,
  }));
}
