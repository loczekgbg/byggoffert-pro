export default function Card({ icon, title, text, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative z-10 min-h-36 w-full touch-manipulation rounded-3xl border border-zinc-800 bg-zinc-900/95 p-5 text-left backdrop-blur-xl"
    >

      <div className="text-orange-400">
        {icon}
      </div>

      <h2 className="text-2xl font-bold mt-6">
        {title}
      </h2>

      <p className="text-zinc-400 mt-2 text-sm">
        {text}
      </p>

    </button>
  );
}
