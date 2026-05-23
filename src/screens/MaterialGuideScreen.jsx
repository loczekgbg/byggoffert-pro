import { useMemo, useState } from "react";
import { ArrowLeft, Box, ClipboardList, FileDown, FolderPlus, Search, ShoppingCart } from "lucide-react";
import { findMaterial, findMaterialGroup, materialGroups, materialGuide } from "../data/materialGuide";
import { useI18n } from "../i18n";

const shoppingListStorageKey = "marcin-bygg-tools-shopping-list";
const projectToolsStorageKey = "marcin-bygg-tools-project-items";
const offerToolsStorageKey = "marcin-bygg-tools-offer-items";
const missing = "missingData";

const labels = {
  sv: {
    fixedData: "Fast materialdata",
    search: "Sök material",
    dimensions: "Dimensioner",
    lengths: "Längder",
    coveringWidth: "Täckande bredd",
    thicknesses: "Tjocklekar",
    sheetSizes: "Skivstorlek",
    packages: "Förpackning",
    coverage: "A x B -> C",
    description: "Beskrivning",
    notSpecified: "Ej angivet",
    drawing2d: "Ritning 2D",
    preview3d: "3D",
    addProject: "Lägg till i projekt",
    addOffer: "Lägg till i offert",
    addShopping: "Lägg till i inköpslista",
    back: "Tillbaka",
    profile: "Profil",
    category: "Kategori",
    materialGuide: "Materialguide",
  },
  pl: {
    fixedData: "Stałe dane materiałowe",
    search: "Szukaj materiału",
    dimensions: "Wymiary",
    lengths: "Długości",
    coveringWidth: "Szerokość krycia",
    thicknesses: "Grubości",
    sheetSizes: "Format płyty",
    packages: "Opakowanie",
    coverage: "A x B -> C",
    description: "Opis",
    notSpecified: "Ej angivet",
    drawing2d: "Rysunek 2D",
    preview3d: "3D",
    addProject: "Dodaj do projektu",
    addOffer: "Dodaj do oferty",
    addShopping: "Dodaj do listy zakupów",
    back: "Wstecz",
    profile: "Profil",
    category: "Kategoria",
    materialGuide: "Baza materiałów",
  },
  en: {
    fixedData: "Fixed material data",
    search: "Search material",
    dimensions: "Dimensions",
    lengths: "Lengths",
    coveringWidth: "Covering width",
    thicknesses: "Thicknesses",
    sheetSizes: "Sheet size",
    packages: "Package",
    coverage: "A x B -> C",
    description: "Description",
    notSpecified: "Ej angivet",
    drawing2d: "2D drawing",
    preview3d: "3D",
    addProject: "Add to project",
    addOffer: "Add to quote",
    addShopping: "Add to shopping list",
    back: "Back",
    profile: "Profile",
    category: "Category",
    materialGuide: "Material guide",
  },
};

function text(key, language) {
  return labels[language]?.[key] || labels.sv[key] || key;
}

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

function localizedName(value, language) {
  const name = value?.[language] || value?.sv || missing;
  return name === missing ? text("notSpecified", language) : name;
}

function localizedDescription(material, language) {
  const description = material.description?.[language] || material.description?.sv || missing;
  return description === missing ? "" : description;
}

function formatList(value, language, unit = "") {
  if (!Array.isArray(value) || value.length === 0) return text("notSpecified", language);
  return value.map((item) => `${item}${unit}`).join(", ");
}

function hasData(value) {
  return Array.isArray(value) && value.length > 0;
}

function materialRows(material, language) {
  const group = findMaterialGroup(material.group);
  return [
    [text("category", language), localizedName(group?.name, language)],
    [text("dimensions", language), formatList(material.dimensions, language)],
    [text("lengths", language), formatList(material.lengths, language, " mm")],
    [text("coveringWidth", language), hasData(material.coverage) ? text("notSpecified", language) : formatList(material.coveringWidth, language, " mm")],
    [text("coverage", language), formatCoverage(material.coverage, language)],
    [text("thicknesses", language), formatList(material.thicknesses, language, " mm")],
    [text("sheetSizes", language), formatList(material.sheetSizes, language)],
    [text("packages", language), formatList(material.packages, language)],
  ].filter(([, value]) => value !== text("notSpecified", language));
}

function formatCoverage(value, language) {
  if (!Array.isArray(value) || value.length === 0) return text("notSpecified", language);
  return value.map((item) => `${item.dimension} -> C ${item.c}`).join(", ");
}

export default function MaterialGuideScreen({ goBack }) {
  const { language } = useI18n();
  const [query, setQuery] = useState("");
  const [groupId, setGroupId] = useState(materialGroups[0]?.id || "");
  const [selectedId, setSelectedId] = useState(materialGuide[0]?.id || "");
  const selectedMaterial = findMaterial(selectedId) || materialGuide[0];

  const groupedMaterials = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return materialGuide.filter((material) => {
      const haystack = [
        material.name.sv,
        material.name.pl,
        material.name.en,
        material.category,
        material.group,
        ...material.dimensions,
        ...material.lengths,
        ...material.coveringWidth,
        ...material.thicknesses,
        ...material.sheetSizes,
        ...material.packages,
      ].filter((value) => value && value !== missing);

      return material.group === groupId && (!needle || haystack.some((value) => String(value).toLowerCase().includes(needle)));
    });
  }, [groupId, query]);

  const selectGroup = (nextGroupId) => {
    setGroupId(nextGroupId);
    const first = materialGuide.find((material) => material.group === nextGroupId);
    if (first) setSelectedId(first.id);
  };

  const addToShoppingList = () => {
    writeStoredItem(shoppingListStorageKey, {
      id: createLocalId(),
      checked: false,
      createdAt: new Date().toISOString(),
      name: localizedName(selectedMaterial.name, language),
      quantity: 1,
      unit: "rad",
      note: materialRows(selectedMaterial, language).map(([label, value]) => `${label}: ${value}`).join(" · "),
      source: "Materialguide",
    });
  };

  const addToProject = () => {
    writeStoredItem(projectToolsStorageKey, {
      id: createLocalId(),
      toolId: "materialguide",
      title: localizedName(selectedMaterial.name, language),
      results: materialRows(selectedMaterial, language),
      values: selectedMaterial,
      createdAt: new Date().toISOString(),
    });
  };

  const addToOffer = () => {
    writeStoredItem(offerToolsStorageKey, {
      id: createLocalId(),
      toolId: "materialguide",
      title: localizedName(selectedMaterial.name, language),
      results: materialRows(selectedMaterial, language),
      shoppingItems: [{
        name: localizedName(selectedMaterial.name, language),
        quantity: 1,
        unit: "rad",
        note: formatList(selectedMaterial.dimensions, language),
        source: "Materialguide",
      }],
      values: selectedMaterial,
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <div className="min-h-[100dvh] overflow-x-hidden bg-zinc-950 p-5 pb-[calc(6rem+env(safe-area-inset-bottom))] text-white">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={goBack}
          className="relative z-10 touch-manipulation rounded-2xl border border-zinc-800 bg-black p-3"
          aria-label={text("back", language)}
        >
          <ArrowLeft size={22} />
        </button>
        <div>
          <p className="text-sm font-bold uppercase text-amber-400">{text("fixedData", language)}</p>
          <h1 className="text-3xl font-black">{text("materialGuide", language)}</h1>
        </div>
      </div>

      <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
        {materialGroups.map((group) => (
          <button
            key={group.id}
            type="button"
            onClick={() => selectGroup(group.id)}
            className={`shrink-0 rounded-2xl border px-4 py-3 text-sm font-black transition ${
              groupId === group.id ? "border-amber-400 bg-amber-400 text-black" : "border-zinc-800 bg-black text-zinc-300"
            }`}
          >
            {localizedName(group.name, language)}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[0.9fr_1.25fr]">
        <section className="rounded-3xl border border-zinc-800 bg-black p-4">
          <label className="flex min-h-14 items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-950 px-4">
            <Search size={19} className="text-amber-300" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={text("search", language)}
              className="w-full bg-transparent text-base font-bold text-white outline-none placeholder:text-zinc-600"
            />
          </label>

          <div className="mt-4 grid gap-3">
            {groupedMaterials.map((material) => (
              <button
                key={material.id}
                type="button"
                onClick={() => setSelectedId(material.id)}
                className={`rounded-2xl border p-4 text-left transition active:scale-[0.99] ${
                  selectedMaterial.id === material.id ? "border-amber-400 bg-amber-400 text-black" : "border-zinc-800 bg-zinc-950 text-white"
                }`}
              >
                <div className="flex items-start gap-3">
                  <Box size={20} className="mt-1 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-lg font-black">{localizedName(material.name, language)}</p>
                    <p className={`mt-1 text-sm ${selectedMaterial.id === material.id ? "text-black/65" : "text-zinc-400"}`}>
                      {formatList(material.dimensions, language)}
                    </p>
                    {material.section && (
                      <p className={`mt-2 text-xs font-black uppercase ${selectedMaterial.id === material.id ? "text-black/55" : "text-amber-300"}`}>
                        {material.section}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        <MaterialDetail
          material={selectedMaterial}
          language={language}
          onAddToProject={addToProject}
          onAddToOffer={addToOffer}
          onAddToShoppingList={addToShoppingList}
        />
      </div>
    </div>
  );
}

function MaterialDetail({ material, language, onAddToProject, onAddToOffer, onAddToShoppingList }) {
  const group = findMaterialGroup(material.group);
  const rows = materialRows(material, language);
  const description = localizedDescription(material, language);

  return (
    <section className="rounded-3xl border border-amber-400/25 bg-zinc-900 p-5 shadow-2xl shadow-amber-500/10">
      <div className="grid gap-5 xl:grid-cols-[1fr_0.95fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-amber-400">
            {[localizedName(group?.name, language), material.section].filter(Boolean).join(" / ")}
          </p>
          <h2 className="mt-2 text-4xl font-black leading-tight">{localizedName(material.name, language)}</h2>
          {description && (
            <p className="mt-4 text-base leading-relaxed text-zinc-300">{description}</p>
          )}

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {rows.map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-black/35 p-4">
                <p className="text-xs font-bold uppercase text-zinc-500">{label}</p>
                <p className="mt-2 break-words text-lg font-black text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          <PreviewPanel title={text("drawing2d", language)}>
            <MaterialPreview2D material={material} language={language} />
          </PreviewPanel>
          <PreviewPanel title={text("preview3d", language)}>
            <MaterialPreview3D material={material} language={language} />
          </PreviewPanel>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <button type="button" onClick={onAddToProject} className="flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-amber-400/40 bg-amber-500/10 px-4 font-black text-amber-200 transition active:scale-[0.98]">
          <FolderPlus size={20} />
          {text("addProject", language)}
        </button>
        <button type="button" onClick={onAddToOffer} className="flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 font-black text-zinc-100 transition active:scale-[0.98]">
          <FileDown size={20} />
          {text("addOffer", language)}
        </button>
        <button type="button" onClick={onAddToShoppingList} className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-amber-400 px-4 font-black text-black transition active:scale-[0.98]">
          <ShoppingCart size={20} />
          {text("addShopping", language)}
        </button>
      </div>
    </section>
  );
}

function PreviewPanel({ title, children }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-white">
      <div className="flex items-center gap-2 border-b border-zinc-200 px-4 py-3">
        <ClipboardList size={17} className="text-zinc-700" />
        <p className="text-xs font-black uppercase tracking-[0.14em] text-zinc-600">{title}</p>
      </div>
      {children}
    </div>
  );
}

function firstSize(material) {
  if (hasData(material.dimensions)) return material.dimensions[0];
  if (hasData(material.sheetSizes)) return material.sheetSizes[0];
  if (hasData(material.thicknesses)) return `${material.thicknesses[0]}x${material.thicknesses[0]}`;
  if (hasData(material.packages)) return material.packages[0];
  return "A x B";
}

function dimensionParts(material) {
  const value = firstSize(material);
  if (!value.includes("x")) return ["A", "B", value];
  const [a, b] = value.split("x");
  return [a, b, `${a} x ${b}`];
}

function profilePath(profile) {
  const paths = {
    rect: "M55 108 L205 108 L205 72 L55 72 Z",
    planed: "M56 106 L204 106 L204 74 Q130 66 56 74 Z",
    deck: "M54 108 L206 108 L206 74 L54 74 Z",
    ribbedDeck: "M54 108 L206 108 L206 75 L54 75 Z M72 76 L76 88 M92 76 L96 88 M112 76 L116 88 M132 76 L136 88 M152 76 L156 88 M172 76 L176 88 M192 76 L196 88",
    fencePicket: "M64 112 L196 112 L196 79 Q130 58 64 79 Z",
    wideLapPanel: "M44 110 L214 110 L214 84 L188 84 L178 72 L44 72 Z",
    outerPanelBoard: "M48 110 L212 110 L212 78 Q204 72 196 72 L64 72 Q56 72 48 78 Z",
    outerBatten: "M70 112 L192 112 L192 82 L174 72 L88 72 L70 82 Z",
    coverBatten: "M72 112 L190 112 L190 84 L174 72 L88 72 L72 84 Z",
    allmogeCoverBatten: "M68 112 L194 112 L194 88 Q178 80 168 72 Q138 86 110 72 Q96 80 68 88 Z",
    hatBatten: "M70 112 L192 112 L192 92 L168 92 Q150 66 130 66 Q110 66 92 92 L70 92 Z",
    tongueGrooveOuter: "M42 110 L196 110 L196 98 L218 98 L218 84 L196 84 L196 72 L62 72 L62 84 L42 84 Z",
    rebatedStraightGroove: "M42 110 L196 110 L196 98 L218 98 L218 84 L196 84 L196 72 L42 72 Z M128 72 L128 110",
    rebatedBeveledGroove: "M42 110 L196 110 L196 98 L218 98 L218 84 L196 84 L188 72 L50 72 Z M128 72 L138 110",
    doubleBevelTongue: "M42 110 L196 110 L196 98 L218 98 L218 84 L196 84 L186 72 L52 72 L42 84 Z",
    rebatedDoubleBevel: "M42 110 L196 110 L196 98 L218 98 L218 84 L196 84 L186 72 L52 72 L42 84 Z M196 98 L206 110",
    fjallPanel: "M42 110 L208 110 L218 82 L92 82 L76 72 L42 72 Z",
    logPanel: "M44 110 L214 110 L214 91 Q130 52 44 91 Z",
    verticalGluePanel: "M42 110 L196 110 L196 98 L218 98 L218 84 L196 84 L184 72 L54 72 L42 84 Z M110 72 L118 110",
    horizontalGluePanel: "M42 110 L214 110 L214 88 L196 88 L184 72 L56 72 L42 88 Z M96 72 L108 110",
    straightGroovePanel: "M44 110 L214 110 L214 72 L44 72 Z M96 72 L96 110 M162 72 L162 110",
    beveledGroovePanel: "M44 110 L214 110 L204 72 L54 72 Z M96 72 L104 110 M162 72 L154 110",
    beadPanel: "M44 110 L214 110 L214 72 L44 72 Z M126 72 A8 8 0 0 0 126 88 A8 8 0 0 0 126 72",
    classicPanel: "M44 110 L214 110 L214 80 L196 80 L188 72 L70 72 L62 80 L44 80 Z",
    plainCasing: "M52 110 L206 110 L206 75 Q129 68 52 75 Z",
    steppedCasing: "M52 110 L206 110 L206 70 L170 70 L170 90 L52 90 Z",
    baseboard: "M54 112 L206 112 L206 72 L188 72 L178 86 L54 86 Z",
    classicCasing: "M48 112 L210 112 L210 91 L190 88 Q178 70 158 82 Q130 94 104 80 Q82 68 64 88 L48 91 Z",
    classicBaseboard: "M48 112 L210 112 L210 86 Q190 70 170 86 Q146 104 124 86 Q100 70 78 86 L48 86 Z",
    shadow21: "M62 112 L202 112 L202 88 L158 88 L158 72 L62 72 Z",
    shadow33: "M58 112 L204 112 L204 78 L178 78 L178 96 L58 96 Z",
    shadow43: "M58 112 L204 112 L204 92 L126 92 L126 72 L58 72 Z",
    cove: "M74 112 L198 112 L198 74 C156 82 116 86 74 74 Z",
    corner: "M72 112 L204 112 L204 86 L98 86 L98 72 L72 72 Z",
    splayed: "M62 112 L204 112 L190 72 L76 72 Z",
    triangle: "M72 112 L204 112 L204 72 Z",
    quarter: "M72 112 A82 82 0 0 1 154 30 L154 112 Z",
    classicCrown: "M50 112 L210 112 L196 94 Q178 74 154 88 Q132 100 110 86 Q84 68 64 94 Z",
    osbSheet: "M74 122 L190 122 L190 52 L74 52 Z",
    plywoodSheet: "M70 122 L194 122 L194 54 L70 54 Z M70 68 L194 68 M70 82 L194 82 M70 96 L194 96",
    gypsumSheet: "M76 124 L188 124 L188 50 L76 50 Z",
    bag: "M76 58 L188 58 L204 128 Q140 150 60 128 Z",
  };
  return paths[profile] || paths.rect;
}

function woodLines(count = 9) {
  return Array.from({ length: count }, (_, index) => (
    <path
      key={index}
      d={`M${60 + index * 16} 112 C${78 + index * 12} 92 ${82 + index * 14} 84 ${102 + index * 13} 72`}
      fill="none"
      stroke="#9a6a32"
      strokeOpacity="0.28"
      strokeWidth="1"
    />
  ));
}

function MaterialPreview2D({ material, language }) {
  const [a, b, dimension] = dimensionParts(material);
  const isSheet = material.profile.includes("Sheet");
  const isBag = material.profile === "bag";
  const coverage = material.coverage?.[0]?.c;

  return (
    <svg className="block h-auto w-full" viewBox="0 0 360 230" role="img" aria-label={text("drawing2d", language)}>
      <defs>
        <linearGradient id={`wood-${material.id}`} x1="0" x2="1">
          <stop offset="0" stopColor="#f8dfab" />
          <stop offset="1" stopColor="#c48a45" />
        </linearGradient>
        <marker id={`arrow-${material.id}`} markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto">
          <path d="M0 0 L7 3.5 L0 7 Z" fill="#27272a" />
        </marker>
      </defs>
      <rect width="360" height="230" fill="#fff" />
      <g transform="translate(44 16)">
        <path d={profilePath(material.profile)} fill={isSheet ? "#eceff3" : isBag ? "#d8d2c8" : `url(#wood-${material.id})`} stroke="#303030" strokeWidth="1.4" />
        {!isSheet && !isBag && woodLines()}
        {material.profile === "ribbedDeck" && [74, 94, 114, 134, 154, 174, 194].map((x) => <line key={x} x1={x} y1="76" x2={x + 5} y2="88" stroke="#303030" strokeWidth="1" />)}
        {material.profile === "osbSheet" && Array.from({ length: 34 }).map((_, index) => <line key={index} x1={80 + (index * 17) % 100} y1={58 + (index * 23) % 58} x2={86 + (index * 19) % 94} y2={62 + (index * 29) % 54} stroke="#9f7a3e" strokeWidth="1" strokeOpacity="0.55" />)}

        <line x1="52" y1="150" x2="208" y2="150" stroke="#27272a" strokeWidth="1" markerStart={`url(#arrow-${material.id})`} markerEnd={`url(#arrow-${material.id})`} />
        <line x1="52" y1="142" x2="52" y2="158" stroke="#27272a" strokeWidth="1" />
        <line x1="208" y1="142" x2="208" y2="158" stroke="#27272a" strokeWidth="1" />
        <line x1="30" y1="70" x2="30" y2="112" stroke="#27272a" strokeWidth="1" markerStart={`url(#arrow-${material.id})`} markerEnd={`url(#arrow-${material.id})`} />
        <line x1="22" y1="70" x2="38" y2="70" stroke="#27272a" strokeWidth="1" />
        <line x1="22" y1="112" x2="38" y2="112" stroke="#27272a" strokeWidth="1" />
        <text x="130" y="177" fill="#27272a" fontSize="18" fontWeight="800" textAnchor="middle">B</text>
        <text x="18" y="94" fill="#27272a" fontSize="18" fontWeight="800" textAnchor="middle" transform="rotate(-90 18 94)">A</text>
        {coverage && (
          <>
            <line x1="66" y1="134" x2="196" y2="134" stroke="#71717a" strokeWidth="1" strokeDasharray="4 4" markerStart={`url(#arrow-${material.id})`} markerEnd={`url(#arrow-${material.id})`} />
            <text x="130" y="129" fill="#52525b" fontSize="14" fontWeight="900" textAnchor="middle">C {coverage}</text>
          </>
        )}
        <text x="130" y="208" fill="#111827" fontSize="22" fontWeight="900" textAnchor="middle">{dimension}</text>
        <text x="294" y="36" fill="#71717a" fontSize="11" fontWeight="800" textAnchor="end">{a} x {b}</text>
      </g>
    </svg>
  );
}

function MaterialPreview3D({ material, language }) {
  const isSheet = material.profile.includes("Sheet");
  const isBag = material.profile === "bag";
  const mounting = material.mounting || "horizontal";
  const isVertical = mounting === "vertical";

  return (
    <svg className="block h-auto w-full" viewBox="0 0 360 230" role="img" aria-label={text("preview3d", language)}>
      <defs>
        <linearGradient id={`wood3d-${material.id}`} x1="0" x2="1">
          <stop offset="0" stopColor="#ffe7b8" />
          <stop offset="1" stopColor="#a96022" />
        </linearGradient>
      </defs>
      <rect width="360" height="230" fill="#fff" />
      <g transform="translate(38 24)">
        {isBag ? (
          <g>
            <path d="M74 38 H202 L226 134 Q148 166 48 134 Z" fill="#d8d2c8" stroke="#3f3f46" strokeWidth="1.2" />
            <path d="M74 38 Q142 58 202 38" fill="none" stroke="#8b8276" strokeWidth="1" />
            <text x="138" y="105" fill="#333" fontSize="22" fontWeight="900" textAnchor="middle">{localizedName(material.name, language)}</text>
          </g>
        ) : isSheet ? (
          <g>
            <polygon points="74,36 226,64 226,164 74,136" fill={material.profile === "gypsumSheet" ? "#f4f4f5" : "#dfc28a"} stroke="#3f3f46" />
            <polygon points="226,64 252,48 252,148 226,164" fill={material.profile === "gypsumSheet" ? "#d4d4d8" : "#b88b47"} stroke="#3f3f46" />
            {material.profile === "osbSheet" && Array.from({ length: 36 }).map((_, index) => <line key={index} x1={84 + (index * 13) % 126} y1={50 + (index * 19) % 78} x2={92 + (index * 17) % 126} y2={56 + (index * 23) % 78} stroke="#76552b" strokeWidth="1" strokeOpacity="0.5" />)}
            {material.profile === "plywoodSheet" && [62, 82, 102, 122].map((y) => <line key={y} x1="76" y1={y} x2="225" y2={y + 28} stroke="#79552b" strokeOpacity="0.45" />)}
          </g>
        ) : (
          <g>
            <g opacity="0.75">
              {isVertical ? [62, 100, 138, 176].map((x) => (
                <rect key={x} x={x} y="32" width="24" height="142" fill="#f8f7f2" stroke="#d6d3d1" />
              )) : [52, 84, 116, 148].map((y) => (
                <rect key={y} x="54" y={y} width="174" height="22" fill="#f8f7f2" stroke="#d6d3d1" />
              ))}
            </g>
            <polygon points="48,92 198,48 258,72 108,118" fill={`url(#wood3d-${material.id})`} stroke="#3f3f46" />
            <polygon points="108,118 258,72 258,126 108,176" fill="#8a4a18" stroke="#3f3f46" />
            <polygon points="48,92 108,118 108,176 48,146" fill="#f3cf8b" stroke="#3f3f46" />
            <path d={profilePath(material.profile)} transform="translate(10 38) scale(.48)" fill="none" stroke="#fff2cc" strokeWidth="3" />
            {["ribbedDeck", "straightGroovePanel", "beveledGroovePanel", "rebatedStraightGroove", "rebatedBeveledGroove", "hattlakt"].includes(material.profile) && [82, 112, 142, 172].map((x) => <line key={x} x1={x} y1={82} x2={x + 60} y2={106} stroke="#3f3f46" strokeWidth="1.2" />)}
            {woodLines(7)}
          </g>
        )}
      </g>
    </svg>
  );
}
