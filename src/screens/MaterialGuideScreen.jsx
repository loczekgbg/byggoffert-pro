import { useMemo, useState } from "react";
import { ArrowLeft, Box, ClipboardList, FileDown, FolderPlus, Search, ShoppingCart } from "lucide-react";
import { materialGuide, findMaterial } from "../data/materialGuide";
import { translateText, useI18n } from "../i18n";

const shoppingListStorageKey = "marcin-bygg-tools-shopping-list";
const projectToolsStorageKey = "marcin-bygg-tools-project-items";
const offerToolsStorageKey = "marcin-bygg-tools-offer-items";

function createLocalId() {
  return globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function readStoredItems(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
}

function writeStoredItem(key, item) {
  localStorage.setItem(key, JSON.stringify([item, ...readStoredItems(key)]));
}

function materialName(material, language) {
  return language === "pl" ? material.PolishName : material.SwedishName;
}

function materialUsage(material, language) {
  return language === "pl" ? material.UsagePL : material.Usage;
}

function materialDescription(material, language) {
  return language === "pl" ? material.DescriptionPL : material.DescriptionSV;
}

function formatList(value, fallback = "missingData") {
  if (!Array.isArray(value) || value.length === 0) return fallback;
  return value.join(", ");
}

export default function MaterialGuideScreen({ goBack }) {
  const { language, t } = useI18n();
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(materialGuide[0]?.id || "");
  const selectedMaterial = findMaterial(selectedId) || materialGuide[0];

  const filteredMaterials = useMemo(() => {
    const needle = query.trim().toLowerCase();

    if (!needle) return materialGuide;

    return materialGuide.filter((material) => [
      material.SwedishName,
      material.PolishName,
      material.Category,
      ...material.Dimensions,
      ...material.Tags,
    ].some((value) => String(value).toLowerCase().includes(needle)));
  }, [query]);

  const addToShoppingList = () => {
    writeStoredItem(shoppingListStorageKey, {
      id: createLocalId(),
      checked: false,
      createdAt: new Date().toISOString(),
      name: `${selectedMaterial.SwedishName} / ${selectedMaterial.PolishName}`,
      quantity: 1,
      unit: "rad",
      note: `${selectedMaterial.Category} · ${formatList(selectedMaterial.Dimensions)} · ${selectedMaterial.status}`,
      source: "Materialguide",
    });
  };

  const addToProject = () => {
    writeStoredItem(projectToolsStorageKey, {
      id: createLocalId(),
      toolId: "materialguide",
      title: "Materialguide",
      results: materialRows(selectedMaterial, language),
      values: selectedMaterial,
      createdAt: new Date().toISOString(),
    });
  };

  const addToOffer = () => {
    writeStoredItem(offerToolsStorageKey, {
      id: createLocalId(),
      toolId: "materialguide",
      title: "Materialguide",
      results: materialRows(selectedMaterial, language),
      shoppingItems: [{
        name: `${selectedMaterial.SwedishName} / ${selectedMaterial.PolishName}`,
        quantity: 1,
        unit: "rad",
        note: formatList(selectedMaterial.Dimensions),
        source: "Materialguide",
      }],
      values: selectedMaterial,
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <div className="min-h-[100dvh] overflow-x-hidden bg-black p-6 pb-[calc(6rem+env(safe-area-inset-bottom))] text-white">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={goBack}
          className="relative z-10 touch-manipulation rounded-2xl border border-zinc-800 bg-zinc-900 p-3"
          aria-label={t("Tillbaka")}
        >
          <ArrowLeft size={22} />
        </button>

        <div>
          <p className="text-sm font-bold uppercase text-orange-400">
            {t("Stałe dane materiałowe")}
          </p>
          <h1 className="text-3xl font-black">
            {t("Materialguide")}
          </h1>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.2fr]">
        <section className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-5">
          <label className="flex min-h-14 items-center gap-3 rounded-2xl border border-zinc-800 bg-black px-4">
            <Search size={19} className="text-orange-300" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("Sök material")}
              className="w-full bg-transparent text-base font-bold text-white outline-none placeholder:text-zinc-600"
            />
          </label>

          <div className="mt-5 grid gap-3">
            {filteredMaterials.map((material) => (
              <button
                key={material.id}
                type="button"
                onClick={() => setSelectedId(material.id)}
                className={`rounded-2xl border p-4 text-left transition active:scale-[0.99] ${
                  selectedMaterial.id === material.id
                    ? "border-orange-400 bg-orange-500 text-black"
                    : "border-zinc-800 bg-black text-white"
                }`}
              >
                <div className="flex items-start gap-3">
                  <Box size={20} className="mt-1 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-lg font-black">{materialName(material, language)}</p>
                    <p className={`text-sm ${selectedMaterial.id === material.id ? "text-black/65" : "text-zinc-400"}`}>
                      {material.SwedishName} · {material.PolishName}
                    </p>
                    <p className={`mt-2 text-xs font-bold uppercase ${selectedMaterial.id === material.id ? "text-black/60" : "text-orange-300"}`}>
                      {material.Category} · {material.status}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        <MaterialDetail
          material={selectedMaterial}
          language={language}
          t={t}
          onAddToProject={addToProject}
          onAddToOffer={addToOffer}
          onAddToShoppingList={addToShoppingList}
        />
      </div>
    </div>
  );
}

function materialRows(material, language) {
  return [
    ["SwedishName", material.SwedishName],
    ["PolishName", material.PolishName],
    ["Category", material.Category],
    ["Dimensions", formatList(material.Dimensions)],
    ["StandardLengths", formatList(material.StandardLengths)],
    ["Usage", materialUsage(material, language)],
    ["Tags", formatList(material.Tags)],
    ["status", material.status],
  ];
}

function MaterialDetail({ material, language, t, onAddToProject, onAddToOffer, onAddToShoppingList }) {
  return (
    <section className="rounded-3xl border border-orange-400/30 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-5 shadow-2xl shadow-orange-500/10">
      <div className="grid gap-5 xl:grid-cols-[1fr_0.95fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-orange-400">
            {material.Category}
          </p>
          <h2 className="mt-2 text-4xl font-black leading-tight">
            {materialName(material, language)}
          </h2>
          <p className="mt-1 text-lg font-bold text-zinc-300">
            {material.SwedishName} · {material.PolishName}
          </p>

          <p className="mt-5 text-base leading-relaxed text-zinc-300">
            {materialDescription(material, language)}
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {materialRows(material, language).map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs font-bold uppercase text-zinc-500">{translateText(label, language)}</p>
                <p className="mt-2 break-words text-lg font-black text-white">{value}</p>
              </div>
            ))}
            {Array.isArray(material.Thicknesses) && material.Thicknesses.length > 0 && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs font-bold uppercase text-zinc-500">{translateText("Grubości", language)}</p>
                <p className="mt-2 text-lg font-black text-white">{material.Thicknesses.join(", ")} mm</p>
              </div>
            )}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {material.Tags.map((tag) => (
              <span key={tag} className="rounded-full border border-orange-400/30 bg-orange-500/10 px-3 py-1 text-xs font-black text-orange-200">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          <PreviewPanel title="2D preview">
            <MaterialPreview2D material={material} />
          </PreviewPanel>
          <PreviewPanel title="3D preview">
            <MaterialPreview3D material={material} />
          </PreviewPanel>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-black/40 p-4">
        <p className="text-xs font-bold uppercase text-zinc-500">{t("Podobne materiały")}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {material.similar.length > 0 ? material.similar.map((id) => {
            const similarMaterial = findMaterial(id);
            const label = similarMaterial ? materialName(similarMaterial, language) : id;

            return (
              <span key={id} className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm font-bold text-zinc-200">
                {label}
              </span>
            );
          }) : (
            <span className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm font-bold text-zinc-500">
              missingData
            </span>
          )}
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <button type="button" onClick={onAddToProject} className="flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-orange-400/40 bg-orange-500/10 px-4 font-black text-orange-200 transition active:scale-[0.98]">
          <FolderPlus size={20} />
          {t("Lägg till i projekt")}
        </button>
        <button type="button" onClick={onAddToOffer} className="flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 font-black text-zinc-100 transition active:scale-[0.98]">
          <FileDown size={20} />
          {t("Lägg till i offert")}
        </button>
        <button type="button" onClick={onAddToShoppingList} className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-orange-500 px-4 font-black text-black transition active:scale-[0.98]">
          <ShoppingCart size={20} />
          {t("Lägg till i inköpslista")}
        </button>
      </div>
    </section>
  );
}

function PreviewPanel({ title, children }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-black">
      <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3">
        <ClipboardList size={17} className="text-orange-300" />
        <p className="text-xs font-black uppercase tracking-[0.14em] text-zinc-400">{title}</p>
      </div>
      {children}
    </div>
  );
}

function MaterialPreview2D({ material }) {
  const firstDimension = material.Dimensions[0] || "missingData";
  const [a, b] = firstDimension.includes("x") ? firstDimension.split("x") : ["A", "B"];
  const type = material.previewType;

  return (
    <svg className="block h-auto w-full" viewBox="0 0 360 210" role="img" aria-label="2D preview">
      <defs>
        <linearGradient id={`wood-${material.id}`} x1="0" x2="1">
          <stop offset="0" stopColor="#f9dfaa" />
          <stop offset="1" stopColor="#b87938" />
        </linearGradient>
      </defs>
      <rect width="360" height="210" fill="#050505" />
      <g transform="translate(42 30)">
        {type === "cove" && <path d="M82 22 C32 50 32 108 82 136 L102 118 C70 94 70 64 102 40 Z" fill={`url(#wood-${material.id})`} stroke="#fde68a" strokeWidth="1.2" />}
        {type === "quarter" && <path d="M42 130 A88 88 0 0 1 130 42 L130 130 Z" fill={`url(#wood-${material.id})`} stroke="#fde68a" strokeWidth="1.2" />}
        {type === "triangle" && <path d="M40 132 L132 132 L132 40 Z" fill={`url(#wood-${material.id})`} stroke="#fde68a" strokeWidth="1.2" />}
        {["deck", "beam", "trim", "panel"].includes(type) && <rect x="36" y="54" width="124" height="56" rx="3" fill={`url(#wood-${material.id})`} stroke="#fde68a" strokeWidth="1.2" />}
        {type === "sheet" && <rect x="46" y="20" width="96" height="136" rx="2" fill="#e5e7eb" stroke="#a1a1aa" strokeWidth="1.2" />}
        {type === "bag" && <path d="M54 36 H142 L158 136 Q100 158 38 136 Z" fill="#d6d3d1" stroke="#a1a1aa" strokeWidth="1.2" />}
        <line x1="30" y1="168" x2="170" y2="168" stroke="#fbbf24" strokeWidth="1" markerEnd="url(#arrowEnd)" />
        <line x1="18" y1="38" x2="18" y2="138" stroke="#fbbf24" strokeWidth="1" />
        <text x="100" y="190" fill="#fff7ed" fontSize="22" fontWeight="900" textAnchor="middle">{a} x {b}</text>
        <text x="100" y="18" fill="#fde68a" fontSize="11" fontWeight="900" textAnchor="middle">A x B</text>
      </g>
      <text x="332" y="188" fill="#71717a" fontSize="10" fontWeight="800" textAnchor="end">{material.status}</text>
    </svg>
  );
}

function MaterialPreview3D({ material }) {
  const type = material.previewType;

  return (
    <svg className="block h-auto w-full" viewBox="0 0 360 210" role="img" aria-label="3D preview">
      <defs>
        <linearGradient id={`wood3d-${material.id}`} x1="0" x2="1">
          <stop offset="0" stopColor="#ffe8b8" />
          <stop offset="1" stopColor="#a85c20" />
        </linearGradient>
      </defs>
      <rect width="360" height="210" fill="#050505" />
      <g transform="translate(54 44)">
        {type === "sheet" ? (
          <g>
            <polygon points="48,18 188,44 188,146 48,120" fill="#f4f4f5" stroke="#71717a" />
            <polygon points="188,44 218,28 218,130 188,146" fill="#d4d4d8" stroke="#71717a" />
          </g>
        ) : type === "bag" ? (
          <g>
            <path d="M64 28 H178 L200 124 Q132 154 42 124 Z" fill="#d6d3d1" stroke="#a1a1aa" />
            <text x="122" y="92" fill="#27272a" fontSize="18" fontWeight="900" textAnchor="middle">{material.SwedishName}</text>
          </g>
        ) : (
          <g>
            <polygon points="46,78 188,36 244,58 104,104" fill={`url(#wood3d-${material.id})`} stroke="#fde68a" strokeOpacity="0.7" />
            <polygon points="104,104 244,58 244,112 104,158" fill="#8a4a18" stroke="#fde68a" strokeOpacity="0.35" />
            <polygon points="46,78 104,104 104,158 46,130" fill="#f4d59a" stroke="#fde68a" strokeOpacity="0.35" />
            {Array.from({ length: 5 }).map((_, index) => (
              <line key={index} x1={70 + index * 29} y1={73 - index * 8} x2={127 + index * 29} y2={98 - index * 8} stroke="#7c2d12" strokeOpacity="0.35" />
            ))}
          </g>
        )}
      </g>
      <text x="28" y="186" fill="#fde68a" fontSize="11" fontWeight="900">{material.SwedishName}</text>
      <text x="332" y="186" fill="#a1a1aa" fontSize="10" fontWeight="800" textAnchor="end">3D preview</text>
    </svg>
  );
}
