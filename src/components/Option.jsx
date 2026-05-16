export default function Option({ title, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl p-4 border text-left transition ${
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
