import { translateText, useI18n } from "../i18n";

export default function Option({ title, active, onClick }) {
  const { language } = useI18n();

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative z-10 min-h-14 w-full touch-manipulation rounded-2xl border p-4 text-left transition ${
        active
          ? "bg-orange-500 text-black border-orange-400"
          : "bg-black border-zinc-800 text-white"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="font-bold">
          {translateText(title, language)}
        </span>

        <span>
          {active ? "✓" : ""}
        </span>
      </div>
    </button>
  );
}
