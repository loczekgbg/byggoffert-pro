import { useState } from "react";

import {
  Calculator,
  Folder,
  User,
  Hammer,
  Settings,
  Menu,
  ArrowLeft,
} from "lucide-react";

import Card from "./components/Card";
import Option from "./components/Option";
import PriceCard from "./components/PriceCard";
import CategoriesScreen from "./screens/CategoriesScreen";
import marcinByggLogo from "./assets/marcin-bygg-logo.png";
import { formatPrice } from "./utils/formatPrice";

export default function App() {

  const [screen, setScreen] = useState("home");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [savedOffers, setSavedOffers] = useState(() => loadSavedOffers());

  const saveOffer = (offer) => {
    const nextOffers = [
      offer,
      ...savedOffers,
    ];

    setSavedOffers(nextOffers);
    localStorage.setItem("snickareOffers", JSON.stringify(nextOffers));
  };

  if (screen === "categories") {
    return (
      <CategoriesScreen
        goBack={() => setScreen("home")}
        openCategory={(category) => {
  setSelectedCategory(category);
  setScreen("calculator");
}}
      />
    );
  }

  if (screen === "calculator") {
    return (
      <CategoryCalculator
  key={selectedCategory}
  category={selectedCategory}
  goBack={() => setScreen("categories")}
  onSaveOffer={saveOffer}
/>
    );
  }

  if (screen === "history") {
    return (
      <HistoryScreen
        goBack={() => setScreen("home")}
        offers={savedOffers}
      />
    );
  }

  return (
    <div className="min-h-[100dvh] overflow-x-hidden bg-black text-white">

      {/* HERO */}
      <div className="relative h-[420px] overflow-hidden">

        <img
          src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-30"
        />

        <div className="pointer-events-none absolute inset-0 bg-black/70" />

        <div className="relative z-10 p-6">

          <div className="flex justify-between items-center">

            <button type="button" className="relative z-10 touch-manipulation rounded-2xl border border-zinc-800 bg-zinc-900/80 p-3">
              <Menu size={24} />
            </button>

            <button type="button" className="relative z-10 touch-manipulation rounded-2xl border border-zinc-800 bg-zinc-900/80 p-3">
              <Settings size={22} />
            </button>

          </div>

          <div className="mt-12">

            <img
              src={marcinByggLogo}
              alt="Marcin Bygg"
              className="h-40 w-40 rounded-[2rem] object-contain shadow-2xl shadow-orange-500/20 sm:h-44 sm:w-44"
            />

            <p className="text-zinc-300 mt-8 max-w-xs leading-relaxed">
              Professionell snickarservice för hem och företag.
            </p>

          </div>
        </div>
      </div>

      {/* GRID */}
      <div className="relative z-20 -mt-14 px-6">

        <div className="grid grid-cols-2 gap-4">

          <Card
            onClick={() => setScreen("categories")}
            icon={<Calculator size={34} />}
            title="Ny offert"
            text="Skapa nytt kostnadsförslag"
          />

          <Card
            onClick={() => setScreen("history")}
            icon={<Folder size={34} />}
            title="Historik"
            text="Sparade offerter"
          />

          <Card
            icon={<User size={34} />}
            title="Kunder"
            text="Hantera kunder"
          />

          <Card
            icon={<Hammer size={34} />}
            title="Material"
            text="Priser & material"
          />

        </div>

      </div>

      {/* CONTACT */}
      <div className="mt-10 px-6 pb-[calc(2.5rem+env(safe-area-inset-bottom))]">

        <div className="bg-orange-500 rounded-3xl p-6 text-black">

          <p className="font-bold text-sm">
            KONTAKTA MIG IDAG
          </p>

          <h2 className="text-4xl font-black mt-2">
            076 320 5125
          </h2>

        </div>

      </div>

    </div>
  );
}

function loadSavedOffers() {
  try {
    return JSON.parse(localStorage.getItem("snickareOffers")) || [];
  } catch {
    return [];
  }
}

function HistoryScreen({ offers, goBack }) {
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
            Historik
          </h1>

          <p className="text-orange-400">
            Sparade offerter
          </p>

        </div>

        <img
          src={marcinByggLogo}
          alt="Marcin Bygg"
          className="ml-auto h-12 w-12 rounded-2xl object-contain shadow-xl shadow-orange-500/20"
        />

      </div>

      {offers.length === 0 ? (

        <div className="mt-10 rounded-3xl border border-orange-400/30 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-8 text-center shadow-2xl shadow-orange-500/10">

          <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-400">
            Inga offerter
          </p>

          <h2 className="mt-3 text-3xl font-black">
            Historiken är tom
          </h2>

          <p className="mt-3 text-zinc-400">
            Sparade offerter visas här när du trycker på Spara offert.
          </p>

        </div>

      ) : (

        <div className="mt-10 flex flex-col gap-5">

          {offers.map((offer) => (

            <article
              key={offer.id}
              className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl shadow-black/30"
            >

              <div className="border-b border-white/10 bg-gradient-to-r from-zinc-900 to-black p-5">

                <div className="flex items-start justify-between gap-4">

                  <div>

                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-400">
                      {formatOfferDate(offer.date)}
                    </p>

                    <h2 className="mt-2 text-2xl font-black">
                      {offer.customer?.name || "Inte angivet"}
                    </h2>

                    <p className="mt-1 text-sm text-zinc-400">
                      {offer.displayCategory || offer.category} · {offer.area !== null && offer.area !== undefined ? `${formatArea(offer.area)} · ` : ""}{offer.peopleCount || 1} {(offer.peopleCount || 1) === 1 ? "person" : "personer"}
                    </p>

                  </div>

                  <div className="text-right">

                    <p className="text-xs uppercase text-zinc-500">
                      Normal
                    </p>

                    <p className="text-xl font-black text-orange-400">
                      {formatPrice(offer.prices?.normal || 0)}
                    </p>

                  </div>

                </div>

              </div>

              <div className="grid gap-4 p-5">

                <div className="grid gap-3 text-sm sm:grid-cols-3">

                  <SummaryRow label="Telefon" value={offer.customer?.phone || "Inte angivet"} />
                  <SummaryRow label="Adress" value={offer.customer?.address || "Inte angivet"} />
                  <SummaryRow label="Anteckningar" value={offer.customer?.notes || "Inga anteckningar"} />

                </div>

                <div>

                  <h3 className="text-xs font-bold uppercase tracking-wide text-zinc-500">
                    Valda alternativ
                  </h3>

                  <div className="mt-3 flex flex-wrap gap-2">

                    {offer.options.length > 0 ? offer.options.map((option) => (

                      <span
                        key={`${offer.id}-${option.id}`}
                        className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-bold text-zinc-200"
                      >
                        {option.title}
                      </span>

                    )) : (

                      <span className="text-sm text-zinc-500">
                        Inga valda alternativ
                      </span>

                    )}

                  </div>

                </div>

                {offer.extraCosts?.length > 0 && (
                  <div>

                    <h3 className="text-xs font-bold uppercase tracking-wide text-zinc-500">
                      Extra kostnader
                    </h3>

                    <div className="mt-3 flex flex-wrap gap-2">

                      {offer.extraCosts.map((cost) => (

                        <span
                          key={`${offer.id}-${cost.id}`}
                          className="rounded-full border border-orange-400/20 bg-orange-500/10 px-3 py-2 text-xs font-bold text-orange-200"
                        >
                          {cost.name || "Extra kostnad"} · {formatPrice(cost.priceValue)}
                        </span>

                      ))}

                    </div>

                  </div>
                )}

                <div className="grid grid-cols-3 overflow-hidden rounded-2xl border border-white/10 text-center">

                  <HistoryPrice label="MIN" value={offer.prices?.min || 0} />
                  <HistoryPrice label="NORMAL" value={offer.prices?.normal || 0} highlight />
                  <HistoryPrice label="PREMIUM" value={offer.prices?.premium || 0} />

                </div>

              </div>

            </article>

          ))}

        </div>

      )}

    </div>
  );
}

function formatOfferDate(date) {
  return new Date(date).toLocaleDateString("sv-SE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function HistoryPrice({ label, value, highlight = false }) {
  return (
    <div className={`p-4 ${highlight ? "bg-orange-500 text-black" : "bg-black/40 text-white"}`}>
      <p className={`text-[10px] font-black ${highlight ? "text-black/60" : "text-zinc-500"}`}>
        {label}
      </p>

      <p className="mt-1 text-sm font-black">
        {formatPrice(value)}
      </p>
    </div>
  );
}

function calculateWeeklyAvailableHours(availability) {
  const weekdayHours = Math.max(0, Number(availability.weekdayEveningHours) || 0);
  const weekdayCount = Math.max(0, Number(availability.weekdayEveningsPerWeek) || 0);
  const weekendHours = Math.max(0, Number(availability.weekendDayHours) || 0);
  const weekendCount = Math.max(0, Number(availability.weekendDaysPerWeek) || 0);

  return (weekdayHours * weekdayCount) + (weekendHours * weekendCount);
}

function formatHours(hours) {
  const roundedHours = Math.round(hours * 10) / 10;

  return `${roundedHours.toLocaleString("sv-SE")} h`;
}

function formatArea(area) {
  const roundedArea = Math.round((Number(area) || 0) * 10) / 10;

  return `${roundedArea.toLocaleString("sv-SE")} m²`;
}

function formatEstimatedCalendarTime(totalWorkHours, weeklyAvailableHours) {
  if (totalWorkHours <= 0 || weeklyAvailableHours <= 0) {
    return "Ej angivet";
  }

  const weeks = totalWorkHours / weeklyAvailableHours;

  if (weeks >= 1) {
    const roundedWeeks = Math.max(1, Math.round(weeks * 10) / 10);

    return `ca ${roundedWeeks.toLocaleString("sv-SE")} ${roundedWeeks === 1 ? "vecka" : "veckor"}`;
  }

  const calendarDaysPerWeek = 7;
  const days = Math.max(1, Math.floor(weeks * calendarDaysPerWeek + 0.4));

  return `ca ${days} ${days === 1 ? "dag" : "dagar"}`;
}

function parseLocalDate(dateValue) {
  if (!dateValue) {
    return null;
  }

  const [year, month, day] = dateValue.split("-").map(Number);

  if (!year || !month || !day) {
    return null;
  }

  return new Date(year, month - 1, day);
}

function formatLongDate(date) {
  return date.toLocaleDateString("sv-SE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function calculateEstimatedEndDate(startDate, totalWorkHours, weeklyAvailableHours) {
  const parsedStartDate = parseLocalDate(startDate);

  if (!parsedStartDate || totalWorkHours <= 0 || weeklyAvailableHours <= 0) {
    return "";
  }

  const calendarDays = Math.max(1, Math.ceil((totalWorkHours / weeklyAvailableHours) * 7));
  const endDate = new Date(parsedStartDate);

  endDate.setDate(endDate.getDate() + calendarDays);

  return `ca ${formatLongDate(endDate)}`;
}

const defaultCalculatorOptions = [
  {
    id: "stairs",
    title: "Trappa",
    price: ({ active }) => (active ? 4000 : 0),
  },
  {
    id: "pergola",
    title: "Pergola",
    price: ({ active }) => (active ? 12000 : 0),
  },
  {
    id: "customerMaterial",
    title: "Kund står för material",
    defaultActive: true,
    price: ({ area, active }) => (active ? 0 : area * 350),
  },
  {
    id: "waste",
    title: "Avfallshantering",
    price: ({ active }) => (active ? 2500 : 0),
  },
];

const fixedCostOptions = [
  {
    id: "delivery",
    title: "Leverans från butik",
    price: 800,
  },
  {
    id: "trailer",
    title: "Släpvagn",
    price: 1000,
  },
];

const altanPergolaDefaultPrices = {
  deckingOnlyPerSquareMeter: 180,
  repairPerSquareMeter: 220,
  newFramePerSquareMeter: 280,
  simpleRailingsPerSquareMeter: 100,
  premiumRailingsPerSquareMeter: 180,
  simpleStairsFixed: 2000,
};

const paintingDefaultPrices = {
  spacklingPerSquareMeter: 70,
  sandingPerSquareMeter: 35,
  primerPerSquareMeter: 55,
  maskingPerSquareMeter: 25,
  wallPaintingPerSquareMeter: 120,
  ceilingPaintingPerSquareMeter: 140,
  standardWallpaperPerSquareMeter: 160,
  patternWallpaperPerSquareMeter: 220,
  difficultWallpaperPerSquareMeter: 280,
  facadePaintingPerSquareMeter: 160,
  facadeWashPerSquareMeter: 35,
  scrapingPerSquareMeter: 85,
  facadePrimerPerSquareMeter: 75,
  furnitureProtectionFixed: 800,
  darkColorPerSquareMeter: 45,
  multipleColorsPerSquareMeter: 65,
  accentWallFixed: 1200,
  scaffoldingFixed: 4500,
  liftFixed: 3500,
};

const interiorWallsCeilingsDefaultPrices = {
  studWallPerSquareMeter: 260,
  plasterWallPerSquareMeter: 220,
  osbPlasterPerSquareMeter: 320,
  wallInsulationPerSquareMeter: 120,
  plasterCeilingPerSquareMeter: 260,
  panelCeilingPerSquareMeter: 300,
  droppedCeilingPerSquareMeter: 380,
  spotlightsFixed: 1800,
  ceilingInsulationPerSquareMeter: 140,
};

const floorDefaultPrices = {
  laminatePerSquareMeter: 200,
  woodFloorPerSquareMeter: 260,
  parquetPerSquareMeter: 300,
  herringbonePerSquareMeter: 620,
  underlayPerSquareMeter: 55,
  chipboardPerSquareMeter: 180,
  levelingPerSquareMeter: 120,
  selfLevelingCompoundPerSquareMeter: 160,
  difficultSkirtingFixed: 1800,
  thresholdsFixed: 1200,
  doorPipeAdaptationFixed: 1600,
};

const demolitionDefaultHourlyRate = 200;

function isDemolitionOption(option) {
  return String(option.title || "").toLowerCase().includes("rivning");
}

function normalizeCalculatorOption(option) {
  if (!isDemolitionOption(option)) {
    return option;
  }

  return {
    ...option,
    pricingControl: "hourly",
    defaultHourlyRate: option.defaultHourlyRate ?? demolitionDefaultHourlyRate,
    hourlyRateLabel: option.hourlyRateLabel || "Timpris rivning",
    costType: option.costType || "work",
  };
}

function isPergolaOption(option) {
  const optionTitle = String(option.title || "").toLowerCase();

  return option.id === "pergola" || option.id === "pergolaRoof" || optionTitle.includes("pergola");
}

function getPaintingDisplayCategory(options, isOptionActive) {
  const activeLabels = [];
  const hasPainting = options.some((option) => {
    return ["wallPainting", "ceilingPainting"].includes(option.id) && isOptionActive(option);
  });
  const hasWallpaper = options.some((option) => {
    return ["standardWallpaper", "patternWallpaper", "difficultWallpaper"].includes(option.id) && isOptionActive(option);
  });
  const hasTrimPainting = options.some((option) => {
    return option.id === "trimPainting" && isOptionActive(option);
  });
  const hasFacadePainting = options.some((option) => {
    return option.id === "facadePainting" && isOptionActive(option);
  });

  if (hasPainting) {
    activeLabels.push("Målning");
  }

  if (hasWallpaper) {
    activeLabels.push("Tapetsering");
  }

  if (hasTrimPainting) {
    activeLabels.push("Snickerimålning");
  }

  if (hasFacadePainting) {
    activeLabels.push("Fasadmålning");
  }

  return activeLabels.length > 0 ? activeLabels.join(" & ") : "Målning & Tapetsering";
}

function getInteriorWallsCeilingsDisplayCategory(options, isOptionActive) {
  const wallOptionIds = ["studWall", "plasterWall", "osbPlasterWall", "wallInsulation", "wallDemolition"];
  const ceilingOptionIds = ["plasterCeiling", "panelCeiling", "droppedCeiling", "spotlights", "ceilingInsulation", "ceilingDemolition"];
  const hasWalls = options.some((option) => {
    return wallOptionIds.includes(option.id) && isOptionActive(option);
  });
  const hasCeilings = options.some((option) => {
    return ceilingOptionIds.includes(option.id) && isOptionActive(option);
  });

  if (hasWalls && hasCeilings) {
    return "Innerväggar & Innertak";
  }

  if (hasWalls) {
    return "Innerväggar";
  }

  if (hasCeilings) {
    return "Innertak";
  }

  return "Innerväggar & Innertak";
}

function getFloorDisplayCategory(options, isOptionActive) {
  const floorOptionIds = ["laminateFloor", "woodFloor", "parquetFloor", "herringboneFloor"];
  const hasFloor = options.some((option) => {
    return floorOptionIds.includes(option.id) && isOptionActive(option);
  });
  const hasHerringbone = options.some((option) => {
    return option.id === "herringboneFloor" && isOptionActive(option);
  });
  const hasParquet = options.some((option) => {
    return option.id === "parquetFloor" && isOptionActive(option);
  });
  const hasSkirting = options.some((option) => {
    return ["floorSkirting", "thresholds", "doorPipeAdaptation"].includes(option.id) && isOptionActive(option);
  });

  if (!hasFloor && hasSkirting) {
    return "Lister";
  }

  let displayName = "Golv & Lister";

  if (hasHerringbone) {
    displayName = "Fiskbensparkett";
  } else if (hasParquet) {
    displayName = "Parkettläggning";
  }

  return hasSkirting ? `${displayName} & lister` : displayName;
}

function getBaseCategory(category) {
  if (category === "Målning & Tapetsering") {
    return "Målning & Tapeter";
  }

  if (["Väggar & Tak", "Innerväggar & Innertak"].includes(category)) {
    return "Innerväggar & Innertak";
  }

  if (["Golv", "Golv & Lister"].includes(category)) {
    return "Golv & Lister";
  }

  return category;
}

function getDisplayCategory(category, options, isOptionActive) {
  const baseCategory = getBaseCategory(category);

  if (baseCategory === "Målning & Tapeter") {
    return getPaintingDisplayCategory(options, isOptionActive);
  }

  if (baseCategory === "Innerväggar & Innertak") {
    return getInteriorWallsCeilingsDisplayCategory(options, isOptionActive);
  }

  if (baseCategory === "Golv & Lister") {
    return getFloorDisplayCategory(options, isOptionActive);
  }

  if (baseCategory !== "Altan & Pergola") {
    return category;
  }

  const hasActivePergolaOption = options.some((option) => {
    return isPergolaOption(option) && isOptionActive(option);
  });

  return hasActivePergolaOption ? "Altan & Pergola" : "Altan";
}

const calculatorConfigs = {
  default: {
    basePrice: (area) => area * 600,
    options: defaultCalculatorOptions,
  },
  "Målning & Tapeter": {
    basePrice: () => 0,
    usesCustomFixedCosts: true,
    sections: [
      {
        title: "Förarbete",
        options: [
          {
            id: "paintingSpackling",
            title: "Spackling",
            pricingControl: "work",
            areaControl: "surface",
            defaultFastPrice: (area) => area * paintingDefaultPrices.spacklingPerSquareMeter,
          },
          {
            id: "paintingSanding",
            title: "Slipning",
            pricingControl: "work",
            areaControl: "surface",
            defaultFastPrice: (area) => area * paintingDefaultPrices.sandingPerSquareMeter,
          },
          {
            id: "paintingPrimer",
            title: "Grundmålning",
            pricingControl: "work",
            areaControl: "surface",
            defaultFastPrice: (area) => area * paintingDefaultPrices.primerPerSquareMeter,
          },
          {
            id: "paintingMasking",
            title: "Maskering",
            pricingControl: "work",
            areaControl: "surface",
            defaultFastPrice: (area) => area * paintingDefaultPrices.maskingPerSquareMeter,
          },
          {
            id: "oldWallpaperRemoval",
            title: "Rivning av gammal tapet",
          },
        ],
      },
      {
        title: "Målning",
        options: [
          {
            id: "wallPainting",
            title: "Väggmålning",
            defaultActive: true,
            pricingControl: "work",
            areaControl: "surface",
            defaultFastPrice: (area) => area * paintingDefaultPrices.wallPaintingPerSquareMeter,
          },
          {
            id: "ceilingPainting",
            title: "Takmålning",
            pricingControl: "work",
            areaControl: "surface",
            defaultFastPrice: (area) => area * paintingDefaultPrices.ceilingPaintingPerSquareMeter,
          },
          {
            id: "trimPainting",
            title: "Snickerimålning",
            pricingControl: "hourly",
            costType: "work",
          },
          {
            id: "facadePainting",
            title: "Fasadmålning",
            pricingControl: "work",
            areaControl: "facade",
            defaultFastPrice: (area) => area * paintingDefaultPrices.facadePaintingPerSquareMeter,
            defaultEstimatedHours: (area) => Math.max(1, Math.round(area / 12)),
          },
          {
            id: "facadeWash",
            title: "Tvätt av fasad",
            pricingControl: "work",
            areaControl: "facade",
            defaultFastPrice: (area) => area * paintingDefaultPrices.facadeWashPerSquareMeter,
            defaultEstimatedHours: (area) => Math.max(1, Math.round(area / 25)),
          },
          {
            id: "facadeScraping",
            title: "Skrapning",
            pricingControl: "work",
            areaControl: "facade",
            defaultFastPrice: (area) => area * paintingDefaultPrices.scrapingPerSquareMeter,
            defaultEstimatedHours: (area) => Math.max(1, Math.round(area / 10)),
          },
          {
            id: "facadePrimer",
            title: "Grundmålning fasad",
            pricingControl: "work",
            areaControl: "facade",
            defaultFastPrice: (area) => area * paintingDefaultPrices.facadePrimerPerSquareMeter,
            defaultEstimatedHours: (area) => Math.max(1, Math.round(area / 16)),
          },
        ],
      },
      {
        title: "Tapetsering",
        options: [
          {
            id: "standardWallpaper",
            title: "Standard tapet",
            pricingControl: "work",
            areaControl: "surface",
            defaultFastPrice: (area) => area * paintingDefaultPrices.standardWallpaperPerSquareMeter,
          },
          {
            id: "patternWallpaper",
            title: "Mönsterpassning",
            pricingControl: "work",
            areaControl: "surface",
            defaultFastPrice: (area) => area * paintingDefaultPrices.patternWallpaperPerSquareMeter,
          },
          {
            id: "difficultWallpaper",
            title: "Svår tapet",
            pricingControl: "work",
            areaControl: "surface",
            defaultFastPrice: (area) => area * paintingDefaultPrices.difficultWallpaperPerSquareMeter,
          },
        ],
      },
      {
        title: "Färgtyp & Svårighetsgrad",
        options: [
          {
            id: "whiteLightColor",
            title: "Vit / ljus färg",
            defaultActive: true,
            price: () => 0,
          },
          {
            id: "normalColor",
            title: "Normal färg",
            price: () => 0,
          },
          {
            id: "darkColor",
            title: "Mörk färg",
            pricingControl: "work",
            areaControl: "surface",
            defaultFastPrice: (area) => area * paintingDefaultPrices.darkColorPerSquareMeter,
            defaultEstimatedHours: (area) => Math.max(1, Math.round(area / 20)),
          },
          {
            id: "multipleColors",
            title: "Flera färger",
            pricingControl: "work",
            areaControl: "surface",
            defaultFastPrice: (area) => area * paintingDefaultPrices.multipleColorsPerSquareMeter,
            defaultEstimatedHours: (area) => Math.max(1, Math.round(area / 15)),
          },
          {
            id: "accentWall",
            title: "Accentvägg",
            pricingControl: "work",
            defaultFastPrice: () => paintingDefaultPrices.accentWallFixed,
            defaultEstimatedHours: () => 2,
          },
        ],
      },
      {
        title: "Extra",
        options: [
          {
            id: "furnitureProtection",
            title: "Möbelskydd",
            pricingControl: "work",
            defaultFastPrice: () => paintingDefaultPrices.furnitureProtectionFixed,
          },
          {
            id: "paintingMaterialPurchase",
            title: "Materialinköp",
            pricingControl: "hourly",
            costType: "work",
          },
          {
            id: "paintingMaterialHandling",
            title: "Materialhantering",
            pricingControl: "hourly",
            costType: "work",
          },
          {
            id: "paintingWasteRemoval",
            title: "Bortforsling av avfall",
            pricingControl: "hourly",
            costType: "work",
          },
          {
            id: "paintingMiscWork",
            title: "Övrigt arbete",
            pricingControl: "hourly",
            costType: "work",
          },
        ],
      },
      {
        title: "Extra kostnader",
        options: [
          {
            id: "scaffolding",
            title: "Ställning",
            pricingControl: "fixed",
            costType: "fixed",
            defaultFastPrice: () => paintingDefaultPrices.scaffoldingFixed,
          },
          {
            id: "lift",
            title: "Lift",
            pricingControl: "fixed",
            costType: "fixed",
            defaultFastPrice: () => paintingDefaultPrices.liftFixed,
          },
        ],
      },
    ],
  },
  "Innerväggar & Innertak": {
    basePrice: () => 0,
    usesCustomFixedCosts: true,
    sections: [
      {
        title: "Väggar",
        options: [
          {
            id: "studWall",
            title: "Regelvägg",
            pricingControl: "work",
            areaControl: "surface",
            defaultFastPrice: (area) => area * interiorWallsCeilingsDefaultPrices.studWallPerSquareMeter,
            defaultEstimatedHours: (area) => Math.max(1, Math.round(area / 8)),
          },
          {
            id: "plasterWall",
            title: "Gipsvägg",
            pricingControl: "work",
            areaControl: "surface",
            defaultFastPrice: (area) => area * interiorWallsCeilingsDefaultPrices.plasterWallPerSquareMeter,
            defaultEstimatedHours: (area) => Math.max(1, Math.round(area / 10)),
          },
          {
            id: "osbPlasterWall",
            title: "OSB + gips",
            pricingControl: "work",
            areaControl: "surface",
            defaultFastPrice: (area) => area * interiorWallsCeilingsDefaultPrices.osbPlasterPerSquareMeter,
            defaultEstimatedHours: (area) => Math.max(1, Math.round(area / 7)),
          },
          {
            id: "wallInsulation",
            title: "Isolering",
            pricingControl: "work",
            areaControl: "surface",
            defaultFastPrice: (area) => area * interiorWallsCeilingsDefaultPrices.wallInsulationPerSquareMeter,
            defaultEstimatedHours: (area) => Math.max(1, Math.round(area / 14)),
          },
          {
            id: "wallDemolition",
            title: "Rivning av vägg",
            areaControl: "surface",
          },
        ],
      },
      {
        title: "Innertak",
        options: [
          {
            id: "plasterCeiling",
            title: "Gipstak",
            pricingControl: "work",
            areaControl: "surface",
            defaultFastPrice: (area) => area * interiorWallsCeilingsDefaultPrices.plasterCeilingPerSquareMeter,
            defaultEstimatedHours: (area) => Math.max(1, Math.round(area / 8)),
          },
          {
            id: "panelCeiling",
            title: "Paneltak",
            pricingControl: "work",
            areaControl: "surface",
            defaultFastPrice: (area) => area * interiorWallsCeilingsDefaultPrices.panelCeilingPerSquareMeter,
            defaultEstimatedHours: (area) => Math.max(1, Math.round(area / 7)),
          },
          {
            id: "droppedCeiling",
            title: "Sänkt tak",
            pricingControl: "work",
            areaControl: "surface",
            defaultFastPrice: (area) => area * interiorWallsCeilingsDefaultPrices.droppedCeilingPerSquareMeter,
            defaultEstimatedHours: (area) => Math.max(1, Math.round(area / 6)),
          },
          {
            id: "spotlights",
            title: "Spotlights",
            pricingControl: "work",
            defaultFastPrice: () => interiorWallsCeilingsDefaultPrices.spotlightsFixed,
            defaultEstimatedHours: () => 4,
          },
          {
            id: "ceilingInsulation",
            title: "Isolering tak",
            pricingControl: "work",
            areaControl: "surface",
            defaultFastPrice: (area) => area * interiorWallsCeilingsDefaultPrices.ceilingInsulationPerSquareMeter,
            defaultEstimatedHours: (area) => Math.max(1, Math.round(area / 12)),
          },
          {
            id: "ceilingDemolition",
            title: "Rivning av gammalt tak",
            areaControl: "surface",
          },
        ],
      },
      {
        title: "Extra",
        options: [
          {
            id: "interiorMaterialPurchase",
            title: "Materialinköp",
            pricingControl: "hourly",
            costType: "work",
          },
          {
            id: "interiorMaterialHandling",
            title: "Materialhantering",
            pricingControl: "hourly",
            costType: "work",
          },
          {
            id: "interiorWasteRemoval",
            title: "Bortforsling av avfall",
            pricingControl: "hourly",
            costType: "work",
          },
          {
            id: "interiorMiscWork",
            title: "Övrigt arbete",
            pricingControl: "hourly",
            costType: "work",
          },
        ],
      },
    ],
  },
  "Golv & Lister": {
    basePrice: () => 0,
    usesCustomFixedCosts: true,
    sections: [
      {
        title: "Golvläggning",
        options: [
          {
            id: "laminateFloor",
            title: "Klickgolv / laminat inkl. lätta golvlister",
            defaultActive: true,
            pricingControl: "work",
            areaControl: "surface",
            defaultFastPrice: (area) => area * floorDefaultPrices.laminatePerSquareMeter,
            defaultEstimatedHours: (area) => Math.max(1, Math.round(area / 12)),
          },
          {
            id: "woodFloor",
            title: "Trägolv",
            pricingControl: "work",
            areaControl: "surface",
            defaultFastPrice: (area) => area * floorDefaultPrices.woodFloorPerSquareMeter,
            defaultEstimatedHours: (area) => Math.max(1, Math.round(area / 10)),
          },
          {
            id: "parquetFloor",
            title: "Parkett",
            pricingControl: "work",
            areaControl: "surface",
            defaultFastPrice: (area) => area * floorDefaultPrices.parquetPerSquareMeter,
            defaultEstimatedHours: (area) => Math.max(1, Math.round(area / 9)),
          },
          {
            id: "herringboneFloor",
            title: "Fiskben / avancerat mönster",
            pricingControl: "work",
            areaControl: "surface",
            defaultFastPrice: (area) => area * floorDefaultPrices.herringbonePerSquareMeter,
            defaultEstimatedHours: (area) => Math.max(1, Math.round(area / 5)),
          },
        ],
      },
      {
        title: "Förarbete",
        options: [
          {
            id: "removeOldFloor",
            title: "Rivning av gammalt golv",
            areaControl: "surface",
          },
          {
            id: "floorUnderlay",
            title: "Underlag / foam / lumppapp",
            pricingControl: "work",
            areaControl: "surface",
            defaultFastPrice: (area) => area * floorDefaultPrices.underlayPerSquareMeter,
            defaultEstimatedHours: (area) => Math.max(1, Math.round(area / 20)),
          },
          {
            id: "chipboardFloor",
            title: "Spånskiva",
            pricingControl: "work",
            areaControl: "surface",
            defaultFastPrice: (area) => area * floorDefaultPrices.chipboardPerSquareMeter,
            defaultEstimatedHours: (area) => Math.max(1, Math.round(area / 10)),
          },
          {
            id: "floorLeveling",
            title: "Nivellering / riktning av golv",
            pricingControl: "work",
            areaControl: "surface",
            defaultFastPrice: (area) => area * floorDefaultPrices.levelingPerSquareMeter,
            defaultEstimatedHours: (area) => Math.max(1, Math.round(area / 12)),
          },
          {
            id: "selfLevelingCompound",
            title: "Flytspackel",
            pricingControl: "work",
            areaControl: "surface",
            defaultFastPrice: (area) => area * floorDefaultPrices.selfLevelingCompoundPerSquareMeter,
            defaultEstimatedHours: (area) => Math.max(1, Math.round(area / 12)),
          },
        ],
      },
      {
        title: "Lister",
        options: [
          {
            id: "floorSkirting",
            title: "Svåra golvlister / många kapningar",
            pricingControl: "work",
            defaultFastPrice: () => floorDefaultPrices.difficultSkirtingFixed,
            defaultEstimatedHours: () => 4,
          },
          {
            id: "thresholds",
            title: "Trösklar",
            pricingControl: "work",
            defaultFastPrice: () => floorDefaultPrices.thresholdsFixed,
            defaultEstimatedHours: () => 2,
          },
          {
            id: "doorPipeAdaptation",
            title: "Anpassning runt dörrar / rör",
            pricingControl: "work",
            defaultFastPrice: () => floorDefaultPrices.doorPipeAdaptationFixed,
            defaultEstimatedHours: () => 3,
          },
        ],
      },
      {
        title: "Extra",
        options: [
          {
            id: "floorMaterialPurchase",
            title: "Materialinköp",
            pricingControl: "hourly",
            costType: "work",
          },
          {
            id: "floorMaterialHandling",
            title: "Materialhantering",
            pricingControl: "hourly",
            costType: "work",
          },
          {
            id: "floorWasteRemoval",
            title: "Bortforsling av avfall",
            pricingControl: "hourly",
            costType: "work",
          },
          {
            id: "floorMiscWork",
            title: "Övrigt arbete",
            pricingControl: "hourly",
            costType: "work",
          },
        ],
      },
    ],
  },
  "Altan & Pergola": {
    basePrice: () => 0,
    usesCustomFixedCosts: true,
    sections: [
      {
        title: "Konstruktion",
        options: [
          {
            id: "deckingOnly",
            title: "Endast trallbyte",
            defaultActive: true,
            excludes: ["newFrame"],
            pricingControl: "work",
            defaultFastPrice: (area) => area * altanPergolaDefaultPrices.deckingOnlyPerSquareMeter,
          },
          {
            id: "deckRepair",
            title: "Reparation",
            pricingControl: "work",
            defaultFastPrice: (area) => area * altanPergolaDefaultPrices.repairPerSquareMeter,
          },
          {
            id: "newFrame",
            title: "Ny stomme",
            excludes: ["deckingOnly"],
            pricingControl: "work",
            defaultFastPrice: (area) => area * altanPergolaDefaultPrices.newFramePerSquareMeter,
          },
          {
            id: "oldDeckDemolition",
            title: "Rivning av gammal altan / trall",
            costType: "work",
          },
        ],
      },
      {
        title: "Räcken",
        exclusive: true,
        options: [
          {
            id: "noRailings",
            title: "Inga räcken",
            defaultActive: true,
            price: () => 0,
          },
          {
            id: "simpleRailings",
            title: "Enkla räcken",
            pricingControl: "work",
            defaultFastPrice: (area) => area * altanPergolaDefaultPrices.simpleRailingsPerSquareMeter,
          },
          {
            id: "premiumRailings",
            title: "Premium räcken",
            pricingControl: "work",
            defaultFastPrice: (area) => area * altanPergolaDefaultPrices.premiumRailingsPerSquareMeter,
          },
        ],
      },
      {
        title: "Tillägg",
        options: [
          {
            id: "pergolaRoof",
            title: "Pergolatak",
            price: ({ area, active }) => (active ? area * 350 : 0),
          },
          {
            id: "deckStairs",
            title: "Enkel trappa",
            pricingControl: "work",
            defaultFastPrice: () => altanPergolaDefaultPrices.simpleStairsFixed,
          },
          {
            id: "groundPrep",
            title: "Markförberedelse",
            price: ({ area, active }) => (active ? area * 180 : 0),
          },
          {
            id: "woodTreatment",
            title: "Olja och träskydd",
            price: ({ area, active }) => (active ? area * 90 : 0),
          },
          {
            id: "complexDeck",
            title: "Komplicerad altan",
            price: ({ area, active }) => (active ? area * 300 : 0),
          },
          {
            id: "ledLighting",
            title: "LED-belysning",
            pricingControl: "hourly",
            costType: "work",
          },
          {
            id: "miscCarpentry",
            title: "Övrigt / diverse snickeriarbete",
            pricingControl: "hourly",
            costType: "work",
          },
        ],
      },
      {
        title: "Material & Logistik",
        options: [
          {
            id: "deckCustomerMaterial",
            title: "Kund står för material",
            defaultActive: true,
            price: () => 0,
          },
          {
            id: "materialPurchase",
            title: "Materialinköp",
            pricingControl: "hourly",
            costType: "work",
          },
          {
            id: "materialHandling",
            title: "Materialhantering",
            pricingControl: "hourly",
            costType: "work",
          },
          {
            id: "deckDelivery",
            title: "Leverans från butik",
            pricingControl: "fixed",
            costType: "fixed",
            defaultFastPrice: () => 800,
          },
          {
            id: "deckTrailer",
            title: "Släpvagn",
            pricingControl: "fixed",
            costType: "fixed",
            defaultFastPrice: () => 1000,
          },
          {
            id: "wasteRemoval",
            title: "Bortforsling av avfall",
            pricingControl: "hourly",
            costType: "work",
          },
        ],
      },
    ],
  },
};

function CategoryCalculator({ category, goBack, onSaveOffer }) {

  const [area, setArea] = useState(25);
  const [areaMode, setAreaMode] = useState("manual");
  const [deckDimensions, setDeckDimensions] = useState({
    length: "",
    width: "",
  });
  const [selectedOptions, setSelectedOptions] = useState({});
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
  });
  const [extraWork, setExtraWork] = useState({
    hours: 0,
    hourlyRate: 250,
  });
  const [temporaryExtraStaff, setTemporaryExtraStaff] = useState({
    active: false,
    people: 1,
    hours: 0,
    internalHourlyRate: 200,
    customerHourlyRate: 250,
  });
  const [peopleCount, setPeopleCount] = useState(1);
  const [availability, setAvailability] = useState({
    weekdayEveningHours: 4,
    weekdayEveningsPerWeek: 5,
    weekendDayHours: 8,
    weekendDaysPerWeek: 2,
  });
  const [startDate, setStartDate] = useState("");
  const [fixedCosts, setFixedCosts] = useState({});
  const [extraCosts, setExtraCosts] = useState([]);
  const [optionPricing, setOptionPricing] = useState({});
  const [optionMeasurements, setOptionMeasurements] = useState({});
  const [discount, setDiscount] = useState({
    active: false,
    percent: 0,
  });

  const baseCategory = getBaseCategory(category);
  const calculatorConfig = calculatorConfigs[baseCategory] || calculatorConfigs.default;
  const usesDimensionArea = baseCategory === "Altan & Pergola";
  const usesGlobalArea = !["Målning & Tapeter", "Innerväggar & Innertak", "Golv & Lister"].includes(baseCategory);
  const calculatorSections = (calculatorConfig.sections || [
    {
      options: calculatorConfig.options,
    },
  ]).map((section) => ({
    ...section,
    options: section.options.map(normalizeCalculatorOption),
  }));
  const calculatorOptions = calculatorSections.flatMap((section) => {
    return section.options.map((option) => ({
      ...option,
      sectionTitle: section.title,
      exclusive: section.exclusive ?? false,
      sectionOptionIds: section.options.map((sectionOption) => sectionOption.id),
    }));
  });

  const getOptionActive = (option) => {
    return selectedOptions[option.id] ?? option.defaultActive ?? false;
  };
  const displayCategory = getDisplayCategory(category, calculatorOptions, getOptionActive);

  const updateDeckDimension = (field, value) => {
    const nextDimensions = {
      ...deckDimensions,
      [field]: value,
    };
    const length = Math.max(0, Number(nextDimensions.length) || 0);
    const width = Math.max(0, Number(nextDimensions.width) || 0);

    setDeckDimensions(nextDimensions);
    setArea(Math.round(length * width * 10) / 10);
  };

  const getOptionMeasurement = (option) => {
    const measurement = optionMeasurements[option.id] || {};

    return {
      mode: measurement.mode || "manual",
      area: measurement.area ?? 0,
      length: measurement.length ?? "",
      height: measurement.height ?? "",
    };
  };

  const getOptionArea = (option) => {
    if (!option.areaControl) {
      return area;
    }

    const measurement = getOptionMeasurement(option);

    return Math.max(0, Number(measurement.area) || 0);
  };

  const updateOptionMeasurement = (optionId, values) => {
    setOptionMeasurements((currentMeasurements) => {
      const nextMeasurement = {
        mode: "manual",
        area: 0,
        length: "",
        height: "",
        ...(currentMeasurements[optionId] || {}),
        ...values,
      };

      if (nextMeasurement.mode === "dimensions" || values.length !== undefined || values.height !== undefined) {
        const length = Math.max(0, Number(nextMeasurement.length) || 0);
        const height = Math.max(0, Number(nextMeasurement.height) || 0);

        nextMeasurement.area = Math.round(length * height * 10) / 10;
      }

      return {
        ...currentMeasurements,
        [optionId]: nextMeasurement,
      };
    });
  };

  const getOptionPricing = (option) => {
    const pricing = optionPricing[option.id] || {};
    const pricingArea = getOptionArea(option);

    return {
      mode: pricing.mode || (option.pricingControl === "hourly" ? "hourly" : "fast"),
      fastPrice: pricing.fastPrice ?? option.defaultFastPrice?.(pricingArea) ?? 0,
      estimatedHours: pricing.estimatedHours ?? option.defaultEstimatedHours?.(pricingArea) ?? 0,
      hours: pricing.hours ?? 0,
      hourlyRate: pricing.hourlyRate ?? option.defaultHourlyRate ?? 250,
    };
  };

  const updateOptionPricing = (optionId, values) => {
    setOptionPricing((currentPricing) => ({
      ...currentPricing,
      [optionId]: {
        ...currentPricing[optionId],
        ...values,
      },
    }));
  };

  const addExtraCost = () => {
    setExtraCosts((currentCosts) => [
      ...currentCosts,
      {
        id: crypto.randomUUID(),
        name: "",
        description: "",
        price: 0,
      },
    ]);
  };

  const updateExtraCost = (costId, values) => {
    setExtraCosts((currentCosts) => currentCosts.map((cost) => (
      cost.id === costId ? { ...cost, ...values } : cost
    )));
  };

  const removeExtraCost = (costId) => {
    setExtraCosts((currentCosts) => currentCosts.filter((cost) => cost.id !== costId));
  };

  const calculateOptionPrice = (option, active) => {
    if (!active) {
      return 0;
    }

    if (!option.pricingControl) {
      return option.price({
        area,
        active,
      });
    }

    const pricing = getOptionPricing(option);
    const normalizedPeopleCount = Math.max(1, Number(peopleCount) || 1);

    if (pricing.mode === "hourly" || option.pricingControl === "hourly") {
      return Math.max(0, Number(pricing.hours) || 0) * Math.max(0, Number(pricing.hourlyRate) || 0) * normalizedPeopleCount;
    }

    return Math.max(0, Number(pricing.fastPrice) || 0);
  };

  const calculateOptionHours = (option, active) => {
    if (!active || !option.pricingControl) {
      return 0;
    }

    const pricing = getOptionPricing(option);

    if (pricing.mode === "hourly" || option.pricingControl === "hourly") {
      return Math.max(0, Number(pricing.hours) || 0) * normalizedPeopleCount;
    }

    return Math.max(0, Number(pricing.estimatedHours) || 0);
  };

  const toggleOption = (option) => {
    setSelectedOptions((currentOptions) => {
      const active = currentOptions[option.id] ?? option.defaultActive ?? false;

      if (option.exclusive) {
        const nextOptions = {
          ...currentOptions,
        };

        option.sectionOptionIds.forEach((optionId) => {
          nextOptions[optionId] = false;
        });

        return {
          ...nextOptions,
          [option.id]: true,
        };
      }

      if (!active && option.excludes) {
        const nextOptions = {
          ...currentOptions,
        };

        option.excludes.forEach((optionId) => {
          nextOptions[optionId] = false;
        });

        return {
          ...nextOptions,
          [option.id]: true,
        };
      }

      return {
        ...currentOptions,
        [option.id]: !active,
      };
    });
  };

  let workPrice = calculatorConfig.basePrice(area);
  let customFixedCostsTotal = 0;

  calculatorOptions.forEach((option) => {
    const optionPrice = calculateOptionPrice(option, getOptionActive(option));

    if (option.costType === "fixed") {
      customFixedCostsTotal += optionPrice;
    } else {
      workPrice += optionPrice;
    }
  });

  const normalizedPeopleCount = Math.max(1, Number(peopleCount) || 1);
  const extraWorkCost = Math.max(0, Number(extraWork.hours) || 0) * Math.max(0, Number(extraWork.hourlyRate) || 0) * normalizedPeopleCount;
  const extraWorkHours = Math.max(0, Number(extraWork.hours) || 0) * normalizedPeopleCount;
  const temporaryExtraStaffPeople = Math.max(0, Number(temporaryExtraStaff.people) || 0);
  const temporaryExtraStaffHours = Math.max(0, Number(temporaryExtraStaff.hours) || 0);
  const temporaryExtraStaffCustomerRate = Math.max(0, Number(temporaryExtraStaff.customerHourlyRate) || 0);
  const temporaryExtraStaffInternalRate = Math.max(0, Number(temporaryExtraStaff.internalHourlyRate) || 0);
  const temporaryExtraStaffWorkHours = temporaryExtraStaff.active ? temporaryExtraStaffPeople * temporaryExtraStaffHours : 0;
  const temporaryExtraStaffCost = temporaryExtraStaffWorkHours * temporaryExtraStaffCustomerRate;
  const temporaryExtraStaffInternalCost = temporaryExtraStaff.active ? temporaryExtraStaffPeople * temporaryExtraStaffHours * temporaryExtraStaffInternalRate : 0;
  const temporaryExtraStaffMargin = temporaryExtraStaffCost - temporaryExtraStaffInternalCost;

  workPrice += extraWorkCost;
  workPrice += temporaryExtraStaffCost;

  const optionWorkHours = calculatorOptions.reduce((totalHours, option) => {
    return totalHours + calculateOptionHours(option, getOptionActive(option));
  }, 0);
  const totalWorkHours = optionWorkHours + extraWorkHours + temporaryExtraStaffWorkHours;
  const weeklyAvailableHours = calculateWeeklyAvailableHours(availability);
  const estimatedCalendarTime = formatEstimatedCalendarTime(totalWorkHours, weeklyAvailableHours);
  const estimatedEndDate = calculateEstimatedEndDate(startDate, totalWorkHours, weeklyAvailableHours);

  const selectedFixedCostDetails = (calculatorConfig.usesCustomFixedCosts ? [] : fixedCostOptions)
    .filter((option) => fixedCosts[option.id])
    .map((option) => ({
      id: option.id,
      title: option.title,
      sectionTitle: "Fasta kostnader",
      priceValue: option.price,
    }));

  const extraCostDetails = extraCosts
    .map((cost) => ({
      ...cost,
      name: cost.name.trim(),
      description: cost.description.trim(),
      priceValue: Math.max(0, Number(cost.price) || 0),
    }))
    .filter((cost) => cost.name || cost.description || cost.priceValue > 0);

  const extraCostsTotal = extraCostDetails.reduce((total, cost) => {
    return total + cost.priceValue;
  }, 0);

  const fixedCostsTotal = selectedFixedCostDetails.reduce((total, option) => {
    return total + option.priceValue;
  }, customFixedCostsTotal + extraCostsTotal);

  const discountPercent = discount.active ? Math.max(0, Math.min(100, Number(discount.percent) || 0)) : 0;
  const discountAmount = Math.round(workPrice * (discountPercent / 100));
  const discountedWorkPrice = Math.max(0, workPrice - discountAmount);
  const normalPrice = Math.round(discountedWorkPrice + fixedCostsTotal);

  const selectedOptionDetails = [
    ...calculatorOptions
    .filter((option) => getOptionActive(option))
    .map((option) => ({
      ...option,
      priceValue: calculateOptionPrice(option, true),
      hoursValue: calculateOptionHours(option, true),
      costType: option.costType || "work",
      detailText: option.areaControl ? `Yta: ${formatArea(getOptionArea(option))}` : "",
    })),
    ...(extraWorkCost > 0 ? [{
      id: "extraWork",
      title: `Extra arbete (${extraWork.hours} timmar)`,
      sectionTitle: "Extra arbete",
      priceValue: extraWorkCost,
      hoursValue: extraWorkHours,
    }] : []),
    ...(temporaryExtraStaff.active && temporaryExtraStaffCost > 0 ? [{
      id: "temporaryExtraStaff",
      title: `Tillfällig extra personal (${temporaryExtraStaffPeople} × ${temporaryExtraStaffHours} timmar)`,
      sectionTitle: "Extra arbete",
      priceValue: temporaryExtraStaffCost,
      hoursValue: temporaryExtraStaffWorkHours,
    }] : []),
    ...selectedFixedCostDetails,
  ];

  const minPrice = Math.round((discountedWorkPrice * 0.85) + fixedCostsTotal);

  const premiumPrice = Math.round((discountedWorkPrice * 1.3) + fixedCostsTotal);

  const exportPdf = async () => {
    const logoImage = await loadPdfLogoImage();
    const pdfBlob = createOfferPdfBlob({
      area,
      showArea: usesGlobalArea,
      areaMode: usesDimensionArea ? areaMode : "manual",
      deckDimensions: usesDimensionArea ? deckDimensions : null,
      displayCategory,
      customer,
      minPrice,
      normalPrice,
      premiumPrice,
      selectedOptionDetails,
      extraCostDetails,
      extraCostsTotal,
      fixedCostsTotal,
      workPrice,
      peopleCount: normalizedPeopleCount,
      totalWorkHours,
      estimatedCalendarTime,
      startDate,
      estimatedEndDate,
      discountActive: discount.active,
      discountAmount,
      discountPercent,
      discountedWorkPrice,
      logoImage,
    });
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const downloadLink = document.createElement("a");

    downloadLink.href = pdfUrl;
    downloadLink.download = `snickare-offert-${new Date().toISOString().slice(0, 10)}.pdf`;
    document.body.append(downloadLink);
    downloadLink.click();
    downloadLink.remove();

    setTimeout(() => {
      URL.revokeObjectURL(pdfUrl);
    }, 1000);
  };

  const saveCurrentOffer = () => {
    onSaveOffer({
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      customer,
      category,
      displayCategory,
      area: usesGlobalArea ? area : null,
      areaMode: usesDimensionArea ? areaMode : "manual",
      deckDimensions: usesDimensionArea ? deckDimensions : null,
      peopleCount: normalizedPeopleCount,
      schedule: {
        startDate,
        availability,
        totalWorkHours,
        estimatedCalendarTime,
        estimatedEndDate,
        weeklyAvailableHours,
      },
      extraWork: {
        hours: Math.max(0, Number(extraWork.hours) || 0),
        hourlyRate: Math.max(0, Number(extraWork.hourlyRate) || 0),
        cost: extraWorkCost,
      },
      temporaryExtraStaff: {
        active: temporaryExtraStaff.active,
        people: temporaryExtraStaffPeople,
        hours: temporaryExtraStaffHours,
        internalHourlyRate: temporaryExtraStaffInternalRate,
        customerHourlyRate: temporaryExtraStaffCustomerRate,
        internalCost: temporaryExtraStaffInternalCost,
        customerPrice: temporaryExtraStaffCost,
        margin: temporaryExtraStaffMargin,
      },
      extraCosts: extraCostDetails.map((cost) => ({
        id: cost.id,
        name: cost.name,
        description: cost.description,
        priceValue: cost.priceValue,
      })),
      discount: {
        active: discount.active,
        percent: discountPercent,
        amount: discountAmount,
      },
      options: selectedOptionDetails.map((option) => ({
        id: option.id,
        title: option.title,
        sectionTitle: option.sectionTitle || "",
        priceValue: option.priceValue,
        hoursValue: option.hoursValue || 0,
      })),
      prices: {
        work: Math.round(workPrice),
        workAfterDiscount: Math.round(discountedWorkPrice),
        fixed: fixedCostsTotal,
        extraCosts: extraCostsTotal,
        min: minPrice,
        normal: normalPrice,
        premium: premiumPrice,
      },
    });
  };

  return (
    <div className="min-h-[100dvh] overflow-x-hidden bg-black p-6 pb-[calc(7rem+env(safe-area-inset-bottom))] text-white">

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
            {category}
          </h1>

          <p className="text-orange-400">
            Kostnadsberäkning
          </p>

        </div>

        <img
          src={marcinByggLogo}
          alt="Marcin Bygg"
          className="ml-auto h-12 w-12 rounded-2xl object-contain shadow-xl shadow-orange-500/20"
        />

      </div>

      <div className="mt-10 bg-zinc-900 rounded-3xl border border-zinc-800 p-6">

        {/* AREA */}
        {usesGlobalArea && (
        <div>

          {usesDimensionArea && (
            <div className="mb-4 grid grid-cols-2 gap-2 rounded-2xl border border-zinc-800 bg-black p-1">
              {[
                ["manual", "Ange m² manuellt"],
                ["dimensions", "Beräkna från mått"],
              ].map(([mode, label]) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setAreaMode(mode)}
                  className={`min-h-12 touch-manipulation rounded-xl px-3 text-sm font-black transition ${areaMode === mode ? "bg-orange-500 text-black" : "text-zinc-400"}`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {areaMode === "dimensions" && usesDimensionArea ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm text-zinc-400">
                Längd (m)

                <NumberStepper
                  value={deckDimensions.length}
                  onChange={(value) => updateDeckDimension("length", value)}
                  min={0}
                  step={0.1}
                />

              </label>

              <label className="text-sm text-zinc-400">
                Bredd (m)

                <NumberStepper
                  value={deckDimensions.width}
                  onChange={(value) => updateDeckDimension("width", value)}
                  min={0}
                  step={0.1}
                />

              </label>

              <div className="rounded-2xl border border-orange-400/20 bg-black p-4 sm:col-span-2">
                <p className="text-xs font-bold uppercase text-zinc-500">
                  Storlek m²
                </p>

                <p className="mt-2 text-3xl font-black text-orange-400">
                  {formatArea(area)}
                </p>
              </div>
            </div>
          ) : (
            <label className="text-sm text-zinc-400">
              Storlek m²

              <NumberStepper
                value={area}
                onChange={setArea}
                min={0}
                step={0.1}
              />

            </label>
          )}

        </div>
        )}

        {/* CUSTOMER */}
        <div className="mt-8 border-t border-zinc-800 pt-8">

          <h2 className="text-sm font-bold uppercase text-zinc-500">
            Kunduppgifter
          </h2>

          <div className="mt-4 grid gap-4">

            <CustomerField
              label="Namn"
              value={customer.name}
              onChange={(value) => setCustomer({ ...customer, name: value })}
            />

            <CustomerField
              label="Telefon"
              value={customer.phone}
              onChange={(value) => setCustomer({ ...customer, phone: value })}
            />

            <CustomerField
              label="Adress"
              value={customer.address}
              onChange={(value) => setCustomer({ ...customer, address: value })}
            />

            <CustomerField
              label="Anteckningar"
              value={customer.notes}
              onChange={(value) => setCustomer({ ...customer, notes: value })}
              multiline
            />

          </div>

        </div>

        {/* PEOPLE */}
        <div className="mt-8 border-t border-zinc-800 pt-8">

          <div className="flex items-end justify-between gap-4">

            <div>

              <h2 className="text-sm font-bold uppercase text-zinc-500">
                Bemanning
              </h2>

              <p className="mt-1 text-sm text-zinc-400">
                Timpris multipliceras med antal personer.
              </p>

            </div>

            <p className="text-right text-sm font-black text-orange-400">
              {normalizedPeopleCount} {normalizedPeopleCount === 1 ? "person" : "personer"}
            </p>

          </div>

          <label className="mt-4 block text-sm text-zinc-400">
            Antal personer

            <NumberStepper
              value={peopleCount}
              onChange={(value) => setPeopleCount(Math.max(1, Number(value) || 1))}
              min={1}
              step={1}
            />

          </label>

        </div>

        {/* OPTIONS */}
        <div className="mt-8 flex flex-col gap-4">

          {calculatorSections.map((section) => (

            <div key={section.title || "options"} className="flex flex-col gap-3">

              {section.title && (
                <h2 className="text-sm font-bold uppercase text-zinc-500">
                  {section.title}
                </h2>
              )}

              {section.options.map((option) => {
                const optionWithSection = {
                  ...option,
                  sectionTitle: section.title,
                  exclusive: section.exclusive ?? false,
                  sectionOptionIds: section.options.map((sectionOption) => sectionOption.id),
                };

                return (
                  <div key={option.id} className="flex flex-col gap-3">

                    <Option
                      title={option.title}
                      active={getOptionActive(optionWithSection)}
                      onClick={() => toggleOption(optionWithSection)}
                    />

                    {getOptionActive(optionWithSection) && optionWithSection.pricingControl && (
                      <OptionPricingFields
                        option={optionWithSection}
                        pricing={getOptionPricing(optionWithSection)}
                        onChange={(values) => updateOptionPricing(optionWithSection.id, values)}
                        measurement={getOptionMeasurement(optionWithSection)}
                        onMeasurementChange={(values) => updateOptionMeasurement(optionWithSection.id, values)}
                      />
                    )}

                  </div>
                );
              })}

            </div>

          ))}

        </div>

        {/* AVAILABILITY */}
        <div className="mt-8 border-t border-zinc-800 pt-8">

          <div className="flex items-end justify-between gap-4">

            <div>

              <h2 className="text-sm font-bold uppercase text-zinc-500">
                Tillgänglig arbetstid
              </h2>

              <p className="mt-1 text-sm text-zinc-400">
                Används för att räkna kalendertid kvällar och helger.
              </p>

            </div>

            <p className="text-right text-sm font-black text-orange-400">
              {weeklyAvailableHours} h/vecka
            </p>

          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">

            <label className="block text-sm text-zinc-400 sm:col-span-2">
              Startdatum

              <input
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-zinc-800 bg-black p-4 text-xl font-black text-white outline-none transition focus:border-orange-400"
              />

            </label>

            <AvailabilityInput
              label="Timmar per vardagskväll"
              value={availability.weekdayEveningHours}
              onChange={(value) => setAvailability({
                ...availability,
                weekdayEveningHours: value,
              })}
            />

            <AvailabilityInput
              label="Antal vardagskvällar per vecka"
              value={availability.weekdayEveningsPerWeek}
              onChange={(value) => setAvailability({
                ...availability,
                weekdayEveningsPerWeek: value,
              })}
            />

            <AvailabilityInput
              label="Timmar per helgdag"
              value={availability.weekendDayHours}
              onChange={(value) => setAvailability({
                ...availability,
                weekendDayHours: value,
              })}
            />

            <AvailabilityInput
              label="Antal helgdagar per vecka"
              value={availability.weekendDaysPerWeek}
              onChange={(value) => setAvailability({
                ...availability,
                weekendDaysPerWeek: value,
              })}
            />

          </div>

          <div className="mt-4 rounded-2xl border border-orange-400/20 bg-black p-4">
            <p className="text-xs font-bold uppercase text-zinc-500">
              Uppskattad tid
            </p>

            <p className="mt-2 text-xl font-black text-orange-400">
              {estimatedCalendarTime}
            </p>

            <p className="mt-1 text-sm text-zinc-400">
              Total arbetstid: {formatHours(totalWorkHours)}
            </p>

            {startDate && estimatedEndDate && (
              <p className="mt-3 text-sm font-bold text-white">
                Beräknat slutdatum: {estimatedEndDate}
              </p>
            )}
          </div>

        </div>

        {/* EXTRA WORK */}
        <div className="mt-8 border-t border-zinc-800 pt-8">

          <div className="flex items-end justify-between gap-4">

            <div>

              <h2 className="text-sm font-bold uppercase text-zinc-500">
                Extra arbete
              </h2>

              <p className="mt-1 text-sm text-zinc-400">
                Lägg till extra timmar utanför standardofferten.
              </p>

            </div>

            <p className="text-right text-sm font-black text-orange-400">
              {formatPrice(extraWorkCost)}
            </p>

          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">

            <label className="block text-sm text-zinc-400">
              Antal timmar

              <NumberStepper
                value={extraWork.hours}
                onChange={(value) => setExtraWork({
                  ...extraWork,
                  hours: value,
                })}
                min={0}
                step={1}
              />

            </label>

            <label className="block text-sm text-zinc-400">
              Timpris

              <NumberStepper
                value={extraWork.hourlyRate}
                onChange={(value) => setExtraWork({
                  ...extraWork,
                  hourlyRate: value,
                })}
                min={0}
                step={50}
              />

            </label>

          </div>

        </div>

        {/* TEMPORARY EXTRA STAFF */}
        <div className="mt-8 border-t border-zinc-800 pt-8">

          <div className="flex items-end justify-between gap-4">

            <div>

              <h2 className="text-sm font-bold uppercase text-zinc-500">
                Tillfällig extra personal
              </h2>

              <p className="mt-1 text-sm text-zinc-400">
                Lägg till extra personal för ett begränsat antal timmar.
              </p>

            </div>

            <p className="text-right text-sm font-black text-orange-400">
              {formatPrice(temporaryExtraStaffCost)}
            </p>

          </div>

          <div className="mt-4">
            <Option
              title="Lägg till tillfällig extra personal"
              active={temporaryExtraStaff.active}
              onClick={() => setTemporaryExtraStaff({
                ...temporaryExtraStaff,
                active: !temporaryExtraStaff.active,
              })}
            />
          </div>

          {temporaryExtraStaff.active && (
            <div className="mt-4 rounded-2xl border border-orange-400/20 bg-black/60 p-4">

              <div className="grid gap-4 sm:grid-cols-2">

                <PricingInput
                  label="Antal extra personer"
                  value={temporaryExtraStaff.people}
                  onChange={(value) => setTemporaryExtraStaff({
                    ...temporaryExtraStaff,
                    people: value,
                  })}
                />

                <PricingInput
                  label="Antal timmar"
                  value={temporaryExtraStaff.hours}
                  onChange={(value) => setTemporaryExtraStaff({
                    ...temporaryExtraStaff,
                    hours: value,
                  })}
                />

                <PricingInput
                  label="Kostnad per person internt"
                  value={temporaryExtraStaff.internalHourlyRate}
                  onChange={(value) => setTemporaryExtraStaff({
                    ...temporaryExtraStaff,
                    internalHourlyRate: value,
                  })}
                />

                <PricingInput
                  label="Pris till kund per person"
                  value={temporaryExtraStaff.customerHourlyRate}
                  onChange={(value) => setTemporaryExtraStaff({
                    ...temporaryExtraStaff,
                    customerHourlyRate: value,
                  })}
                />

              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
                  <p className="text-xs font-bold uppercase text-zinc-500">
                    Intern kostnad
                  </p>

                  <p className="mt-2 text-xl font-black text-white">
                    {formatPrice(temporaryExtraStaffInternalCost)}
                  </p>
                </div>

                <div className="rounded-2xl border border-orange-400/20 bg-zinc-950 p-4">
                  <p className="text-xs font-bold uppercase text-zinc-500">
                    Vinst / marginal
                  </p>

                  <p className="mt-2 text-xl font-black text-orange-400">
                    {formatPrice(temporaryExtraStaffMargin)}
                  </p>
                </div>
              </div>

            </div>
          )}

        </div>

        {!calculatorConfig.usesCustomFixedCosts && (
        <div className="mt-8 border-t border-zinc-800 pt-8">

          <div className="flex items-end justify-between gap-4">

            <div>

              <h2 className="text-sm font-bold uppercase text-zinc-500">
                Fasta kostnader
              </h2>

              <p className="mt-1 text-sm text-zinc-400">
                Dessa kostnader påverkas inte av rabatt.
              </p>

            </div>

            <p className="text-right text-sm font-black text-orange-400">
              {formatPrice(fixedCostsTotal)}
            </p>

          </div>

          <div className="mt-4 flex flex-col gap-3">

            {fixedCostOptions.map((option) => (

              <Option
                key={option.id}
                title={`${option.title} · ${formatPrice(option.price)}`}
                active={fixedCosts[option.id] || false}
                onClick={() => setFixedCosts({
                  ...fixedCosts,
                  [option.id]: !fixedCosts[option.id],
                })}
              />

            ))}

          </div>

        </div>
        )}

        {/* EXTRA COSTS */}
        <div className="mt-8 border-t border-zinc-800 pt-8">

          <div className="flex items-end justify-between gap-4">

            <div>

              <h2 className="text-sm font-bold uppercase text-zinc-500">
                Extra kostnader
              </h2>

              <p className="mt-1 text-sm text-zinc-400">
                Egna kostnader utan rabatt och utan arbetstid.
              </p>

            </div>

            <p className="text-right text-sm font-black text-orange-400">
              {formatPrice(extraCostsTotal)}
            </p>

          </div>

          <div className="mt-4 flex flex-col gap-4">

            {extraCosts.map((cost, index) => (

              <div
                key={cost.id}
                className="rounded-2xl border border-white/10 bg-black/60 p-4"
              >

                <div className="mb-4 flex items-center justify-between gap-3">
                  <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
                    Kostnad {index + 1}
                  </p>

                  <button
                    type="button"
                    onClick={() => removeExtraCost(cost.id)}
                    className="min-h-10 touch-manipulation rounded-xl border border-red-400/30 px-3 text-sm font-bold text-red-300 transition hover:bg-red-500/10"
                  >
                    Ta bort kostnad
                  </button>
                </div>

                <div className="grid gap-4">
                  <CustomerField
                    label="Namn"
                    value={cost.name}
                    onChange={(value) => updateExtraCost(cost.id, { name: value })}
                  />

                  <CustomerField
                    label="Beskrivning"
                    value={cost.description}
                    onChange={(value) => updateExtraCost(cost.id, { description: value })}
                    multiline
                  />

                  <PricingInput
                    label="Pris"
                    value={cost.price}
                    onChange={(value) => updateExtraCost(cost.id, { price: value })}
                  />
                </div>

              </div>

            ))}

            <button
              type="button"
              onClick={addExtraCost}
              className="min-h-12 touch-manipulation rounded-2xl border border-orange-400/40 bg-orange-500/10 px-4 text-sm font-black text-orange-300 transition hover:bg-orange-500/20"
            >
              Lägg till kostnad
            </button>

          </div>

        </div>

        {/* DISCOUNT */}
        <div className="mt-8 border-t border-zinc-800 pt-8">

          <Option
            title="Lägg till rabatt"
            active={discount.active}
            onClick={() => setDiscount({
              ...discount,
              active: !discount.active,
            })}
          />

          {discount.active && (
            <div className="mt-4 rounded-2xl border border-orange-400/20 bg-black/60 p-4">

              <PricingInput
                label="Rabatt %"
                value={discount.percent}
                onChange={(value) => setDiscount({
                  ...discount,
                  percent: value,
                })}
              />

              <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-zinc-950 p-4">
                <span className="text-sm text-zinc-400">
                  Rabatt på arbete
                </span>

                <span className="font-black text-orange-400">
                  -{formatPrice(discountAmount)}
                </span>
              </div>

            </div>
          )}

        </div>

        {/* RESULT */}
        <div className="mt-10 border-t border-zinc-800 pt-8">

          <div className="flex flex-col gap-5">

            <PriceCard
              label="MIN"
              value={minPrice}
              color="text-zinc-300"
            />

            <PriceCard
              label="NORMAL"
              value={normalPrice}
              color="text-orange-400"
            />

            <PriceCard
              label="PREMIUM"
              value={premiumPrice}
              color="text-red-400"
            />

          </div>

          <div className="mt-10 border-t border-zinc-800 pt-6">

            <div className="mb-6 grid gap-3">

              <div className="rounded-2xl border border-white/10 bg-black p-4">
                <p className="text-xs font-bold uppercase text-zinc-500">
                  Arbete före rabatt
                </p>

                <p className="mt-2 text-xl font-black text-white">
                  {formatPrice(workPrice)}
                </p>
              </div>

              {discount.active && (
                <div className="rounded-2xl border border-orange-400/20 bg-black p-4">
                  <p className="text-xs font-bold uppercase text-zinc-500">
                    Rabatt
                  </p>

                  <p className="mt-2 text-xl font-black text-orange-400">
                    -{formatPrice(discountAmount)}
                  </p>
                </div>
              )}

              <div className="rounded-2xl border border-white/10 bg-black p-4">
                <p className="text-xs font-bold uppercase text-zinc-500">
                  Arbete efter rabatt
                </p>

                <p className="mt-2 text-xl font-black text-white">
                  {formatPrice(discountedWorkPrice)}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black p-4">
                <p className="text-xs font-bold uppercase text-zinc-500">
                  Fasta kostnader
                </p>

                <p className="mt-2 text-xl font-black text-orange-400">
                  {formatPrice(fixedCostsTotal)}
                </p>
              </div>

              {extraCostsTotal > 0 && (
                <div className="rounded-2xl border border-orange-400/20 bg-black p-4">
                  <p className="text-xs font-bold uppercase text-zinc-500">
                    Extra kostnader
                  </p>

                  <p className="mt-2 text-xl font-black text-orange-400">
                    {formatPrice(extraCostsTotal)}
                  </p>
                </div>
              )}

              <div className="rounded-2xl border border-orange-400 bg-orange-500 p-4 text-black">
                <p className="text-xs font-bold uppercase text-black/60">
                  Totalt
                </p>

                <p className="mt-2 text-2xl font-black">
                  {formatPrice(normalPrice)}
                </p>
              </div>

            </div>

            <div className="flex justify-between">

              <span className="text-zinc-400">
                Antal personer
              </span>

              <span>
                {normalizedPeopleCount} {normalizedPeopleCount === 1 ? "person" : "personer"}
              </span>

            </div>

            <div className="mt-3 flex justify-between">

              <span className="text-zinc-400">
                Total arbetstid
              </span>

              <span>
                {formatHours(totalWorkHours)}
              </span>

            </div>

            <div className="mt-3 flex justify-between">

              <span className="text-zinc-400">
                Uppskattad tid
              </span>

              <span className="text-right">
                {estimatedCalendarTime}
              </span>

            </div>

            {startDate && estimatedEndDate && (
              <div className="mt-3 flex justify-between gap-4">

                <span className="text-zinc-400">
                  Beräknat slutdatum
                </span>

                <span className="text-right">
                  {estimatedEndDate}
                </span>

              </div>
            )}

          </div>

        </div>

      </div>

      <div className="mt-6 overflow-hidden rounded-3xl border border-orange-400/30 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black shadow-2xl shadow-orange-500/10">

        <div className="border-b border-white/10 bg-white/[0.03] p-6">

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">
            Offertöversikt
          </p>

          <div className="mt-3 flex items-end justify-between gap-4">

            <div>

              <h2 className="text-3xl font-black">
                {displayCategory}
              </h2>

              <p className="mt-1 text-sm text-zinc-400">
                {usesGlobalArea ? `${formatArea(area)} · ` : ""}{normalizedPeopleCount} {normalizedPeopleCount === 1 ? "person" : "personer"}
              </p>

            </div>

            <div className="text-right">

              <p className="text-xs uppercase text-zinc-500">
                Normalpris
              </p>

              <p className="text-3xl font-black text-orange-400">
                {formatPrice(normalPrice)}
              </p>

            </div>

            {extraCostDetails.length > 0 && (
              <div className="mt-6">

                <h3 className="text-sm font-bold uppercase text-zinc-500">
                  Extra kostnader
                </h3>

                <div className="mt-4 flex flex-col gap-3">

                  {extraCostDetails.map((cost) => (

                    <div
                      key={cost.id}
                      className="flex items-start justify-between gap-4 rounded-2xl border border-orange-400/20 bg-white/[0.03] px-4 py-3"
                    >

                      <div>

                        <p className="font-bold">
                          {cost.name || "Extra kostnad"}
                        </p>

                        {cost.description && (
                          <p className="text-xs text-zinc-500">
                            {cost.description}
                          </p>
                        )}

                      </div>

                      <span className="shrink-0 text-sm font-bold text-orange-300">
                        +{formatPrice(cost.priceValue)}
                      </span>

                    </div>

                  ))}

                </div>

              </div>
            )}

          </div>

        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-2">

          <div>

            <h3 className="text-sm font-bold uppercase text-zinc-500">
              Kund
            </h3>

            <div className="mt-4 space-y-3 text-sm">

              <SummaryRow label="Namn" value={customer.name || "Inte angivet"} />
              <SummaryRow label="Telefon" value={customer.phone || "Inte angivet"} />
              <SummaryRow label="Adress" value={customer.address || "Inte angivet"} />
              <SummaryRow label="Anteckningar" value={customer.notes || "Inga anteckningar"} />

            </div>

          </div>

          <div>

            <h3 className="text-sm font-bold uppercase text-zinc-500">
              Valda alternativ
            </h3>

            <div className="mt-4 flex flex-col gap-3">

              {selectedOptionDetails.map((option) => (

                <div
                  key={option.id}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
                >

                  <div>

                    <p className="font-bold">
                      {option.title}
                    </p>

                    {option.sectionTitle && (
                      <p className="text-xs text-zinc-500">
                        {option.sectionTitle}
                      </p>
                    )}

                    {option.detailText && (
                      <p className="text-xs text-zinc-500">
                        {option.detailText}
                      </p>
                    )}

                  </div>

                  <span className="text-sm font-bold text-orange-300">
                    {option.priceValue > 0 ? `+${formatPrice(option.priceValue)}` : "Ingår"}
                  </span>

                </div>

              ))}

            </div>

          </div>

        </div>

        <div className="grid gap-3 border-t border-white/10 p-6 sm:grid-cols-2">

          {usesGlobalArea && (
            <SummaryRow label="Storlek m²" value={formatArea(area)} />
          )}
          {usesGlobalArea && usesDimensionArea && areaMode === "dimensions" && (
            <SummaryRow
              label="Mått"
              value={`${deckDimensions.length || 0} m × ${deckDimensions.width || 0} m`}
            />
          )}
          <SummaryRow label="Total arbetstid" value={formatHours(totalWorkHours)} />
          <SummaryRow label="Uppskattad tid" value={estimatedCalendarTime} />
          {startDate && estimatedEndDate && (
            <SummaryRow label="Beräknat slutdatum" value={estimatedEndDate} />
          )}

        </div>

        <div className="grid gap-3 border-t border-white/10 p-6 sm:grid-cols-2">

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs font-bold uppercase text-zinc-500">
              Arbete före rabatt
            </p>

            <p className="mt-2 text-xl font-black text-white">
              {formatPrice(workPrice)}
            </p>
          </div>

          {discount.active && (
            <div className="rounded-2xl border border-orange-400/20 bg-white/[0.03] p-4">
              <p className="text-xs font-bold uppercase text-zinc-500">
                Rabatt
              </p>

              <p className="mt-2 text-xl font-black text-orange-400">
                -{formatPrice(discountAmount)}
              </p>
            </div>
          )}

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs font-bold uppercase text-zinc-500">
              Arbete efter rabatt
            </p>

            <p className="mt-2 text-xl font-black text-white">
              {formatPrice(discountedWorkPrice)}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs font-bold uppercase text-zinc-500">
              Fasta kostnader
            </p>

            <p className="mt-2 text-xl font-black text-orange-400">
              {formatPrice(fixedCostsTotal)}
            </p>
          </div>

          <div className="rounded-2xl border border-orange-400 bg-orange-500 p-4 text-black">
            <p className="text-xs font-bold uppercase text-black/60">
              Totalt
            </p>

            <p className="mt-2 text-2xl font-black">
              {formatPrice(normalPrice)}
            </p>
          </div>

        </div>

        <div className="grid grid-cols-3 border-t border-white/10 text-center">

          <SummaryPrice label="MIN" value={minPrice} />
          <SummaryPrice label="NORMAL" value={normalPrice} highlight />
          <SummaryPrice label="PREMIUM" value={premiumPrice} />

        </div>

      </div>

      <div className="sticky bottom-0 z-50 -mx-6 mt-5 grid gap-3 border-t border-white/10 bg-black/95 px-6 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl sm:grid-cols-3">

        <ActionButton onClick={saveCurrentOffer}>
          Spara offert
        </ActionButton>

        <ActionButton onClick={exportPdf}>
          Exportera PDF
        </ActionButton>

        <ActionButton onClick={goBack} variant="primary">
          Ny offert
        </ActionButton>

      </div>

    </div>
  );
}

function CustomerField({ label, value, onChange, multiline = false }) {
  const inputClassName = "mt-2 w-full rounded-2xl border border-zinc-800 bg-black p-4 text-white outline-none transition focus:border-orange-400";

  return (
    <label className="block text-sm text-zinc-400">
      {label}

      {multiline ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`${inputClassName} min-h-28 resize-none`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={inputClassName}
        />
      )}
    </label>
  );
}

function OptionPricingFields({ option, pricing, onChange, measurement, onMeasurementChange }) {
  const canChooseMode = option.pricingControl === "work";
  const useHourly = pricing.mode === "hourly" || option.pricingControl === "hourly";
  const areaLabel = option.areaControl === "facade" ? "Fasad m²" : "Yta m²";
  const secondDimensionLabel = option.areaControl === "facade" ? "Höjd (m)" : "Bredd (m)";

  return (
    <div className="rounded-2xl border border-orange-400/20 bg-black/60 p-4">

      {option.areaControl && (
        <div className="mb-4 rounded-2xl border border-white/10 bg-zinc-950 p-3">
          <div className="grid grid-cols-2 gap-2">
            {[
              ["manual", "Ange m² manuellt"],
              ["dimensions", "Beräkna från mått"],
            ].map(([mode, label]) => (
              <button
                key={mode}
                type="button"
                onClick={() => onMeasurementChange({ mode })}
                className={`min-h-11 rounded-xl border px-2 text-sm font-bold ${
                  measurement.mode === mode
                    ? "border-orange-400 bg-orange-500 text-black"
                    : "border-zinc-800 bg-black text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {measurement.mode === "dimensions" ? (
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <PricingInput
                label="Längd (m)"
                value={measurement.length}
                onChange={(value) => onMeasurementChange({ length: value, mode: "dimensions" })}
                step={0.1}
              />

              <PricingInput
                label={secondDimensionLabel}
                value={measurement.height}
                onChange={(value) => onMeasurementChange({ height: value, mode: "dimensions" })}
                step={0.1}
              />

              <div className="rounded-2xl border border-orange-400/20 bg-black p-4 sm:col-span-2">
                <p className="text-xs font-bold uppercase text-zinc-500">
                  {areaLabel}
                </p>

                <p className="mt-2 text-2xl font-black text-orange-400">
                  {formatArea(measurement.area)}
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-3">
              <PricingInput
                label={areaLabel}
                value={measurement.area}
                onChange={(value) => onMeasurementChange({ area: value, mode: "manual" })}
                step={0.1}
              />
            </div>
          )}
        </div>
      )}

      {canChooseMode && (
        <div className="grid grid-cols-2 gap-2">

          <button
            type="button"
            onClick={() => onChange({ mode: "fast" })}
            className={`min-h-11 rounded-xl border text-sm font-bold ${
              pricing.mode === "fast"
                ? "border-orange-400 bg-orange-500 text-black"
                : "border-zinc-800 bg-zinc-950 text-white"
            }`}
          >
            Fast pris
          </button>

          <button
            type="button"
            onClick={() => onChange({ mode: "hourly" })}
            className={`min-h-11 rounded-xl border text-sm font-bold ${
              pricing.mode === "hourly"
                ? "border-orange-400 bg-orange-500 text-black"
                : "border-zinc-800 bg-zinc-950 text-white"
            }`}
          >
            Timpris
          </button>

        </div>
      )}

      {useHourly ? (
        <div className={`grid gap-3 ${canChooseMode ? "mt-4" : ""} sm:grid-cols-2`}>

          <PricingInput
            label="Antal timmar"
            value={pricing.hours}
            onChange={(value) => onChange({ hours: value })}
          />

          <PricingInput
            label={option.hourlyRateLabel || "Timpris"}
            value={pricing.hourlyRate}
            onChange={(value) => onChange({ hourlyRate: value })}
          />

        </div>
      ) : (
        <div className={`grid gap-3 ${canChooseMode ? "mt-4" : ""} sm:grid-cols-2`}>

          <PricingInput
            label="Fast pris"
            value={pricing.fastPrice}
            onChange={(value) => onChange({ fastPrice: value })}
          />

          <PricingInput
            label="Uppskattade timmar"
            value={pricing.estimatedHours}
            onChange={(value) => onChange({ estimatedHours: value })}
          />

        </div>
      )}

    </div>
  );
}

function NumberStepper({ value, onChange, min = 0, step = 1 }) {
  const numericValue = Number(value) || 0;
  const normalizedValue = Math.max(min, numericValue);
  const decimalPlaces = String(step).includes(".") ? String(step).split(".")[1].length : 0;

  const updateValue = (nextValue) => {
    const parsedValue = Number(nextValue);

    if (nextValue === "") {
      onChange(min);
      return;
    }

    if (Number.isNaN(parsedValue)) {
      return;
    }

    onChange(Math.max(min, parsedValue));
  };

  const stepValue = (direction) => {
    const nextValue = normalizedValue + (direction * step);
    const roundedValue = Number(nextValue.toFixed(decimalPlaces));

    onChange(Math.max(min, roundedValue));
  };

  return (
    <div className="mt-2 grid grid-cols-[3.25rem_1fr_3.25rem] overflow-hidden rounded-2xl border border-zinc-800 bg-black">
      <button
        type="button"
        onClick={() => stepValue(-1)}
        className="min-h-14 touch-manipulation border-r border-zinc-800 text-2xl font-black text-orange-300 transition active:bg-orange-500/20 disabled:text-zinc-700"
        disabled={normalizedValue <= min}
        aria-label="Minska värde"
      >
        -
      </button>

      <input
        type="number"
        min={min}
        step={step}
        value={value}
        onChange={(event) => updateValue(event.target.value)}
        className="min-h-14 w-full bg-zinc-950 px-3 text-center text-xl font-black text-white outline-none"
        inputMode="decimal"
      />

      <button
        type="button"
        onClick={() => stepValue(1)}
        className="min-h-14 touch-manipulation border-l border-zinc-800 text-2xl font-black text-orange-300 transition active:bg-orange-500/20"
        aria-label="Öka värde"
      >
        +
      </button>
    </div>
  );
}

function getNumericStep(label) {
  const normalizedLabel = label.toLowerCase();

  if (normalizedLabel.includes("pris") || normalizedLabel.includes("kostnad")) {
    return 50;
  }

  if (normalizedLabel.includes("m²") || normalizedLabel.includes("(m)")) {
    return 0.1;
  }

  return 1;
}

function PricingInput({ label, value, onChange, min = 0, step }) {
  return (
    <label className="block text-sm text-zinc-400">
      {label}

      <NumberStepper
        value={value}
        onChange={onChange}
        min={min}
        step={step ?? getNumericStep(label)}
      />

    </label>
  );
}

function AvailabilityInput({ label, value, onChange }) {
  return (
    <label className="block text-sm text-zinc-400">
      {label}

      <NumberStepper
        value={value}
        onChange={onChange}
        min={0}
        step={1}
      />

    </label>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
      <p className="text-xs uppercase text-zinc-500">
        {label}
      </p>

      <p className="mt-1 font-bold text-white">
        {value}
      </p>
    </div>
  );
}

function SummaryPrice({ label, value, highlight = false }) {
  return (
    <div className={`p-5 ${highlight ? "bg-orange-500 text-black" : "bg-black/30 text-white"}`}>
      <p className={`text-xs font-bold ${highlight ? "text-black/60" : "text-zinc-500"}`}>
        {label}
      </p>

      <p className="mt-1 text-lg font-black sm:text-2xl">
        {formatPrice(value).replace(" SEK", "")}
      </p>

      <p className={`text-xs ${highlight ? "text-black/60" : "text-zinc-500"}`}>
        SEK
      </p>
    </div>
  );
}

function createOfferPdfBlob({
  area,
  showArea,
  areaMode,
  deckDimensions,
  displayCategory,
  customer,
  minPrice,
  normalPrice,
  premiumPrice,
  selectedOptionDetails,
  extraCostDetails,
  extraCostsTotal,
  fixedCostsTotal,
  workPrice,
  peopleCount,
  totalWorkHours,
  estimatedCalendarTime,
  startDate,
  estimatedEndDate,
  discountActive,
  discountAmount,
  discountPercent,
  discountedWorkPrice,
  logoImage,
}) {
  const customerRows = [
    ["Namn", customer.name || "Inte angivet"],
    ["Telefon", customer.phone || "Inte angivet"],
    ["Adress", customer.address || "Inte angivet"],
    ["Anteckningar", customer.notes || "Inga anteckningar"],
  ];
  const optionRows = selectedOptionDetails.length > 0
    ? selectedOptionDetails
    : [{ title: "Inga valda alternativ", sectionTitle: "", priceValue: 0 }];
  const extraCostRows = extraCostDetails || [];
  const content = [];

  const rect = (x, y, width, height, color) => {
    content.push(`${color} rg ${x} ${y} ${width} ${height} re f`);
  };

  const line = (x1, y1, x2, y2, color = "1 1 1", width = 1) => {
    content.push(`${color} RG ${width} w ${x1} ${y1} m ${x2} ${y2} l S`);
  };

  const text = (value, x, y, size = 12, color = "1 1 1", font = "F1") => {
    content.push(`BT /${font} ${size} Tf ${color} rg ${x} ${y} Td ${toPdfText(value)} Tj ET`);
  };

  const image = (name, x, y, width, height) => {
    content.push(`q ${width} 0 0 ${height} ${x} ${y} cm /${name} Do Q`);
  };

  const money = (value) => formatPrice(value);

  rect(0, 0, 595, 842, "0.02 0.02 0.02");
  rect(28, 28, 539, 786, "0.07 0.07 0.07");
  rect(28, 768, 539, 46, "0.15 0.07 0.02");
  line(28, 768, 567, 768, "0.98 0.45 0.08", 1.4);

  if (logoImage) {
    image("Logo", 48, 772, 42, 42);
  }
  text("PREMIUM OFFERT", 395, 792, 9, "0.98 0.57 0.24", "F2");
  text(new Date().toLocaleDateString("sv-SE"), 432, 775, 10, "0.72 0.72 0.76");

  text(displayCategory, 48, 724, 24, "1 1 1", "F2");
  text(`${showArea ? `${formatArea(area)} · ` : ""}${peopleCount} ${peopleCount === 1 ? "person" : "personer"}`, 48, 704, 11, "0.65 0.65 0.7");
  text("Normalpris", 390, 724, 10, "0.65 0.65 0.7");
  text(money(normalPrice), 390, 701, 22, "0.98 0.57 0.24", "F2");

  rect(48, 552, 235, 116, "0.1 0.1 0.1");
  rect(312, 552, 235, 116, "0.1 0.1 0.1");
  text("KUNDUPPGIFTER", 64, 645, 9, "0.98 0.57 0.24", "F2");
  text("PROJEKT", 328, 645, 9, "0.98 0.57 0.24", "F2");

  customerRows.slice(0, 3).forEach(([label, value], index) => {
    const y = 620 - index * 24;
    text(label, 64, y, 9, "0.62 0.62 0.66");
    text(value, 142, y, 10, "1 1 1", "F2");
  });

  const projectRows = [
    ["Kategori", displayCategory],
    ...(showArea ? [["Storlek", formatArea(area)]] : []),
    ...(showArea && areaMode === "dimensions" && deckDimensions ? [
      ["Mått", `${deckDimensions.length || 0} m × ${deckDimensions.width || 0} m`],
    ] : []),
    ["Antal personer", `${peopleCount} ${peopleCount === 1 ? "person" : "personer"}`],
    ["Total arbetstid", formatHours(totalWorkHours)],
    ["Uppskattad tid", estimatedCalendarTime],
    ...(startDate && estimatedEndDate ? [
      ["Startdatum", formatLongDate(parseLocalDate(startDate))],
      ["Beräknat slutdatum", estimatedEndDate],
    ] : []),
    ["Arbete före rabatt", money(workPrice)],
    ...(discountActive ? [["Rabatt", `-${money(discountAmount)} (${discountPercent}%)`]] : []),
    ["Arbete efter rabatt", money(discountedWorkPrice)],
    ...(extraCostsTotal > 0 ? [["Extra kostnader", money(extraCostsTotal)]] : []),
    ["Fasta kostnader", money(fixedCostsTotal)],
    ["Totalt", money(normalPrice)],
  ];

  projectRows.forEach(([label, value], index) => {
    const y = 620 - index * 10;
    text(label, 328, y, 7, "0.62 0.62 0.66");
    text(value, 408, y, 8, "1 1 1", "F2");
  });

  text("ANTECKNINGAR", 48, 492, 9, "0.98 0.57 0.24", "F2");
  rect(48, 432, 499, 45, "0.08 0.08 0.08");
  wrapPdfText(customer.notes || "Inga anteckningar", 92, 3).forEach((lineText, index) => {
    text(lineText, 64, 458 - index * 14, 10, "0.9 0.9 0.92");
  });

  text("VALDA ALTERNATIV", 48, 400, 9, "0.98 0.57 0.24", "F2");
  const visibleOptionRows = optionRows.slice(0, extraCostRows.length > 0 ? 5 : 8);

  visibleOptionRows.forEach((option, index) => {
    const y = 368 - index * 31;
    rect(48, y - 8, 499, 24, index % 2 === 0 ? "0.08 0.08 0.08" : "0.1 0.1 0.1");
    text(option.title, 64, y, 10, "1 1 1", "F2");
    if (option.sectionTitle) {
      text(option.sectionTitle, 64, y - 11, 7, "0.48 0.48 0.52");
    }
    if (option.detailText) {
      text(option.detailText, 180, y - 11, 7, "0.48 0.48 0.52");
    }
    text(option.priceValue > 0 ? `+${money(option.priceValue)}` : "Ingår", 420, y, 9, "0.98 0.72 0.45", "F2");
  });

  if (extraCostRows.length > 0) {
    const extraCostsTitleY = 368 - visibleOptionRows.length * 31 - 18;

    text("EXTRA KOSTNADER", 48, extraCostsTitleY, 9, "0.98 0.57 0.24", "F2");
    extraCostRows.slice(0, 4).forEach((cost, index) => {
      const y = extraCostsTitleY - 32 - index * 26;
      rect(48, y - 8, 499, 20, index % 2 === 0 ? "0.08 0.08 0.08" : "0.1 0.1 0.1");
      text(cost.name || "Extra kostnad", 64, y, 9, "1 1 1", "F2");
      if (cost.description) {
        text(cost.description, 64, y - 10, 7, "0.48 0.48 0.52");
      }
      text(`+${money(cost.priceValue)}`, 420, y, 9, "0.98 0.72 0.45", "F2");
    });
  }

  rect(48, 76, 166, 70, "0.08 0.08 0.08");
  rect(214, 76, 166, 70, "0.98 0.45 0.08");
  rect(380, 76, 167, 70, "0.08 0.08 0.08");
  text("MIN", 108, 120, 9, "0.65 0.65 0.7", "F2");
  text(money(minPrice), 78, 96, 15, "1 1 1", "F2");
  text("NORMAL", 268, 120, 9, "0 0 0", "F2");
  text(money(normalPrice), 238, 96, 15, "0 0 0", "F2");
  text("PREMIUM", 434, 120, 9, "0.65 0.65 0.7", "F2");
  text(money(premiumPrice), 410, 96, 15, "1 1 1", "F2");

  return buildPdf(content.join("\n"), logoImage);
}

async function loadPdfLogoImage() {
  if (loadPdfLogoImage.cache !== undefined) {
    return loadPdfLogoImage.cache;
  }

  try {
    const response = await fetch(marcinByggLogo);
    const buffer = await response.arrayBuffer();

    loadPdfLogoImage.cache = parsePngForPdf(new Uint8Array(buffer));
  } catch {
    loadPdfLogoImage.cache = null;
  }

  return loadPdfLogoImage.cache;
}

function parsePngForPdf(bytes) {
  const pngSignature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

  if (!pngSignature.every((byte, index) => bytes[index] === byte)) {
    return null;
  }

  let offset = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 8;
  let colorType = 2;
  const idatChunks = [];

  while (offset < bytes.length) {
    const length = readPngUint32(bytes, offset);
    const type = String.fromCharCode(bytes[offset + 4], bytes[offset + 5], bytes[offset + 6], bytes[offset + 7]);
    const dataStart = offset + 8;
    const dataEnd = dataStart + length;

    if (type === "IHDR") {
      width = readPngUint32(bytes, dataStart);
      height = readPngUint32(bytes, dataStart + 4);
      bitDepth = bytes[dataStart + 8];
      colorType = bytes[dataStart + 9];
    }

    if (type === "IDAT") {
      idatChunks.push(bytes.slice(dataStart, dataEnd));
    }

    if (type === "IEND") {
      break;
    }

    offset = dataEnd + 4;
  }

  if (!width || !height || bitDepth !== 8 || colorType !== 2 || idatChunks.length === 0) {
    return null;
  }

  const dataLength = idatChunks.reduce((total, chunk) => total + chunk.length, 0);
  const data = new Uint8Array(dataLength);
  let dataOffset = 0;

  idatChunks.forEach((chunk) => {
    data.set(chunk, dataOffset);
    dataOffset += chunk.length;
  });

  return {
    width,
    height,
    data,
  };
}

function readPngUint32(bytes, offset) {
  return ((bytes[offset] << 24) | (bytes[offset + 1] << 16) | (bytes[offset + 2] << 8) | bytes[offset + 3]) >>> 0;
}

function buildPdf(contentStream, logoImage) {
  const encoder = new TextEncoder();
  const streamLength = encoder.encode(contentStream).length;
  const hasLogo = Boolean(logoImage);
  const logoObjectNumber = 6;
  const contentObjectNumber = hasLogo ? 7 : 6;
  const xObjectResources = hasLogo ? ` /XObject << /Logo ${logoObjectNumber} 0 R >>` : "";
  const objects = [
    [`<< /Type /Catalog /Pages 2 0 R >>`],
    [`<< /Type /Pages /Kids [3 0 R] /Count 1 >>`],
    [`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >>${xObjectResources} >> /Contents ${contentObjectNumber} 0 R >>`],
    [`<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>`],
    [`<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>`],
  ];

  if (hasLogo) {
    objects.push([
      `<< /Type /XObject /Subtype /Image /Width ${logoImage.width} /Height ${logoImage.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /FlateDecode /DecodeParms << /Predictor 15 /Colors 3 /BitsPerComponent 8 /Columns ${logoImage.width} >> /Length ${logoImage.data.length} >>\nstream\n`,
      logoImage.data,
      "\nendstream",
    ]);
  }

  objects.push([`<< /Length ${streamLength} >>\nstream\n${contentStream}\nendstream`]);

  const pdfParts = ["%PDF-1.4\n"];
  const offsets = [0];
  let byteOffset = encoder.encode(pdfParts[0]).length;

  objects.forEach((objectParts, index) => {
    offsets.push(byteOffset);
    const header = `${index + 1} 0 obj\n`;
    const footer = "\nendobj\n";

    pdfParts.push(header);
    byteOffset += encoder.encode(header).length;

    objectParts.forEach((part) => {
      pdfParts.push(part);
      byteOffset += part instanceof Uint8Array ? part.length : encoder.encode(part).length;
    });

    pdfParts.push(footer);
    byteOffset += encoder.encode(footer).length;
  });

  const xrefOffset = byteOffset;
  let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    xref += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  xref += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  pdfParts.push(xref);

  return new Blob(pdfParts, {
    type: "application/pdf",
  });
}

function toPdfText(value) {
  const bytes = Array.from(String(value)).map((character) => {
    return toWinAnsiByte(character);
  });

  return `<${bytes.map((byte) => byte.toString(16).padStart(2, "0")).join("")}>`;
}

function toWinAnsiByte(character) {
  const code = character.charCodeAt(0);
  const winAnsiBytes = {
    "€": 0x80,
    "‚": 0x82,
    "ƒ": 0x83,
    "„": 0x84,
    "…": 0x85,
    "†": 0x86,
    "‡": 0x87,
    "ˆ": 0x88,
    "‰": 0x89,
    "Š": 0x8a,
    "‹": 0x8b,
    "Œ": 0x8c,
    "Ž": 0x8e,
    "‘": 0x91,
    "’": 0x92,
    "“": 0x93,
    "”": 0x94,
    "•": 0x95,
    "–": 0x96,
    "—": 0x97,
    "˜": 0x98,
    "™": 0x99,
    "š": 0x9a,
    "›": 0x9b,
    "œ": 0x9c,
    "ž": 0x9e,
    "Ÿ": 0x9f,
  };

  if (code <= 0x7f || (code >= 0xa0 && code <= 0xff)) {
    return code;
  }

  return winAnsiBytes[character] ?? 0x3f;
}

function wrapPdfText(value, maxLength, maxLines) {
  const words = String(value).split(" ");
  const lines = [];
  let currentLine = "";

  words.forEach((word) => {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;

    if (nextLine.length > maxLength && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = nextLine;
    }
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines.slice(0, maxLines);
}

function ActionButton({ children, onClick, variant = "secondary" }) {
  const isPrimary = variant === "primary";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative z-10 min-h-14 w-full touch-manipulation rounded-2xl border px-5 text-sm font-black uppercase tracking-wide transition active:scale-[0.98] ${
        isPrimary
          ? "border-orange-400 bg-orange-500 text-black shadow-xl shadow-orange-500/20"
          : "border-white/10 bg-zinc-900 text-white shadow-xl shadow-black/20"
      }`}
    >
      {children}
    </button>
  );
}

