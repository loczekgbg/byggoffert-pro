import { useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Camera,
  Check,
  FileDown,
  FolderPlus,
  ImagePlus,
  Loader2,
  Send,
  Share2,
  Sparkles,
  Upload,
} from "lucide-react";
import BeforeAfterSlider from "../components/ai/BeforeAfterSlider";
import { aiBeforeAfterService } from "../services/aiBeforeAfterService";
import { useI18n } from "../i18n";

const projectToolsStorageKey = "marcin-bygg-tools-project-items";
const offerToolsStorageKey = "marcin-bygg-tools-offer-items";
const aiHistoryStorageKey = "marcin-bygg-ai-before-after-history";

const projectTypes = [
  "aiBeforeAfter.projectInterior",
  "aiBeforeAfter.projectDeck",
  "aiBeforeAfter.projectFacade",
  "aiBeforeAfter.projectGarden",
  "aiBeforeAfter.projectRoom",
  "aiBeforeAfter.projectKitchen",
  "aiBeforeAfter.projectBathroom",
  "aiBeforeAfter.projectStairs",
  "aiBeforeAfter.projectFence",
  "aiBeforeAfter.custom",
];

const styleTypes = [
  "aiBeforeAfter.styleModern",
  "aiBeforeAfter.styleScandinavian",
  "aiBeforeAfter.styleClassic",
  "aiBeforeAfter.styleBlackEdition",
  "aiBeforeAfter.styleMinimal",
  "aiBeforeAfter.styleIndustrial",
  "aiBeforeAfter.styleLuxury",
  "aiBeforeAfter.custom",
];

const changeLevels = [
  "aiBeforeAfter.changeLight",
  "aiBeforeAfter.changeMedium",
  "aiBeforeAfter.changeLarge",
];

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

function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function pdfText(value) {
  return String(value).replaceAll("\\", "\\\\").replaceAll("(", "\\(").replaceAll(")", "\\)");
}

function createSimplePdf(lines) {
  const content = [
    "BT /F1 20 Tf 48 780 Td (AI Before / After) Tj ET",
    ...lines.map((line, index) => `BT /F1 11 Tf 48 ${740 - index * 20} Td (${pdfText(line)}) Tj ET`),
  ].join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
  ];
  const parts = ["%PDF-1.4\n"];
  const offsets = [0];
  let cursor = parts[0].length;

  objects.forEach((object, index) => {
    offsets.push(cursor);
    const wrapped = `${index + 1} 0 obj\n${object}\nendobj\n`;
    parts.push(wrapped);
    cursor += wrapped.length;
  });

  const xrefOffset = cursor;
  parts.push(`xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`);
  offsets.slice(1).forEach((offset) => {
    parts.push(`${String(offset).padStart(10, "0")} 00000 n \n`);
  });
  parts.push(`trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`);

  return new Blob(parts, { type: "application/pdf" });
}

function formatDate(value, language) {
  return new Intl.DateTimeFormat(language === "en" ? "en-GB" : language === "pl" ? "pl-PL" : "sv-SE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function AIBeforeAfterScreen({ goBack }) {
  const { language, t } = useI18n();
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const afterInputRef = useRef(null);
  const [beforeImage, setBeforeImage] = useState("");
  const [afterReferenceImage, setAfterReferenceImage] = useState("");
  const [fileName, setFileName] = useState("");
  const [afterFileName, setAfterFileName] = useState("");
  const [projectType, setProjectType] = useState(projectTypes[0]);
  const [customProjectType, setCustomProjectType] = useState("");
  const [styleType, setStyleType] = useState(styleTypes[0]);
  const [customStyleType, setCustomStyleType] = useState("");
  const [customerWishes, setCustomerWishes] = useState("");
  const [woodColor, setWoodColor] = useState("");
  const [wallColor, setWallColor] = useState("");
  const [brightness, setBrightness] = useState(62);
  const [woodAmount, setWoodAmount] = useState(48);
  const [finishType, setFinishType] = useState("");
  const [changeLevel, setChangeLevel] = useState(changeLevels[1]);
  const [isDragging, setIsDragging] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState(() => readStoredItems(aiHistoryStorageKey));

  const selectedProjectType = projectType === "aiBeforeAfter.custom" ? customProjectType || t("aiBeforeAfter.custom") : t(projectType);
  const selectedStyle = styleType === "aiBeforeAfter.custom" ? customStyleType || t("aiBeforeAfter.custom") : t(styleType);
  const selectedChangeLevel = t(changeLevel);

  const resultRows = useMemo(() => [
    ["aiBeforeAfter.projectType", selectedProjectType],
    ["aiBeforeAfter.style", selectedStyle],
    ["aiBeforeAfter.changeLevel", selectedChangeLevel],
    ["aiBeforeAfter.woodColor", woodColor || t("Ej angivet")],
    ["aiBeforeAfter.wallColor", wallColor || t("Ej angivet")],
    ["aiBeforeAfter.finishType", finishType || t("Ej angivet")],
    ["aiBeforeAfter.customerWishes", customerWishes.trim() || t("aiBeforeAfter.noCustomerWishes")],
  ], [customerWishes, finishType, selectedChangeLevel, selectedProjectType, selectedStyle, t, wallColor, woodColor]);

  const handleFile = (file, target = "before") => {
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (target === "after") {
        setAfterReferenceImage(reader.result || "");
        setAfterFileName(file.name);
      } else {
        setBeforeImage(reader.result || "");
        setFileName(file.name);
      }
      setResult(null);
      setMessage("");
    };
    reader.readAsDataURL(file);
  };

  const handleInput = (event, target = "before") => {
    handleFile(event.target.files?.[0], target);
    event.target.value = "";
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    handleFile(event.dataTransfer.files?.[0]);
  };

  const generateResult = async () => {
    if (!beforeImage || isGenerating) return;

    setIsGenerating(true);
    setMessage("");

    const nextResult = await aiBeforeAfterService.analyzeAndGenerate({
      beforeImage,
      afterImage: afterReferenceImage,
      projectType: selectedProjectType,
      style: selectedStyle,
      customerWishes: customerWishes.trim(),
      woodColor,
      wallColor,
      brightness,
      woodAmount,
      finishType,
      changeLevel: selectedChangeLevel,
    });

    setResult(nextResult);
    setIsGenerating(false);
  };

  const historyItem = () => ({
    id: result?.id || createLocalId(),
    createdAt: result?.createdAt || new Date().toISOString(),
    beforeImage,
    afterReferenceImage,
    afterImage: result?.afterImage || "",
    projectType: selectedProjectType,
    style: selectedStyle,
    customerWishes: customerWishes.trim(),
    aiPrompt: {
      projectType: selectedProjectType,
      style: selectedStyle,
      customerWishes: customerWishes.trim(),
      settings: {
        woodColor,
        wallColor,
        brightness,
        woodAmount,
        finishType,
        changeLevel: selectedChangeLevel,
      },
    },
    settings: {
      woodColor,
      wallColor,
      brightness,
      woodAmount,
      finishType,
      changeLevel: selectedChangeLevel,
    },
  });

  const saveHistory = () => {
    if (!result) return;
    const nextItem = historyItem();
    const nextHistory = [nextItem, ...history.filter((item) => item.id !== nextItem.id)].slice(0, 12);

    setHistory(nextHistory);
    localStorage.setItem(aiHistoryStorageKey, JSON.stringify(nextHistory));
    setMessage(t("aiBeforeAfter.savedHistory"));
  };

  const addToProject = () => {
    if (!result) return;
    writeStoredItem(projectToolsStorageKey, {
      ...historyItem(),
      toolId: "ai-before-after",
      title: "AI Before / After",
      results: resultRows,
    });
    setMessage(t("aiBeforeAfter.savedProject"));
  };

  const addToOffer = () => {
    if (!result) return;
    writeStoredItem(offerToolsStorageKey, {
      ...historyItem(),
      toolId: "ai-before-after",
      title: "AI Before / After",
      results: resultRows,
      shoppingItems: [],
    });
    setMessage(t("aiBeforeAfter.savedOffer"));
  };

  const generatePdf = () => {
    if (!result) return;
    const pdf = createSimplePdf(resultRows.map(([label, value]) => `${t(label)}: ${value}`));
    downloadBlob(pdf, "ai-before-after.pdf");
    setMessage(t("aiBeforeAfter.pdfGenerated"));
  };

  const shareResult = async () => {
    if (!result) return;

    const sharePayload = {
      title: "AI Before / After",
      text: [
        `${selectedProjectType} - ${selectedStyle}`,
        customerWishes.trim() ? `${t("aiBeforeAfter.customerWishes")}: ${customerWishes.trim()}` : "",
      ].filter(Boolean).join("\n"),
    };

    if (navigator.share) {
      await navigator.share(sharePayload);
      return;
    }

    await navigator.clipboard?.writeText(sharePayload.text);
    setMessage(t("aiBeforeAfter.shareCopied"));
  };

  return (
    <div className="min-h-[100dvh] overflow-x-hidden bg-zinc-950 p-5 pb-[calc(6rem+env(safe-area-inset-bottom))] text-white">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={goBack}
          className="relative z-10 touch-manipulation rounded-2xl border border-zinc-800 bg-black p-3"
          aria-label={t("Tillbaka")}
        >
          <ArrowLeft size={22} />
        </button>

        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-400">{t("aiBeforeAfter.kicker")}</p>
          <h1 className="text-3xl font-black">AI Before / After</h1>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="grid gap-5">
          <section className="rounded-3xl border border-white/10 bg-zinc-900/80 p-5 shadow-2xl shadow-black/25">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500 text-black">
                <ImagePlus size={22} />
              </div>
              <div>
                <p className="text-lg font-black">{t("aiBeforeAfter.addPhoto")}</p>
                <p className="text-sm text-zinc-400">{t("aiBeforeAfter.addPhotoHint")}</p>
              </div>
            </div>

            <div
              className={`mt-4 rounded-3xl border border-dashed p-4 transition ${
                isDragging ? "border-orange-300 bg-orange-500/10" : "border-white/15 bg-black/40"
              }`}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              {beforeImage ? (
                <img src={beforeImage} alt={t("aiBeforeAfter.before")} className="aspect-[4/3] w-full rounded-2xl object-cover" />
              ) : (
                <div className="flex aspect-[4/3] flex-col items-center justify-center rounded-2xl bg-zinc-950 text-center">
                  <Upload className="text-orange-400" size={34} />
                  <p className="mt-3 max-w-xs text-sm font-bold text-zinc-300">{t("aiBeforeAfter.dropHint")}</p>
                </div>
              )}
              {fileName && <p className="mt-3 truncate text-xs text-zinc-500">{fileName}</p>}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleInput} />
              <input ref={galleryInputRef} type="file" accept="image/*" className="hidden" onChange={handleInput} />
              <input ref={afterInputRef} type="file" accept="image/*" className="hidden" onChange={(event) => handleInput(event, "after")} />
              <button type="button" onClick={() => cameraInputRef.current?.click()} className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-orange-400/40 bg-orange-500/10 px-4 text-sm font-black text-orange-200">
                <Camera size={18} />
                {t("aiBeforeAfter.camera")}
              </button>
              <button type="button" onClick={() => galleryInputRef.current?.click()} className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm font-black text-white">
                <ImagePlus size={18} />
                {t("aiBeforeAfter.gallery")}
              </button>
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-black/35 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-black text-white">{t("aiBeforeAfter.addAfterPhoto")}</p>
                  <p className="mt-1 text-xs text-zinc-500">{t("aiBeforeAfter.addAfterPhotoHint")}</p>
                </div>
                <button
                  type="button"
                  onClick={() => afterInputRef.current?.click()}
                  className="flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-xs font-black text-white"
                >
                  <ImagePlus size={16} />
                  {t("aiBeforeAfter.gallery")}
                </button>
              </div>
              {afterReferenceImage && (
                <div className="mt-3">
                  <img src={afterReferenceImage} alt={t("aiBeforeAfter.after")} className="aspect-[4/3] w-full rounded-2xl object-cover" />
                  {afterFileName && <p className="mt-2 truncate text-xs text-zinc-500">{afterFileName}</p>}
                </div>
              )}
            </div>
          </section>

          <ChoiceSection title={t("aiBeforeAfter.projectType")}>
            <SegmentedGrid options={projectTypes} value={projectType} onChange={setProjectType} />
            {projectType === "aiBeforeAfter.custom" && (
              <TextInput label={t("aiBeforeAfter.customProject")} value={customProjectType} onChange={setCustomProjectType} />
            )}
          </ChoiceSection>

          <ChoiceSection title={t("aiBeforeAfter.style")}>
            <SegmentedGrid options={styleTypes} value={styleType} onChange={setStyleType} />
            {styleType === "aiBeforeAfter.custom" && (
              <TextInput label={t("aiBeforeAfter.customStyle")} value={customStyleType} onChange={setCustomStyleType} />
            )}
          </ChoiceSection>

          <ChoiceSection title={t("aiBeforeAfter.customerWishes")}>
            <TextAreaInput
              label={t("aiBeforeAfter.customerWishesHint")}
              value={customerWishes}
              onChange={setCustomerWishes}
              placeholder={t("aiBeforeAfter.customerWishesPlaceholder")}
            />
          </ChoiceSection>

          <ChoiceSection title={t("aiBeforeAfter.optionalSettings")}>
            <div className="grid gap-3 sm:grid-cols-2">
              <TextInput label={t("aiBeforeAfter.woodColor")} value={woodColor} onChange={setWoodColor} />
              <TextInput label={t("aiBeforeAfter.wallColor")} value={wallColor} onChange={setWallColor} />
              <TextInput label={t("aiBeforeAfter.finishType")} value={finishType} onChange={setFinishType} />
              <SliderInput label={t("aiBeforeAfter.brightness")} value={brightness} onChange={setBrightness} />
              <SliderInput label={t("aiBeforeAfter.woodAmount")} value={woodAmount} onChange={setWoodAmount} />
            </div>
            <div className="mt-3">
              <p className="mb-2 text-sm font-black text-zinc-300">{t("aiBeforeAfter.changeLevel")}</p>
              <SegmentedGrid options={changeLevels} value={changeLevel} onChange={setChangeLevel} />
            </div>
          </ChoiceSection>

          <button
            type="button"
            onClick={generateResult}
            disabled={!beforeImage || isGenerating}
            className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 text-base font-black text-black shadow-xl shadow-orange-500/20 disabled:opacity-45"
          >
            {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
            {isGenerating ? t("aiBeforeAfter.generating") : t("aiBeforeAfter.generate")}
          </button>
        </div>

        <div className="grid content-start gap-5">
          <section className="rounded-3xl border border-orange-400/25 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-5 shadow-2xl shadow-orange-500/10">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-400">{t("aiBeforeAfter.result")}</p>
                <h2 className="text-2xl font-black">{t("aiBeforeAfter.comparison")}</h2>
              </div>
              {result && <Check className="text-orange-400" size={24} />}
            </div>

            {result ? (
              <BeforeAfterSlider
                beforeImage={beforeImage}
                afterImage={result.afterImage}
                beforeLabel={t("aiBeforeAfter.before")}
                afterLabel={t("aiBeforeAfter.after")}
              />
            ) : (
              <div className="flex aspect-[4/3] items-center justify-center rounded-3xl border border-white/10 bg-black/50 p-6 text-center text-sm font-bold text-zinc-500">
                {isGenerating ? t("aiBeforeAfter.analyzing") : t("aiBeforeAfter.waitingForImage")}
              </div>
            )}

            {result && (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <ActionButton icon={FolderPlus} label={t("aiBeforeAfter.saveProject")} onClick={addToProject} primary />
                <ActionButton icon={Send} label={t("aiBeforeAfter.addOffer")} onClick={addToOffer} />
                <ActionButton icon={FileDown} label={t("aiBeforeAfter.generatePdf")} onClick={generatePdf} />
                <ActionButton icon={Share2} label={t("aiBeforeAfter.share")} onClick={shareResult} />
                <ActionButton icon={Check} label={t("aiBeforeAfter.saveHistory")} onClick={saveHistory} />
              </div>
            )}

            {message && <p className="mt-4 rounded-2xl border border-orange-400/30 bg-orange-500/10 px-4 py-3 text-sm font-bold text-orange-200">{message}</p>}
          </section>

          <section className="rounded-3xl border border-white/10 bg-zinc-900/80 p-5">
            <h2 className="text-xl font-black">{t("aiBeforeAfter.history")}</h2>
            <div className="mt-4 grid gap-3">
              {history.length === 0 && (
                <p className="rounded-2xl border border-white/10 bg-black/35 p-4 text-sm text-zinc-500">{t("aiBeforeAfter.emptyHistory")}</p>
              )}
              {history.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setBeforeImage(item.beforeImage);
                    setAfterReferenceImage(item.afterReferenceImage || "");
                    setResult({ id: item.id, createdAt: item.createdAt, afterImage: item.afterImage });
                    setProjectType("aiBeforeAfter.custom");
                    setCustomProjectType(item.projectType);
                    setStyleType("aiBeforeAfter.custom");
                    setCustomStyleType(item.style);
                    setCustomerWishes(item.customerWishes || "");
                  }}
                  className="grid grid-cols-[4.5rem_1fr] gap-3 rounded-2xl border border-white/10 bg-black/35 p-3 text-left transition active:scale-[0.99]"
                >
                  <img src={item.afterImage || item.beforeImage} alt="" className="h-16 w-16 rounded-xl object-cover" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-black text-white">{item.projectType}</span>
                    <span className="block truncate text-xs text-orange-300">{item.style}</span>
                    {item.customerWishes && <span className="mt-1 line-clamp-2 block text-xs text-zinc-400">{item.customerWishes}</span>}
                    <span className="mt-1 block text-xs text-zinc-500">{formatDate(item.createdAt, language)}</span>
                  </span>
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function ChoiceSection({ title, children }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-zinc-900/80 p-5 shadow-2xl shadow-black/20">
      <h2 className="text-lg font-black">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function SegmentedGrid({ options, value, onChange }) {
  const { t } = useI18n();

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {options.map((option) => {
        const active = value === option;

        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`min-h-11 rounded-2xl border px-3 text-sm font-black transition active:scale-[0.98] ${
              active ? "border-orange-400 bg-orange-500 text-black" : "border-white/10 bg-black/35 text-zinc-200"
            }`}
          >
            {t(option)}
          </button>
        );
      })}
    </div>
  );
}

function TextInput({ label, value, onChange }) {
  return (
    <label className="block text-sm font-bold text-zinc-400">
      {label}
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 min-h-12 w-full rounded-2xl border border-white/10 bg-black px-4 text-base font-bold text-white outline-none"
      />
    </label>
  );
}

function TextAreaInput({ label, value, onChange, placeholder }) {
  return (
    <label className="block text-sm font-bold text-zinc-400">
      {label}
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={5}
        className="mt-2 min-h-36 w-full resize-y rounded-2xl border border-white/10 bg-black px-4 py-3 text-base font-bold text-white outline-none placeholder:text-zinc-600"
      />
    </label>
  );
}

function SliderInput({ label, value, onChange }) {
  return (
    <label className="block text-sm font-bold text-zinc-400">
      <span className="flex justify-between gap-3">
        <span>{label}</span>
        <span className="text-orange-300">{value}%</span>
      </span>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-3 w-full accent-orange-400"
      />
    </label>
  );
}

function ActionButton({ icon: Icon, label, onClick, primary = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-12 items-center justify-center gap-2 rounded-2xl border px-4 text-sm font-black transition active:scale-[0.98] ${
        primary ? "border-orange-400 bg-orange-500 text-black" : "border-white/10 bg-white/[0.04] text-white"
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );
}
