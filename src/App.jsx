import { useState } from "react";

import {
  Calculator,
  Folder,
  User,
  Hammer,
  Settings,
  Menu,
  Ruler,
  ArrowLeft,
  Edit3,
  FileDown,
  Trash2,
  Plus,
} from "lucide-react";

import Card from "./components/Card";
import Option from "./components/Option";
import PriceCard from "./components/PriceCard";
import CategoriesScreen from "./screens/CategoriesScreen";
import ToolsScreen from "./screens/ToolsScreen";
import marcinByggLogo from "./assets/marcin-bygg-logo.png";
import { I18nProvider, translateText, useI18n } from "./i18n";
import { formatPrice } from "./utils/formatPrice";

const defaultAppSettings = {
  companyName: "Marcin Bygg",
  orgNumber: "",
  phone: "076 320 5125",
  email: "",
  address: "",
  website: "",
  logoDataUrl: "",
  instagram: "",
  facebook: "",
  tiktok: "",
  standardHourlyRate: 250,
  standardPeopleCount: 2,
  standardWastePercent: 10,
  standardVatPercent: 25,
  language: "sv",
  unit: "m",
};

const offerCategories = [
  "Målning & Tapeter",
  "Innerväggar & Innertak",
  "Golv & Lister",
  "Fönster & Dörrar",
  "Kök & Garderob",
  "Fasad & Utvändig Renovering",
  "Tak & Yttertak",
  "Altan, Pergola & Staket",
  "Service & Småjobb",
  "Tillbyggnad & Utebyggnader",
  "Rivning & Bilning",
  "Konstruktion",
];

const projectStatuses = [
  "Ny förfrågan",
  "Offert skickad",
  "Väntar svar",
  "Accepterad",
  "Pågående",
  "Slutförd",
  "Nekad",
];

const premiumCustomerTags = [
  "Premiumkund",
  "Återkommande kund",
  "Prioritet",
  "B2B",
  "ROT",
];

function loadAppSettings() {
  try {
    return {
      ...defaultAppSettings,
      ...(JSON.parse(localStorage.getItem("marcinByggSettings")) || {}),
    };
  } catch {
    return defaultAppSettings;
  }
}

function saveAppSettings(settings) {
  localStorage.setItem("marcinByggSettings", JSON.stringify(settings));
}

export default function App() {
  const [language, setLanguageState] = useState(() => loadAppSettings().language || localStorage.getItem("marcinByggLanguage") || "sv");

  const setLanguage = (nextLanguage) => {
    setLanguageState(nextLanguage);
    localStorage.setItem("marcinByggLanguage", nextLanguage);
    saveAppSettings({
      ...loadAppSettings(),
      language: nextLanguage,
    });
  };

  return (
    <I18nProvider language={language} setLanguage={setLanguage}>
      <AppContent />
    </I18nProvider>
  );
}

function AppContent() {
  const { setLanguage, t } = useI18n();

  const [screen, setScreen] = useState("home");
  const [appSettings, setAppSettings] = useState(() => loadAppSettings());
  const [selectedCategory, setSelectedCategory] = useState("");
  const [editingOffer, setEditingOffer] = useState(null);
  const [selectedClientKey, setSelectedClientKey] = useState("");
  const [quoteCustomerDraft, setQuoteCustomerDraft] = useState(null);
  const [savedOffers, setSavedOffers] = useState(() => loadSavedOffers());
  const clients = buildClients(savedOffers);

  const saveOffer = (offer) => {
    const offerExists = savedOffers.some((savedOffer) => savedOffer.id === offer.id);
    const nextOffers = offerExists
      ? savedOffers.map((savedOffer) => (savedOffer.id === offer.id ? offer : savedOffer))
      : [
        offer,
        ...savedOffers,
      ];

    setSavedOffers(nextOffers);
    localStorage.setItem("snickareOffers", JSON.stringify(nextOffers));
    setEditingOffer(null);
    setQuoteCustomerDraft(null);
  };

  const deleteOffer = (offerId) => {
    const nextOffers = savedOffers.filter((offer) => offer.id !== offerId);

    setSavedOffers(nextOffers);
    localStorage.setItem("snickareOffers", JSON.stringify(nextOffers));
  };

  const updateAppSettings = (nextSettings) => {
    setAppSettings(nextSettings);
    saveAppSettings(nextSettings);
    if (nextSettings.language) {
      setLanguage(nextSettings.language);
    }
  };

  if (screen === "categories") {
    return (
      <CategoriesScreen
        goBack={() => {
          setQuoteCustomerDraft(null);
          setScreen("home");
        }}
        openCategory={(category) => {
          setEditingOffer(null);
          setSelectedCategory(category);
          setScreen("calculator");
        }}
        openMultiCategory={() => {
          setEditingOffer(null);
          setSelectedCategory("Multi-category offert");
          setScreen("multiCalculator");
        }}
      />
    );
  }

  if (screen === "multiCalculator") {
    return (
      <MultiCategoryOfferScreen
        initialOffer={editingOffer?.isMultiCategory ? editingOffer : null}
        initialCustomer={quoteCustomerDraft}
        goBack={() => {
          setEditingOffer(null);
          setScreen(editingOffer ? "history" : "categories");
        }}
        onSaveOffer={saveOffer}
        appSettings={appSettings}
      />
    );
  }

  if (screen === "calculator") {
    return (
      <CategoryCalculator
        key={editingOffer?.id || `${selectedCategory}-${getClientKey(quoteCustomerDraft || {})}`}
        category={selectedCategory}
        initialOffer={editingOffer}
        initialCustomer={quoteCustomerDraft}
        goBack={() => {
          setEditingOffer(null);
          setScreen(editingOffer ? "history" : "categories");
        }}
        onSaveOffer={saveOffer}
        appSettings={appSettings}
      />
    );
  }

  if (screen === "history") {
    return (
      <HistoryScreen
        goBack={() => setScreen("home")}
        offers={savedOffers}
        onDeleteOffer={deleteOffer}
        onEditOffer={(offer) => {
          setEditingOffer(offer);
          setQuoteCustomerDraft(null);
          if (offer.isMultiCategory) {
            setScreen("multiCalculator");
            return;
          }
          setSelectedCategory(offer.category);
          setScreen("calculator");
        }}
        appSettings={appSettings}
      />
    );
  }

  if (screen === "clients") {
    return (
      <ClientsScreen
        clients={clients}
        goBack={() => setScreen("home")}
        onOpenClient={(client) => {
          setSelectedClientKey(client.key);
          setScreen("clientDetail");
        }}
        onNewOffer={(client) => {
          setQuoteCustomerDraft(client.customer);
          setEditingOffer(null);
          setScreen("categories");
        }}
      />
    );
  }

  if (screen === "clientDetail") {
    const selectedClient = clients.find((client) => client.key === selectedClientKey);

    return (
      <ClientDetailScreen
        client={selectedClient}
        goBack={() => setScreen("clients")}
        onDeleteOffer={deleteOffer}
        onEditOffer={(offer) => {
          setEditingOffer(offer);
          setQuoteCustomerDraft(null);
          if (offer.isMultiCategory) {
            setScreen("multiCalculator");
            return;
          }
          setSelectedCategory(offer.category);
          setScreen("calculator");
        }}
        onNewOffer={(client) => {
          setQuoteCustomerDraft(client.customer);
          setEditingOffer(null);
          setScreen("categories");
        }}
      />
    );
  }

  if (screen === "tools") {
    return (
      <ToolsScreen goBack={() => setScreen("home")} defaultUnit={appSettings.unit} />
    );
  }

  if (screen === "settings") {
    return (
      <SettingsScreen
        goBack={() => setScreen("home")}
        settings={appSettings}
        onChange={updateAppSettings}
      />
    );
  }

  return (
    <div className="premium-screen text-white">

      {/* HERO */}
      <div className="premium-hero">

        <img
          src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-35"
        />

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(245,162,11,0.18),transparent_28rem),linear-gradient(90deg,rgba(0,0,0,0.96),rgba(0,0,0,0.72),rgba(0,0,0,0.9))]" />

        <div className="premium-shell premium-hero-grid">

          <div className="premium-topbar">

            <button type="button" className="premium-icon-button" aria-label={t("Meny")}>
              <Menu size={24} />
            </button>

            <div className="ml-auto flex items-center gap-2">
              <span className="hidden rounded-full border border-orange-400/25 bg-orange-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-orange-200 sm:inline-flex">
                {t("Premium byggapp")}
              </span>
              <button
                type="button"
                onClick={() => setScreen("settings")}
                className="premium-icon-button"
                aria-label={t("Inställningar")}
              >
                <Settings size={22} />
              </button>
            </div>

          </div>

          <div className="premium-hero-copy flex flex-col justify-center">

            <img
              src={marcinByggLogo}
              alt="Marcin Bygg"
              className="premium-logo-mark"
            />

            <p className="premium-kicker mt-7">
              Marcin Bygg
            </p>

            <h1 className="mt-2 max-w-xl text-4xl font-black uppercase leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
              {t("Offert & projekt i fickan")}
            </h1>

            <p className="mt-5 max-w-sm text-base leading-relaxed text-zinc-300 sm:text-lg lg:max-w-md">
              {t("Professionell snickarservice för hem och företag.")}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  setQuoteCustomerDraft(null);
                  setEditingOffer(null);
                  setScreen("categories");
                }}
                className="premium-cta min-h-13 rounded-2xl px-6 text-sm font-black uppercase"
              >
                {t("Ny offert")}
              </button>

              <button
                type="button"
                onClick={() => setScreen("history")}
                className="min-h-13 rounded-2xl border border-white/10 bg-white/[0.04] px-6 text-sm font-black uppercase text-white"
              >
                {t("Historik")}
              </button>
            </div>

          </div>

          <div className="premium-info-strip">
            <div className="premium-card-compact p-4">
              <p className="premium-kicker">{t("Standard timpris")}</p>
              <p className="mt-2 text-xl font-black">{formatPrice(appSettings.standardHourlyRate)}/h</p>
            </div>
            <div className="premium-card-compact p-4">
              <p className="premium-kicker">{t("Projekt & CRM Lite")}</p>
              <p className="mt-2 text-xl font-black">{savedOffers.length} {t("Sparade offerter")}</p>
            </div>
            <div className="premium-card-compact p-4">
              <p className="premium-kicker">{t("Kunder")}</p>
              <p className="mt-2 text-xl font-black">{clients.length} {t("Kunder")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* GRID */}
      <div className="premium-shell relative z-20 -mt-8 sm:-mt-12">

        <div className="premium-home-grid">

          <Card
            onClick={() => {
              setQuoteCustomerDraft(null);
              setEditingOffer(null);
              setScreen("categories");
            }}
            icon={<Calculator size={34} />}
            title={t("Ny offert")}
            text={t("Skapa nytt kostnadsförslag")}
          />

          <Card
            onClick={() => setScreen("history")}
            icon={<Folder size={34} />}
            title={t("Historik")}
            text={t("Sparade offerter")}
          />

          <Card
            onClick={() => setScreen("clients")}
            icon={<User size={34} />}
            title={t("Kunder")}
            text={t("Hantera kunder")}
          />

          <Card
            onClick={() => setScreen("tools")}
            icon={<Ruler size={34} />}
            title={t("Kalkylator & Verktyg")}
            text={t("Snabba byggverktyg")}
          />

          <Card
            icon={<Hammer size={34} />}
            title={t("Material")}
            text={t("Priser & material")}
          />

        </div>

      </div>

      {/* CONTACT */}
      <div className="premium-shell mt-8 pb-[calc(2.5rem+env(safe-area-inset-bottom))]">

        <div className="premium-cta relative overflow-hidden p-5 sm:p-6">
          <span className="pointer-events-none absolute -left-10 top-1/2 h-28 w-64 -translate-y-1/2 rotate-[-8deg] bg-black/10 blur-xl" />

          <p className="relative text-xs font-black uppercase tracking-[0.18em] text-black/70">
            {t("KONTAKTA MIG IDAG")}
          </p>

          <h2 className="relative mt-2 text-4xl font-black sm:text-5xl">
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

function getClientKey(customer = {}) {
  const phone = (customer.phone || "").replace(/\s+/g, "").toLowerCase();
  const name = (customer.name || "").trim().toLowerCase();
  const address = (customer.address || "").trim().toLowerCase();

  return phone || `${name}-${address}` || "okand-kund";
}

function buildClients(offers) {
  const clientMap = new Map();

  offers.forEach((offer) => {
    const customer = offer.customer || {};
    const key = getClientKey(customer);
    const existingClient = clientMap.get(key);
    const activityDate = new Date(offer.updatedAt || offer.date || Date.now()).getTime();
    const offerValue = offer.prices?.selectedOffer ?? offer.prices?.normal ?? 0;

    if (!existingClient) {
      clientMap.set(key, {
        key,
        customer: {
          name: customer.name || "Inte angivet",
          phone: customer.phone || "",
          email: customer.email || "",
          address: customer.address || "",
          notes: customer.notes || "",
        },
        offers: [offer],
        lastActivity: activityDate,
        totalValue: offerValue,
        tags: offer.customerTags || [],
      });

      return;
    }

    const mergedTags = [...new Set([
      ...(existingClient.tags || []),
      ...(offer.customerTags || []),
    ])];

    existingClient.customer = {
      name: existingClient.customer.name !== "Inte angivet" ? existingClient.customer.name : customer.name || "Inte angivet",
      phone: existingClient.customer.phone || customer.phone || "",
      email: existingClient.customer.email || customer.email || "",
      address: existingClient.customer.address || customer.address || "",
      notes: customer.notes || existingClient.customer.notes || "",
    };
    existingClient.offers.push(offer);
    existingClient.lastActivity = Math.max(existingClient.lastActivity, activityDate);
    existingClient.totalValue += offerValue;
    existingClient.tags = mergedTags;
  });

  return Array.from(clientMap.values()).sort((firstClient, secondClient) => (
    secondClient.lastActivity - firstClient.lastActivity
  ));
}

function SettingsScreen({ goBack, settings, onChange }) {
  const { t } = useI18n();

  const updateSetting = (field, value) => {
    onChange({
      ...settings,
      [field]: value,
    });
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => updateSetting("logoDataUrl", reader.result || "");
    reader.readAsDataURL(file);
  };

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

        <div className="min-w-0">
          <h1 className="break-words text-3xl font-black">
            {t("Inställningar")}
          </h1>
          <p className="text-orange-400">
            {t("Appinställningar")}
          </p>
        </div>

        <img
          src={marcinByggLogo}
          alt="Marcin Bygg"
          className="ml-auto h-12 w-12 shrink-0 rounded-2xl object-contain shadow-xl shadow-orange-500/20"
        />
      </div>

      <div className="mt-8 grid gap-5">
        <SettingsPanel title={t("Företagsuppgifter")}>
          <SettingsGrid>
            <SettingsInput label={t("Företagsnamn")} value={settings.companyName} onChange={(value) => updateSetting("companyName", value)} />
            <SettingsInput label={t("Org.nr")} value={settings.orgNumber} onChange={(value) => updateSetting("orgNumber", value)} />
            <SettingsInput label={t("Telefon")} value={settings.phone} onChange={(value) => updateSetting("phone", value)} />
            <SettingsInput label={t("Email")} value={settings.email} onChange={(value) => updateSetting("email", value)} />
            <SettingsInput label={t("Adress")} value={settings.address} onChange={(value) => updateSetting("address", value)} />
            <SettingsInput label={t("Webbplats")} value={settings.website} onChange={(value) => updateSetting("website", value)} />
          </SettingsGrid>

          <label className="mt-4 block text-sm text-zinc-400">
            {t("Upload logo firmy")}
            <input
              type="file"
              accept="image/png"
              onChange={handleLogoUpload}
              className="mt-2 block w-full rounded-2xl border border-zinc-800 bg-black px-4 py-3 text-sm text-zinc-300 file:mr-4 file:rounded-xl file:border-0 file:bg-orange-500 file:px-4 file:py-2 file:font-black file:text-black"
            />
          </label>
          {settings.logoDataUrl && (
            <div className="mt-4 flex items-center gap-3">
              <img src={settings.logoDataUrl} alt="" className="h-14 w-14 rounded-2xl object-contain bg-black" />
              <button type="button" onClick={() => updateSetting("logoDataUrl", "")} className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm font-black text-red-200">
                {t("Ta bort")}
              </button>
            </div>
          )}
        </SettingsPanel>

        <SettingsPanel title={t("Social media")}>
          <SettingsGrid>
            <SettingsInput label="Instagram" value={settings.instagram} onChange={(value) => updateSetting("instagram", value)} />
            <SettingsInput label="Facebook" value={settings.facebook} onChange={(value) => updateSetting("facebook", value)} />
            <SettingsInput label="TikTok" value={settings.tiktok} onChange={(value) => updateSetting("tiktok", value)} />
          </SettingsGrid>
        </SettingsPanel>

        <SettingsPanel title={t("Standardvärden")}>
          <SettingsGrid>
            <SettingsInput type="number" label={t("Standard timpris")} value={settings.standardHourlyRate} onChange={(value) => updateSetting("standardHourlyRate", Number(value) || 0)} />
            <SettingsInput type="number" label={t("Standard antal personer")} value={settings.standardPeopleCount} onChange={(value) => updateSetting("standardPeopleCount", Math.max(1, Number(value) || 1))} />
            <SettingsInput type="number" label={t("Standard spill %")} value={settings.standardWastePercent} onChange={(value) => updateSetting("standardWastePercent", Number(value) || 0)} />
            <SettingsInput type="number" label={t("Standard moms %")} value={settings.standardVatPercent} onChange={(value) => updateSetting("standardVatPercent", Number(value) || 0)} />
          </SettingsGrid>
        </SettingsPanel>

        <SettingsPanel title={t("Språk och enheter")}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm text-zinc-400">
              {t("Välj språk")}
              <select value={settings.language} onChange={(event) => updateSetting("language", event.target.value)} className="mt-2 min-h-14 w-full rounded-2xl border border-zinc-800 bg-black px-4 text-base font-bold text-white outline-none">
                <option value="pl">PL</option>
                <option value="sv">SV</option>
              </select>
            </label>
            <label className="block text-sm text-zinc-400">
              {t("Enhet")}
              <select value={settings.unit} onChange={(event) => updateSetting("unit", event.target.value)} className="mt-2 min-h-14 w-full rounded-2xl border border-zinc-800 bg-black px-4 text-base font-bold text-white outline-none">
                <option value="mm">mm</option>
                <option value="cm">cm</option>
                <option value="m">m</option>
              </select>
            </label>
          </div>
          <p className="mt-4 text-sm text-zinc-400">
            {t("PDF genereras alltid på svenska.")}
          </p>
        </SettingsPanel>
      </div>
    </div>
  );
}

function SettingsPanel({ title, children }) {
  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-2xl shadow-black/20">
      <h2 className="text-xl font-black text-white">
        {title}
      </h2>
      <div className="mt-4">
        {children}
      </div>
    </section>
  );
}

function SettingsGrid({ children }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {children}
    </div>
  );
}

function SettingsInput({ label, value, onChange, type = "text" }) {
  return (
    <label className="block text-sm text-zinc-400">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 min-h-14 w-full rounded-2xl border border-zinc-800 bg-black px-4 text-base font-bold text-white outline-none"
      />
    </label>
  );
}

function ProjectCrmPanel({
  projectStatus,
  setProjectStatus,
  privateNotes,
  setPrivateNotes,
  customerTags,
  setCustomerTags,
  projectPhotos,
  setProjectPhotos,
}) {
  const { language, t } = useI18n();

  const toggleTag = (tag) => {
    setCustomerTags((currentTags) => (
      currentTags.includes(tag)
        ? currentTags.filter((currentTag) => currentTag !== tag)
        : [...currentTags, tag]
    ));
  };

  const addPhotos = (event) => {
    const files = Array.from(event.target.files || []).filter((file) => file.type.startsWith("image/"));

    files.slice(0, 6).forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        setProjectPhotos((currentPhotos) => [
          ...currentPhotos,
          {
            id: crypto.randomUUID(),
            name: file.name,
            dataUrl: reader.result || "",
          },
        ].slice(-8));
      };

      reader.readAsDataURL(file);
    });

    event.target.value = "";
  };

  return (
    <section className="mt-8 rounded-3xl border border-orange-400/20 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-5 shadow-2xl shadow-orange-500/10">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-400">
            {t("Projekt & CRM Lite")}
          </p>
          <h2 className="mt-2 text-xl font-black">
            {t("Projektinformation")}
          </h2>
        </div>

        <span className="rounded-full border border-orange-400/30 bg-orange-500/10 px-3 py-2 text-xs font-black text-orange-200">
          {t(projectStatus)}
        </span>
      </div>

      <div className="mt-5 grid gap-4">
        <label className="block text-sm text-zinc-400">
          {t("Projektstatus")}
          <select
            value={projectStatus}
            onChange={(event) => setProjectStatus(event.target.value)}
            className="mt-2 min-h-14 w-full rounded-2xl border border-zinc-800 bg-black px-4 text-base font-bold text-white outline-none"
          >
            {projectStatuses.map((status) => (
              <option key={status} value={status}>{translateText(status, language)}</option>
            ))}
          </select>
        </label>

        <div>
          <p className="text-sm text-zinc-400">{t("Premium customer tags")}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {premiumCustomerTags.map((tag) => {
              const active = customerTags.includes(tag);

              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`min-h-11 rounded-full border px-4 text-sm font-black transition ${active ? "border-orange-400 bg-orange-500 text-black" : "border-white/10 bg-white/[0.04] text-zinc-200"}`}
                >
                  {t(tag)}
                </button>
              );
            })}
          </div>
        </div>

        <label className="block text-sm text-zinc-400">
          {t("Private notes")}
          <textarea
            value={privateNotes}
            onChange={(event) => setPrivateNotes(event.target.value)}
            className="mt-2 min-h-24 w-full resize-none rounded-2xl border border-zinc-800 bg-black px-4 py-3 text-base text-white outline-none"
            placeholder={t("Syns bara internt")}
          />
        </label>

        <div>
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-zinc-400">{t("Projektbilder")}</p>
            <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-2xl border border-orange-400/30 bg-orange-500/10 px-4 text-sm font-black text-orange-200">
              <Plus size={16} />
              {t("Lägg till bilder")}
              <input type="file" accept="image/*" multiple onChange={addPhotos} className="hidden" />
            </label>
          </div>

          {projectPhotos.length > 0 && (
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {projectPhotos.map((photo) => (
                <div key={photo.id} className="overflow-hidden rounded-2xl border border-white/10 bg-black">
                  <img src={photo.dataUrl} alt={photo.name} className="h-28 w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setProjectPhotos((currentPhotos) => currentPhotos.filter((currentPhoto) => currentPhoto.id !== photo.id))}
                    className="flex min-h-10 w-full items-center justify-center gap-2 bg-red-500/10 text-xs font-black text-red-200"
                  >
                    <Trash2 size={14} />
                    {t("Ta bort")}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function getMultiCategoryServices(category) {
  const baseCategory = getBaseCategory(category);
  const config = calculatorConfigs[baseCategory] || calculatorConfigs.default;
  const sections = config.sections || [{ title: "Tjänster", options: config.options || [] }];

  return sections.flatMap((section) => (section.options || []).map(normalizeCalculatorOption).map((option) => ({
    id: option.id,
    title: formatOptionTitle(option.title),
    sectionTitle: section.title || "Tjänster",
  })));
}

function getSectionServices(section) {
  const availableServices = getMultiCategoryServices(section.category);
  const existingServices = section.services || {};

  return availableServices.map((service) => ({
    ...service,
    active: existingServices[service.id]?.active || false,
    price: existingServices[service.id]?.price ?? 0,
    hours: existingServices[service.id]?.hours ?? 0,
    notes: existingServices[service.id]?.notes ?? "",
  }));
}

function getActiveMultiCategoryServices(section) {
  return getSectionServices(section).filter((service) => service.active);
}

function calculateMultiSectionTotal(section) {
  return getActiveMultiCategoryServices(section).reduce((total, service) => total + Math.max(0, Number(service.price) || 0), 0);
}

function calculateMultiSectionHours(section) {
  return getActiveMultiCategoryServices(section).reduce((total, service) => total + Math.max(0, Number(service.hours) || 0), 0);
}

function MultiCategoryOfferScreen({ initialOffer, initialCustomer, goBack, onSaveOffer, appSettings }) {
  const { language, t } = useI18n();
  const [customer, setCustomer] = useState(initialOffer?.customer || initialCustomer || {
    name: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
  });
  const [sections, setSections] = useState(initialOffer?.multiSections || []);
  const [nextCategory, setNextCategory] = useState(offerCategories[0]);
  const [expandedSectionId, setExpandedSectionId] = useState(initialOffer?.multiSections?.[0]?.id || "");
  const [projectStatus, setProjectStatus] = useState(initialOffer?.projectStatus || "Ny förfrågan");
  const [privateNotes, setPrivateNotes] = useState(initialOffer?.privateNotes || "");
  const [customerTags, setCustomerTags] = useState(initialOffer?.customerTags || []);
  const [projectPhotos, setProjectPhotos] = useState(initialOffer?.projectPhotos || []);
  const totalPrice = sections.reduce((total, section) => total + calculateMultiSectionTotal(section), 0);
  const totalHours = sections.reduce((total, section) => total + calculateMultiSectionHours(section), 0);

  const addSection = () => {
    const id = crypto.randomUUID();
    setSections((currentSections) => [
      ...currentSections,
      {
        id,
        category: nextCategory,
        services: {},
        expanded: true,
      },
    ]);
    setExpandedSectionId(id);
  };

  const updateSection = (id, values) => {
    setSections((currentSections) => currentSections.map((section) => (
      section.id === id ? { ...section, ...values, services: values.category ? {} : section.services } : section
    )));
  };

  const updateSectionService = (sectionId, serviceId, values) => {
    setSections((currentSections) => currentSections.map((section) => {
      if (section.id !== sectionId) {
        return section;
      }

      return {
        ...section,
        services: {
          ...(section.services || {}),
          [serviceId]: {
            ...(section.services?.[serviceId] || {}),
            ...values,
          },
        },
      };
    }));
  };

  const removeSection = (id) => {
    setSections((currentSections) => currentSections.filter((section) => section.id !== id));
    if (expandedSectionId === id) {
      setExpandedSectionId("");
    }
  };

  const selectedMultiOptions = sections.flatMap((section) => getActiveMultiCategoryServices(section).map((service) => ({
    id: `${section.id}-${service.id}`,
    title: service.title,
    sectionTitle: `${section.category} / ${service.sectionTitle}`,
    detailText: service.notes,
    priceValue: Math.max(0, Number(service.price) || 0),
    hoursValue: Math.max(0, Number(service.hours) || 0),
  })));

  const buildOffer = () => ({
    id: initialOffer?.id || crypto.randomUUID(),
    date: initialOffer?.date || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isMultiCategory: true,
    customer,
    projectStatus,
    privateNotes,
    customerTags,
    projectPhotos,
    category: "Multi-category offert",
    displayCategory: "Multi-category offert",
    multiSections: sections,
    area: null,
    peopleCount: appSettings.standardPeopleCount,
    schedule: {
      totalWorkHours: totalHours,
      hourlyRateSummary: `${formatPrice(appSettings.standardHourlyRate)}/h`,
      estimatedCalendarTime: totalHours > 0 ? formatEstimatedCalendarTime(totalHours, 36) : "",
    },
    options: selectedMultiOptions,
    extraCosts: [],
    discount: {
      active: false,
      percent: 0,
      amount: 0,
    },
    companySettings: appSettings,
    prices: {
      work: totalPrice,
      workAfterDiscount: totalPrice,
      fixed: 0,
      extraCosts: 0,
      min: totalPrice,
      normal: totalPrice,
      premium: totalPrice,
      selectedVariant: "normal",
      selectedOffer: totalPrice,
    },
  });

  const exportPdf = async () => {
    const offer = buildOffer();
    const logoImage = await loadPdfLogoImage(appSettings);
    const pdfBlob = createOfferPdfBlob({
      area: 0,
      showArea: false,
      areaMode: "manual",
      deckDimensions: null,
      displayCategory: offer.displayCategory,
      customer,
      projectStatus,
      selectedOfferPrice: totalPrice,
      selectedOptionDetails: selectedMultiOptions,
      extraCostDetails: [],
      extraCostsTotal: 0,
      fixedCostsTotal: 0,
      workPrice: totalPrice,
      peopleCount: appSettings.standardPeopleCount,
      totalWorkHours: totalHours,
      hourlyRateSummary: offer.schedule.hourlyRateSummary,
      estimatedCalendarTime: offer.schedule.estimatedCalendarTime,
      startDate: "",
      estimatedEndDate: "",
      discountActive: false,
      discountAmount: 0,
      discountPercent: 0,
      discountedWorkPrice: totalPrice,
      vvsNoticeActive: false,
      elNoticeActive: false,
      demolitionNoticeActive: sections.some((section) => isDemolitionCategory(section.category)),
      companySettings: appSettings,
      logoImage,
    });
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const downloadLink = document.createElement("a");

    downloadLink.href = pdfUrl;
    downloadLink.download = `multi-offert-${new Date().toISOString().slice(0, 10)}.pdf`;
    document.body.append(downloadLink);
    downloadLink.click();
    downloadLink.remove();
    setTimeout(() => URL.revokeObjectURL(pdfUrl), 1000);
  };

  return (
    <div className="min-h-[100dvh] overflow-x-hidden bg-black p-6 pb-[calc(7rem+env(safe-area-inset-bottom))] text-white">
      <div className="flex items-center gap-4">
        <button type="button" onClick={goBack} className="relative z-10 touch-manipulation rounded-2xl border border-zinc-800 bg-zinc-900 p-3">
          <ArrowLeft size={22} />
        </button>
        <div className="min-w-0">
          <h1 className="break-words text-3xl font-black">
            {t("Multi-category offert")}
          </h1>
          <p className="text-orange-400">
            {t("Flera kategorier i samma offert")}
          </p>
        </div>
        <img src={marcinByggLogo} alt="Marcin Bygg" className="ml-auto h-12 w-12 shrink-0 rounded-2xl object-contain shadow-xl shadow-orange-500/20" />
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-5">
          <h2 className="text-xl font-black">{t("Kunduppgifter")}</h2>
          <div className="mt-4 grid gap-4">
            <SettingsInput label={t("Namn")} value={customer.name} onChange={(value) => setCustomer({ ...customer, name: value })} />
            <SettingsInput label={t("Telefon")} value={customer.phone} onChange={(value) => setCustomer({ ...customer, phone: value })} />
            <SettingsInput label={t("Email")} value={customer.email || ""} onChange={(value) => setCustomer({ ...customer, email: value })} />
            <SettingsInput label={t("Adress")} value={customer.address} onChange={(value) => setCustomer({ ...customer, address: value })} />
            <label className="block text-sm text-zinc-400">
              {t("Anteckningar")}
              <textarea value={customer.notes} onChange={(event) => setCustomer({ ...customer, notes: event.target.value })} className="mt-2 min-h-24 w-full resize-none rounded-2xl border border-zinc-800 bg-black px-4 py-3 text-base text-white outline-none" />
            </label>
          </div>
        </section>

        <section className="rounded-3xl border border-orange-400/30 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-5 shadow-2xl shadow-orange-500/10">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-orange-400">{t("Total")}</p>
          <p className="mt-2 text-4xl font-black">{formatPrice(totalPrice)}</p>
          <p className="mt-2 text-sm text-zinc-400">{formatHours(totalHours)} · {sections.length} {t("sektioner")}</p>
        </section>
      </div>

      <ProjectCrmPanel
        projectStatus={projectStatus}
        setProjectStatus={setProjectStatus}
        privateNotes={privateNotes}
        setPrivateNotes={setPrivateNotes}
        customerTags={customerTags}
        setCustomerTags={setCustomerTags}
        projectPhotos={projectPhotos}
        setProjectPhotos={setProjectPhotos}
      />

      <div className="mt-6 rounded-3xl border border-zinc-800 bg-zinc-900/80 p-5">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <select value={nextCategory} onChange={(event) => setNextCategory(event.target.value)} className="min-h-14 rounded-2xl border border-zinc-800 bg-black px-4 text-base font-bold text-white outline-none">
            {offerCategories.map((category) => (
              <option key={category} value={category}>{translateText(category, language)}</option>
            ))}
          </select>
          <button type="button" onClick={addSection} className="min-h-14 rounded-2xl bg-orange-500 px-5 font-black text-black">
            {t("Lägg till kategori")}
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        {sections.map((section, index) => {
          const expanded = expandedSectionId === section.id;
          const services = getSectionServices(section);
          const activeServices = services.filter((service) => service.active);
          const sectionPrice = calculateMultiSectionTotal(section);
          const sectionHours = calculateMultiSectionHours(section);

          return (
            <section key={section.id} className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-4">
              <button type="button" onClick={() => setExpandedSectionId(expanded ? "" : section.id)} className="flex w-full items-center justify-between gap-4 text-left">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-orange-400">{t("Sektion")} {index + 1}</p>
                  <h2 className="mt-1 text-xl font-black">{translateText(section.category, language)}</h2>
                  <p className="mt-1 text-sm text-zinc-400">{formatPrice(sectionPrice)} · {formatHours(sectionHours)} · {activeServices.length} {t("valda tjänster")}</p>
                </div>
                <span className="text-2xl font-black text-orange-400">{expanded ? "-" : "+"}</span>
              </button>

              {expanded && (
                <div className="mt-5 grid gap-4">
                  <label className="block text-sm text-zinc-400">
                    {t("Kategori")}
                    <select value={section.category} onChange={(event) => updateSection(section.id, { category: event.target.value })} className="mt-2 min-h-14 w-full rounded-2xl border border-zinc-800 bg-black px-4 text-base font-bold text-white outline-none">
                      {offerCategories.map((category) => (
                        <option key={category} value={category}>{translateText(category, language)}</option>
                      ))}
                    </select>
                  </label>

                  <div className="grid gap-3">
                    {services.map((service) => (
                      <div key={service.id} className={`rounded-2xl border p-4 ${service.active ? "border-orange-400/40 bg-orange-500/10" : "border-white/10 bg-black/40"}`}>
                        <button
                          type="button"
                          onClick={() => updateSectionService(section.id, service.id, { active: !service.active })}
                          className="flex min-h-12 w-full items-center justify-between gap-3 text-left"
                        >
                          <div className="min-w-0">
                            <p className="text-xs font-black uppercase tracking-[0.14em] text-zinc-500">
                              {translateText(service.sectionTitle, language)}
                            </p>
                            <h3 className="mt-1 font-black text-white">
                              {translateText(service.title, language)}
                            </h3>
                          </div>
                          <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-black ${service.active ? "border-orange-400 bg-orange-500 text-black" : "border-white/10 text-transparent"}`}>
                            ✓
                          </span>
                        </button>

                        {service.active && (
                          <div className="mt-4 grid gap-3">
                            <SettingsGrid>
                              <SettingsInput type="number" label={t("Pris")} value={service.price} onChange={(value) => updateSectionService(section.id, service.id, { price: Number(value) || 0 })} />
                              <SettingsInput type="number" label={t("Tid på plats")} value={service.hours} onChange={(value) => updateSectionService(section.id, service.id, { hours: Number(value) || 0 })} />
                            </SettingsGrid>
                            <label className="block text-sm text-zinc-400">
                              {t("Anteckningar")}
                              <textarea value={service.notes} onChange={(event) => updateSectionService(section.id, service.id, { notes: event.target.value })} className="mt-2 min-h-20 w-full resize-none rounded-2xl border border-zinc-800 bg-black px-4 py-3 text-base text-white outline-none" />
                            </label>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={() => removeSection(section.id)} className="min-h-12 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 font-black text-red-200">
                    {t("Ta bort kategori")}
                  </button>
                </div>
              )}
            </section>
          );
        })}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-800 bg-black/95 p-4 backdrop-blur">
        <div className="mx-auto grid max-w-4xl grid-cols-3 gap-3">
          <button type="button" onClick={() => onSaveOffer(buildOffer())} className="min-h-12 rounded-2xl bg-orange-500 px-3 text-sm font-black text-black">{t("Spara offert")}</button>
          <button type="button" onClick={exportPdf} disabled={selectedMultiOptions.length === 0} className="min-h-12 rounded-2xl border border-orange-400/40 bg-orange-500/10 px-3 text-sm font-black text-orange-200 disabled:border-zinc-800 disabled:text-zinc-600">{t("Exportera PDF")}</button>
          <button type="button" onClick={goBack} className="min-h-12 rounded-2xl border border-zinc-800 bg-zinc-900 px-3 text-sm font-black text-white">{t("Avbryt")}</button>
        </div>
      </div>
    </div>
  );
}

async function exportSavedOfferPdf(offer) {
  const companySettings = offer.companySettings || loadAppSettings();
  const logoImage = await loadPdfLogoImage(companySettings);
  const pdfBlob = createOfferPdfBlob({
    area: offer.area ?? 0,
    showArea: offer.area !== null && offer.area !== undefined,
    areaMode: offer.areaMode || "manual",
    deckDimensions: offer.deckDimensions || null,
    displayCategory: offer.displayCategory || offer.category,
    customer: offer.customer || {},
    projectStatus: offer.projectStatus || "Ny förfrågan",
    selectedOfferPrice: offer.prices?.selectedOffer ?? offer.prices?.normal ?? 0,
      selectedOptionDetails: (offer.options || []).map((option) => ({
        ...option,
        title: formatOptionTitle(option.title),
      })),
    extraCostDetails: (offer.extraCosts || []).map((cost) => ({
      ...cost,
      priceValue: cost.priceValue ?? cost.price ?? 0,
    })),
    extraCostsTotal: offer.prices?.extraCosts || 0,
    fixedCostsTotal: offer.prices?.fixed || 0,
    workPrice: offer.prices?.work || 0,
    peopleCount: offer.peopleCount ?? 2,
    totalWorkHours: offer.schedule?.totalWorkHours || 0,
    hourlyRateSummary: offer.schedule?.hourlyRateSummary || "Inte angivet",
    estimatedCalendarTime: offer.schedule?.estimatedCalendarTime || "Ej angivet",
    startDate: offer.schedule?.startDate || "",
    estimatedEndDate: offer.schedule?.estimatedEndDate || "",
    discountActive: offer.discount?.active || false,
    discountAmount: offer.discount?.amount || 0,
      discountPercent: offer.discount?.percent || 0,
      discountedWorkPrice: offer.prices?.workAfterDiscount ?? offer.prices?.work ?? 0,
      vvsNoticeActive: (offer.options || []).some((option) => option.vvsNotice || isVvsRelatedOption(option)),
      elNoticeActive: (offer.options || []).some((option) => option.elNotice || isElRelatedOption(option)),
      demolitionNoticeActive: offer.demolitionNoticeActive || isDemolitionCategory(offer.displayCategory || offer.category),
      companySettings,
      logoImage,
    });
  const pdfUrl = URL.createObjectURL(pdfBlob);
  const downloadLink = document.createElement("a");

  downloadLink.href = pdfUrl;
  downloadLink.download = `offert-${(offer.customer?.name || "kund").toLowerCase().replace(/\s+/g, "-")}-${new Date().toISOString().slice(0, 10)}.pdf`;
  document.body.append(downloadLink);
  downloadLink.click();
  downloadLink.remove();

  setTimeout(() => {
    URL.revokeObjectURL(pdfUrl);
  }, 1000);
}

function ClientsScreen({ clients, goBack, onOpenClient, onNewOffer }) {
  const { language, t } = useI18n();

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
            {t("Kunder")}
          </h1>

          <p className="text-orange-400">
            {t("Kundregister")}
          </p>

        </div>

        <img
          src={marcinByggLogo}
          alt="Marcin Bygg"
          className="ml-auto h-12 w-12 shrink-0 rounded-2xl object-contain shadow-xl shadow-orange-500/20"
        />

      </div>

      {clients.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-orange-400/30 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-8 text-center shadow-2xl shadow-orange-500/10">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-400">
            {t("Inga kunder")}
          </p>

          <h2 className="mt-3 text-3xl font-black">
            {t("Kundlistan är tom")}
          </h2>

          <p className="mt-3 text-zinc-400">
            {t("Kunder skapas automatiskt när du sparar en offert.")}
          </p>
        </div>
      ) : (
        <div className="mt-10 flex flex-col gap-5">
          {clients.map((client) => (
            <article
              key={client.key}
              className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl shadow-black/30"
            >
              <button
                type="button"
                onClick={() => onOpenClient(client)}
                className="block w-full touch-manipulation bg-gradient-to-r from-zinc-900 to-black p-5 text-left"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-400">
                      {t("Senast")}: {formatOfferDate(client.lastActivity, language)}
                    </p>

                    <h2 className="mt-2 text-2xl font-black">
                      {translateText(client.customer.name || "Inte angivet", language)}
                    </h2>

                    <p className="mt-1 text-sm text-zinc-400">
                      {translateText(client.customer.phone || "Inte angivet", language)} · {translateText(client.customer.address || "Inte angivet", language)}
                    </p>

                    {client.customer.email && (
                      <p className="mt-1 text-sm text-zinc-500">
                        {client.customer.email}
                      </p>
                    )}

                    {client.tags?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {client.tags.map((tag) => (
                          <span key={`${client.key}-${tag}`} className="rounded-full border border-orange-400/25 bg-orange-500/10 px-3 py-1.5 text-xs font-black text-orange-200">
                            {t(tag)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="text-right">
                    <p className="text-xs uppercase text-zinc-500">
                      {t("Offerter")}
                    </p>

                    <p className="text-2xl font-black text-orange-400">
                      {client.offers.length}
                    </p>
                  </div>
                </div>
              </button>

              <div className="grid gap-3 p-5 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs font-bold uppercase text-zinc-500">
                    {t("Total offertvärde")}
                  </p>

                  <p className="mt-2 text-xl font-black text-white">
                    {formatPrice(client.totalValue)}
                  </p>
                </div>

                <HistoryActionButton onClick={() => onNewOffer(client)} icon={<Plus size={18} />}>
                  Ny offert
                </HistoryActionButton>
              </div>
            </article>
          ))}
        </div>
      )}

    </div>
  );
}

function ClientDetailScreen({ client, goBack, onEditOffer, onDeleteOffer, onNewOffer }) {
  const { language, t } = useI18n();
  const [offerToDelete, setOfferToDelete] = useState(null);

  if (!client) {
    return (
      <div className="min-h-[100dvh] bg-black p-6 text-white">
        <button
          type="button"
          onClick={goBack}
          className="relative z-10 touch-manipulation rounded-2xl border border-zinc-800 bg-zinc-900 p-3"
        >
          <ArrowLeft size={22} />
        </button>

        <div className="mt-10 rounded-3xl border border-orange-400/30 bg-zinc-950 p-8 text-center">
          <h1 className="text-2xl font-black">
            {t("Kunden finns inte längre")}
          </h1>
        </div>
      </div>
    );
  }

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
            {translateText(client.customer.name, language)}
          </h1>

          <p className="text-orange-400">
            {t("Kundprofil")}
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-orange-400/25 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-6 shadow-2xl shadow-orange-500/10">
        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <SummaryRow label="Telefon" value={client.customer.phone || "Inte angivet"} />
          <SummaryRow label="Email" value={client.customer.email || "Inte angivet"} />
          <SummaryRow label="Adress" value={client.customer.address || "Inte angivet"} />
          <SummaryRow label="Anteckningar" value={client.customer.notes || "Inga anteckningar"} />
          <SummaryRow label="Sista aktivitet" value={formatOfferDate(client.lastActivity, language)} />
          <SummaryRow label="Antal offerter" value={`${client.offers.length}`} />
          <SummaryRow label="Total offertvärde" value={formatPrice(client.totalValue)} />
          <SummaryRow label="Premium customer tags" value={(client.tags || []).length > 0 ? client.tags.map((tag) => translateText(tag, language)).join(", ") : "Inte angivet"} />
        </div>

        <div className="mt-6">
          <HistoryActionButton onClick={() => onNewOffer(client)} icon={<Plus size={18} />}>
            Ny offert för kunden
          </HistoryActionButton>
        </div>
      </div>

      <div className="mt-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">
          {t("Arbetshistorik")}
        </p>

        <div className="mt-4 flex flex-col gap-5">
          {client.offers.map((offer) => (
            <article
              key={offer.id}
              className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl shadow-black/30"
            >
              <div className="border-b border-white/10 bg-gradient-to-r from-zinc-900 to-black p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-400">
                      {formatOfferDate(offer.updatedAt || offer.date, language)}
                    </p>

                    <h2 className="mt-2 text-2xl font-black">
                      {translateText(offer.displayCategory || offer.category, language)}
                    </h2>

                    <p className="mt-1 text-sm text-zinc-400">
                      {t("Start")}: {offer.schedule?.startDate ? formatLongDate(parseLocalDate(offer.schedule.startDate), language) : t("Inte angivet")}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full border border-orange-400/30 bg-orange-500/10 px-3 py-1.5 text-xs font-black text-orange-200">
                        {t(offer.projectStatus || "Ny förfrågan")}
                      </span>
                      {(offer.customerTags || []).map((tag) => (
                        <span key={`${offer.id}-${tag}`} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-bold text-zinc-200">
                          {t(tag)}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs uppercase text-zinc-500">
                      {t("Offertpris")}
                    </p>

                    <p className="text-xl font-black text-orange-400">
                      {formatPrice(offer.prices?.selectedOffer ?? offer.prices?.normal ?? 0)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 p-5">
                <div className="grid gap-3 text-sm sm:grid-cols-3">
                  <SummaryRow label="Datum" value={formatOfferDate(offer.date, language)} />
                  <SummaryRow label="Uppskattad tid" value={offer.schedule?.estimatedCalendarTime || "Ej angivet"} />
                  <SummaryRow
                    label="Slutdatum"
                    value={offer.schedule?.startDate
                      ? calculateEstimatedEndDate(
                        offer.schedule.startDate,
                        offer.schedule.totalWorkHours || 0,
                        offer.schedule.availability || {
                          weekdayEveningHours: 4,
                          weekdayEveningsPerWeek: 5,
                          weekendDayHours: 8,
                          weekendDaysPerWeek: 2,
                        },
                        language,
                      ) || "Inte angivet"
                      : "Inte angivet"}
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {(offer.options || []).slice(0, 8).map((option) => (
                    <span
                      key={`${offer.id}-${option.id}`}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-bold text-zinc-200"
                    >
                      {translateText(formatOptionTitle(option.title), language)}
                    </span>
                  ))}
                </div>

                <div className="grid gap-3 sm:grid-cols-4">
                  <HistoryActionButton onClick={() => onEditOffer(offer)} icon={<Folder size={18} />}>
                    Öppna
                  </HistoryActionButton>

                  <HistoryActionButton onClick={() => onEditOffer(offer)} icon={<Edit3 size={18} />}>
                    Redigera
                  </HistoryActionButton>

                  <HistoryActionButton onClick={() => exportSavedOfferPdf(offer)} icon={<FileDown size={18} />}>
                    Exportera PDF
                  </HistoryActionButton>

                  <HistoryActionButton onClick={() => setOfferToDelete(offer)} icon={<Trash2 size={18} />} variant="danger">
                    Ta bort
                  </HistoryActionButton>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {offerToDelete && (
        <div className="fixed inset-0 z-[80] flex items-end bg-black/75 p-4 backdrop-blur-sm sm:items-center sm:justify-center">
          <div className="w-full rounded-3xl border border-orange-400/25 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-6 shadow-2xl shadow-orange-500/10 sm:max-w-md">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">
              {t("Bekräfta")}
            </p>

            <h2 className="mt-3 text-2xl font-black">
              {t("Ta bort offert?")}
            </h2>

            <p className="mt-3 text-sm text-zinc-400">
              {t("Offerten tas bort från kundens historik och från Historik.")}
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setOfferToDelete(null)}
                className="min-h-14 touch-manipulation rounded-2xl border border-white/10 bg-white/[0.04] px-4 font-black text-white"
              >
                {t("Avbryt")}
              </button>

              <button
                type="button"
                onClick={() => {
                  onDeleteOffer(offerToDelete.id);
                  setOfferToDelete(null);
                }}
                className="min-h-14 touch-manipulation rounded-2xl bg-red-500 px-4 font-black text-white shadow-lg shadow-red-500/20"
              >
                {t("Ta bort")}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function HistoryScreen({ offers, goBack, onEditOffer, onDeleteOffer }) {
  const { language, t } = useI18n();
  const [offerToDelete, setOfferToDelete] = useState(null);
  const [statusFilter, setStatusFilter] = useState("Alla statusar");
  const [searchQuery, setSearchQuery] = useState("");
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredOffers = offers.filter((offer) => {
    const statusMatches = statusFilter === "Alla statusar" || (offer.projectStatus || "Ny förfrågan") === statusFilter;

    if (!statusMatches) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    return [
      offer.customer?.name,
      offer.customer?.phone,
      offer.customer?.email,
      offer.customer?.address,
      offer.displayCategory,
      offer.category,
      offer.projectStatus,
      offer.privateNotes,
      ...(offer.customerTags || []),
    ].filter(Boolean).join(" ").toLowerCase().includes(normalizedQuery);
  });

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
            {t("Projekt & CRM Lite")}
          </h1>

          <p className="text-orange-400">
            {t("Alla offerter som projekt")}
          </p>

        </div>

        <img
          src={marcinByggLogo}
          alt="Marcin Bygg"
          className="ml-auto h-12 w-12 shrink-0 rounded-2xl object-contain shadow-xl shadow-orange-500/20"
        />

      </div>

      {offers.length > 0 && (
        <div className="mt-8 grid gap-3 rounded-3xl border border-white/10 bg-zinc-950 p-4 sm:grid-cols-[1fr_220px]">
          <label className="block text-sm text-zinc-400">
            {t("Sök projekt")}
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={t("Sök klient, adress, telefon eller tagg")}
              className="mt-2 min-h-14 w-full rounded-2xl border border-zinc-800 bg-black px-4 text-base font-bold text-white outline-none"
            />
          </label>

          <label className="block text-sm text-zinc-400">
            {t("Projektstatus")}
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="mt-2 min-h-14 w-full rounded-2xl border border-zinc-800 bg-black px-4 text-base font-bold text-white outline-none"
            >
              <option value="Alla statusar">{t("Alla statusar")}</option>
              {projectStatuses.map((status) => (
                <option key={status} value={status}>{translateText(status, language)}</option>
              ))}
            </select>
          </label>
        </div>
      )}

      {offers.length === 0 ? (

        <div className="mt-10 rounded-3xl border border-orange-400/30 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-8 text-center shadow-2xl shadow-orange-500/10">

          <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-400">
            {t("Inga offerter")}
          </p>

          <h2 className="mt-3 text-3xl font-black">
            {t("Historiken är tom")}
          </h2>

          <p className="mt-3 text-zinc-400">
            {t("Sparade offerter visas här när du trycker på Spara offert.")}
          </p>

        </div>

      ) : (

        <div className="mt-10 flex flex-col gap-5">

          {filteredOffers.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-zinc-950 p-8 text-center text-zinc-400">
              {t("Inga projekt matchar filtret.")}
            </div>
          ) : filteredOffers.map((offer) => (

            <article
              key={offer.id}
              className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl shadow-black/30"
            >

              <div className="border-b border-white/10 bg-gradient-to-r from-zinc-900 to-black p-5">

                <div className="flex items-start justify-between gap-4">

                  <div>

                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-400">
                      {formatOfferDate(offer.date, language)}
                    </p>

                    <h2 className="mt-2 text-2xl font-black">
                      {translateText(offer.customer?.name || "Inte angivet", language)}
                    </h2>

                    <p className="mt-1 text-sm text-zinc-400">
                      {translateText(offer.displayCategory || offer.category, language)} · {offer.area !== null && offer.area !== undefined ? `${formatArea(offer.area)} · ` : ""}{offer.peopleCount ?? 2} {translateText((offer.peopleCount ?? 2) === 1 ? "person" : "personer", language)}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full border border-orange-400/30 bg-orange-500/10 px-3 py-1.5 text-xs font-black text-orange-200">
                        {t(offer.projectStatus || "Ny förfrågan")}
                      </span>
                      {(offer.customerTags || []).map((tag) => (
                        <span key={`${offer.id}-${tag}`} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-bold text-zinc-200">
                          {t(tag)}
                        </span>
                      ))}
                    </div>

                  </div>

                  <div className="text-right">

                    <p className="text-xs uppercase text-zinc-500">
                      {t("Offertpris")}
                    </p>

                    <p className="text-xl font-black text-orange-400">
                      {formatPrice(offer.prices?.selectedOffer ?? offer.prices?.normal ?? 0)}
                    </p>

                  </div>

                </div>

              </div>

              <div className="grid gap-4 p-5">

                <div className="grid gap-3 text-sm sm:grid-cols-3">

                  <SummaryRow label="Telefon" value={offer.customer?.phone || "Inte angivet"} />
                  <SummaryRow label="Email" value={offer.customer?.email || "Inte angivet"} />
                  <SummaryRow label="Adress" value={offer.customer?.address || "Inte angivet"} />
                  <SummaryRow label="Anteckningar" value={offer.customer?.notes || "Inga anteckningar"} />
                  <SummaryRow label="Private notes" value={offer.privateNotes || "Inga privata anteckningar"} />
                  <SummaryRow label="Projektbilder" value={`${offer.projectPhotos?.length || 0}`} />

                </div>

                <div>

                  <h3 className="text-xs font-bold uppercase tracking-wide text-zinc-500">
                    {t("Valda alternativ")}
                  </h3>

                  <div className="mt-3 flex flex-wrap gap-2">

                    {(offer.options || []).length > 0 ? (offer.options || []).map((option) => (

                      <span
                        key={`${offer.id}-${option.id}`}
                        className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-bold text-zinc-200"
                      >
                        {translateText(formatOptionTitle(option.title), language)}
                      </span>

                    )) : (

                      <span className="text-sm text-zinc-500">
                        {t("Inga valda alternativ")}
                      </span>

                    )}

                  </div>

                </div>

                {offer.extraCosts?.length > 0 && (
                  <div>

                    <h3 className="text-xs font-bold uppercase tracking-wide text-zinc-500">
                      {t("Extra kostnader")}
                    </h3>

                    <div className="mt-3 flex flex-wrap gap-2">

                      {offer.extraCosts.map((cost) => (

                        <span
                          key={`${offer.id}-${cost.id}`}
                          className="rounded-full border border-orange-400/20 bg-orange-500/10 px-3 py-2 text-xs font-bold text-orange-200"
                        >
                          {translateText(cost.name || "Extra kostnad", language)} · {formatPrice(cost.priceValue)}
                        </span>

                      ))}

                    </div>

                  </div>
                )}

                <div className="grid grid-cols-3 overflow-hidden rounded-2xl border border-white/10 text-center">

                  <HistoryPrice label="MIN" value={offer.prices?.min || 0} highlight={offer.prices?.selectedVariant === "min"} />
                  <HistoryPrice label="NORMAL" value={offer.prices?.normal || 0} highlight={!offer.prices?.selectedVariant || offer.prices?.selectedVariant === "normal"} />
                  <HistoryPrice label="PREMIUM" value={offer.prices?.premium || 0} highlight={offer.prices?.selectedVariant === "premium"} />

                </div>

                <div className="grid gap-3 pt-1 sm:grid-cols-3">

                  <HistoryActionButton onClick={() => onEditOffer(offer)} icon={<Edit3 size={18} />}>
                    Öppna / Redigera
                  </HistoryActionButton>

                  <HistoryActionButton onClick={() => exportSavedOfferPdf(offer)} icon={<FileDown size={18} />}>
                    Exportera PDF
                  </HistoryActionButton>

                  <HistoryActionButton onClick={() => setOfferToDelete(offer)} icon={<Trash2 size={18} />} variant="danger">
                    Ta bort
                  </HistoryActionButton>

                </div>

              </div>

            </article>

          ))}

        </div>

      )}

      {offerToDelete && (
        <div className="fixed inset-0 z-[80] flex items-end bg-black/75 p-4 backdrop-blur-sm sm:items-center sm:justify-center">

          <div className="w-full rounded-3xl border border-orange-400/25 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-6 shadow-2xl shadow-orange-500/10 sm:max-w-md">

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">
              {t("Bekräfta")}
            </p>

            <h2 className="mt-3 text-2xl font-black">
              {t("Ta bort offert?")}
            </h2>

            <p className="mt-3 text-sm text-zinc-400">
              {t("Offerten för {name} tas bort permanent från historiken.").replace("{name}", offerToDelete.customer?.name || t("Kund").toLowerCase())}
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">

              <button
                type="button"
                onClick={() => setOfferToDelete(null)}
                className="min-h-14 touch-manipulation rounded-2xl border border-white/10 bg-white/[0.04] px-4 font-black text-white"
              >
                {t("Avbryt")}
              </button>

              <button
                type="button"
                onClick={() => {
                  onDeleteOffer(offerToDelete.id);
                  setOfferToDelete(null);
                }}
                className="min-h-14 touch-manipulation rounded-2xl bg-red-500 px-4 font-black text-white shadow-lg shadow-red-500/20"
              >
                {t("Ta bort")}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

function HistoryActionButton({ children, icon, onClick, variant = "default" }) {
  const { language } = useI18n();
  const className = variant === "danger"
    ? "border-red-500/30 bg-red-500/10 text-red-100 hover:bg-red-500/20"
    : "border-orange-400/25 bg-white/[0.04] text-white hover:bg-orange-500/10";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative z-10 flex min-h-14 touch-manipulation items-center justify-center gap-2 rounded-2xl border px-4 text-sm font-black transition ${className}`}
    >
      {icon}
      <span>{translateText(children, language)}</span>
    </button>
  );
}

function formatOfferDate(date, language = "sv") {
  return new Date(date).toLocaleDateString(language === "pl" ? "pl-PL" : "sv-SE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function HistoryPrice({ label, value, highlight = false }) {
  const { language } = useI18n();

  return (
    <div className={`p-4 ${highlight ? "bg-orange-500 text-black" : "bg-black/40 text-white"}`}>
      <p className={`text-[10px] font-black ${highlight ? "text-black/60" : "text-zinc-500"}`}>
        {translateText(label, language)}
      </p>

      <p className="mt-1 text-sm font-black">
        {formatPrice(value)}
      </p>
    </div>
  );
}

function calculateWeeklyAvailableHours(availability) {
  const weekdayHours = Math.max(0, Number(availability.weekdayEveningHours) || 0);
  const weekdayCount = Math.max(0, Number(availability.weekdayEveningsPerWeek) || 0);
  const weekendHours = Math.max(0, Number(availability.weekendDayHours) || 0);
  const weekendCount = Math.max(0, Number(availability.weekendDaysPerWeek) || 0);

  return (weekdayHours * weekdayCount) + (weekendHours * weekendCount);
}

function formatHours(hours) {
  const roundedHours = Math.round((Number(hours) || 0) * 100) / 100;
  const formattedHours = roundedHours
    .toLocaleString("sv-SE", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
    })
    .replace(",", ".");

  return `${formattedHours} h`;
}

function formatArea(area) {
  const roundedArea = Math.round((Number(area) || 0) * 10) / 10;

  return `${roundedArea.toLocaleString("sv-SE")} m²`;
}

function formatLength(length) {
  const roundedLength = Math.round((Number(length) || 0) * 10) / 10;

  return `${roundedLength.toLocaleString("sv-SE")} m`;
}

function formatOptionTitle(title) {
  const normalizedTitle = String(title || "").toLowerCase();

  if (normalizedTitle.includes("ljus färg") || normalizedTitle.includes("vit /")) {
    return "Målning med ljus färg";
  }

  if (normalizedTitle.includes("standard färg") || normalizedTitle.includes("normal färg")) {
    return "Målning med standardfärg";
  }

  if (normalizedTitle.includes("mörk färg")) {
    return "Målning med mörk färg";
  }

  if (normalizedTitle.includes("flera färger")) {
    return "Målning med flera färger";
  }

  if (normalizedTitle === "trästaket") {
    return "Byggnation av platsbyggt trästaket";
  }

  if (normalizedTitle === "betongfundament") {
    return "Montering av betongplint";
  }

  if (normalizedTitle === "innerdörr") {
    return "Montering av enkel innerdörr";
  }

  if (normalizedTitle === "ytterdörr") {
    return "Montering av enkel ytterdörr";
  }

  if (normalizedTitle === "fönster") {
    return "Montering av standardfönster";
  }

  if (normalizedTitle === "litet fönster") {
    return "Montering av litet fönster";
  }

  if (normalizedTitle === "standardfönster") {
    return "Montering av standardfönster";
  }

  if (normalizedTitle === "stort fönster") {
    return "Montering av stort fönster";
  }

  if (normalizedTitle === "fast fönster") {
    return "Montering av fast fönster";
  }

  if (normalizedTitle === "öppningsbart fönster") {
    return "Montering av öppningsbart fönster";
  }

  if (normalizedTitle === "innerdörr enkel") {
    return "Montering av enkel innerdörr";
  }

  if (normalizedTitle === "innerdörr dubbel") {
    return "Montering av dubbel innerdörr";
  }

  if (normalizedTitle === "ytterdörr enkel") {
    return "Montering av enkel ytterdörr";
  }

  if (normalizedTitle === "ytterdörr dubbel") {
    return "Montering av dubbel ytterdörr";
  }

  if (normalizedTitle === "altandörr") {
    return "Montering av altandörr";
  }

  if (normalizedTitle === "skjutdörr") {
    return "Montering av skjutdörr";
  }

  if (normalizedTitle === "lås / handtag") {
    return "Montering av lås / handtag";
  }

  if (normalizedTitle === "fönsterbleck") {
    return "Montering av fönsterbleck";
  }

  if (normalizedTitle === "smygar") {
    return "Montering av smygar";
  }

  if (normalizedTitle === "foder") {
    return "Montering av foder";
  }

  if (normalizedTitle === "drevning / isolering") {
    return "Drevning / isolering av fönster";
  }

  if (normalizedTitle === "fogning / silikon") {
    return "Fogning / silikon runt fönster";
  }

  const serviceTitleMap = {
    "trappa": "Montering av trappa",
    "pergola": "Montering av pergola",
    "avfallshantering": "Bortforsling av avfall",
    "spackling": "Spackling av ytor",
    "slipning": "Slipning av ytor",
    "grundmålning": "Grundmålning av ytor",
    "maskering": "Maskering inför arbete",
    "väggmålning": "Målning av väggar",
    "takmålning": "Målning av tak",
    "snickerimålning": "Målning av snickerier",
    "trappmålning": "Målning av trappa",
    "fasadmålning": "Målning av fasad",
    "skrapning": "Skrapning av fasad",
    "grundmålning fasad": "Grundmålning av fasad",
    "standard tapet": "Tapetsering med standardtapet",
    "mönsterpassning": "Tapetsering med mönsterpassning",
    "svår tapet": "Tapetsering med svår tapet",
    "accentvägg": "Målning av accentvägg",
    "dammskydd / avgränsning": "Montering av dammskydd / avgränsning",
    "håltagning": "Håltagning för ventilation",
    "kolfilterfläkt": "Montering av kolfilterfläkt",
    "justering / tätning": "Justering / tätning av ventilation",
    "möbelskydd": "Skydd av möbler",
    "ställning": "Hyra av ställning",
    "lift": "Hyra av lift",
    "silikon / tätning": "Silikon / tätning runt spishäll",
    "pax / platsbyggd garderob": "Montering av PAX / platsbyggd garderob",
    "anpassning": "Anpassning av garderob",
    "passbitar / täcksidor": "Montering av passbitar / täcksidor",
    "silikon / fogning": "Silikon / fogning i kök eller garderob",
    "socklar": "Montering av socklar",
    "passbitar": "Montering av passbitar",
    "belysning": "Montering av belysning",
    "led-list under skåp": "Montering av LED-list under skåp",
    "anpassning / kabeldragning": "Anpassning / kabeldragning för bänkbelysning",
    "transformator / driver": "Montering av transformator / driver",
    "regelvägg": "Byggnation av regelvägg",
    "gipsvägg": "Montering av gipsvägg",
    "osb + gips": "Montering av OSB + gips",
    "isolering": "Montering av isolering i vägg",
    "gipstak": "Montering av gipstak",
    "paneltak": "Montering av paneltak",
    "sänkt tak": "Montering av sänkt tak",
    "spotlights": "Montering av spotlights",
    "isolering tak": "Montering av isolering i tak",
    "klickgolv / laminat inkl. lätta golvlister": "Läggning av klickgolv / laminat inkl. montering av lätta golvlister",
    "trägolv": "Läggning av trägolv",
    "parkett": "Läggning av parkett",
    "fiskben / avancerat mönster": "Läggning av fiskben / avancerat mönster",
    "underlag / foam / lumppapp": "Montering av underlag / foam / lumppapp",
    "spånskiva": "Montering av spånskiva",
    "flytspackel": "Flytspackling av golv",
    "svåra golvlister / många kapningar": "Montering av svåra golvlister / många kapningar",
    "trösklar": "Montering av trösklar",
    "endast trallbyte": "Byte av trall",
    "reparation": "Reparation av altan",
    "ny stomme": "Byggnation av ny stomme",
    "enkla räcken": "Montering av enkla räcken",
    "premium räcken": "Montering av premiumräcken",
    "pergolatak": "Montering av pergolatak",
    "enkel trappa": "Montering av enkel trappa",
    "markförberedelse": "Markförberedelse för altan",
    "olja och träskydd": "Olja och träskyddsbehandling",
    "komplicerad altan": "Byggnation av komplicerad altan",
    "led-belysning": "Montering av LED-belysning",
    "platsbyggt trästaket": "Byggnation av platsbyggt trästaket",
    "färdiga staketsektioner": "Montering av färdiga staketsektioner",
    "insynsskydd": "Montering av insynsskydd",
    "spjälstaket": "Montering av spjälstaket",
    "staket med grind": "Montering av staket med grind",
    "målning / olja": "Målning / olja av staket",
    "stolpar i mark": "Montering av stolpar i mark",
    "betongplint": "Montering av betongplint",
  };

  if (serviceTitleMap[normalizedTitle]) {
    return serviceTitleMap[normalizedTitle];
  }

  return title;
}

function isVvsRelatedOption(option) {
  const title = String(option.title || "").toLowerCase();
  const id = String(option.id || "").toLowerCase();

  return option.vvsNotice
    || id.includes("dishwasher")
    || id.includes("faucet")
    || id.includes("sink")
    || title.includes("diskmaskin")
    || title.includes("blandare")
    || title.includes("kran")
    || title.includes("diskho")
    || title.includes("vask");
}

function isElRelatedOption(option) {
  const title = String(option.title || "").toLowerCase();
  const id = String(option.id || "").toLowerCase();

  return option.elNotice
    || id.includes("appliance")
    || id.includes("cooktop")
    || id.includes("benchlighting")
    || id.includes("dishwasher")
    || id.includes("fridge")
    || id.includes("freezer")
    || id.includes("oven")
    || id.includes("microwave")
    || id.includes("fan")
    || id.includes("ventilation")
    || title.includes("spishäll")
    || title.includes("vitvara")
    || title.includes("diskmaskin")
    || title.includes("kyl")
    || title.includes("frys")
    || title.includes("ugn")
    || title.includes("mikro")
    || title.includes("fläkt")
    || title.includes("bänkbelysning")
    || title.includes("belysning")
    || title.includes("led-list")
    || title.includes("kabeldragning")
    || title.includes("transformator")
    || title.includes("driver");
}

function formatEstimatedCalendarTime(totalWorkHours, weeklyAvailableHours) {
  if (totalWorkHours <= 0 || weeklyAvailableHours <= 0) {
    return "Ej angivet";
  }

  const weeks = totalWorkHours / weeklyAvailableHours;

  if (weeks >= 1) {
    const roundedWeeks = Math.max(1, Math.round(weeks * 10) / 10);

    return `ca ${roundedWeeks.toLocaleString("sv-SE")} ${roundedWeeks === 1 ? "vecka" : "veckor"}`;
  }

  const calendarDaysPerWeek = 7;
  const days = Math.max(1, Math.floor(weeks * calendarDaysPerWeek + 0.4));

  return `ca ${days} ${days === 1 ? "dag" : "dagar"}`;
}

function formatEstimatedCalendarDays(days) {
  if (days <= 0) {
    return "Ej angivet";
  }

  if (days >= 7) {
    const roundedWeeks = Math.max(1, Math.round((days / 7) * 10) / 10);

    return `ca ${roundedWeeks.toLocaleString("sv-SE")} ${roundedWeeks === 1 ? "vecka" : "veckor"}`;
  }

  return `ca ${days} ${days === 1 ? "dag" : "dagar"}`;
}

function parseLocalDate(dateValue) {
  if (!dateValue) {
    return null;
  }

  const [year, month, day] = dateValue.split("-").map(Number);

  if (!year || !month || !day) {
    return null;
  }

  return new Date(year, month - 1, day);
}

function formatLongDate(date, language = "sv") {
  return date.toLocaleDateString(language === "pl" ? "pl-PL" : "sv-SE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function calculateEstimatedEndDate(startDate, totalWorkHours, availability, language = "sv") {
  const parsedStartDate = parseLocalDate(startDate);

  if (!parsedStartDate || totalWorkHours <= 0) {
    return "";
  }

  const weekdayHours = Math.max(0, Number(availability.weekdayEveningHours) || 0);
  const weekdayCount = Math.max(0, Number(availability.weekdayEveningsPerWeek) || 0);
  const weekendHours = Math.max(0, Number(availability.weekendDayHours) || 0);
  const weekendCount = Math.max(0, Number(availability.weekendDaysPerWeek) || 0);
  let remainingHours = totalWorkHours;
  const currentDate = new Date(parsedStartDate);
  const weeklyUsage = {};

  for (let dayIndex = 0; dayIndex < 730; dayIndex += 1) {
    const day = currentDate.getDay();
    const isWeekend = day === 0 || day === 6;
    const weekStart = new Date(currentDate);
    const mondayOffset = (day + 6) % 7;

    weekStart.setDate(currentDate.getDate() - mondayOffset);
    const weekKey = weekStart.toISOString().slice(0, 10);
    const usage = weeklyUsage[weekKey] || {
      weekdays: 0,
      weekendDays: 0,
    };
    let availableHours = 0;

    if (isWeekend && usage.weekendDays < weekendCount) {
      availableHours = weekendHours;
      usage.weekendDays += 1;
    }

    if (!isWeekend && usage.weekdays < weekdayCount) {
      availableHours = weekdayHours;
      usage.weekdays += 1;
    }

    weeklyUsage[weekKey] = usage;

    if (availableHours > 0) {
      remainingHours -= availableHours;

      if (remainingHours <= 0) {
        return `ca ${formatLongDate(currentDate, language)}`;
      }
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return "";
}

function calculateScheduledCalendarDays(startDate, totalWorkHours, availability) {
  const parsedStartDate = parseLocalDate(startDate);

  if (!parsedStartDate || totalWorkHours <= 0) {
    return 0;
  }

  const weekdayHours = Math.max(0, Number(availability.weekdayEveningHours) || 0);
  const weekdayCount = Math.max(0, Number(availability.weekdayEveningsPerWeek) || 0);
  const weekendHours = Math.max(0, Number(availability.weekendDayHours) || 0);
  const weekendCount = Math.max(0, Number(availability.weekendDaysPerWeek) || 0);
  let remainingHours = totalWorkHours;
  const currentDate = new Date(parsedStartDate);
  const weeklyUsage = {};

  for (let dayIndex = 0; dayIndex < 730; dayIndex += 1) {
    const day = currentDate.getDay();
    const isWeekend = day === 0 || day === 6;
    const weekStart = new Date(currentDate);
    const mondayOffset = (day + 6) % 7;

    weekStart.setDate(currentDate.getDate() - mondayOffset);
    const weekKey = weekStart.toISOString().slice(0, 10);
    const usage = weeklyUsage[weekKey] || {
      weekdays: 0,
      weekendDays: 0,
    };
    let availableHours = 0;

    if (isWeekend && usage.weekendDays < weekendCount) {
      availableHours = weekendHours;
      usage.weekendDays += 1;
    }

    if (!isWeekend && usage.weekdays < weekdayCount) {
      availableHours = weekdayHours;
      usage.weekdays += 1;
    }

    weeklyUsage[weekKey] = usage;

    if (availableHours > 0) {
      remainingHours -= availableHours;

      if (remainingHours <= 0) {
        return dayIndex + 1;
      }
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return 0;
}

const defaultCalculatorOptions = [
  {
    id: "stairs",
    title: "Montering av trappa",
    price: ({ active }) => (active ? 4000 : 0),
  },
  {
    id: "pergola",
    title: "Montering av pergola",
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
    title: "Bortforsling av avfall",
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

const altanPergolaDefaultPrices = {
  deckingOnlyPerSquareMeter: 180,
  repairPerSquareMeter: 220,
  newFramePerSquareMeter: 280,
  simpleRailingsPerSquareMeter: 100,
  premiumRailingsPerSquareMeter: 180,
  simpleStairsFixed: 2000,
  woodFencePerMeter: 350,
  prefabFenceSectionsPerMeter: 0,
  privacyScreenPerMeter: 850,
  picketFencePerMeter: 700,
  fenceWithGatePerMeter: 950,
  fencePaintingOilPerMeter: 90,
  groundPostsPerMeter: 260,
  concreteFoundationPerMeter: 320,
};

const paintingDefaultPrices = {
  spacklingPerSquareMeter: 70,
  sandingPerSquareMeter: 35,
  primerPerSquareMeter: 55,
  maskingPerSquareMeter: 25,
  wallPaintingPerSquareMeter: 120,
  ceilingPaintingPerSquareMeter: 140,
  standardWallpaperPerSquareMeter: 160,
  patternWallpaperPerSquareMeter: 220,
  difficultWallpaperPerSquareMeter: 280,
  facadePaintingPerSquareMeter: 160,
  facadeWashPerSquareMeter: 35,
  scrapingPerSquareMeter: 85,
  facadePrimerPerSquareMeter: 75,
  furnitureProtectionFixed: 800,
  darkColorPerSquareMeter: 45,
  multipleColorsPerSquareMeter: 65,
  accentWallFixed: 1200,
  stairPaintingStandardPerStep: 200,
  stairPaintingPremiumPerStep: 350,
  stairPaintingStandardHoursPerStep: 0.3,
  stairPaintingPremiumHoursPerStep: 0.45,
  scaffoldingFixed: 4500,
  liftFixed: 3500,
};

const interiorWallsCeilingsDefaultPrices = {
  studWallPerSquareMeter: 260,
  plasterWallPerSquareMeter: 220,
  osbPlasterPerSquareMeter: 320,
  wallInsulationPerSquareMeter: 120,
  plasterCeilingPerSquareMeter: 260,
  panelCeilingPerSquareMeter: 300,
  droppedCeilingPerSquareMeter: 380,
  spotlightsFixed: 1800,
  ceilingInsulationPerSquareMeter: 140,
};

const floorDefaultPrices = {
  laminatePerSquareMeter: 200,
  woodFloorPerSquareMeter: 260,
  parquetPerSquareMeter: 300,
  herringbonePerSquareMeter: 620,
  underlayPerSquareMeter: 55,
  chipboardPerSquareMeter: 180,
  levelingPerSquareMeter: 120,
  selfLevelingCompoundPerSquareMeter: 160,
  difficultSkirtingFixed: 1800,
  thresholdsFixed: 1200,
  doorPipeAdaptationFixed: 1600,
};

const windowsDoorsDefaultPrices = {
  windowReplacementPerUnit: 2400,
  smallWindowPerUnit: 1200,
  standardWindowPerUnit: 1800,
  largeWindowPerUnit: 2600,
  fixedWindowPerUnit: 1400,
  openableWindowPerUnit: 2200,
  windowTrimPerUnit: 900,
  windowAdjustmentPerUnit: 350,
  windowSillFlashingPerUnit: 650,
  windowRevealsPerUnit: 750,
  windowCasingPerUnit: 550,
  windowDraftingInsulationPerUnit: 450,
  windowCaulkingSiliconePerUnit: 300,
  windowCasingPaintingPerUnit: 500,
  interiorSingleDoorPerUnit: 1200,
  interiorDoubleDoorPerUnit: 2200,
  exteriorSingleDoorPerUnit: 2800,
  exteriorDoubleDoorPerUnit: 4800,
  patioDoorPerUnit: 3200,
  slidingDoorPerUnit: 2400,
  frameReplacementPerUnit: 1600,
  lockHandlePerUnit: 650,
  doorAdjustmentPerUnit: 450,
};

const kitchenWardrobeDefaultPrices = {
  wallCabinetPerUnit: 750,
  baseCabinetPerUnit: 900,
  tallCabinetPerUnit: 1200,
  ikeaCabinetPerUnit: 1000,
  countertopInstallationPerUnit: 1800,
  countertopAdaptationFixed: 1800,
  faucetHoleCuttingPerUnit: 600,
  sinkHoleCuttingPerUnit: 900,
  cooktopHoleCuttingPerUnit: 900,
  sinkInstallationPerUnit: 1200,
  faucetInstallationNoVvsPerUnit: 800,
  handlePerUnit: 120,
  freestandingAppliancePerUnit: 900,
  integratedDishwasherPerUnit: 1600,
  integratedFridgeFreezerPerUnit: 1900,
  builtInOvenMicrowavePerUnit: 1500,
  cooktopInstallationPerUnit: 1400,
  cooktopSealingFixed: 700,
  applianceFrontAdjustmentPerUnit: 650,
  wallOpeningAdaptationFixed: 2500,
  kitchenAdjustmentFixed: 900,
  wardrobePerUnit: 1100,
  modularWardrobeFramePerUnit: 700,
  wardrobeSlidingDoorPerUnit: 1400,
  paxBuiltInWardrobePerUnit: 2200,
  wardrobeInteriorPerUnit: 650,
  wardrobeAdaptationFixed: 1600,
  wardrobeWallAdaptationFixed: 1800,
  wardrobeCoverPanelsFixed: 900,
  siliconeCaulkingFixed: 900,
  plinthPerUnit: 350,
  fillerPiecePerUnit: 450,
  lightingPerUnit: 750,
  benchLightingInstallationFixed: 1200,
  ledStripPerMeter: 450,
  benchLightingCableAdaptationFixed: 900,
  transformerDriverPerUnit: 650,
  finishFixed: 1200,
  floorProtectionFixed: 900,
  furnitureProtectionFixed: 700,
  maskingFixed: 650,
  dustProtectionFixed: 950,
  cleaningFixed: 800,
  kitchenFanInstallationPerUnit: 1200,
  ventilationConnectionPerUnit: 950,
  ventilationPipeAdaptationFixed: 1500,
  holeCuttingFixed: 1800,
  carbonFilterFanPerUnit: 900,
  ventilationSealingFixed: 700,
};

const safetyNoticeTitle = "VVS & ELINSTALLATION INGÅR EJ";
const safetyNoticeText = "Anslutning av vatten, avlopp och fast elinstallation utförs av behörig installatör. Elektrisk anslutning utförs endast om färdigt eluttag och stickkontakt finns.";
const demolitionSafetyNoticeTitle = "SÄKERHETSINFORMATION";
const demolitionSafetyNoticeText = "Elinstallation, VVS och asbesthantering ingår ej. Vid misstanke om asbest avbryts arbetet och kund ansvarar för kontroll samt eventuell sanering av behörig firma.";

const demolitionDefaultHourlyRate = 200;

function isDemolitionCategory(category) {
  return ["Rivning", "Rivning & Bilning"].includes(category);
}

function isDemolitionOption(option) {
  return String(option.title || "").toLowerCase().includes("rivning");
}

function normalizeCalculatorOption(option) {
  if (!isDemolitionOption(option)) {
    return option;
  }

  return {
    ...option,
    pricingControl: option.pricingControl || "hourly",
    defaultHourlyRate: option.defaultHourlyRate ?? demolitionDefaultHourlyRate,
    hourlyRateLabel: option.hourlyRateLabel || "Timpris rivning",
    costType: option.costType || "work",
  };
}

function isPergolaOption(option) {
  const optionTitle = String(option.title || "").toLowerCase();

  return option.id === "pergola" || option.id === "pergolaRoof" || optionTitle.includes("pergola");
}

function isStaketOption(option) {
  return [
    "woodFence",
    "prefabFenceSections",
    "privacyScreen",
    "picketFence",
    "fenceWithGate",
    "oldFenceDemolition",
    "fencePaintingOil",
    "groundPosts",
    "concreteFoundations",
  ].includes(option.id);
}

function isAltanOption(option) {
  return [
    "deckingOnly",
    "deckRepair",
    "newFrame",
    "oldDeckDemolition",
    "simpleRailings",
    "premiumRailings",
    "deckStairs",
    "groundPrep",
    "woodTreatment",
    "complexDeck",
    "ledLighting",
    "miscCarpentry",
  ].includes(option.id);
}

function getPaintingDisplayCategory(options, isOptionActive) {
  const activeLabels = [];
  const hasPainting = options.some((option) => {
    return ["wallPainting", "ceilingPainting"].includes(option.id) && isOptionActive(option);
  });
  const hasWallpaper = options.some((option) => {
    return ["standardWallpaper", "patternWallpaper", "difficultWallpaper"].includes(option.id) && isOptionActive(option);
  });
  const hasTrimPainting = options.some((option) => {
    return option.id === "trimPainting" && isOptionActive(option);
  });
  const hasFacadePainting = options.some((option) => {
    return option.id === "facadePainting" && isOptionActive(option);
  });
  const hasStairPainting = options.some((option) => {
    return option.id === "stairPainting" && isOptionActive(option);
  });

  if (hasPainting) {
    activeLabels.push("Målning");
  }

  if (hasWallpaper) {
    activeLabels.push("Tapetsering");
  }

  if (hasTrimPainting) {
    activeLabels.push("Snickerimålning");
  }

  if (hasFacadePainting) {
    activeLabels.push("Fasadmålning");
  }

  if (hasStairPainting) {
    activeLabels.push("Trappmålning");
  }

  return activeLabels.length > 0 ? activeLabels.join(" & ") : "Målning & Tapetsering";
}

function getInteriorWallsCeilingsDisplayCategory(options, isOptionActive) {
  const wallOptionIds = ["studWall", "plasterWall", "osbPlasterWall", "wallInsulation", "wallDemolition"];
  const ceilingOptionIds = ["plasterCeiling", "panelCeiling", "droppedCeiling", "spotlights", "ceilingInsulation", "ceilingDemolition"];
  const hasWalls = options.some((option) => {
    return wallOptionIds.includes(option.id) && isOptionActive(option);
  });
  const hasCeilings = options.some((option) => {
    return ceilingOptionIds.includes(option.id) && isOptionActive(option);
  });

  if (hasWalls && hasCeilings) {
    return "Innerväggar & Innertak";
  }

  if (hasWalls) {
    return "Innerväggar";
  }

  if (hasCeilings) {
    return "Innertak";
  }

  return "Innerväggar & Innertak";
}

function getFloorDisplayCategory(options, isOptionActive) {
  const floorOptionIds = ["laminateFloor", "woodFloor", "parquetFloor", "herringboneFloor"];
  const hasFloor = options.some((option) => {
    return floorOptionIds.includes(option.id) && isOptionActive(option);
  });
  const hasHerringbone = options.some((option) => {
    return option.id === "herringboneFloor" && isOptionActive(option);
  });
  const hasParquet = options.some((option) => {
    return option.id === "parquetFloor" && isOptionActive(option);
  });
  const hasSkirting = options.some((option) => {
    return ["floorSkirting", "thresholds", "doorPipeAdaptation"].includes(option.id) && isOptionActive(option);
  });

  if (!hasFloor && hasSkirting) {
    return "Lister";
  }

  let displayName = "Golv & Lister";

  if (hasHerringbone) {
    displayName = "Fiskbensparkett";
  } else if (hasParquet) {
    displayName = "Parkettläggning";
  }

  return hasSkirting ? `${displayName} & lister` : displayName;
}

function getWindowsDoorsDisplayCategory(options, isOptionActive) {
  const windowOptionIds = [
    "windowReplacement",
    "smallWindow",
    "standardWindow",
    "largeWindow",
    "fixedWindow",
    "openableWindow",
    "windowAdjustment",
    "windowSillFlashing",
    "windowReveals",
    "windowCasing",
    "windowDraftingInsulation",
    "windowCaulkingSilicone",
    "windowFineAdjustment",
    "windowCasingPainting",
    "oldWindowDemolition",
  ];
  const doorOptionIds = [
    "interiorSingleDoor",
    "interiorDoubleDoor",
    "exteriorSingleDoor",
    "exteriorDoubleDoor",
    "patioDoor",
    "slidingDoor",
    "doorFrameReplacement",
    "doorLockHandle",
    "doorAdjustment",
    "oldDoorDemolition",
  ];
  const hasWindows = options.some((option) => {
    return windowOptionIds.includes(option.id) && isOptionActive(option);
  });
  const hasDoors = options.some((option) => {
    return doorOptionIds.includes(option.id) && isOptionActive(option);
  });

  if (hasWindows && hasDoors) {
    return "Fönster & Dörrar";
  }

  if (hasWindows) {
    return "Fönster";
  }

  if (hasDoors) {
    return "Dörrar";
  }

  return "Fönster & Dörrar";
}

function getKitchenWardrobeDisplayCategory(options, isOptionActive) {
  const kitchenOptionIds = [
    "kitchenCabinetInstallation",
    "wallCabinetInstallation",
    "baseCabinetInstallation",
    "tallCabinetInstallation",
    "ikeaCabinetAssembly",
    "countertopInstallation",
    "countertopAdaptation",
    "countertopFaucetHoleCutting",
    "countertopSinkHoleCutting",
    "countertopCooktopHoleCutting",
    "cooktopSiliconeSealing",
    "sinkInstallation",
    "faucetInstallationNoVvs",
    "kitchenHandleInstallation",
    "freestandingApplianceInstallation",
    "integratedDishwasherInstallation",
    "integratedFridgeFreezerInstallation",
    "builtInOvenMicrowaveInstallation",
    "cooktopInstallation",
    "applianceFrontAdjustment",
    "kitchenFanInstallation",
    "ventilationConnection",
    "ventilationPipeAdaptation",
    "ventilationHoleCutting",
    "carbonFilterFan",
    "ventilationAdjustmentSealing",
    "kitchenWardrobeLighting",
    "benchLightingInstallation",
    "benchLightingLedStrip",
    "benchLightingCableAdaptation",
    "benchLightingTransformerDriver",
    "oldKitchenDemolition",
    "kitchenWallOpeningAdaptation",
    "kitchenAdjustment",
  ];
  const wardrobeOptionIds = [
    "wardrobeInstallation",
    "modularWardrobeAssembly",
    "wardrobeSlidingDoor",
    "paxBuiltInWardrobe",
    "wardrobeInteriorShelves",
    "wardrobeAdaptation",
    "wardrobeWallAdaptation",
    "wardrobeCoverPanels",
    "oldWardrobeDemolition",
  ];
  const hasKitchen = options.some((option) => {
    return kitchenOptionIds.includes(option.id) && isOptionActive(option);
  });
  const hasWardrobe = options.some((option) => {
    return wardrobeOptionIds.includes(option.id) && isOptionActive(option);
  });

  if (hasKitchen && hasWardrobe) {
    return "Kök & Garderob";
  }

  if (hasKitchen) {
    return "Kök";
  }

  if (hasWardrobe) {
    return "Garderob";
  }

  return "Kök & Garderob";
}

function getBaseCategory(category) {
  if (isDemolitionCategory(category)) {
    return "Rivning & Bilning";
  }

  if (category === "Altan, Pergola & Staket") {
    return "Altan & Pergola";
  }

  if (category === "Målning & Tapetsering") {
    return "Målning & Tapeter";
  }

  if (["Väggar & Tak", "Innerväggar & Innertak"].includes(category)) {
    return "Innerväggar & Innertak";
  }

  if (["Golv", "Golv & Lister"].includes(category)) {
    return "Golv & Lister";
  }

  if (category === "Fönster & Dörrar") {
    return "Fönster & Dörrar";
  }

  if (category === "Kök & Garderob") {
    return "Kök & Garderob";
  }

  return category;
}

function getDisplayCategory(category, options, isOptionActive) {
  const baseCategory = getBaseCategory(category);

  if (baseCategory === "Målning & Tapeter") {
    return getPaintingDisplayCategory(options, isOptionActive);
  }

  if (baseCategory === "Innerväggar & Innertak") {
    return getInteriorWallsCeilingsDisplayCategory(options, isOptionActive);
  }

  if (baseCategory === "Golv & Lister") {
    return getFloorDisplayCategory(options, isOptionActive);
  }

  if (baseCategory === "Fönster & Dörrar") {
    return getWindowsDoorsDisplayCategory(options, isOptionActive);
  }

  if (baseCategory === "Kök & Garderob") {
    return getKitchenWardrobeDisplayCategory(options, isOptionActive);
  }

  if (baseCategory === "Rivning & Bilning") {
    return "Rivning & Bilning";
  }

  if (baseCategory !== "Altan & Pergola") {
    return category;
  }

  const hasActivePergolaOption = options.some((option) => {
    return isPergolaOption(option) && isOptionActive(option);
  });
  const hasActiveStaketOption = options.some((option) => {
    return isStaketOption(option) && isOptionActive(option);
  });
  const hasActiveAltanOption = options.some((option) => {
    return isAltanOption(option) && isOptionActive(option);
  });

  if (hasActiveAltanOption && hasActivePergolaOption && hasActiveStaketOption) {
    return "Altan, Pergola & Staket";
  }

  if (hasActiveAltanOption && hasActivePergolaOption) {
    return "Altan & Pergola";
  }

  if (hasActiveAltanOption && hasActiveStaketOption) {
    return "Altan & Staket";
  }

  if (hasActivePergolaOption && hasActiveStaketOption) {
    return "Pergola & Staket";
  }

  if (hasActiveStaketOption) {
    return "Staket";
  }

  if (hasActivePergolaOption) {
    return "Pergola";
  }

  return "Altan";
}

const calculatorConfigs = {
  default: {
    basePrice: (area) => area * 600,
    options: defaultCalculatorOptions,
  },
  "Rivning & Bilning": {
    basePrice: () => 0,
    usesCustomFixedCosts: true,
    sections: [
      {
        title: "Väggar & Konstruktion",
        options: [
          { id: "demolitionInteriorWall", title: "Rivning av innervägg", pricingControl: "work" },
          { id: "demolitionLoadBearingWall", title: "Rivning av bärande vägg", pricingControl: "work" },
          { id: "demolitionBrickWall", title: "Rivning av tegelvägg", pricingControl: "work" },
          { id: "demolitionConcreteWall", title: "Rivning av betongvägg", pricingControl: "work" },
          { id: "demolitionMasonry", title: "Rivning av mur", pricingControl: "work" },
        ],
      },
      {
        title: "Betong & Bilning",
        options: [
          { id: "concreteFloorChiseling", title: "Bilning av betonggolv", pricingControl: "work" },
          { id: "drainChiseling", title: "Bilning för avlopp", pricingControl: "work" },
          { id: "electricalPipeChiseling", title: "Bilning för el / rör", pricingControl: "work" },
          { id: "concreteHoleCutting", title: "Håltagning i betong", pricingControl: "work" },
          { id: "coreDrilling", title: "Kärnborrning", pricingControl: "work" },
          { id: "doorHoleCutting", title: "Håltagning för dörr", pricingControl: "work" },
          { id: "windowHoleCutting", title: "Håltagning för fönster", pricingControl: "work" },
          { id: "loadBearingOpeningAdaptation", title: "Anpassning av bärande öppning", pricingControl: "work" },
        ],
      },
      {
        title: "Golv & Ytskikt",
        options: [
          { id: "demolitionParquet", title: "Rivning av parkett", pricingControl: "work" },
          { id: "demolitionLaminateFloor", title: "Rivning av laminatgolv", pricingControl: "work" },
          { id: "demolitionVinylFloor", title: "Rivning av plastmatta", pricingControl: "work" },
          { id: "demolitionTiles", title: "Rivning av klinker", pricingControl: "work" },
          { id: "removalGlueMortar", title: "Borttagning av lim / fix", pricingControl: "work" },
        ],
      },
      {
        title: "Tak & Innertak",
        options: [
          { id: "demolitionCeiling", title: "Rivning av innertak", pricingControl: "work" },
          { id: "suspendedCeilingRemoval", title: "Demontering av undertak", pricingControl: "work" },
        ],
      },
      {
        title: "Takrivning",
        options: [
          { id: "roofTileDemolition", title: "Rivning av takpannor", pricingControl: "work" },
          { id: "metalRoofDemolition", title: "Rivning av plåttak", pricingControl: "work" },
          { id: "feltRoofDemolition", title: "Rivning av papptak", pricingControl: "work" },
          { id: "roofDeckingDemolition", title: "Rivning av råspont", pricingControl: "work" },
          { id: "roofBattenDemolition", title: "Rivning av takläkt", pricingControl: "work" },
        ],
      },
      {
        title: "Transport & Avfall",
        options: [
          { id: "demolitionWasteRemoval", title: "Bortforsling", pricingControl: "work", defaultHourlyRate: 250 },
          { id: "wasteSorting", title: "Sortering av avfall", pricingControl: "work", defaultHourlyRate: 250 },
          { id: "demolitionTrailer", title: "Släpvagn", pricingControl: "work", costType: "fixed", defaultHourlyRate: 250, excludeFromWorkHours: true },
          { id: "container", title: "Container", pricingControl: "work", costType: "fixed", defaultHourlyRate: 250, excludeFromWorkHours: true },
          { id: "heavyLifting", title: "Tunga lyft", pricingControl: "work", defaultHourlyRate: 250 },
        ],
      },
      {
        title: "Skydd & Säkerhet",
        options: [
          { id: "protectivePaper", title: "Skyddspapp", pricingControl: "work", defaultHourlyRate: 250 },
          { id: "plasticDustWall", title: "Plastskydd / dammvägg", pricingControl: "work", defaultHourlyRate: 250 },
          { id: "postDemolitionCleaning", title: "Städning efter rivning", pricingControl: "work", defaultHourlyRate: 250 },
        ],
      },
    ],
  },
  "Konstruktion": {
    basePrice: () => 0,
    usesCustomFixedCosts: true,
    sections: [
      {
        title: "Balkar & Bärande Konstruktion",
        options: [
          {
            id: "glulamBeamInstallation",
            title: "Montering av limträbalk",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "steelBeamInstallation",
            title: "Montering av stålbalk",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "loadBearingStructureReinforcement",
            title: "Förstärkning av bärande konstruktion",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "temporaryPropping",
            title: "Tillfällig stämpning",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
        ],
      },
      {
        title: "Bjälklag & Förstärkning",
        options: [
          {
            id: "joistReinforcement",
            title: "Förstärkning av bjälklag",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "floorStructureReinforcement",
            title: "Förstärkning av golvkonstruktion",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "structuralAdjustment",
            title: "Justering av konstruktion",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
        ],
      },
      {
        title: "Tak Konstruktion",
        options: [
          {
            id: "roofStructureReinforcement",
            title: "Förstärkning av takkonstruktion",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "loadBearingRoofWork",
            title: "Bärande takarbete",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
        ],
      },
      {
        title: "Extra",
        options: [
          {
            id: "structuralHeavyLifting",
            title: "Tunga lyft",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "structuralExtraStaffing",
            title: "Extra bemanning",
            pricingControl: "hourly",
            defaultHourlyRate: 250,
          },
          {
            id: "structuralMaterialHandling",
            title: "Materialhantering",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "structuralTrailerTransport",
            title: "Släpvagn / transport",
            pricingControl: "work",
            costType: "fixed",
            defaultHourlyRate: 250,
            excludeFromWorkHours: true,
          },
        ],
      },
    ],
  },
  "Tillbyggnad & Utebyggnader": {
    basePrice: () => 0,
    usesCustomFixedCosts: true,
    sections: [
      {
        title: "Tillbyggnad",
        options: [
          {
            id: "houseExtension",
            title: "Tillbyggnad av hus",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "entranceExtension",
            title: "Utbyggnad av entré",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "roomExtension",
            title: "Förlängning av rum",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
        ],
      },
      {
        title: "Garage",
        options: [
          {
            id: "garageAssembly",
            title: "Montering av garage",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "garageInsulation",
            title: "Isolering av garage",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "garageInteriorBuild",
            title: "Invändig garagebyggnation",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
        ],
      },
      {
        title: "Attefallshus",
        options: [
          {
            id: "attefallHouseAssembly",
            title: "Montering av attefallshus",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "attefallInteriorCompletion",
            title: "Invändig färdigställning",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "attefallInsulation",
            title: "Isolering",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "attefallFloorInteriorWalls",
            title: "Golv / innerväggar",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
        ],
      },
      {
        title: "Utebyggnader",
        options: [
          {
            id: "storageBuilding",
            title: "Förråd",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "toolShed",
            title: "Redskapsbod",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "carport",
            title: "Carport",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
        ],
      },
      {
        title: "Grund & Betong",
        options: [
          {
            id: "concreteSlab",
            title: "Betongplatta",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "concreteSlabPreparation",
            title: "Förberedelse för betongplatta",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "reinforcement",
            title: "Armering",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "formwork",
            title: "Formarbete",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "slabInsulation",
            title: "Isolering under platta",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "groundPreparationExtension",
            title: "Markförberedelse",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "postFoundation",
            title: "Plintgrund",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "groundAdjustmentExtension",
            title: "Justering av mark",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
        ],
      },
      {
        title: "Extra",
        options: [
          {
            id: "drawingsAvailable",
            title: "Ritningar finns",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "customerMaterialExtension",
            title: "Material från kund",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "craneLiftExtension",
            title: "Kran / lyft",
            pricingControl: "work",
            costType: "fixed",
            defaultHourlyRate: 250,
            excludeFromWorkHours: true,
          },
          {
            id: "extensionExtraStaffing",
            title: "Extra bemanning",
            pricingControl: "hourly",
            defaultHourlyRate: 250,
          },
          {
            id: "extensionWasteRemoval",
            title: "Bortforsling",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
        ],
      },
    ],
  },
  "Fasad & Utvändig Renovering": {
    basePrice: () => 0,
    usesCustomFixedCosts: true,
    sections: [
      {
        title: "Panel & Underkonstruktion",
        options: [
          {
            id: "facadePanelInstallation",
            title: "Montering av fasadpanel",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "facadePanelReplacement",
            title: "Byte av fasadpanel",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "coverBoardPanel",
            title: "Lockpanel",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "facadeBattens",
            title: "Läkt",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "sparseBattens",
            title: "Glespanel / glesläkt",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "windProtectionInstallation",
            title: "Montering av vindskydd",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
        ],
      },
      {
        title: "Isolering",
        options: [
          {
            id: "additionalFacadeInsulation",
            title: "Tilläggsisolering",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "externalInsulation",
            title: "Utvändig isolering",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
        ],
      },
      {
        title: "Fönsterdetaljer Utvändigt",
        options: [
          {
            id: "externalTrimInstallation",
            title: "Montering av utvändigt foder",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "externalRevealsInstallation",
            title: "Montering av utvändiga smygar",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "externalWindowSillInstallation",
            title: "Montering av fönsterbleck",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
        ],
      },
      {
        title: "Takfot & Fasaddetaljer",
        options: [
          {
            id: "bargeboardInstallation",
            title: "Montering av vindskivor",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "cornerBoardInstallation",
            title: "Montering av knutbrädor",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "eavesInstallation",
            title: "Montering av takfot",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
        ],
      },
      {
        title: "Höjd & Säkerhet",
        options: [
          {
            id: "scaffoldingFacade",
            title: "Ställning",
            pricingControl: "work",
            costType: "fixed",
            defaultHourlyRate: 250,
            excludeFromWorkHours: true,
          },
          {
            id: "skyliftFacade",
            title: "Skylift",
            pricingControl: "work",
            costType: "fixed",
            defaultHourlyRate: 250,
            excludeFromWorkHours: true,
          },
          {
            id: "highAltitudeWork",
            title: "Arbete på hög höjd",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "facadeSafetyProtection",
            title: "Säkring / skydd",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
        ],
      },
      {
        title: "Transport & Extra",
        options: [
          {
            id: "facadeWasteRemoval",
            title: "Bortforsling",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "facadeMaterialHandling",
            title: "Materialhantering",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "facadeExtraStaffing",
            title: "Extra bemanning",
            pricingControl: "hourly",
            defaultHourlyRate: 250,
          },
          {
            id: "groundProtectionFacade",
            title: "Skydd av mark",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
        ],
      },
    ],
  },
  "Tak & Yttertak": {
    basePrice: () => 0,
    usesCustomFixedCosts: true,
    sections: [
      {
        title: "Tak Konstruktion",
        options: [
          {
            id: "roofTrussInstallation",
            title: "Montering av takstolar",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "roofDeckingInstallation",
            title: "Montering av råspont",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "airGapInstallation",
            title: "Montering av luftspalt",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "roofStructureReinforcementOuter",
            title: "Förstärkning av takkonstruktion",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
        ],
      },
      {
        title: "Takläggning",
        options: [
          {
            id: "roofTileInstallation",
            title: "Montering av takpannor",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "metalRoofInstallation",
            title: "Montering av plåttak",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "feltRoofInstallation",
            title: "Montering av papptak",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
        ],
      },
      {
        title: "Underlag & Isolering",
        options: [
          {
            id: "roofUnderlayFelt",
            title: "Underlagspapp",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "roofWindProtection",
            title: "Montering av vindskydd",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "roofInsulation",
            title: "Takisolering",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "roofBattens",
            title: "Läkt",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
        ],
      },
      {
        title: "Takdetaljer",
        options: [
          {
            id: "roofBargeboardInstallation",
            title: "Montering av vindskivor",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "roofEavesInstallation",
            title: "Montering av takfot",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "ridgeInstallation",
            title: "Montering av nock",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "roofLadderInstallation",
            title: "Montering av takstege",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "snowGuardInstallation",
            title: "Montering av snörasskydd",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
        ],
      },
      {
        title: "Avvattning",
        options: [
          {
            id: "gutterInstallation",
            title: "Montering av hängrännor",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "downpipeInstallation",
            title: "Montering av stuprör",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "drainageAdjustment",
            title: "Justering av avvattning",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
        ],
      },
      {
        title: "Reparation",
        options: [
          {
            id: "roofRepair",
            title: "Takreparation",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "damagedPartsReplacement",
            title: "Byte av skadade delar",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "roofSealing",
            title: "Tätning av tak",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
        ],
      },
      {
        title: "Säkerhet & Höjd",
        options: [
          {
            id: "roofScaffolding",
            title: "Ställning",
            pricingControl: "work",
            costType: "fixed",
            defaultHourlyRate: 250,
            excludeFromWorkHours: true,
          },
          {
            id: "roofSkylift",
            title: "Skylift",
            pricingControl: "work",
            costType: "fixed",
            defaultHourlyRate: 250,
            excludeFromWorkHours: true,
          },
          {
            id: "roofHighAltitudeWork",
            title: "Arbete på hög höjd",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
        ],
      },
      {
        title: "Extra",
        options: [
          {
            id: "roofMaterialHandling",
            title: "Materialhantering",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "roofWasteRemoval",
            title: "Bortforsling",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "roofExtraStaffing",
            title: "Extra bemanning",
            pricingControl: "hourly",
            defaultHourlyRate: 250,
          },
        ],
      },
    ],
  },
  "Service & Småjobb": {
    basePrice: () => 0,
    usesCustomFixedCosts: true,
    sections: [
      {
        title: "Montering",
        options: [
          {
            id: "shelfInstallation",
            title: "Montering av hyllor",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "curtainRailInstallation",
            title: "Montering av gardinskenor",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "tvMountInstallation",
            title: "Montering av TV-fäste",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "showerCabinInstallation",
            title: "Montering av duschkabin",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "mirrorInstallation",
            title: "Montering av spegel",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "furnitureAssembly",
            title: "Montering av möbler",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
        ],
      },
      {
        title: "Justering & Reparation",
        options: [
          {
            id: "doorAdjustmentService",
            title: "Justering av dörrar",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "cabinetAdjustmentService",
            title: "Justering av skåp",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "hardwareReplacement",
            title: "Byte av beslag",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "minorDamageRepair",
            title: "Reparation av mindre skador",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
        ],
      },
      {
        title: "Tätning & Finish",
        options: [
          {
            id: "siliconeWork",
            title: "Silikonarbete",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "groutingService",
            title: "Fogning",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "minorFinishWork",
            title: "Mindre finisharbete",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
        ],
      },
      {
        title: "Specialjobb",
        options: [
          {
            id: "specialAdaptation",
            title: "Specialanpassning",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "customerRequestInstallation",
            title: "Montering enligt kundönskemål",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
          {
            id: "miscSmallCarpentry",
            title: "Diverse snickeriarbeten",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
        ],
      },
    ],
  },
  "Målning & Tapeter": {
    basePrice: () => 0,
    usesCustomFixedCosts: true,
    sections: [
      {
        title: "Förarbete",
        options: [
          {
            id: "paintingSpackling",
            title: "Spackling av ytor",
            pricingControl: "work",
            areaControl: "surface",
            defaultFastPrice: (area) => area * paintingDefaultPrices.spacklingPerSquareMeter,
          },
          {
            id: "paintingSanding",
            title: "Slipning av ytor",
            pricingControl: "work",
            areaControl: "surface",
            defaultFastPrice: (area) => area * paintingDefaultPrices.sandingPerSquareMeter,
          },
          {
            id: "paintingPrimer",
            title: "Grundmålning av ytor",
            pricingControl: "work",
            areaControl: "surface",
            defaultFastPrice: (area) => area * paintingDefaultPrices.primerPerSquareMeter,
          },
          {
            id: "paintingMasking",
            title: "Maskering inför målning",
            pricingControl: "work",
            areaControl: "surface",
            defaultFastPrice: (area) => area * paintingDefaultPrices.maskingPerSquareMeter,
          },
          {
            id: "oldWallpaperRemoval",
            title: "Rivning av gammal tapet",
          },
        ],
      },
      {
        title: "Målning",
        options: [
          {
            id: "wallPainting",
            title: "Målning av väggar",
            defaultActive: true,
            pricingControl: "work",
            areaControl: "surface",
            defaultFastPrice: (area) => area * paintingDefaultPrices.wallPaintingPerSquareMeter,
          },
          {
            id: "ceilingPainting",
            title: "Målning av tak",
            pricingControl: "work",
            areaControl: "surface",
            defaultFastPrice: (area) => area * paintingDefaultPrices.ceilingPaintingPerSquareMeter,
          },
          {
            id: "trimPainting",
            title: "Målning av snickerier",
            pricingControl: "hourly",
            costType: "work",
          },
          {
            id: "stairPainting",
            title: "Målning av trappa",
            pricingControl: "steps",
            costType: "work",
            defaultStepPrice: () => paintingDefaultPrices.stairPaintingStandardPerStep,
            standardStepPrice: paintingDefaultPrices.stairPaintingStandardPerStep,
            premiumStepPrice: paintingDefaultPrices.stairPaintingPremiumPerStep,
            standardHoursPerStep: paintingDefaultPrices.stairPaintingStandardHoursPerStep,
            premiumHoursPerStep: paintingDefaultPrices.stairPaintingPremiumHoursPerStep,
          },
          {
            id: "facadePainting",
            title: "Målning av fasad",
            pricingControl: "work",
            areaControl: "facade",
            defaultFastPrice: (area) => area * paintingDefaultPrices.facadePaintingPerSquareMeter,
            defaultEstimatedHours: (area) => Math.max(1, Math.round(area / 12)),
          },
          {
            id: "facadeWash",
            title: "Tvätt av fasad",
            pricingControl: "work",
            areaControl: "facade",
            defaultFastPrice: (area) => area * paintingDefaultPrices.facadeWashPerSquareMeter,
            defaultEstimatedHours: (area) => Math.max(1, Math.round(area / 25)),
          },
          {
            id: "facadeScraping",
            title: "Skrapning av fasad",
            pricingControl: "work",
            areaControl: "facade",
            defaultFastPrice: (area) => area * paintingDefaultPrices.scrapingPerSquareMeter,
            defaultEstimatedHours: (area) => Math.max(1, Math.round(area / 10)),
          },
          {
            id: "facadePrimer",
            title: "Grundmålning av fasad",
            pricingControl: "work",
            areaControl: "facade",
            defaultFastPrice: (area) => area * paintingDefaultPrices.facadePrimerPerSquareMeter,
            defaultEstimatedHours: (area) => Math.max(1, Math.round(area / 16)),
          },
        ],
      },
      {
        title: "Tapetsering",
        options: [
          {
            id: "standardWallpaper",
            title: "Tapetsering med standardtapet",
            pricingControl: "work",
            areaControl: "surface",
            defaultFastPrice: (area) => area * paintingDefaultPrices.standardWallpaperPerSquareMeter,
          },
          {
            id: "patternWallpaper",
            title: "Tapetsering med mönsterpassning",
            pricingControl: "work",
            areaControl: "surface",
            defaultFastPrice: (area) => area * paintingDefaultPrices.patternWallpaperPerSquareMeter,
          },
          {
            id: "difficultWallpaper",
            title: "Tapetsering med svår tapet",
            pricingControl: "work",
            areaControl: "surface",
            defaultFastPrice: (area) => area * paintingDefaultPrices.difficultWallpaperPerSquareMeter,
          },
        ],
      },
      {
        title: "Färgtyp & Svårighetsgrad",
        options: [
          {
            id: "whiteLightColor",
            title: "Målning med ljus färg",
            defaultActive: true,
            price: () => 0,
          },
          {
            id: "normalColor",
            title: "Målning med standardfärg",
            price: () => 0,
          },
          {
            id: "darkColor",
            title: "Målning med mörk färg",
            pricingControl: "work",
            areaControl: "surface",
            defaultFastPrice: (area) => area * paintingDefaultPrices.darkColorPerSquareMeter,
            defaultEstimatedHours: (area) => Math.max(1, Math.round(area / 20)),
          },
          {
            id: "multipleColors",
            title: "Målning med flera färger",
            pricingControl: "work",
            areaControl: "surface",
            defaultFastPrice: (area) => area * paintingDefaultPrices.multipleColorsPerSquareMeter,
            defaultEstimatedHours: (area) => Math.max(1, Math.round(area / 15)),
          },
          {
            id: "accentWall",
            title: "Målning av accentvägg",
            pricingControl: "work",
            defaultFastPrice: () => paintingDefaultPrices.accentWallFixed,
            defaultEstimatedHours: () => 2,
          },
        ],
      },
      {
        title: "Skydd & förberedelse",
        options: [
          {
            id: "kitchenWardrobeFloorProtection",
            title: "Täckning av golv med skyddspapp",
            pricingControl: "work",
            defaultFastPrice: () => kitchenWardrobeDefaultPrices.floorProtectionFixed,
            defaultHourlyRate: 250,
            defaultEstimatedHours: () => 2,
          },
          {
            id: "kitchenWardrobeFurnitureProtection",
            title: "Täckning av möbler med plast / folie",
            pricingControl: "work",
            defaultFastPrice: () => kitchenWardrobeDefaultPrices.furnitureProtectionFixed,
            defaultHourlyRate: 250,
            defaultEstimatedHours: () => 1.5,
          },
          {
            id: "kitchenWardrobeDustProtection",
            title: "Montering av dammskydd / avgränsning",
            pricingControl: "work",
            defaultFastPrice: () => kitchenWardrobeDefaultPrices.dustProtectionFixed,
            defaultHourlyRate: 250,
            defaultEstimatedHours: () => 2,
          },
          {
            id: "kitchenWardrobeCleaning",
            title: "Städning efter arbete",
            pricingControl: "work",
            defaultFastPrice: () => kitchenWardrobeDefaultPrices.cleaningFixed,
            defaultHourlyRate: 250,
            defaultEstimatedHours: () => 2,
          },
        ],
      },
      {
        title: "Extra",
        options: [
          {
            id: "furnitureProtection",
            title: "Skydd av möbler",
            pricingControl: "work",
            defaultFastPrice: () => paintingDefaultPrices.furnitureProtectionFixed,
          },
          {
            id: "paintingMaterialPurchase",
            title: "Materialinköp",
            pricingControl: "hourly",
            costType: "work",
          },
          {
            id: "paintingMaterialHandling",
            title: "Materialhantering",
            pricingControl: "hourly",
            costType: "work",
          },
          {
            id: "paintingWasteRemoval",
            title: "Bortforsling av avfall",
            pricingControl: "hourly",
            costType: "work",
          },
          {
            id: "paintingMiscWork",
            title: "Övrigt arbete",
            pricingControl: "hourly",
            costType: "work",
          },
        ],
      },
      {
        title: "Extra kostnader",
        options: [
          {
            id: "scaffolding",
            title: "Hyra av ställning",
            pricingControl: "fixed",
            costType: "fixed",
            defaultFastPrice: () => paintingDefaultPrices.scaffoldingFixed,
          },
          {
            id: "lift",
            title: "Hyra av lift",
            pricingControl: "fixed",
            costType: "fixed",
            defaultFastPrice: () => paintingDefaultPrices.liftFixed,
          },
        ],
      },
    ],
  },
  "Fönster & Dörrar": {
    basePrice: () => 0,
    usesCustomFixedCosts: true,
    sections: [
      {
        title: "Fönster",
        options: [
          {
            id: "windowReplacement",
            title: "Byte av fönster",
            pricingControl: "work",
            quantityControl: true,
            defaultUnitPrice: () => windowsDoorsDefaultPrices.windowReplacementPerUnit,
            defaultHourlyRate: 250,
          },
          {
            id: "smallWindow",
            title: "Montering av litet fönster",
            pricingControl: "work",
            quantityControl: true,
            defaultUnitPrice: () => windowsDoorsDefaultPrices.smallWindowPerUnit,
            defaultHourlyRate: 250,
          },
          {
            id: "standardWindow",
            title: "Montering av standardfönster",
            pricingControl: "work",
            quantityControl: true,
            defaultUnitPrice: () => windowsDoorsDefaultPrices.standardWindowPerUnit,
            defaultHourlyRate: 250,
          },
          {
            id: "largeWindow",
            title: "Montering av stort fönster",
            pricingControl: "work",
            quantityControl: true,
            defaultUnitPrice: () => windowsDoorsDefaultPrices.largeWindowPerUnit,
            defaultHourlyRate: 250,
          },
          {
            id: "fixedWindow",
            title: "Montering av fast fönster",
            pricingControl: "work",
            quantityControl: true,
            defaultUnitPrice: () => windowsDoorsDefaultPrices.fixedWindowPerUnit,
            defaultHourlyRate: 250,
          },
          {
            id: "openableWindow",
            title: "Montering av öppningsbart fönster",
            pricingControl: "work",
            quantityControl: true,
            defaultUnitPrice: () => windowsDoorsDefaultPrices.openableWindowPerUnit,
            defaultHourlyRate: 250,
          },
          {
            id: "windowAdjustment",
            title: "Justering av fönster",
            pricingControl: "work",
            quantityControl: true,
            defaultUnitPrice: () => windowsDoorsDefaultPrices.windowAdjustmentPerUnit,
            defaultHourlyRate: 250,
          },
          {
            id: "oldWindowDemolition",
            title: "Rivning av gamla fönster",
            quantityControl: true,
            costType: "work",
          },
          {
            id: "openingAdaptationWindows",
            title: "Anpassning av öppning för fönster",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
        ],
      },
      {
        title: "Dörrar",
        options: [
          {
            id: "interiorSingleDoor",
            title: "Montering av enkel innerdörr",
            pricingControl: "work",
            quantityControl: true,
            defaultUnitPrice: () => windowsDoorsDefaultPrices.interiorSingleDoorPerUnit,
            defaultHourlyRate: 250,
          },
          {
            id: "interiorDoubleDoor",
            title: "Montering av dubbel innerdörr",
            pricingControl: "work",
            quantityControl: true,
            defaultUnitPrice: () => windowsDoorsDefaultPrices.interiorDoubleDoorPerUnit,
            defaultHourlyRate: 250,
          },
          {
            id: "exteriorSingleDoor",
            title: "Montering av enkel ytterdörr",
            pricingControl: "work",
            quantityControl: true,
            defaultUnitPrice: () => windowsDoorsDefaultPrices.exteriorSingleDoorPerUnit,
            defaultHourlyRate: 250,
          },
          {
            id: "exteriorDoubleDoor",
            title: "Montering av dubbel ytterdörr",
            pricingControl: "work",
            quantityControl: true,
            defaultUnitPrice: () => windowsDoorsDefaultPrices.exteriorDoubleDoorPerUnit,
            defaultHourlyRate: 250,
          },
          {
            id: "patioDoor",
            title: "Montering av altandörr",
            pricingControl: "work",
            quantityControl: true,
            defaultUnitPrice: () => windowsDoorsDefaultPrices.patioDoorPerUnit,
            defaultHourlyRate: 250,
          },
          {
            id: "slidingDoor",
            title: "Montering av skjutdörr",
            pricingControl: "work",
            quantityControl: true,
            defaultUnitPrice: () => windowsDoorsDefaultPrices.slidingDoorPerUnit,
            defaultHourlyRate: 250,
          },
          {
            id: "doorFrameReplacement",
            title: "Byte av dörrkarm",
            pricingControl: "work",
            quantityControl: true,
            defaultUnitPrice: () => windowsDoorsDefaultPrices.frameReplacementPerUnit,
            defaultHourlyRate: 250,
          },
          {
            id: "doorLockHandle",
            title: "Montering av lås / handtag",
            pricingControl: "work",
            quantityControl: true,
            defaultUnitPrice: () => windowsDoorsDefaultPrices.lockHandlePerUnit,
            defaultHourlyRate: 250,
          },
          {
            id: "doorAdjustment",
            title: "Justering av dörr",
            pricingControl: "work",
            quantityControl: true,
            defaultUnitPrice: () => windowsDoorsDefaultPrices.doorAdjustmentPerUnit,
            defaultHourlyRate: 250,
          },
          {
            id: "oldDoorDemolition",
            title: "Rivning av gamla dörrar",
            quantityControl: true,
            costType: "work",
          },
          {
            id: "openingAdaptationDoors",
            title: "Anpassning av öppning för dörr",
            pricingControl: "work",
            defaultHourlyRate: 250,
          },
        ],
      },
      {
        title: "Fönster - Komplettering",
        options: [
          {
            id: "windowSillFlashing",
            title: "Montering av fönsterbleck",
            pricingControl: "work",
            quantityControl: true,
            defaultUnitPrice: () => windowsDoorsDefaultPrices.windowSillFlashingPerUnit,
            defaultHourlyRate: 250,
          },
          {
            id: "windowReveals",
            title: "Montering av smygar",
            pricingControl: "work",
            quantityControl: true,
            defaultUnitPrice: () => windowsDoorsDefaultPrices.windowRevealsPerUnit,
            defaultHourlyRate: 250,
          },
          {
            id: "windowCasing",
            title: "Montering av foder",
            pricingControl: "work",
            quantityControl: true,
            defaultUnitPrice: () => windowsDoorsDefaultPrices.windowCasingPerUnit,
            defaultHourlyRate: 250,
          },
          {
            id: "windowDraftingInsulation",
            title: "Drevning / isolering av fönster",
            pricingControl: "work",
            quantityControl: true,
            defaultUnitPrice: () => windowsDoorsDefaultPrices.windowDraftingInsulationPerUnit,
            defaultHourlyRate: 250,
          },
          {
            id: "windowCaulkingSilicone",
            title: "Fogning / silikon runt fönster",
            pricingControl: "work",
            quantityControl: true,
            defaultUnitPrice: () => windowsDoorsDefaultPrices.windowCaulkingSiliconePerUnit,
            defaultHourlyRate: 250,
          },
          {
            id: "windowFineAdjustment",
            title: "Justering av fönster",
            pricingControl: "work",
            quantityControl: true,
            defaultUnitPrice: () => windowsDoorsDefaultPrices.windowAdjustmentPerUnit,
            defaultHourlyRate: 250,
          },
          {
            id: "windowCasingPainting",
            title: "Målning av foder / smygar",
            pricingControl: "work",
            quantityControl: true,
            defaultUnitPrice: () => windowsDoorsDefaultPrices.windowCasingPaintingPerUnit,
            defaultHourlyRate: 250,
          },
        ],
      },
      {
        title: "Extra",
        options: [
          {
            id: "windowsDoorsMaterialPurchase",
            title: "Materialinköp",
            pricingControl: "hourly",
            costType: "work",
          },
          {
            id: "windowsDoorsMaterialHandling",
            title: "Materialhantering",
            pricingControl: "hourly",
            costType: "work",
          },
          {
            id: "windowsDoorsWasteRemoval",
            title: "Bortforsling av avfall",
            pricingControl: "hourly",
            costType: "work",
          },
          {
            id: "windowsDoorsOtherWork",
            title: "Övrigt arbete",
            pricingControl: "hourly",
            costType: "work",
          },
        ],
      },
    ],
  },
  "Kök & Garderob": {
    basePrice: () => 0,
    usesCustomFixedCosts: true,
    sections: [
      {
        title: "Kök",
        options: [
          {
            id: "wallCabinetInstallation",
            title: "Montering av väggskåp",
            pricingControl: "work",
            quantityControl: true,
            quantityLabel: "Antal skåp",
            unitPriceLabel: "Pris per skåp",
            defaultUnitPrice: () => kitchenWardrobeDefaultPrices.wallCabinetPerUnit,
            defaultHourlyRate: 250,
          },
          {
            id: "baseCabinetInstallation",
            title: "Montering av bänkskåp",
            pricingControl: "work",
            quantityControl: true,
            quantityLabel: "Antal skåp",
            unitPriceLabel: "Pris per skåp",
            defaultUnitPrice: () => kitchenWardrobeDefaultPrices.baseCabinetPerUnit,
            defaultHourlyRate: 250,
          },
          {
            id: "tallCabinetInstallation",
            title: "Montering av högskåp",
            pricingControl: "work",
            quantityControl: true,
            quantityLabel: "Antal skåp",
            unitPriceLabel: "Pris per skåp",
            defaultUnitPrice: () => kitchenWardrobeDefaultPrices.tallCabinetPerUnit,
            defaultHourlyRate: 250,
          },
          {
            id: "ikeaCabinetAssembly",
            title: "Montering / ihopskruvning av IKEA-skåp",
            pricingControl: "work",
            quantityControl: true,
            quantityLabel: "Antal skåp",
            unitPriceLabel: "Pris per skåp",
            defaultUnitPrice: () => kitchenWardrobeDefaultPrices.ikeaCabinetPerUnit,
            defaultHourlyRate: 250,
          },
          {
            id: "countertopInstallation",
            title: "Montering av bänkskiva",
            pricingControl: "work",
            quantityControl: true,
            defaultUnitPrice: () => kitchenWardrobeDefaultPrices.countertopInstallationPerUnit,
            defaultHourlyRate: 250,
          },
          {
            id: "countertopAdaptation",
            title: "Anpassning av bänkskiva",
            pricingControl: "work",
            defaultFastPrice: () => kitchenWardrobeDefaultPrices.countertopAdaptationFixed,
            defaultHourlyRate: 250,
            defaultEstimatedHours: () => 3,
            elNotice: true,
          },
          {
            id: "countertopFaucetHoleCutting",
            title: "Håltagning i bänkskiva för blandare",
            pricingControl: "work",
            quantityControl: true,
            defaultUnitPrice: () => kitchenWardrobeDefaultPrices.faucetHoleCuttingPerUnit,
            defaultHourlyRate: 250,
            vvsNotice: true,
          },
          {
            id: "countertopSinkHoleCutting",
            title: "Håltagning i bänkskiva för diskho",
            pricingControl: "work",
            quantityControl: true,
            defaultUnitPrice: () => kitchenWardrobeDefaultPrices.sinkHoleCuttingPerUnit,
            defaultHourlyRate: 250,
            vvsNotice: true,
          },
          {
            id: "countertopCooktopHoleCutting",
            title: "Håltagning i bänkskiva för spishäll",
            pricingControl: "work",
            quantityControl: true,
            defaultUnitPrice: () => kitchenWardrobeDefaultPrices.cooktopHoleCuttingPerUnit,
            defaultHourlyRate: 250,
            elNotice: true,
          },
          {
            id: "cooktopSiliconeSealing",
            title: "Silikon / tätning runt spishäll",
            pricingControl: "work",
            defaultFastPrice: () => kitchenWardrobeDefaultPrices.cooktopSealingFixed,
            defaultHourlyRate: 250,
            defaultEstimatedHours: () => 1,
            elNotice: true,
          },
          {
            id: "sinkInstallation",
            title: "Montering av diskho",
            pricingControl: "work",
            quantityControl: true,
            defaultUnitPrice: () => kitchenWardrobeDefaultPrices.sinkInstallationPerUnit,
            defaultHourlyRate: 250,
            vvsNotice: true,
          },
          {
            id: "faucetInstallationNoVvs",
            title: "Montering av blandare utan VVS-anslutning",
            pricingControl: "work",
            quantityControl: true,
            defaultUnitPrice: () => kitchenWardrobeDefaultPrices.faucetInstallationNoVvsPerUnit,
            defaultHourlyRate: 250,
            vvsNotice: true,
          },
          {
            id: "kitchenHandleInstallation",
            title: "Montering av handtag",
            pricingControl: "work",
            quantityControl: true,
            defaultUnitPrice: () => kitchenWardrobeDefaultPrices.handlePerUnit,
            defaultHourlyRate: 250,
          },
          {
            id: "oldKitchenDemolition",
            title: "Rivning av gammalt kök",
            costType: "work",
          },
          {
            id: "kitchenWallOpeningAdaptation",
            title: "Anpassning av vägg / öppning i kök",
            pricingControl: "work",
            defaultFastPrice: () => kitchenWardrobeDefaultPrices.wallOpeningAdaptationFixed,
            defaultHourlyRate: 250,
            defaultEstimatedHours: () => 5,
          },
          {
            id: "kitchenAdjustment",
            title: "Justering av kök",
            pricingControl: "work",
            defaultFastPrice: () => kitchenWardrobeDefaultPrices.kitchenAdjustmentFixed,
            defaultHourlyRate: 250,
            defaultEstimatedHours: () => 2,
          },
        ],
      },
      {
        title: "Vitvaror",
        options: [
          {
            id: "freestandingApplianceInstallation",
            title: "Montering av fristående vitvara",
            pricingControl: "work",
            quantityControl: true,
            defaultUnitPrice: () => kitchenWardrobeDefaultPrices.freestandingAppliancePerUnit,
            defaultHourlyRate: 250,
          },
          {
            id: "integratedDishwasherInstallation",
            title: "Montering av integrerad diskmaskin",
            pricingControl: "work",
            quantityControl: true,
            defaultUnitPrice: () => kitchenWardrobeDefaultPrices.integratedDishwasherPerUnit,
            defaultHourlyRate: 250,
            vvsNotice: true,
          },
          {
            id: "integratedFridgeFreezerInstallation",
            title: "Montering av integrerad kyl / frys",
            pricingControl: "work",
            quantityControl: true,
            defaultUnitPrice: () => kitchenWardrobeDefaultPrices.integratedFridgeFreezerPerUnit,
            defaultHourlyRate: 250,
          },
          {
            id: "builtInOvenMicrowaveInstallation",
            title: "Montering av inbyggd ugn / mikro",
            pricingControl: "work",
            quantityControl: true,
            defaultUnitPrice: () => kitchenWardrobeDefaultPrices.builtInOvenMicrowavePerUnit,
            defaultHourlyRate: 250,
          },
          {
            id: "cooktopInstallation",
            title: "Montering av spishäll",
            pricingControl: "work",
            quantityControl: true,
            defaultUnitPrice: () => kitchenWardrobeDefaultPrices.cooktopInstallationPerUnit,
            defaultHourlyRate: 250,
            elNotice: true,
          },
          {
            id: "applianceFrontAdjustment",
            title: "Justering av luckor / fronter",
            pricingControl: "work",
            quantityControl: true,
            defaultUnitPrice: () => kitchenWardrobeDefaultPrices.applianceFrontAdjustmentPerUnit,
            defaultHourlyRate: 250,
          },
        ],
      },
      {
        title: "Fläkt / Ventilation",
        options: [
          {
            id: "kitchenFanInstallation",
            title: "Montering av köksfläkt",
            pricingControl: "work",
            quantityControl: true,
            defaultUnitPrice: () => kitchenWardrobeDefaultPrices.kitchenFanInstallationPerUnit,
            defaultHourlyRate: 250,
          },
          {
            id: "ventilationConnection",
            title: "Anslutning till ventilation",
            pricingControl: "work",
            quantityControl: true,
            defaultUnitPrice: () => kitchenWardrobeDefaultPrices.ventilationConnectionPerUnit,
            defaultHourlyRate: 250,
          },
          {
            id: "ventilationPipeAdaptation",
            title: "Anpassning av ventilationsrör",
            pricingControl: "work",
            defaultFastPrice: () => kitchenWardrobeDefaultPrices.ventilationPipeAdaptationFixed,
            defaultHourlyRate: 250,
            defaultEstimatedHours: () => 3,
          },
          {
            id: "ventilationHoleCutting",
            title: "Håltagning för ventilation",
            pricingControl: "work",
            defaultFastPrice: () => kitchenWardrobeDefaultPrices.holeCuttingFixed,
            defaultHourlyRate: 250,
            defaultEstimatedHours: () => 4,
          },
          {
            id: "carbonFilterFan",
            title: "Montering av kolfilterfläkt",
            pricingControl: "work",
            quantityControl: true,
            defaultUnitPrice: () => kitchenWardrobeDefaultPrices.carbonFilterFanPerUnit,
            defaultHourlyRate: 250,
          },
          {
            id: "ventilationAdjustmentSealing",
            title: "Justering / tätning av ventilation",
            pricingControl: "work",
            defaultFastPrice: () => kitchenWardrobeDefaultPrices.ventilationSealingFixed,
            defaultHourlyRate: 250,
            defaultEstimatedHours: () => 2,
          },
        ],
      },
      {
        title: "Garderob",
        options: [
          {
            id: "wardrobeInstallation",
            title: "Montering av garderob",
            pricingControl: "work",
            quantityControl: true,
            defaultUnitPrice: () => kitchenWardrobeDefaultPrices.wardrobePerUnit,
            defaultHourlyRate: 250,
          },
          {
            id: "modularWardrobeAssembly",
            title: "Montering / ihopskruvning av garderob",
            pricingControl: "work",
            quantityControl: true,
            quantityLabel: "Antal stommar",
            unitPriceLabel: "Pris per stomme",
            defaultUnitPrice: () => kitchenWardrobeDefaultPrices.modularWardrobeFramePerUnit,
            defaultHourlyRate: 250,
          },
          {
            id: "wardrobeSlidingDoor",
            title: "Montering av skjutdörrar",
            pricingControl: "work",
            defaultFastPrice: () => kitchenWardrobeDefaultPrices.wardrobeSlidingDoorPerUnit,
            defaultHourlyRate: 250,
            defaultEstimatedHours: () => 3,
          },
          {
            id: "paxBuiltInWardrobe",
            title: "Montering av PAX / platsbyggd garderob",
            pricingControl: "work",
            quantityControl: true,
            defaultUnitPrice: () => kitchenWardrobeDefaultPrices.paxBuiltInWardrobePerUnit,
            defaultHourlyRate: 250,
          },
          {
            id: "wardrobeInteriorShelves",
            title: "Montering av inredning / hyllor / lådor",
            pricingControl: "work",
            defaultFastPrice: () => kitchenWardrobeDefaultPrices.wardrobeInteriorPerUnit,
            defaultHourlyRate: 250,
            defaultEstimatedHours: () => 2,
          },
          {
            id: "wardrobeAdaptation",
            title: "Anpassning av garderob",
            pricingControl: "work",
            defaultFastPrice: () => kitchenWardrobeDefaultPrices.wardrobeAdaptationFixed,
            defaultHourlyRate: 250,
            defaultEstimatedHours: () => 3,
          },
          {
            id: "wardrobeWallAdaptation",
            title: "Anpassning mot vägg / tak / golv",
            pricingControl: "work",
            defaultFastPrice: () => kitchenWardrobeDefaultPrices.wardrobeWallAdaptationFixed,
            defaultHourlyRate: 250,
            defaultEstimatedHours: () => 4,
          },
          {
            id: "wardrobeCoverPanels",
            title: "Montering av passbitar / täcksidor",
            pricingControl: "work",
            defaultFastPrice: () => kitchenWardrobeDefaultPrices.wardrobeCoverPanelsFixed,
            defaultHourlyRate: 250,
            defaultEstimatedHours: () => 2,
          },
          {
            id: "oldWardrobeDemolition",
            title: "Rivning av gammal garderob",
            costType: "work",
          },
        ],
      },
      {
        title: "Komplettering",
        options: [
          {
            id: "kitchenWardrobeSilicone",
            title: "Silikon / fogning i kök eller garderob",
            pricingControl: "work",
            defaultFastPrice: () => kitchenWardrobeDefaultPrices.siliconeCaulkingFixed,
            defaultHourlyRate: 250,
            defaultEstimatedHours: () => 2,
          },
          {
            id: "kitchenWardrobePlinths",
            title: "Montering av socklar",
            pricingControl: "work",
            quantityControl: true,
            defaultUnitPrice: () => kitchenWardrobeDefaultPrices.plinthPerUnit,
            defaultHourlyRate: 250,
          },
          {
            id: "kitchenWardrobeFillers",
            title: "Montering av passbitar",
            pricingControl: "work",
            quantityControl: true,
            defaultUnitPrice: () => kitchenWardrobeDefaultPrices.fillerPiecePerUnit,
            defaultHourlyRate: 250,
          },
          {
            id: "kitchenWardrobeLighting",
            title: "Montering av belysning",
            pricingControl: "work",
            quantityControl: true,
            defaultUnitPrice: () => kitchenWardrobeDefaultPrices.lightingPerUnit,
            defaultHourlyRate: 250,
          },
          {
            id: "benchLightingInstallation",
            title: "Montering av bänkbelysning",
            pricingControl: "work",
            quantityControl: true,
            defaultUnitPrice: () => kitchenWardrobeDefaultPrices.benchLightingInstallationFixed,
            defaultHourlyRate: 250,
            elNotice: true,
          },
          {
            id: "benchLightingLedStrip",
            title: "Montering av LED-list under skåp",
            pricingControl: "work",
            lengthControl: true,
            defaultMeterPrice: () => kitchenWardrobeDefaultPrices.ledStripPerMeter,
            defaultHourlyRate: 250,
            elNotice: true,
          },
          {
            id: "benchLightingCableAdaptation",
            title: "Anpassning / kabeldragning för bänkbelysning",
            pricingControl: "work",
            defaultFastPrice: () => kitchenWardrobeDefaultPrices.benchLightingCableAdaptationFixed,
            defaultHourlyRate: 250,
            defaultEstimatedHours: () => 2,
            elNotice: true,
          },
          {
            id: "benchLightingTransformerDriver",
            title: "Montering av transformator / driver",
            pricingControl: "work",
            quantityControl: true,
            defaultUnitPrice: () => kitchenWardrobeDefaultPrices.transformerDriverPerUnit,
            defaultHourlyRate: 250,
            elNotice: true,
          },
          {
            id: "kitchenWardrobeFinish",
            title: "Målning / finish",
            pricingControl: "work",
            defaultFastPrice: () => kitchenWardrobeDefaultPrices.finishFixed,
            defaultHourlyRate: 250,
            defaultEstimatedHours: () => 3,
          },
        ],
      },
      {
        title: "Extra",
        options: [
          {
            id: "kitchenWardrobeMaterialPurchase",
            title: "Materialinköp",
            pricingControl: "hourly",
            costType: "work",
          },
          {
            id: "kitchenWardrobeMaterialHandling",
            title: "Materialhantering",
            pricingControl: "hourly",
            costType: "work",
          },
          {
            id: "kitchenWardrobeWasteRemoval",
            title: "Bortforsling av avfall",
            pricingControl: "hourly",
            costType: "work",
          },
          {
            id: "kitchenWardrobeOtherWork",
            title: "Övrigt arbete",
            pricingControl: "hourly",
            costType: "work",
          },
        ],
      },
    ],
  },
  "Innerväggar & Innertak": {
    basePrice: () => 0,
    usesCustomFixedCosts: true,
    sections: [
      {
        title: "Väggar",
        options: [
          {
            id: "studWall",
            title: "Byggnation av regelvägg",
            pricingControl: "work",
            areaControl: "surface",
            defaultFastPrice: (area) => area * interiorWallsCeilingsDefaultPrices.studWallPerSquareMeter,
            defaultEstimatedHours: (area) => Math.max(1, Math.round(area / 8)),
          },
          {
            id: "plasterWall",
            title: "Montering av gipsvägg",
            pricingControl: "work",
            areaControl: "surface",
            defaultFastPrice: (area) => area * interiorWallsCeilingsDefaultPrices.plasterWallPerSquareMeter,
            defaultEstimatedHours: (area) => Math.max(1, Math.round(area / 10)),
          },
          {
            id: "osbPlasterWall",
            title: "Montering av OSB + gips",
            pricingControl: "work",
            areaControl: "surface",
            defaultFastPrice: (area) => area * interiorWallsCeilingsDefaultPrices.osbPlasterPerSquareMeter,
            defaultEstimatedHours: (area) => Math.max(1, Math.round(area / 7)),
          },
          {
            id: "wallInsulation",
            title: "Montering av isolering i vägg",
            pricingControl: "work",
            areaControl: "surface",
            defaultFastPrice: (area) => area * interiorWallsCeilingsDefaultPrices.wallInsulationPerSquareMeter,
            defaultEstimatedHours: (area) => Math.max(1, Math.round(area / 14)),
          },
          {
            id: "wallDemolition",
            title: "Rivning av vägg",
            areaControl: "surface",
          },
        ],
      },
      {
        title: "Innertak",
        options: [
          {
            id: "plasterCeiling",
            title: "Montering av gipstak",
            pricingControl: "work",
            areaControl: "surface",
            defaultFastPrice: (area) => area * interiorWallsCeilingsDefaultPrices.plasterCeilingPerSquareMeter,
            defaultEstimatedHours: (area) => Math.max(1, Math.round(area / 8)),
          },
          {
            id: "panelCeiling",
            title: "Montering av paneltak",
            pricingControl: "work",
            areaControl: "surface",
            defaultFastPrice: (area) => area * interiorWallsCeilingsDefaultPrices.panelCeilingPerSquareMeter,
            defaultEstimatedHours: (area) => Math.max(1, Math.round(area / 7)),
          },
          {
            id: "droppedCeiling",
            title: "Montering av sänkt tak",
            pricingControl: "work",
            areaControl: "surface",
            defaultFastPrice: (area) => area * interiorWallsCeilingsDefaultPrices.droppedCeilingPerSquareMeter,
            defaultEstimatedHours: (area) => Math.max(1, Math.round(area / 6)),
          },
          {
            id: "spotlights",
            title: "Montering av spotlights",
            pricingControl: "work",
            defaultFastPrice: () => interiorWallsCeilingsDefaultPrices.spotlightsFixed,
            defaultEstimatedHours: () => 4,
          },
          {
            id: "ceilingInsulation",
            title: "Montering av isolering i tak",
            pricingControl: "work",
            areaControl: "surface",
            defaultFastPrice: (area) => area * interiorWallsCeilingsDefaultPrices.ceilingInsulationPerSquareMeter,
            defaultEstimatedHours: (area) => Math.max(1, Math.round(area / 12)),
          },
          {
            id: "ceilingDemolition",
            title: "Rivning av gammalt tak",
            areaControl: "surface",
          },
        ],
      },
      {
        title: "Extra",
        options: [
          {
            id: "interiorMaterialPurchase",
            title: "Materialinköp",
            pricingControl: "hourly",
            costType: "work",
          },
          {
            id: "interiorMaterialHandling",
            title: "Materialhantering",
            pricingControl: "hourly",
            costType: "work",
          },
          {
            id: "interiorWasteRemoval",
            title: "Bortforsling av avfall",
            pricingControl: "hourly",
            costType: "work",
          },
          {
            id: "interiorMiscWork",
            title: "Övrigt arbete",
            pricingControl: "hourly",
            costType: "work",
          },
        ],
      },
    ],
  },
  "Golv & Lister": {
    basePrice: () => 0,
    usesCustomFixedCosts: true,
    sections: [
      {
        title: "Golvläggning",
        options: [
          {
            id: "laminateFloor",
            title: "Läggning av klickgolv / laminat inkl. montering av lätta golvlister",
            defaultActive: true,
            pricingControl: "work",
            areaControl: "surface",
            defaultFastPrice: (area) => area * floorDefaultPrices.laminatePerSquareMeter,
            defaultEstimatedHours: (area) => Math.max(1, Math.round(area / 12)),
          },
          {
            id: "woodFloor",
            title: "Läggning av trägolv",
            pricingControl: "work",
            areaControl: "surface",
            defaultFastPrice: (area) => area * floorDefaultPrices.woodFloorPerSquareMeter,
            defaultEstimatedHours: (area) => Math.max(1, Math.round(area / 10)),
          },
          {
            id: "parquetFloor",
            title: "Läggning av parkett",
            pricingControl: "work",
            areaControl: "surface",
            defaultFastPrice: (area) => area * floorDefaultPrices.parquetPerSquareMeter,
            defaultEstimatedHours: (area) => Math.max(1, Math.round(area / 9)),
          },
          {
            id: "herringboneFloor",
            title: "Läggning av fiskben / avancerat mönster",
            pricingControl: "work",
            areaControl: "surface",
            defaultFastPrice: (area) => area * floorDefaultPrices.herringbonePerSquareMeter,
            defaultEstimatedHours: (area) => Math.max(1, Math.round(area / 5)),
          },
        ],
      },
      {
        title: "Förarbete",
        options: [
          {
            id: "removeOldFloor",
            title: "Rivning av gammalt golv",
            areaControl: "surface",
          },
          {
            id: "floorUnderlay",
            title: "Montering av underlag / foam / lumppapp",
            pricingControl: "work",
            areaControl: "surface",
            defaultFastPrice: (area) => area * floorDefaultPrices.underlayPerSquareMeter,
            defaultEstimatedHours: (area) => Math.max(1, Math.round(area / 20)),
          },
          {
            id: "chipboardFloor",
            title: "Montering av spånskiva",
            pricingControl: "work",
            areaControl: "surface",
            defaultFastPrice: (area) => area * floorDefaultPrices.chipboardPerSquareMeter,
            defaultEstimatedHours: (area) => Math.max(1, Math.round(area / 10)),
          },
          {
            id: "floorLeveling",
            title: "Nivellering / riktning av golv",
            pricingControl: "work",
            areaControl: "surface",
            defaultFastPrice: (area) => area * floorDefaultPrices.levelingPerSquareMeter,
            defaultEstimatedHours: (area) => Math.max(1, Math.round(area / 12)),
          },
          {
            id: "selfLevelingCompound",
            title: "Flytspackling av golv",
            pricingControl: "work",
            areaControl: "surface",
            defaultFastPrice: (area) => area * floorDefaultPrices.selfLevelingCompoundPerSquareMeter,
            defaultEstimatedHours: (area) => Math.max(1, Math.round(area / 12)),
          },
        ],
      },
      {
        title: "Lister",
        options: [
          {
            id: "floorSkirting",
            title: "Montering av svåra golvlister / många kapningar",
            pricingControl: "work",
            defaultFastPrice: () => floorDefaultPrices.difficultSkirtingFixed,
            defaultEstimatedHours: () => 4,
          },
          {
            id: "thresholds",
            title: "Montering av trösklar",
            pricingControl: "work",
            defaultFastPrice: () => floorDefaultPrices.thresholdsFixed,
            defaultEstimatedHours: () => 2,
          },
          {
            id: "doorPipeAdaptation",
            title: "Anpassning runt dörrar / rör",
            pricingControl: "work",
            defaultFastPrice: () => floorDefaultPrices.doorPipeAdaptationFixed,
            defaultEstimatedHours: () => 3,
          },
        ],
      },
      {
        title: "Extra",
        options: [
          {
            id: "floorMaterialPurchase",
            title: "Materialinköp",
            pricingControl: "hourly",
            costType: "work",
          },
          {
            id: "floorMaterialHandling",
            title: "Materialhantering",
            pricingControl: "hourly",
            costType: "work",
          },
          {
            id: "floorWasteRemoval",
            title: "Bortforsling av avfall",
            pricingControl: "hourly",
            costType: "work",
          },
          {
            id: "floorMiscWork",
            title: "Övrigt arbete",
            pricingControl: "hourly",
            costType: "work",
          },
        ],
      },
    ],
  },
  "Altan & Pergola": {
    basePrice: () => 0,
    usesCustomFixedCosts: true,
    sections: [
      {
        title: "Konstruktion",
        options: [
          {
            id: "deckingOnly",
            title: "Byte av trall",
            defaultActive: true,
            excludes: ["newFrame"],
            pricingControl: "work",
            defaultFastPrice: (area) => area * altanPergolaDefaultPrices.deckingOnlyPerSquareMeter,
          },
          {
            id: "deckRepair",
            title: "Reparation av altan",
            pricingControl: "work",
            defaultFastPrice: (area) => area * altanPergolaDefaultPrices.repairPerSquareMeter,
          },
          {
            id: "newFrame",
            title: "Byggnation av ny stomme",
            excludes: ["deckingOnly"],
            pricingControl: "work",
            defaultFastPrice: (area) => area * altanPergolaDefaultPrices.newFramePerSquareMeter,
          },
          {
            id: "oldDeckDemolition",
            title: "Rivning av gammal altan / trall",
            costType: "work",
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
            title: "Montering av enkla räcken",
            pricingControl: "work",
            defaultFastPrice: (area) => area * altanPergolaDefaultPrices.simpleRailingsPerSquareMeter,
          },
          {
            id: "premiumRailings",
            title: "Montering av premiumräcken",
            pricingControl: "work",
            defaultFastPrice: (area) => area * altanPergolaDefaultPrices.premiumRailingsPerSquareMeter,
          },
        ],
      },
      {
        title: "Tillägg",
        options: [
          {
            id: "pergolaRoof",
            title: "Montering av pergolatak",
            price: ({ area, active }) => (active ? area * 350 : 0),
          },
          {
            id: "deckStairs",
            title: "Montering av enkel trappa",
            pricingControl: "work",
            defaultFastPrice: () => altanPergolaDefaultPrices.simpleStairsFixed,
          },
          {
            id: "groundPrep",
            title: "Markförberedelse för altan",
            price: ({ area, active }) => (active ? area * 180 : 0),
          },
          {
            id: "woodTreatment",
            title: "Olja och träskyddsbehandling",
            price: ({ area, active }) => (active ? area * 90 : 0),
          },
          {
            id: "complexDeck",
            title: "Byggnation av komplicerad altan",
            price: ({ area, active }) => (active ? area * 300 : 0),
          },
          {
            id: "ledLighting",
            title: "Montering av LED-belysning",
            pricingControl: "hourly",
            costType: "work",
          },
          {
            id: "miscCarpentry",
            title: "Övrigt / diverse snickeriarbete",
            pricingControl: "hourly",
            costType: "work",
          },
        ],
      },
      {
        title: "Staket & Räcken",
        options: [
          {
            id: "woodFence",
            title: "Byggnation av platsbyggt trästaket",
            pricingControl: "work",
            lengthControl: true,
            defaultMeterPrice: () => altanPergolaDefaultPrices.woodFencePerMeter,
            defaultHourlyRate: 250,
          },
          {
            id: "prefabFenceSections",
            title: "Montering av färdiga staketsektioner",
            pricingControl: "work",
            lengthControl: true,
            defaultMeterPrice: () => altanPergolaDefaultPrices.prefabFenceSectionsPerMeter,
            defaultHourlyRate: 250,
          },
          {
            id: "privacyScreen",
            title: "Montering av insynsskydd",
            pricingControl: "work",
            lengthControl: true,
            defaultMeterPrice: () => altanPergolaDefaultPrices.privacyScreenPerMeter,
            defaultHourlyRate: 250,
          },
          {
            id: "picketFence",
            title: "Montering av spjälstaket",
            pricingControl: "work",
            lengthControl: true,
            defaultMeterPrice: () => altanPergolaDefaultPrices.picketFencePerMeter,
            defaultHourlyRate: 250,
          },
          {
            id: "fenceWithGate",
            title: "Montering av staket med grind",
            pricingControl: "work",
            lengthControl: true,
            defaultMeterPrice: () => altanPergolaDefaultPrices.fenceWithGatePerMeter,
            defaultHourlyRate: 250,
          },
          {
            id: "oldFenceDemolition",
            title: "Rivning av gammalt staket",
            lengthControl: true,
            costType: "work",
          },
          {
            id: "fencePaintingOil",
            title: "Målning / olja av staket",
            pricingControl: "work",
            lengthControl: true,
            defaultMeterPrice: () => altanPergolaDefaultPrices.fencePaintingOilPerMeter,
            defaultHourlyRate: 250,
          },
          {
            id: "groundPosts",
            title: "Montering av stolpar i mark",
            pricingControl: "work",
            lengthControl: true,
            defaultMeterPrice: () => altanPergolaDefaultPrices.groundPostsPerMeter,
            defaultHourlyRate: 250,
          },
          {
            id: "concreteFoundations",
            title: "Montering av betongplint",
            pricingControl: "work",
            lengthControl: true,
            defaultMeterPrice: () => altanPergolaDefaultPrices.concreteFoundationPerMeter,
            defaultHourlyRate: 250,
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

function buildInitialCalculatorState(offer, initialCustomer) {
  const formState = offer?.formState || {};
  const selectedOptionsFromSummary = (offer?.options || []).reduce((options, option) => ({
    ...options,
    [option.id]: true,
  }), {});
  const fixedCostsFromSummary = (offer?.options || []).reduce((costs, option) => {
    if (fixedCostOptions.some((fixedCost) => fixedCost.id === option.id)) {
      return {
        ...costs,
        [option.id]: true,
      };
    }

    return costs;
  }, {});

  return {
    area: formState.area ?? offer?.area ?? 25,
    areaMode: formState.areaMode ?? offer?.areaMode ?? "manual",
    deckDimensions: formState.deckDimensions ?? offer?.deckDimensions ?? {
      length: "",
      width: "",
    },
    selectedOptions: formState.selectedOptions ?? selectedOptionsFromSummary,
    customer: formState.customer ?? offer?.customer ?? initialCustomer ?? {
      name: "",
      phone: "",
      email: "",
      address: "",
      notes: "",
    },
    extraWork: formState.extraWork ?? {
      hours: offer?.extraWork?.hours ?? 0,
      hourlyRate: offer?.extraWork?.hourlyRate ?? 250,
    },
    temporaryExtraStaff: formState.temporaryExtraStaff ?? {
      active: offer?.temporaryExtraStaff?.active ?? false,
      people: offer?.temporaryExtraStaff?.people ?? 1,
      hours: offer?.temporaryExtraStaff?.hours ?? 0,
      internalHourlyRate: offer?.temporaryExtraStaff?.internalHourlyRate ?? 200,
      customerHourlyRate: offer?.temporaryExtraStaff?.customerHourlyRate ?? 250,
    },
    peopleCount: formState.peopleCount ?? offer?.peopleCount ?? 2,
    availability: formState.availability ?? offer?.schedule?.availability ?? {
      weekdayEveningHours: 4,
      weekdayEveningsPerWeek: 5,
      weekendDayHours: 8,
      weekendDaysPerWeek: 2,
    },
    startDate: formState.startDate ?? offer?.schedule?.startDate ?? "",
    fixedCosts: formState.fixedCosts ?? fixedCostsFromSummary,
    extraCosts: formState.extraCosts ?? (offer?.extraCosts || []).map((cost) => ({
      id: cost.id || crypto.randomUUID(),
      name: cost.name || "",
      description: cost.description || "",
      price: cost.price ?? cost.priceValue ?? 0,
    })),
    optionPricing: formState.optionPricing ?? {},
    optionMeasurements: formState.optionMeasurements ?? {},
    discount: formState.discount ?? {
      active: offer?.discount?.active ?? false,
      percent: offer?.discount?.percent ?? 0,
    },
    selectedPriceVariant: formState.selectedPriceVariant ?? offer?.prices?.selectedVariant ?? "normal",
  };
}

function CategoryCalculator({ category, initialOffer, initialCustomer, goBack, onSaveOffer, appSettings }) {
  const { language, t } = useI18n();
  const initialState = buildInitialCalculatorState(initialOffer, initialCustomer);

  const [area, setArea] = useState(initialState.area);
  const [areaMode, setAreaMode] = useState(initialState.areaMode);
  const [deckDimensions, setDeckDimensions] = useState(initialState.deckDimensions);
  const [selectedOptions, setSelectedOptions] = useState(initialState.selectedOptions);
  const [customer, setCustomer] = useState(initialState.customer);
  const [extraWork, setExtraWork] = useState(initialOffer ? initialState.extraWork : {
    ...initialState.extraWork,
    hourlyRate: appSettings.standardHourlyRate,
  });
  const [temporaryExtraStaff, setTemporaryExtraStaff] = useState(initialState.temporaryExtraStaff);
  const [peopleCount, setPeopleCount] = useState(initialOffer ? initialState.peopleCount : appSettings.standardPeopleCount);
  const [availability, setAvailability] = useState(initialState.availability);
  const [startDate, setStartDate] = useState(initialState.startDate);
  const [fixedCosts, setFixedCosts] = useState(initialState.fixedCosts);
  const [extraCosts, setExtraCosts] = useState(initialState.extraCosts);
  const [optionPricing, setOptionPricing] = useState(initialState.optionPricing);
  const [optionMeasurements, setOptionMeasurements] = useState(initialState.optionMeasurements);
  const [discount, setDiscount] = useState(initialState.discount);
  const [selectedPriceVariant, setSelectedPriceVariant] = useState(initialState.selectedPriceVariant);
  const [projectStatus, setProjectStatus] = useState(initialOffer?.projectStatus || "Ny förfrågan");
  const [privateNotes, setPrivateNotes] = useState(initialOffer?.privateNotes || "");
  const [customerTags, setCustomerTags] = useState(initialOffer?.customerTags || []);
  const [projectPhotos, setProjectPhotos] = useState(initialOffer?.projectPhotos || []);

  const baseCategory = getBaseCategory(category);
  const calculatorConfig = calculatorConfigs[baseCategory] || calculatorConfigs.default;
  const usesDimensionArea = baseCategory === "Altan & Pergola";
  const usesGlobalArea = !["Målning & Tapeter", "Innerväggar & Innertak", "Golv & Lister", "Fönster & Dörrar", "Kök & Garderob", "Rivning & Bilning", "Konstruktion", "Tillbyggnad & Utebyggnader", "Fasad & Utvändig Renovering", "Tak & Yttertak", "Service & Småjobb"].includes(baseCategory);
  const calculatorSections = (calculatorConfig.sections || [
    {
      options: calculatorConfig.options,
    },
  ]).map((section) => ({
    ...section,
    options: section.options.map(normalizeCalculatorOption),
  }));
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
  const displayCategory = getDisplayCategory(category, calculatorOptions, getOptionActive);

  const updateDeckDimension = (field, value) => {
    const nextDimensions = {
      ...deckDimensions,
      [field]: value,
    };
    const length = Math.max(0, Number(nextDimensions.length) || 0);
    const width = Math.max(0, Number(nextDimensions.width) || 0);

    setDeckDimensions(nextDimensions);
    setArea(Math.round(length * width * 10) / 10);
  };

  const getOptionMeasurement = (option) => {
    const measurement = optionMeasurements[option.id] || {};

    return {
      mode: measurement.mode || "manual",
      area: measurement.area ?? 0,
      length: measurement.length ?? "",
      height: measurement.height ?? "",
    };
  };

  const getOptionArea = (option) => {
    if (!option.areaControl) {
      return area;
    }

    const measurement = getOptionMeasurement(option);

    return Math.max(0, Number(measurement.area) || 0);
  };

  const updateOptionMeasurement = (optionId, values) => {
    setOptionMeasurements((currentMeasurements) => {
      const nextMeasurement = {
        mode: "manual",
        area: 0,
        length: "",
        height: "",
        ...(currentMeasurements[optionId] || {}),
        ...values,
      };

      if (nextMeasurement.mode === "dimensions" || values.length !== undefined || values.height !== undefined) {
        const length = Math.max(0, Number(nextMeasurement.length) || 0);
        const height = Math.max(0, Number(nextMeasurement.height) || 0);

        nextMeasurement.area = Math.round(length * height * 10) / 10;
      }

      return {
        ...currentMeasurements,
        [optionId]: nextMeasurement,
      };
    });
  };

  const getOptionPricing = (option) => {
    const pricing = optionPricing[option.id] || {};
    const pricingArea = getOptionArea(option);
    const stepTier = pricing.stepTier || "standard";
    const defaultStepPrice = stepTier === "premium"
      ? option.premiumStepPrice
      : option.defaultStepPrice?.();

    return {
      mode: pricing.mode || (option.pricingControl === "hourly" ? "hourly" : option.lengthControl ? "meter" : option.quantityControl ? "unit" : "fast"),
      fastPrice: pricing.fastPrice ?? option.defaultFastPrice?.(pricingArea) ?? 0,
      meterPrice: pricing.meterPrice ?? option.defaultMeterPrice?.(pricingArea) ?? 0,
      quantity: pricing.quantity ?? 0,
      unitPrice: pricing.unitPrice ?? option.defaultUnitPrice?.(pricingArea) ?? 0,
      stepTier,
      steps: pricing.steps ?? 0,
      stepPrice: pricing.stepPrice ?? defaultStepPrice ?? 0,
      estimatedHours: pricing.estimatedHours ?? option.defaultEstimatedHours?.(pricingArea) ?? 0,
      hours: pricing.hours ?? 0,
      hourlyRate: pricing.hourlyRate ?? option.defaultHourlyRate ?? 250,
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

  const addExtraCost = () => {
    setExtraCosts((currentCosts) => [
      ...currentCosts,
      {
        id: crypto.randomUUID(),
        name: "",
        description: "",
        price: 0,
      },
    ]);
  };

  const updateExtraCost = (costId, values) => {
    setExtraCosts((currentCosts) => currentCosts.map((cost) => (
      cost.id === costId ? { ...cost, ...values } : cost
    )));
  };

  const removeExtraCost = (costId) => {
    setExtraCosts((currentCosts) => currentCosts.filter((cost) => cost.id !== costId));
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

    if (option.pricingControl === "steps") {
      return Math.max(0, Number(pricing.steps) || 0) * Math.max(0, Number(pricing.stepPrice) || 0);
    }

    if (pricing.mode === "hourly" || option.pricingControl === "hourly") {
      return Math.max(0, Number(pricing.hours) || 0) * Math.max(0, Number(pricing.hourlyRate) || 0) * normalizedPeopleCount;
    }

    if (pricing.mode === "meter" && option.lengthControl) {
      const measurement = getOptionMeasurement(option);

      return Math.max(0, Number(measurement.length) || 0) * Math.max(0, Number(pricing.meterPrice) || 0);
    }

    if (pricing.mode === "unit" && option.quantityControl) {
      return Math.max(0, Number(pricing.quantity) || 0) * Math.max(0, Number(pricing.unitPrice) || 0);
    }

    return Math.max(0, Number(pricing.fastPrice) || 0);
  };

  const calculateOptionHours = (option, active) => {
    if (!active || !option.pricingControl || option.excludeFromWorkHours) {
      return 0;
    }

    const pricing = getOptionPricing(option);

    if (option.pricingControl === "steps") {
      const hoursPerStep = pricing.stepTier === "premium"
        ? option.premiumHoursPerStep
        : option.standardHoursPerStep;

      return Math.max(0, Number(pricing.steps) || 0) * Math.max(0, Number(hoursPerStep) || 0);
    }

    if (pricing.mode === "hourly" || option.pricingControl === "hourly") {
      return Math.max(0, Number(pricing.hours) || 0);
    }

    return Math.max(0, Number(pricing.estimatedHours) || 0);
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
  const extraWorkHours = Math.max(0, Number(extraWork.hours) || 0);
  const temporaryExtraStaffPeople = Math.max(0, Number(temporaryExtraStaff.people) || 0);
  const temporaryExtraStaffHours = Math.max(0, Number(temporaryExtraStaff.hours) || 0);
  const temporaryExtraStaffCustomerRate = Math.max(0, Number(temporaryExtraStaff.customerHourlyRate) || 0);
  const temporaryExtraStaffInternalRate = Math.max(0, Number(temporaryExtraStaff.internalHourlyRate) || 0);
  const temporaryExtraStaffWorkHours = temporaryExtraStaff.active ? temporaryExtraStaffHours : 0;
  const temporaryExtraStaffCost = temporaryExtraStaff.active ? temporaryExtraStaffPeople * temporaryExtraStaffHours * temporaryExtraStaffCustomerRate : 0;
  const temporaryExtraStaffInternalCost = temporaryExtraStaff.active ? temporaryExtraStaffPeople * temporaryExtraStaffHours * temporaryExtraStaffInternalRate : 0;
  const temporaryExtraStaffMargin = temporaryExtraStaffCost - temporaryExtraStaffInternalCost;

  workPrice += extraWorkCost;
  workPrice += temporaryExtraStaffCost;

  const optionWorkHours = calculatorOptions.reduce((totalHours, option) => {
    return totalHours + calculateOptionHours(option, getOptionActive(option));
  }, 0);
  const totalWorkHours = optionWorkHours + extraWorkHours + temporaryExtraStaffWorkHours;
  const activeHourlyRates = [
    ...calculatorOptions
      .filter((option) => getOptionActive(option))
      .map((option) => {
        const pricing = getOptionPricing(option);

        return (pricing.mode === "hourly" || option.pricingControl === "hourly")
          ? Math.max(0, Number(pricing.hourlyRate) || 0)
          : 0;
      }),
    extraWorkHours > 0 ? Math.max(0, Number(extraWork.hourlyRate) || 0) : 0,
    temporaryExtraStaffCost > 0 ? temporaryExtraStaffCustomerRate : 0,
  ].filter((rate) => rate > 0);
  const uniqueHourlyRates = [...new Set(activeHourlyRates)];
  const hourlyRateSummary = uniqueHourlyRates.length === 0
    ? "Inte angivet"
    : uniqueHourlyRates.length === 1
      ? `${formatPrice(uniqueHourlyRates[0])}/h`
      : `${formatPrice(Math.min(...uniqueHourlyRates))}/h - ${formatPrice(Math.max(...uniqueHourlyRates))}/h`;
  const weeklyAvailableHours = calculateWeeklyAvailableHours(availability);
  const scheduledCalendarDays = calculateScheduledCalendarDays(startDate, totalWorkHours, availability);
  const estimatedCalendarTime = scheduledCalendarDays > 0
    ? formatEstimatedCalendarDays(scheduledCalendarDays)
    : formatEstimatedCalendarTime(totalWorkHours, weeklyAvailableHours);
  const estimatedEndDate = calculateEstimatedEndDate(startDate, totalWorkHours, availability);
  const estimatedEndDateDisplay = calculateEstimatedEndDate(startDate, totalWorkHours, availability, language);

  const selectedFixedCostDetails = (calculatorConfig.usesCustomFixedCosts ? [] : fixedCostOptions)
    .filter((option) => fixedCosts[option.id] && option.price > 0)
    .map((option) => ({
      id: option.id,
      title: option.title,
      sectionTitle: "Fasta kostnader",
      priceValue: option.price,
    }));

  const extraCostDetails = extraCosts
    .map((cost) => ({
      ...cost,
      name: cost.name.trim(),
      description: cost.description.trim(),
      priceValue: Math.max(0, Number(cost.price) || 0),
    }))
    .filter((cost) => cost.name || cost.description || cost.priceValue > 0);

  const extraCostsTotal = extraCostDetails.reduce((total, cost) => {
    return total + cost.priceValue;
  }, 0);

  const fixedCostsDisplayTotal = selectedFixedCostDetails.reduce((total, option) => {
    return total + option.priceValue;
  }, customFixedCostsTotal);
  const fixedCostsTotal = fixedCostsDisplayTotal + extraCostsTotal;
  const hasFixedCosts = fixedCostsDisplayTotal > 0;

  const discountPercent = discount.active ? Math.max(0, Math.min(100, Number(discount.percent) || 0)) : 0;
  const discountAmount = Math.round(workPrice * (discountPercent / 100));
  const discountedWorkPrice = Math.max(0, workPrice - discountAmount);
  const normalPrice = Math.round(discountedWorkPrice + fixedCostsTotal);

  const selectedOptionDetails = [
    ...calculatorOptions
    .filter((option) => getOptionActive(option))
    .map((option) => ({
      ...option,
      title: formatOptionTitle(option.title),
      priceValue: calculateOptionPrice(option, true),
      hoursValue: calculateOptionHours(option, true),
      costType: option.costType || "work",
      vvsNotice: option.vvsNotice || false,
      elNotice: option.elNotice || false,
      detailText: option.pricingControl === "steps"
        ? `Antal steg: ${getOptionPricing(option).steps}`
        : (getOptionPricing(option).mode === "hourly" || option.pricingControl === "hourly")
          ? `Tid på plats: ${formatHours(getOptionPricing(option).hours)} · Timpris per person: ${formatPrice(getOptionPricing(option).hourlyRate)}/h`
          : option.lengthControl
            ? `Längd: ${formatLength(getOptionMeasurement(option).length)}`
            : option.quantityControl
              ? `Antal stycken: ${getOptionPricing(option).quantity}`
              : option.areaControl ? `Yta: ${formatArea(getOptionArea(option))}` : "",
    })),
    ...(extraWorkCost > 0 ? [{
      id: "extraWork",
      title: `Extra arbete (${formatHours(extraWork.hours)})`,
      sectionTitle: "Extra arbete",
      priceValue: extraWorkCost,
      hoursValue: extraWorkHours,
      detailText: `Tid på plats: ${formatHours(extraWorkHours)} · Timpris per person: ${formatPrice(extraWork.hourlyRate)}/h`,
    }] : []),
    ...(temporaryExtraStaff.active && temporaryExtraStaffCost > 0 ? [{
      id: "temporaryExtraStaff",
      title: `Tillfällig extra personal (${temporaryExtraStaffPeople} × ${formatHours(temporaryExtraStaffHours)})`,
      sectionTitle: "Extra arbete",
      priceValue: temporaryExtraStaffCost,
      hoursValue: temporaryExtraStaffWorkHours,
      detailText: `Tid på plats: ${formatHours(temporaryExtraStaffWorkHours)} · Pris till kund per person: ${formatPrice(temporaryExtraStaffCustomerRate)}/h`,
    }] : []),
    ...selectedFixedCostDetails,
  ];
  const vvsNoticeActive = selectedOptionDetails.some((option) => option.vvsNotice);
  const elNoticeActive = selectedOptionDetails.some(isElRelatedOption);
  const safetyNoticeActive = vvsNoticeActive || elNoticeActive;
  const demolitionNoticeActive = baseCategory === "Rivning & Bilning";

  const minPrice = Math.round((discountedWorkPrice * 0.85) + fixedCostsTotal);

  const premiumPrice = Math.round((discountedWorkPrice * 1.3) + fixedCostsTotal);
  const offerPriceOptions = {
    min: minPrice,
    normal: normalPrice,
    premium: premiumPrice,
  };
  const selectedOfferPrice = offerPriceOptions[selectedPriceVariant] ?? normalPrice;

  const exportPdf = async () => {
    const logoImage = await loadPdfLogoImage(appSettings);
    const pdfBlob = createOfferPdfBlob({
      area,
      showArea: usesGlobalArea,
      areaMode: usesDimensionArea ? areaMode : "manual",
      deckDimensions: usesDimensionArea ? deckDimensions : null,
      displayCategory,
      customer,
      projectStatus,
      selectedOfferPrice,
      selectedOptionDetails,
      extraCostDetails,
      extraCostsTotal,
      fixedCostsTotal,
      workPrice,
      peopleCount: normalizedPeopleCount,
      totalWorkHours,
      hourlyRateSummary,
      estimatedCalendarTime,
      startDate,
      estimatedEndDate,
      discountActive: discount.active,
      discountAmount,
      discountPercent,
      discountedWorkPrice,
      vvsNoticeActive,
      elNoticeActive,
      demolitionNoticeActive,
      logoImage,
      companySettings: appSettings,
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
      id: initialOffer?.id || crypto.randomUUID(),
      date: initialOffer?.date || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      customer,
      projectStatus,
      privateNotes,
      customerTags,
      projectPhotos,
      category,
      displayCategory,
      area: usesGlobalArea ? area : null,
      areaMode: usesDimensionArea ? areaMode : "manual",
      deckDimensions: usesDimensionArea ? deckDimensions : null,
      peopleCount: normalizedPeopleCount,
      schedule: {
        startDate,
        availability,
        totalWorkHours,
        hourlyRateSummary,
        estimatedCalendarTime,
        estimatedEndDate,
        weeklyAvailableHours,
      },
      extraWork: {
        hours: Math.max(0, Number(extraWork.hours) || 0),
        hourlyRate: Math.max(0, Number(extraWork.hourlyRate) || 0),
        cost: extraWorkCost,
      },
      temporaryExtraStaff: {
        active: temporaryExtraStaff.active,
        people: temporaryExtraStaffPeople,
        hours: temporaryExtraStaffHours,
        internalHourlyRate: temporaryExtraStaffInternalRate,
        customerHourlyRate: temporaryExtraStaffCustomerRate,
        internalCost: temporaryExtraStaffInternalCost,
        customerPrice: temporaryExtraStaffCost,
        margin: temporaryExtraStaffMargin,
      },
      extraCosts: extraCostDetails.map((cost) => ({
        id: cost.id,
        name: cost.name,
        description: cost.description,
        priceValue: cost.priceValue,
      })),
      discount: {
        active: discount.active,
        percent: discountPercent,
        amount: discountAmount,
      },
      options: selectedOptionDetails.map((option) => ({
        id: option.id,
        title: formatOptionTitle(option.title),
        sectionTitle: option.sectionTitle || "",
        priceValue: option.priceValue,
        hoursValue: option.hoursValue || 0,
        detailText: option.detailText || "",
        vvsNotice: option.vvsNotice || false,
        elNotice: option.elNotice || false,
      })),
      demolitionNoticeActive,
      companySettings: appSettings,
      prices: {
        work: Math.round(workPrice),
        workAfterDiscount: Math.round(discountedWorkPrice),
        fixed: fixedCostsTotal,
        extraCosts: extraCostsTotal,
        min: minPrice,
        normal: normalPrice,
        premium: premiumPrice,
        selectedVariant: selectedPriceVariant,
        selectedOffer: selectedOfferPrice,
      },
      formState: {
        area,
        areaMode,
        deckDimensions,
        selectedOptions,
        customer,
        extraWork,
        temporaryExtraStaff,
        peopleCount: normalizedPeopleCount,
        availability,
        startDate,
        fixedCosts,
        extraCosts,
        optionPricing,
        optionMeasurements,
        discount: {
          active: discount.active,
          percent: discountPercent,
        },
        selectedPriceVariant,
        projectStatus,
        privateNotes,
        customerTags,
        projectPhotos,
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
            {translateText(category, language)}
          </h1>

          <p className="text-orange-400">
            {t("Kostnadsberäkning")}
          </p>

        </div>

        <img
          src={marcinByggLogo}
          alt="Marcin Bygg"
          className="ml-auto h-12 w-12 shrink-0 rounded-2xl object-contain shadow-xl shadow-orange-500/20"
        />

      </div>

      <div className="mt-10 bg-zinc-900 rounded-3xl border border-zinc-800 p-6">

        {/* AREA */}
        {usesGlobalArea && (
        <div>

          {usesDimensionArea && (
            <div className="mb-4 grid grid-cols-2 gap-2 rounded-2xl border border-zinc-800 bg-black p-1">
              {[
                ["manual", "Ange m² manuellt"],
                ["dimensions", "Beräkna från mått"],
              ].map(([mode, label]) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setAreaMode(mode)}
                  className={`min-h-12 touch-manipulation rounded-xl px-3 text-sm font-black transition ${areaMode === mode ? "bg-orange-500 text-black" : "text-zinc-400"}`}
                >
                  {t(label)}
                </button>
              ))}
            </div>
          )}

          {areaMode === "dimensions" && usesDimensionArea ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm text-zinc-400">
                {t("Längd (m)")}

                <NumberStepper
                  value={deckDimensions.length}
                  onChange={(value) => updateDeckDimension("length", value)}
                  min={0}
                  step={0.1}
                />

              </label>

              <label className="text-sm text-zinc-400">
                {t("Bredd (m)")}

                <NumberStepper
                  value={deckDimensions.width}
                  onChange={(value) => updateDeckDimension("width", value)}
                  min={0}
                  step={0.1}
                />

              </label>

              <div className="rounded-2xl border border-orange-400/20 bg-black p-4 sm:col-span-2">
                <p className="text-xs font-bold uppercase text-zinc-500">
                  {t("Storlek m²")}
                </p>

                <p className="mt-2 text-3xl font-black text-orange-400">
                  {formatArea(area)}
                </p>
              </div>
            </div>
          ) : (
            <label className="text-sm text-zinc-400">
              {t("Storlek m²")}

              <NumberStepper
                value={area}
                onChange={setArea}
                min={0}
                step={0.1}
              />

            </label>
          )}

        </div>
        )}

        {/* CUSTOMER */}
        <div className="mt-8 border-t border-zinc-800 pt-8">

          <h2 className="text-sm font-bold uppercase text-zinc-500">
            {t("Kunduppgifter")}
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
              label="Email"
              value={customer.email || ""}
              onChange={(value) => setCustomer({ ...customer, email: value })}
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

        <ProjectCrmPanel
          projectStatus={projectStatus}
          setProjectStatus={setProjectStatus}
          privateNotes={privateNotes}
          setPrivateNotes={setPrivateNotes}
          customerTags={customerTags}
          setCustomerTags={setCustomerTags}
          projectPhotos={projectPhotos}
          setProjectPhotos={setProjectPhotos}
        />

        {/* PEOPLE */}
        <div className="mt-8 border-t border-zinc-800 pt-8">

          <div className="flex items-end justify-between gap-4">

            <div>

              <h2 className="text-sm font-bold uppercase text-zinc-500">
                {t("Bemanning")}
              </h2>

              <p className="mt-1 text-sm text-zinc-400">
                {t("Timpris per person multipliceras med antal personer.")}
              </p>

            </div>

            <p className="text-right text-sm font-black text-orange-400">
              {normalizedPeopleCount} {translateText(normalizedPeopleCount === 1 ? "person" : "personer", language)}
            </p>

          </div>

          <label className="mt-4 block text-sm text-zinc-400">
            {t("Antal personer")}

            <NumberStepper
              value={peopleCount}
              onChange={(value) => setPeopleCount(Math.max(1, Number(value) || 1))}
              min={1}
              step={1}
            />

          </label>

        </div>

        {/* OPTIONS */}
        <div className="mt-8 flex flex-col gap-4">

          {calculatorSections.map((section) => (

            <div key={section.title || "options"} className="flex flex-col gap-3">

              {section.title && (
                <h2 className="text-sm font-bold uppercase text-zinc-500">
                  {t(section.title)}
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
                        measurement={getOptionMeasurement(optionWithSection)}
                        onMeasurementChange={(values) => updateOptionMeasurement(optionWithSection.id, values)}
                      />
                    )}

                  </div>
                );
              })}

            </div>

          ))}

        </div>

        {safetyNoticeActive && (
          <div className="mt-6 rounded-3xl border border-orange-400/30 bg-orange-500/10 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-400">
              {t(safetyNoticeTitle)}
            </p>

            <p className="mt-2 text-sm leading-relaxed text-zinc-200">
              {t(safetyNoticeText)}
            </p>
          </div>
        )}

        {demolitionNoticeActive && (
          <div className="mt-6 rounded-3xl border border-orange-400/30 bg-orange-500/10 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-400">
              {t(demolitionSafetyNoticeTitle)}
            </p>

            <p className="mt-2 text-sm leading-relaxed text-zinc-200">
              {t(demolitionSafetyNoticeText)}
            </p>
          </div>
        )}

        {/* AVAILABILITY */}
        <div className="mt-8 border-t border-zinc-800 pt-8">

          <div className="flex items-end justify-between gap-4">

            <div>

              <h2 className="text-sm font-bold uppercase text-zinc-500">
                {t("Tillgänglig arbetstid")}
              </h2>

              <p className="mt-1 text-sm text-zinc-400">
                {t("Används för att räkna kalendertid kvällar och helger.")}
              </p>

            </div>

            <p className="text-right text-sm font-black text-orange-400">
              {weeklyAvailableHours} {t("h/vecka")}
            </p>

          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">

            <label className="block text-sm text-zinc-400 sm:col-span-2">
              {t("Startdatum")}

              <input
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-zinc-800 bg-black p-4 text-xl font-black text-white outline-none transition focus:border-orange-400"
              />

            </label>

            <AvailabilityInput
              label="Timmar per vardagskväll"
              value={availability.weekdayEveningHours}
              onChange={(value) => setAvailability({
                ...availability,
                weekdayEveningHours: value,
              })}
            />

            <AvailabilityInput
              label="Antal vardagskvällar per vecka"
              value={availability.weekdayEveningsPerWeek}
              onChange={(value) => setAvailability({
                ...availability,
                weekdayEveningsPerWeek: value,
              })}
            />

            <AvailabilityInput
              label="Timmar per helgdag"
              value={availability.weekendDayHours}
              onChange={(value) => setAvailability({
                ...availability,
                weekendDayHours: value,
              })}
            />

            <AvailabilityInput
              label="Antal helgdagar per vecka"
              value={availability.weekendDaysPerWeek}
              onChange={(value) => setAvailability({
                ...availability,
                weekendDaysPerWeek: value,
              })}
            />

          </div>

          <div className="mt-4 rounded-2xl border border-orange-400/20 bg-black p-4">
            <p className="text-xs font-bold uppercase text-zinc-500">
              {t("Uppskattad tid")}
            </p>

            <p className="mt-2 text-xl font-black text-orange-400">
              {translateText(estimatedCalendarTime, language)}
            </p>

            <p className="mt-1 text-sm text-zinc-400">
              {t("Tid på plats")}: {formatHours(totalWorkHours)}
            </p>

            {startDate && estimatedEndDate && (
              <p className="mt-3 text-sm font-bold text-white">
                {t("Beräknat slutdatum")}: {translateText(estimatedEndDateDisplay, language)}
              </p>
            )}
          </div>

        </div>

        {/* EXTRA WORK */}
        <div className="mt-8 border-t border-zinc-800 pt-8">

          <div className="flex items-end justify-between gap-4">

            <div>

              <h2 className="text-sm font-bold uppercase text-zinc-500">
                {t("Extra arbete")}
              </h2>

              <p className="mt-1 text-sm text-zinc-400">
                {t("Lägg till extra timmar utanför standardofferten.")}
              </p>

            </div>

            <p className="text-right text-sm font-black text-orange-400">
              {formatPrice(extraWorkCost)}
            </p>

          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">

            <label className="block text-sm text-zinc-400">
              {t("Tid på plats")}

              <NumberStepper
                value={extraWork.hours}
                onChange={(value) => setExtraWork({
                  ...extraWork,
                  hours: value,
                })}
                min={0}
                step={0.25}
              />

            </label>

            <label className="block text-sm text-zinc-400">
              {t("Timpris per person")}

              <NumberStepper
                value={extraWork.hourlyRate}
                onChange={(value) => setExtraWork({
                  ...extraWork,
                  hourlyRate: value,
                })}
                min={0}
                step={50}
              />

            </label>

          </div>

        </div>

        {/* TEMPORARY EXTRA STAFF */}
        <div className="mt-8 border-t border-zinc-800 pt-8">

          <div className="flex items-end justify-between gap-4">

            <div>

              <h2 className="text-sm font-bold uppercase text-zinc-500">
                {t("Tillfällig extra personal")}
              </h2>

              <p className="mt-1 text-sm text-zinc-400">
                {t("Lägg till extra personal för ett begränsat antal timmar.")}
              </p>

            </div>

            <p className="text-right text-sm font-black text-orange-400">
              {formatPrice(temporaryExtraStaffCost)}
            </p>

          </div>

          <div className="mt-4">
            <Option
              title="Lägg till tillfällig extra personal"
              active={temporaryExtraStaff.active}
              onClick={() => setTemporaryExtraStaff({
                ...temporaryExtraStaff,
                active: !temporaryExtraStaff.active,
              })}
            />
          </div>

          {temporaryExtraStaff.active && (
            <div className="mt-4 rounded-2xl border border-orange-400/20 bg-black/60 p-4">

              <div className="grid gap-4 sm:grid-cols-2">

                <PricingInput
                  label="Antal extra personer"
                  value={temporaryExtraStaff.people}
                  onChange={(value) => setTemporaryExtraStaff({
                    ...temporaryExtraStaff,
                    people: value,
                  })}
                />

                <PricingInput
                  label="Tid på plats"
                  value={temporaryExtraStaff.hours}
                  onChange={(value) => setTemporaryExtraStaff({
                    ...temporaryExtraStaff,
                    hours: value,
                  })}
                />

                <PricingInput
                  label="Kostnad per person internt"
                  value={temporaryExtraStaff.internalHourlyRate}
                  onChange={(value) => setTemporaryExtraStaff({
                    ...temporaryExtraStaff,
                    internalHourlyRate: value,
                  })}
                />

                <PricingInput
                  label="Pris till kund per person"
                  value={temporaryExtraStaff.customerHourlyRate}
                  onChange={(value) => setTemporaryExtraStaff({
                    ...temporaryExtraStaff,
                    customerHourlyRate: value,
                  })}
                />

              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
                  <p className="text-xs font-bold uppercase text-zinc-500">
                    {t("Intern kostnad")}
                  </p>

                  <p className="mt-2 text-xl font-black text-white">
                    {formatPrice(temporaryExtraStaffInternalCost)}
                  </p>
                </div>

                <div className="rounded-2xl border border-orange-400/20 bg-zinc-950 p-4">
                  <p className="text-xs font-bold uppercase text-zinc-500">
                    {t("Vinst / marginal")}
                  </p>

                  <p className="mt-2 text-xl font-black text-orange-400">
                    {formatPrice(temporaryExtraStaffMargin)}
                  </p>
                </div>
              </div>

            </div>
          )}

        </div>

        {!calculatorConfig.usesCustomFixedCosts && (
        <div className="mt-8 border-t border-zinc-800 pt-8">

          <div className="flex items-end justify-between gap-4">

            <div>

              <h2 className="text-sm font-bold uppercase text-zinc-500">
                {t("Fasta kostnader")}
              </h2>

              <p className="mt-1 text-sm text-zinc-400">
                {t("Dessa kostnader påverkas inte av rabatt.")}
              </p>

            </div>

            <p className="text-right text-sm font-black text-orange-400">
              {formatPrice(fixedCostsDisplayTotal)}
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

        {/* EXTRA COSTS */}
        <div className="mt-8 border-t border-zinc-800 pt-8">

          <div className="flex items-end justify-between gap-4">

            <div>

              <h2 className="text-sm font-bold uppercase text-zinc-500">
                {t("Extra kostnader")}
              </h2>

              <p className="mt-1 text-sm text-zinc-400">
                {t("Egna kostnader utan rabatt och utan arbetstid.")}
              </p>

            </div>

            <p className="text-right text-sm font-black text-orange-400">
              {formatPrice(extraCostsTotal)}
            </p>

          </div>

          <div className="mt-4 flex flex-col gap-4">

            {extraCosts.map((cost, index) => (

              <div
                key={cost.id}
                className="rounded-2xl border border-white/10 bg-black/60 p-4"
              >

                <div className="mb-4 flex items-center justify-between gap-3">
                  <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
                    {t("Kostnad")} {index + 1}
                  </p>

                  <button
                    type="button"
                    onClick={() => removeExtraCost(cost.id)}
                    className="min-h-10 touch-manipulation rounded-xl border border-red-400/30 px-3 text-sm font-bold text-red-300 transition hover:bg-red-500/10"
                  >
                    {t("Ta bort kostnad")}
                  </button>
                </div>

                <div className="grid gap-4">
                  <CustomerField
                    label="Namn"
                    value={cost.name}
                    onChange={(value) => updateExtraCost(cost.id, { name: value })}
                  />

                  <CustomerField
                    label="Beskrivning"
                    value={cost.description}
                    onChange={(value) => updateExtraCost(cost.id, { description: value })}
                    multiline
                  />

                  <PricingInput
                    label="Pris"
                    value={cost.price}
                    onChange={(value) => updateExtraCost(cost.id, { price: value })}
                  />
                </div>

              </div>

            ))}

            <button
              type="button"
              onClick={addExtraCost}
              className="min-h-12 touch-manipulation rounded-2xl border border-orange-400/40 bg-orange-500/10 px-4 text-sm font-black text-orange-300 transition hover:bg-orange-500/20"
            >
              {t("Lägg till kostnad")}
            </button>

          </div>

        </div>

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
                  {t("Rabatt på arbete")}
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

          <div className="mt-6 rounded-3xl border border-orange-400/25 bg-black/70 p-4 shadow-xl shadow-orange-500/5">

            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-400">
                  {t("Pris till offert")}
                </p>

                <p className="mt-1 text-sm text-zinc-400">
                  {t("Välj vilket pris som ska användas i PDF och sparad offert.")}
                </p>

              </div>

              <p className="text-2xl font-black text-white">
                {formatPrice(selectedOfferPrice)}
              </p>

            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-zinc-950 p-1">

              {[
                { id: "min", label: "Min" },
                { id: "normal", label: "Normal" },
                { id: "premium", label: "Premium" },
              ].map((variant) => (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => setSelectedPriceVariant(variant.id)}
                  className={`min-h-12 rounded-xl px-3 text-sm font-black transition ${
                    selectedPriceVariant === variant.id
                      ? "bg-orange-500 text-black shadow-lg shadow-orange-500/20"
                      : "text-zinc-300 hover:bg-white/10"
                  }`}
                >
                  {t(variant.label)}
                </button>
              ))}

            </div>

          </div>

          <div className="mt-10 border-t border-zinc-800 pt-6">

            <div className="mb-6 grid gap-3">

              <div className="rounded-2xl border border-white/10 bg-black p-4">
                  <p className="text-xs font-bold uppercase text-zinc-500">
                    {t("Arbete före rabatt")}
                </p>

                <p className="mt-2 text-xl font-black text-white">
                  {formatPrice(workPrice)}
                </p>
              </div>

              {discount.active && (
                <div className="rounded-2xl border border-orange-400/20 bg-black p-4">
                  <p className="text-xs font-bold uppercase text-zinc-500">
                    {t("Rabatt")}
                  </p>

                  <p className="mt-2 text-xl font-black text-orange-400">
                    -{formatPrice(discountAmount)}
                  </p>
                </div>
              )}

              <div className="rounded-2xl border border-white/10 bg-black p-4">
                <p className="text-xs font-bold uppercase text-zinc-500">
                  {t("Arbete efter rabatt")}
                </p>

                <p className="mt-2 text-xl font-black text-white">
                  {formatPrice(discountedWorkPrice)}
                </p>
              </div>

              {hasFixedCosts && (
                <div className="rounded-2xl border border-white/10 bg-black p-4">
                  <p className="text-xs font-bold uppercase text-zinc-500">
                    {t("Fasta kostnader")}
                  </p>

                  <p className="mt-2 text-xl font-black text-orange-400">
                    {formatPrice(fixedCostsDisplayTotal)}
                  </p>
                </div>
              )}

              {extraCostsTotal > 0 && (
                <div className="rounded-2xl border border-orange-400/20 bg-black p-4">
                  <p className="text-xs font-bold uppercase text-zinc-500">
                    {t("Extra kostnader")}
                  </p>

                  <p className="mt-2 text-xl font-black text-orange-400">
                    {formatPrice(extraCostsTotal)}
                  </p>
                </div>
              )}

              <div className="rounded-2xl border border-orange-400 bg-orange-500 p-4 text-black">
                <p className="text-xs font-bold uppercase text-black/60">
                  {t("Offertpris")}
                </p>

                <p className="mt-2 text-2xl font-black">
                  {formatPrice(selectedOfferPrice)}
                </p>
              </div>

            </div>

            <div className="flex justify-between">

              <span className="text-zinc-400">
                {t("Antal personer")}
              </span>

              <span>
                {normalizedPeopleCount} {translateText(normalizedPeopleCount === 1 ? "person" : "personer", language)}
              </span>

            </div>

            <div className="mt-3 flex justify-between">

              <span className="text-zinc-400">
                {t("Tid på plats")}
              </span>

              <span>
                {formatHours(totalWorkHours)}
              </span>

            </div>

            <div className="mt-3 flex justify-between gap-4">

              <span className="text-zinc-400">
                {t("Timpris per person")}
              </span>

              <span className="text-right">
                {translateText(hourlyRateSummary, language)}
              </span>

            </div>

            <div className="mt-3 flex justify-between gap-4">

              <span className="text-zinc-400">
                {t("Arbetskostnad")}
              </span>

              <span className="text-right">
                {formatPrice(workPrice)}
              </span>

            </div>

            <div className="mt-3 flex justify-between">

              <span className="text-zinc-400">
                {t("Uppskattad tid")}
              </span>

              <span className="text-right">
                {translateText(estimatedCalendarTime, language)}
              </span>

            </div>

            {startDate && (
              <div className="mt-3 flex justify-between gap-4">

                <span className="text-zinc-400">
                  {t("Startdatum")}
                </span>

                <span className="text-right">
                  {formatLongDate(parseLocalDate(startDate), language)}
                </span>

              </div>
            )}

            {startDate && estimatedEndDate && (
              <div className="mt-3 flex justify-between gap-4">

                <span className="text-zinc-400">
                  {t("Beräknat slutdatum")}
                </span>

                <span className="text-right">
                  {translateText(estimatedEndDateDisplay, language)}
                </span>

              </div>
            )}

          </div>

        </div>

      </div>

      <div className="mt-6 overflow-hidden rounded-3xl border border-orange-400/30 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black shadow-2xl shadow-orange-500/10">

        <div className="border-b border-white/10 bg-white/[0.03] p-6">

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">
            {t("Offertöversikt")}
          </p>

          <div className="mt-3 flex items-end justify-between gap-4">

            <div>

              <h2 className="text-3xl font-black">
                {translateText(displayCategory, language)}
              </h2>

              <p className="mt-1 text-sm text-zinc-400">
                {usesGlobalArea ? `${formatArea(area)} · ` : ""}{normalizedPeopleCount} {translateText(normalizedPeopleCount === 1 ? "person" : "personer", language)}
              </p>

            </div>

            <div className="text-right">

              <p className="text-xs uppercase text-zinc-500">
                {t("Offertpris")}
              </p>

              <p className="text-3xl font-black text-orange-400">
                {formatPrice(selectedOfferPrice)}
              </p>

            </div>

            {extraCostDetails.length > 0 && (
              <div className="mt-6">

                <h3 className="text-sm font-bold uppercase text-zinc-500">
                  {t("Extra kostnader")}
                </h3>

                <div className="mt-4 flex flex-col gap-3">

                  {extraCostDetails.map((cost) => (

                    <div
                      key={cost.id}
                      className="flex items-start justify-between gap-4 rounded-2xl border border-orange-400/20 bg-white/[0.03] px-4 py-3"
                    >

                      <div>

                        <p className="font-bold">
                          {translateText(cost.name || "Extra kostnad", language)}
                        </p>

                        {cost.description && (
                          <p className="text-xs text-zinc-500">
                            {translateText(cost.description, language)}
                          </p>
                        )}

                      </div>

                      <span className="shrink-0 text-sm font-bold text-orange-300">
                        +{formatPrice(cost.priceValue)}
                      </span>

                    </div>

                  ))}

                </div>

              </div>
            )}

          </div>

        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-2">

          <div>

            <h3 className="text-sm font-bold uppercase text-zinc-500">
              {t("Kund")}
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
              {t("Valda alternativ")}
            </h3>

            <div className="mt-4 flex flex-col gap-3">

              {selectedOptionDetails.map((option) => (

                <div
                  key={option.id}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
                >

                  <div>

                    <p className="font-bold">
                      {translateText(formatOptionTitle(option.title), language)}
                    </p>

                    {option.sectionTitle && (
                      <p className="text-xs text-zinc-500">
                        {translateText(option.sectionTitle, language)}
                      </p>
                    )}

                    {option.detailText && (
                      <p className="text-xs text-zinc-500">
                        {translateText(option.detailText, language)}
                      </p>
                    )}

                  </div>

                  <span className="text-sm font-bold text-orange-300">
                    {option.priceValue > 0 ? `+${formatPrice(option.priceValue)}` : t("Ingår")}
                  </span>

                </div>

              ))}

            </div>

            {safetyNoticeActive && (
              <div className="mt-4 rounded-2xl border border-orange-400/30 bg-orange-500/10 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-400">
                  {t(safetyNoticeTitle)}
                </p>

                <p className="mt-2 text-sm leading-relaxed text-zinc-200">
                  {t(safetyNoticeText)}
                </p>
              </div>
            )}

            {demolitionNoticeActive && (
              <div className="mt-4 rounded-2xl border border-orange-400/30 bg-orange-500/10 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-400">
                  {t(demolitionSafetyNoticeTitle)}
                </p>

                <p className="mt-2 text-sm leading-relaxed text-zinc-200">
                  {t(demolitionSafetyNoticeText)}
                </p>
              </div>
            )}

          </div>

        </div>

        <div className="grid gap-3 border-t border-white/10 p-6 sm:grid-cols-2">

          {usesGlobalArea && (
            <SummaryRow label="Storlek m²" value={formatArea(area)} />
          )}
          {usesGlobalArea && usesDimensionArea && areaMode === "dimensions" && (
            <SummaryRow
              label="Mått"
              value={`${deckDimensions.length || 0} m × ${deckDimensions.width || 0} m`}
            />
          )}
          <SummaryRow label="Tid på plats" value={formatHours(totalWorkHours)} />
          <SummaryRow label="Timpris per person" value={hourlyRateSummary} />
          <SummaryRow label="Arbetskostnad" value={formatPrice(workPrice)} />
          <SummaryRow label="Uppskattad tid" value={estimatedCalendarTime} />
          {startDate && (
            <SummaryRow label="Startdatum" value={formatLongDate(parseLocalDate(startDate), language)} />
          )}
          {startDate && estimatedEndDate && (
            <SummaryRow label="Beräknat slutdatum" value={estimatedEndDateDisplay} />
          )}

        </div>

        <div className="grid gap-3 border-t border-white/10 p-6 sm:grid-cols-2">

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs font-bold uppercase text-zinc-500">
              {t("Arbete före rabatt")}
            </p>

            <p className="mt-2 text-xl font-black text-white">
              {formatPrice(workPrice)}
            </p>
          </div>

          {discount.active && (
            <div className="rounded-2xl border border-orange-400/20 bg-white/[0.03] p-4">
              <p className="text-xs font-bold uppercase text-zinc-500">
                {t("Rabatt")}
              </p>

              <p className="mt-2 text-xl font-black text-orange-400">
                -{formatPrice(discountAmount)}
              </p>
            </div>
          )}

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs font-bold uppercase text-zinc-500">
              {t("Arbete efter rabatt")}
            </p>

            <p className="mt-2 text-xl font-black text-white">
              {formatPrice(discountedWorkPrice)}
            </p>
          </div>

          {hasFixedCosts && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs font-bold uppercase text-zinc-500">
                {t("Fasta kostnader")}
              </p>

              <p className="mt-2 text-xl font-black text-orange-400">
                {formatPrice(fixedCostsDisplayTotal)}
              </p>
            </div>
          )}

          <div className="rounded-2xl border border-orange-400 bg-orange-500 p-4 text-black">
            <p className="text-xs font-bold uppercase text-black/60">
              {t("Offertpris")}
            </p>

            <p className="mt-2 text-2xl font-black">
              {formatPrice(selectedOfferPrice)}
            </p>
          </div>

        </div>

        <div className="grid grid-cols-3 border-t border-white/10 text-center">

          <SummaryPrice label="MIN" value={minPrice} highlight={selectedPriceVariant === "min"} />
          <SummaryPrice label="NORMAL" value={normalPrice} highlight={selectedPriceVariant === "normal"} />
          <SummaryPrice label="PREMIUM" value={premiumPrice} highlight={selectedPriceVariant === "premium"} />

        </div>

      </div>

      <div className="sticky bottom-0 z-50 -mx-6 mt-5 grid gap-3 border-t border-white/10 bg-black/95 px-6 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl sm:grid-cols-3">

        <ActionButton onClick={saveCurrentOffer}>
          {initialOffer ? "Spara ändringar" : "Spara offert"}
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
  const { language } = useI18n();
  const inputClassName = "mt-2 w-full rounded-2xl border border-zinc-800 bg-black p-4 text-white outline-none transition focus:border-orange-400";

  return (
    <label className="block text-sm text-zinc-400">
      {translateText(label, language)}

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

function OptionPricingFields({ option, pricing, onChange, measurement, onMeasurementChange }) {
  const { language } = useI18n();
  const canChooseMode = option.pricingControl === "work";
  const useStepPricing = option.pricingControl === "steps";
  const useHourly = pricing.mode === "hourly" || option.pricingControl === "hourly";
  const areaLabel = option.areaControl === "facade" ? "Fasad m²" : "Yta m²";
  const secondDimensionLabel = option.areaControl === "facade" ? "Höjd (m)" : "Bredd (m)";
  const pricingModes = option.lengthControl
    ? [
      ["fast", "Fast pris"],
      ["meter", "Pris/löpmeter"],
      ["hourly", "Timpris"],
    ]
    : option.quantityControl
      ? [
        ["fast", "Fast pris"],
        ["unit", "Pris/styck"],
        ["hourly", "Timpris"],
      ]
    : [
      ["fast", "Fast pris"],
      ["hourly", "Timpris"],
    ];

  return (
    <div className="rounded-2xl border border-orange-400/20 bg-black/60 p-4">

      {useStepPricing && (
        <div>
          <div className="grid grid-cols-2 gap-2">
            {[
              ["standard", "Standard"],
              ["premium", "Premium"],
            ].map(([tier, label]) => (
              <button
                key={tier}
                type="button"
                onClick={() => onChange({
                  stepTier: tier,
                  stepPrice: tier === "premium" ? option.premiumStepPrice : option.standardStepPrice,
                })}
                className={`min-h-11 rounded-xl border px-2 text-sm font-bold ${
                  pricing.stepTier === tier
                    ? "border-orange-400 bg-orange-500 text-black"
                    : "border-zinc-800 bg-zinc-950 text-white"
                }`}
              >
                {translateText(label, language)}
              </button>
            ))}
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <PricingInput
              label="Antal steg"
              value={pricing.steps}
              onChange={(value) => onChange({ steps: value })}
              step={1}
            />

            <PricingInput
              label="Pris per steg"
              value={pricing.stepPrice}
              onChange={(value) => onChange({ stepPrice: value })}
            />
          </div>
        </div>
      )}

      {option.lengthControl && (
        <div className="mb-4 rounded-2xl border border-white/10 bg-zinc-950 p-3">
          <PricingInput
            label="Längd i löpmeter"
            value={measurement.length}
            onChange={(value) => onMeasurementChange({ length: value })}
            step={0.1}
          />
        </div>
      )}

      {option.quantityControl && (
        <div className="mb-4 rounded-2xl border border-white/10 bg-zinc-950 p-3">
          <PricingInput
            label={option.quantityLabel || "Antal stycken"}
            value={pricing.quantity}
            onChange={(value) => onChange({ quantity: value })}
            step={1}
          />
        </div>
      )}

      {option.areaControl && (
        <div className="mb-4 rounded-2xl border border-white/10 bg-zinc-950 p-3">
          <div className="grid grid-cols-2 gap-2">
            {[
              ["manual", "Ange m² manuellt"],
              ["dimensions", "Beräkna från mått"],
            ].map(([mode, label]) => (
              <button
                key={mode}
                type="button"
                onClick={() => onMeasurementChange({ mode })}
                className={`min-h-11 rounded-xl border px-2 text-sm font-bold ${
                  measurement.mode === mode
                    ? "border-orange-400 bg-orange-500 text-black"
                    : "border-zinc-800 bg-black text-white"
                }`}
              >
              {translateText(label, language)}
              </button>
            ))}
          </div>

          {measurement.mode === "dimensions" ? (
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <PricingInput
                label="Längd (m)"
                value={measurement.length}
                onChange={(value) => onMeasurementChange({ length: value, mode: "dimensions" })}
                step={0.1}
              />

              <PricingInput
                label={secondDimensionLabel}
                value={measurement.height}
                onChange={(value) => onMeasurementChange({ height: value, mode: "dimensions" })}
                step={0.1}
              />

              <div className="rounded-2xl border border-orange-400/20 bg-black p-4 sm:col-span-2">
                <p className="text-xs font-bold uppercase text-zinc-500">
                  {translateText(areaLabel, language)}
                </p>

                <p className="mt-2 text-2xl font-black text-orange-400">
                  {formatArea(measurement.area)}
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-3">
              <PricingInput
                label={areaLabel}
                value={measurement.area}
                onChange={(value) => onMeasurementChange({ area: value, mode: "manual" })}
                step={0.1}
              />
            </div>
          )}
        </div>
      )}

      {!useStepPricing && canChooseMode && (
        <div className={`grid gap-2 ${option.lengthControl || option.quantityControl ? "grid-cols-3" : "grid-cols-2"}`}>

          {pricingModes.map(([mode, label]) => (
            <button
              key={mode}
              type="button"
              onClick={() => onChange({ mode })}
              className={`min-h-11 rounded-xl border px-2 text-sm font-bold ${
                pricing.mode === mode
                  ? "border-orange-400 bg-orange-500 text-black"
                  : "border-zinc-800 bg-zinc-950 text-white"
              }`}
            >
              {translateText(label, language)}
            </button>
          ))}

        </div>
      )}

      {!useStepPricing && useHourly ? (
        <div className={`grid gap-3 ${canChooseMode ? "mt-4" : ""} sm:grid-cols-2`}>

          <PricingInput
            label="Tid på plats"
            value={pricing.hours}
            onChange={(value) => onChange({ hours: value })}
          />

          <PricingInput
            label={option.hourlyRateLabel || "Timpris per person"}
            value={pricing.hourlyRate}
            onChange={(value) => onChange({ hourlyRate: value })}
          />

        </div>
      ) : !useStepPricing && pricing.mode === "meter" && option.lengthControl ? (
        <div className={`grid gap-3 ${canChooseMode ? "mt-4" : ""} sm:grid-cols-2`}>

          <PricingInput
            label="Pris per löpmeter"
            value={pricing.meterPrice}
            onChange={(value) => onChange({ meterPrice: value })}
          />

          <PricingInput
            label="Uppskattad tid på plats"
            value={pricing.estimatedHours}
            onChange={(value) => onChange({ estimatedHours: value })}
          />

        </div>
      ) : !useStepPricing && pricing.mode === "unit" && option.quantityControl ? (
        <div className={`grid gap-3 ${canChooseMode ? "mt-4" : ""} sm:grid-cols-2`}>

          <PricingInput
            label={option.unitPriceLabel || "Pris per styck"}
            value={pricing.unitPrice}
            onChange={(value) => onChange({ unitPrice: value })}
          />

          <PricingInput
            label="Uppskattad tid på plats"
            value={pricing.estimatedHours}
            onChange={(value) => onChange({ estimatedHours: value })}
          />

        </div>
      ) : !useStepPricing ? (
        <div className={`grid gap-3 ${canChooseMode ? "mt-4" : ""} sm:grid-cols-2`}>

          <PricingInput
            label="Fast pris"
            value={pricing.fastPrice}
            onChange={(value) => onChange({ fastPrice: value })}
          />

          <PricingInput
            label="Uppskattad tid på plats"
            value={pricing.estimatedHours}
            onChange={(value) => onChange({ estimatedHours: value })}
          />

        </div>
      ) : null}

    </div>
  );
}

function NumberStepper({ value, onChange, min = 0, step = 1 }) {
  const { language } = useI18n();
  const numericValue = Number(value) || 0;
  const normalizedValue = Math.max(min, numericValue);
  const decimalPlaces = String(step).includes(".") ? String(step).split(".")[1].length : 0;

  const updateValue = (nextValue) => {
    const parsedValue = Number(nextValue);

    if (nextValue === "") {
      onChange(min);
      return;
    }

    if (Number.isNaN(parsedValue)) {
      return;
    }

    onChange(Math.max(min, parsedValue));
  };

  const stepValue = (direction) => {
    const nextValue = normalizedValue + (direction * step);
    const roundedValue = Number(nextValue.toFixed(decimalPlaces));

    onChange(Math.max(min, roundedValue));
  };

  return (
    <div className="mt-2 grid grid-cols-[3.25rem_1fr_3.25rem] overflow-hidden rounded-2xl border border-zinc-800 bg-black">
      <button
        type="button"
        onClick={() => stepValue(-1)}
        className="min-h-14 touch-manipulation border-r border-zinc-800 text-2xl font-black text-orange-300 transition active:bg-orange-500/20 disabled:text-zinc-700"
        disabled={normalizedValue <= min}
        aria-label={translateText("Minska värde", language)}
      >
        -
      </button>

      <input
        type="number"
        min={min}
        step={step}
        value={value}
        onChange={(event) => updateValue(event.target.value)}
        className="min-h-14 w-full bg-zinc-950 px-3 text-center text-xl font-black text-white outline-none"
        inputMode="decimal"
      />

      <button
        type="button"
        onClick={() => stepValue(1)}
        className="min-h-14 touch-manipulation border-l border-zinc-800 text-2xl font-black text-orange-300 transition active:bg-orange-500/20"
        aria-label={translateText("Öka värde", language)}
      >
        +
      </button>
    </div>
  );
}

function getNumericStep(label) {
  const normalizedLabel = label.toLowerCase();

  if (normalizedLabel.includes("pris") || normalizedLabel.includes("kostnad")) {
    return 50;
  }

  if (
    normalizedLabel.includes("timme")
    || normalizedLabel.includes("timmar")
    || normalizedLabel.includes("tid på plats")
    || normalizedLabel.includes("uppskattad tid")
  ) {
    return 0.25;
  }

  if (normalizedLabel.includes("m²") || normalizedLabel.includes("(m)")) {
    return 0.1;
  }

  return 1;
}

function PricingInput({ label, value, onChange, min = 0, step }) {
  const { language } = useI18n();

  return (
    <label className="block text-sm text-zinc-400">
      {translateText(label, language)}

      <NumberStepper
        value={value}
        onChange={onChange}
        min={min}
        step={step ?? getNumericStep(label)}
      />

    </label>
  );
}

function AvailabilityInput({ label, value, onChange }) {
  const { language } = useI18n();

  return (
    <label className="block text-sm text-zinc-400">
      {translateText(label, language)}

      <NumberStepper
        value={value}
        onChange={onChange}
        min={0}
        step={getNumericStep(label)}
      />

    </label>
  );
}

function SummaryRow({ label, value }) {
  const { language } = useI18n();

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
      <p className="text-xs uppercase text-zinc-500">
        {translateText(label, language)}
      </p>

      <p className="mt-1 font-bold text-white">
        {translateText(value, language)}
      </p>
    </div>
  );
}

function SummaryPrice({ label, value, highlight = false }) {
  const { language } = useI18n();

  return (
    <div className={`p-5 ${highlight ? "bg-orange-500 text-black" : "bg-black/30 text-white"}`}>
      <p className={`text-xs font-bold ${highlight ? "text-black/60" : "text-zinc-500"}`}>
        {translateText(label, language)}
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
  showArea,
  areaMode,
  deckDimensions,
  displayCategory,
  customer,
  projectStatus = "Ny förfrågan",
  selectedOfferPrice,
  selectedOptionDetails,
  extraCostDetails,
  extraCostsTotal,
  fixedCostsTotal,
  workPrice,
  peopleCount,
  totalWorkHours,
  hourlyRateSummary,
  estimatedCalendarTime,
  startDate,
  estimatedEndDate,
  discountActive,
  discountAmount,
  discountPercent,
  discountedWorkPrice,
  vvsNoticeActive,
  elNoticeActive,
  demolitionNoticeActive,
  companySettings = loadAppSettings(),
  logoImage,
}) {
  const isPdfValueFilled = (value) => {
    const normalized = String(value ?? "").trim();

    return Boolean(normalized) && !["Inte angivet", "Ej angivet", "Nie podano"].includes(normalized);
  };
  const companyRows = [
    ["Företag", companySettings.companyName],
    ["Org.nr", companySettings.orgNumber],
    ["Telefon", companySettings.phone],
    ["Email", companySettings.email],
    ["Adress", companySettings.address],
    ["Webb", companySettings.website],
    ["Instagram", companySettings.instagram],
    ["Facebook", companySettings.facebook],
    ["TikTok", companySettings.tiktok],
  ].filter(([, value]) => isPdfValueFilled(value));
  const customerRows = [
    ["Namn", customer.name],
    ["Telefon", customer.phone],
    ["Email", customer.email],
    ["Adress", customer.address],
  ].filter(([, value]) => isPdfValueFilled(value));
  const optionRows = (selectedOptionDetails || []).filter((option) => isPdfValueFilled(option.title));
  const extraCostRows = (extraCostDetails || []).filter((cost) => isPdfValueFilled(cost.name) || isPdfValueFilled(cost.description) || Number(cost.priceValue) > 0);
  const fixedCostsDisplayTotal = Math.max(0, fixedCostsTotal - extraCostsTotal);
  const showVvsNotice = vvsNoticeActive || selectedOptionDetails.some(isVvsRelatedOption);
  const showElNotice = elNoticeActive || selectedOptionDetails.some(isElRelatedOption);
  const showSafetyNotice = showVvsNotice || showElNotice;
  const noticeBlocks = [
    ...(showSafetyNotice ? [{ title: safetyNoticeTitle, text: safetyNoticeText }] : []),
    ...(demolitionNoticeActive ? [{ title: demolitionSafetyNoticeTitle, text: demolitionSafetyNoticeText }] : []),
  ];
  const showNoticeBlock = noticeBlocks.length > 0;
  const content = [];
  let cursorY = 0;

  const rect = (x, y, width, height, color) => {
    content.push(`${color} rg ${x} ${y} ${width} ${height} re f`);
  };

  const line = (x1, y1, x2, y2, color = "1 1 1", width = 1) => {
    content.push(`${color} RG ${width} w ${x1} ${y1} m ${x2} ${y2} l S`);
  };

  const text = (value, x, y, size = 12, color = "1 1 1", font = "F1") => {
    content.push(`BT /${font} ${size} Tf ${color} rg ${x} ${y} Td ${toPdfText(value)} Tj ET`);
  };

  const image = (name, x, y, width, height) => {
    content.push(`q ${width} 0 0 ${height} ${x} ${y} cm /${name} Do Q`);
  };

  const money = (value) => formatPrice(value);
  const companyDetails = companyRows.slice(1).map(([label, value]) => `${label}: ${value}`);
  const projectRows = [
    ["Kategori", displayCategory],
    ["Projektstatus", projectStatus],
    ...(showArea ? [["Storlek", formatArea(area)]] : []),
    ...(showArea && areaMode === "dimensions" && deckDimensions ? [
      ["Mått", `${deckDimensions.length || 0} m × ${deckDimensions.width || 0} m`],
    ] : []),
    ["Antal personer", `${peopleCount} ${peopleCount === 1 ? "person" : "personer"}`],
    ["Arbetstid", formatHours(totalWorkHours)],
    ["Timpris/person", hourlyRateSummary],
    ["Uppskattad tid", estimatedCalendarTime],
    ...(startDate ? [
      ["Startdatum", formatLongDate(parseLocalDate(startDate))],
    ] : []),
    ...(startDate && estimatedEndDate ? [
      ["Beräknat slutdatum", estimatedEndDate],
    ] : []),
    ["Arbetskostnad", money(workPrice)],
    ...(discountActive ? [["Rabatt", `-${money(discountAmount)} (${discountPercent}%)`]] : []),
    ["Arbete efter rabatt", money(discountedWorkPrice)],
    ...(extraCostsTotal > 0 ? [["Extra kostnader", money(extraCostsTotal)]] : []),
    ...(fixedCostsDisplayTotal > 0 ? [["Fasta kostnader", money(fixedCostsDisplayTotal)]] : []),
    ["Offertpris", money(selectedOfferPrice)],
  ].filter(([, value]) => isPdfValueFilled(value));
  const socialRows = [
    companySettings.instagram && `Instagram: ${companySettings.instagram}`,
    companySettings.facebook && `Facebook: ${companySettings.facebook}`,
    companySettings.tiktok && `TikTok: ${companySettings.tiktok}`,
  ].filter(Boolean);
  const termsRows = [
    "Offerten baseras på angivna uppgifter och valda alternativ.",
    "Material, fasta kostnader och extra arbete redovisas separat där det är aktuellt.",
    "Slutlig omfattning kan justeras efter platsbesök eller ändrade förutsättningar.",
  ];
  const signatureRows = [
    ["För Marcin Bygg", "Kund"],
  ];

  const sectionTitle = (titleValue, y) => {
    text(titleValue.toUpperCase(), 48, y, 8, "0.98 0.57 0.24", "F2");
    line(48, y - 8, 547, y - 8, "0.22 0.22 0.24", 0.6);
  };

  const detailRows = (rows, x, y, width, maxRows = 4) => {
    let nextY = y;

    rows.slice(0, maxRows).forEach(([label, value]) => {
      const rowY = nextY;
      const valueLines = wrapPdfText(value, 26, 2);

      text(label, x, rowY, 6.7, "0.56 0.56 0.6");
      valueLines.forEach((lineText, lineIndex) => {
        text(lineText, x + width * 0.38, rowY - lineIndex * 9, 8, "1 1 1", "F2");
      });
      nextY -= Math.max(18, valueLines.length * 10 + 8);
    });

    return nextY;
  };

  const tableRows = (rows, startY, maxRows = 7) => {
    rows.slice(0, maxRows).forEach((row, index) => {
      const y = startY - index * 24;
      rect(48, y - 8, 499, 19, index % 2 === 0 ? "0.085 0.085 0.09" : "0.11 0.11 0.115");
      text(wrapPdfText(row.label, 40, 1)[0] || "", 62, y, 8, "0.68 0.68 0.72");
      text(wrapPdfText(row.value, 26, 1)[0] || "", 390, y, 8.5, "1 1 1", "F2");
      if (row.detail) {
        text(wrapPdfText(row.detail, 92, 1)[0] || "", 62, y - 9, 6.5, "0.45 0.45 0.5");
      }
    });
  };

  rect(0, 0, 595, 842, "0.015 0.015 0.018");
  rect(26, 26, 543, 790, "0.055 0.055 0.06");
  rect(26, 708, 543, 108, "0.12 0.055 0.018");
  rect(26, 705, 543, 3, "0.98 0.45 0.08");

  if (logoImage) {
    image("Logo", 48, 744, 54, 54);
  }
  if (companySettings.companyName) {
    text(companySettings.companyName, logoImage ? 118 : 48, 786, 13, "1 1 1", "F2");
  }
  companyDetails.slice(0, 2).forEach((detail, index) => {
    text(detail, logoImage ? 118 : 48, 768 - index * 12, 7.2, "0.76 0.76 0.8");
  });
  text("OFFERT", 444, 786, 18, "0.98 0.57 0.24", "F2");
  text(new Date().toLocaleDateString("sv-SE"), 455, 768, 8.5, "0.82 0.82 0.86");

  text(displayCategory, 48, 675, 22, "1 1 1", "F2");
  text(`${showArea ? `${formatArea(area)} · ` : ""}${peopleCount} ${peopleCount === 1 ? "person" : "personer"} · ${estimatedCalendarTime}`, 48, 654, 9.5, "0.72 0.72 0.76");
  rect(375, 632, 172, 54, "0.98 0.45 0.08");
  text("OFFERTPRIS", 392, 666, 8, "0 0 0", "F2");
  text(money(selectedOfferPrice), 392, 646, 17, "0 0 0", "F2");

  if (customerRows.length > 0) {
    rect(48, 520, 235, 108, "0.09 0.09 0.095");
    text("KUNDUPPGIFTER", 64, 606, 8, "0.98 0.57 0.24", "F2");
    detailRows(customerRows, 64, 586, 190);
  }
  if (companyRows.length > 0) {
    rect(312, 520, 235, 108, "0.09 0.09 0.095");
    text("FÖRETAGSUPPGIFTER", 328, 606, 8, "0.98 0.57 0.24", "F2");
    detailRows(companyRows, 328, 586, 185);
  }

  sectionTitle("Projekt & pris", 492);
  const pricingRows = projectRows.map(([label, value]) => ({ label, value }));
  tableRows(pricingRows, 470, 8);

  cursorY = 470 - Math.min(pricingRows.length, 8) * 24 - 20;
  const optionTableRows = optionRows.slice(0, 7).map((option) => ({
    label: formatOptionTitle(option.title),
    value: option.priceValue > 0 ? `+${money(option.priceValue)}` : "Ingår",
    detail: [option.sectionTitle, option.detailText].filter(Boolean).join(" · "),
  }));
  if (optionTableRows.length > 0 && cursorY > 180) {
    sectionTitle("Valda alternativ", cursorY);
    tableRows(optionTableRows, cursorY - 22, 7);
    cursorY = cursorY - 22 - Math.min(optionTableRows.length, 7) * 24 - 16;
  }
  if (extraCostRows.length > 0 && cursorY > 178) {
    sectionTitle("Extra kostnader", cursorY);
    tableRows(extraCostRows.slice(0, 3).map((cost) => ({
      label: cost.name || "Extra kostnad",
      value: `+${money(cost.priceValue)}`,
      detail: cost.description,
    })), cursorY - 22, 3);
    cursorY -= 98;
  }

  if (customer.notes && cursorY > 150) {
    sectionTitle("Anteckningar", cursorY);
    rect(48, cursorY - 66, 499, 43, "0.08 0.08 0.085");
    wrapPdfText(customer.notes, 95, 3).forEach((lineText, index) => {
      text(lineText, 64, cursorY - 40 - index * 12, 8.5, "0.9 0.9 0.92");
    });
    cursorY -= 84;
  }

  if (showNoticeBlock && cursorY > 126) {
    sectionTitle("Viktig information", cursorY);
    noticeBlocks.slice(0, 2).forEach((notice, noticeIndex) => {
      const y = cursorY - 24 - noticeIndex * 34;
      text(notice.title, 64, y, 7.5, "0.98 0.57 0.24", "F2");
      wrapPdfText(notice.text, 105, 2).forEach((lineText, index) => {
        text(lineText, 64, y - 11 - index * 10, 6.5, "0.78 0.76 0.72");
      });
    });
  }

  rect(48, 76, 499, 44, "0.08 0.08 0.085");
  termsRows.forEach((term, index) => {
    text(term, 64, 104 - index * 10, 6.5, "0.68 0.68 0.72");
  });
  if (socialRows.length > 0) {
    text(socialRows.join(" · "), 64, 64, 7, "0.98 0.57 0.24");
  }

  signatureRows.forEach(([leftLabel, rightLabel]) => {
    line(64, 50, 230, 50, "0.45 0.45 0.48", 0.6);
    line(360, 50, 526, 50, "0.45 0.45 0.48", 0.6);
    text(leftLabel, 64, 38, 7, "0.68 0.68 0.72");
    text(rightLabel, 360, 38, 7, "0.68 0.68 0.72");
  });

  return buildPdf(content.join("\n"), logoImage);
}

async function loadPdfLogoImage(companySettings = loadAppSettings()) {
  if (companySettings.logoDataUrl) {
    const logoBytes = dataUrlToBytes(companySettings.logoDataUrl);
    const parsedLogo = logoBytes ? parsePngForPdf(logoBytes) : null;

    if (parsedLogo) {
      return parsedLogo;
    }
  }

  if (loadPdfLogoImage.cache !== undefined) {
    return loadPdfLogoImage.cache;
  }

  try {
    const response = await fetch(marcinByggLogo);
    const buffer = await response.arrayBuffer();

    loadPdfLogoImage.cache = parsePngForPdf(new Uint8Array(buffer));
  } catch {
    loadPdfLogoImage.cache = null;
  }

  return loadPdfLogoImage.cache;
}

function parsePngForPdf(bytes) {
  const pngSignature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

  if (!pngSignature.every((byte, index) => bytes[index] === byte)) {
    return null;
  }

  let offset = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 8;
  let colorType = 2;
  const idatChunks = [];

  while (offset < bytes.length) {
    const length = readPngUint32(bytes, offset);
    const type = String.fromCharCode(bytes[offset + 4], bytes[offset + 5], bytes[offset + 6], bytes[offset + 7]);
    const dataStart = offset + 8;
    const dataEnd = dataStart + length;

    if (type === "IHDR") {
      width = readPngUint32(bytes, dataStart);
      height = readPngUint32(bytes, dataStart + 4);
      bitDepth = bytes[dataStart + 8];
      colorType = bytes[dataStart + 9];
    }

    if (type === "IDAT") {
      idatChunks.push(bytes.slice(dataStart, dataEnd));
    }

    if (type === "IEND") {
      break;
    }

    offset = dataEnd + 4;
  }

  if (!width || !height || bitDepth !== 8 || colorType !== 2 || idatChunks.length === 0) {
    return null;
  }

  const dataLength = idatChunks.reduce((total, chunk) => total + chunk.length, 0);
  const data = new Uint8Array(dataLength);
  let dataOffset = 0;

  idatChunks.forEach((chunk) => {
    data.set(chunk, dataOffset);
    dataOffset += chunk.length;
  });

  return {
    width,
    height,
    data,
  };
}

function dataUrlToBytes(dataUrl) {
  const [, base64 = ""] = String(dataUrl).split(",");

  if (!base64) {
    return null;
  }

  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

function readPngUint32(bytes, offset) {
  return ((bytes[offset] << 24) | (bytes[offset + 1] << 16) | (bytes[offset + 2] << 8) | bytes[offset + 3]) >>> 0;
}

function buildPdf(contentStream, logoImage) {
  const encoder = new TextEncoder();
  const streamLength = encoder.encode(contentStream).length;
  const hasLogo = Boolean(logoImage);
  const logoObjectNumber = 6;
  const contentObjectNumber = hasLogo ? 7 : 6;
  const xObjectResources = hasLogo ? ` /XObject << /Logo ${logoObjectNumber} 0 R >>` : "";
  const objects = [
    [`<< /Type /Catalog /Pages 2 0 R >>`],
    [`<< /Type /Pages /Kids [3 0 R] /Count 1 >>`],
    [`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >>${xObjectResources} >> /Contents ${contentObjectNumber} 0 R >>`],
    [`<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>`],
    [`<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>`],
  ];

  if (hasLogo) {
    objects.push([
      `<< /Type /XObject /Subtype /Image /Width ${logoImage.width} /Height ${logoImage.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /FlateDecode /DecodeParms << /Predictor 15 /Colors 3 /BitsPerComponent 8 /Columns ${logoImage.width} >> /Length ${logoImage.data.length} >>\nstream\n`,
      logoImage.data,
      "\nendstream",
    ]);
  }

  objects.push([`<< /Length ${streamLength} >>\nstream\n${contentStream}\nendstream`]);

  const pdfParts = ["%PDF-1.4\n"];
  const offsets = [0];
  let byteOffset = encoder.encode(pdfParts[0]).length;

  objects.forEach((objectParts, index) => {
    offsets.push(byteOffset);
    const header = `${index + 1} 0 obj\n`;
    const footer = "\nendobj\n";

    pdfParts.push(header);
    byteOffset += encoder.encode(header).length;

    objectParts.forEach((part) => {
      pdfParts.push(part);
      byteOffset += part instanceof Uint8Array ? part.length : encoder.encode(part).length;
    });

    pdfParts.push(footer);
    byteOffset += encoder.encode(footer).length;
  });

  const xrefOffset = byteOffset;
  let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    xref += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  xref += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  pdfParts.push(xref);

  return new Blob(pdfParts, {
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
  const { language } = useI18n();
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
      {translateText(children, language)}
    </button>
  );
}

