import { formatPrice } from "../utils/formatPrice";
import { translateText, useI18n } from "../i18n";

export default function PriceCard({ label, value, color }) {
  const { language } = useI18n();

  return (
    <div className="bg-black border border-zinc-800 rounded-3xl p-5">

      <div className="flex justify-between items-center">

        <span className="text-zinc-500 font-bold">
          {translateText(label, language)}
        </span>

        <span className={`text-4xl font-black ${color}`}>
          {formatPrice(value)}
        </span>

      </div>

    </div>
  );
}
