import {
  ArrowLeft,
  Blocks,
  Brush,
  ChevronRight,
  DoorOpen,
  Hammer,
  Home,
  Layers,
  PaintRoller,
  PanelsTopLeft,
  Ruler,
  Shovel,
  Sofa,
  Wrench,
} from "lucide-react";
import marcinByggLogo from "../assets/marcin-bygg-logo.png";
import { translateText, useI18n } from "../i18n";

const categories = [
  {
    title: "Målning & Tapeter",
    text: "Målning, tapetsering, förarbete",
    icon: PaintRoller,
  },
  {
    title: "Innerväggar & Innertak",
    text: "Gips, reglar, OSB, innertak",
    icon: PanelsTopLeft,
  },
  {
    title: "Golv & Lister",
    text: "Golv, parkett, lister, trösklar",
    icon: Layers,
  },
  {
    title: "Fönster & Dörrar",
    text: "Montering, drevning, foder",
    icon: DoorOpen,
  },
  {
    title: "Kök & Garderob",
    text: "Kök, garderob, bänkskiva",
    icon: Sofa,
  },
  {
    title: "Fasad & Utvändig Renovering",
    text: "Panel, isolering, fasaddetaljer",
    icon: Home,
  },
  {
    title: "Tak & Yttertak",
    text: "Takläggning, detaljer, höjdarbete",
    icon: Blocks,
  },
  {
    title: "Altan, Pergola & Staket",
    text: "Altan, räcken, staket, trall",
    icon: Ruler,
  },
  {
    title: "Service & Småjobb",
    text: "Snabba jobb, montering, reparation",
    icon: Wrench,
  },
  {
    title: "Tillbyggnad & Utebyggnader",
    text: "Garage, förråd, attefallshus",
    icon: Hammer,
  },
  {
    title: "Rivning & Bilning",
    text: "Rivning, bilning, avfall",
    icon: Shovel,
  },
  {
    title: "Konstruktion",
    text: "Balkar, förstärkning, bärande arbete",
    icon: Brush,
  },
];

export default function CategoriesScreen({ goBack, openCategory, openMultiCategory }) {
  const { language, t } = useI18n();

  return (
    <div className="premium-screen safe-bottom">
      <div className="premium-shell py-5 sm:py-8">
        <div className="premium-topbar">
          <button
            type="button"
            onClick={goBack}
            className="premium-icon-button"
            aria-label={t("Tillbaka")}
          >
            <ArrowLeft size={22} />
          </button>

          <div className="min-w-0">
            <p className="premium-kicker">{t("Ny offert")}</p>
            <h1 className="truncate text-2xl font-black sm:text-4xl">
              {t("Välj kategori")}
            </h1>
          </div>

          <img
            src={marcinByggLogo}
            alt="Marcin Bygg"
            className="ml-auto h-12 w-12 shrink-0 rounded-2xl object-contain shadow-xl shadow-orange-500/20"
          />
        </div>

        <button
          type="button"
          onClick={openMultiCategory}
          className="premium-card mt-7 flex min-h-20 w-full touch-manipulation items-center justify-between gap-4 p-5 text-left transition hover:border-orange-400/40"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-orange-400/25 bg-orange-500/10 text-orange-400">
              <Blocks size={24} />
            </div>
            <div>
              <h2 className="text-lg font-black text-orange-200">
                {t("Multi-category offert")}
              </h2>
              <p className="mt-1 text-sm text-zinc-400">
                {t("Lägg flera kategorier i samma offert")}
              </p>
            </div>
          </div>
          <ChevronRight className="shrink-0 text-orange-400" />
        </button>

        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <button
                type="button"
                key={category.title}
                onClick={() => openCategory(category.title)}
                className="premium-card-compact group relative z-10 flex min-h-20 w-full touch-manipulation items-center justify-between gap-4 overflow-hidden p-4 text-left transition hover:border-orange-400/35"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-orange-400/25 bg-orange-500/10 text-orange-400 transition group-hover:bg-orange-500/20">
                    <Icon size={24} />
                  </div>

                  <div className="min-w-0">
                    <h2 className="truncate text-base font-black sm:text-lg">
                      {translateText(category.title, language)}
                    </h2>

                    <p className="mt-1 line-clamp-2 text-sm text-zinc-400">
                      {translateText(category.text, language)}
                    </p>
                  </div>
                </div>

                <ChevronRight className="shrink-0 text-orange-400" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
