import { translateText, useI18n } from "../i18n";

export default function Card({ icon, title, text, onClick }) {
  const { language } = useI18n();

  return (
    <button
      type="button"
      onClick={onClick}
      className="premium-dashboard-card group relative z-10 w-full touch-manipulation overflow-hidden text-center"
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center text-orange-400">
        {icon}
      </div>

      <h2 className="mt-4 text-[0.72rem] font-black uppercase tracking-normal text-white sm:text-base">
        {translateText(title, language)}
      </h2>

      <p className="mt-1 text-[0.68rem] leading-snug text-zinc-400 sm:text-xs">
        {translateText(text, language)}
      </p>
    </button>
  );
}
