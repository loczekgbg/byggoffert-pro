export const packageSizes = [50, 100, 250, 500, 1000];

const records = [
  ["infastning.interior", "infastning.floor", "22 mm Golvspånskiva", "22 mm", "Elförzinkad", ["Kamspik 2,8 x 60"], "Skivor ska spikas med högst 300 i fält och högst 150 vid fog längs alla regelunderstödda kanter.", 25, "st/m2", "", "perM2"],
  ["infastning.interior", "infastning.floor", "13 mm Golvgipsskiva", "13 mm", "Elförzinkad", ["Huggen gipsspik 2,4 x 35"], "150 längs gipsskivans kanter och i gipsskivans mitt 200", [20, 22], "st/m2", "Spikradavstånd högst 600", "perM2"],
  ["infastning.interior", "infastning.floor", "14 mm Golvbräda", "14 mm", "Varmförzinkad", ["Dyckert 2,0 x 50"], "400", 25, "st/m2", "Skråspikas i 45° vinkel på brädans fjädersida.", "perM2"],
  ["infastning.interior", "infastning.floor", "20–22 mm Golvbräda", "20–22 mm", "Varmförzinkad", ["Dyckert 2,3 x 60"], "600", 15, "st/m2", "Skråspikas i 45° vinkel på brädans fjädersida.", "perM2"],
  ["infastning.interior", "infastning.floor", "25 mm Golvbräda", "25 mm", "Varmförzinkad", ["Dyckert 2,3 x 60"], "600", 15, "st/m2", "Skråspikas i 45° vinkel på brädans fjädersida.", "perM2"],
  ["infastning.interior", "infastning.floor", "30 mm Golvbräda", "30 mm", "Varmförzinkad", ["Dyckert 2,8 x 75"], "600", 15, "st/m2", "Skråspikas i 45° vinkel på brädans fjädersida.", "perM2"],
  ["infastning.interior", "infastning.wallCeiling", "12–15 mm Invändig panelbräda", "12–15 mm", "Varmförzinkad", ["Dyckert 1,7 x 40"], "600", 17, "st/m2", "Elförzinkad spik smutsar ned panel vid uppsättning.", "perM2"],
  ["infastning.interior", "infastning.wallCeiling", "21 mm Invändig panelbräda", "21 mm", "Varmförzinkad", ["Dyckert 2,0 x 50"], "600", 17, "st/m2", "Elförzinkad spik smutsar ned panel vid uppsättning.", "perM2"],
  ["infastning.interior", "infastning.wallCeiling", "12 mm List", "12 mm", "Elförzinkad, mässing, gulförzinkad, våtlackerad", ["Dyckert 1,4 x 30"], "400", 3, "st/lm", "", "perLinearMeter"],
  ["infastning.interior", "infastning.wallCeiling", "13 mm Normal gipsskiva, 1 lager", "13 mm", "Elförzinkad", ["Huggen gipsspik 2,4 x 35"], "150 längs gipsskivans kanter och i gipsskivans mitt 200.", [20, 22], "st/m2", "Spikradavstånd högst 450 för 900 skivbredd och högst 600 för skivbredd 1200.", "perM2"],
  ["infastning.interior", "infastning.wallCeiling", "13 mm Normal gipsskiva, 2 lager", "13 mm", "Elförzinkad", ["Huggen gipsspik 2,4 x 50"], "150 längs gipsskivans kanter och i gipsskivans mitt 200.", [20, 22], "st/m2", "Spikradavstånd högst 450 för 900 skivbredd och högst 600 för skivbredd 1200.", "perM2"],
  ["infastning.interior", "infastning.wallCeiling", "11 mm OSB-skiva", "11 mm", "Elförzinkad", ["Kamspik 2,3 x 35"], "150 längs skivans kanter och i skivans mitt 300.", [20, 22], "st/m2", "Spikradavstånd högst 600.", "perM2"],
  ["infastning.interior", "infastning.wallCeiling", "12 mm Spånskiva/plywoodskiva", "12 mm", "Elförzinkad", ["Dyckert huggen 2,0 x 35"], "100 längs skivans kanter och i skivans mitt 150–200.", [30, 32], "st/m2", "Spikradavstånd högst 600.", "perM2"],
  ["infastning.interior", "infastning.wallCeiling", "19 mm Spånskiva/plywoodskiva", "19 mm", "Elförzinkad", ["Dyckert huggen 2,0 x 50"], "100 längs skivans kanter och i skivans mitt 150–200.", [30, 32], "st/m2", "Spikradavstånd högst 600.", "perM2"],
  ["infastning.interior", "infastning.wallCeiling", "19 mm Hård/medelhård träfiberskiva", "19 mm", "Elförzinkad", ["Dyckert huggen 2,0 x 40"], "75–100 längs skivans kanter och i skivans mitt 175–200.", [38, 40], "st/m2", "Spikradavstånd högst 600.", "perM2"],
  ["infastning.interior", "infastning.wallCeiling", "22 mm Glespanel", "22 mm", "Varmförzinkad", ["Trådspik 2,8 x 75"], "400", [7, 11], "st/m2", "2 spik i varje stödpunkt.", "perM2"],
  ["infastning.interior", "infastning.wallCeiling", "28 mm Glespanel", "28 mm", "Varmförzinkad", ["Trådspik 2,8 x 75"], "400", [7, 11], "st/m2", "2 spik i varje stödpunkt.", "perM2"],
  ["infastning.exterior", "infastning.deckFence", "22 mm Trall", "22 mm", "Rostfri syrafast A4", ["Kamspik 2,3 x 45"], "400", [47, 24], "st/m2", "", "perM2"],
  ["infastning.exterior", "infastning.deckFence", "28 mm Trall", "28 mm", "Rostfri syrafast A4", ["Kamspik 2,5 x 60"], "600", [35, 17], "st/m2", "", "perM2"],
  ["infastning.exterior", "infastning.deckFence", "34 mm Trall", "34 mm", "Rostfri syrafast A4", ["Kamspik 3,1 x 75"], "600–800", [35, 17], "st/m2", "", "perM2"],
  ["infastning.exterior", "infastning.deckFence", "22 mm Staketbräda", "22 mm", "Varmförzinkad, rostfri syrafast A4", ["Trådspik 2,8 x 75", "Panelspik 2,8 x 55"], "", [20, 58], "st/lm", "2 spik i varje korsningspunkt. Antal spik räknat på 2 tvärreglar.", "perLinearMeter"],
  ["infastning.exterior", "infastning.deckFence", "34 mm Överliggare", "34 mm", "Rostfri syrafast A4", ["Trådspik 3,4 x 100", "Kamspik 3,1 x 75"], "400", 4, "st/lm", "", "perLinearMeter"],
  ["infastning.exterior", "infastning.wall", "45 mm Regelverk", "45 mm", "Varmförzinkad", ["Trådspik 3,4 x 100"], "", 6, "st/lm", "Infästes enligt ritning.", "perLinearMeter"],
  ["infastning.exterior", "infastning.wall", "9 mm Utvändig gipsskiva", "9 mm", "Varmförzinkad", ["Pappspik 2,5 x 25"], "150 längs gipsskivans kanter och i gipsskivans mitt 200.", [20, 22], "st/m2", "Spikradavstånd högst 450 för 900 skivbredd och högst 600 för skivbredd 1200.", "perM2"],
  ["infastning.exterior", "infastning.wall", "28 mm Spikregel för utvändig panelbräda", "28 mm", "Varmförzinkad", ["Trådspik 2,8 x 75"], "600", 9, "st/m2", "2 spik i varje korsningspunkt.", "perM2"],
  ["infastning.exterior", "infastning.wall", "34 mm Spikregel för utvändig panelbräda", "34 mm", "Varmförzinkad", ["Trådspik 3,4 x 100"], "600", 9, "st/m2", "2 spik i varje korsningspunkt.", "perM2"],
  ["infastning.exterior", "infastning.wall", "22 mm Utvändig panelbräda", "22 mm", "Varmförzinkad, rostfri syrafast A4", ["Panelspik 2,8 x 48", "Panelspik 2,8 x 55"], "", 35, "st/m2", "För spikregel ≥ 28 / För spikregel ≥ 34", "perM2"],
  ["infastning.exterior", "infastning.wall", "22 mm Lockbräda", "22 mm", "Varmförzinkad, rostfri syrafast A4", ["Panelspik 2,8 x 70", "Panelspik 2,8 x 75"], "", 35, "st/m2", "För spikregel ≥ 28 / För spikregel ≥ 34", "perM2"],
  ["infastning.exterior", "infastning.wall", "22 mm Lockläkt", "22 mm", "Varmförzinkad, rostfri syrafast A4", ["Panelspik 2,8 x 70", "Panelspik 2,8 x 75"], "", 15, "st/m2", "För spikregel ≥ 28 / För spikregel ≥ 34", "perM2"],
  ["infastning.exterior", "infastning.wall", "22 mm Knutbräda", "22 mm", "Varmförzinkad, rostfri syrafast A4", ["Panelspik 2,8 x 75", "Dyckert 2,3 x 60"], "600", 3, "st/lm", "Fästs till väggstomme med panelspik. Knutbrädorna spikas ihop med dyckert.", "perLinearMeter"],
  ["infastning.exterior", "infastning.wall", "22 mm Foder", "22 mm", "Varmförzinkad, rostfri syrafast A4", ["Panelspik 2,8 x 75"], "", 30, "st/m2", "", "perM2"],
  ["infastning.exterior", "infastning.roof", "20 mm Underlagsspont", "20 mm", "Varmförzinkad", ["Trådspik 2,3 x 60"], "", [15, 20], "st/m2", "", "perM2"],
  ["infastning.exterior", "infastning.roof", "23 mm Underlagsspont", "23 mm", "Varmförzinkad", ["Trådspik 2,8 x 75"], "", [15, 20], "st/m2", "", "perM2"],
  ["infastning.exterior", "infastning.roof", "Underlagspapp", "", "Varmförzinkad", ["Pappspik 2,8 x 20"], "", 30, "st/m2", "", "perM2"],
  ["infastning.exterior", "infastning.roof", "25 mm Ströläkt", "25 mm", "Varmförzinkad", ["Trådspik 1,7 x 40"], "250", 10, "st/m2", "", "perM2"],
  ["infastning.exterior", "infastning.roof", "25 mm Bärläkt", "25 mm", "Varmförzinkad", ["Trådspik 2,8 x 75"], "310–375", 10, "st/m2", "1 spik i varje korsningspunkt.", "perM2"],
  ["infastning.exterior", "infastning.roof", "45 mm Fribärande bärläkt", "45 mm", "Varmförzinkad", ["Trådspik 3,4 x 100"], "310–375", 20, "st/m2", "2 spik i varje stödpunkt.", "perM2"],
  ["infastning.exterior", "infastning.roof", "45 mm Nockplanka", "45 mm", "Varmförzinkad", ["Trådspik 4,0 x 125"], "1200", 2, "st/lm", "2 spik i varje takstol.", "perLinearMeter"],
  ["infastning.exterior", "infastning.roof", "Nedre och yttre pannrad", "", "Rostfri syrafast A4", ["Trådspik 3,4 x 100", "Kamspik 3,1 x 75"], "", 2, "st/m2", "", "perM2"],
  ["infastning.exterior", "infastning.roof", "Nockpanna", "", "Rostfri syrafast A4", ["Trådspik 3,4 x 100"], "", 3, "st/lm", "", "perLinearMeter"],
  ["infastning.exterior", "infastning.roof", "22 mm Inbrädning av taksprång", "22 mm", "Varmförzinkad, rostfri syrafast A4", ["Panelspik 2,8 x 55"], "", [15, 20], "st/m2", "", "perM2"],
  ["infastning.exterior", "infastning.roof", "22 mm Vindskiva", "22 mm", "Varmförzinkad", ["Trådspik 2,8 x 75"], "150", 8, "st/lm", "Ihopspikas sicksackvis.", "perLinearMeter"],
  ["infastning.exterior", "infastning.roof", "22 mm Vattbräda", "22 mm", "Rostfri syrafast A4", ["Trådspik 2,3 x 60", "Kamspik 2,3 x 50"], "200", 6, "st/lm", "", "perLinearMeter"],
];

export const fastenerEnvironments = [
  { id: "infastning.interior", categories: ["infastning.floor", "infastning.wallCeiling"] },
  { id: "infastning.exterior", categories: ["infastning.deckFence", "infastning.wall", "infastning.roof"] },
];

export const fasteners = records.map((record, index) => ({
  id: `fastener-${index + 1}`,
  environment: record[0],
  category: record[1],
  material: record[2],
  thickness: record[3],
  surfaceTreatment: record[4],
  fasteners: record[5],
  ccMax: record[6],
  usage: Array.isArray(record[7]) ? { min: record[7][0], max: record[7][1] } : { value: record[7] },
  unit: record[8],
  notes: record[9],
  calculationType: record[10],
}));

function containsScrew(value) {
  return /skruv/i.test(value);
}

function containsNail(value) {
  return /spik|dyckert/i.test(value);
}

export const fastenerService = {
  environments: () => fastenerEnvironments,
  categoriesForEnvironment: (environment) => fastenerEnvironments.find((item) => item.id === environment)?.categories || [],
  materialsFor: (environment, category) => fasteners.filter((item) => item.environment === environment && item.category === category),
  find: (id) => fasteners.find((item) => item.id === id) || fasteners[0],
};

export const replacementService = {
  resolveFasteners(record, requestedType = "original") {
    if (!record) return [];
    if (requestedType === "original") return record.fasteners;

    const requestedMatches = requestedType === "skruv" ? containsScrew : containsNail;
    const sameType = record.fasteners.filter(requestedMatches);

    if (sameType.length > 0) return sameType;

    return record.fasteners.map((item) => {
      if (requestedType === "skruv") {
        return item
          .replace(/Kamspik/gi, "Skruv")
          .replace(/Trådspik/gi, "Skruv")
          .replace(/Panelspik/gi, "Panelskruv")
          .replace(/Pappspik/gi, "Pappskruv")
          .replace(/Huggen gipsspik/gi, "Gipsskruv")
          .replace(/Dyckert huggen/gi, "Skruv")
          .replace(/Dyckert/gi, "Skruv");
      }

      return item
        .replace(/Panelskruv/gi, "Panelspik")
        .replace(/Pappskruv/gi, "Pappspik")
        .replace(/Gipsskruv/gi, "Huggen gipsspik")
        .replace(/Skruv/gi, "Spik");
    });
  },
};

function usageBounds(usage) {
  if (usage?.min !== undefined && usage?.max !== undefined) {
    const first = Number(usage.min) || 0;
    const second = Number(usage.max) || 0;

    return { min: Math.min(first, second), max: Math.max(first, second), isRange: true };
  }

  const value = Number(usage?.value) || 0;
  return { min: value, max: value, isRange: false };
}

export const usageCalculatorService = {
  calculate(record, values) {
    const usage = usageBounds(record.usage);
    const baseMeasure = (() => {
      if (record.unit === "st/lm") return Number(values.linearMeters) || 0;
      if (record.unit === "st/punkt") return Number(values.points) || 0;
      if (record.unit === "st/korsningspunkt") return Number(values.crossingPoints) || 0;
      return Number(values.area) || 0;
    })();
    const waste = Math.max(0, Number(values.waste) || 0);
    const multiplier = 1 + waste / 100;
    const min = Math.ceil(baseMeasure * usage.min);
    const max = Math.ceil(baseMeasure * usage.max);
    const finalMin = Math.ceil(min * multiplier);
    const finalMax = Math.ceil(max * multiplier);

    return {
      baseMeasure,
      usage,
      needed: { min, max, isRange: usage.isRange },
      final: { min: finalMin, max: finalMax, isRange: usage.isRange },
      waste,
    };
  },
};

function choosePackages(quantity) {
  let remaining = Math.max(0, Math.ceil(quantity));
  const packages = [];

  [...packageSizes].reverse().forEach((size) => {
    const count = Math.floor(remaining / size);
    if (count > 0) {
      packages.push({ size, count });
      remaining -= count * size;
    }
  });

  if (remaining > 0) {
    const size = packageSizes.find((item) => item >= remaining) || packageSizes[packageSizes.length - 1];
    packages.push({ size, count: 1 });
  }

  const purchased = packages.reduce((sum, item) => sum + item.size * item.count, 0);

  return {
    packages,
    packageCount: packages.reduce((sum, item) => sum + item.count, 0),
    purchased,
    surplus: purchased - Math.ceil(quantity),
  };
}

export const packageCalculatorService = {
  calculate(quantity) {
    return choosePackages(quantity);
  },
};
