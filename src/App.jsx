import { useState } from "react";

import {
  Calculator,
  Folder,
  User,
  Hammer,
  Settings,
  Menu,
  ArrowLeft,
} from "lucide-react";

import Card from "./components/Card";
import Option from "./components/Option";
import PriceCard from "./components/PriceCard";
import CategoriesScreen from "./screens/CategoriesScreen";
import { formatPrice } from "./utils/formatPrice";

export default function App() {

  const [screen, setScreen] = useState("home");
  const [selectedCategory, setSelectedCategory] = useState("");
  if (screen === "categories") {
    return (
      <CategoriesScreen
        goBack={() => setScreen("home")}
        openCategory={(category) => {
  setSelectedCategory(category);
  setScreen("calculator");
}}
      />
    );
  }

  if (screen === "calculator") {
    return (
      <CategoryCalculator
  key={selectedCategory}
  category={selectedCategory}
  goBack={() => setScreen("categories")}
/>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">

      {/* HERO */}
      <div className="relative h-[420px] overflow-hidden">

        <img
          src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />

        <div className="absolute inset-0 bg-black/70" />

        <div className="relative z-10 p-6">

          <div className="flex justify-between items-center">

            <button className="bg-zinc-900/80 p-3 rounded-2xl border border-zinc-800">
              <Menu size={24} />
            </button>

            <button className="bg-zinc-900/80 p-3 rounded-2xl border border-zinc-800">
              <Settings size={22} />
            </button>

          </div>

          <div className="mt-12">

            <h1 className="text-6xl font-black tracking-tight text-white">
              SNICKARE
            </h1>

            <p className="text-orange-400 text-2xl italic mt-2">
              Med kvalitet i varje detalj
            </p>

            <p className="text-zinc-300 mt-8 max-w-xs leading-relaxed">
              Professionell snickarservice för hem och företag.
            </p>

          </div>
        </div>
      </div>

      {/* GRID */}
      <div className="px-6 -mt-14 relative z-20">

        <div className="grid grid-cols-2 gap-4">

          <Card
            onClick={() => setScreen("categories")}
            icon={<Calculator size={34} />}
            title="Ny offert"
            text="Skapa nytt kostnadsförslag"
          />

          <Card
            icon={<Folder size={34} />}
            title="Historia"
            text="Tidigare projekt"
          />

          <Card
            icon={<User size={34} />}
            title="Kunder"
            text="Hantera kunder"
          />

          <Card
            icon={<Hammer size={34} />}
            title="Material"
            text="Priser & material"
          />

        </div>

      </div>

      {/* CONTACT */}
      <div className="px-6 mt-10 pb-10">

        <div className="bg-orange-500 rounded-3xl p-6 text-black">

          <p className="font-bold text-sm">
            KONTAKTA MIG IDAG
          </p>

          <h2 className="text-4xl font-black mt-2">
            076 320 5125
          </h2>

        </div>

      </div>

    </div>
  );
}

const defaultCalculatorOptions = [
  {
    id: "stairs",
    title: "Trappa",
    price: ({ active }) => (active ? 4000 : 0),
  },
  {
    id: "pergola",
    title: "Pergola",
    price: ({ active }) => (active ? 12000 : 0),
  },
  {
    id: "customerMaterial",
    title: "Kund står för material",
    defaultActive: true,
    price: ({ area, active }) => (active ? 0 : area * 350),
  },
  {
    id: "waste",
    title: "Avfallshantering",
    price: ({ active }) => (active ? 2500 : 0),
  },
  {
    id: "trailer",
    title: "Släpvagn",
    price: ({ active }) => (active ? 1000 : 0),
  },
];

const calculatorConfigs = {
  default: {
    workTime: "3-5 dagar",
    basePrice: (area) => area * 600,
    options: defaultCalculatorOptions,
  },
  "Målning & Tapeter": {
    workTime: "2-4 dagar",
    basePrice: (area) => area * 180,
    options: defaultCalculatorOptions,
  },
  Golv: {
    workTime: "1-3 dagar",
    basePrice: (area) => area * 250,
    options: [
      {
        id: "removeOldFloor",
        title: "Rivning av gammalt golv",
        price: ({ area, active }) => (active ? area * 120 : 0),
      },
      {
        id: "underlay",
        title: "Underlagsmatta",
        price: ({ area, active }) => (active ? area * 80 : 0),
      },
      {
        id: "skirting",
        title: "Socklar och lister",
        price: ({ area, active }) => (active ? area * 90 : 0),
      },
      {
        id: "thresholds",
        title: "Trösklar och avslut",
        price: ({ active }) => (active ? 1200 : 0),
      },
      {
        id: "floorMaterial",
        title: "Golvmaterial ingår",
        price: ({ area, active }) => (active ? area * 350 : 0),
      },
    ],
  },
  "Altan & Pergola": {
    workTime: "4-7 dagar",
    basePrice: () => 0,
    sections: [
      {
        title: "Konstruktion",
        options: [
          {
            id: "deckingOnly",
            title: "Endast trallbyte",
            defaultActive: true,
            excludes: ["newFrame"],
            price: ({ area, active }) => (active ? area * 450 : 0),
          },
          {
            id: "deckRepair",
            title: "Reparation",
            price: ({ area, active }) => (active ? area * 600 : 0),
          },
          {
            id: "newFrame",
            title: "Ny stomme",
            excludes: ["deckingOnly"],
            price: ({ area, active }) => (active ? area * 900 : 0),
          },
        ],
      },
      {
        title: "Räcken",
        exclusive: true,
        options: [
          {
            id: "noRailings",
            title: "Inga räcken",
            defaultActive: true,
            price: () => 0,
          },
          {
            id: "simpleRailings",
            title: "Enkla räcken",
            price: ({ area, active }) => (active ? area * 250 : 0),
          },
          {
            id: "premiumRailings",
            title: "Premium räcken",
            price: ({ area, active }) => (active ? area * 450 : 0),
          },
        ],
      },
      {
        title: "Tillägg",
        options: [
          {
            id: "pergolaRoof",
            title: "Pergolatak",
            price: ({ area, active }) => (active ? area * 350 : 0),
          },
          {
            id: "deckStairs",
            title: "Trappa till altan",
            price: ({ active }) => (active ? 5000 : 0),
          },
          {
            id: "groundPrep",
            title: "Markförberedelse",
            price: ({ area, active }) => (active ? area * 180 : 0),
          },
          {
            id: "woodTreatment",
            title: "Olja och träskydd",
            price: ({ area, active }) => (active ? area * 90 : 0),
          },
          {
            id: "complexDeck",
            title: "Komplicerad altan",
            price: ({ area, active }) => (active ? area * 300 : 0),
          },
          {
            id: "ledLighting",
            title: "LED-belysning",
            price: ({ area, active }) => (active ? area * 160 : 0),
          },
        ],
      },
    ],
  },
};

function CategoryCalculator({ category, goBack }) {

  const [area, setArea] = useState(25);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
  });

  const calculatorConfig = calculatorConfigs[category] || calculatorConfigs.default;
  const calculatorSections = calculatorConfig.sections || [
    {
      options: calculatorConfig.options,
    },
  ];
  const calculatorOptions = calculatorSections.flatMap((section) => {
    return section.options.map((option) => ({
      ...option,
      sectionTitle: section.title,
      exclusive: section.exclusive ?? false,
      sectionOptionIds: section.options.map((sectionOption) => sectionOption.id),
    }));
  });

  const getOptionActive = (option) => {
    return selectedOptions[option.id] ?? option.defaultActive ?? false;
  };

  const toggleOption = (option) => {
    setSelectedOptions((currentOptions) => {
      const active = currentOptions[option.id] ?? option.defaultActive ?? false;

      if (option.exclusive) {
        const nextOptions = {
          ...currentOptions,
        };

        option.sectionOptionIds.forEach((optionId) => {
          nextOptions[optionId] = false;
        });

        return {
          ...nextOptions,
          [option.id]: true,
        };
      }

      if (!active && option.excludes) {
        const nextOptions = {
          ...currentOptions,
        };

        option.excludes.forEach((optionId) => {
          nextOptions[optionId] = false;
        });

        return {
          ...nextOptions,
          [option.id]: true,
        };
      }

      return {
        ...currentOptions,
        [option.id]: !active,
      };
    });
  };

  let normalPrice = calculatorConfig.basePrice(area);
  let workTime = calculatorConfig.workTime;

  calculatorOptions.forEach((option) => {
    normalPrice += option.price({
      area,
      active: getOptionActive(option),
    });
  });

  const selectedOptionDetails = calculatorOptions
    .filter((option) => getOptionActive(option))
    .map((option) => ({
      ...option,
      priceValue: option.price({
        area,
        active: true,
      }),
    }));

  const minPrice = Math.round(normalPrice * 0.85);

  const premiumPrice = Math.round(normalPrice * 1.3);


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
            {category}
          </h1>

          <p className="text-orange-400">
            Kostnadsberäkning
          </p>

        </div>

      </div>

      <div className="mt-10 bg-zinc-900 rounded-3xl border border-zinc-800 p-6">

        {/* AREA */}
        <div>

          <label className="text-zinc-400 text-sm">
            Storlek m²
          </label>

          <input
            type="number"
            value={area}
            onChange={(e) => setArea(Number(e.target.value))}
            className="mt-3 w-full bg-black border border-zinc-800 rounded-2xl p-4 text-3xl font-bold outline-none"
          />

        </div>

        {/* CUSTOMER */}
        <div className="mt-8 border-t border-zinc-800 pt-8">

          <h2 className="text-sm font-bold uppercase text-zinc-500">
            Kunduppgifter
          </h2>

          <div className="mt-4 grid gap-4">

            <CustomerField
              label="Namn"
              value={customer.name}
              onChange={(value) => setCustomer({ ...customer, name: value })}
            />

            <CustomerField
              label="Telefon"
              value={customer.phone}
              onChange={(value) => setCustomer({ ...customer, phone: value })}
            />

            <CustomerField
              label="Adress"
              value={customer.address}
              onChange={(value) => setCustomer({ ...customer, address: value })}
            />

            <CustomerField
              label="Anteckningar"
              value={customer.notes}
              onChange={(value) => setCustomer({ ...customer, notes: value })}
              multiline
            />

          </div>

        </div>

        {/* OPTIONS */}
        <div className="mt-8 flex flex-col gap-4">

          {calculatorSections.map((section) => (

            <div key={section.title || "options"} className="flex flex-col gap-3">

              {section.title && (
                <h2 className="text-sm font-bold uppercase text-zinc-500">
                  {section.title}
                </h2>
              )}

              {section.options.map((option) => {
                const optionWithSection = {
                  ...option,
                  sectionTitle: section.title,
                  exclusive: section.exclusive ?? false,
                  sectionOptionIds: section.options.map((sectionOption) => sectionOption.id),
                };

                return (
                  <Option
                    key={option.id}
                    title={option.title}
                    active={getOptionActive(optionWithSection)}
                    onClick={() => toggleOption(optionWithSection)}
                  />
                );
              })}

            </div>

          ))}

        </div>

        {/* RESULT */}
        <div className="mt-10 border-t border-zinc-800 pt-8">

          <div className="flex flex-col gap-5">

            <PriceCard
              label="MIN"
              value={minPrice}
              color="text-zinc-300"
            />

            <PriceCard
              label="NORMAL"
              value={normalPrice}
              color="text-orange-400"
            />

            <PriceCard
              label="PREMIUM"
              value={premiumPrice}
              color="text-red-400"
            />

          </div>

          <div className="mt-10 border-t border-zinc-800 pt-6">

            <div className="flex justify-between">

              <span className="text-zinc-400">
                Arbetstid
              </span>

              <span>
{workTime}              </span>

            </div>

            <div className="mt-3 flex justify-between">

              <span className="text-zinc-400">
                Antal personer
              </span>

              <span>
                2 personer
              </span>

            </div>

          </div>

        </div>

      </div>

      <div className="mt-6 overflow-hidden rounded-3xl border border-orange-400/30 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black shadow-2xl shadow-orange-500/10">

        <div className="border-b border-white/10 bg-white/[0.03] p-6">

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">
            Offertöversikt
          </p>

          <div className="mt-3 flex items-end justify-between gap-4">

            <div>

              <h2 className="text-3xl font-black">
                {category}
              </h2>

              <p className="mt-1 text-sm text-zinc-400">
                {area} m² · {workTime}
              </p>

            </div>

            <div className="text-right">

              <p className="text-xs uppercase text-zinc-500">
                Normalpris
              </p>

              <p className="text-3xl font-black text-orange-400">
                {formatPrice(normalPrice)}
              </p>

            </div>

          </div>

        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-2">

          <div>

            <h3 className="text-sm font-bold uppercase text-zinc-500">
              Kund
            </h3>

            <div className="mt-4 space-y-3 text-sm">

              <SummaryRow label="Namn" value={customer.name || "Inte angivet"} />
              <SummaryRow label="Telefon" value={customer.phone || "Inte angivet"} />
              <SummaryRow label="Adress" value={customer.address || "Inte angivet"} />
              <SummaryRow label="Anteckningar" value={customer.notes || "Inga anteckningar"} />

            </div>

          </div>

          <div>

            <h3 className="text-sm font-bold uppercase text-zinc-500">
              Valda alternativ
            </h3>

            <div className="mt-4 flex flex-col gap-3">

              {selectedOptionDetails.map((option) => (

                <div
                  key={option.id}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
                >

                  <div>

                    <p className="font-bold">
                      {option.title}
                    </p>

                    {option.sectionTitle && (
                      <p className="text-xs text-zinc-500">
                        {option.sectionTitle}
                      </p>
                    )}

                  </div>

                  <span className="text-sm font-bold text-orange-300">
                    {option.priceValue > 0 ? `+${formatPrice(option.priceValue)}` : "Ingår"}
                  </span>

                </div>

              ))}

            </div>

          </div>

        </div>

        <div className="grid grid-cols-3 border-t border-white/10 text-center">

          <SummaryPrice label="MIN" value={minPrice} />
          <SummaryPrice label="NORMAL" value={normalPrice} highlight />
          <SummaryPrice label="PREMIUM" value={premiumPrice} />

        </div>

      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">

        <ActionButton>
          Spara offert
        </ActionButton>

        <ActionButton>
          Exportera PDF
        </ActionButton>

        <ActionButton onClick={goBack} variant="primary">
          Ny offert
        </ActionButton>

      </div>

    </div>
  );
}

function CustomerField({ label, value, onChange, multiline = false }) {
  const inputClassName = "mt-2 w-full rounded-2xl border border-zinc-800 bg-black p-4 text-white outline-none transition focus:border-orange-400";

  return (
    <label className="block text-sm text-zinc-400">
      {label}

      {multiline ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`${inputClassName} min-h-28 resize-none`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={inputClassName}
        />
      )}
    </label>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
      <p className="text-xs uppercase text-zinc-500">
        {label}
      </p>

      <p className="mt-1 font-bold text-white">
        {value}
      </p>
    </div>
  );
}

function SummaryPrice({ label, value, highlight = false }) {
  return (
    <div className={`p-5 ${highlight ? "bg-orange-500 text-black" : "bg-black/30 text-white"}`}>
      <p className={`text-xs font-bold ${highlight ? "text-black/60" : "text-zinc-500"}`}>
        {label}
      </p>

      <p className="mt-1 text-lg font-black sm:text-2xl">
        {formatPrice(value).replace(" SEK", "")}
      </p>

      <p className={`text-xs ${highlight ? "text-black/60" : "text-zinc-500"}`}>
        SEK
      </p>
    </div>
  );
}

function ActionButton({ children, onClick, variant = "secondary" }) {
  const isPrimary = variant === "primary";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-14 rounded-2xl border px-5 text-sm font-black uppercase tracking-wide transition active:scale-[0.98] ${
        isPrimary
          ? "border-orange-400 bg-orange-500 text-black shadow-xl shadow-orange-500/20"
          : "border-white/10 bg-zinc-900 text-white shadow-xl shadow-black/20"
      }`}
    >
      {children}
    </button>
  );
}

