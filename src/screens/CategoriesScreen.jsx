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
      <div className="premium-shell py-4 sm:py-8">
        <div className="premium-topbar">
          <button
            type="button"
            onClick={goBack}
            className="premium-icon-button"
            aria-label={t("Tillbaka")}
          >
            <ArrowLeft size={22} />
          </button>

          <div className="min-w-0 text-center">
            <h1 className="truncate text-2xl font-black uppercase tracking-wide sm:text-4xl">
              {t("Ny offert")}
            </h1>
            <p className="text-sm font-black text-orange-400">
              {t("Välj kategori")}
            </p>
          </div>

          <img
            src={marcinByggLogo}
            alt="Marcin Bygg"
            className="ml-auto h-11 w-11 shrink-0 rounded-2xl object-contain shadow-xl shadow-orange-500/20"
          />
        </div>

        <button
          type="button"
          onClick={openMultiCategory}
          className="premium-category-row mt-6 border-orange-400/30 bg-orange-500/10"
        >
          <div className="premium-category-icon">
            <Blocks size={24} />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-base font-black uppercase text-orange-100">
              {t("Multi-category offert")}
            </h2>
            <p className="mt-0.5 truncate text-xs text-zinc-400">
              {t("Lägg flera kategorier i samma offert")}
            </p>
          </div>
          <ChevronRight className="shrink-0 text-orange-400" />
        </button>

        <div className="mt-4 grid gap-2.5 lg:grid-cols-2">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <button
                type="button"
                key={category.title}
                onClick={() => openCategory(category.title)}
                className="premium-category-row"
              >
                <div className="premium-category-icon">
                  <Icon size={24} />
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-sm font-black uppercase text-white sm:text-base">
                    {translateText(category.title, language)}
                  </h2>

                  <p className="mt-0.5 truncate text-xs text-zinc-400">
                    {translateText(category.text, language)}
                  </p>
                </div>

                <ChevronRight className="shrink-0 text-zinc-500" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
