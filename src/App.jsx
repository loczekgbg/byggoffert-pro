import { useState } from "react";

import {
  Calculator,
  Folder,
  User,
  Hammer,
  Settings,
  Menu,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";

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
            text="Skapa ny kostnadsförslag"
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

function CategoriesScreen({ goBack, openCategory }) {

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

function CategoryCalculator({ category, goBack }) {

  const [area, setArea] = useState(25);

  const [stairs, setStairs] = useState(false);
  const [pergola, setPergola] = useState(false);
  const [material, setMaterial] = useState(true);
  const [waste, setWaste] = useState(false);
  const [trailer, setTrailer] = useState(false);

  let normalPrice = area * 600;

  if (stairs) {
    normalPrice += 4000;
  }

  if (pergola) {
    normalPrice += 12000;
  }

  if (waste) {
    normalPrice += 2500;
  }

  if (trailer) {
    normalPrice += 1000;
  }

  if (!material) {
    normalPrice += area * 350;
  }

  const minPrice = Math.round(normalPrice * 0.85);

  const premiumPrice = Math.round(normalPrice * 1.3);
let workTime = "3-5 dagar";

if (category === "Golv") {
  normalPrice = area * 250;
  workTime = "1-3 dagar";
}

if (category === "Målning & Tapeter") {
  normalPrice = area * 180;
  workTime = "2-4 dagar";
}
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

        {/* OPTIONS */}
        <div className="mt-8 flex flex-col gap-4">

          <Option
            title="Trappa"
            active={stairs}
            onClick={() => setStairs(!stairs)}
          />

          <Option
            title="Pergola"
            active={pergola}
            onClick={() => setPergola(!pergola)}
          />

          <Option
            title="Kund står för material"
            active={material}
            onClick={() => setMaterial(!material)}
          />

          <Option
            title="Avfallshantering"
            active={waste}
            onClick={() => setWaste(!waste)}
          />

          <Option
            title="Släpvagn"
            active={trailer}
            onClick={() => setTrailer(!trailer)}
          />

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

    </div>
  );
}

function Card({ icon, title, text, onClick }) {
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

function Option({ title, active, onClick }) {
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

function PriceCard({ label, value, color }) {
  return (
    <div className="bg-black border border-zinc-800 rounded-3xl p-5">

      <div className="flex justify-between items-center">

        <span className="text-zinc-500 font-bold">
          {label}
        </span>

        <span className={`text-4xl font-black ${color}`}>
          {value.toLocaleString()} SEK
        </span>

      </div>

    </div>
  );
}