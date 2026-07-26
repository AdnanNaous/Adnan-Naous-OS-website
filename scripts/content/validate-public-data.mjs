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
assert(!/\bGPA\b/i.test(serialized), "GPA wording entered publicData");
assert(!/Jeddah/i.test(serialized), "a city-level location entered publicData");

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
  "stars",
  "forks",
  "downloads",
  "userCount",
  "revenue",
  "performanceImprovement",
  "completionPercentage",
]) {
  assert(!serialized.includes(`"${forbiddenKey}"`), `forbidden key entered publicData: ${forbiddenKey}`);
}

assert(!/github_pat_|\bscl_[A-Za-z0-9_-]{8,}/.test(serialized), "credential-like value entered publicData");
assert(!/[A-Za-z]:\\|file:\/\/|\\Users\\/i.test(serialized), "local filesystem path entered publicData");
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
assert(!/Client Feedback|Senior Engineer|Workshop Instructor|Project Manager/.test(serialized), "unsupported testimonial content entered publicData");
assert(publicData.navigation.primary.length === 5, "primary production navigation must contain five approved destinations");
assert(publicData.navigation.secondary.length === 3, "secondary production navigation must contain three approved destinations");
assert(publicData.projects.filter((project) => project.placement === "main-projects").length === 3, "portfolio must contain exactly three approved main projects");
assert(
  JSON.stringify(publicData.projects
    .filter((project) => project.placement === "main-projects")
    .map((project) => project.id)) === JSON.stringify([
    "personal-os-portfolio",
    "adnan-naous-journey",
    "ultimate-windows-maintenance",
  ]),
  "main-project sequence does not match the approved three-project portfolio",
);
assert(publicData.projects.filter((project) => project.placement === "main-projects").every((project) => project.caseStudy), "every main project requires a public case study");
assert(publicData.projects.filter((project) => project.placement === "main-projects").every((project) => project.assets.length > 0), "every main project requires an approved public visual asset");
assert(publicData.projects.filter((project) => project.placement === "main-projects").every((project) => project.description.en.length > 40 && project.description.ar.length > 30), "every main project requires a substantive bilingual description");
assert(publicData.languages.every((language) => language.level.en && language.level.ar), "language proficiency labels must be bilingual");
assert(publicData.capabilities.length === 3, "capabilities projection must contain three evidence-backed areas");
assert(publicData.writing.status.en.includes("No public articles"), "writing status must remain truthful");
assert(publicData.writing.articles.length === 0, "writing must not contain placeholder or unpublished articles");
assert(publicData.recognition.statement.en.includes("No public endorsements"), "recognition status must remain truthful");
assert(publicData.contact.responseNote.en.includes("does not submit or store messages"), "contact boundary must disclose the absence of a backend");
assert(publicData.personalOS.tools.length === 4, "Personal OS must document all four active tool areas");
assert(publicData.personalOS.tools.every((tool) => tool.status === "functional"), "Personal OS tools must have explicit current status");
const approvedPortrait = publicData.profile.profileImages.find((image) => image.id === "approved-portrait");
assert(approvedPortrait?.publicPath === "/images/profile/adnan-naous-portrait.webp", "approved portrait path is missing or changed");
assert(approvedPortrait?.kind === "portrait", "approved portrait is not classified as a portrait");
assert(approvedPortrait?.width === 1600 && approvedPortrait?.height === 1600, "approved portrait dimensions are missing or changed");
assert(approvedPortrait?.format === "webp", "approved portrait format is missing or changed");
assert(approvedPortrait?.approvalStatus === "user-approved", "approved portrait status is missing or changed");
const transparentCutout = approvedPortrait?.presentationVariants?.transparentCutout;
assert(
  transparentCutout?.publicPath === "/images/profile/adnan-naous-portrait-cutout.webp",
  "approved portrait cutout path is missing or changed",
);
assert(
  transparentCutout?.derivedFrom === "approved-portrait",
  "portrait presentation derivative must reference the approved identity image",
);
assert(
  transparentCutout?.width === 1600 && transparentCutout?.height === 1600,
  "portrait presentation derivative dimensions are missing or changed",
);
assert(
  transparentCutout?.format === "webp",
  "portrait presentation derivative format is missing or changed",
);
assert(
  transparentCutout?.processing.includes("metadata-removal") &&
    transparentCutout.processing.includes("edge-refinement"),
  "portrait presentation derivative processing record is incomplete",
);
assert(publicData.resume.readyForPublicDownload === false, "resume must remain unavailable");
assert(publicData.resume.downloadPath === null, "resume download path must remain null");

const expectedDock = [
  ["repository", "adnan-naous-journey", "journey"],
  ["repository", "personal-os-portfolio", "os-website"],
  ["repository", "ultimate-windows-maintenance", "windows-tools"],
  ["credential", "kanz-ai-hackathon-2026", "certificate"],
];
assert(
  JSON.stringify(publicData.homepage.dock.map(({ kind, recordId, icon }) => [kind, recordId, icon])) === JSON.stringify(expectedDock),
  "homepage dock records or order do not match the approved four-item sequence",
);

const approvedRepositories = [
  {
    id: "adnan-naous-journey",
    displayName: "Adnan Naous Journey",
    shortLabel: "Journey",
    repositoryName: "Adnan-Naous-Journey",
    repositoryUrl: "https://github.com/AdnanNaous/Adnan-Naous-Journey",
    summary: "Learning journey",
  },
  {
    id: "personal-os-portfolio",
    displayName: "Adnan Naous OS Website",
    shortLabel: "OS Website",
    repositoryName: "Adnan-Naous-OS-website",
    repositoryUrl: "https://github.com/AdnanNaous/Adnan-Naous-OS-website",
    summary: "Personal knowledge system",
  },
  {
    id: "ultimate-windows-maintenance",
    displayName: "Ultimate Windows Maintenance",
    shortLabel: "Windows Tools",
    repositoryName: "Ultimate-Windows-Maintenance",
    repositoryUrl: "https://github.com/AdnanNaous/Ultimate-Windows-Maintenance",
    summary: "Maintenance toolkit",
  },
];

for (const expected of approvedRepositories) {
  const repository = publicData.github.repositories.find((item) => item.id === expected.id);
  assert(repository, `approved repository is missing: ${expected.id}`);
  if (!repository) continue;
  assert(repository.owner === "AdnanNaous", `repository owner is incorrect: ${expected.id}`);
  assert(repository.displayName === expected.displayName, `repository display name is incorrect: ${expected.id}`);
  assert(repository.shortLabel === expected.shortLabel, `repository short label is incorrect: ${expected.id}`);
  assert(repository.repositoryName === expected.repositoryName, `repository name is incorrect: ${expected.id}`);
  assert(repository.repositoryUrl === expected.repositoryUrl, `repository URL is incorrect: ${expected.id}`);
  assert(repository.summary.en === expected.summary, `repository summary is incorrect: ${expected.id}`);
  assert(repository.visibility === "public", `repository is not public: ${expected.id}`);
  const url = new URL(repository.repositoryUrl);
  assert(url.protocol === "https:" && url.hostname === "github.com", `repository URL is not a safe GitHub HTTPS URL: ${expected.id}`);
}

const credential = publicData.credentials.find((item) => item.id === "kanz-ai-hackathon-2026");
assert(credential?.title === "Kanz AI Hackathon", "Kanz credential title is missing or changed");
assert(credential?.shortLabel === "Certificate", "Kanz credential short label is missing or changed");
assert(credential?.summary.en === "AI Training Hackathon · 2026", "Kanz credential summary is missing or changed");
assert(credential?.credentialType === "Certificate of Workshop Completion", "Kanz credential type is missing or changed");
assert(credential?.program === "AI Training Hackathon", "Kanz credential program is missing or changed");
assert(credential?.completionDate === "2026-07-15", "Kanz credential completion date is missing or changed");
assert(credential?.featuredProject === "Adnan OS: A Command Center for the Modern CS Student", "Kanz featured project is missing or changed");
assert(credential?.credentialId === "KANZ-ADV-0594", "Kanz credential ID is missing or changed");
assert(credential?.issuer === "Kanz AI", "Kanz credential issuer is missing or changed");
assert(credential?.documentPath === "/documents/certificates/kanz-ai-hackathon-2026.pdf", "Kanz credential document path is missing or changed");
assert(credential?.preview?.publicPath === "/images/projects/kanz-ai-certificate.webp", "Kanz credential preview path is missing or changed");
assert(credential?.preview?.width === 1871 && credential?.preview?.height === 1323, "Kanz credential preview dimensions are invalid");
assert(credential?.preview?.format === "webp", "Kanz credential preview format is invalid");
assert(credential?.preview?.approvalStatus === "rendered-approved-public-document", "Kanz credential preview approval is missing");
assert(credential?.visibility === "public", "Kanz credential is not public");
assert(credential?.verificationStatus === "user-confirmed", "Kanz credential is not user-confirmed");

let credentialDocumentExists = false;
try {
  const credentialDocument = await readFile(resolve(root, "public/documents/certificates/kanz-ai-hackathon-2026.pdf"));
  credentialDocumentExists = credentialDocument.length > 0;
} catch {
  credentialDocumentExists = false;
}
assert(credentialDocumentExists, "approved Kanz credential PDF is missing or empty");

try {
  const credentialPreview = await readFile(resolve(root, `public${credential.preview.publicPath}`));
  assert(credentialPreview.length > 0, "approved Kanz credential preview is empty");
} catch {
  assert(false, "approved Kanz credential preview is missing");
}

for (const project of publicData.projects.filter((item) => item.placement === "main-projects")) {
  for (const asset of project.assets) {
    assert(asset.projectId === project.id, `project asset ownership mismatch: ${asset.id}`);
    assert(asset.publicPath.startsWith("/images/projects/"), `project asset is outside the approved public project directory: ${asset.id}`);
    assert(asset.width > 0 && asset.height > 0, `project asset dimensions are invalid: ${asset.id}`);
    assert(["svg", "webp"].includes(asset.format), `project asset format is not approved: ${asset.id}`);
    assert(asset.publicPath.endsWith(`.${asset.format}`), `project asset extension does not match its format: ${asset.id}`);
    assert(["locally-authored-public", "current-public-capture"].includes(asset.approvalStatus), `project asset approval is missing: ${asset.id}`);
    try {
      const file = await readFile(resolve(root, `public${asset.publicPath}`));
      assert(file.length > 0, `project asset is empty: ${asset.id}`);
    } catch {
      assert(false, `project asset is missing: ${asset.id}`);
    }
  }
}

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
