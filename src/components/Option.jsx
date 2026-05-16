export default function Option({ title, active, onClick }) {
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

      <div className="flex justify-between items-center">

        <span className="font-bold">
          {title}
        </span>

        <span>
          {active ? "✓" : ""}
        </span>

      </div>

    </button>
  );
}
