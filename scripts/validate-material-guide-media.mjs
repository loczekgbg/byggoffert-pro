import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { materialGroups, materialGuide } from "../src/data/materialGuide.js";

const publicDir = join(process.cwd(), "public");
const failures = [];
const missing = "missingData";
const minimumMaterialCount = 59;
const minimumStoreScanCount = 26;
const storeScanSourceImage = "/material-guide/store/prolist-source.jpeg";
const allowedSubcategories = {
  invandigt: new Set(["Foder", "Golvlist", "Taklist", "Fönstersmyg", "Smyglist", "Skugglist", "Sockel", "Hörnlist", "Dekorlist", "Panel", "Skivmaterial"]),
  utvandigt: new Set(["Panel", "Lockläkt", "Fasadpanel", "Trall", "Regel", "Läkt", "Virke", "Foder utvändigt", "Hörnlist utvändigt"]),
};

function publicPathExists(path) {
  return existsSync(join(publicDir, path.replace(/^\//, "")));
}

function pngSize(path) {
  const buffer = readFileSync(join(publicDir, path.replace(/^\//, "")));
  if (buffer.toString("ascii", 1, 4) !== "PNG") return null;
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

function isPhoneScreenshotSize(size) {
  if (!size) return false;
  return size.height / size.width > 1.95;
}

function hasMeasures(material) {
  return [
    material.dimensions,
    material.lengths,
    material.coveringWidth,
    material.coverage,
    material.thicknesses,
    material.sheetSizes,
    material.packages,
  ].some((value) => Array.isArray(value) && value.length > 0);
}

function hasName(material, language) {
  return Boolean(material.name?.[language] && material.name[language] !== missing && material.name[language] !== "Ej angivet");
}

const groupIds = new Set(materialGroups.map((group) => group.id));
if (materialGroups.length !== 2 || !groupIds.has("invandigt") || !groupIds.has("utvandigt")) {
  failures.push("Material Guide must use only Invändigt and Utvändigt as top-level groups");
}

const seenIds = new Set();
const seenSignatures = new Map();
let storeScanCount = 0;

if (materialGuide.length < minimumMaterialCount) {
  failures.push(`Material count dropped to ${materialGuide.length}; expected at least ${minimumMaterialCount}`);
}

for (const material of materialGuide) {
  const { combinedImage, drawing2d, id, render3d } = material;
  const subcategory = material.subcategory || material.section;
  const isStoreScan = material.source === "storeScan";
  if (isStoreScan) storeScanCount += 1;

  if (seenIds.has(id)) failures.push(`${id}: duplicate material id`);
  seenIds.add(id);

  if (!groupIds.has(material.group)) {
    failures.push(`${id}: invalid top-level group (${material.group})`);
  }

  if (!allowedSubcategories[material.group]?.has(subcategory)) {
    failures.push(`${id}: invalid subcategory (${subcategory || "missing"}) for ${material.group}`);
  }

  if (!hasName(material, "sv")) failures.push(`${id}: Swedish name is missing`);
  if (!hasName(material, "pl")) failures.push(`${id}: Polish name is missing`);
  if (!material.profile || material.profile === missing) failures.push(`${id}: profile is missing`);
  if (!hasMeasures(material) && !isStoreScan) failures.push(`${id}: dimensions or measures are missing`);
  if (!combinedImage && !drawing2d) failures.push(`${id}: visible Material Guide products need a combined image or drawing2d asset`);
  if (isStoreScan && combinedImage !== storeScanSourceImage) {
    failures.push(`${id}: store scan crop is not safe; use the full store source image instead`);
  }
  if (drawing2d && render3d && drawing2d === render3d) {
    failures.push(`${id}: drawing2d and render3d are identical; use combinedImage instead`);
  }

  const signature = [
    material.group,
    subcategory,
    material.profile,
    isStoreScan ? id : JSON.stringify(material.dimensions || []),
    JSON.stringify(material.coverage || []),
    JSON.stringify(material.thicknesses || []),
    JSON.stringify(material.sheetSizes || []),
  ].join("|");
  const duplicateOf = seenSignatures.get(signature);
  if (duplicateOf) {
    failures.push(`${id}: duplicate material data matches ${duplicateOf}`);
  } else {
    seenSignatures.set(signature, id);
  }

  if (combinedImage?.startsWith("/lathunden/") || drawing2d?.startsWith("/lathunden/") || render3d?.startsWith("/lathunden/")) {
    failures.push(`${id}: visible media cannot use full Lathunden screenshots`);
  }

  if (combinedImage && !publicPathExists(combinedImage)) {
    failures.push(`${id}: combinedImage asset is missing (${combinedImage})`);
  } else if (combinedImage && !isStoreScan && isPhoneScreenshotSize(pngSize(combinedImage))) {
    failures.push(`${id}: combinedImage still looks like a full phone screenshot`);
  }

  if (drawing2d && !publicPathExists(drawing2d)) {
    failures.push(`${id}: drawing2d asset is missing (${drawing2d})`);
  } else if (drawing2d && isPhoneScreenshotSize(pngSize(drawing2d))) {
    failures.push(`${id}: drawing2d still looks like a full phone screenshot`);
  }

  if (render3d && !publicPathExists(render3d)) {
    failures.push(`${id}: render3d asset is missing (${render3d})`);
  } else if (render3d && isPhoneScreenshotSize(pngSize(render3d))) {
    failures.push(`${id}: render3d still looks like a full phone screenshot`);
  }
}

if (storeScanCount < minimumStoreScanCount) {
  failures.push(`Store scan material count dropped to ${storeScanCount}; expected at least ${minimumStoreScanCount}`);
}

if (failures.length > 0) {
  console.error("Material Guide media validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Material Guide media validation passed.");
