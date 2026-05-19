import { translateText, useI18n } from "../i18n";

export default function Card({ icon, title, text, onClick }) {
  const { language } = useI18n();

  return (
    <button
      type="button"
      onClick={onClick}
      className="premium-dashboard-card group relative z-10 w-full touch-manipulation overflow-hidden text-center backdrop-blur-xl transition hover:border-orange-400/35"
    >
      <span className="pointer-events-none absolute right-0 top-0 h-20 w-20 -translate-y-10 translate-x-8 rounded-full bg-orange-400/10 blur-2xl transition group-hover:bg-orange-400/20" />

      <div className="mx-auto flex h-12 w-12 items-center justify-center text-orange-400">
        {icon}
      </div>

      <h2 className="mt-4 break-normal text-[0.78rem] font-black uppercase tracking-wide text-white sm:text-base">
        {translateText(title, language)}
      </h2>

      <p className="mt-1 text-[0.68rem] leading-snug text-zinc-400 sm:text-xs">
        {translateText(text, language)}
      </p>

    </button>
  );
}
