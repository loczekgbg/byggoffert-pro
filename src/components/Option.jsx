import { translateText, useI18n } from "../i18n";

export default function Option({ title, active, onClick }) {
  const { language } = useI18n();

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative z-10 min-h-14 w-full touch-manipulation rounded-2xl border p-4 text-left shadow-lg shadow-black/20 transition ${
        active
          ? "border-orange-400 bg-orange-500 text-black"
          : "border-zinc-800 bg-black text-white hover:border-orange-400/35"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-black">
          {translateText(title, language)}
        </span>

        <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-black ${active ? "border-black/20 bg-black/10" : "border-white/10 text-transparent"}`}>
          {active ? "✓" : ""}
        </span>
      </div>
    </button>
  );
}
