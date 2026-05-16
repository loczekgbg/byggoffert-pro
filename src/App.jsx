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
  const [savedOffers, setSavedOffers] = useState(() => loadSavedOffers());

  const saveOffer = (offer) => {
    const nextOffers = [
      offer,
      ...savedOffers,
    ];

    setSavedOffers(nextOffers);
    localStorage.setItem("snickareOffers", JSON.stringify(nextOffers));
  };

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
  onSaveOffer={saveOffer}
/>
    );
  }

  if (screen === "history") {
    return (
      <HistoryScreen
        goBack={() => setScreen("home")}
        offers={savedOffers}
      />
    );
  }

  return (
    <div className="min-h-[100dvh] overflow-x-hidden bg-black text-white">

      {/* HERO */}
      <div className="relative h-[420px] overflow-hidden">

        <img
          src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-30"
        />

        <div className="pointer-events-none absolute inset-0 bg-black/70" />

        <div className="relative z-10 p-6">

          <div className="flex justify-between items-center">

            <button type="button" className="relative z-10 touch-manipulation rounded-2xl border border-zinc-800 bg-zinc-900/80 p-3">
              <Menu size={24} />
            </button>

            <button type="button" className="relative z-10 touch-manipulation rounded-2xl border border-zinc-800 bg-zinc-900/80 p-3">
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
      <div className="relative z-20 -mt-14 px-6">

        <div className="grid grid-cols-2 gap-4">

          <Card
            onClick={() => setScreen("categories")}
            icon={<Calculator size={34} />}
            title="Ny offert"
            text="Skapa nytt kostnadsförslag"
          />

          <Card
            onClick={() => setScreen("history")}
            icon={<Folder size={34} />}
            title="Historik"
            text="Sparade offerter"
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
      <div className="mt-10 px-6 pb-[calc(2.5rem+env(safe-area-inset-bottom))]">

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

function loadSavedOffers() {
  try {
    return JSON.parse(localStorage.getItem("snickareOffers")) || [];
  } catch {
    return [];
  }
}

function HistoryScreen({ offers, goBack }) {
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
            Historik
          </h1>

          <p className="text-orange-400">
            Sparade offerter
          </p>

        </div>

      </div>

      {offers.length === 0 ? (

        <div className="mt-10 rounded-3xl border border-orange-400/30 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-8 text-center shadow-2xl shadow-orange-500/10">

          <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-400">
            Inga offerter
          </p>

          <h2 className="mt-3 text-3xl font-black">
            Historiken är tom
          </h2>

          <p className="mt-3 text-zinc-400">
            Sparade offerter visas här när du trycker på Spara offert.
          </p>

        </div>

      ) : (

        <div className="mt-10 flex flex-col gap-5">

          {offers.map((offer) => (

            <article
              key={offer.id}
              className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl shadow-black/30"
            >

              <div className="border-b border-white/10 bg-gradient-to-r from-zinc-900 to-black p-5">

                <div className="flex items-start justify-between gap-4">

                  <div>

                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-400">
                      {formatOfferDate(offer.date)}
                    </p>

                    <h2 className="mt-2 text-2xl font-black">
                      {offer.customer?.name || "Inte angivet"}
                    </h2>

                    <p className="mt-1 text-sm text-zinc-400">
                      {offer.category} · {offer.area} m² · {offer.peopleCount || 1} {(offer.peopleCount || 1) === 1 ? "person" : "personer"}
                    </p>

                  </div>

                  <div className="text-right">

                    <p className="text-xs uppercase text-zinc-500">
                      Normal
                    </p>

                    <p className="text-xl font-black text-orange-400">
                      {formatPrice(offer.prices?.normal || 0)}
                    </p>

                  </div>

                </div>

              </div>

              <div className="grid gap-4 p-5">

                <div className="grid gap-3 text-sm sm:grid-cols-3">

                  <SummaryRow label="Telefon" value={offer.customer?.phone || "Inte angivet"} />
                  <SummaryRow label="Adress" value={offer.customer?.address || "Inte angivet"} />
                  <SummaryRow label="Anteckningar" value={offer.customer?.notes || "Inga anteckningar"} />

                </div>

                <div>

                  <h3 className="text-xs font-bold uppercase tracking-wide text-zinc-500">
                    Valda alternativ
                  </h3>

                  <div className="mt-3 flex flex-wrap gap-2">

                    {offer.options.length > 0 ? offer.options.map((option) => (

                      <span
                        key={`${offer.id}-${option.id}`}
                        className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-bold text-zinc-200"
                      >
                        {option.title}
                      </span>

                    )) : (

                      <span className="text-sm text-zinc-500">
                        Inga valda alternativ
                      </span>

                    )}

                  </div>

                </div>

                <div className="grid grid-cols-3 overflow-hidden rounded-2xl border border-white/10 text-center">

                  <HistoryPrice label="MIN" value={offer.prices?.min || 0} />
                  <HistoryPrice label="NORMAL" value={offer.prices?.normal || 0} highlight />
                  <HistoryPrice label="PREMIUM" value={offer.prices?.premium || 0} />

                </div>

              </div>

            </article>

          ))}

        </div>

      )}

    </div>
  );
}

function formatOfferDate(date) {
  return new Date(date).toLocaleDateString("sv-SE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function HistoryPrice({ label, value, highlight = false }) {
  return (
    <div className={`p-4 ${highlight ? "bg-orange-500 text-black" : "bg-black/40 text-white"}`}>
      <p className={`text-[10px] font-black ${highlight ? "text-black/60" : "text-zinc-500"}`}>
        {label}
      </p>

      <p className="mt-1 text-sm font-black">
        {formatPrice(value)}
      </p>
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
];

const fixedCostOptions = [
  {
    id: "delivery",
    title: "Leverans från butik",
    price: 800,
  },
  {
    id: "trailer",
    title: "Släpvagn",
    price: 1000,
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
    usesCustomFixedCosts: true,
    sections: [
      {
        title: "Konstruktion",
        options: [
          {
            id: "deckingOnly",
            title: "Endast trallbyte",
            defaultActive: true,
            excludes: ["newFrame"],
            pricingControl: "work",
            defaultFastPrice: (area) => area * 450,
          },
          {
            id: "deckRepair",
            title: "Reparation",
            pricingControl: "work",
            defaultFastPrice: (area) => area * 600,
          },
          {
            id: "newFrame",
            title: "Ny stomme",
            excludes: ["deckingOnly"],
            pricingControl: "work",
            defaultFastPrice: (area) => area * 900,
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
      {
        title: "Material & Logistik",
        options: [
          {
            id: "deckCustomerMaterial",
            title: "Kund står för material",
            defaultActive: true,
            price: () => 0,
          },
          {
            id: "materialPurchase",
            title: "Materialinköp",
            pricingControl: "hourly",
            costType: "work",
          },
          {
            id: "materialHandling",
            title: "Materialhantering",
            pricingControl: "hourly",
            costType: "work",
          },
          {
            id: "deckDelivery",
            title: "Leverans från butik",
            pricingControl: "fixed",
            costType: "fixed",
            defaultFastPrice: () => 800,
          },
          {
            id: "deckTrailer",
            title: "Släpvagn",
            pricingControl: "fixed",
            costType: "fixed",
            defaultFastPrice: () => 1000,
          },
          {
            id: "wasteRemoval",
            title: "Bortforsling av avfall",
            pricingControl: "hourly",
            costType: "work",
          },
        ],
      },
    ],
  },
};

function CategoryCalculator({ category, goBack, onSaveOffer }) {

  const [area, setArea] = useState(25);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
  });
  const [extraWork, setExtraWork] = useState({
    hours: 0,
    hourlyRate: 250,
  });
  const [peopleCount, setPeopleCount] = useState(1);
  const [fixedCosts, setFixedCosts] = useState({});
  const [optionPricing, setOptionPricing] = useState({});
  const [discount, setDiscount] = useState({
    active: false,
    percent: 0,
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

  const getOptionPricing = (option) => {
    const pricing = optionPricing[option.id] || {};

    return {
      mode: pricing.mode || (option.pricingControl === "hourly" ? "hourly" : "fast"),
      fastPrice: pricing.fastPrice ?? option.defaultFastPrice?.(area) ?? 0,
      hours: pricing.hours ?? 0,
      hourlyRate: pricing.hourlyRate ?? 250,
    };
  };

  const updateOptionPricing = (optionId, values) => {
    setOptionPricing((currentPricing) => ({
      ...currentPricing,
      [optionId]: {
        ...currentPricing[optionId],
        ...values,
      },
    }));
  };

  const calculateOptionPrice = (option, active) => {
    if (!active) {
      return 0;
    }

    if (!option.pricingControl) {
      return option.price({
        area,
        active,
      });
    }

    const pricing = getOptionPricing(option);
    const normalizedPeopleCount = Math.max(1, Number(peopleCount) || 1);

    if (pricing.mode === "hourly" || option.pricingControl === "hourly") {
      return Math.max(0, Number(pricing.hours) || 0) * Math.max(0, Number(pricing.hourlyRate) || 0) * normalizedPeopleCount;
    }

    return Math.max(0, Number(pricing.fastPrice) || 0);
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

  let workPrice = calculatorConfig.basePrice(area);
  let workTime = calculatorConfig.workTime;
  let customFixedCostsTotal = 0;

  calculatorOptions.forEach((option) => {
    const optionPrice = calculateOptionPrice(option, getOptionActive(option));

    if (option.costType === "fixed") {
      customFixedCostsTotal += optionPrice;
    } else {
      workPrice += optionPrice;
    }
  });

  const normalizedPeopleCount = Math.max(1, Number(peopleCount) || 1);
  const extraWorkCost = Math.max(0, Number(extraWork.hours) || 0) * Math.max(0, Number(extraWork.hourlyRate) || 0) * normalizedPeopleCount;

  workPrice += extraWorkCost;

  const selectedFixedCostDetails = (calculatorConfig.usesCustomFixedCosts ? [] : fixedCostOptions)
    .filter((option) => fixedCosts[option.id])
    .map((option) => ({
      id: option.id,
      title: option.title,
      sectionTitle: "Fasta kostnader",
      priceValue: option.price,
    }));

  const fixedCostsTotal = selectedFixedCostDetails.reduce((total, option) => {
    return total + option.priceValue;
  }, customFixedCostsTotal);

  const discountPercent = discount.active ? Math.max(0, Math.min(100, Number(discount.percent) || 0)) : 0;
  const discountAmount = Math.round(workPrice * (discountPercent / 100));
  const discountedWorkPrice = Math.max(0, workPrice - discountAmount);
  const normalPrice = Math.round(discountedWorkPrice + fixedCostsTotal);

  const selectedOptionDetails = [
    ...calculatorOptions
    .filter((option) => getOptionActive(option))
    .map((option) => ({
      ...option,
      priceValue: calculateOptionPrice(option, true),
      costType: option.costType || "work",
    })),
    ...(extraWorkCost > 0 ? [{
      id: "extraWork",
      title: `Extra arbete (${extraWork.hours} timmar)`,
      sectionTitle: "Extra arbete",
      priceValue: extraWorkCost,
    }] : []),
    ...selectedFixedCostDetails,
  ];

  const minPrice = Math.round((discountedWorkPrice * 0.85) + fixedCostsTotal);

  const premiumPrice = Math.round((discountedWorkPrice * 1.3) + fixedCostsTotal);

  const exportPdf = () => {
    const pdfBlob = createOfferPdfBlob({
      area,
      category,
      customer,
      minPrice,
      normalPrice,
      premiumPrice,
      selectedOptionDetails,
      fixedCostsTotal,
      workPrice,
      peopleCount: normalizedPeopleCount,
      discountActive: discount.active,
      discountAmount,
      discountPercent,
      discountedWorkPrice,
      workTime,
    });
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const downloadLink = document.createElement("a");

    downloadLink.href = pdfUrl;
    downloadLink.download = `snickare-offert-${new Date().toISOString().slice(0, 10)}.pdf`;
    document.body.append(downloadLink);
    downloadLink.click();
    downloadLink.remove();

    setTimeout(() => {
      URL.revokeObjectURL(pdfUrl);
    }, 1000);
  };

  const saveCurrentOffer = () => {
    onSaveOffer({
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      customer,
      category,
      area,
      peopleCount: normalizedPeopleCount,
      extraWork: {
        hours: Math.max(0, Number(extraWork.hours) || 0),
        hourlyRate: Math.max(0, Number(extraWork.hourlyRate) || 0),
        cost: extraWorkCost,
      },
      discount: {
        active: discount.active,
        percent: discountPercent,
        amount: discountAmount,
      },
      options: selectedOptionDetails.map((option) => ({
        id: option.id,
        title: option.title,
        sectionTitle: option.sectionTitle || "",
        priceValue: option.priceValue,
      })),
      prices: {
        work: Math.round(workPrice),
        workAfterDiscount: Math.round(discountedWorkPrice),
        fixed: fixedCostsTotal,
        min: minPrice,
        normal: normalPrice,
        premium: premiumPrice,
      },
    });
  };

  return (
    <div className="min-h-[100dvh] overflow-x-hidden bg-black p-6 pb-[calc(7rem+env(safe-area-inset-bottom))] text-white">

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

        {/* PEOPLE */}
        <div className="mt-8 border-t border-zinc-800 pt-8">

          <div className="flex items-end justify-between gap-4">

            <div>

              <h2 className="text-sm font-bold uppercase text-zinc-500">
                Bemanning
              </h2>

              <p className="mt-1 text-sm text-zinc-400">
                Timpris multipliceras med antal personer.
              </p>

            </div>

            <p className="text-right text-sm font-black text-orange-400">
              {normalizedPeopleCount} {normalizedPeopleCount === 1 ? "person" : "personer"}
            </p>

          </div>

          <label className="mt-4 block text-sm text-zinc-400">
            Antal personer

            <input
              type="number"
              min="1"
              value={peopleCount}
              onChange={(event) => setPeopleCount(Math.max(1, Number(event.target.value) || 1))}
              className="mt-2 w-full rounded-2xl border border-zinc-800 bg-black p-4 text-2xl font-bold text-white outline-none transition focus:border-orange-400"
            />

          </label>

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
                  <div key={option.id} className="flex flex-col gap-3">

                    <Option
                      title={option.title}
                      active={getOptionActive(optionWithSection)}
                      onClick={() => toggleOption(optionWithSection)}
                    />

                    {getOptionActive(optionWithSection) && optionWithSection.pricingControl && (
                      <OptionPricingFields
                        option={optionWithSection}
                        pricing={getOptionPricing(optionWithSection)}
                        onChange={(values) => updateOptionPricing(optionWithSection.id, values)}
                      />
                    )}

                  </div>
                );
              })}

            </div>

          ))}

        </div>

        {/* EXTRA WORK */}
        <div className="mt-8 border-t border-zinc-800 pt-8">

          <div className="flex items-end justify-between gap-4">

            <div>

              <h2 className="text-sm font-bold uppercase text-zinc-500">
                Extra arbete
              </h2>

              <p className="mt-1 text-sm text-zinc-400">
                Lägg till extra timmar utanför standardofferten.
              </p>

            </div>

            <p className="text-right text-sm font-black text-orange-400">
              {formatPrice(extraWorkCost)}
            </p>

          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">

            <label className="block text-sm text-zinc-400">
              Antal timmar

              <input
                type="number"
                min="0"
                value={extraWork.hours}
                onChange={(event) => setExtraWork({
                  ...extraWork,
                  hours: Number(event.target.value),
                })}
                className="mt-2 w-full rounded-2xl border border-zinc-800 bg-black p-4 text-2xl font-bold text-white outline-none transition focus:border-orange-400"
              />

            </label>

            <label className="block text-sm text-zinc-400">
              Timpris

              <input
                type="number"
                min="0"
                value={extraWork.hourlyRate}
                onChange={(event) => setExtraWork({
                  ...extraWork,
                  hourlyRate: Number(event.target.value),
                })}
                className="mt-2 w-full rounded-2xl border border-zinc-800 bg-black p-4 text-2xl font-bold text-white outline-none transition focus:border-orange-400"
              />

            </label>

          </div>

        </div>

        {!calculatorConfig.usesCustomFixedCosts && (
        <div className="mt-8 border-t border-zinc-800 pt-8">

          <div className="flex items-end justify-between gap-4">

            <div>

              <h2 className="text-sm font-bold uppercase text-zinc-500">
                Fasta kostnader
              </h2>

              <p className="mt-1 text-sm text-zinc-400">
                Dessa kostnader påverkas inte av rabatt.
              </p>

            </div>

            <p className="text-right text-sm font-black text-orange-400">
              {formatPrice(fixedCostsTotal)}
            </p>

          </div>

          <div className="mt-4 flex flex-col gap-3">

            {fixedCostOptions.map((option) => (

              <Option
                key={option.id}
                title={`${option.title} · ${formatPrice(option.price)}`}
                active={fixedCosts[option.id] || false}
                onClick={() => setFixedCosts({
                  ...fixedCosts,
                  [option.id]: !fixedCosts[option.id],
                })}
              />

            ))}

          </div>

        </div>
        )}

        {/* DISCOUNT */}
        <div className="mt-8 border-t border-zinc-800 pt-8">

          <Option
            title="Lägg till rabatt"
            active={discount.active}
            onClick={() => setDiscount({
              ...discount,
              active: !discount.active,
            })}
          />

          {discount.active && (
            <div className="mt-4 rounded-2xl border border-orange-400/20 bg-black/60 p-4">

              <PricingInput
                label="Rabatt %"
                value={discount.percent}
                onChange={(value) => setDiscount({
                  ...discount,
                  percent: value,
                })}
              />

              <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-zinc-950 p-4">
                <span className="text-sm text-zinc-400">
                  Rabatt på arbete
                </span>

                <span className="font-black text-orange-400">
                  -{formatPrice(discountAmount)}
                </span>
              </div>

            </div>
          )}

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

            <div className="mb-6 grid gap-3">

              <div className="rounded-2xl border border-white/10 bg-black p-4">
                <p className="text-xs font-bold uppercase text-zinc-500">
                  Arbete före rabatt
                </p>

                <p className="mt-2 text-xl font-black text-white">
                  {formatPrice(workPrice)}
                </p>
              </div>

              {discount.active && (
                <div className="rounded-2xl border border-orange-400/20 bg-black p-4">
                  <p className="text-xs font-bold uppercase text-zinc-500">
                    Rabatt
                  </p>

                  <p className="mt-2 text-xl font-black text-orange-400">
                    -{formatPrice(discountAmount)}
                  </p>
                </div>
              )}

              <div className="rounded-2xl border border-white/10 bg-black p-4">
                <p className="text-xs font-bold uppercase text-zinc-500">
                  Arbete efter rabatt
                </p>

                <p className="mt-2 text-xl font-black text-white">
                  {formatPrice(discountedWorkPrice)}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black p-4">
                <p className="text-xs font-bold uppercase text-zinc-500">
                  Fasta kostnader
                </p>

                <p className="mt-2 text-xl font-black text-orange-400">
                  {formatPrice(fixedCostsTotal)}
                </p>
              </div>

              <div className="rounded-2xl border border-orange-400 bg-orange-500 p-4 text-black">
                <p className="text-xs font-bold uppercase text-black/60">
                  Totalt
                </p>

                <p className="mt-2 text-2xl font-black">
                  {formatPrice(normalPrice)}
                </p>
              </div>

            </div>

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
                {normalizedPeopleCount} {normalizedPeopleCount === 1 ? "person" : "personer"}
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
                {area} m² · {workTime} · {normalizedPeopleCount} {normalizedPeopleCount === 1 ? "person" : "personer"}
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

        <div className="grid gap-3 border-t border-white/10 p-6 sm:grid-cols-2">

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs font-bold uppercase text-zinc-500">
              Arbete före rabatt
            </p>

            <p className="mt-2 text-xl font-black text-white">
              {formatPrice(workPrice)}
            </p>
          </div>

          {discount.active && (
            <div className="rounded-2xl border border-orange-400/20 bg-white/[0.03] p-4">
              <p className="text-xs font-bold uppercase text-zinc-500">
                Rabatt
              </p>

              <p className="mt-2 text-xl font-black text-orange-400">
                -{formatPrice(discountAmount)}
              </p>
            </div>
          )}

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs font-bold uppercase text-zinc-500">
              Arbete efter rabatt
            </p>

            <p className="mt-2 text-xl font-black text-white">
              {formatPrice(discountedWorkPrice)}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs font-bold uppercase text-zinc-500">
              Fasta kostnader
            </p>

            <p className="mt-2 text-xl font-black text-orange-400">
              {formatPrice(fixedCostsTotal)}
            </p>
          </div>

          <div className="rounded-2xl border border-orange-400 bg-orange-500 p-4 text-black">
            <p className="text-xs font-bold uppercase text-black/60">
              Totalt
            </p>

            <p className="mt-2 text-2xl font-black">
              {formatPrice(normalPrice)}
            </p>
          </div>

        </div>

        <div className="grid grid-cols-3 border-t border-white/10 text-center">

          <SummaryPrice label="MIN" value={minPrice} />
          <SummaryPrice label="NORMAL" value={normalPrice} highlight />
          <SummaryPrice label="PREMIUM" value={premiumPrice} />

        </div>

      </div>

      <div className="sticky bottom-0 z-50 -mx-6 mt-5 grid gap-3 border-t border-white/10 bg-black/95 px-6 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl sm:grid-cols-3">

        <ActionButton onClick={saveCurrentOffer}>
          Spara offert
        </ActionButton>

        <ActionButton onClick={exportPdf}>
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

function OptionPricingFields({ option, pricing, onChange }) {
  const canChooseMode = option.pricingControl === "work";
  const useHourly = pricing.mode === "hourly" || option.pricingControl === "hourly";

  return (
    <div className="rounded-2xl border border-orange-400/20 bg-black/60 p-4">

      {canChooseMode && (
        <div className="grid grid-cols-2 gap-2">

          <button
            type="button"
            onClick={() => onChange({ mode: "fast" })}
            className={`min-h-11 rounded-xl border text-sm font-bold ${
              pricing.mode === "fast"
                ? "border-orange-400 bg-orange-500 text-black"
                : "border-zinc-800 bg-zinc-950 text-white"
            }`}
          >
            Fast pris
          </button>

          <button
            type="button"
            onClick={() => onChange({ mode: "hourly" })}
            className={`min-h-11 rounded-xl border text-sm font-bold ${
              pricing.mode === "hourly"
                ? "border-orange-400 bg-orange-500 text-black"
                : "border-zinc-800 bg-zinc-950 text-white"
            }`}
          >
            Timpris
          </button>

        </div>
      )}

      {useHourly ? (
        <div className={`grid gap-3 ${canChooseMode ? "mt-4" : ""} sm:grid-cols-2`}>

          <PricingInput
            label="Antal timmar"
            value={pricing.hours}
            onChange={(value) => onChange({ hours: value })}
          />

          <PricingInput
            label="Timpris"
            value={pricing.hourlyRate}
            onChange={(value) => onChange({ hourlyRate: value })}
          />

        </div>
      ) : (
        <div className={canChooseMode ? "mt-4" : ""}>

          <PricingInput
            label="Fast pris"
            value={pricing.fastPrice}
            onChange={(value) => onChange({ fastPrice: value })}
          />

        </div>
      )}

    </div>
  );
}

function PricingInput({ label, value, onChange }) {
  return (
    <label className="block text-sm text-zinc-400">
      {label}

      <input
        type="number"
        min="0"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-2 w-full rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-xl font-black text-white outline-none transition focus:border-orange-400"
      />

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

function createOfferPdfBlob({
  area,
  category,
  customer,
  minPrice,
  normalPrice,
  premiumPrice,
  selectedOptionDetails,
  fixedCostsTotal,
  workPrice,
  peopleCount,
  discountActive,
  discountAmount,
  discountPercent,
  discountedWorkPrice,
  workTime,
}) {
  const customerRows = [
    ["Namn", customer.name || "Inte angivet"],
    ["Telefon", customer.phone || "Inte angivet"],
    ["Adress", customer.address || "Inte angivet"],
    ["Anteckningar", customer.notes || "Inga anteckningar"],
  ];
  const optionRows = selectedOptionDetails.length > 0
    ? selectedOptionDetails
    : [{ title: "Inga valda alternativ", sectionTitle: "", priceValue: 0 }];
  const content = [];

  const rect = (x, y, width, height, color) => {
    content.push(`${color} rg ${x} ${y} ${width} ${height} re f`);
  };

  const line = (x1, y1, x2, y2, color = "1 1 1", width = 1) => {
    content.push(`${color} RG ${width} w ${x1} ${y1} m ${x2} ${y2} l S`);
  };

  const text = (value, x, y, size = 12, color = "1 1 1", font = "F1") => {
    content.push(`BT /${font} ${size} Tf ${color} rg ${x} ${y} Td ${toPdfText(value)} Tj ET`);
  };

  const money = (value) => formatPrice(value);

  rect(0, 0, 595, 842, "0.02 0.02 0.02");
  rect(28, 28, 539, 786, "0.07 0.07 0.07");
  rect(28, 768, 539, 46, "0.15 0.07 0.02");
  line(28, 768, 567, 768, "0.98 0.45 0.08", 1.4);

  text("SNICKARE", 48, 781, 30, "1 1 1", "F2");
  text("PREMIUM OFFERT", 395, 792, 9, "0.98 0.57 0.24", "F2");
  text(new Date().toLocaleDateString("sv-SE"), 432, 775, 10, "0.72 0.72 0.76");

  text(category, 48, 724, 24, "1 1 1", "F2");
  text(`${area} m² · ${workTime} · ${peopleCount} ${peopleCount === 1 ? "person" : "personer"}`, 48, 704, 11, "0.65 0.65 0.7");
  text("Normalpris", 390, 724, 10, "0.65 0.65 0.7");
  text(money(normalPrice), 390, 701, 22, "0.98 0.57 0.24", "F2");

  rect(48, 552, 235, 116, "0.1 0.1 0.1");
  rect(312, 552, 235, 116, "0.1 0.1 0.1");
  text("KUNDUPPGIFTER", 64, 645, 9, "0.98 0.57 0.24", "F2");
  text("PROJEKT", 328, 645, 9, "0.98 0.57 0.24", "F2");

  customerRows.slice(0, 3).forEach(([label, value], index) => {
    const y = 620 - index * 24;
    text(label, 64, y, 9, "0.62 0.62 0.66");
    text(value, 142, y, 10, "1 1 1", "F2");
  });

  const projectRows = [
    ["Kategori", category],
    ["Storlek", `${area} m²`],
    ["Antal personer", `${peopleCount} ${peopleCount === 1 ? "person" : "personer"}`],
    ["Arbetstid", workTime],
    ["Arbete före rabatt", money(workPrice)],
    ...(discountActive ? [["Rabatt", `-${money(discountAmount)} (${discountPercent}%)`]] : []),
    ["Arbete efter rabatt", money(discountedWorkPrice)],
    ["Fasta kostnader", money(fixedCostsTotal)],
    ["Totalt", money(normalPrice)],
  ];

  projectRows.forEach(([label, value], index) => {
    const y = 620 - index * 15;
    text(label, 328, y, 9, "0.62 0.62 0.66");
    text(value, 408, y, 10, "1 1 1", "F2");
  });

  text("ANTECKNINGAR", 48, 516, 9, "0.98 0.57 0.24", "F2");
  rect(48, 456, 499, 45, "0.08 0.08 0.08");
  wrapPdfText(customer.notes || "Inga anteckningar", 92, 3).forEach((lineText, index) => {
    text(lineText, 64, 482 - index * 14, 10, "0.9 0.9 0.92");
  });

  text("VALDA ALTERNATIV", 48, 424, 9, "0.98 0.57 0.24", "F2");
  optionRows.slice(0, 8).forEach((option, index) => {
    const y = 392 - index * 31;
    rect(48, y - 8, 499, 24, index % 2 === 0 ? "0.08 0.08 0.08" : "0.1 0.1 0.1");
    text(option.title, 64, y, 10, "1 1 1", "F2");
    if (option.sectionTitle) {
      text(option.sectionTitle, 64, y - 11, 7, "0.48 0.48 0.52");
    }
    text(option.priceValue > 0 ? `+${money(option.priceValue)}` : "Ingår", 420, y, 9, "0.98 0.72 0.45", "F2");
  });

  rect(48, 76, 166, 70, "0.08 0.08 0.08");
  rect(214, 76, 166, 70, "0.98 0.45 0.08");
  rect(380, 76, 167, 70, "0.08 0.08 0.08");
  text("MIN", 108, 120, 9, "0.65 0.65 0.7", "F2");
  text(money(minPrice), 78, 96, 15, "1 1 1", "F2");
  text("NORMAL", 268, 120, 9, "0 0 0", "F2");
  text(money(normalPrice), 238, 96, 15, "0 0 0", "F2");
  text("PREMIUM", 434, 120, 9, "0.65 0.65 0.7", "F2");
  text(money(premiumPrice), 410, 96, 15, "1 1 1", "F2");

  text("SNICKARE · Med kvalitet i varje detalj", 190, 48, 9, "0.45 0.45 0.5");

  return buildPdf(content.join("\n"));
}

function buildPdf(contentStream) {
  const encoder = new TextEncoder();
  const streamLength = encoder.encode(contentStream).length;
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>",
    `<< /Length ${streamLength} >>\nstream\n${contentStream}\nendstream`,
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(encoder.encode(pdf).length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = encoder.encode(pdf).length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return new Blob([pdf], {
    type: "application/pdf",
  });
}

function toPdfText(value) {
  const bytes = Array.from(String(value)).map((character) => {
    return toWinAnsiByte(character);
  });

  return `<${bytes.map((byte) => byte.toString(16).padStart(2, "0")).join("")}>`;
}

function toWinAnsiByte(character) {
  const code = character.charCodeAt(0);
  const winAnsiBytes = {
    "€": 0x80,
    "‚": 0x82,
    "ƒ": 0x83,
    "„": 0x84,
    "…": 0x85,
    "†": 0x86,
    "‡": 0x87,
    "ˆ": 0x88,
    "‰": 0x89,
    "Š": 0x8a,
    "‹": 0x8b,
    "Œ": 0x8c,
    "Ž": 0x8e,
    "‘": 0x91,
    "’": 0x92,
    "“": 0x93,
    "”": 0x94,
    "•": 0x95,
    "–": 0x96,
    "—": 0x97,
    "˜": 0x98,
    "™": 0x99,
    "š": 0x9a,
    "›": 0x9b,
    "œ": 0x9c,
    "ž": 0x9e,
    "Ÿ": 0x9f,
  };

  if (code <= 0x7f || (code >= 0xa0 && code <= 0xff)) {
    return code;
  }

  return winAnsiBytes[character] ?? 0x3f;
}

function wrapPdfText(value, maxLength, maxLines) {
  const words = String(value).split(" ");
  const lines = [];
  let currentLine = "";

  words.forEach((word) => {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;

    if (nextLine.length > maxLength && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = nextLine;
    }
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines.slice(0, maxLines);
}

function ActionButton({ children, onClick, variant = "secondary" }) {
  const isPrimary = variant === "primary";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative z-10 min-h-14 w-full touch-manipulation rounded-2xl border px-5 text-sm font-black uppercase tracking-wide transition active:scale-[0.98] ${
        isPrimary
          ? "border-orange-400 bg-orange-500 text-black shadow-xl shadow-orange-500/20"
          : "border-white/10 bg-zinc-900 text-white shadow-xl shadow-black/20"
      }`}
    >
      {children}
    </button>
  );
}

