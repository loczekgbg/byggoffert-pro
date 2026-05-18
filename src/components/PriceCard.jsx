import { formatPrice } from "../utils/formatPrice";
import { translateText, useI18n } from "../i18n";

export default function PriceCard({ label, value, color }) {
  const { language } = useI18n();

  return (
    <div className="premium-card-compact overflow-hidden p-5">

      <div className="flex justify-between items-center">

        <span className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">
          {translateText(label, language)}
        </span>

        <span className={`text-2xl font-black sm:text-3xl ${color}`}>
          {formatPrice(value)}
        </span>

      </div>

    </div>
  );
}
