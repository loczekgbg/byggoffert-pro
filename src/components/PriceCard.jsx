export default function PriceCard({ label, value, color }) {
  return (
    <div className="bg-black border border-zinc-800 rounded-3xl p-5">

      <div className="flex justify-between items-center">

        <span className="text-zinc-500 font-bold">
          {label}
        </span>

        <span className={`text-4xl font-black ${color}`}>
          {value.toLocaleString()} SEK
        </span>

      </div>

    </div>
  );
}
