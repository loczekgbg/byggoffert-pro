export default function Card({ icon, title, text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-zinc-900/95 border border-zinc-800 rounded-3xl p-5 backdrop-blur-xl text-left"
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
