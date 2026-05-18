import { translateText, useI18n } from "../i18n";

export default function Card({ icon, title, text, onClick }) {
  const { language } = useI18n();

  return (
    <button
      type="button"
      onClick={onClick}
      className="premium-card-compact group relative z-10 min-h-32 w-full touch-manipulation overflow-hidden p-4 text-left backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-orange-400/35 sm:min-h-36 sm:p-5"
    >
      <span className="pointer-events-none absolute right-0 top-0 h-20 w-20 -translate-y-10 translate-x-8 rounded-full bg-orange-400/10 blur-2xl transition group-hover:bg-orange-400/20" />

      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-orange-400/25 bg-orange-500/10 text-orange-400 shadow-lg shadow-orange-500/10">
        {icon}
      </div>

      <h2 className="mt-5 break-normal text-[0.95rem] font-black uppercase tracking-wide text-white sm:text-lg">
        {translateText(title, language)}
      </h2>

      <p className="mt-1 text-xs leading-relaxed text-zinc-400 sm:text-sm">
        {translateText(text, language)}
      </p>

    </button>
  );
}
