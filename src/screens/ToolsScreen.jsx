import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Box, Calculator, ChevronRight, FileDown, Ruler, ShoppingCart, Trash2 } from "lucide-react";
import marcinByggLogo from "../assets/marcin-bygg-logo.png";
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
    description: "BerĂ¤kna antal brĂ¤dor och exakt springa",
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
    description: "BerĂ¤kna procent och vinkel",
  },
  {
    id: "screws",
    group: "Skruv & SpikĂĄtgĂĄng",
    title: "Skruv & SpikĂĄtgĂĄng",
    description: "Trall, panel, gips och konstruktion",
  },
  {
    id: "decking",
    group: "TrallĂĄtgĂĄng",
    title: "TrallĂĄtgĂĄng",
    description: "BrĂ¤dor, lĂ¶pmeter och spill",
  },
  {
    id: "flooring",
    group: "Klickgolv / GolvĂĄtgĂĄng",
    title: "Klickgolv / GolvĂĄtgĂĄng",
    description: "Paket och total yta",
  },
  {
    id: "drywall",
    group: "GipsĂĄtgĂĄng",
    title: "GipsĂĄtgĂĄng",
    description: "Antal gipsskivor",
  },
  {
    id: "sheet",
    group: "OSB / Plywood ĂĄtgĂĄng",
    title: "OSB / Plywood ĂĄtgĂĄng",
    description: "Skivor, yta och spill",
  },
  {
    id: "panel",
    group: "PanelĂĄtgĂĄng",
    title: "PanelĂĄtgĂĄng",
    description: "Paneltyp, overlap och cc mĂĄtt",
  },
  {
    id: "paint",
    group: "FĂ¤rgĂĄtgĂĄng",
    title: "FĂ¤rgĂĄtgĂĄng",
    description: "Uppskattad fĂ¤rgĂĄtgĂĄng",
  },
  {
    id: "insulation",
    group: "IsoleringsĂĄtgĂĄng",
    title: "IsoleringsĂĄtgĂĄng",
    description: "VĂ¤gg, tak och golv",
  },
  {
    id: "studwall",
    group: "RegelvĂ¤gg / RegelĂĄtgĂĄng",
    title: "RegelvĂ¤gg / RegelĂĄtgĂĄng",
    description: "BerĂ¤kna reglar, skenor och lĂ¶pmeter",
  },
];

void legacyTools;

const tools = [
  { id: "spacing", group: "Kalkulator", title: "Indelning", description: "BerĂ¤kna antal brĂ¤dor och exakt springa", ready: true },
  { id: "diagonal", group: "Kalkulator", title: "Diagonal", description: "Kontrollera vinklar och diagonaler", ready: true },
  { id: "slope", group: "Kalkulator", title: "Lutning", description: "BerĂ¤kna procent och vinkel", ready: true },
  { id: "stringer", group: "Kalkulator", title: "Vangstycke", description: "FĂ¶rberedd modul fĂ¶r trappmĂĄtt" },
  { id: "wallframe", group: "Kalkulator", title: "VĂ¤ggstomme", description: "FĂ¶rberedd modul fĂ¶r stomme och reglar" },
  { id: "ramp", group: "Kalkulator", title: "Ramp", description: "FĂ¶rberedd modul fĂ¶r ramp och lutning" },
  { id: "cornerangle", group: "Kalkulator", title: "HĂ¶rnvinkel", description: "FĂ¶rberedd modul fĂ¶r vinklar" },
  { id: "miter", group: "Kalkulator", title: "Geringsfog", description: "FĂ¶rberedd modul fĂ¶r kapvinkel" },
  { id: "runningmeasure", group: "Kalkulator", title: "LĂ¶pande mĂĄtt", description: "FĂ¶rberedd modul fĂ¶r repeterade mĂĄtt" },
  { id: "rafter", group: "Kalkulator", title: "Taksparre", description: "FĂ¶rberedd modul fĂ¶r takmĂĄtt" },
  { id: "decklayout", group: "Kalkulator", title: "TralllĂ¤ggning", description: "FĂ¶rberedd modul fĂ¶r trallriktning" },
  { id: "parquetlayout", group: "Kalkulator", title: "ParkettlĂ¤ggning", description: "FĂ¶rberedd modul fĂ¶r lĂ¤ggmĂ¶nster" },
  { id: "screws", group: "Ă…tgĂĄng", title: "Skruv & SpikĂĄtgĂĄng", description: "Trall, panel, gips och konstruktion", ready: true },
  { id: "decking", group: "Ă…tgĂĄng", title: "TrallĂĄtgĂĄng", description: "BrĂ¤dor, lĂ¶pmeter och spill", ready: true },
  { id: "flooring", group: "Ă…tgĂĄng", title: "Klickgolv / GolvĂĄtgĂĄng", description: "Paket och total yta", ready: true },
  { id: "drywall", group: "Ă…tgĂĄng", title: "GipsĂĄtgĂĄng", description: "Antal gipsskivor", ready: true },
  { id: "sheet", group: "Ă…tgĂĄng", title: "OSB / Plywood ĂĄtgĂĄng", description: "Skivor, yta och spill", ready: true },
  { id: "panel", group: "Ă…tgĂĄng", title: "PanelĂĄtgĂĄng", description: "Paneltyp, overlap och cc mĂĄtt", ready: true },
  { id: "paint", group: "Ă…tgĂĄng", title: "FĂ¤rgĂĄtgĂĄng", description: "Uppskattad fĂ¤rgĂĄtgĂĄng", ready: true },
  { id: "insulation", group: "Ă…tgĂĄng", title: "IsoleringsĂĄtgĂĄng", description: "VĂ¤gg, tak och golv", ready: true },
  { id: "studwall", group: "Ă…tgĂĄng", title: "RegelvĂ¤gg / RegelĂĄtgĂĄng", description: "BerĂ¤kna reglar, skenor och lĂ¶pmeter", ready: true },
  { id: "concrete", group: "Ă…tgĂĄng", title: "BetongĂĄtgĂĄng", description: "Volym betong frĂĄn yta och tjocklek", ready: true },
  { id: "selfleveling", group: "Ă…tgĂĄng", title: "FlytspackelĂĄtgĂĄng", description: "SĂ¤ckar och kg frĂĄn yta och tjocklek", ready: true },
];

const toolGroups = ["Kalkulator", "Ă…tgĂĄng"];

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
    totalLength: 6000,
    boardWidth: 120,
    gap: 5,
    useFrame: true,
    frameBoards: 2,
    overhang: 20,
    direction: "length",
    boardLength: 4.2,
    waste: 10,
  },
  parquetlayout: {
    length: 5,
    width: 4,
    boardWidth: 180,
  },
  screws: {
    scope: "outdoor",
    subcategory: "deckFence",
    materialKey: "deckingScrew",
    calculationMode: "perM2",
    areaMode: "manual",
    area: 20,
    wallLength: 8,
    wallHeight: 2.5,
    length: 4,
    width: 5,
    linearMeters: 20,
    supportPoints: 80,
    customRate: 35,
    panelWidth: 120,
    panelCc: 600,
    fastenersPerCrossing: 1,
    floorBoardType: "600 x 1800 mm",
    customFloorBoardWidth: 600,
    customFloorBoardLength: 1800,
    screwRows: 3,
    screwSpacing: 150,
    waste: 10,
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
    type: "vĂ¤gg",
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
    studType: "trĂ¤reglar",
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

const fasteningAreas = [
  { id: "indoor", title: "Invändigt" },
  { id: "outdoor", title: "Utvändigt" },
];

const fasteningSubcategories = {
  indoor: [
    { id: "floor", title: "Golv" },
    { id: "wall", title: "Vägg" },
    { id: "ceiling", title: "Tak" },
  ],
  outdoor: [
    { id: "deckFence", title: "Altan och staket" },
    { id: "facadePanel", title: "Fasad / panel" },
  ],
};

const fasteningMaterials = [
  {
    key: "floorChipboard",
    area: "indoor",
    subcategory: "floor",
    material: "Golvspånskiva",
    dimension: "600 x 1800 / 2400 mm",
    recommended: "Spånskiveskruv 4,2 x 55 mm",
    alternatives: "Golvvinkel / konstruktionsskruv vid förstärkning",
    coating: "Elförzinkad / inomhus",
    unit: "st",
    defaultMode: "perM2",
    rates: { perM2: 45, perLinearMeter: 8, perSupportPoint: 3 },
    comments: "Räkna tätare vid skarvar och bjälklag med hög belastning.",
  },
  {
    key: "drywallWall",
    area: "indoor",
    subcategory: "wall",
    material: "Gipsskiva vägg",
    dimension: "900 / 1200 mm skiva",
    recommended: "Gipsskruv 3,9 x 30/41 mm",
    alternatives: "Bandad gipsskruv vid större ytor",
    coating: "Fosfaterad / inomhus",
    unit: "st",
    defaultMode: "perM2",
    rates: { perM2: 18, perLinearMeter: 6, perSupportPoint: 1 },
    comments: "CC och antal lager påverkar verklig åtgång.",
  },
  {
    key: "ceilingBoard",
    area: "indoor",
    subcategory: "ceiling",
    material: "Innertak / panel",
    dimension: "Panel eller gipsskiva",
    recommended: "Gipsskruv / dyckert beroende på material",
    alternatives: "Panelclips eller spikpistol vid panel",
    coating: "Inomhus",
    unit: "st",
    defaultMode: "perM2",
    rates: { perM2: 24, perLinearMeter: 8, perSupportPoint: 2 },
    comments: "Tak kräver ofta tätare infästning än vägg.",
  },
  {
    key: "deckingScrew",
    area: "outdoor",
    subcategory: "deckFence",
    material: "Trall",
    dimension: "28 mm trall",
    recommended: "Trallskruv A2 4,8 x 55 mm",
    alternatives: "C4 trallskruv eller dold infästning",
    coating: "A2 / C4 utomhus",
    unit: "st",
    defaultMode: "perM2",
    rates: { perM2: 35, perLinearMeter: 6, perSupportPoint: 2 },
    comments: "Använd rostfri A4 nära vatten eller utsatta miljöer.",
  },
  {
    key: "fenceBoard",
    area: "outdoor",
    subcategory: "deckFence",
    material: "Staketbräda",
    dimension: "22-28 mm",
    recommended: "Utomhusskruv C4 4,8 x 55/75 mm",
    alternatives: "Varmförzinkad trådspik vid traditionellt montage",
    coating: "C4 / varmförzinkad",
    unit: "st",
    defaultMode: "perLinearMeter",
    rates: { perM2: 30, perLinearMeter: 10, perSupportPoint: 2 },
    comments: "Räkna efter antal reglar/stöd bakom staketet för bäst precision.",
  },
  {
    key: "facadePanel",
    area: "outdoor",
    subcategory: "facadePanel",
    material: "Fasadpanel",
    dimension: "Lockpanel / liggande panel",
    recommended: "Panelspik / panelskruv varmförzinkad",
    alternatives: "Rostfri A2 vid utsatt fasad",
    coating: "Varmförzinkad / A2",
    unit: "st",
    defaultMode: "perSupportPoint",
    rates: { perM2: 25, perLinearMeter: 7, perSupportPoint: 1 },
    comments: "Per stödpunkt ger bäst resultat: panelbräda × bakomliggande läkt/reglar.",
  },
];

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

function numberValue(value) {
  return Math.max(0, Number(value) || 0);
}

function formatNumber(value, maximumFractionDigits = 2) {
  return numberValue(value).toLocaleString("sv-SE", {
    maximumFractionDigits,
    minimumFractionDigits: 0,
  });
}

function createLocalId() {
  return globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function pdfSafeText(value) {
  return String(value ?? "")
    .replaceAll("ĂĄ", "a")
    .replaceAll("Ă¤", "a")
    .replaceAll("Ă¶", "o")
    .replaceAll("Ă…", "A")
    .replaceAll("Ă„", "A")
    .replaceAll("Ă–", "O")
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

function fasteningOptionsFor(values) {
  return fasteningMaterials.filter((item) => item.area === values.scope && item.subcategory === values.subcategory);
}

function selectedFasteningMaterial(values) {
  const options = fasteningOptionsFor(values);

  return options.find((item) => item.key === values.materialKey) || options[0] || fasteningMaterials[0];
}

function fasteningModeLabel(mode) {
  if (mode === "perLinearMeter") return "Per löpmeter";
  if (mode === "perSupportPoint") return "Per stödpunkt / korsningspunkt";
  return "Per m²";
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

function calculateDeckLayout(values) {
  const totalWidth = numberValue(values.totalWidth);
  const totalLength = numberValue(values.totalLength);
  const boardWidth = numberValue(values.boardWidth);
  const gap = numberValue(values.gap);
  const frameBoards = values.useFrame ? Math.max(0, Math.round(numberValue(values.frameBoards))) : 0;
  const overhang = numberValue(values.overhang);
  const wasteMultiplier = 1 + numberValue(values.waste) / 100;
  const frameWidth = frameBoards * boardWidth + Math.max(0, frameBoards - 1) * gap;
  const outerWidth = totalWidth + overhang * 2;
  const outerLength = totalLength + overhang * 2;
  const innerWidth = Math.max(0, outerWidth - frameWidth * 2);
  const innerLength = Math.max(0, outerLength - frameWidth * 2);
  const mainRun = values.direction === "width" ? innerLength : innerWidth;
  const mainBoardLength = values.direction === "width" ? innerWidth : innerLength;
  const moduleWidth = boardWidth + gap;
  const mainBoards = moduleWidth > 0 ? Math.max(0, Math.floor((mainRun + gap) / moduleWidth)) : 0;
  const mainLinearMeters = (mainBoards * mainBoardLength) / 1000;
  const frameLinearMeters = values.useFrame
    ? ((outerWidth * 2 + outerLength * 2) * frameBoards) / 1000
    : 0;
  const totalLinearMeters = (mainLinearMeters + frameLinearMeters) * wasteMultiplier;
  const boardsToBuy = numberValue(values.boardLength) > 0
    ? Math.ceil(totalLinearMeters / numberValue(values.boardLength))
    : 0;

  return {
    outerWidth,
    outerLength,
    innerWidth,
    innerLength,
    frameWidth,
    frameBoards,
    mainBoards,
    mainLinearMeters,
    frameLinearMeters,
    totalLinearMeters,
    boardsToBuy,
    overhang,
    direction: values.direction,
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
  const material = selectedFasteningMaterial(values);
  const calculationMode = values.calculationMode || material.defaultMode || "perM2";
  const wasteMultiplier = 1 + numberValue(values.waste) / 100;
  const recommendedRate = material.rates?.[calculationMode] ?? 0;
  const rate = numberValue(values.customRate) > 0 ? numberValue(values.customRate) : recommendedRate;
  let baseQuantity;
  let quantityLabel;

  if (calculationMode === "perLinearMeter") {
    baseQuantity = numberValue(values.linearMeters) * rate;
    quantityLabel = `${formatNumber(values.linearMeters)} lm × ${formatNumber(rate)} st/lm`;
  } else if (calculationMode === "perSupportPoint") {
    const fastenersPerPoint = Math.max(1, numberValue(values.fastenersPerCrossing));

    baseQuantity = numberValue(values.supportPoints) * fastenersPerPoint;
    quantityLabel = `${formatNumber(values.supportPoints, 0)} punkter × ${formatNumber(fastenersPerPoint)} st`;
  } else {
    const area = surfaceArea(values);

    baseQuantity = area * rate;
    quantityLabel = `${formatNumber(area)} mÂ˛ × ${formatNumber(rate)} st/mÂ˛`;
  }

  return {
    ...material,
    calculationMode,
    modeLabel: fasteningModeLabel(calculationMode),
    recommendedRate,
    rate,
    quantityLabel,
    baseFasteners: Math.ceil(baseQuantity),
    finalFasteners: Math.ceil(baseQuantity * wasteMultiplier),
    waste: numberValue(values.waste),
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
        note: `${result.layers} lager, lager 1 ${result.layer1.orientation}${result.layer2 ? `, lager 2 ${result.layer2.orientation}` : ""}, yta ${formatNumber(result.totalArea)} mÂ˛, cc${formatNumber(result.cc, 0)}, spill ${formatNumber(values.waste)} %`,
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
        note: `Yta ${formatNumber(result.area)} mÂ˛, ${values.boardOrientation}, cc${formatNumber(result.cc, 0)}, spill ${formatNumber(values.waste)} %`,
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
        unit: "mÂ˛",
        note: `Yta ${formatNumber(area)} mÂ˛, spill ${formatNumber(values.waste)} %`,
        source: tool.title,
      },
    ];
  }

  if (tool.id === "screws") {
    const result = calculateScrews(values);

    return [
      {
        name: result.recommended,
        quantity: result.finalFasteners,
        unit: result.unit || "st",
        note: `${result.material} · ${result.dimension} · ${result.modeLabel} · ${result.quantityLabel} · ${result.coating} · spill ${formatNumber(result.waste)} %`,
        source: tool.title,
      },
    ];
  }

  if (tool.id === "decklayout") {
    const result = calculateDeckLayout(values);

    return [
      {
        name: "Trallbrädor",
        quantity: result.boardsToBuy,
        unit: "st",
        note: `Fris ${values.useFrame ? `${result.frameBoards} brädor` : "nej"}, huvudfält ${formatNumber(result.mainLinearMeters)} lm, fris ${formatNumber(result.frameLinearMeters)} lm, totalt ${formatNumber(result.totalLinearMeters)} lm inkl. spill`,
        source: tool.title,
      },
    ];
  }

  if (tool.id === "studwall") {
    const result = calculateStudWall(values);
    const studName = values.studType === "metallreglar" ? "Metallregel" : `TrĂ¤regel ${result.dimension}`;

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
        note: `${formatNumber(result.trackMeters)} lm Ă¶vre och nedre skena inkl. spill`,
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
      ["Area", `${formatNumber(area)} mÂ˛`],
    ];
  }

  if (toolId === "spacing") {
    const result = calculateSpacing(values);

    return [
      ["Antal brĂ¤dor", `${result.boards} st`],
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
      ["Vinkel", `${formatNumber(Math.atan(ratio) * (180 / Math.PI))}Â°`],
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
      ["Vinkel", `${formatNumber(Math.atan(ratio) * (180 / Math.PI))}Â°`],
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
      ["Geringsvinkel", `${formatNumber(numberValue(values.angle) / 2)}Â°`],
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
      ["Vinkel", `${formatNumber(Math.atan2(numberValue(values.rise), numberValue(values.span)) * (180 / Math.PI))}Â°`],
    ];
  }

  if (toolId === "parquetlayout") {
    const rows = numberValue(values.boardWidth) > 0 ? Math.ceil((numberValue(values.width) * 1000) / numberValue(values.boardWidth)) : 0;

    return [
      ["Yta", `${formatNumber(numberValue(values.length) * numberValue(values.width))} mÂ˛`],
      ["Rader", `${rows} st`],
    ];
  }

  if (toolId === "screws") {
    const result = calculateScrews(values);

    return [
      ["Material", result.material],
      ["Dimension", result.dimension],
      ["Rekommenderad infästning", result.recommended],
      ["Alternativ", result.alternatives],
      ["Coating", result.coating],
      ["Beräkning", result.modeLabel],
      ["Åtgång", result.quantityLabel],
      ["Infästningar före spill", `${result.baseFasteners} ${result.unit}`],
      ["Spill %", `${formatNumber(result.waste)} %`],
      ["Final åtgång", `${result.finalFasteners} ${result.unit}`],
      ["Kommentar", result.comments],
    ];
  }

  if (toolId === "decking") {
    const cover = (numberValue(values.boardWidth) + numberValue(values.gap)) / 1000;
    const linearMeters = cover > 0 ? (surfaceArea(values) / cover) * (1 + numberValue(values.waste) / 100) : 0;
    const boards = numberValue(values.boardLength) > 0 ? Math.ceil(linearMeters / numberValue(values.boardLength)) : 0;

    return [
      ["Antal brĂ¤dor", `${boards} st`],
      ["LĂ¶pmeter", formatLength(linearMeters, "m", unit)],
      ["Uppskattad ĂĄtgĂĄng", formatLength(linearMeters, "m", unit)],
    ];
  }

  if (toolId === "flooring") {
    const totalArea = surfaceArea(values) * (1 + numberValue(values.waste) / 100);
    const packages = numberValue(values.packageSize) > 0 ? Math.ceil(totalArea / numberValue(values.packageSize)) : 0;

    return [
      ["Antal paket", `${packages} st`],
      ["Total yta", `${formatNumber(totalArea)} mÂ˛`],
    ];
  }

  if (toolId === "drywall") {
    const result = calculateDrywall(values);

    return [
      ["VĂ¤ggyta", `${formatNumber(result.wallArea)} mÂ˛`],
      ["Total yta", `${formatNumber(result.totalArea)} mÂ˛`],
      ["Yta per skiva", `${formatNumber(result.boardArea)} mÂ˛`],
      ["Teoretiskt minimum", `${result.theoreticalMinimum} st`],
      ["Praktisk ĂĄtgĂĄng", `${result.practicalSheets} st`],
      ["Spill", `${result.spillSheets} st (${formatNumber(values.waste)} %)`],
      ["Antal skivor lager 1", `${result.layer1.finalSheets} st`],
      ["Antal skivor lager 2", result.layer2 ? `${result.layer2.finalSheets} st` : "0 st"],
      ["Total antal skivor", `${result.finalSheets} st`],
      ["CC mĂĄtt", `cc${formatNumber(result.cc, 0)}`],
      ["Lager 1 montage", result.layer1.orientation],
      ["Lager 2 montage", result.layer2 ? result.layer2.orientation : "Inte angivet"],
      ["Finalt antal att kĂ¶pa", `${result.finalSheets} st`],
    ];
  }

  if (toolId === "sheet") {
    const result = calculateSheet(values);

    return [
      ["Material", values.material],
      ["Yta", `${formatNumber(result.area)} mÂ˛`],
      ["Yta per skiva", `${formatNumber(result.boardArea)} mÂ˛`],
      ["Teoretiskt minimum", `${result.theoreticalMinimum} st`],
      ["Praktisk ĂĄtgĂĄng", `${result.practicalSheets} st`],
      ["Spill", `${result.spillSheets} st (${formatNumber(values.waste)} %)`],
      ["CC mĂĄtt", `cc${formatNumber(result.cc, 0)}`],
      ["Skivmontage", result.boardOrientation],
      ["Finalt antal att kĂ¶pa", `${result.finalSheets} st`],
    ];
  }

  if (toolId === "panel") {
    const coverWidth = Math.max(1, numberValue(values.coverWidth) - numberValue(values.overlap));
    const linearMeters = (surfaceArea(values) / (coverWidth / 1000));

    return [
      ["PanelĂĄtgĂĄng", formatLength(linearMeters, "m", unit)],
      ["TĂ¤ckande bredd", formatLength(coverWidth, "mm", unit)],
      ["CC mĂĄtt", formatLength(values.cc, "mm", unit)],
    ];
  }

  if (toolId === "paint") {
    const liters = (surfaceArea(values) * Math.max(1, numberValue(values.coats))) / 8;

    return [
      ["Uppskattad fĂ¤rgĂĄtgĂĄng", `${formatNumber(liters)} liter`],
      ["Antal lager", `${formatNumber(values.coats)} st`],
    ];
  }

  if (toolId === "studwall") {
    const result = calculateStudWall(values);

    return [
      ["Antal stĂĄende reglar", `${result.standingStuds} st`],
      ["LĂ¶pmeter reglar", formatLength(result.studLinearMeters, "m", unit)],
      ["Antal reglar att kĂ¶pa", `${result.studsToBuy} st Ăˇ ${formatNumber(result.selectedStudLength)} m`],
      ["Antal skenor 3 m", `${result.railsToBuy} st`],
      ["InkĂ¶pslista fĂ¶r vĂ¤gg", `${result.studsToBuy} reglar, ${result.railsToBuy} skenor`],
    ];
  }

  if (toolId === "concrete") {
    const area = surfaceArea(values);
    const thicknessMeters = numberValue(values.thickness) / 1000;
    const volume = area * thicknessMeters;
    const volumeWithWaste = volume * (1 + numberValue(values.waste) / 100);

    return [
      ["Yta", `${formatNumber(area)} mĂ‚Ë›`],
      ["Tjocklek", formatLength(values.thickness, "mm", unit)],
      ["Betongvolym", `${formatNumber(volume)} mĂ‚Ĺ‚`],
      ["Spill %", `${formatNumber(values.waste)} %`],
      ["MÄ‚Â¤ngd att bestÄ‚Â¤lla", `${formatNumber(volumeWithWaste)} mĂ‚Ĺ‚`],
    ];
  }

  if (toolId === "selfleveling") {
    const area = surfaceArea(values);
    const baseKg = area * numberValue(values.thickness) * numberValue(values.consumptionPerMm);
    const kgWithWaste = baseKg * (1 + numberValue(values.waste) / 100);
    const bags = numberValue(values.bagWeight) > 0 ? Math.ceil(kgWithWaste / numberValue(values.bagWeight)) : 0;

    return [
      ["Yta", `${formatNumber(area)} mĂ‚Ë›`],
      ["Tjocklek", formatLength(values.thickness, "mm", unit)],
      ["Ä‚â€¦tgÄ‚Ä„ng", `${formatNumber(kgWithWaste)} kg`],
      ["SÄ‚Â¤ckstorlek", `${formatNumber(values.bagWeight)} kg`],
      ["Antal sÄ‚Â¤ckar", `${bags} st`],
    ];
  }

  if (toolId === "stringer") {
    const totalRise = numberValue(values.rise) * numberValue(values.steps);
    const totalRun = numberValue(values.run) * Math.max(0, numberValue(values.steps) - 1);
    const stringerLength = Math.sqrt(totalRise ** 2 + totalRun ** 2);

    return [
      ["Total hÄ‚Â¶jd", formatLength(totalRise, "mm", unit)],
      ["Total lÄ‚Â¤ngd", formatLength(totalRun, "mm", unit)],
      ["Vangstycke", formatLength(stringerLength, "mm", unit)],
    ];
  }

  if (toolId === "wallframe") {
    const ccMeters = Math.max(0.1, numberValue(values.cc) / 1000);
    const studs = numberValue(values.length) > 0 ? Math.floor(numberValue(values.length) / ccMeters) + 1 : 0;

    return [
      ["Antal reglar", `${studs} st`],
      ["VÄ‚Â¤gglÄ‚Â¤ngd", formatLength(values.length, "m", unit)],
      ["VÄ‚Â¤gghÄ‚Â¶jd", formatLength(values.height, "m", unit)],
    ];
  }

  if (toolId === "ramp") {
    const ratio = numberValue(values.length) > 0 ? numberValue(values.heightDifference) / numberValue(values.length) : 0;

    return [
      ["Lutning", `${formatNumber(ratio * 100)} %`],
      ["Vinkel", `${formatNumber(Math.atan(ratio) * (180 / Math.PI))}Ă‚Â°`],
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
      ["Geringsvinkel", `${formatNumber(numberValue(values.angle) / 2)}Ă‚Â°`],
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
      ["SparrlÄ‚Â¤ngd", formatLength(length, "m", unit)],
      ["Vinkel", `${formatNumber(Math.atan2(numberValue(values.rise), numberValue(values.span)) * (180 / Math.PI))}Ă‚Â°`],
    ];
  }

  if (toolId === "decklayout") {
    const result = calculateDeckLayout(values);

    return [
      ["Yttermått med utstick", `${formatLength(result.outerWidth, "mm", unit)} × ${formatLength(result.outerLength, "mm", unit)}`],
      ["Fris / ram", values.useFrame ? `${result.frameBoards} st · ${formatLength(result.frameWidth, "mm", unit)}` : "Av"],
      ["Fris löpmeter", formatLength(result.frameLinearMeters, "m", unit)],
      ["Huvudfält", `${formatLength(result.innerWidth, "mm", unit)} × ${formatLength(result.innerLength, "mm", unit)}`],
      ["Brädor huvudfält", `${result.mainBoards} st`],
      ["Huvudfält löpmeter", formatLength(result.mainLinearMeters, "m", unit)],
      ["Total löpmeter inkl. spill", formatLength(result.totalLinearMeters, "m", unit)],
      ["Antal brädor att köpa", `${result.boardsToBuy} st`],
    ];
  }

  if (toolId === "parquetlayout") {
    const rows = numberValue(values.boardWidth) > 0 ? Math.ceil((numberValue(values.width) * 1000) / numberValue(values.boardWidth)) : 0;

    return [
      ["Yta", `${formatNumber(numberValue(values.length) * numberValue(values.width))} mĂ‚Ë›`],
      ["Rader", `${rows} st`],
    ];
  }

  const insulationArea = surfaceArea(values);
  const insulationToBuy = insulationArea * (1 + numberValue(values.waste) / 100);
  const volume = insulationToBuy * (numberValue(values.thickness) / 1000);

  return [
    ["Isoleringsyta", `${formatNumber(insulationArea)} mÂ˛`],
    ["MĂ¤ngd att kĂ¶pa", `${formatNumber(insulationToBuy)} mÂ˛`],
    ["Spill %", `${formatNumber(values.waste)} %`],
    ["Uppskattad mĂ¤ngd isolering", `${formatNumber(volume)} mÂł`],
    ["Typ", values.type],
  ];
}

export default function ToolsScreen({ goBack, defaultUnit = "m" }) {
  const { language, t } = useI18n();
  const [selectedTool, setSelectedTool] = useState(null);
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
  const activeTool = tools.find((tool) => tool.id === selectedTool);

  useEffect(() => {
    localStorage.setItem(shoppingListStorageKey, JSON.stringify(shoppingItems));
  }, [shoppingItems]);

  useEffect(() => {
    localStorage.setItem(projectToolsStorageKey, JSON.stringify(projectItems));
  }, [projectItems]);

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
            {t("InkĂ¶pslista")}
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
                    {group === "Kalkulator" ? t("Snabba mĂĄtt och byggberĂ¤kningar") : t("MaterialĂĄtgĂĄng och inkĂ¶psunderlag")}
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
            {t("InkĂ¶pslista")}
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
            {t("InkĂ¶pslistan Ă¤r tom")}
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            {t("LĂ¤gg till resultat frĂĄn kalkylatorerna fĂ¶r att bygga en inkĂ¶pslista.")}
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
                  âś“
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

function ToolDetail({ tool, values, unit, onUnitChange, onChange, onAddToShoppingList, onAddToProject, onBack }) {
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
            {results.map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs font-bold uppercase text-zinc-500">
                  {translateText(label, language)}
                </p>

                <p className="mt-1 text-2xl font-black text-white">
                  {translateText(value, language)}
                </p>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={onAddToShoppingList}
            className="mt-5 flex min-h-14 w-full touch-manipulation items-center justify-center gap-2 rounded-2xl bg-orange-500 px-4 text-base font-black text-black transition active:scale-[0.98]"
          >
            <ShoppingCart size={20} />
            {t("LĂ¤gg till i inkĂ¶pslista")}
          </button>
          <button
            type="button"
            onClick={onAddToProject}
            className="mt-3 flex min-h-14 w-full touch-manipulation items-center justify-center gap-2 rounded-2xl border border-orange-400/40 bg-orange-500/10 px-4 text-base font-black text-orange-200 transition active:scale-[0.98]"
          >
            <Ruler size={20} />
            {t("LĂ¤gg till i projekt")}
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
                title={`${translateText("BrĂ¤da", language)} ${index + 1}`}
              />
            ))}
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs text-zinc-500">
            <div>
              <span className="block font-black text-white">{result.boards}</span>
              {t("brĂ¤dor")}
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
        {t("Modul fĂ¶r PDF/3D Ă¤r fĂ¶rberedd")}
      </div>
    </div>
  );
}

function ToolFields({ toolId, values, unit, onChange }) {
  if (toolId === "area") {
    return (
      <div className="grid gap-4">
        <ToolSelect label="Typ" value={values.shape} onChange={(shape) => onChange({ shape })} options={["rectangle", "triangle", "circle"]} optionLabels={["Area rektangel", "Area triangel", "Area cirkel"]} />
        {values.shape === "rectangle" && (
          <ToolGrid>
            <ToolLength label="LĂ¤ngd" value={values.length} baseUnit="m" unit={unit} onChange={(length) => onChange({ length })} />
            <ToolLength label="Bredd" value={values.width} baseUnit="m" unit={unit} onChange={(width) => onChange({ width })} />
          </ToolGrid>
        )}
        {values.shape === "triangle" && (
          <ToolGrid>
            <ToolLength label="Bas" value={values.base} baseUnit="m" unit={unit} onChange={(base) => onChange({ base })} />
            <ToolLength label="HĂ¶jd" value={values.height} baseUnit="m" unit={unit} onChange={(height) => onChange({ height })} />
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
        <ToolLength label="Total lĂ¤ngd" value={values.totalLength} baseUnit="mm" unit={unit} onChange={(totalLength) => onChange({ totalLength })} />
        <ToolLength label="Bredd pĂĄ material" value={values.materialWidth} baseUnit="mm" unit={unit} onChange={(materialWidth) => onChange({ materialWidth })} />
        <ToolLength label="Ă–nskad springa" value={values.desiredGap} baseUnit="mm" unit={unit} onChange={(desiredGap) => onChange({ desiredGap })} />
        <ToolCheckbox label="Start med springa" checked={values.startGap} onChange={(startGap) => onChange({ startGap })} />
        <ToolCheckbox label="Slut med springa" checked={values.endGap} onChange={(endGap) => onChange({ endGap })} />
      </div>
    );
  }

  if (toolId === "diagonal") {
    return (
      <ToolGrid>
        <ToolLength label="LĂ¤ngd" value={values.length} baseUnit="m" unit={unit} onChange={(length) => onChange({ length })} />
        <ToolLength label="Bredd" value={values.width} baseUnit="m" unit={unit} onChange={(width) => onChange({ width })} />
        <ToolLength label="UppmĂ¤tt diagonal" value={values.measuredDiagonal} baseUnit="m" unit={unit} onChange={(measuredDiagonal) => onChange({ measuredDiagonal })} />
      </ToolGrid>
    );
  }

  if (toolId === "slope") {
    return (
      <ToolGrid>
        <ToolLength label="HĂ¶jdskillnad" value={values.heightDifference} baseUnit="cm" unit={unit} onChange={(heightDifference) => onChange({ heightDifference })} />
        <ToolLength label="LĂ¤ngd" value={values.length} baseUnit="cm" unit={unit} onChange={(length) => onChange({ length })} />
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
    return (
      <div className="grid gap-4">
        <ToolGrid>
          <ToolLength label="Total bredd" value={values.totalWidth} baseUnit="mm" unit={unit} onChange={(totalWidth) => onChange({ totalWidth })} />
          <ToolLength label="Total längd" value={values.totalLength} baseUnit="mm" unit={unit} onChange={(totalLength) => onChange({ totalLength })} />
          <ToolLength label="Trallbredd" value={values.boardWidth} baseUnit="mm" unit={unit} onChange={(boardWidth) => onChange({ boardWidth })} />
          <ToolLength label="Springa mellan brädor" value={values.gap} baseUnit="mm" unit={unit} onChange={(gap) => onChange({ gap })} />
          <ToolLength label="Utstick utanför stomme" value={values.overhang} baseUnit="mm" unit={unit} onChange={(overhang) => onChange({ overhang })} />
          <ToolLength label="Längd på brädor" value={values.boardLength} baseUnit="m" unit={unit} onChange={(boardLength) => onChange({ boardLength })} />
        </ToolGrid>
        <ToolCheckbox label="Fris / ram runt altan" checked={values.useFrame} onChange={(useFrame) => onChange({ useFrame })} />
        {values.useFrame && (
          <ToolGrid>
            <ToolNumber label="Antal frisbrädor" value={values.frameBoards} onChange={(frameBoards) => onChange({ frameBoards })} step={1} />
            <ToolSelect label="Utstick standard" value={String(values.overhang)} onChange={(overhang) => onChange({ overhang: Number(overhang) })} options={["20", "28"]} optionLabels={["20 mm", "28 mm"]} />
          </ToolGrid>
        )}
        <ToolGrid>
          <ToolSelect label="Riktning på huvudbrädor" value={values.direction} onChange={(direction) => onChange({ direction })} options={["length", "width"]} optionLabels={["Längs med altan", "Tvärs över altan"]} />
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
    const subcategories = fasteningSubcategories[values.scope] || [];
    const materialOptions = fasteningOptionsFor(values);
    const selectedMaterial = selectedFasteningMaterial(values);
    const calculationMode = values.calculationMode || selectedMaterial.defaultMode || "perM2";

    return (
      <div className="grid gap-4">
        <ToolGrid>
          <ToolSelect
            label="Miljö"
            value={values.scope}
            onChange={(scope) => {
              const nextSubcategory = fasteningSubcategories[scope]?.[0]?.id || "";
              const nextMaterial = fasteningMaterials.find((item) => item.area === scope && item.subcategory === nextSubcategory) || selectedMaterial;

              onChange({
                scope,
                subcategory: nextSubcategory,
                materialKey: nextMaterial.key,
                calculationMode: nextMaterial.defaultMode,
                customRate: nextMaterial.rates?.[nextMaterial.defaultMode] || values.customRate,
              });
            }}
            options={fasteningAreas.map((item) => item.id)}
            optionLabels={fasteningAreas.map((item) => item.title)}
          />
          <ToolSelect
            label="Podkategori"
            value={values.subcategory}
            onChange={(subcategory) => {
              const nextMaterial = fasteningMaterials.find((item) => item.area === values.scope && item.subcategory === subcategory) || selectedMaterial;

              onChange({
                subcategory,
                materialKey: nextMaterial.key,
                calculationMode: nextMaterial.defaultMode,
                customRate: nextMaterial.rates?.[nextMaterial.defaultMode] || values.customRate,
              });
            }}
            options={subcategories.map((item) => item.id)}
            optionLabels={subcategories.map((item) => item.title)}
          />
          <ToolSelect
            label="Material"
            value={selectedMaterial.key}
            onChange={(materialKey) => {
              const nextMaterial = fasteningMaterials.find((item) => item.key === materialKey) || selectedMaterial;

              onChange({
                materialKey,
                calculationMode: nextMaterial.defaultMode,
                customRate: nextMaterial.rates?.[nextMaterial.defaultMode] || values.customRate,
              });
            }}
            options={materialOptions.map((item) => item.key)}
            optionLabels={materialOptions.map((item) => item.material)}
          />
          <ToolSelect
            label="Beräkningssätt"
            value={calculationMode}
            onChange={(nextMode) => onChange({
              calculationMode: nextMode,
              customRate: selectedMaterial.rates?.[nextMode] || values.customRate,
            })}
            options={["perM2", "perLinearMeter", "perSupportPoint"]}
            optionLabels={["Per m²", "Per löpmeter", "Per stödpunkt / korsningspunkt"]}
          />
        </ToolGrid>

        {calculationMode === "perM2" && (
          <SurfaceAreaFields values={values} unit={unit} onChange={onChange} modes={["manual", "floor", "wall"]} />
        )}

        {calculationMode === "perLinearMeter" && (
          <ToolLength label="Löpmeter" value={values.linearMeters} baseUnit="m" unit={unit} onChange={(linearMeters) => onChange({ linearMeters })} />
        )}

        {calculationMode === "perSupportPoint" && (
          <ToolGrid>
            <ToolNumber label="Antal stöd-/korsningspunkter" value={values.supportPoints} onChange={(supportPoints) => onChange({ supportPoints })} step={1} />
            <ToolNumber label="Infästningar per punkt" value={values.fastenersPerCrossing} onChange={(fastenersPerCrossing) => onChange({ fastenersPerCrossing })} step={1} />
          </ToolGrid>
        )}

        <ToolGrid>
          {calculationMode !== "perSupportPoint" && (
            <ToolNumber
              label={calculationMode === "perLinearMeter" ? "Åtgång st/lm" : "Åtgång st/m²"}
              value={values.customRate}
              onChange={(customRate) => onChange({ customRate })}
            />
          )}
          <ToolNumber label="Spill %" value={values.waste} onChange={(waste) => onChange({ waste })} />
        </ToolGrid>

        <div className="rounded-2xl border border-orange-400/20 bg-black/50 p-4 text-sm text-zinc-300">
          <p className="font-black text-white">{selectedMaterial.recommended}</p>
          <p className="mt-2">{selectedMaterial.dimension}</p>
          <p className="mt-1">{selectedMaterial.alternatives}</p>
          <p className="mt-1 text-orange-300">{selectedMaterial.coating}</p>
          <p className="mt-2 text-zinc-500">{selectedMaterial.comments}</p>
        </div>
      </div>
    );
  }

  if (toolId === "decking") {
    return (
      <ToolGrid>
        <SurfaceAreaFields values={values} unit={unit} onChange={onChange} modes={["manual", "floor"]} />
        <ToolLength label="Bredd pĂĄ trall" value={values.boardWidth} baseUnit="mm" unit={unit} onChange={(boardWidth) => onChange({ boardWidth })} />
        <ToolLength label="Springa" value={values.gap} baseUnit="mm" unit={unit} onChange={(gap) => onChange({ gap })} />
        <ToolLength label="LĂ¤ngd pĂĄ brĂ¤dor" value={values.boardLength} baseUnit="m" unit={unit} onChange={(boardLength) => onChange({ boardLength })} />
        <ToolNumber label="Spill %" value={values.waste} onChange={(waste) => onChange({ waste })} />
      </ToolGrid>
    );
  }

  if (toolId === "flooring") {
    return (
      <ToolGrid>
        <SurfaceAreaFields values={values} unit={unit} onChange={onChange} modes={["manual", "floor"]} />
        <ToolNumber label="Paketstorlek mÂ˛" value={values.packageSize} onChange={(packageSize) => onChange({ packageSize })} />
        <ToolNumber label="Spill %" value={values.waste} onChange={(waste) => onChange({ waste })} />
      </ToolGrid>
    );
  }

  if (toolId === "drywall") {
    return (
      <div className="grid gap-4">
        <ToolSelect
          label="YtberĂ¤kning"
          value={values.areaMode}
          onChange={(areaMode) => onChange({ areaMode })}
          options={["manual", "wall"]}
          optionLabels={["Ange mÂ˛ manuellt", "BerĂ¤kna lĂ¤ngd Ă— hĂ¶jd"]}
        />

        {values.areaMode === "manual" ? (
          <ToolNumber label="VĂ¤gg / tak yta mÂ˛" value={values.area} onChange={(area) => onChange({ area })} />
        ) : (
          <ToolGrid>
            <ToolLength label="VĂ¤gglĂ¤ngd" value={values.wallLength} baseUnit="m" unit={unit} onChange={(wallLength) => onChange({ wallLength })} />
            <ToolLength label="VĂ¤gghĂ¶jd" value={values.wallHeight} baseUnit="m" unit={unit} onChange={(wallHeight) => onChange({ wallHeight })} />
          </ToolGrid>
        )}

        <ToolGrid>
          <ToolSelect label="Typ av skiva" value={values.boardType} onChange={(boardType) => onChange({ boardType })} options={Object.keys(boardSizes)} />
          <ToolSelect label="Antal lager" value={values.layerCount} onChange={(layerCount) => onChange({ layerCount })} options={["one", "two"]} optionLabels={["Ett lager", "TvĂĄ lager"]} />
          {values.layerCount === "two" ? (
            <>
              <ToolSelect label="Lager 1 montage" value={values.layer1Orientation} onChange={(layer1Orientation) => onChange({ layer1Orientation })} options={["vertical", "horizontal"]} optionLabels={["StĂĄende montage", "Liggande montage"]} />
              <ToolSelect label="Lager 2 montage" value={values.layer2Orientation} onChange={(layer2Orientation) => onChange({ layer2Orientation })} options={["vertical", "horizontal"]} optionLabels={["StĂĄende montage", "Liggande montage"]} />
            </>
          ) : (
            <ToolSelect label="Skivmontage" value={values.layer1Orientation} onChange={(layer1Orientation) => onChange({ layer1Orientation })} options={["vertical", "horizontal"]} optionLabels={["StĂĄende montage", "Liggande montage"]} />
          )}
          <ToolSelect label="CC mĂĄtt" value={values.boardCcMode} onChange={(boardCcMode) => onChange({ boardCcMode })} options={ccOptions} />
          <ToolNumber label="Spill %" value={values.waste} onChange={(waste) => onChange({ waste })} />
        </ToolGrid>

        {values.boardCcMode === "custom" && (
          <ToolLength label="Custom cc" value={values.customBoardCc} baseUnit="mm" unit={unit} onChange={(customBoardCc) => onChange({ customBoardCc })} />
        )}

        {values.boardType === "custom" && (
          <ToolGrid>
            <ToolLength label="Egen skivbredd" value={values.customBoardWidth} baseUnit="mm" unit={unit} onChange={(customBoardWidth) => onChange({ customBoardWidth })} />
            <ToolLength label="Egen skivhĂ¶jd" value={values.customBoardHeight} baseUnit="mm" unit={unit} onChange={(customBoardHeight) => onChange({ customBoardHeight })} />
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
          <ToolSelect label="Skivmontage" value={values.boardOrientation} onChange={(boardOrientation) => onChange({ boardOrientation })} options={["vertical", "horizontal"]} optionLabels={["StĂĄende montage", "Liggande montage"]} />
          <ToolSelect label="CC mĂĄtt" value={values.boardCcMode} onChange={(boardCcMode) => onChange({ boardCcMode })} options={ccOptions} />
          <ToolNumber label="Spill %" value={values.waste} onChange={(waste) => onChange({ waste })} />
        </ToolGrid>

        {values.boardCcMode === "custom" && (
          <ToolLength label="Custom cc" value={values.customBoardCc} baseUnit="mm" unit={unit} onChange={(customBoardCc) => onChange({ customBoardCc })} />
        )}

        {values.boardType === "custom" && (
          <ToolGrid>
            <ToolLength label="Egen skivbredd" value={values.customBoardWidth} baseUnit="mm" unit={unit} onChange={(customBoardWidth) => onChange({ customBoardWidth })} />
            <ToolLength label="Egen skivhĂ¶jd" value={values.customBoardHeight} baseUnit="mm" unit={unit} onChange={(customBoardHeight) => onChange({ customBoardHeight })} />
          </ToolGrid>
        )}
      </div>
    );
  }

  if (toolId === "panel") {
    return (
      <ToolGrid>
        <ToolSelect label="Paneltyp" value={values.panelType} onChange={(panelType) => onChange({ panelType })} options={["Lockpanel", "StĂĄende panel", "Liggande panel"]} />
        <SurfaceAreaFields values={values} unit={unit} onChange={onChange} modes={["manual", "wall"]} />
        <ToolLength label="TĂ¤ckande bredd" value={values.coverWidth} baseUnit="mm" unit={unit} onChange={(coverWidth) => onChange({ coverWidth })} />
        <ToolLength label="Overlap / lockpanel" value={values.overlap} baseUnit="mm" unit={unit} onChange={(overlap) => onChange({ overlap })} />
        <ToolLength label="CC mĂĄtt" value={values.cc} baseUnit="mm" unit={unit} onChange={(cc) => onChange({ cc })} />
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
          <ToolSelect label="Typ av regel" value={values.studType} onChange={(studType) => onChange({ studType })} options={["trĂ¤reglar", "metallreglar"]} />
          <ToolLength label="VĂ¤gglĂ¤ngd" value={values.wallLength} baseUnit="m" unit={unit} onChange={(wallLength) => onChange({ wallLength })} />
          <ToolLength label="VĂ¤gghĂ¶jd" value={values.wallHeight} baseUnit="m" unit={unit} onChange={(wallHeight) => onChange({ wallHeight })} />
          <ToolLength label="CC mĂĄtt" value={values.cc} baseUnit="mm" unit={unit} onChange={(cc) => onChange({ cc })} />
          <ToolNumber label="Antal Ă¶ppningar" value={values.openings} onChange={(openings) => onChange({ openings })} step={1} />
          <ToolNumber label="Spill %" value={values.waste} onChange={(waste) => onChange({ waste })} />
        </ToolGrid>

        <ToolGrid>
          <ToolSelect label="Regeldimension" value={values.dimension} onChange={(dimension) => onChange({ dimension })} options={studDimensions} />
          {values.studType === "metallreglar" ? (
            <ToolLength label="LĂ¤ngd stĂĄende metallregel" value={values.metalStudLength} baseUnit="m" unit={unit} onChange={(metalStudLength) => onChange({ metalStudLength })} />
          ) : (
            <ToolSelect label="LĂ¤ngd trĂ¤regel" value={values.studLength} onChange={(studLength) => onChange({ studLength })} options={studLengths.map(String)} />
          )}
        </ToolGrid>

        {values.dimension === "custom" && (
          <ToolGrid>
            <ToolLength label="Custom bredd" value={values.customWidth} baseUnit="mm" unit={unit} onChange={(customWidth) => onChange({ customWidth })} />
            <ToolLength label="Custom djup" value={values.customDepth} baseUnit="mm" unit={unit} onChange={(customDepth) => onChange({ customDepth })} />
          </ToolGrid>
        )}

        <ToolCheckbox label="Dubbel regel vid Ă¶ppning" checked={values.doubleStudAtOpening} onChange={(doubleStudAtOpening) => onChange({ doubleStudAtOpening })} />

        <ToolSelect
          label="Ă–verliggare"
          value={values.headerType}
          onChange={(headerType) => onChange({ headerType })}
          options={["single", "double"]}
          optionLabels={["Enkel Ă¶verliggare", "Dubbel Ă¶verliggare"]}
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
        <ToolNumber label="Ă…tgĂĄng kg/mm/mÂ˛" value={values.consumptionPerMm} onChange={(consumptionPerMm) => onChange({ consumptionPerMm })} />
        <ToolNumber label="SĂ¤ckstorlek kg" value={values.bagWeight} onChange={(bagWeight) => onChange({ bagWeight })} />
        <ToolNumber label="Spill %" value={values.waste} onChange={(waste) => onChange({ waste })} />
      </ToolGrid>
    );
  }

  return (
    <ToolGrid>
      <ToolSelect label="Typ" value={values.type} onChange={(type) => onChange({ type })} options={["vĂ¤gg", "tak", "golv"]} />
      <SurfaceAreaFields values={values} unit={unit} onChange={onChange} modes={["manual", "wall", "floor"]} />
      <ToolLength label="Tjocklek" value={values.thickness} baseUnit="mm" unit={unit} onChange={(thickness) => onChange({ thickness })} />
      <ToolNumber label="Spill %" value={values.waste} onChange={(waste) => onChange({ waste })} />
    </ToolGrid>
  );
}

function SurfaceAreaFields({ values, unit, onChange, modes }) {
  const options = modes;
  const labels = modes.map((mode) => {
    if (mode === "wall") return "BerĂ¤kna lĂ¤ngd Ă— hĂ¶jd";
    if (mode === "floor") return "BerĂ¤kna lĂ¤ngd Ă— bredd";
    return "Ange mÂ˛ manuellt";
  });

  return (
    <div className="grid gap-4 sm:col-span-2">
      <ToolSelect
        label="YtberĂ¤kning"
        value={values.areaMode}
        onChange={(areaMode) => onChange({ areaMode })}
        options={options}
        optionLabels={labels}
      />

      {values.areaMode === "wall" || values.areaMode === "dimensions" ? (
        <ToolGrid>
          <ToolLength label="LĂ¤ngd" value={values.wallLength} baseUnit="m" unit={unit} onChange={(wallLength) => onChange({ wallLength })} />
          <ToolLength label="HĂ¶jd" value={values.wallHeight} baseUnit="m" unit={unit} onChange={(wallHeight) => onChange({ wallHeight })} />
        </ToolGrid>
      ) : values.areaMode === "floor" ? (
        <ToolGrid>
          <ToolLength label="LĂ¤ngd" value={values.length} baseUnit="m" unit={unit} onChange={(length) => onChange({ length })} />
          <ToolLength label="Bredd" value={values.width} baseUnit="m" unit={unit} onChange={(width) => onChange({ width })} />
        </ToolGrid>
      ) : (
        <ToolNumber label="Yta mÂ˛" value={values.area} onChange={(area) => onChange({ area })} />
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
        {t("MĂĄttenhet")}
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
