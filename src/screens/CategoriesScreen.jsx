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
    <div className="min-h-[100dvh] overflow-x-hidden bg-black p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] text-white">

      <div className="flex items-center gap-4">

        <button
          type="button"
          onClick={goBack}
          className="relative z-10 touch-manipulation rounded-2xl border border-zinc-800 bg-zinc-900 p-3"
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
            type="button"
            key={category}
            onClick={() => openCategory(category)}
            className="relative z-10 flex min-h-20 w-full touch-manipulation items-center justify-between rounded-3xl border border-zinc-800 bg-zinc-900 p-5 text-left"
          >

            <div>

              <h2 className="text-xl font-bold">
                {category}
              </h2>

              <p className="mt-1 text-sm text-zinc-400">
                Professionell tjänst
              </p>

            </div>

            <ChevronRight className="shrink-0 text-orange-400" />

          </button>

        ))}

      </div>

    </div>
  );
}
