import { ArrowLeft, ChevronRight } from "lucide-react";

export default function CategoriesScreen({ goBack, openCategory }) {

  const categories = [
    "Målning & Tapeter",
    "Väggar & Tak",
    "Golv",
    "Fönster & Dörrar",
    "Kök & Garderob",
    "Altan & Pergola",
    "Rivning",
    "Konstruktion",
    "Övrigt arbete",
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6">

      <div className="flex items-center gap-4">

        <button
          onClick={goBack}
          className="bg-zinc-900 p-3 rounded-2xl border border-zinc-800"
        >
          <ArrowLeft size={22} />
        </button>

        <div>

          <h1 className="text-3xl font-black">
            Ny offert
          </h1>

          <p className="text-orange-400">
            Välj kategori
          </p>

        </div>

      </div>

      <div className="mt-10 flex flex-col gap-4">

        {categories.map((category) => (

          <button
            key={category}
            onClick={() => openCategory(category)}
            className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 flex items-center justify-between text-left"
          >

            <div>

              <h2 className="text-xl font-bold">
                {category}
              </h2>

              <p className="text-zinc-400 mt-1 text-sm">
                Professionell tjänst
              </p>

            </div>

            <ChevronRight className="text-orange-400" />

          </button>

        ))}

      </div>

    </div>
  );
}
