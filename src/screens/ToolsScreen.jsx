import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Box, Calculator, ChevronRight, FileDown, Ruler, ShoppingCart, Trash2 } from "lucide-react";
import marcinByggLogo from "../assets/marcin-bygg-logo.png";
import { defaultWasteFor, fastenerService, packageCalculatorService, replacementService, usageCalculatorService } from "../data/fasteners";
import { translateText, useI18n } from "../i18n";

const legacyTools = [
  {
    id: "area",
    group: "Area",
    title: "Area",
    description: "Area rektangel, triangel och cirkel",
  },
  {
    id: "spacing",
    group: "Indelning",
    title: "Indelning",
    description: "Beräkna antal brädor och exakt springa",
  },
  {
    id: "diagonal",
    group: "Diagonal",
    title: "Diagonal",
    description: "Kontrollera vinklar och diagonaler",
  },
  {
    id: "slope",
    group: "Lutning",
    title: "Lutning",
    description: "Beräkna procent och vinkel",
  },
  {
    id: "screws",
    group: "Skruv & Spikåtgång",
    title: "Infästning / Spik & Skruv",
    description: "Trall, panel, gips och konstruktion",
  },
  {
    id: "decking",
    group: "Trallåtgång",
    title: "Trallåtgång",
    description: "Brädor, löpmeter och spill",
  },
  {
    id: "flooring",
    group: "Klickgolv / Golvåtgång",
    title: "Klickgolv / Golvåtgång",
    description: "Paket och total yta",
  },
  {
    id: "drywall",
    group: "Gipsåtgång",
    title: "Gipsåtgång",
    description: "Antal gipsskivor",
  },
  {
    id: "sheet",
    group: "OSB / Plywood åtgång",
    title: "OSB / Plywood åtgång",
    description: "Skivor, yta och spill",
  },
  {
    id: "panel",
    group: "Panelåtgång",
    title: "Panelåtgång",
    description: "Paneltyp, overlap och cc mått",
  },
  {
    id: "paint",
    group: "Färgåtgång",
    title: "Färgåtgång",
    description: "Uppskattad färgåtgång",
  },
  {
    id: "insulation",
    group: "Isoleringsåtgång",
    title: "Isoleringsåtgång",
    description: "Vägg, tak och golv",
  },
  {
    id: "studwall",
    group: "Regelvägg / Regelåtgång",
    title: "Regelvägg / Regelåtgång",
    description: "Beräkna reglar, skenor och löpmeter",
  },
];

void legacyTools;

const tools = [
  { id: "spacing", group: "Kalkulator", title: "Indelning", description: "Beräkna antal brädor och exakt springa", ready: true },
  { id: "diagonal", group: "Kalkulator", title: "Diagonal", description: "Kontrollera vinklar och diagonaler", ready: true },
  { id: "slope", group: "Kalkulator", title: "Lutning", description: "Beräkna procent och vinkel", ready: true },
  { id: "stringer", group: "Kalkulator", title: "Vangstycke", description: "Förberedd modul för trappmått" },
  { id: "wallframe", group: "Kalkulator", title: "Väggstomme", description: "Förberedd modul för stomme och reglar" },
  { id: "ramp", group: "Kalkulator", title: "Ramp", description: "Förberedd modul för ramp och lutning" },
  { id: "cornerangle", group: "Kalkulator", title: "Hörnvinkel", description: "Förberedd modul för vinklar" },
  { id: "miter", group: "Kalkulator", title: "Geringsfog", description: "Förberedd modul för kapvinkel" },
  { id: "runningmeasure", group: "Kalkulator", title: "Löpande mått", description: "Förberedd modul för repeterade mått" },
  { id: "rafter", group: "Kalkulator", title: "Taksparre", description: "Förberedd modul för takmått" },
  { id: "decklayout", group: "Kalkulator", title: "Trallläggning", description: "Förberedd modul för trallriktning" },
  { id: "parquetlayout", group: "Kalkulator", title: "Parkettläggning", description: "Förberedd modul för läggmönster" },
  { id: "screws", group: "Åtgång", title: "Infästning / Spik & Skruv", description: "Trall, panel, gips och konstruktion", ready: true },
  { id: "decking", group: "Åtgång", title: "Trallåtgång", description: "Brädor, löpmeter och spill", ready: true },
  { id: "flooring", group: "Åtgång", title: "Klickgolv / Golvåtgång", description: "Paket och total yta", ready: true },
  { id: "drywall", group: "Åtgång", title: "Gipsåtgång", description: "Antal gipsskivor", ready: true },
  { id: "sheet", group: "Åtgång", title: "OSB / Plywood åtgång", description: "Skivor, yta och spill", ready: true },
  { id: "panel", group: "Åtgång", title: "Panelåtgång", description: "Paneltyp, overlap och cc mått", ready: true },
  { id: "paint", group: "Åtgång", title: "Färgåtgång", description: "Uppskattad färgåtgång", ready: true },
  { id: "insulation", group: "Åtgång", title: "Isoleringsåtgång", description: "Vägg, tak och golv", ready: true },
  { id: "studwall", group: "Åtgång", title: "Regelvägg / Regelåtgång", description: "Beräkna reglar, skenor och löpmeter", ready: true },
  { id: "concrete", group: "Åtgång", title: "Betongåtgång", description: "Volym betong från yta och tjocklek", ready: true },
  { id: "selfleveling", group: "Åtgång", title: "Flytspackelåtgång", description: "Säckar och kg från yta och tjocklek", ready: true },
];

const toolGroups = ["Kalkulator", "Åtgång"];

const defaultValues = {
  area: {
    shape: "rectangle",
    length: 4,
    width: 3,
    base: 4,
    height: 3,
    radius: 1,
  },
  spacing: {
    totalLength: 3000,
    materialWidth: 120,
    desiredGap: 5,
    startGap: true,
    endGap: true,
  },
  diagonal: {
    length: 4,
    width: 3,
    measuredDiagonal: 5,
  },
  slope: {
    heightDifference: 10,
    length: 200,
  },
  stringer: {
    rise: 170,
    run: 250,
    steps: 5,
  },
  wallframe: {
    length: 4,
    height: 2.4,
    cc: 600,
  },
  ramp: {
    heightDifference: 30,
    length: 300,
  },
  cornerangle: {
    length: 4,
    width: 3,
    diagonal: 5,
  },
  miter: {
    angle: 90,
  },
  runningmeasure: {
    totalLength: 2400,
    modules: 6,
  },
  rafter: {
    span: 4,
    rise: 1,
  },
  decklayout: {
    totalWidth: 4000,
    totalLength: 7000,
    boardWidth: 120,
    boardThickness: 28,
    gap: 5,
    joistCc: 600,
    useFrame: true,
    frameWidth: 145,
    overhang: 24,
    direction: "length",
    breakerMode: "auto",
    breakerCount: 1,
    breakerPositions: "50",
    breakerWidth: 145,
    availableLengths: ["2.4", "3.0", "3.6", "4.2", "4.8", "5.4", "6.0"],
    customLengths: "",
    waste: 8,
  },
  parquetlayout: {
    length: 5,
    width: 4,
    boardWidth: 180,
  },
  screws: {
    environment: "infastning.interior",
    category: "infastning.floor",
    materialId: "fastener-1",
    fastenerType: "original",
    areaMode: "manual",
    area: 20,
    wallLength: 8,
    wallHeight: 2.5,
    length: 4,
    width: 5,
    linearMeters: 20,
    points: 80,
    crossingPoints: 80,
    panelWidth: 120,
    panelCc: 600,
    floorBoardType: "600 x 1800 mm",
    customFloorBoardWidth: 600,
    customFloorBoardLength: 1800,
    screwRows: 3,
    screwSpacing: 150,
    waste: "",
  },
  decking: {
    areaMode: "manual",
    area: 20,
    length: 4,
    width: 5,
    boardWidth: 120,
    gap: 5,
    boardLength: 4.2,
    waste: 10,
  },
  flooring: {
    areaMode: "manual",
    area: 20,
    length: 4,
    width: 5,
    packageSize: 2.2,
    waste: 10,
  },
  drywall: {
    areaMode: "manual",
    area: 20,
    boardType: "1200 x 2400 mm",
    layerCount: "one",
    boardOrientation: "vertical",
    layer1Orientation: "horizontal",
    layer2Orientation: "vertical",
    boardCcMode: "cc600",
    customBoardCc: 600,
    wallLength: 4,
    wallHeight: 2.5,
    waste: 10,
    customBoardWidth: 1200,
    customBoardHeight: 2400,
  },
  sheet: {
    material: "OSB",
    areaMode: "manual",
    area: 20,
    wallLength: 4,
    wallHeight: 2.5,
    length: 4,
    width: 5,
    boardType: "1200 x 2500 mm",
    boardOrientation: "vertical",
    boardCcMode: "cc600",
    customBoardCc: 600,
    waste: 10,
    customBoardWidth: 1200,
    customBoardHeight: 2500,
  },
  panel: {
    areaMode: "manual",
    area: 20,
    wallLength: 4,
    wallHeight: 2.5,
    panelType: "Lockpanel",
    coverWidth: 120,
    overlap: 20,
    cc: 600,
  },
  paint: {
    areaMode: "manual",
    area: 40,
    wallLength: 8,
    wallHeight: 2.5,
    length: 5,
    width: 4,
    coats: 2,
  },
  insulation: {
    type: "vägg",
    areaMode: "manual",
    area: 30,
    wallLength: 6,
    wallHeight: 2.5,
    length: 6,
    width: 5,
    thickness: 95,
    waste: 10,
  },
  studwall: {
    studType: "träreglar",
    wallLength: 4,
    wallHeight: 2.4,
    cc: 600,
    openings: 1,
    doubleStudAtOpening: true,
    headerType: "single",
    dimension: "45x95",
    studLength: 3,
    metalStudLength: 2.7,
    waste: 10,
    customWidth: 45,
    customDepth: 95,
  },
  concrete: {
    areaMode: "floor",
    area: 12,
    length: 4,
    width: 3,
    thickness: 100,
    waste: 10,
  },
  selfleveling: {
    areaMode: "floor",
    area: 12,
    length: 4,
    width: 3,
    thickness: 10,
    consumptionPerMm: 1.7,
    bagWeight: 20,
    waste: 10,
  },
};

const boardSizes = {
  "900 x 2200 mm": { width: 900, height: 2200 },
  "900 x 2400 mm": { width: 900, height: 2400 },
  "900 x 2500 mm": { width: 900, height: 2500 },
  "900 x 2700 mm": { width: 900, height: 2700 },
  "1200 x 2400 mm": { width: 1200, height: 2400 },
  "1200 x 2500 mm": { width: 1200, height: 2500 },
  custom: { width: 1200, height: 2400 },
};

const sheetSizes = {
  "1200 x 2500 mm": { width: 1200, height: 2500 },
  "900 x 2500 mm": { width: 900, height: 2500 },
  custom: { width: 1200, height: 2500 },
};

const studDimensions = ["45x70", "45x95", "45x120", "custom"];
const studLengths = [2.4, 3, 3.6, 4.2, 4.8, 5.4];
const ccOptions = ["cc300", "cc450", "cc600", "custom"];
const shoppingListStorageKey = "marcin-bygg-tools-shopping-list";
const projectToolsStorageKey = "marcin-bygg-tools-project-items";
const offerToolsStorageKey = "marcin-bygg-tools-offer-items";
const standardDeckBoardLengths = [2.4, 3, 3.6, 4.2, 4.8, 5.4, 6];
const deckScrewsPerCrossing = 2;

function numberValue(value) {
  return Math.max(0, Number(value) || 0);
}

function formatNumber(value, maximumFractionDigits = 2) {
  return numberValue(value).toLocaleString("sv-SE", {
    maximumFractionDigits,
    minimumFractionDigits: 0,
  });
}

function formatQuantityRange(range, suffix = "") {
  const min = range?.min ?? range?.value ?? 0;
  const max = range?.max ?? range?.value ?? min;
  const isRange = range?.isRange || min !== max;

  if (!isRange) {
    return `${formatNumber(max, 0)}${suffix}`;
  }

  return `${formatNumber(min, 0)}-${formatNumber(max, 0)}${suffix}`;
}

function formatPackages(packages) {
  if (!Array.isArray(packages) || packages.length === 0) return "0";
  return packages.map((item) => `${item.count} x ${item.size}`).join(", ");
}

function createLocalId() {
  return globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function pdfSafeText(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replaceAll("ł", "l")
    .replaceAll("Ł", "L")
    .replace(/[()\\]/g, "\\$&");
}
function downloadShoppingListPdf(items, filename) {
  const lines = [
    "MARCIN BYGG - INKOPSLISTA",
    new Date().toLocaleDateString("sv-SE"),
    "",
    ...items.flatMap((item, index) => [
      `${index + 1}. ${item.name}`,
      `   Antal: ${formatNumber(item.quantity)} ${item.unit}`,
      `   Kalkylator: ${item.source}`,
      item.note ? `   Notering: ${item.note}` : "",
      "",
    ]),
  ].filter(Boolean);
  const catalogId = 1;
  const pagesId = 2;
  const fontId = 3;
  const pageId = 4;
  const contentId = 5;
  const content = [
    "BT",
    "/F1 20 Tf",
    "50 790 Td",
    "(MARCIN BYGG) Tj",
    "/F1 11 Tf",
    "0 -28 Td",
    ...lines.map((line) => `(${pdfSafeText(line).slice(0, 95)}) Tj 0 -16 Td`),
    "ET",
  ].join("\n");
  const objects = [
    `<< /Type /Catalog /Pages ${pagesId} 0 R >>`,
    `<< /Type /Pages /Kids [${pageId} 0 R] /Count 1 >>`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 ${fontId} 0 R >> >> /Contents ${contentId} 0 R >>`,
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
  ];

  const parts = ["%PDF-1.4\n"];
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(parts.join("").length);
    parts.push(`${index + 1} 0 obj\n${object}\nendobj\n`);
  });
  const xrefOffset = parts.join("").length;
  parts.push(`xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`);
  offsets.slice(1).forEach((offset) => {
    parts.push(`${String(offset).padStart(10, "0")} 00000 n \n`);
  });
  parts.push(`trailer << /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`);

  const blob = new Blob(parts, { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}-${new Date().toISOString().slice(0, 10)}.pdf`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const lengthUnits = ["mm", "cm", "m"];

const unitToMeters = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
};

function convertLength(value, fromUnit, toUnit) {
  return numberValue(value) * unitToMeters[fromUnit] / unitToMeters[toUnit];
}

function lengthStep(unit) {
  if (unit === "mm") return 1;
  if (unit === "cm") return 0.1;
  return 0.001;
}

function formatLength(value, baseUnit, displayUnit, maximumFractionDigits = 2) {
  return `${formatNumber(convertLength(value, baseUnit, displayUnit), maximumFractionDigits)} ${displayUnit}`;
}

function boardSize(values) {
  if (values.boardType === "custom") {
    return {
      width: numberValue(values.customBoardWidth),
      height: numberValue(values.customBoardHeight),
    };
  }

  return boardSizes[values.boardType] || boardSizes["1200 x 2400 mm"];
}

function sheetSize(values) {
  if (values.boardType === "custom") {
    return {
      width: numberValue(values.customBoardWidth),
      height: numberValue(values.customBoardHeight),
    };
  }

  return sheetSizes[values.boardType] || sheetSizes["1200 x 2500 mm"];
}

function surfaceArea(values) {
  if (values.areaMode === "wall" || values.areaMode === "dimensions") {
    return numberValue(values.wallLength) * numberValue(values.wallHeight);
  }

  if (values.areaMode === "floor") {
    return numberValue(values.length) * numberValue(values.width);
  }

  return numberValue(values.area);
}

function selectedCc(values) {
  if (values.boardCcMode === "custom") {
    return numberValue(values.customBoardCc);
  }

  return Number(String(values.boardCcMode || "cc600").replace("cc", "")) || 600;
}

function calculateSheetLayout(values, size, area, orientation = values.boardOrientation) {
  const boardWidth = numberValue(size.width);
  const boardHeight = numberValue(size.height);
  const boardArea = (boardWidth / 1000) * (boardHeight / 1000);
  const theoreticalMinimum = boardArea > 0 ? Math.ceil(area / boardArea) : 0;
  const cc = selectedCc(values);
  const practicalSheets = theoreticalMinimum;
  const spillSheets = Math.max(0, Math.ceil(practicalSheets * (numberValue(values.waste) / 100)));
  const finalSheets = practicalSheets + spillSheets;

  return {
    boardArea,
    theoreticalMinimum,
    areaSheets: theoreticalMinimum,
    practicalSheets,
    spillSheets,
    finalSheets,
    cc,
    orientation,
  };
}

function calculateArea(values) {
  if (values.shape === "triangle") {
    return (numberValue(values.base) * numberValue(values.height)) / 2;
  }

  if (values.shape === "circle") {
    return Math.PI * numberValue(values.radius) ** 2;
  }

  return numberValue(values.length) * numberValue(values.width);
}

function calculateSpacing(values) {
  const total = numberValue(values.totalLength);
  const material = numberValue(values.materialWidth);
  const desiredGap = numberValue(values.desiredGap);

  if (total <= 0 || material <= 0) {
    return {
      boards: 0,
      exactGap: 0,
      sideGap: 0,
    };
  }

  const roughCount = Math.max(1, Math.floor((total + desiredGap) / (material + desiredGap)));
  const candidates = [roughCount - 1, roughCount, roughCount + 1, roughCount + 2]
    .filter((count) => count > 0 && count * material < total);
  const bestCount = candidates.reduce((best, count) => {
    const gapCount = Math.max(0, count - 1) + (values.startGap ? 1 : 0) + (values.endGap ? 1 : 0);
    const exactGap = gapCount > 0 ? (total - count * material) / gapCount : 0;
    const bestGapCount = Math.max(0, best - 1) + (values.startGap ? 1 : 0) + (values.endGap ? 1 : 0);
    const bestGap = bestGapCount > 0 ? (total - best * material) / bestGapCount : 0;

    return Math.abs(exactGap - desiredGap) < Math.abs(bestGap - desiredGap) ? count : best;
  }, candidates[0] || 1);
  const gapCount = Math.max(0, bestCount - 1) + (values.startGap ? 1 : 0) + (values.endGap ? 1 : 0);
  const exactGap = gapCount > 0 ? (total - bestCount * material) / gapCount : 0;

  return {
    boards: bestCount,
    exactGap,
    sideGap: values.startGap || values.endGap ? exactGap : 0,
  };
}

function parseDeckBoardLengths(values) {
  const selectedLengths = Array.isArray(values.availableLengths) && values.availableLengths.length > 0
    ? values.availableLengths.map(Number)
    : [Number(values.boardLength) || 4.2];
  const customLengths = String(values.customLengths || "")
    .split(/[,\s;]+/)
    .map((item) => Number(String(item).replace(",", ".")))
    .filter((item) => item > 0);
  const lengths = [...selectedLengths, ...customLengths]
    .filter((item) => item > 0)
    .sort((a, b) => a - b);

  return [...new Set(lengths.map((item) => Number(item.toFixed(2))))];
}

function optimizeDeckSegment(segmentLengthM, availableLengths) {
  const targetCm = Math.max(1, Math.ceil(segmentLengthM * 100));
  const lengthsCm = availableLengths.map((length) => Math.round(length * 100)).filter((length) => length > 0);
  const maxLengthCm = Math.max(...lengthsCm, targetCm);
  const limitCm = targetCm + maxLengthCm;
  const dp = Array.from({ length: limitCm + 1 }, () => null);
  dp[0] = { pieces: 0, counts: {}, totalCm: 0 };

  for (let totalCm = 0; totalCm <= limitCm; totalCm += 1) {
    const current = dp[totalCm];
    if (!current) continue;

    lengthsCm.forEach((lengthCm, index) => {
      const nextTotal = totalCm + lengthCm;
      if (nextTotal > limitCm) return;

      const key = String(availableLengths[index]);
      const next = {
        pieces: current.pieces + 1,
        counts: { ...current.counts, [key]: (current.counts[key] || 0) + 1 },
        totalCm: nextTotal,
      };
      const existing = dp[nextTotal];

      if (!existing || next.pieces < existing.pieces) {
        dp[nextTotal] = next;
      }
    });
  }

  let best = null;
  for (let totalCm = targetCm; totalCm <= limitCm; totalCm += 1) {
    const candidate = dp[totalCm];
    if (!candidate) continue;

    const wasteCm = totalCm - targetCm;
    if (
      !best
      || wasteCm < best.wasteCm
      || (wasteCm === best.wasteCm && candidate.pieces < best.pieces)
    ) {
      best = { ...candidate, wasteCm };
    }
  }

  return best || { pieces: 0, counts: {}, totalCm: 0, wasteCm: 0 };
}

function combineDeckCounts(target, source, multiplier = 1) {
  Object.entries(source || {}).forEach(([length, count]) => {
    target[length] = (target[length] || 0) + count * multiplier;
  });

  return target;
}

function deckCountsToLabel(counts) {
  const parts = Object.entries(counts || {})
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([length, count]) => `${formatNumber(Number(length))} m x ${count}`);

  return parts.length > 0 ? parts.join(", ") : "-";
}

function createDeckFieldPlan(runLength, breakerWidth, mode, count, positions) {
  const breakerCount = mode === "off" ? 0 : Math.max(0, Math.min(4, Math.round(count)));

  if (breakerCount === 0) {
    return { fieldLengths: [runLength], breakerCenters: [] };
  }

  if (mode === "manual") {
    const parsedPositions = String(positions || "")
      .split(/[,\s;]+/)
      .map((item) => Number(String(item).replace(",", ".")))
      .filter((item) => item > 0 && item < 100)
      .sort((a, b) => a - b)
      .slice(0, breakerCount);

    const centers = parsedPositions.length > 0
      ? parsedPositions.map((percent) => runLength * (percent / 100))
      : Array.from({ length: breakerCount }, (_, index) => runLength * ((index + 1) / (breakerCount + 1)));
    const edges = [0];

    centers.forEach((center) => {
      edges.push(Math.max(0, center - breakerWidth / 2), Math.min(runLength, center + breakerWidth / 2));
    });
    edges.push(runLength);

    const fieldLengths = [];
    for (let index = 0; index < edges.length - 1; index += 2) {
      fieldLengths.push(Math.max(0, edges[index + 1] - edges[index]));
    }

    return { fieldLengths: fieldLengths.filter((length) => length > 0), breakerCenters: centers };
  }

  const availableRun = Math.max(0, runLength - breakerCount * breakerWidth);
  const fieldLength = availableRun / (breakerCount + 1);
  const fieldLengths = Array.from({ length: breakerCount + 1 }, () => fieldLength);
  const breakerCenters = Array.from({ length: breakerCount }, (_, index) => (
    fieldLength * (index + 1) + breakerWidth * index + breakerWidth / 2
  ));

  return { fieldLengths, breakerCenters };
}

function optimizeDeckLayoutPlan(runLength, rowCount, availableLengths, values) {
  const mode = values.breakerMode || (values.useBreaker ? "auto" : "off");
  const maxAutoBreakers = mode === "auto" ? Math.max(0, Math.min(4, Math.round(numberValue(values.breakerCount)))) : Math.max(0, Math.round(numberValue(values.breakerCount)));
  const breakerWidth = Math.max(0, numberValue(values.breakerWidth));
  const candidateCounts = mode === "auto"
    ? Array.from({ length: maxAutoBreakers + 1 }, (_, index) => index)
    : [mode === "off" ? 0 : maxAutoBreakers];

  const candidates = candidateCounts.map((breakerCount) => {
    const fieldPlan = createDeckFieldPlan(runLength, breakerWidth, breakerCount === 0 ? "off" : mode, breakerCount, values.breakerPositions);
    const boardCounts = {};
    let purchasedMeters = 0;
    let wasteMeters = 0;
    let piecesPerRow = 0;

    fieldPlan.fieldLengths.forEach((fieldLength) => {
      const segment = optimizeDeckSegment(fieldLength / 1000, availableLengths);
      combineDeckCounts(boardCounts, segment.counts, rowCount);
      purchasedMeters += (segment.totalCm / 100) * rowCount;
      wasteMeters += (segment.wasteCm / 100) * rowCount;
      piecesPerRow += segment.pieces;
    });

    const planningBonus = breakerCount > 0 ? breakerCount * 6 : 0;

    return {
      ...fieldPlan,
      breakerCount,
      boardCounts,
      purchasedMeters,
      wasteMeters,
      piecesPerRow,
      score: wasteMeters - planningBonus,
    };
  });

  return candidates.reduce((best, candidate) => (
    !best || candidate.score < best.score ? candidate : best
  ), null);
}

function calculateDeckLayout(values) {
  const totalWidth = numberValue(values.totalWidth);
  const totalLength = numberValue(values.totalLength);
  const boardWidth = numberValue(values.boardWidth);
  const boardThickness = numberValue(values.boardThickness) || 28;
  const gap = numberValue(values.gap);
  const joistCc = numberValue(values.joistCc) || 600;
  const overhang = numberValue(values.overhang);
  const frameWidth = values.useFrame
    ? numberValue(values.frameWidth) || (Math.max(0, Math.round(numberValue(values.frameBoards))) * boardWidth)
    : 0;
  const outerWidth = totalWidth + overhang * 2;
  const outerLength = totalLength + overhang * 2;
  const innerWidth = Math.max(0, outerWidth - frameWidth * 2);
  const innerLength = Math.max(0, outerLength - frameWidth * 2);
  const boardsRunAlongLength = values.direction !== "width";
  const runLength = boardsRunAlongLength ? innerLength : innerWidth;
  const rowSpan = boardsRunAlongLength ? innerWidth : innerLength;
  const moduleWidth = boardWidth + gap;
  const mainBoards = moduleWidth > 0 ? Math.max(0, Math.floor((rowSpan + gap) / moduleWidth)) : 0;
  const availableLengths = parseDeckBoardLengths(values);
  const optimizedPlan = optimizeDeckLayoutPlan(runLength, mainBoards, availableLengths, values);
  const mainLinearMeters = optimizedPlan.fieldLengths.reduce((sum, length) => sum + (length / 1000) * mainBoards, 0);
  const frameRows = values.useFrame ? Math.max(1, Math.ceil(frameWidth / Math.max(1, boardWidth + gap))) : 0;
  const frameLinearMeters = values.useFrame ? ((outerWidth * 2 + outerLength * 2) / 1000) * frameRows : 0;
  const breakerLinearMeters = (optimizedPlan.breakerCount * rowSpan) / 1000;
  const materialLinearMeters = mainLinearMeters + frameLinearMeters + breakerLinearMeters;
  const wasteMultiplier = 1 + numberValue(values.waste) / 100;
  const totalLinearMeters = materialLinearMeters * wasteMultiplier;
  const longestLength = Math.max(...availableLengths, 1);
  const frameBoardsToBuy = values.useFrame ? Math.ceil(frameLinearMeters / longestLength) : 0;
  const breakerBoardsToBuy = optimizedPlan.breakerCount > 0 ? Math.ceil(breakerLinearMeters / longestLength) : 0;
  const boardsToBuy = Object.values(optimizedPlan.boardCounts).reduce((sum, count) => sum + count, 0) + frameBoardsToBuy + breakerBoardsToBuy;
  const joistCount = runLength > 0 ? Math.ceil(runLength / joistCc) + 1 : 0;
  const joistLinearMeters = (joistCount * rowSpan) / 1000;
  const screws = Math.ceil((mainBoards * Math.max(1, joistCount) * deckScrewsPerCrossing + (frameRows + optimizedPlan.breakerCount) * 18) * wasteMultiplier);
  const wastePercentActual = optimizedPlan.purchasedMeters > 0
    ? (optimizedPlan.wasteMeters / optimizedPlan.purchasedMeters) * 100
    : 0;
  const area = (outerWidth * outerLength) / 1000000;
  const recommendedLayout = optimizedPlan.breakerCount > 0
    ? `Brytbräda ${optimizedPlan.breakerCount} st, fält ${optimizedPlan.fieldLengths.map((length) => formatLength(length, "mm", "m")).join(" + ")}`
    : `Hela längden i ett fält, ${deckCountsToLabel(optimizedPlan.boardCounts)}`;

  return {
    area,
    outerWidth,
    outerLength,
    innerWidth,
    innerLength,
    frameWidth,
    frameBoards: frameRows,
    frameBoardsToBuy,
    mainBoards,
    mainLinearMeters,
    frameLinearMeters,
    breakerLinearMeters,
    breakerBoardsToBuy,
    materialLinearMeters,
    totalLinearMeters,
    boardsToBuy,
    joistCc,
    joistCount,
    joistLinearMeters,
    screws,
    overhang,
    direction: values.direction,
    runLength,
    rowSpan,
    boardWidth,
    boardThickness,
    gap,
    availableLengths,
    fieldLengths: optimizedPlan.fieldLengths,
    breakerCount: optimizedPlan.breakerCount,
    breakerWidth: numberValue(values.breakerWidth),
    breakerCenters: optimizedPlan.breakerCenters,
    recommendedCounts: optimizedPlan.boardCounts,
    recommendedLengthsLabel: deckCountsToLabel(optimizedPlan.boardCounts),
    wasteMeters: optimizedPlan.wasteMeters,
    wastePercentActual,
    recommendedLayout,
  };
}

function calculateDrywall(values) {
  const wallArea = surfaceArea(values);
  const size = boardSize(values);
  const layer1 = calculateSheetLayout(values, size, wallArea, values.layer1Orientation || values.boardOrientation);
  const hasSecondLayer = values.layerCount === "two";
  const layer2 = hasSecondLayer
    ? calculateSheetLayout(values, size, wallArea, values.layer2Orientation || values.boardOrientation)
    : null;
  const finalSheets = layer1.finalSheets + (layer2?.finalSheets || 0);
  const theoreticalMinimum = layer1.theoreticalMinimum + (layer2?.theoreticalMinimum || 0);
  const practicalSheets = layer1.practicalSheets + (layer2?.practicalSheets || 0);
  const spillSheets = layer1.spillSheets + (layer2?.spillSheets || 0);

  return {
    wallArea,
    ...layer1,
    layer1,
    layer2,
    layers: hasSecondLayer ? 2 : 1,
    totalArea: wallArea * (hasSecondLayer ? 2 : 1),
    theoreticalMinimum,
    areaSheets: theoreticalMinimum,
    practicalSheets,
    spillSheets,
    finalSheets,
    size,
  };
}

function calculateSheet(values) {
  const area = surfaceArea(values);
  const size = sheetSize(values);
  const layout = calculateSheetLayout(values, size, area);

  return {
    area,
    ...layout,
    size,
  };
}

function calculateScrews(values) {
  const material = fastenerService.find(values.materialId);
  const usageResult = usageCalculatorService.calculate(material, {
    ...values,
    area: material.unit === "st/m2" ? surfaceArea(values) : values.area,
  });
  const packageResult = packageCalculatorService.calculate(usageResult.final.max, material.packageSize);
  const fasteners = replacementService.resolveFasteners(material, values.fastenerType);

  return {
    ...material,
    fasteners,
    usageResult,
    packageResult,
    inputLabel: material.unit === "st/lm"
      ? `${formatNumber(values.linearMeters)} lm`
      : material.unit === "st/punkt"
        ? `${formatNumber(values.points, 0)} punkt`
        : material.unit === "st/korsningspunkt"
          ? `${formatNumber(values.crossingPoints, 0)} korsningspunkt`
          : `${formatNumber(surfaceArea(values))} m²`,
    finalFasteners: usageResult.final.max,
    baseFasteners: usageResult.needed.max,
    waste: usageResult.waste,
    mode: "fastening",
  };
}

function calculateStudWall(values) {
  const wallLength = numberValue(values.wallLength);
  const wallHeight = numberValue(values.wallHeight);
  const ccMeters = Math.max(0.1, numberValue(values.cc) / 1000);
  const openings = Math.max(0, Math.round(numberValue(values.openings)));
  const verticalStuds = wallLength > 0 ? Math.floor(wallLength / ccMeters) + 1 : 0;
  const cornerStuds = wallLength > 0 ? 4 : 0;
  const openingSideStuds = openings * (values.doubleStudAtOpening ? 4 : 2);
  const headerStuds = openings * (values.headerType === "double" ? 2 : 1);
  const standingStuds = verticalStuds + cornerStuds + openingSideStuds;
  const totalPieces = standingStuds + headerStuds;
  const verticalMeters = standingStuds * wallHeight;
  const trackMeters = wallLength * 2;
  const estimatedHeaderWidth = Math.min(1.2, Math.max(0.8, wallLength / Math.max(1, openings + 2)));
  const headerMeters = headerStuds * estimatedHeaderWidth;
  const linearMeters = verticalMeters + trackMeters + headerMeters;
  const studLinearMeters = verticalMeters + headerMeters;
  const wasteMultiplier = 1 + numberValue(values.waste) / 100;
  const selectedStudLength = values.studType === "metallreglar"
    ? numberValue(values.metalStudLength)
    : numberValue(values.studLength);
  const studsToBuy = selectedStudLength > 0 ? Math.ceil((studLinearMeters * wasteMultiplier) / selectedStudLength) : 0;
  const railsToBuy = Math.ceil((trackMeters * wasteMultiplier) / 3);
  const dimension = values.dimension === "custom"
    ? `${formatNumber(values.customWidth)}x${formatNumber(values.customDepth)}`
    : values.dimension;

  return {
    totalPieces,
    standingStuds,
    linearMeters,
    studLinearMeters,
    trackMeters,
    studsToBuy,
    railsToBuy,
    selectedStudLength,
    dimension,
  };
}

function shoppingItemsForTool(tool, values) {
  if (tool.id === "drywall") {
    const result = calculateDrywall(values);

    return [
      {
        name: `Gipsskiva ${values.boardType === "custom" ? `${formatNumber(result.size.width)} x ${formatNumber(result.size.height)} mm` : values.boardType}`,
        quantity: result.finalSheets,
        unit: "st",
        note: `${result.layers} lager, lager 1 ${result.layer1.orientation}${result.layer2 ? `, lager 2 ${result.layer2.orientation}` : ""}, yta ${formatNumber(result.totalArea)} m², cc${formatNumber(result.cc, 0)}, spill ${formatNumber(values.waste)} %`,
        source: tool.title,
      },
    ];
  }

  if (tool.id === "sheet") {
    const result = calculateSheet(values);
    const dimension = values.boardType === "custom"
      ? `${formatNumber(result.size.width)} x ${formatNumber(result.size.height)} mm`
      : values.boardType;

    return [
      {
        name: `${values.material} ${dimension}`,
        quantity: result.finalSheets,
        unit: "st",
        note: `Yta ${formatNumber(result.area)} m², ${values.boardOrientation}, cc${formatNumber(result.cc, 0)}, spill ${formatNumber(values.waste)} %`,
        source: tool.title,
      },
    ];
  }

  if (tool.id === "insulation") {
    const area = surfaceArea(values);
    const finalArea = area * (1 + numberValue(values.waste) / 100);

    return [
      {
        name: `Isolering ${values.type} ${formatNumber(values.thickness)} mm`,
        quantity: Number(finalArea.toFixed(2)),
        unit: "m²",
        note: `Yta ${formatNumber(area)} m², spill ${formatNumber(values.waste)} %`,
        source: tool.title,
      },
    ];
  }

  if (tool.id === "screws") {
    const result = calculateScrews(values);

    return [
      {
        name: result.fasteners.join(" / "),
        quantity: result.packageResult.purchased,
        unit: "st",
        note: `${result.material} · ${formatQuantityRange(result.usageResult.final)} st · ${formatPackages(result.packageResult.packages)} · ${result.surfaceTreatment} · spill ${formatNumber(result.waste)} %`,
        source: tool.title,
      },
    ];
  }

  if (tool.id === "decklayout") {
    const result = calculateDeckLayout(values);
    const mainBoards = Object.entries(result.recommendedCounts).map(([length, count]) => ({
      name: `Trallbrädor ${formatNumber(Number(length))} m`,
      quantity: count,
      unit: "st",
      note: `Huvudfält ${formatNumber(result.mainLinearMeters)} lm, optimerat spill ${formatNumber(result.wastePercentActual)} %`,
      source: tool.title,
    }));

    return [
      ...mainBoards,
      {
        name: "Fris / flis trall",
        quantity: result.frameBoardsToBuy,
        unit: "st",
        note: values.useFrame ? `${formatNumber(result.frameLinearMeters)} lm runt altan, utstick ${formatNumber(result.overhang)} mm` : "Ej aktiv",
        source: tool.title,
      },
      {
        name: "Brytbräda",
        quantity: result.breakerBoardsToBuy,
        unit: "st",
        note: result.breakerCount > 0 ? `${result.breakerCount} st, ${formatNumber(result.breakerLinearMeters)} lm` : "Ej aktiv",
        source: tool.title,
      },
      {
        name: "Reglar",
        quantity: Number(result.joistLinearMeters.toFixed(2)),
        unit: "lm",
        note: `${result.joistCount} st, cc ${formatNumber(result.joistCc, 0)} mm`,
        source: tool.title,
      },
      {
        name: "Trallskruv",
        quantity: result.screws,
        unit: "st",
        note: `${deckScrewsPerCrossing} skruv per regelkorsning inkl. spill`,
        source: tool.title,
      },
    ];
  }

  if (tool.id === "studwall") {
    const result = calculateStudWall(values);
    const studName = values.studType === "metallreglar" ? "Metallregel" : `Träregel ${result.dimension}`;

    return [
      {
        name: `${studName} ${formatNumber(result.selectedStudLength)} m`,
        quantity: result.studsToBuy,
        unit: "st",
        note: `${formatNumber(result.studLinearMeters)} lm reglar inkl. spill`,
        source: tool.title,
      },
      {
        name: values.studType === "metallreglar" ? "Metallskena 3.0 m" : "Skena / syll 3.0 m",
        quantity: result.railsToBuy,
        unit: "st",
        note: `${formatNumber(result.trackMeters)} lm övre och nedre skena inkl. spill`,
        source: tool.title,
      },
    ];
  }

  return calculateTool(tool.id, values).map(([label, value]) => ({
    name: label,
    quantity: 1,
    unit: "rad",
    note: value,
    source: tool.title,
  }));
}

function calculateTool(toolId, values, unit = "m") {
  if (toolId === "area") {
    const area = calculateArea(values);

    return [
      ["Area", `${formatNumber(area)} m²`],
    ];
  }

  if (toolId === "spacing") {
    const result = calculateSpacing(values);

    return [
      ["Antal brädor", `${result.boards} st`],
      ["Exakt springa", formatLength(result.exactGap, "mm", unit)],
      ["Symmetrisk indelning", formatLength(result.sideGap, "mm", unit)],
    ];
  }

  if (toolId === "diagonal") {
    const diagonal = Math.sqrt(numberValue(values.length) ** 2 + numberValue(values.width) ** 2);
    const diff = Math.abs(diagonal - numberValue(values.measuredDiagonal));

    return [
      ["Diagonal", formatLength(diagonal, "m", unit)],
      ["Avvikelse", formatLength(diff, "m", unit)],
    ];
  }

  if (toolId === "slope") {
    const height = numberValue(values.heightDifference);
    const length = numberValue(values.length);
    const ratio = length > 0 ? height / length : 0;

    return [
      ["Lutning", `${formatNumber(ratio * 100)} %`],
      ["Vinkel", `${formatNumber(Math.atan(ratio) * (180 / Math.PI))}°`],
    ];
  }

  if (toolId === "stringer") {
    const totalRise = numberValue(values.rise) * numberValue(values.steps);
    const totalRun = numberValue(values.run) * Math.max(0, numberValue(values.steps) - 1);
    const stringerLength = Math.sqrt(totalRise ** 2 + totalRun ** 2);

    return [
      ["Total höjd", formatLength(totalRise, "mm", unit)],
      ["Total längd", formatLength(totalRun, "mm", unit)],
      ["Vangstycke", formatLength(stringerLength, "mm", unit)],
    ];
  }

  if (toolId === "wallframe") {
    const ccMeters = Math.max(0.1, numberValue(values.cc) / 1000);
    const studs = numberValue(values.length) > 0 ? Math.floor(numberValue(values.length) / ccMeters) + 1 : 0;

    return [
      ["Antal reglar", `${studs} st`],
      ["Vägglängd", formatLength(values.length, "m", unit)],
      ["Vägghöjd", formatLength(values.height, "m", unit)],
    ];
  }

  if (toolId === "ramp") {
    const ratio = numberValue(values.length) > 0 ? numberValue(values.heightDifference) / numberValue(values.length) : 0;

    return [
      ["Lutning", `${formatNumber(ratio * 100)} %`],
      ["Vinkel", `${formatNumber(Math.atan(ratio) * (180 / Math.PI))}°`],
    ];
  }

  if (toolId === "cornerangle") {
    const expectedDiagonal = Math.sqrt(numberValue(values.length) ** 2 + numberValue(values.width) ** 2);
    const diff = Math.abs(expectedDiagonal - numberValue(values.diagonal));

    return [
      ["Diagonal", formatLength(expectedDiagonal, "m", unit)],
      ["Avvikelse", formatLength(diff, "m", unit)],
    ];
  }

  if (toolId === "miter") {
    return [
      ["Geringsvinkel", `${formatNumber(numberValue(values.angle) / 2)}°`],
    ];
  }

  if (toolId === "runningmeasure") {
    const moduleWidth = numberValue(values.modules) > 0 ? numberValue(values.totalLength) / numberValue(values.modules) : 0;

    return [
      ["Modulbredd", formatLength(moduleWidth, "mm", unit)],
      ["Antal delar", `${formatNumber(values.modules, 0)} st`],
    ];
  }

  if (toolId === "rafter") {
    const length = Math.sqrt(numberValue(values.span) ** 2 + numberValue(values.rise) ** 2);

    return [
      ["Sparrlängd", formatLength(length, "m", unit)],
      ["Vinkel", `${formatNumber(Math.atan2(numberValue(values.rise), numberValue(values.span)) * (180 / Math.PI))}°`],
    ];
  }

  if (toolId === "parquetlayout") {
    const rows = numberValue(values.boardWidth) > 0 ? Math.ceil((numberValue(values.width) * 1000) / numberValue(values.boardWidth)) : 0;

    return [
      ["Yta", `${formatNumber(numberValue(values.length) * numberValue(values.width))} m²`],
      ["Rader", `${rows} st`],
    ];
  }

  if (toolId === "screws") {
    const result = calculateScrews(values);

    return [
      ["infastning.viewTitle", "infastning.viewTitle"],
      ["environment", result.environment],
      ["category", result.category],
      ["material", result.material],
      ["thickness", result.thickness || "Ej angivet"],
      ["fastenerType", result.fasteners.join(" / ")],
      ["surfaceTreatment", result.surfaceTreatment],
      ["ccMax", result.ccMax || "Ej angivet"],
      ["usage", `${formatQuantityRange(result.usageResult.usage, ` ${result.unit}`)}`],
      ["infastning.input", result.inputLabel],
      ["infastning.neededQuantity", `${formatQuantityRange(result.usageResult.needed)} st`],
      ["wastePercent", `${formatNumber(result.waste)} %`],
      ["infastning.finalWithWaste", `${formatQuantityRange(result.usageResult.final)} st`],
      ["infastning.packageSize", `${formatNumber(result.packageResult.packageSize, 0)} st`],
      ["infastning.packages", formatPackages(result.packageResult.packages)],
      ["infastning.packageCount", `${formatNumber(result.packageResult.packageCount, 0)} st`],
      ["infastning.purchasedQuantity", `${formatNumber(result.packageResult.purchased, 0)} st`],
      ["infastning.surplus", `${formatNumber(result.packageResult.surplus, 0)} st`],
      ["notes", result.notes || "Ej angivet"],
    ];
  }

  if (toolId === "decking") {
    const cover = (numberValue(values.boardWidth) + numberValue(values.gap)) / 1000;
    const linearMeters = cover > 0 ? (surfaceArea(values) / cover) * (1 + numberValue(values.waste) / 100) : 0;
    const boards = numberValue(values.boardLength) > 0 ? Math.ceil(linearMeters / numberValue(values.boardLength)) : 0;

    return [
      ["Antal brädor", `${boards} st`],
      ["Löpmeter", formatLength(linearMeters, "m", unit)],
      ["Uppskattad åtgång", formatLength(linearMeters, "m", unit)],
    ];
  }

  if (toolId === "flooring") {
    const totalArea = surfaceArea(values) * (1 + numberValue(values.waste) / 100);
    const packages = numberValue(values.packageSize) > 0 ? Math.ceil(totalArea / numberValue(values.packageSize)) : 0;

    return [
      ["Antal paket", `${packages} st`],
      ["Total yta", `${formatNumber(totalArea)} m²`],
    ];
  }

  if (toolId === "drywall") {
    const result = calculateDrywall(values);

    return [
      ["Väggyta", `${formatNumber(result.wallArea)} m²`],
      ["Total yta", `${formatNumber(result.totalArea)} m²`],
      ["Yta per skiva", `${formatNumber(result.boardArea)} m²`],
      ["Teoretiskt minimum", `${result.theoreticalMinimum} st`],
      ["Praktisk åtgång", `${result.practicalSheets} st`],
      ["Spill", `${result.spillSheets} st (${formatNumber(values.waste)} %)`],
      ["Antal skivor lager 1", `${result.layer1.finalSheets} st`],
      ["Antal skivor lager 2", result.layer2 ? `${result.layer2.finalSheets} st` : "0 st"],
      ["Total antal skivor", `${result.finalSheets} st`],
      ["CC mått", `cc${formatNumber(result.cc, 0)}`],
      ["Lager 1 montage", result.layer1.orientation],
      ["Lager 2 montage", result.layer2 ? result.layer2.orientation : "Inte angivet"],
      ["Finalt antal att köpa", `${result.finalSheets} st`],
    ];
  }

  if (toolId === "sheet") {
    const result = calculateSheet(values);

    return [
      ["Material", values.material],
      ["Yta", `${formatNumber(result.area)} m²`],
      ["Yta per skiva", `${formatNumber(result.boardArea)} m²`],
      ["Teoretiskt minimum", `${result.theoreticalMinimum} st`],
      ["Praktisk åtgång", `${result.practicalSheets} st`],
      ["Spill", `${result.spillSheets} st (${formatNumber(values.waste)} %)`],
      ["CC mått", `cc${formatNumber(result.cc, 0)}`],
      ["Skivmontage", result.boardOrientation],
      ["Finalt antal att köpa", `${result.finalSheets} st`],
    ];
  }

  if (toolId === "panel") {
    const coverWidth = Math.max(1, numberValue(values.coverWidth) - numberValue(values.overlap));
    const linearMeters = (surfaceArea(values) / (coverWidth / 1000));

    return [
      ["Panelåtgång", formatLength(linearMeters, "m", unit)],
      ["Täckande bredd", formatLength(coverWidth, "mm", unit)],
      ["CC mått", formatLength(values.cc, "mm", unit)],
    ];
  }

  if (toolId === "paint") {
    const liters = (surfaceArea(values) * Math.max(1, numberValue(values.coats))) / 8;

    return [
      ["Uppskattad färgåtgång", `${formatNumber(liters)} liter`],
      ["Antal lager", `${formatNumber(values.coats)} st`],
    ];
  }

  if (toolId === "studwall") {
    const result = calculateStudWall(values);

    return [
      ["Antal stående reglar", `${result.standingStuds} st`],
      ["Löpmeter reglar", formatLength(result.studLinearMeters, "m", unit)],
      ["Antal reglar att köpa", `${result.studsToBuy} st á ${formatNumber(result.selectedStudLength)} m`],
      ["Antal skenor 3 m", `${result.railsToBuy} st`],
      ["Inköpslista för vägg", `${result.studsToBuy} reglar, ${result.railsToBuy} skenor`],
    ];
  }

  if (toolId === "concrete") {
    const area = surfaceArea(values);
    const thicknessMeters = numberValue(values.thickness) / 1000;
    const volume = area * thicknessMeters;
    const volumeWithWaste = volume * (1 + numberValue(values.waste) / 100);

    return [
      ["Yta", `${formatNumber(area)} m²`],
      ["Tjocklek", formatLength(values.thickness, "mm", unit)],
      ["Betongvolym", `${formatNumber(volume)} m³`],
      ["Spill %", `${formatNumber(values.waste)} %`],
      ["Mängd att beställa", `${formatNumber(volumeWithWaste)} m³`],
    ];
  }

  if (toolId === "selfleveling") {
    const area = surfaceArea(values);
    const baseKg = area * numberValue(values.thickness) * numberValue(values.consumptionPerMm);
    const kgWithWaste = baseKg * (1 + numberValue(values.waste) / 100);
    const bags = numberValue(values.bagWeight) > 0 ? Math.ceil(kgWithWaste / numberValue(values.bagWeight)) : 0;

    return [
      ["Yta", `${formatNumber(area)} m²`],
      ["Tjocklek", formatLength(values.thickness, "mm", unit)],
      ["Åtgång", `${formatNumber(kgWithWaste)} kg`],
      ["Säckstorlek", `${formatNumber(values.bagWeight)} kg`],
      ["Antal säckar", `${bags} st`],
    ];
  }

  if (toolId === "stringer") {
    const totalRise = numberValue(values.rise) * numberValue(values.steps);
    const totalRun = numberValue(values.run) * Math.max(0, numberValue(values.steps) - 1);
    const stringerLength = Math.sqrt(totalRise ** 2 + totalRun ** 2);

    return [
      ["Total höjd", formatLength(totalRise, "mm", unit)],
      ["Total längd", formatLength(totalRun, "mm", unit)],
      ["Vangstycke", formatLength(stringerLength, "mm", unit)],
    ];
  }

  if (toolId === "wallframe") {
    const ccMeters = Math.max(0.1, numberValue(values.cc) / 1000);
    const studs = numberValue(values.length) > 0 ? Math.floor(numberValue(values.length) / ccMeters) + 1 : 0;

    return [
      ["Antal reglar", `${studs} st`],
      ["Vägglängd", formatLength(values.length, "m", unit)],
      ["Vägghöjd", formatLength(values.height, "m", unit)],
    ];
  }

  if (toolId === "ramp") {
    const ratio = numberValue(values.length) > 0 ? numberValue(values.heightDifference) / numberValue(values.length) : 0;

    return [
      ["Lutning", `${formatNumber(ratio * 100)} %`],
      ["Vinkel", `${formatNumber(Math.atan(ratio) * (180 / Math.PI))}°`],
    ];
  }

  if (toolId === "cornerangle") {
    const expectedDiagonal = Math.sqrt(numberValue(values.length) ** 2 + numberValue(values.width) ** 2);
    const diff = Math.abs(expectedDiagonal - numberValue(values.diagonal));

    return [
      ["Diagonal", formatLength(expectedDiagonal, "m", unit)],
      ["Avvikelse", formatLength(diff, "m", unit)],
    ];
  }

  if (toolId === "miter") {
    return [
      ["Geringsvinkel", `${formatNumber(numberValue(values.angle) / 2)}°`],
    ];
  }

  if (toolId === "runningmeasure") {
    const moduleWidth = numberValue(values.modules) > 0 ? numberValue(values.totalLength) / numberValue(values.modules) : 0;

    return [
      ["Modulbredd", formatLength(moduleWidth, "mm", unit)],
      ["Antal delar", `${formatNumber(values.modules, 0)} st`],
    ];
  }

  if (toolId === "rafter") {
    const length = Math.sqrt(numberValue(values.span) ** 2 + numberValue(values.rise) ** 2);

    return [
      ["Sparrlängd", formatLength(length, "m", unit)],
      ["Vinkel", `${formatNumber(Math.atan2(numberValue(values.rise), numberValue(values.span)) * (180 / Math.PI))}°`],
    ];
  }

  if (toolId === "decklayout") {
    const result = calculateDeckLayout(values);

    return [
      ["Antal trallbrädor", `${result.boardsToBuy} st`],
      ["Rekommenderade längder", result.recommendedLengthsLabel],
      ["Spill %", `${formatNumber(result.wastePercentActual)} %`],
      ["Antal reglar", `${result.joistCount} st · cc ${formatNumber(result.joistCc, 0)} mm`],
      ["Antal skruv", `${result.screws} st`],
      ["Total m²", `${formatNumber(result.area)} m²`],
      ["Total löpmeter", formatLength(result.totalLinearMeters, "m", unit)],
      ["Fris material", values.useFrame ? `${formatLength(result.frameLinearMeters, "m", unit)} · ${result.frameBoardsToBuy} st` : "Av"],
      ["Brytbräda material", result.breakerCount > 0 ? `${result.breakerCount} st · ${formatLength(result.breakerLinearMeters, "m", unit)}` : "Av"],
      ["Rekommenderad layout", result.recommendedLayout],
    ];
  }

  if (toolId === "parquetlayout") {
    const rows = numberValue(values.boardWidth) > 0 ? Math.ceil((numberValue(values.width) * 1000) / numberValue(values.boardWidth)) : 0;

    return [
      ["Yta", `${formatNumber(numberValue(values.length) * numberValue(values.width))} m²`],
      ["Rader", `${rows} st`],
    ];
  }

  const insulationArea = surfaceArea(values);
  const insulationToBuy = insulationArea * (1 + numberValue(values.waste) / 100);
  const volume = insulationToBuy * (numberValue(values.thickness) / 1000);

  return [
    ["Isoleringsyta", `${formatNumber(insulationArea)} m²`],
    ["Mängd att köpa", `${formatNumber(insulationToBuy)} m²`],
    ["Spill %", `${formatNumber(values.waste)} %`],
    ["Uppskattad mängd isolering", `${formatNumber(volume)} m³`],
    ["Typ", values.type],
  ];
}

export default function ToolsScreen({ goBack, defaultUnit = "m", initialTool = null }) {
  const { language, t } = useI18n();
  const [selectedTool, setSelectedTool] = useState(initialTool);
  const [unit, setUnit] = useState(defaultUnit);
  const [values, setValues] = useState(defaultValues);
  const [shoppingItems, setShoppingItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(shoppingListStorageKey)) || [];
    } catch {
      return [];
    }
  });
  const [projectItems, setProjectItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(projectToolsStorageKey)) || [];
    } catch {
      return [];
    }
  });
  const [offerItems, setOfferItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(offerToolsStorageKey)) || [];
    } catch {
      return [];
    }
  });
  const activeTool = tools.find((tool) => tool.id === selectedTool);

  useEffect(() => {
    localStorage.setItem(shoppingListStorageKey, JSON.stringify(shoppingItems));
  }, [shoppingItems]);

  useEffect(() => {
    localStorage.setItem(projectToolsStorageKey, JSON.stringify(projectItems));
  }, [projectItems]);

  useEffect(() => {
    localStorage.setItem(offerToolsStorageKey, JSON.stringify(offerItems));
  }, [offerItems]);

  const updateValues = (toolId, nextValues) => {
    setValues((currentValues) => ({
      ...currentValues,
      [toolId]: {
        ...currentValues[toolId],
        ...nextValues,
      },
    }));
  };

  const addToShoppingList = (tool) => {
    const items = shoppingItemsForTool(tool, values[tool.id]).map((item) => ({
      ...item,
      id: createLocalId(),
      checked: false,
      createdAt: new Date().toISOString(),
    }));

    setShoppingItems((currentItems) => [...items, ...currentItems]);
  };

  const addToolResultToProject = (tool) => {
    setProjectItems((currentItems) => [
      {
        id: createLocalId(),
        toolId: tool.id,
        title: tool.title,
        results: calculateTool(tool.id, values[tool.id], unit),
        values: values[tool.id],
        createdAt: new Date().toISOString(),
      },
      ...currentItems,
    ]);
  };

  const addToolResultToOffer = (tool) => {
    setOfferItems((currentItems) => [
      {
        id: createLocalId(),
        toolId: tool.id,
        title: tool.title,
        results: calculateTool(tool.id, values[tool.id], unit),
        shoppingItems: shoppingItemsForTool(tool, values[tool.id]),
        values: values[tool.id],
        createdAt: new Date().toISOString(),
      },
      ...currentItems,
    ]);
  };

  const updateShoppingItem = (id, nextValues) => {
    setShoppingItems((currentItems) => currentItems.map((item) => (
      item.id === id ? { ...item, ...nextValues } : item
    )));
  };

  const removeShoppingItem = (id) => {
    setShoppingItems((currentItems) => currentItems.filter((item) => item.id !== id));
  };

  const exportShoppingListPdf = (selectedOnly = false) => {
    const itemsToExport = selectedOnly
      ? shoppingItems.filter((item) => item.checked)
      : shoppingItems;

    if (itemsToExport.length === 0) {
      return;
    }

    downloadShoppingListPdf(itemsToExport, selectedOnly ? "inkopslista-valda" : "inkopslista");
  };

  if (selectedTool === "shopping-list") {
    return (
      <ShoppingListScreen
        items={shoppingItems}
        onBack={() => setSelectedTool(null)}
        onUpdate={updateShoppingItem}
        onRemove={removeShoppingItem}
        onClear={() => setShoppingItems([])}
        onExport={exportShoppingListPdf}
      />
    );
  }

  if (activeTool) {
    return (
      <ToolDetail
        tool={activeTool}
        values={values[activeTool.id]}
        unit={unit}
        onUnitChange={setUnit}
        onChange={(nextValues) => updateValues(activeTool.id, nextValues)}
        onAddToShoppingList={() => addToShoppingList(activeTool)}
        onAddToProject={() => addToolResultToProject(activeTool)}
        onAddToOffer={() => addToolResultToOffer(activeTool)}
        onBack={() => setSelectedTool(null)}
      />
    );
  }

  return (
    <div className="min-h-[100dvh] overflow-x-hidden bg-black p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] text-white">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={goBack}
          className="relative z-10 touch-manipulation rounded-2xl border border-zinc-800 bg-zinc-900 p-3"
        >
          <ArrowLeft size={22} />
        </button>

        <div>
          <h1 className="text-3xl font-black">
            {t("Kalkylator & Verktyg")}
          </h1>

          <p className="text-orange-400">
            {t("Snabba byggverktyg")}
          </p>
        </div>

        <img
          src={marcinByggLogo}
          alt="Marcin Bygg"
          className="ml-auto h-12 w-12 shrink-0 rounded-2xl object-contain shadow-xl shadow-orange-500/20"
        />
      </div>

      <div className="mt-6">
        <UnitToggle unit={unit} onChange={setUnit} />
      </div>

      <button
        type="button"
        onClick={() => setSelectedTool("shopping-list")}
        className="mt-4 flex min-h-16 w-full touch-manipulation items-center justify-between rounded-3xl border border-orange-400/30 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-5 text-left shadow-2xl shadow-orange-500/10 transition active:scale-[0.99]"
      >
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-orange-400">
            {t("Inköpslista")}
          </p>
          <p className="mt-1 text-sm text-zinc-400">
            {shoppingItems.length} {t("poster")}
          </p>
        </div>
        <ShoppingCart className="text-orange-400" />
      </button>

      <div className="mt-8 grid gap-7">
        {toolGroups.map((group) => {
          const groupTools = tools.filter((tool) => tool.group === group);
          const GroupIcon = group === "Kalkulator" ? Calculator : Box;

          return (
            <section key={group} className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-4 shadow-2xl shadow-black/20">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-orange-400/30 bg-orange-500/10 text-orange-400">
                  <GroupIcon size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-black">{translateText(group, language)}</h2>
                  <p className="text-sm text-zinc-500">
                    {group === "Kalkulator" ? t("Snabba mått och byggberäkningar") : t("Materialåtgång och inköpsunderlag")}
                  </p>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {groupTools.map((tool) => (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => setSelectedTool(tool.id)}
                    className="relative z-10 flex min-h-24 w-full touch-manipulation items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900 p-4 text-left transition active:scale-[0.99]"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-orange-400">
                          {translateText(tool.group, language)}
                        </p>
                        {!tool.ready && (
                          <span className="rounded-full border border-zinc-700 px-2 py-0.5 text-[10px] font-black uppercase text-zinc-500">
                            {t("Modul")}
                          </span>
                        )}
                      </div>

                      <h3 className="mt-2 text-lg font-black">
                        {translateText(tool.title, language)}
                      </h3>

                      <p className="mt-1 text-sm text-zinc-400">
                        {translateText(tool.description, language)}
                      </p>
                    </div>

                    <ChevronRight className="shrink-0 text-orange-400" />
                  </button>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function ShoppingListScreen({ items, onBack, onUpdate, onRemove, onClear, onExport }) {
  const { language, t } = useI18n();
  const selectedCount = items.filter((item) => item.checked).length;

  return (
    <div className="min-h-[100dvh] overflow-x-hidden bg-black p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] text-white">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onBack}
          className="relative z-10 touch-manipulation rounded-2xl border border-zinc-800 bg-zinc-900 p-3"
        >
          <ArrowLeft size={22} />
        </button>

        <div>
          <p className="text-sm font-bold uppercase text-orange-400">
            {t("Kalkylator & Verktyg")}
          </p>
          <h1 className="text-3xl font-black">
            {t("Inköpslista")}
          </h1>
        </div>

        <img
          src={marcinByggLogo}
          alt="Marcin Bygg"
          className="ml-auto h-12 w-12 shrink-0 rounded-2xl object-contain shadow-xl shadow-orange-500/20"
        />
      </div>

      {items.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6 text-center">
          <ShoppingCart className="mx-auto text-orange-400" size={34} />
          <h2 className="mt-4 text-xl font-black">
            {t("Inköpslistan är tom")}
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            {t("Lägg till resultat från kalkylatorerna för att bygga en inköpslista.")}
          </p>
        </div>
      ) : (
        <div className="mt-8">
          <div className="grid gap-3 sm:grid-cols-3">
            <button
              type="button"
              onClick={() => onExport(false)}
              className="flex min-h-12 touch-manipulation items-center justify-center gap-2 rounded-2xl bg-orange-500 px-4 text-sm font-black text-black transition active:scale-[0.98]"
            >
              <FileDown size={18} />
              {t("Exportera PDF")}
            </button>
            <button
              type="button"
              onClick={() => onExport(true)}
              disabled={selectedCount === 0}
              className="flex min-h-12 touch-manipulation items-center justify-center gap-2 rounded-2xl border border-orange-400/40 bg-orange-500/10 px-4 text-sm font-black text-orange-200 transition active:scale-[0.98] disabled:border-zinc-800 disabled:bg-zinc-900 disabled:text-zinc-600"
            >
              <FileDown size={18} />
              {t("Exportera valda")}
            </button>
            <button
              type="button"
              onClick={onClear}
              className="min-h-12 touch-manipulation rounded-2xl border border-red-500/40 bg-red-500/10 px-4 text-sm font-black text-red-200 transition active:scale-[0.98]"
            >
              {t("Rensa lista")}
            </button>
          </div>

          <p className="mt-4 text-sm text-zinc-400">
            {selectedCount} {t("markerade")} / {items.length} {t("poster")}
          </p>

          <div className="mt-4 grid gap-3">
            {items.map((item) => (
              <div key={item.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 shadow-xl shadow-black/20">
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => onUpdate(item.id, { checked: !item.checked })}
                  className={`mt-1 h-7 w-7 shrink-0 rounded-lg border text-sm font-black transition ${
                    item.checked
                      ? "border-orange-400 bg-orange-500 text-black"
                      : "border-zinc-700 bg-black text-transparent"
                  }`}
                  aria-label={t("Markera")}
                >
                  ✓
                </button>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-orange-400">
                    {translateText(item.source, language)}
                  </p>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(event) => onUpdate(item.id, { name: event.target.value })}
                    className="mt-2 w-full rounded-xl border border-zinc-800 bg-black px-3 py-2 text-base font-black text-white outline-none"
                    aria-label={t("Namn")}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => onRemove(item.id)}
                  className="min-h-10 min-w-10 touch-manipulation rounded-xl border border-red-500/40 bg-red-500/10 text-red-200"
                  aria-label={t("Ta bort")}
                >
                  <Trash2 className="mx-auto" size={20} />
                </button>
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_0.8fr]">
                <ToolNumber label="Antal" value={item.quantity} onChange={(quantity) => onUpdate(item.id, { quantity })} />

                <label className="block text-sm text-zinc-400">
                  {t("Enhet")}
                  <input
                    type="text"
                    value={item.unit}
                    onChange={(event) => onUpdate(item.id, { unit: event.target.value })}
                    className="mt-2 min-h-14 w-full rounded-xl border border-zinc-800 bg-black px-3 text-base font-bold text-white outline-none"
                  />
                </label>
              </div>

              <label className="mt-3 block text-sm text-zinc-400">
                {t("Notatka")}
                <textarea
                  value={item.note}
                  onChange={(event) => onUpdate(item.id, { note: event.target.value })}
                  className="mt-2 min-h-20 w-full resize-none rounded-xl border border-zinc-800 bg-black px-3 py-2 text-base text-white outline-none"
                />
              </label>
            </div>
          ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ToolDetail({ tool, values, unit, onUnitChange, onChange, onAddToShoppingList, onAddToProject, onAddToOffer, onBack }) {
  const { language, t } = useI18n();
  const results = useMemo(() => calculateTool(tool.id, values, unit), [tool.id, values, unit]);

  return (
    <div className="min-h-[100dvh] overflow-x-hidden bg-black p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] text-white">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onBack}
          className="relative z-10 touch-manipulation rounded-2xl border border-zinc-800 bg-zinc-900 p-3"
        >
          <ArrowLeft size={22} />
        </button>

        <div>
          <p className="text-sm font-bold uppercase text-orange-400">
            {translateText(tool.group, language)}
          </p>

          <h1 className="text-3xl font-black">
            {translateText(tool.title, language)}
          </h1>
        </div>
      </div>

      <div className="mt-6">
        <UnitToggle unit={unit} onChange={onUnitChange} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-2xl shadow-black/20">
          <ToolFields toolId={tool.id} values={values} unit={unit} onChange={onChange} />
          <ToolSketch toolId={tool.id} values={values} unit={unit} />
        </div>

        <div className="rounded-3xl border border-orange-400/30 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-5 shadow-2xl shadow-orange-500/10">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-orange-400">
            {t("Resultat")}
          </p>

          <div className="mt-4 grid gap-3">
            {results.map(([label, value]) => {
              const displayValue = label === "fastenerType" && typeof value === "string"
                ? value.split(" / ").map((item) => translateText(item, language)).join(" / ")
                : translateText(value, language);

              return (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs font-bold uppercase text-zinc-500">
                  {translateText(label, language)}
                </p>

                <p className="mt-1 text-2xl font-black text-white">
                  {displayValue}
                </p>
              </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={onAddToShoppingList}
            className="mt-5 flex min-h-14 w-full touch-manipulation items-center justify-center gap-2 rounded-2xl bg-orange-500 px-4 text-base font-black text-black transition active:scale-[0.98]"
          >
            <ShoppingCart size={20} />
            {t("Lägg till i inköpslista")}
          </button>
          <button
            type="button"
            onClick={onAddToProject}
            className="mt-3 flex min-h-14 w-full touch-manipulation items-center justify-center gap-2 rounded-2xl border border-orange-400/40 bg-orange-500/10 px-4 text-base font-black text-orange-200 transition active:scale-[0.98]"
          >
            <Ruler size={20} />
            {t("Lägg till i projekt")}
          </button>
          <button
            type="button"
            onClick={onAddToOffer}
            className="mt-3 flex min-h-14 w-full touch-manipulation items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-base font-black text-zinc-100 transition active:scale-[0.98]"
          >
            <FileDown size={20} />
            {t("Lägg till i offert")}
          </button>
        </div>
      </div>
    </div>
  );
}

function ToolSketch({ toolId, values, unit }) {
  const { language, t } = useI18n();

  if (toolId === "decklayout") {
    const result = calculateDeckLayout(values);

    return (
      <TechnicalSketchFrame
        t={t}
        meta={`${formatLength(result.outerWidth, "mm", unit)} x ${formatLength(result.outerLength, "mm", unit)}`}
        stats={[
          [formatNumber(result.frameLinearMeters), t("fris lm")],
          [formatNumber(result.mainLinearMeters), t("huvudfält lm")],
          [result.boardsToBuy, t("brädor")],
        ]}
      >
        <DeckTechnicalSvg result={result} values={values} unit={unit} t={t} />
      </TechnicalSketchFrame>
    );
  }

  if (toolId === "spacing") {
    const result = calculateSpacing(values);

    return (
      <TechnicalSketchFrame
        t={t}
        meta={formatLength(values.totalLength, "mm", unit)}
        stats={[
          [result.boards, t("brädor")],
          [formatLength(result.exactGap, "mm", unit), t("springa")],
          [formatLength(result.sideGap, "mm", unit), t("sida")],
        ]}
      >
        <SpacingTechnicalSvg result={result} values={values} unit={unit} t={t} />
      </TechnicalSketchFrame>
    );
  }

  if (toolId === "wallframe" || toolId === "studwall") {
    const wallValues = toolId === "studwall"
      ? { length: values.wallLength, height: values.wallHeight, cc: values.cc, openings: values.openings }
      : values;
    const ccMeters = Math.max(0.1, numberValue(wallValues.cc) / 1000);
    const studs = Math.floor(numberValue(wallValues.length) / ccMeters) + 1;

    return (
      <TechnicalSketchFrame
        t={t}
        meta={`${formatLength(wallValues.length, "m", unit)} x ${formatLength(wallValues.height, "m", unit)}`}
        stats={[
          [studs, translateText("Antal reglar", language)],
          [`cc ${formatNumber(wallValues.cc, 0)}`, "mm"],
          [formatLength(wallValues.height, "m", unit), translateText("Höjd", language)],
        ]}
      >
        <WallFrameTechnicalSvg values={wallValues} unit={unit} t={t} />
      </TechnicalSketchFrame>
    );
  }

  if (toolId === "stringer") {
    const totalRise = numberValue(values.rise) * numberValue(values.steps);
    const totalRun = numberValue(values.run) * Math.max(0, numberValue(values.steps) - 1);

    return (
      <TechnicalSketchFrame
        t={t}
        meta={`${formatLength(totalRun, "mm", unit)} x ${formatLength(totalRise, "mm", unit)}`}
        stats={[
          [formatLength(values.rise, "mm", unit), t("Steghöjd")],
          [formatLength(values.run, "mm", unit), t("Stegdjup")],
          [formatNumber(values.steps, 0), t("Antal delar")],
        ]}
      >
        <StringerTechnicalSvg values={values} unit={unit} t={t} />
      </TechnicalSketchFrame>
    );
  }

  if (toolId === "ramp" || toolId === "slope") {
    return (
      <TechnicalSketchFrame
        t={t}
        meta={`${formatLength(values.length, "cm", unit)} / ${formatLength(values.heightDifference, "cm", unit)}`}
        stats={[
          [formatLength(values.length, "cm", unit), translateText("Längd", language)],
          [formatLength(values.heightDifference, "cm", unit), translateText("Höjdskillnad", language)],
          [`${formatNumber((numberValue(values.heightDifference) / Math.max(1, numberValue(values.length))) * 100)} %`, t("Lutning")],
        ]}
      >
        <RampTechnicalSvg values={values} unit={unit} t={t} />
      </TechnicalSketchFrame>
    );
  }

  if (toolId === "rafter") {
    return (
      <TechnicalSketchFrame
        t={t}
        meta={`${formatLength(values.span, "m", unit)} / ${formatLength(values.rise, "m", unit)}`}
        stats={[
          [formatLength(values.span, "m", unit), t("Spännvidd")],
          [formatLength(values.rise, "m", unit), translateText("Höjd", language)],
          [`${formatNumber(Math.atan2(numberValue(values.rise), Math.max(0.01, numberValue(values.span))) * (180 / Math.PI))}°`, translateText("Vinkel", language)],
        ]}
      >
        <RafterTechnicalSvg values={values} unit={unit} t={t} />
      </TechnicalSketchFrame>
    );
  }

  if (toolId === "runningmeasure") {
    const modules = Math.max(1, numberValue(values.modules));
    const moduleWidth = numberValue(values.totalLength) / modules;

    return (
      <TechnicalSketchFrame
        t={t}
        meta={formatLength(values.totalLength, "mm", unit)}
        stats={[
          [formatLength(moduleWidth, "mm", unit), t("Modulbredd")],
          [formatNumber(values.modules, 0), t("Antal delar")],
          [formatLength(values.totalLength, "mm", unit), translateText("Total längd", language)],
        ]}
      >
        <RunningMeasureTechnicalSvg values={values} unit={unit} t={t} />
      </TechnicalSketchFrame>
    );
  }

  if (["panel", "decking", "flooring", "parquetlayout"].includes(toolId)) {
    return (
      <TechnicalSketchFrame
        t={t}
        meta={toolId === "parquetlayout" ? t("Parkettläggning") : t("Paneltyp")}
        stats={[
          [formatLength(values.boardWidth || values.coverWidth || 120, "mm", unit), t("Brädbredd")],
          [formatLength(values.length || values.wallLength || 4, "m", unit), translateText("Längd", language)],
          [formatLength(values.width || values.wallHeight || 3, "m", unit), translateText("Bredd", language)],
        ]}
      >
        <PanelTechnicalSvg toolId={toolId} values={values} unit={unit} t={t} />
      </TechnicalSketchFrame>
    );
  }

  if (toolId === "decklayout") {
    const result = calculateDeckLayout(values);
    const mainBoards = Array.from({ length: Math.min(result.mainBoards, 18) });

    return (
      <div className="mt-5 rounded-3xl border border-orange-400/20 bg-black/50 p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-orange-400">
            {t("Ritning 2D")}
          </p>
          <p className="text-xs text-zinc-500">
            {formatLength(result.outerWidth, "mm", unit)} × {formatLength(result.outerLength, "mm", unit)}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-3">
          <div className="relative mx-auto aspect-[4/3] max-h-80 overflow-hidden rounded-2xl border border-orange-400/30 bg-black p-4">
            {values.useFrame && (
              <>
                <div className="absolute inset-3 rounded-xl border-[10px] border-orange-500/90" />
                <div className="absolute inset-8 rounded-lg border border-orange-300/50" />
              </>
            )}
            <div className={`absolute inset-12 flex ${values.direction === "width" ? "flex-col" : "flex-row"} gap-1 overflow-hidden rounded-lg bg-zinc-950/80 p-2`}>
              {mainBoards.map((_, index) => (
                <div
                  key={index}
                  className="min-h-2 min-w-2 flex-1 rounded bg-orange-300/80"
                />
              ))}
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs text-zinc-500">
            <div>
              <span className="block font-black text-white">{formatNumber(result.frameLinearMeters)}</span>
              {t("fris lm")}
            </div>
            <div>
              <span className="block font-black text-white">{formatNumber(result.mainLinearMeters)}</span>
              {t("huvudfält lm")}
            </div>
            <div>
              <span className="block font-black text-white">{result.boardsToBuy}</span>
              {t("brädor")}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (toolId === "spacing") {
    const result = calculateSpacing(values);
    const boards = Array.from({ length: Math.min(result.boards, 18) });

    return (
      <div className="mt-5 rounded-3xl border border-orange-400/20 bg-black/50 p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-orange-400">
            {t("Ritning 2D")}
          </p>
          <p className="text-xs text-zinc-500">
            {formatLength(values.totalLength, "mm", unit)}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-3">
          <div className="flex h-24 items-stretch gap-1 overflow-hidden rounded-xl bg-black p-2">
            {boards.map((_, index) => (
              <div
                key={index}
                className="min-w-2 flex-1 rounded-md border border-orange-400/30 bg-orange-500/80 shadow-lg shadow-orange-500/10"
                title={`${translateText("Bräda", language)} ${index + 1}`}
              />
            ))}
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs text-zinc-500">
            <div>
              <span className="block font-black text-white">{result.boards}</span>
              {t("brädor")}
            </div>
            <div>
              <span className="block font-black text-white">{formatLength(result.exactGap, "mm", unit)}</span>
              {t("springa")}
            </div>
            <div>
              <span className="block font-black text-white">{formatLength(result.sideGap, "mm", unit)}</span>
              {t("sida")}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-5 rounded-3xl border border-white/10 bg-black/40 p-4">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-orange-400">
        {t("Ritning 2D")}
      </p>
      <div className="mt-3 flex h-28 items-center justify-center rounded-2xl border border-dashed border-zinc-700 bg-zinc-950 text-sm font-bold text-zinc-500">
        {t("Modul för PDF/3D är förberedd")}
      </div>
    </div>
  );
}

function TechnicalSketchFrame({ children, meta, stats, t }) {
  return (
    <div className="mt-5 rounded-3xl border border-orange-400/20 bg-black/50 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-orange-400">
          {t("Ritning 2D")}
        </p>
        <p className="max-w-[55%] truncate text-right text-xs text-zinc-500">
          {meta}
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-3">
        <div className="overflow-hidden rounded-2xl border border-orange-400/20 bg-[#050505] shadow-inner shadow-black">
          {children}
        </div>
        {stats?.length > 0 && (
          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs text-zinc-500">
            {stats.map(([value, label]) => (
              <div key={`${value}-${label}`} className="min-w-0">
                <span className="block truncate font-black text-white">{value}</span>
                <span className="block truncate">{label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SketchDefs() {
  return (
    <defs>
      <linearGradient id="boardGradient" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stopColor="#fed7aa" stopOpacity="0.98" />
        <stop offset="52%" stopColor="#fb923c" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#9a3412" stopOpacity="0.9" />
      </linearGradient>
      <linearGradient id="steelGradient" x1="0" x2="1">
        <stop offset="0%" stopColor="#d4d4d8" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#71717a" stopOpacity="0.86" />
      </linearGradient>
      <pattern id="woodPattern" width="22" height="10" patternUnits="userSpaceOnUse">
        <path d="M1 5 C7 1, 13 9, 21 4" fill="none" stroke="#7c2d12" strokeOpacity="0.2" strokeWidth="0.7" />
      </pattern>
      <marker id="arrowEnd" markerHeight="6" markerWidth="6" orient="auto" refX="5" refY="3">
        <path d="M0 0 L6 3 L0 6 Z" fill="#fbbf24" />
      </marker>
      <marker id="arrowStart" markerHeight="6" markerWidth="6" orient="auto" refX="1" refY="3">
        <path d="M6 0 L0 3 L6 6 Z" fill="#fbbf24" />
      </marker>
      <filter id="orangeGlow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#f97316" floodOpacity="0.28" />
      </filter>
    </defs>
  );
}

function DimensionLine({ x1, y1, x2, y2, label, labelX, labelY }) {
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fbbf24" strokeWidth="1" markerStart="url(#arrowStart)" markerEnd="url(#arrowEnd)" />
      {label && (
        <text x={labelX ?? (x1 + x2) / 2} y={labelY ?? (y1 + y2) / 2 - 5} fill="#fde68a" fontSize="10" fontWeight="800" textAnchor="middle">
          {label}
        </text>
      )}
    </g>
  );
}

function DeckTechnicalSvg({ result, values, unit, t }) {
  const ratio = Math.max(0.58, Math.min(1.65, result.outerLength / Math.max(1, result.outerWidth)));
  const deckWidth = ratio > 1 ? 188 / ratio : 188;
  const deckHeight = ratio > 1 ? 188 : 188 * ratio;
  const x = 86 + (188 - deckWidth) / 2;
  const y = 22 + (188 - deckHeight) / 2;
  const overhang = Math.max(4, Math.min(11, result.overhang / 3));
  const frameScale = deckWidth / Math.max(1, result.outerWidth);
  const frame = values.useFrame ? Math.max(8, Math.min(22, result.frameWidth * frameScale)) : 5;
  const innerX = x + frame;
  const innerY = y + frame;
  const innerWidth = Math.max(24, deckWidth - frame * 2);
  const innerHeight = Math.max(24, deckHeight - frame * 2);
  const boardCount = Math.max(4, Math.min(24, result.mainBoards || 8));
  const gap = Math.max(1.2, Math.min(3.4, numberValue(values.gap) / 2));
  const boardsAcrossWidth = values.direction !== "width";
  const joistCount = Math.max(2, Math.min(18, result.joistCount || 2));
  const breakerCenters = result.breakerCenters || [];
  const breakerWidthSvg = Math.max(4, Math.min(10, (result.breakerWidth || numberValue(values.breakerWidth) || 145) * (boardsAcrossWidth ? innerHeight / Math.max(1, result.runLength) : innerWidth / Math.max(1, result.runLength))));
  const directionLabel = values.direction === "width" ? "→" : "↓";

  return (
    <svg className="block h-auto w-full" viewBox="0 0 360 230" role="img" aria-label={t("Ritning 2D")}>
      <SketchDefs />
      <rect width="360" height="230" fill="#050505" />
      <rect x={x - overhang} y={y - overhang} width={deckWidth + overhang * 2} height={deckHeight + overhang * 2} rx="5" fill="#111113" stroke="#3f3f46" strokeWidth="1" strokeDasharray="4 4" />
      <rect x={x} y={y} width={deckWidth} height={deckHeight} rx="4" fill="#09090b" stroke="#f97316" strokeOpacity="0.74" strokeWidth="1.2" filter="url(#orangeGlow)" />
      <g opacity="0.72">
        {Array.from({ length: joistCount }).map((_, index) => {
          const ratioIndex = joistCount === 1 ? 0 : index / (joistCount - 1);
          const joistX = boardsAcrossWidth ? innerX : innerX + ratioIndex * innerWidth;
          const joistY = boardsAcrossWidth ? innerY + ratioIndex * innerHeight : innerY;

          return boardsAcrossWidth
            ? <line key={index} x1={innerX - 2} y1={joistY} x2={innerX + innerWidth + 2} y2={joistY} stroke="#52525b" strokeWidth="0.8" />
            : <line key={index} x1={joistX} y1={innerY - 2} x2={joistX} y2={innerY + innerHeight + 2} stroke="#52525b" strokeWidth="0.8" />;
        })}
      </g>
      {values.useFrame && (
        <g>
          <rect x={x + frame / 2} y={y + frame / 2} width={deckWidth - frame} height={deckHeight - frame} rx="3" fill="none" stroke="url(#boardGradient)" strokeWidth={frame} />
          <line x1={x + frame} y1={y + frame} x2={x + deckWidth - frame} y2={y + frame} stroke="#fed7aa" strokeOpacity="0.3" strokeWidth="0.7" />
          <line x1={x + frame} y1={y + deckHeight - frame} x2={x + deckWidth - frame} y2={y + deckHeight - frame} stroke="#fed7aa" strokeOpacity="0.3" strokeWidth="0.7" />
          <line x1={x + frame} y1={y + frame} x2={x + frame} y2={y + deckHeight - frame} stroke="#fed7aa" strokeOpacity="0.3" strokeWidth="0.7" />
          <line x1={x + deckWidth - frame} y1={y + frame} x2={x + deckWidth - frame} y2={y + deckHeight - frame} stroke="#fed7aa" strokeOpacity="0.3" strokeWidth="0.7" />
        </g>
      )}
      <clipPath id="deckInnerClip">
        <rect x={innerX} y={innerY} width={innerWidth} height={innerHeight} rx="2" />
      </clipPath>
      <g clipPath="url(#deckInnerClip)">
        {Array.from({ length: boardCount }).map((_, index) => {
          const acrossWidth = values.direction === "width";
          const boardWidth = acrossWidth ? innerWidth : (innerWidth - gap * (boardCount - 1)) / boardCount;
          const boardHeight = acrossWidth ? (innerHeight - gap * (boardCount - 1)) / boardCount : innerHeight;
          const boardX = acrossWidth ? innerX : innerX + index * (boardWidth + gap);
          const boardY = acrossWidth ? innerY + index * (boardHeight + gap) : innerY;

          return (
            <g key={index}>
              <rect x={boardX} y={boardY} width={boardWidth} height={boardHeight} rx="1.8" fill="url(#boardGradient)" stroke="#7c2d12" strokeOpacity="0.42" strokeWidth="0.7" />
              <rect x={boardX} y={boardY} width={boardWidth} height={boardHeight} fill="url(#woodPattern)" opacity="0.9" />
            </g>
          );
        })}
        {breakerCenters.map((center, index) => {
          const position = center / Math.max(1, result.runLength);
          const breakerX = boardsAcrossWidth ? innerX : innerX + innerWidth * position - breakerWidthSvg / 2;
          const breakerY = boardsAcrossWidth ? innerY + innerHeight * position - breakerWidthSvg / 2 : innerY;
          const width = boardsAcrossWidth ? innerWidth : breakerWidthSvg;
          const height = boardsAcrossWidth ? breakerWidthSvg : innerHeight;

          return (
            <g key={center}>
              <rect x={breakerX} y={breakerY} width={width} height={height} fill="#451a03" stroke="#fde68a" strokeOpacity="0.8" strokeWidth="0.8" />
              <line x1={breakerX} y1={breakerY} x2={breakerX + width} y2={breakerY + height} stroke="#fed7aa" strokeOpacity="0.28" strokeWidth="0.7" />
              <text x={breakerX + width / 2} y={breakerY + height / 2 + 3} fill="#fde68a" fontSize="8" fontWeight="900" textAnchor="middle">
                {index + 1}
              </text>
            </g>
          );
        })}
      </g>
      {breakerCenters.length > 0 && (
        <text x={innerX + innerWidth - 4} y={innerY + 13} fill="#fde68a" fontSize="8" fontWeight="900" textAnchor="end">
          {t("brytbräda")}
        </text>
      )}
      <text x={innerX + innerWidth / 2} y={innerY + innerHeight / 2} fill="#fff7ed" fontSize="10" fontWeight="900" textAnchor="middle">{`${t("huvudfält lm")} ${directionLabel}`}</text>
      <text x={x + deckWidth - 8} y={y + 15} fill="#111827" fontSize="8" fontWeight="900" textAnchor="end">{t("fris lm")}</text>
      <text x={innerX + 4} y={innerY + innerHeight - 7} fill="#e4e4e7" fontSize="8" fontWeight="800">{`cc ${formatNumber(result.joistCc, 0)} mm`}</text>
      <DimensionLine x1={x} y1={y + deckHeight + 20} x2={x + deckWidth} y2={y + deckHeight + 20} label={formatLength(result.outerWidth, "mm", unit)} />
      <DimensionLine x1={x - 22} y1={y} x2={x - 22} y2={y + deckHeight} label={formatLength(result.outerLength, "mm", unit)} labelX={x - 40} />
    </svg>
  );
}

function SpacingTechnicalSvg({ result, values, unit, t }) {
  const total = Math.max(1, numberValue(values.totalLength));
  const material = Math.max(1, numberValue(values.materialWidth));
  const count = Math.max(1, Math.min(result.boards, 30));
  const start = 38;
  const y = 72;
  const width = 284;
  const scale = width / total;
  const boardWidth = Math.max(5, material * scale);
  const exactGap = Math.max(1, result.exactGap * scale);

  return (
    <svg className="block h-auto w-full" viewBox="0 0 360 190" role="img" aria-label={t("Ritning 2D")}>
      <SketchDefs />
      <rect width="360" height="190" fill="#050505" />
      <rect x="28" y="56" width="304" height="66" rx="6" fill="#09090b" stroke="#27272a" />
      {Array.from({ length: count }).map((_, index) => {
        const boardX = start + (values.startGap ? exactGap : 0) + index * (boardWidth + exactGap);
        const visibleWidth = Math.min(boardWidth, start + width - boardX);

        if (visibleWidth <= 0) return null;

        return (
          <g key={index}>
            <rect x={boardX} y={y} width={visibleWidth} height="34" rx="2" fill="url(#boardGradient)" stroke="#f97316" strokeOpacity="0.42" strokeWidth="0.7" />
            <line x1={boardX + visibleWidth + exactGap / 2} y1="61" x2={boardX + visibleWidth + exactGap / 2} y2="121" stroke="#fbbf24" strokeOpacity="0.28" strokeWidth="0.8" />
          </g>
        );
      })}
      <DimensionLine x1={start} y1="143" x2={start + width} y2="143" label={formatLength(values.totalLength, "mm", unit)} />
      <text x="180" y="38" fill="#e4e4e7" fontSize="11" fontWeight="900" textAnchor="middle">{`${t("springa")}: ${formatLength(result.exactGap, "mm", unit)}`}</text>
      <text x="54" y="137" fill="#a1a1aa" fontSize="9">{t("sida")}</text>
      <text x="306" y="137" fill="#a1a1aa" fontSize="9" textAnchor="end">{t("sida")}</text>
    </svg>
  );
}

function WallFrameTechnicalSvg({ values, unit, t }) {
  const wallLength = Math.max(0.2, numberValue(values.length));
  const wallHeight = Math.max(0.2, numberValue(values.height));
  const ccMeters = Math.max(0.2, numberValue(values.cc) / 1000);
  const studCount = Math.max(2, Math.min(28, Math.floor(wallLength / ccMeters) + 1));
  const x = 44;
  const y = 34;
  const width = 272;
  const height = Math.max(72, Math.min(140, width * (wallHeight / Math.max(wallLength, 1))));
  const rail = 10;

  return (
    <svg className="block h-auto w-full" viewBox="0 0 360 220" role="img" aria-label={t("Ritning 2D")}>
      <SketchDefs />
      <rect width="360" height="220" fill="#050505" />
      <rect x={x} y={y} width={width} height={height} rx="3" fill="#09090b" stroke="#3f3f46" strokeWidth="1" />
      <rect x={x} y={y} width={width} height={rail} fill="url(#steelGradient)" opacity="0.86" />
      <rect x={x} y={y + height - rail} width={width} height={rail} fill="url(#steelGradient)" opacity="0.86" />
      {Array.from({ length: studCount }).map((_, index) => {
        const studX = x + (index / (studCount - 1)) * (width - 8);
        return <rect key={index} x={studX} y={y + rail} width="8" height={height - rail * 2} rx="1.5" fill="url(#steelGradient)" stroke="#e4e4e7" strokeOpacity="0.22" strokeWidth="0.6" />;
      })}
      {numberValue(values.openings) > 0 && (
        <g>
          <rect x={x + width * 0.55} y={y + height * 0.35} width={width * 0.18} height={height * 0.45} fill="#050505" stroke="#fbbf24" strokeWidth="1" strokeDasharray="4 4" />
          <rect x={x + width * 0.55 - 8} y={y + height * 0.31} width={width * 0.18 + 16} height="7" fill="#d4d4d8" opacity="0.8" />
        </g>
      )}
      <DimensionLine x1={x} y1={y + height + 23} x2={x + width} y2={y + height + 23} label={formatLength(wallLength, "m", unit)} />
      <DimensionLine x1={x - 22} y1={y} x2={x - 22} y2={y + height} label={formatLength(wallHeight, "m", unit)} labelX={x - 39} />
      <text x={x + width / 2} y={y - 12} fill="#fde68a" fontSize="10" fontWeight="900" textAnchor="middle">{`cc ${formatNumber(values.cc, 0)} mm`}</text>
      <text x={x + 8} y={y + height - 16} fill="#a1a1aa" fontSize="9">{t("Regeldimension")}</text>
    </svg>
  );
}

function StringerTechnicalSvg({ values, unit, t }) {
  const steps = Math.max(2, Math.min(10, Math.round(numberValue(values.steps))));
  const run = 220 / Math.max(1, steps - 1);
  const rise = 118 / steps;
  const baseX = 60;
  const baseY = 168;
  const points = Array.from({ length: steps }).flatMap((_, index) => {
    const x = baseX + index * run;
    const y = baseY - (index + 1) * rise;
    return `${x},${baseY - index * rise} ${x},${y} ${x + run},${y}`;
  }).join(" ");

  return (
    <svg className="block h-auto w-full" viewBox="0 0 360 220" role="img" aria-label={t("Ritning 2D")}>
      <SketchDefs />
      <rect width="360" height="220" fill="#050505" />
      <polyline points={points} fill="none" stroke="#fb923c" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" filter="url(#orangeGlow)" />
      <path d={`M${baseX - 10} ${baseY + 14} L${baseX + run * steps + 8} ${baseY - rise * steps + 5} L${baseX + run * steps - 4} ${baseY - rise * steps + 22} L${baseX + 4} ${baseY + 34} Z`} fill="#7c2d12" opacity="0.55" stroke="#fed7aa" strokeOpacity="0.35" />
      <DimensionLine x1={baseX} y1={baseY + 40} x2={baseX + run * (steps - 1)} y2={baseY + 40} label={formatLength(numberValue(values.run) * (steps - 1), "mm", unit)} />
      <DimensionLine x1={baseX + run * steps + 22} y1={baseY} x2={baseX + run * steps + 22} y2={baseY - rise * steps} label={formatLength(numberValue(values.rise) * steps, "mm", unit)} labelX={baseX + run * steps + 43} />
      <text x="88" y="58" fill="#fde68a" fontSize="10" fontWeight="900">{`${t("Steghöjd")} ${formatLength(values.rise, "mm", unit)}`}</text>
      <text x="88" y="74" fill="#fde68a" fontSize="10" fontWeight="900">{`${t("Stegdjup")} ${formatLength(values.run, "mm", unit)}`}</text>
    </svg>
  );
}

function RampTechnicalSvg({ values, unit, t }) {
  const x = 55;
  const y = 166;
  const width = 240;
  const height = Math.max(22, Math.min(125, (numberValue(values.heightDifference) / Math.max(1, numberValue(values.length))) * 190));

  return (
    <svg className="block h-auto w-full" viewBox="0 0 360 210" role="img" aria-label={t("Ritning 2D")}>
      <SketchDefs />
      <rect width="360" height="210" fill="#050505" />
      <path d={`M${x} ${y} L${x + width} ${y} L${x + width} ${y - height} Z`} fill="#18181b" stroke="#3f3f46" strokeWidth="1" />
      <line x1={x} y1={y} x2={x + width} y2={y - height} stroke="#fb923c" strokeWidth="2" filter="url(#orangeGlow)" />
      <line x1={x} y1={y} x2={x + width} y2={y} stroke="#71717a" strokeWidth="1" />
      <DimensionLine x1={x} y1={y + 24} x2={x + width} y2={y + 24} label={formatLength(values.length, "cm", unit)} />
      <DimensionLine x1={x + width + 22} y1={y} x2={x + width + 22} y2={y - height} label={formatLength(values.heightDifference, "cm", unit)} labelX={x + width + 42} />
      <text x={x + width * 0.55} y={y - height / 2 - 8} fill="#fde68a" fontSize="11" fontWeight="900" textAnchor="middle">{`${t("Lutning")} ${formatNumber((numberValue(values.heightDifference) / Math.max(1, numberValue(values.length))) * 100)} %`}</text>
    </svg>
  );
}

function RafterTechnicalSvg({ values, unit, t }) {
  const x = 54;
  const y = 158;
  const width = 244;
  const height = Math.max(32, Math.min(120, (numberValue(values.rise) / Math.max(0.1, numberValue(values.span))) * 180));

  return (
    <svg className="block h-auto w-full" viewBox="0 0 360 210" role="img" aria-label={t("Ritning 2D")}>
      <SketchDefs />
      <rect width="360" height="210" fill="#050505" />
      <path d={`M${x} ${y} L${x + width / 2} ${y - height} L${x + width} ${y}`} fill="none" stroke="#fb923c" strokeWidth="2" strokeLinejoin="round" filter="url(#orangeGlow)" />
      <path d={`M${x + 20} ${y} L${x + width / 2} ${y - height + 10} L${x + width - 20} ${y}`} fill="none" stroke="#fed7aa" strokeOpacity="0.35" strokeWidth="1" />
      <line x1={x} y1={y} x2={x + width} y2={y} stroke="#71717a" strokeWidth="1" />
      <DimensionLine x1={x} y1={y + 26} x2={x + width} y2={y + 26} label={formatLength(values.span, "m", unit)} />
      <DimensionLine x1={x + width / 2 + 20} y1={y} x2={x + width / 2 + 20} y2={y - height} label={formatLength(values.rise, "m", unit)} labelX={x + width / 2 + 42} />
      <text x={x + width / 2} y={y - height - 10} fill="#fde68a" fontSize="10" fontWeight="900" textAnchor="middle">{t("Taksparre")}</text>
    </svg>
  );
}

function RunningMeasureTechnicalSvg({ values, unit, t }) {
  const modules = Math.max(1, Math.min(18, Math.round(numberValue(values.modules))));
  const x = 34;
  const y = 86;
  const width = 292;
  const moduleWidth = width / modules;

  return (
    <svg className="block h-auto w-full" viewBox="0 0 360 190" role="img" aria-label={t("Ritning 2D")}>
      <SketchDefs />
      <rect width="360" height="190" fill="#050505" />
      <rect x={x} y={y} width={width} height="34" rx="4" fill="#09090b" stroke="#3f3f46" />
      {Array.from({ length: modules + 1 }).map((_, index) => {
        const lineX = x + index * moduleWidth;
        return <line key={index} x1={lineX} y1={y - 16} x2={lineX} y2={y + 50} stroke={index === 0 || index === modules ? "#fb923c" : "#fbbf24"} strokeOpacity={index === 0 || index === modules ? 0.9 : 0.45} strokeWidth={index === 0 || index === modules ? 1.4 : 0.8} />;
      })}
      <DimensionLine x1={x} y1={y + 72} x2={x + width} y2={y + 72} label={formatLength(values.totalLength, "mm", unit)} />
      <text x="180" y="56" fill="#fde68a" fontSize="10" fontWeight="900" textAnchor="middle">{`${t("Modulbredd")} ${formatLength(numberValue(values.totalLength) / modules, "mm", unit)}`}</text>
    </svg>
  );
}

function PanelTechnicalSvg({ toolId, values, unit, t }) {
  const x = 42;
  const y = 34;
  const width = 276;
  const height = 142;
  const count = Math.max(4, Math.min(18, Math.ceil(width / Math.max(16, numberValue(values.boardWidth || values.coverWidth || 120) / 4))));
  const isParquet = toolId === "parquetlayout";

  return (
    <svg className="block h-auto w-full" viewBox="0 0 360 220" role="img" aria-label={t("Ritning 2D")}>
      <SketchDefs />
      <rect width="360" height="220" fill="#050505" />
      <rect x={x} y={y} width={width} height={height} rx="4" fill="#09090b" stroke="#3f3f46" strokeWidth="1" />
      <clipPath id="panelClip">
        <rect x={x + 5} y={y + 5} width={width - 10} height={height - 10} rx="3" />
      </clipPath>
      <g clipPath="url(#panelClip)">
        {Array.from({ length: count }).map((_, index) => {
          if (isParquet) {
            const rowHeight = 18;
            const rowY = y + 8 + index * rowHeight;
            return (
              <g key={index} transform={`translate(${x + 12}, ${rowY})`}>
                <rect x={(index % 2) * 24} y="0" width="72" height="14" rx="1.5" fill="url(#boardGradient)" stroke="#7c2d12" strokeOpacity="0.35" strokeWidth="0.6" />
                <rect x={(index % 2) * 24 + 74} y="0" width="72" height="14" rx="1.5" fill="url(#boardGradient)" stroke="#7c2d12" strokeOpacity="0.35" strokeWidth="0.6" />
                <rect x={(index % 2) * 24 + 148} y="0" width="72" height="14" rx="1.5" fill="url(#boardGradient)" stroke="#7c2d12" strokeOpacity="0.35" strokeWidth="0.6" />
              </g>
            );
          }

          const panelX = x + 8 + index * ((width - 16) / count);
          return <rect key={index} x={panelX} y={y + 8} width={(width - 18) / count - 2} height={height - 16} rx="1.8" fill="url(#boardGradient)" stroke="#7c2d12" strokeOpacity="0.35" strokeWidth="0.6" />;
        })}
      </g>
      <DimensionLine x1={x} y1={y + height + 22} x2={x + width} y2={y + height + 22} label={formatLength(values.length || values.wallLength || 4, "m", unit)} />
      <DimensionLine x1={x - 22} y1={y} x2={x - 22} y2={y + height} label={formatLength(values.width || values.wallHeight || 3, "m", unit)} labelX={x - 38} />
      <text x={x + width / 2} y={y - 12} fill="#fde68a" fontSize="10" fontWeight="900" textAnchor="middle">{isParquet ? t("Parkettläggning") : t("Paneltyp")}</text>
    </svg>
  );
}

function ToolFields({ toolId, values, unit, onChange }) {
  const { language } = useI18n();

  if (toolId === "area") {
    return (
      <div className="grid gap-4">
        <ToolSelect label="Typ" value={values.shape} onChange={(shape) => onChange({ shape })} options={["rectangle", "triangle", "circle"]} optionLabels={["Area rektangel", "Area triangel", "Area cirkel"]} />
        {values.shape === "rectangle" && (
          <ToolGrid>
            <ToolLength label="Längd" value={values.length} baseUnit="m" unit={unit} onChange={(length) => onChange({ length })} />
            <ToolLength label="Bredd" value={values.width} baseUnit="m" unit={unit} onChange={(width) => onChange({ width })} />
          </ToolGrid>
        )}
        {values.shape === "triangle" && (
          <ToolGrid>
            <ToolLength label="Bas" value={values.base} baseUnit="m" unit={unit} onChange={(base) => onChange({ base })} />
            <ToolLength label="Höjd" value={values.height} baseUnit="m" unit={unit} onChange={(height) => onChange({ height })} />
          </ToolGrid>
        )}
        {values.shape === "circle" && (
          <ToolLength label="Radie" value={values.radius} baseUnit="m" unit={unit} onChange={(radius) => onChange({ radius })} />
        )}
      </div>
    );
  }

  if (toolId === "spacing") {
    return (
      <div className="grid gap-4">
        <ToolLength label="Total längd" value={values.totalLength} baseUnit="mm" unit={unit} onChange={(totalLength) => onChange({ totalLength })} />
        <ToolLength label="Bredd på material" value={values.materialWidth} baseUnit="mm" unit={unit} onChange={(materialWidth) => onChange({ materialWidth })} />
        <ToolLength label="Önskad springa" value={values.desiredGap} baseUnit="mm" unit={unit} onChange={(desiredGap) => onChange({ desiredGap })} />
        <ToolCheckbox label="Start med springa" checked={values.startGap} onChange={(startGap) => onChange({ startGap })} />
        <ToolCheckbox label="Slut med springa" checked={values.endGap} onChange={(endGap) => onChange({ endGap })} />
      </div>
    );
  }

  if (toolId === "diagonal") {
    return (
      <ToolGrid>
        <ToolLength label="Längd" value={values.length} baseUnit="m" unit={unit} onChange={(length) => onChange({ length })} />
        <ToolLength label="Bredd" value={values.width} baseUnit="m" unit={unit} onChange={(width) => onChange({ width })} />
        <ToolLength label="Uppmätt diagonal" value={values.measuredDiagonal} baseUnit="m" unit={unit} onChange={(measuredDiagonal) => onChange({ measuredDiagonal })} />
      </ToolGrid>
    );
  }

  if (toolId === "slope") {
    return (
      <ToolGrid>
        <ToolLength label="Höjdskillnad" value={values.heightDifference} baseUnit="cm" unit={unit} onChange={(heightDifference) => onChange({ heightDifference })} />
        <ToolLength label="Längd" value={values.length} baseUnit="cm" unit={unit} onChange={(length) => onChange({ length })} />
      </ToolGrid>
    );
  }

  if (toolId === "stringer") {
    return (
      <ToolGrid>
        <ToolLength label="Steghöjd" value={values.rise} baseUnit="mm" unit={unit} onChange={(rise) => onChange({ rise })} />
        <ToolLength label="Stegdjup" value={values.run} baseUnit="mm" unit={unit} onChange={(run) => onChange({ run })} />
        <ToolNumber label="Antal steg" value={values.steps} onChange={(steps) => onChange({ steps })} step={1} />
      </ToolGrid>
    );
  }

  if (toolId === "wallframe") {
    return (
      <ToolGrid>
        <ToolLength label="Längd" value={values.length} baseUnit="m" unit={unit} onChange={(length) => onChange({ length })} />
        <ToolLength label="Höjd" value={values.height} baseUnit="m" unit={unit} onChange={(height) => onChange({ height })} />
        <ToolLength label="CC mått" value={values.cc} baseUnit="mm" unit={unit} onChange={(cc) => onChange({ cc })} />
      </ToolGrid>
    );
  }

  if (toolId === "ramp") {
    return (
      <ToolGrid>
        <ToolLength label="Höjdskillnad" value={values.heightDifference} baseUnit="cm" unit={unit} onChange={(heightDifference) => onChange({ heightDifference })} />
        <ToolLength label="Längd" value={values.length} baseUnit="cm" unit={unit} onChange={(length) => onChange({ length })} />
      </ToolGrid>
    );
  }

  if (toolId === "cornerangle") {
    return (
      <ToolGrid>
        <ToolLength label="Längd" value={values.length} baseUnit="m" unit={unit} onChange={(length) => onChange({ length })} />
        <ToolLength label="Bredd" value={values.width} baseUnit="m" unit={unit} onChange={(width) => onChange({ width })} />
        <ToolLength label="Uppmätt diagonal" value={values.diagonal} baseUnit="m" unit={unit} onChange={(diagonal) => onChange({ diagonal })} />
      </ToolGrid>
    );
  }

  if (toolId === "miter") {
    return <ToolNumber label="Hörnvinkel" value={values.angle} onChange={(angle) => onChange({ angle })} step={0.5} />;
  }

  if (toolId === "runningmeasure") {
    return (
      <ToolGrid>
        <ToolLength label="Total längd" value={values.totalLength} baseUnit="mm" unit={unit} onChange={(totalLength) => onChange({ totalLength })} />
        <ToolNumber label="Antal delar" value={values.modules} onChange={(modules) => onChange({ modules })} step={1} />
      </ToolGrid>
    );
  }

  if (toolId === "rafter") {
    return (
      <ToolGrid>
        <ToolLength label="Spännvidd" value={values.span} baseUnit="m" unit={unit} onChange={(span) => onChange({ span })} />
        <ToolLength label="Höjd" value={values.rise} baseUnit="m" unit={unit} onChange={(rise) => onChange({ rise })} />
      </ToolGrid>
    );
  }

  if (toolId === "decklayout") {
    const selectedLengths = Array.isArray(values.availableLengths) && values.availableLengths.length > 0
      ? values.availableLengths
      : defaultValues.decklayout.availableLengths;
    const normalizedSelectedLengths = selectedLengths.map((item) => Number(item).toFixed(1));
    const toggleLength = (length) => {
      const key = Number(length).toFixed(1);
      const nextLengths = normalizedSelectedLengths.includes(key)
        ? normalizedSelectedLengths.filter((item) => item !== key)
        : [...normalizedSelectedLengths, key].sort((a, b) => Number(a) - Number(b));

      onChange({ availableLengths: nextLengths.length > 0 ? nextLengths : [key] });
    };

    return (
      <div className="grid gap-4">
        <ToolGrid>
          <ToolLength label="Längd altan" value={values.totalLength} baseUnit="mm" unit={unit} onChange={(totalLength) => onChange({ totalLength })} />
          <ToolLength label="Bredd altan" value={values.totalWidth} baseUnit="mm" unit={unit} onChange={(totalWidth) => onChange({ totalWidth })} />
          <ToolLength label="Trallbredd" value={values.boardWidth} baseUnit="mm" unit={unit} onChange={(boardWidth) => onChange({ boardWidth })} />
          <ToolLength label="Tralltjocklek" value={values.boardThickness} baseUnit="mm" unit={unit} onChange={(boardThickness) => onChange({ boardThickness })} />
          <ToolLength label="Springa mellan trall" value={values.gap} baseUnit="mm" unit={unit} onChange={(gap) => onChange({ gap })} />
          <ToolLength label="Regel cc" value={values.joistCc} baseUnit="mm" unit={unit} onChange={(joistCc) => onChange({ joistCc })} />
        </ToolGrid>
        <ToolCheckbox label="Fris / flis aktiv" checked={values.useFrame} onChange={(useFrame) => onChange({ useFrame })} />
        {values.useFrame && (
          <ToolGrid>
            <ToolLength label="Fris / flis bredd" value={values.frameWidth} baseUnit="mm" unit={unit} onChange={(frameWidth) => onChange({ frameWidth })} />
            <ToolLength label="Utstick / overhang" value={values.overhang} baseUnit="mm" unit={unit} onChange={(overhang) => onChange({ overhang })} />
          </ToolGrid>
        )}
        <ToolGrid>
          <ToolSelect label="Riktning på trall" value={values.direction} onChange={(direction) => onChange({ direction })} options={["length", "width"]} optionLabels={["Längs med altan", "Tvärs över altan"]} />
          <ToolSelect label="Brytbräda aktiv" value={values.breakerMode || "off"} onChange={(breakerMode) => onChange({ breakerMode })} options={["auto", "manual", "off"]} optionLabels={["Automatisk", "Manuell", "Av"]} />
        </ToolGrid>
        {(values.breakerMode || "off") !== "off" && (
          <ToolGrid>
            <ToolNumber label="Antal brytbrädor" value={values.breakerCount} onChange={(breakerCount) => onChange({ breakerCount })} step={1} />
            <ToolLength label="Brytbräda bredd" value={values.breakerWidth} baseUnit="mm" unit={unit} onChange={(breakerWidth) => onChange({ breakerWidth })} />
            {(values.breakerMode || "off") === "manual" && (
              <ToolText label="Brytbräda position" value={values.breakerPositions} onChange={(breakerPositions) => onChange({ breakerPositions })} placeholder="50 eller 33, 66" />
            )}
          </ToolGrid>
        )}
        <div className="rounded-2xl border border-zinc-800 bg-black/50 p-4">
          <p className="text-sm font-bold text-zinc-400">
            {translateText("Standardlängder trall", language)}
          </p>

          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {standardDeckBoardLengths.map((length) => {
              const key = Number(length).toFixed(1);

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleLength(key)}
                  className={`min-h-11 rounded-xl border px-3 text-sm font-black transition ${
                    normalizedSelectedLengths.includes(key)
                      ? "border-orange-400 bg-orange-500 text-black"
                      : "border-zinc-800 bg-zinc-950 text-white"
                  }`}
                >
                  {formatNumber(length)} m
                </button>
              );
            })}
          </div>
        </div>
        <ToolGrid>
          <ToolText label="Egna längder" value={values.customLengths} onChange={(customLengths) => onChange({ customLengths })} placeholder="2.7, 3.3, 5.1" />
          <ToolNumber label="Spill %" value={values.waste} onChange={(waste) => onChange({ waste })} />
        </ToolGrid>
      </div>
    );
  }

  if (toolId === "parquetlayout") {
    return (
      <ToolGrid>
        <ToolLength label="Längd" value={values.length} baseUnit="m" unit={unit} onChange={(length) => onChange({ length })} />
        <ToolLength label="Bredd" value={values.width} baseUnit="m" unit={unit} onChange={(width) => onChange({ width })} />
        <ToolLength label="Brädbredd" value={values.boardWidth} baseUnit="mm" unit={unit} onChange={(boardWidth) => onChange({ boardWidth })} />
      </ToolGrid>
    );
  }

  if (toolId === "screws") {
    const environments = fastenerService.environments();
    const categories = fastenerService.categoriesForEnvironment(values.environment);
    const materials = fastenerService.materialsFor(values.environment, values.category);
    const selectedMaterial = fastenerService.find(values.materialId);
    const calculationType = selectedMaterial.calculationType;
    const resolvedFasteners = replacementService.resolveFasteners(selectedMaterial, values.fastenerType);
    const effectiveWaste = values.waste === "" || values.waste === undefined || values.waste === null
      ? defaultWasteFor(selectedMaterial, values.fastenerType)
      : values.waste;

    return (
      <div className="grid gap-4">
        <ToolGrid>
          <ToolSelect
            label="environment"
            value={values.environment}
            onChange={(environment) => {
              const nextCategory = fastenerService.categoriesForEnvironment(environment)[0] || "";
              const nextMaterial = fastenerService.materialsFor(environment, nextCategory)[0] || selectedMaterial;

              onChange({
                environment,
                category: nextCategory,
                materialId: nextMaterial.id,
                waste: "",
              });
            }}
            options={environments.map((item) => item.id)}
          />
          <ToolSelect
            label="category"
            value={values.category}
            onChange={(category) => {
              const nextMaterial = fastenerService.materialsFor(values.environment, category)[0] || selectedMaterial;

              onChange({
                category,
                materialId: nextMaterial.id,
                waste: "",
              });
            }}
            options={categories}
          />
          <ToolSelect
            label="material"
            value={selectedMaterial.id}
            onChange={(materialId) => onChange({ materialId, waste: "" })}
            options={materials.map((item) => item.id)}
            optionLabels={materials.map((item) => item.material)}
          />
          <ToolSelect
            label="fastenerType"
            value={values.fastenerType}
            onChange={(fastenerType) => onChange({ fastenerType, waste: "" })}
            options={["original", "spik", "skruv"]}
            optionLabels={["infastning.original", "nail", "screw"]}
          />
        </ToolGrid>

        <div className="sticky top-3 z-20 rounded-2xl border border-orange-400/30 bg-zinc-950/95 p-4 text-sm text-zinc-300 shadow-2xl shadow-black/40 backdrop-blur lg:static lg:shadow-none">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-orange-400">
                {translateText("infastning.viewTitle", language)}
              </p>
              <p className="mt-1 font-black text-white">{translateText(selectedMaterial.material, language)}</p>
            </div>
            <span className="rounded-full border border-orange-400/30 px-3 py-1 text-xs font-black text-orange-200">
              {formatNumber(effectiveWaste)} %
            </span>
          </div>
          <p className="mt-3 font-black text-white">
            {resolvedFasteners.map((item) => translateText(item, language)).join(" / ")}
          </p>
          <p className="mt-2 text-zinc-400">
            {translateText("usage", language)}: {formatQuantityRange(selectedMaterial.usage, ` ${translateText(selectedMaterial.unit, language)}`)}
          </p>
        </div>

        {calculationType === "perM2" && (
          <SurfaceAreaFields values={values} unit={unit} onChange={onChange} modes={["manual", "floor", "wall"]} />
        )}

        {calculationType === "perLinearMeter" && (
          <ToolLength label="linearMeters" value={values.linearMeters} baseUnit="m" unit={unit} onChange={(linearMeters) => onChange({ linearMeters })} />
        )}

        {selectedMaterial.unit === "st/punkt" && (
          <ToolNumber label="infastning.points" value={values.points} onChange={(points) => onChange({ points })} step={1} />
        )}

        {selectedMaterial.unit === "st/korsningspunkt" && (
          <ToolNumber label="infastning.crossingPoints" value={values.crossingPoints} onChange={(crossingPoints) => onChange({ crossingPoints })} step={1} />
        )}

        <ToolGrid>
          <ToolNumber label="wastePercent" value={effectiveWaste} onChange={(waste) => onChange({ waste })} />
        </ToolGrid>

        <div className="rounded-2xl border border-orange-400/20 bg-black/50 p-4 text-sm text-zinc-300">
          <p className="font-black text-white">{resolvedFasteners.map((item) => translateText(item, language)).join(" / ")}</p>
          <p className="mt-2">{translateText("surfaceTreatment", language)}: {selectedMaterial.surfaceTreatment}</p>
          <p className="mt-1">{translateText("ccMax", language)}: {selectedMaterial.ccMax || translateText("Ej angivet", language)}</p>
          <p className="mt-1 text-orange-300">{translateText("usage", language)}: {formatQuantityRange(selectedMaterial.usage, ` ${selectedMaterial.unit}`)}</p>
          {selectedMaterial.notes && <p className="mt-2 text-zinc-500">{selectedMaterial.notes}</p>}
        </div>
      </div>
    );
  }

  if (toolId === "decking") {
    return (
      <ToolGrid>
        <SurfaceAreaFields values={values} unit={unit} onChange={onChange} modes={["manual", "floor"]} />
        <ToolLength label="Bredd på trall" value={values.boardWidth} baseUnit="mm" unit={unit} onChange={(boardWidth) => onChange({ boardWidth })} />
        <ToolLength label="Springa" value={values.gap} baseUnit="mm" unit={unit} onChange={(gap) => onChange({ gap })} />
        <ToolLength label="Längd på brädor" value={values.boardLength} baseUnit="m" unit={unit} onChange={(boardLength) => onChange({ boardLength })} />
        <ToolNumber label="Spill %" value={values.waste} onChange={(waste) => onChange({ waste })} />
      </ToolGrid>
    );
  }

  if (toolId === "flooring") {
    return (
      <ToolGrid>
        <SurfaceAreaFields values={values} unit={unit} onChange={onChange} modes={["manual", "floor"]} />
        <ToolNumber label="Paketstorlek m²" value={values.packageSize} onChange={(packageSize) => onChange({ packageSize })} />
        <ToolNumber label="Spill %" value={values.waste} onChange={(waste) => onChange({ waste })} />
      </ToolGrid>
    );
  }

  if (toolId === "drywall") {
    return (
      <div className="grid gap-4">
        <ToolSelect
          label="Ytberäkning"
          value={values.areaMode}
          onChange={(areaMode) => onChange({ areaMode })}
          options={["manual", "wall"]}
          optionLabels={["Ange m² manuellt", "Beräkna längd × höjd"]}
        />

        {values.areaMode === "manual" ? (
          <ToolNumber label="Vägg / tak yta m²" value={values.area} onChange={(area) => onChange({ area })} />
        ) : (
          <ToolGrid>
            <ToolLength label="Vägglängd" value={values.wallLength} baseUnit="m" unit={unit} onChange={(wallLength) => onChange({ wallLength })} />
            <ToolLength label="Vägghöjd" value={values.wallHeight} baseUnit="m" unit={unit} onChange={(wallHeight) => onChange({ wallHeight })} />
          </ToolGrid>
        )}

        <ToolGrid>
          <ToolSelect label="Typ av skiva" value={values.boardType} onChange={(boardType) => onChange({ boardType })} options={Object.keys(boardSizes)} />
          <ToolSelect label="Antal lager" value={values.layerCount} onChange={(layerCount) => onChange({ layerCount })} options={["one", "two"]} optionLabels={["Ett lager", "Två lager"]} />
          {values.layerCount === "two" ? (
            <>
              <ToolSelect label="Lager 1 montage" value={values.layer1Orientation} onChange={(layer1Orientation) => onChange({ layer1Orientation })} options={["vertical", "horizontal"]} optionLabels={["Stående montage", "Liggande montage"]} />
              <ToolSelect label="Lager 2 montage" value={values.layer2Orientation} onChange={(layer2Orientation) => onChange({ layer2Orientation })} options={["vertical", "horizontal"]} optionLabels={["Stående montage", "Liggande montage"]} />
            </>
          ) : (
            <ToolSelect label="Skivmontage" value={values.layer1Orientation} onChange={(layer1Orientation) => onChange({ layer1Orientation })} options={["vertical", "horizontal"]} optionLabels={["Stående montage", "Liggande montage"]} />
          )}
          <ToolSelect label="CC mått" value={values.boardCcMode} onChange={(boardCcMode) => onChange({ boardCcMode })} options={ccOptions} />
          <ToolNumber label="Spill %" value={values.waste} onChange={(waste) => onChange({ waste })} />
        </ToolGrid>

        {values.boardCcMode === "custom" && (
          <ToolLength label="Custom cc" value={values.customBoardCc} baseUnit="mm" unit={unit} onChange={(customBoardCc) => onChange({ customBoardCc })} />
        )}

        {values.boardType === "custom" && (
          <ToolGrid>
            <ToolLength label="Egen skivbredd" value={values.customBoardWidth} baseUnit="mm" unit={unit} onChange={(customBoardWidth) => onChange({ customBoardWidth })} />
            <ToolLength label="Egen skivhöjd" value={values.customBoardHeight} baseUnit="mm" unit={unit} onChange={(customBoardHeight) => onChange({ customBoardHeight })} />
          </ToolGrid>
        )}
      </div>
    );
  }

  if (toolId === "sheet") {
    return (
      <div className="grid gap-4">
        <ToolSelect label="Material" value={values.material} onChange={(material) => onChange({ material })} options={["OSB", "Plywood"]} />
        <SurfaceAreaFields values={values} unit={unit} onChange={onChange} modes={["manual", "wall"]} />

        <ToolGrid>
          <ToolSelect label="Skivdimension" value={values.boardType} onChange={(boardType) => onChange({ boardType })} options={Object.keys(sheetSizes)} />
          <ToolSelect label="Skivmontage" value={values.boardOrientation} onChange={(boardOrientation) => onChange({ boardOrientation })} options={["vertical", "horizontal"]} optionLabels={["Stående montage", "Liggande montage"]} />
          <ToolSelect label="CC mått" value={values.boardCcMode} onChange={(boardCcMode) => onChange({ boardCcMode })} options={ccOptions} />
          <ToolNumber label="Spill %" value={values.waste} onChange={(waste) => onChange({ waste })} />
        </ToolGrid>

        {values.boardCcMode === "custom" && (
          <ToolLength label="Custom cc" value={values.customBoardCc} baseUnit="mm" unit={unit} onChange={(customBoardCc) => onChange({ customBoardCc })} />
        )}

        {values.boardType === "custom" && (
          <ToolGrid>
            <ToolLength label="Egen skivbredd" value={values.customBoardWidth} baseUnit="mm" unit={unit} onChange={(customBoardWidth) => onChange({ customBoardWidth })} />
            <ToolLength label="Egen skivhöjd" value={values.customBoardHeight} baseUnit="mm" unit={unit} onChange={(customBoardHeight) => onChange({ customBoardHeight })} />
          </ToolGrid>
        )}
      </div>
    );
  }

  if (toolId === "panel") {
    return (
      <ToolGrid>
        <ToolSelect label="Paneltyp" value={values.panelType} onChange={(panelType) => onChange({ panelType })} options={["Lockpanel", "Stående panel", "Liggande panel"]} />
        <SurfaceAreaFields values={values} unit={unit} onChange={onChange} modes={["manual", "wall"]} />
        <ToolLength label="Täckande bredd" value={values.coverWidth} baseUnit="mm" unit={unit} onChange={(coverWidth) => onChange({ coverWidth })} />
        <ToolLength label="Overlap / lockpanel" value={values.overlap} baseUnit="mm" unit={unit} onChange={(overlap) => onChange({ overlap })} />
        <ToolLength label="CC mått" value={values.cc} baseUnit="mm" unit={unit} onChange={(cc) => onChange({ cc })} />
      </ToolGrid>
    );
  }

  if (toolId === "paint") {
    return (
      <ToolGrid>
        <SurfaceAreaFields values={values} unit={unit} onChange={onChange} modes={["manual", "wall", "floor"]} />
        <ToolNumber label="Antal lager" value={values.coats} onChange={(coats) => onChange({ coats })} step={1} />
      </ToolGrid>
    );
  }

  if (toolId === "studwall") {
    return (
      <div className="grid gap-4">
        <ToolGrid>
          <ToolSelect label="Typ av regel" value={values.studType} onChange={(studType) => onChange({ studType })} options={["träreglar", "metallreglar"]} />
          <ToolLength label="Vägglängd" value={values.wallLength} baseUnit="m" unit={unit} onChange={(wallLength) => onChange({ wallLength })} />
          <ToolLength label="Vägghöjd" value={values.wallHeight} baseUnit="m" unit={unit} onChange={(wallHeight) => onChange({ wallHeight })} />
          <ToolLength label="CC mått" value={values.cc} baseUnit="mm" unit={unit} onChange={(cc) => onChange({ cc })} />
          <ToolNumber label="Antal öppningar" value={values.openings} onChange={(openings) => onChange({ openings })} step={1} />
          <ToolNumber label="Spill %" value={values.waste} onChange={(waste) => onChange({ waste })} />
        </ToolGrid>

        <ToolGrid>
          <ToolSelect label="Regeldimension" value={values.dimension} onChange={(dimension) => onChange({ dimension })} options={studDimensions} />
          {values.studType === "metallreglar" ? (
            <ToolLength label="Längd stående metallregel" value={values.metalStudLength} baseUnit="m" unit={unit} onChange={(metalStudLength) => onChange({ metalStudLength })} />
          ) : (
            <ToolSelect label="Längd träregel" value={values.studLength} onChange={(studLength) => onChange({ studLength })} options={studLengths.map(String)} />
          )}
        </ToolGrid>

        {values.dimension === "custom" && (
          <ToolGrid>
            <ToolLength label="Custom bredd" value={values.customWidth} baseUnit="mm" unit={unit} onChange={(customWidth) => onChange({ customWidth })} />
            <ToolLength label="Custom djup" value={values.customDepth} baseUnit="mm" unit={unit} onChange={(customDepth) => onChange({ customDepth })} />
          </ToolGrid>
        )}

        <ToolCheckbox label="Dubbel regel vid öppning" checked={values.doubleStudAtOpening} onChange={(doubleStudAtOpening) => onChange({ doubleStudAtOpening })} />

        <ToolSelect
          label="Överliggare"
          value={values.headerType}
          onChange={(headerType) => onChange({ headerType })}
          options={["single", "double"]}
          optionLabels={["Enkel överliggare", "Dubbel överliggare"]}
        />
      </div>
    );
  }

  if (toolId === "concrete") {
    return (
      <ToolGrid>
        <SurfaceAreaFields values={values} unit={unit} onChange={onChange} modes={["manual", "floor"]} />
        <ToolLength label="Tjocklek" value={values.thickness} baseUnit="mm" unit={unit} onChange={(thickness) => onChange({ thickness })} />
        <ToolNumber label="Spill %" value={values.waste} onChange={(waste) => onChange({ waste })} />
      </ToolGrid>
    );
  }

  if (toolId === "selfleveling") {
    return (
      <ToolGrid>
        <SurfaceAreaFields values={values} unit={unit} onChange={onChange} modes={["manual", "floor"]} />
        <ToolLength label="Tjocklek" value={values.thickness} baseUnit="mm" unit={unit} onChange={(thickness) => onChange({ thickness })} />
        <ToolNumber label="Åtgång kg/mm/m²" value={values.consumptionPerMm} onChange={(consumptionPerMm) => onChange({ consumptionPerMm })} />
        <ToolNumber label="Säckstorlek kg" value={values.bagWeight} onChange={(bagWeight) => onChange({ bagWeight })} />
        <ToolNumber label="Spill %" value={values.waste} onChange={(waste) => onChange({ waste })} />
      </ToolGrid>
    );
  }

  return (
    <ToolGrid>
      <ToolSelect label="Typ" value={values.type} onChange={(type) => onChange({ type })} options={["vägg", "tak", "golv"]} />
      <SurfaceAreaFields values={values} unit={unit} onChange={onChange} modes={["manual", "wall", "floor"]} />
      <ToolLength label="Tjocklek" value={values.thickness} baseUnit="mm" unit={unit} onChange={(thickness) => onChange({ thickness })} />
      <ToolNumber label="Spill %" value={values.waste} onChange={(waste) => onChange({ waste })} />
    </ToolGrid>
  );
}

function SurfaceAreaFields({ values, unit, onChange, modes }) {
  const options = modes;
  const labels = modes.map((mode) => {
    if (mode === "wall") return "Beräkna längd × höjd";
    if (mode === "floor") return "Beräkna längd × bredd";
    return "Ange m² manuellt";
  });

  return (
    <div className="grid gap-4 sm:col-span-2">
      <ToolSelect
        label="Ytberäkning"
        value={values.areaMode}
        onChange={(areaMode) => onChange({ areaMode })}
        options={options}
        optionLabels={labels}
      />

      {values.areaMode === "wall" || values.areaMode === "dimensions" ? (
        <ToolGrid>
          <ToolLength label="Längd" value={values.wallLength} baseUnit="m" unit={unit} onChange={(wallLength) => onChange({ wallLength })} />
          <ToolLength label="Höjd" value={values.wallHeight} baseUnit="m" unit={unit} onChange={(wallHeight) => onChange({ wallHeight })} />
        </ToolGrid>
      ) : values.areaMode === "floor" ? (
        <ToolGrid>
          <ToolLength label="Längd" value={values.length} baseUnit="m" unit={unit} onChange={(length) => onChange({ length })} />
          <ToolLength label="Bredd" value={values.width} baseUnit="m" unit={unit} onChange={(width) => onChange({ width })} />
        </ToolGrid>
      ) : (
        <ToolNumber label="Yta m²" value={values.area} onChange={(area) => onChange({ area })} />
      )}
    </div>
  );
}

function ToolGrid({ children }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {children}
    </div>
  );
}

function UnitToggle({ unit, onChange }) {
  const { t } = useI18n();

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-3">
      <p className="px-1 text-xs font-black uppercase tracking-[0.16em] text-orange-400">
        {t("Måttenhet")}
      </p>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {lengthUnits.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`min-h-12 touch-manipulation rounded-2xl border text-base font-black transition active:scale-[0.98] ${
              unit === option
                ? "border-orange-400 bg-orange-500 text-black shadow-lg shadow-orange-500/20"
                : "border-zinc-800 bg-black text-white"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function ToolLength({ label, value, baseUnit, unit, onChange }) {
  const { language } = useI18n();
  const displayValue = convertLength(value, baseUnit, unit);
  const step = lengthStep(unit);

  const handleChange = (nextValue) => {
    onChange(convertLength(nextValue, unit, baseUnit));
  };

  return (
    <ToolNumber
      label={`${translateText(label, language)} (${unit})`}
      value={Number(displayValue.toFixed(4))}
      onChange={handleChange}
      step={step}
    />
  );
}

function ToolNumber({ label, value, onChange, step = 0.1 }) {
  const { language } = useI18n();
  const numericValue = numberValue(value);
  const decimalPlaces = String(step).includes(".") ? String(step).split(".")[1].length : 0;

  const changeBy = (direction) => {
    const nextValue = Number((numericValue + direction * step).toFixed(decimalPlaces));

    onChange(Math.max(0, nextValue));
  };

  return (
    <label className="block text-sm text-zinc-400">
      {translateText(label, language)}

      <div className="mt-2 grid grid-cols-[3.25rem_1fr_3.25rem] overflow-hidden rounded-2xl border border-zinc-800 bg-black">
        <button
          type="button"
          onClick={() => changeBy(-1)}
          disabled={numericValue <= 0}
          className="min-h-14 touch-manipulation border-r border-zinc-800 text-2xl font-black text-orange-300 transition active:bg-orange-500/20 disabled:text-zinc-700"
        >
          -
        </button>

        <input
          type="number"
          min={0}
          step={step}
          value={value}
          inputMode="decimal"
          onChange={(event) => onChange(event.target.value === "" ? 0 : Math.max(0, Number(event.target.value) || 0))}
          className="min-h-14 w-full bg-zinc-950 px-3 text-center text-xl font-black text-white outline-none"
        />

        <button
          type="button"
          onClick={() => changeBy(1)}
          className="min-h-14 touch-manipulation border-l border-zinc-800 text-2xl font-black text-orange-300 transition active:bg-orange-500/20"
        >
          +
        </button>
      </div>
    </label>
  );
}

function ToolSelect({ label, value, onChange, options, optionLabels }) {
  const { language } = useI18n();

  return (
    <label className="block text-sm text-zinc-400">
      {translateText(label, language)}

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 min-h-14 w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 text-base font-bold text-white outline-none"
      >
        {options.map((option, index) => (
          <option key={option} value={option}>
            {translateText(optionLabels?.[index] || option, language)}
          </option>
        ))}
      </select>
    </label>
  );
}

function ToolText({ label, value, onChange, placeholder = "" }) {
  const { language } = useI18n();

  return (
    <label className="block text-sm text-zinc-400">
      {translateText(label, language)}

      <input
        type="text"
        value={value || ""}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 min-h-14 w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 text-base font-bold text-white outline-none placeholder:text-zinc-600"
      />
    </label>
  );
}

function ToolCheckbox({ label, checked, onChange }) {
  const { language } = useI18n();

  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`min-h-14 rounded-2xl border px-4 text-left font-bold transition ${
        checked
          ? "border-orange-400 bg-orange-500 text-black"
          : "border-zinc-800 bg-zinc-950 text-white"
      }`}
    >
      {translateText(label, language)}
    </button>
  );
}
