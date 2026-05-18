import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ChevronRight, FileDown, ShoppingCart, Trash2 } from "lucide-react";
import marcinByggLogo from "../assets/marcin-bygg-logo.png";
import { translateText, useI18n } from "../i18n";

const tools = [
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
    title: "Skruv & Spikåtgång",
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
  screws: {
    type: "trall",
    areaMode: "manual",
    area: 20,
    wallLength: 8,
    wallHeight: 2.5,
    length: 4,
    width: 5,
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
};

const screwRates = {
  trall: 35,
  panel: 25,
  gips: 18,
  konstruktion: 12,
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

const floorChipboardSizes = {
  "600 x 1800 mm": { width: 600, height: 1800 },
  "600 x 2400 mm": { width: 600, height: 2400 },
  custom: { width: 600, height: 1800 },
};

const studDimensions = ["45x70", "45x95", "45x120", "custom"];
const studLengths = [2.4, 3, 3.6, 4.2, 4.8, 5.4];
const ccOptions = ["cc300", "cc450", "cc600", "custom"];
const shoppingListStorageKey = "marcin-bygg-tools-shopping-list";

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
    .replaceAll("å", "a")
    .replaceAll("ä", "a")
    .replaceAll("ö", "o")
    .replaceAll("Å", "A")
    .replaceAll("Ä", "A")
    .replaceAll("Ö", "O")
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

function floorChipboardSize(values) {
  if (values.floorBoardType === "custom") {
    return {
      width: numberValue(values.customFloorBoardWidth),
      height: numberValue(values.customFloorBoardLength),
    };
  }

  return floorChipboardSizes[values.floorBoardType] || floorChipboardSizes["600 x 1800 mm"];
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
  const area = surfaceArea(values);
  const wasteMultiplier = 1 + numberValue(values.waste) / 100;

  if (values.type === "panel") {
    const panelWidthMeters = numberValue(values.panelWidth) / 1000;
    const ccMeters = Math.max(0.1, numberValue(values.panelCc) / 1000);
    const panelLinearMeters = panelWidthMeters > 0 ? area / panelWidthMeters : 0;
    const crossings = panelLinearMeters / ccMeters;
    const baseFasteners = Math.ceil(crossings * Math.max(1, numberValue(values.fastenersPerCrossing)));

    return {
      area,
      baseFasteners,
      finalFasteners: Math.ceil(baseFasteners * wasteMultiplier),
      panelLinearMeters,
      crossings: Math.ceil(crossings),
      mode: "panel",
    };
  }

  if (values.type === "golvspånskiva") {
    const size = floorChipboardSize(values);
    const boardArea = (numberValue(size.width) / 1000) * (numberValue(size.height) / 1000);
    const boards = boardArea > 0 ? Math.ceil(area / boardArea) : 0;
    const screwsPerRow = numberValue(values.screwSpacing) > 0
      ? Math.ceil(numberValue(size.height) / numberValue(values.screwSpacing)) + 1
      : 0;
    const screwsPerBoard = screwsPerRow * Math.max(1, Math.ceil(numberValue(values.screwRows)));
    const baseFasteners = screwsPerBoard * boards;

    return {
      area,
      size,
      boardArea,
      boards,
      screwsPerRow,
      screwsPerBoard,
      baseFasteners,
      finalFasteners: Math.ceil(baseFasteners * wasteMultiplier),
      mode: "golvspånskiva",
    };
  }

  const rate = screwRates[values.type] || screwRates.trall;
  const baseFasteners = Math.ceil(area * rate);

  return {
    area,
    rate,
    baseFasteners,
    finalFasteners: Math.ceil(baseFasteners * wasteMultiplier),
    mode: "standard",
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
    const materialName = values.type === "golvspånskiva"
      ? `Skruv till golvspånskiva ${values.floorBoardType === "custom" ? `${formatNumber(result.size.width)} x ${formatNumber(result.size.height)} mm` : values.floorBoardType}`
      : values.type === "panel"
        ? "Spik / skruv till panel / fasad"
        : `Skruv ${values.type}`;

    return [
      {
        name: materialName,
        quantity: result.finalFasteners,
        unit: "st",
        note: `Yta ${formatNumber(result.area)} m², spill ${formatNumber(values.waste)} %`,
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

  if (toolId === "screws") {
    const result = calculateScrews(values);

    if (result.mode === "panel") {
      return [
        ["Yta", `${formatNumber(result.area)} m²`],
        ["Löpmeter panel", `${formatNumber(result.panelLinearMeters)} lm`],
        ["Antal korsningar", `${result.crossings} st`],
        ["Infästningar före spill", `${result.baseFasteners} st`],
        ["Spill %", `${formatNumber(values.waste)} %`],
        ["Uppskattat antal spik/skruv", `${result.finalFasteners} st`],
      ];
    }

    if (result.mode === "golvspånskiva") {
      return [
        ["Yta", `${formatNumber(result.area)} m²`],
        ["Antal golvspånskivor", `${result.boards} st`],
        ["Skruv per rad", `${result.screwsPerRow} st`],
        ["Skruv per skiva", `${result.screwsPerBoard} st`],
        ["Infästningar före spill", `${result.baseFasteners} st`],
        ["Spill %", `${formatNumber(values.waste)} %`],
        ["Uppskattat antal spik/skruv", `${result.finalFasteners} st`],
      ];
    }

    return [
      ["Skruvåtgång", `${result.finalFasteners} st`],
      ["Beräkning", `${result.rate} st/m²`],
      ["Spill %", `${formatNumber(values.waste)} %`],
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
  const activeTool = tools.find((tool) => tool.id === selectedTool);

  useEffect(() => {
    localStorage.setItem(shoppingListStorageKey, JSON.stringify(shoppingItems));
  }, [shoppingItems]);

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

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tools.map((tool) => (
          <button
            key={tool.id}
            type="button"
            onClick={() => setSelectedTool(tool.id)}
            className="relative z-10 flex min-h-24 w-full touch-manipulation items-center justify-between rounded-3xl border border-zinc-800 bg-zinc-900 p-5 text-left transition active:scale-[0.99]"
          >
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-orange-400">
                {translateText(tool.group, language)}
              </p>

              <h2 className="mt-2 text-xl font-black">
                {translateText(tool.title, language)}
              </h2>

              <p className="mt-1 text-sm text-zinc-400">
                {translateText(tool.description, language)}
              </p>
            </div>

            <ChevronRight className="shrink-0 text-orange-400" />
          </button>
        ))}
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

function ToolDetail({ tool, values, unit, onUnitChange, onChange, onAddToShoppingList, onBack }) {
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
            {t("Lägg till i inköpslista")}
          </button>
        </div>
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

  if (toolId === "screws") {
    return (
      <div className="grid gap-4">
        <ToolSelect label="Typ" value={values.type} onChange={(type) => onChange({ type })} options={["trall", "panel", "gips", "konstruktion", "golvspånskiva"]} optionLabels={["trall", "Panel / fasad", "gips", "konstruktion", "Golvspånskiva"]} />
        <SurfaceAreaFields values={values} unit={unit} onChange={onChange} modes={["manual", "floor", "wall"]} />
        {values.type === "panel" && (
          <ToolGrid>
            <ToolLength label="Bredd panel" value={values.panelWidth} baseUnit="mm" unit={unit} onChange={(panelWidth) => onChange({ panelWidth })} />
            <ToolLength label="CC mått bakomliggande reglar/läkt" value={values.panelCc} baseUnit="mm" unit={unit} onChange={(panelCc) => onChange({ panelCc })} />
            <ToolNumber label="Antal infästningar per korsning" value={values.fastenersPerCrossing} onChange={(fastenersPerCrossing) => onChange({ fastenersPerCrossing })} step={1} />
            <ToolNumber label="Spill %" value={values.waste} onChange={(waste) => onChange({ waste })} />
          </ToolGrid>
        )}
        {values.type === "golvspånskiva" && (
          <div className="grid gap-4">
            <ToolGrid>
              <ToolSelect label="Skivdimension" value={values.floorBoardType} onChange={(floorBoardType) => onChange({ floorBoardType })} options={Object.keys(floorChipboardSizes)} />
              <ToolNumber label="Antal skruvrader" value={values.screwRows} onChange={(screwRows) => onChange({ screwRows })} step={1} />
              <ToolLength label="Avstånd mellan skruv" value={values.screwSpacing} baseUnit="mm" unit={unit} onChange={(screwSpacing) => onChange({ screwSpacing })} />
              <ToolNumber label="Spill %" value={values.waste} onChange={(waste) => onChange({ waste })} />
            </ToolGrid>
            {values.floorBoardType === "custom" && (
              <ToolGrid>
                <ToolLength label="Egen skivbredd" value={values.customFloorBoardWidth} baseUnit="mm" unit={unit} onChange={(customFloorBoardWidth) => onChange({ customFloorBoardWidth })} />
                <ToolLength label="Egen skivlängd" value={values.customFloorBoardLength} baseUnit="mm" unit={unit} onChange={(customFloorBoardLength) => onChange({ customFloorBoardLength })} />
              </ToolGrid>
            )}
          </div>
        )}
        {!["panel", "golvspånskiva"].includes(values.type) && (
          <ToolNumber label="Spill %" value={values.waste} onChange={(waste) => onChange({ waste })} />
        )}
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
