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
            <LathundenPreview material={material} language={language} />
          </PreviewPanel>
          <PreviewPanel title={text("preview3d", language)}>
            <LathundenPreview material={material} language={language} />
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

function LathundenPreview({ material, language }) {
  if (!material.lathundenImage) {
    return (
      <div className="flex min-h-64 items-center justify-center bg-white p-6 text-center text-sm font-bold text-zinc-500">
        {text("notSpecified", language)}
      </div>
    );
  }

  return (
    <div className="bg-white p-2">
      <img
        src={material.lathundenImage}
        alt={localizedName(material.name, language)}
        className="mx-auto max-h-[34rem] w-full rounded-xl object-contain"
        loading="lazy"
      />
    </div>
  );
}
