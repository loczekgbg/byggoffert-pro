/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export const supportedLanguages = ["pl", "sv", "en"];
export const defaultLanguage = "sv";
export const fallbackLanguage = "en";

const translationModules = import.meta.glob("./translations/*.json");
const translations = {};
const legacyTextCorrections = new Map([
  ["\x3ftg\x3fng", "\u00C5tg\u00E5ng"],
  ["Skruv & Spik\x3ftg\x3fng", "Skruv & Spik\u00E5tg\u00E5ng"],
  ["Klickgolv / Golv\x3ftg\x3fng", "Klickgolv / Golv\u00E5tg\u00E5ng"],
  ["Gips\x3ftg\x3fng", "Gips\u00E5tg\u00E5ng"],
  ["OSB / Plywood \x3ftg\x3fng", "OSB / Plywood \u00E5tg\u00E5ng"],
  ["Panel\x3ftg\x3fng", "Panel\u00E5tg\u00E5ng"],
  ["Betong\x3ftg\x3fng", "Betong\u00E5tg\u00E5ng"],
  ["\x3ftg\x3fng st/lm", "\u00C5tg\u00E5ng st/lm"],
  ["\x3ftg\x3fng st/m\x3f", "\u00C5tg\u00E5ng st/m\u00B2"],
  ["\x3ftg\x3fng kg/mm/m\x3f", "\u00C5tg\u00E5ng kg/mm/m\u00B2"],
]);

export const translationLoaders = Object.fromEntries(
  supportedLanguages.map((language) => [
    language,
    async () => {
      const module = await translationModules[`./translations/${language}.json`]();

      return module.default;
    },
  ]),
);

export async function loadTranslationBundle(language) {
  if (!supportedLanguages.includes(language)) {
    return {};
  }

  if (!translations[language]) {
    translations[language] = await translationLoaders[language]();
  }

  return translations[language];
}

function useTranslationBundles(language) {
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let active = true;

    Promise.all([
      loadTranslationBundle(fallbackLanguage),
      loadTranslationBundle(language),
    ]).then(() => {
      if (active) {
        setVersion((version) => version + 1);
      }
    });

    return () => {
      active = false;
    };
  }, [language]);

  return version;
}

const I18nContext = createContext({
  language: defaultLanguage,
  setLanguage: () => {},
  t: (value) => value,
  translationVersion: 0,
});

function dictionaryFor(language) {
  return translations[language] || translations[fallbackLanguage] || {};
}

function normalizeLegacyText(value) {
  return legacyTextCorrections.get(value) || value;
}

export function translateText(value, language = defaultLanguage) {
  if (typeof value !== "string") {
    return value;
  }

  const normalizedValue = normalizeLegacyText(value);
  const dictionary = dictionaryFor(language);
  const fallbackDictionary = dictionaryFor(fallbackLanguage);

  if (dictionary[normalizedValue]) {
    return dictionary[normalizedValue];
  }

  if (fallbackDictionary[normalizedValue]) {
    return fallbackDictionary[normalizedValue];
  }

  return normalizedValue;
}

export function I18nProvider({ children, language, setLanguage }) {
  const normalizedLanguage = supportedLanguages.includes(language)
    ? language
    : defaultLanguage;
  const translationVersion = useTranslationBundles(normalizedLanguage);
  const t = useCallback((value) => translateText(value, normalizedLanguage), [normalizedLanguage]);
  const contextValue = useMemo(() => ({
    language: normalizedLanguage,
    setLanguage,
    t,
    translationVersion,
  }), [normalizedLanguage, setLanguage, t, translationVersion]);

  return (
    <I18nContext.Provider value={contextValue}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}

export function T({ children }) {
  const { t } = useI18n();

  return t(children);
}

export function LanguageToggle() {
  const { language, setLanguage } = useI18n();

  return (
    <div className="relative z-20 grid grid-cols-3 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-1 text-xs font-black">
      {[
        ["pl", "PL"],
        ["sv", "SV"],
        ["en", "EN"],
      ].map(([id, label]) => (
        <button
          key={id}
          type="button"
          onClick={() => setLanguage(id)}
          className={`min-h-10 px-3 transition ${
            language === id
              ? "rounded-xl bg-orange-500 text-black"
              : "text-zinc-300"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
