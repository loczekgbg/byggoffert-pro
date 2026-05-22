import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const ignoredDirectories = new Set([
  ".git",
  ".npm-cache",
  "dist",
  "node_modules",
]);
const textFilePattern = /\.(css|html|js|jsx|json|md|mjs|svg|webmanifest)$/i;
const mojibakePattern = /[\uFFFD\u0102\u0139\u02C7]|[\u00C3\u00C2][\u0080-\u02FF]|\u00C4[\u201A\u201E\u2020\u2021\u2026\u2122]|\u00C5[\u00BA\u00BC\u015F\u201A\u201E\u203A]|\u00E2[\u0080-\u20FF]/u;
const brokenTextPattern = /\?tg|\bm\?|\bfr\?n|m\u00C2|Spik\u00C5tg\u00E5ng|Golv\u00C5tg\u00E5ng|Gips\u00C5tg\u00E5ng|Panel\u00C5tg\u00E5ng|Betong\u00C5tg\u00E5ng/u;

const requiredTranslations = {
  pl: {
    "\u00C5tg\u00E5ng": "Zu\u017Cycie",
    "Skruv & Spik\u00E5tg\u00E5ng": "Zu\u017Cycie \u015Brub i gwo\u017Adzi",
    "Klickgolv / Golv\u00E5tg\u00E5ng": "Zu\u017Cycie pod\u0142ogi / paneli",
    "Gips\u00E5tg\u00E5ng": "Zu\u017Cycie p\u0142yt gipsowych",
    "OSB / Plywood \u00E5tg\u00E5ng": "Zu\u017Cycie OSB / sklejki",
    "Panel\u00E5tg\u00E5ng": "Zu\u017Cycie paneli",
    "Betong\u00E5tg\u00E5ng": "Zu\u017Cycie betonu",
  },
  sv: {
    "\u00C5tg\u00E5ng": "\u00C5tg\u00E5ng",
    "Skruv & Spik\u00E5tg\u00E5ng": "Skruv & Spik\u00E5tg\u00E5ng",
    "Klickgolv / Golv\u00E5tg\u00E5ng": "Klickgolv / Golv\u00E5tg\u00E5ng",
    "Gips\u00E5tg\u00E5ng": "Gips\u00E5tg\u00E5ng",
    "OSB / Plywood \u00E5tg\u00E5ng": "OSB / Plywood \u00E5tg\u00E5ng",
    "Panel\u00E5tg\u00E5ng": "Panel\u00E5tg\u00E5ng",
    "Betong\u00E5tg\u00E5ng": "Betong\u00E5tg\u00E5ng",
  },
  en: {
    "\u00C5tg\u00E5ng": "Consumption",
    "Skruv & Spik\u00E5tg\u00E5ng": "Screw and nail consumption",
    "Klickgolv / Golv\u00E5tg\u00E5ng": "Flooring / laminate consumption",
    "Gips\u00E5tg\u00E5ng": "Drywall board consumption",
    "OSB / Plywood \u00E5tg\u00E5ng": "OSB / plywood consumption",
    "Panel\u00E5tg\u00E5ng": "Panel consumption",
    "Betong\u00E5tg\u00E5ng": "Concrete consumption",
  },
};

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      return ignoredDirectories.has(entry.name) ? [] : walk(fullPath);
    }

    return textFilePattern.test(entry.name) ? [fullPath] : [];
  });
}

function relative(filePath) {
  return path.relative(projectRoot, filePath).replaceAll(path.sep, "/");
}

const issues = [];

for (const filePath of walk(projectRoot)) {
  const buffer = fs.readFileSync(filePath);
  const fileName = relative(filePath);

  if (buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf) {
    issues.push(`${fileName}: UTF-8 BOM is not allowed`);
  }

  const text = buffer.toString("utf8");

  if (text.includes("\r")) {
    issues.push(`${fileName}: CRLF/CR line endings are not allowed`);
  }

  if (fileName !== "scripts/validate-encoding.mjs") {
    text.split("\n").forEach((line, index) => {
      if (mojibakePattern.test(line) || brokenTextPattern.test(line)) {
        issues.push(`${fileName}:${index + 1}: suspicious encoding text: ${line.trim()}`);
      }
    });
  }

  if (fileName.endsWith(".json") || fileName.endsWith(".webmanifest")) {
    try {
      JSON.parse(text);
    } catch (error) {
      issues.push(`${fileName}: invalid JSON (${error.message})`);
    }
  }
}

for (const [language, expectedEntries] of Object.entries(requiredTranslations)) {
  const localePath = path.join(projectRoot, "src", "translations", `${language}.json`);
  const locale = JSON.parse(fs.readFileSync(localePath, "utf8"));

  for (const [key, expectedValue] of Object.entries(expectedEntries)) {
    if (locale[key] !== expectedValue) {
      issues.push(`src/translations/${language}.json: expected ${JSON.stringify(key)} -> ${JSON.stringify(expectedValue)}, got ${JSON.stringify(locale[key])}`);
    }
  }
}

if (issues.length > 0) {
  console.error("Encoding/localization validation failed:");
  issues.forEach((issue) => console.error(`- ${issue}`));
  process.exit(1);
}

console.log("Encoding/localization validation passed.");
