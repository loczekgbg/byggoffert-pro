/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from "react";

const translations = {
  pl: {
    // Main navigation
    "Professionell snickarservice för hem och företag.": "Profesjonalne usługi stolarsko-budowlane dla domów i firm.",
    "Skapa nytt kostnadsförslag": "Utwórz nową wycenę",
    "Historik": "Historia",
    "Sparade offerter": "Zapisane oferty",
    "Kunder": "Klienci",
    "Hantera kunder": "Zarządzaj klientami",
    "Material": "Materiały",
    "Priser & material": "Ceny i materiały",
    "KONTAKTA MIG IDAG": "SKONTAKTUJ SIĘ DZISIAJ",
    "Välj kategori": "Wybierz kategorię",
    "Professionell tjänst": "Profesjonalna usługa",
    "Kostnadsberäkning": "Kalkulacja kosztów",

    // Common actions
    "Spara offert": "Zapisz ofertę",
    "Spara ändringar": "Zapisz zmiany",
    "Exportera PDF": "Eksportuj PDF",
    "Ny offert för kunden": "Nowa oferta dla klienta",
    "Ny offert": "Nowa oferta",
    "Öppna": "Otwórz",
    "Redigera": "Edytuj",
    "Öppna / Redigera": "Otwórz / Edytuj",
    "Ta bort": "Usuń",
    "Avbryt": "Anuluj",
    "Bekräfta": "Potwierdź",
    "Ta bort offert?": "Usunąć ofertę?",

    // Categories
    "Målning & Tapeter": "Malowanie i tapetowanie",
    "Målning & Tapetsering": "Malowanie i tapetowanie",
    "Innerväggar & Innertak": "Ściany i sufity wewnętrzne",
    "Golv & Lister": "Podłogi i listwy",
    "Fönster & Dörrar": "Okna i drzwi",
    "Kök & Garderob": "Kuchnia i garderoba",
    "Altan, Pergola & Staket": "Taras, pergola i ogrodzenie",
    "Altan & Pergola": "Taras i pergola",
    "Altan & Staket": "Taras i ogrodzenie",
    "Pergola & Staket": "Pergola i ogrodzenie",
    "Altan": "Taras",
    "Pergola": "Pergola",
    "Staket": "Ogrodzenie",
    "Rivning": "Rozbiórka",
    "Konstruktion": "Konstrukcja",
    "Övrigt arbete": "Pozostałe prace",
    "Målning": "Malowanie",
    "Tapetsering": "Tapetowanie",
    "Snickerimålning": "Malowanie stolarki",
    "Fasadmålning": "Malowanie elewacji",
    "Trappmålning": "Malowanie schodów",
    "Innerväggar": "Ściany wewnętrzne",
    "Fiskbensparkett": "Parkiet w jodełkę",
    "Parkettläggning": "Układanie parkietu",
    "Fönster": "Okna",
    "Dörrar": "Drzwi",
    "Garderob": "Garderoba",
    "Kök": "Kuchnia",

    // Sections
    "Förarbete": "Prace przygotowawcze",
    "Färgtyp & Svårighetsgrad": "Typ koloru i poziom trudności",
    "Skydd & förberedelse": "Zabezpieczenie i przygotowanie",
    "Ventilation & Fläkt": "Wentylacja i okap",
    "Fläkt / Ventilation": "Okap / wentylacja",
    "Extra": "Dodatki",
    "Fönster - Komplettering": "Okna - uzupełnienia",
    "Vitvaror": "Sprzęty AGD",
    "Komplettering": "Uzupełnienia",
    "Väggar": "Ściany",
    "Innertak": "Sufity wewnętrzne",
    "Golvläggning": "Układanie podłóg",
    "Lister": "Listwy",
    "Räcken": "Balustrady",
    "Tillägg": "Dodatki",
    "Staket & Räcken": "Ogrodzenia i balustrady",
    "Material & Logistik": "Materiał i logistyka",

    // Calculator labels
    "Kunduppgifter": "Dane klienta",
    "Namn": "Imię i nazwisko",
    "Telefon": "Telefon",
    "Adress": "Adres",
    "Anteckningar": "Notatki",
    "Bemanning": "Obsada",
    "Timpris per person multipliceras med antal personer.": "Stawka godzinowa za osobę jest mnożona przez liczbę osób.",
    "Tillgänglig arbetstid": "Dostępny czas pracy",
    "Startdatum": "Data rozpoczęcia",
    "Timmar per vardagskväll": "Godziny na wieczór w dni robocze",
    "Antal vardagskvällar per vecka": "Liczba wieczorów roboczych w tygodniu",
    "Timmar per helgdag": "Godziny na dzień weekendowy",
    "Antal helgdagar per vecka": "Liczba dni weekendowych w tygodniu",
    "Uppskattad tid": "Szacowany czas",
    "Tid på plats": "Czas na miejscu",
    "Beräknat slutdatum": "Szacowana data zakończenia",
    "Extra arbete": "Dodatkowa praca",
    "Lägg till extra timmar utanför standardofferten.": "Dodaj dodatkowe godziny poza standardową ofertą.",
    "Timpris per person": "Stawka godzinowa za osobę",
    "Tillfällig extra personal": "Tymczasowy dodatkowy personel",
    "Antal extra personer": "Liczba dodatkowych osób",
    "Kostnad per person internt": "Koszt wewnętrzny za osobę",
    "Pris till kund per person": "Cena dla klienta za osobę",
    "Intern kostnad": "Koszt wewnętrzny",
    "Vinst / marginal": "Zysk / marża",
    "Extra kostnader": "Dodatkowe koszty",
    "Lägg till egna kostnader som inte påverkas av rabatt.": "Dodaj własne koszty, których nie obejmuje rabat.",
    "Lägg till kostnad": "Dodaj koszt",
    "Rabatt": "Rabat",
    "Lägg till rabatt": "Dodaj rabat",
    "Rabatt %": "Rabat %",
    "Rabatt på arbete": "Rabat na robociznę",
    "Pris till offert": "Cena do oferty",
    "Välj vilket pris som ska användas i PDF och sparad offert.": "Wybierz cenę używaną w PDF i zapisanej ofercie.",
    "Arbete före rabatt": "Robocizna przed rabatem",
    "Arbete efter rabatt": "Robocizna po rabacie",
    "Fasta kostnader": "Koszty stałe",
    "Offertpris": "Cena oferty",
    "Antal personer": "Liczba osób",
    "Arbetskostnad": "Koszt robocizny",
    "Offertöversikt": "Podsumowanie oferty",
    "Kund": "Klient",
    "Valda alternativ": "Wybrane opcje",
    "Storlek m²": "Powierzchnia m²",
    "Mått": "Wymiary",
    "Slutdatum": "Data zakończenia",
    "Datum": "Data",
    "Total offertvärde": "Łączna wartość ofert",
    "Offerter": "Oferty",
    "Kundregister": "Baza klientów",
    "Inga kunder": "Brak klientów",
    "Kundlistan är tom": "Lista klientów jest pusta",
    "Kunder skapas automatiskt när du sparar en offert.": "Klienci są tworzeni automatycznie po zapisaniu oferty.",
    "Kundprofil": "Profil klienta",
    "Kunden finns inte längre": "Klient już nie istnieje",
    "Sista aktivitet": "Ostatnia aktywność",
    "Antal offerter": "Liczba ofert",
    "Arbetshistorik": "Historia prac",
    "Inga offerter": "Brak ofert",
    "Historiken är tom": "Historia jest pusta",
    "Sparade offerter visas här när du trycker på Spara offert.": "Zapisane oferty pojawią się tutaj po kliknięciu Zapisz ofertę.",
    "Inga valda alternativ": "Brak wybranych opcji",
    "Inte angivet": "Nie podano",
    "Inga anteckningar": "Brak notatek",
    "Ej angivet": "Nie podano",
    "Ingår": "W cenie",
    "person": "osoba",
    "personer": "osoby",
    "timmar": "godz.",
    "vecka": "tydzień",
    "veckor": "tygodnie",
    "dag": "dzień",
    "dagar": "dni",
    "ca": "ok.",
    "Beskrivning": "Opis",
    "Pris": "Cena",
    "Extra kostnad": "Dodatkowy koszt",
    "Lägg till tillfällig extra personal": "Dodaj tymczasowy dodatkowy personel",
    "Minska värde": "Zmniejsz wartość",
    "Öka värde": "Zwiększ wartość",
    "h/vecka": "h/tydzień",
    "Senast": "Ostatnio",
    "Start": "Start",
    "Längd": "Długość",
    "Yta": "Powierzchnia",
    "Kostnad": "Koszt",
    "Ta bort kostnad": "Usuń koszt",
    "Dessa kostnader påverkas inte av rabatt.": "Tych kosztów nie obejmuje rabat.",
    "Egna kostnader utan rabatt och utan arbetstid.": "Własne koszty bez rabatu i bez czasu pracy.",
    "Används för att räkna kalendertid kvällar och helger.": "Używane do liczenia czasu kalendarzowego wieczorami i w weekendy.",
    "Lägg till extra personal för ett begränsat antal timmar.": "Dodaj dodatkową osobę na ograniczoną liczbę godzin.",
    "Offerten tas bort från kundens historik och från Historik.": "Oferta zostanie usunięta z historii klienta i z Historii.",
    "Offerten för {name} tas bort permanent från historiken.": "Oferta dla {name} zostanie trwale usunięta z historii.",
    "Min": "Min",
    "Normal": "Normalna",
    "VVS & ELINSTALLATION INGÅR EJ": "INSTALACJE VVS I ELEKTRYCZNE NIE SĄ WLICZONE",
    "Anslutning av vatten, avlopp och fast elinstallation utförs av behörig installatör. Elektrisk anslutning utförs endast om färdigt eluttag och stickkontakt finns.": "Podłączenie wody, odpływu i stałej instalacji elektrycznej wykonuje uprawniony instalator. Podłączenie elektryczne jest wykonywane tylko wtedy, gdy istnieje gotowe gniazdko i wtyczka.",

    // Pricing inputs
    "Fast pris": "Cena stała",
    "Timpris": "Stawka godzinowa",
    "Pris/styck": "Cena/szt.",
    "Pris/löpmeter": "Cena/metr bieżący",
    "Längd i löpmeter": "Długość w metrach bieżących",
    "Antal stycken": "Liczba sztuk",
    "Antal skåp": "Liczba szafek",
    "Pris per skåp": "Cena za szafkę",
    "Antal stommar": "Liczba korpusów",
    "Pris per stomme": "Cena za korpus",
    "Antal steg": "Liczba stopni",
    "Pris per steg": "Cena za stopień",
    "Uppskattad tid på plats": "Szacowany czas na miejscu",
    "Yta m²": "Powierzchnia m²",
    "Fasad m²": "Elewacja m²",
    "Längd (m)": "Długość (m)",
    "Bredd (m)": "Szerokość (m)",
    "Höjd (m)": "Wysokość (m)",
    "Ange m² manuellt": "Wpisz m² ręcznie",
    "Beräkna från mått": "Oblicz z wymiarów",
    "Standard": "Standard",
    "Premium": "Premium",

    // Option/service names
    "Spackling av ytor": "Szpachlowanie powierzchni",
    "Slipning av ytor": "Szlifowanie powierzchni",
    "Grundmålning av ytor": "Gruntowanie powierzchni",
    "Maskering inför målning": "Maskowanie przed malowaniem",
    "Rivning av gammal tapet": "Usunięcie starej tapety",
    "Målning av väggar": "Malowanie ścian",
    "Målning av tak": "Malowanie sufitu",
    "Målning av snickerier": "Malowanie stolarki",
    "Målning av trappa": "Malowanie schodów",
    "Målning av fasad": "Malowanie elewacji",
    "Tvätt av fasad": "Mycie elewacji",
    "Skrapning av fasad": "Skrobanie elewacji",
    "Grundmålning av fasad": "Gruntowanie elewacji",
    "Tapetsering med standardtapet": "Tapetowanie tapetą standardową",
    "Tapetsering med mönsterpassning": "Tapetowanie z pasowaniem wzoru",
    "Tapetsering med svår tapet": "Tapetowanie trudną tapetą",
    "Målning med ljus färg": "Malowanie jasnym kolorem",
    "Målning med standardfärg": "Malowanie standardowym kolorem",
    "Målning med mörk färg": "Malowanie ciemnym kolorem",
    "Målning med flera färger": "Malowanie wieloma kolorami",
    "Målning av accentvägg": "Malowanie ściany akcentowej",
    "Täckning av golv med skyddspapp": "Zabezpieczenie podłogi papierem ochronnym",
    "Täckning av möbler med plast / folie": "Zabezpieczenie mebli folią",
    "Maskering inför arbete": "Maskowanie przed pracą",
    "Montering av dammskydd / avgränsning": "Montaż osłony przeciwpyłowej / odgrodzenia",
    "Städning efter arbete": "Sprzątanie po pracy",
    "Montering av köksfläkt": "Montaż okapu kuchennego",
    "Anslutning till ventilation": "Podłączenie do wentylacji",
    "Anpassning av ventilationsrör": "Dopasowanie rury wentylacyjnej",
    "Håltagning för ventilation": "Wykonanie otworu pod wentylację",
    "Montering av kolfilterfläkt": "Montaż okapu z filtrem węglowym",
    "Justering / tätning av ventilation": "Regulacja / uszczelnienie wentylacji",
    "Skydd av möbler": "Zabezpieczenie mebli",
    "Materialinköp": "Zakup materiału",
    "Materialhantering": "Obsługa materiału",
    "Bortforsling av avfall": "Wywóz odpadów",
    "Hyra av ställning": "Wynajem rusztowania",
    "Hyra av lift": "Wynajem podnośnika",
    "Byte av fönster": "Wymiana okna",
    "Montering av litet fönster": "Montaż małego okna",
    "Montering av standardfönster": "Montaż standardowego okna",
    "Montering av stort fönster": "Montaż dużego okna",
    "Montering av fast fönster": "Montaż okna stałego",
    "Montering av öppningsbart fönster": "Montaż okna otwieranego",
    "Justering av fönster": "Regulacja okna",
    "Rivning av gamla fönster": "Demontaż starych okien",
    "Anpassning av öppning för fönster": "Dopasowanie otworu pod okno",
    "Montering av enkel innerdörr": "Montaż pojedynczych drzwi wewnętrznych",
    "Montering av dubbel innerdörr": "Montaż podwójnych drzwi wewnętrznych",
    "Montering av enkel ytterdörr": "Montaż pojedynczych drzwi zewnętrznych",
    "Montering av dubbel ytterdörr": "Montaż podwójnych drzwi zewnętrznych",
    "Montering av altandörr": "Montaż drzwi tarasowych",
    "Montering av skjutdörr": "Montaż drzwi przesuwnych",
    "Byte av dörrkarm": "Wymiana ościeżnicy",
    "Montering av lås / handtag": "Montaż zamka / klamki",
    "Justering av dörr": "Regulacja drzwi",
    "Rivning av gamla dörrar": "Demontaż starych drzwi",
    "Anpassning av öppning för dörr": "Dopasowanie otworu pod drzwi",
    "Montering av fönsterbleck": "Montaż parapetu zewnętrznego",
    "Montering av smygar": "Montaż glifów",
    "Montering av foder": "Montaż opasek",
    "Drevning / isolering av fönster": "Uszczelnienie / izolacja okna",
    "Fogning / silikon runt fönster": "Fugowanie / silikon wokół okna",
    "Målning av foder / smygar": "Malowanie opasek / glifów",
    "Montering av väggskåp": "Montaż szafek wiszących",
    "Montering av bänkskåp": "Montaż szafek dolnych",
    "Montering av högskåp": "Montaż wysokich szafek",
    "Montering / ihopskruvning av IKEA-skåp": "Montaż / skręcanie szafek IKEA",
    "Montering av bänkskiva": "Montaż blatu",
    "Anpassning av bänkskiva": "Dopasowanie blatu",
    "Håltagning i bänkskiva för blandare": "Otwór w blacie pod baterię",
    "Håltagning i bänkskiva för diskho": "Otwór w blacie pod zlew",
    "Håltagning i bänkskiva för spishäll": "Otwór w blacie pod płytę grzewczą",
    "Silikon / tätning runt spishäll": "Silikon / uszczelnienie wokół płyty",
    "Montering av diskho": "Montaż zlewu",
    "Montering av blandare utan VVS-anslutning": "Montaż baterii bez podłączenia VVS",
    "Montering av handtag": "Montaż uchwytów",
    "Rivning av gammalt kök": "Demontaż starej kuchni",
    "Anpassning av vägg / öppning i kök": "Dopasowanie ściany / otworu w kuchni",
    "Justering av kök": "Regulacja kuchni",
    "Montering av fristående vitvara": "Montaż wolnostojącego AGD",
    "Montering av integrerad diskmaskin": "Montaż zintegrowanej zmywarki",
    "Montering av integrerad kyl / frys": "Montaż zintegrowanej lodówki / zamrażarki",
    "Montering av inbyggd ugn / mikro": "Montaż piekarnika / mikrofalówki do zabudowy",
    "Montering av spishäll": "Montaż płyty grzewczej",
    "Justering av luckor / fronter": "Regulacja drzwiczek / frontów",
    "Montering av garderob": "Montaż garderoby",
    "Montering / ihopskruvning av garderob": "Montaż / skręcanie garderoby",
    "Montering av skjutdörrar": "Montaż drzwi przesuwnych",
    "Montering av PAX / platsbyggd garderob": "Montaż PAX / garderoby na wymiar",
    "Montering av inredning / hyllor / lådor": "Montaż wyposażenia / półek / szuflad",
    "Anpassning av garderob": "Dopasowanie garderoby",
    "Anpassning mot vägg / tak / golv": "Dopasowanie do ściany / sufitu / podłogi",
    "Montering av passbitar / täcksidor": "Montaż blend / paneli maskujących",
    "Rivning av gammal garderob": "Demontaż starej garderoby",
    "Silikon / fogning i kök eller garderob": "Silikon / fugowanie w kuchni lub garderobie",
    "Montering av socklar": "Montaż cokołów",
    "Montering av passbitar": "Montaż blend",
    "Montering av belysning": "Montaż oświetlenia",
    "Montering av bänkbelysning": "Montaż oświetlenia podszafkowego",
    "Montering av LED-list under skåp": "Montaż listwy LED pod szafkami",
    "Anpassning / kabeldragning för bänkbelysning": "Dopasowanie / prowadzenie przewodów dla oświetlenia",
    "Montering av transformator / driver": "Montaż transformatora / drivera",
    "Målning / finish": "Malowanie / wykończenie",
    "Byggnation av regelvägg": "Budowa ściany szkieletowej",
    "Montering av gipsvägg": "Montaż ściany gipsowej",
    "Montering av OSB + gips": "Montaż OSB + gips",
    "Montering av isolering i vägg": "Montaż izolacji w ścianie",
    "Rivning av vägg": "Rozbiórka ściany",
    "Montering av gipstak": "Montaż sufitu gipsowego",
    "Montering av paneltak": "Montaż sufitu panelowego",
    "Montering av sänkt tak": "Montaż sufitu podwieszanego",
    "Montering av spotlights": "Montaż spotów",
    "Montering av isolering i tak": "Montaż izolacji w suficie",
    "Rivning av gammalt tak": "Rozbiórka starego sufitu",
    "Läggning av klickgolv / laminat inkl. montering av lätta golvlister": "Układanie klik-podłogi / laminatu z montażem prostych listew",
    "Läggning av trägolv": "Układanie podłogi drewnianej",
    "Läggning av parkett": "Układanie parkietu",
    "Läggning av fiskben / avancerat mönster": "Układanie jodełki / zaawansowanego wzoru",
    "Rivning av gammalt golv": "Demontaż starej podłogi",
    "Montering av underlag / foam / lumppapp": "Montaż podkładu / foam / lumppapp",
    "Montering av spånskiva": "Montaż płyty wiórowej",
    "Nivellering / riktning av golv": "Poziomowanie / prostowanie podłogi",
    "Flytspackling av golv": "Wylewka samopoziomująca",
    "Montering av svåra golvlister / många kapningar": "Montaż trudnych listew / wielu docinek",
    "Montering av trösklar": "Montaż progów",
    "Anpassning runt dörrar / rör": "Dopasowanie wokół drzwi / rur",
    "Byte av trall": "Wymiana desek tarasowych",
    "Reparation av altan": "Naprawa tarasu",
    "Byggnation av ny stomme": "Budowa nowej konstrukcji",
    "Rivning av gammal altan / trall": "Rozbiórka starego tarasu / desek",
    "Inga räcken": "Bez balustrad",
    "Montering av enkla räcken": "Montaż prostych balustrad",
    "Montering av premiumräcken": "Montaż balustrad premium",
    "Montering av pergolatak": "Montaż dachu pergoli",
    "Montering av enkel trappa": "Montaż prostych schodów",
    "Markförberedelse för altan": "Przygotowanie gruntu pod taras",
    "Olja och träskyddsbehandling": "Olejowanie i impregnacja drewna",
    "Byggnation av komplicerad altan": "Budowa skomplikowanego tarasu",
    "Montering av LED-belysning": "Montaż oświetlenia LED",
    "Övrigt / diverse snickeriarbete": "Pozostałe / różne prace stolarskie",
    "Byggnation av platsbyggt trästaket": "Budowa drewnianego ogrodzenia na miejscu",
    "Montering av färdiga staketsektioner": "Montaż gotowych sekcji ogrodzenia",
    "Montering av insynsskydd": "Montaż osłony prywatności",
    "Montering av spjälstaket": "Montaż ogrodzenia szczebelkowego",
    "Montering av staket med grind": "Montaż ogrodzenia z furtką",
    "Rivning av gammalt staket": "Rozbiórka starego ogrodzenia",
    "Målning / olja av staket": "Malowanie / olejowanie ogrodzenia",
    "Montering av stolpar i mark": "Montaż słupków w gruncie",
    "Montering av betongplint": "Montaż betonowych stóp",
    "Kund står för material": "Materiał po stronie klienta",
    "Leverans från butik": "Dostawa ze sklepu",
    "Släpvagn": "Przyczepa",
    "Montering av trappa": "Montaż schodów",
    "Montering av pergola": "Montaż pergoli"
  },
  sv: {},
};

const I18nContext = createContext({
  language: "sv",
  setLanguage: () => {},
  t: (value) => value,
});

export function translateText(value, language = "sv") {
  if (typeof value !== "string" || language === "sv") {
    return value;
  }

  const dictionary = translations[language] || {};

  if (dictionary[value]) {
    return dictionary[value];
  }

  let translated = value;

  Object.entries(dictionary)
    .sort((first, second) => second[0].length - first[0].length)
    .forEach(([source, target]) => {
      translated = translated.replaceAll(source, target);
    });

  return translated;
}

export function I18nProvider({ children, language, setLanguage }) {
  const t = (value) => translateText(value, language);

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
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
    <div className="relative z-20 grid grid-cols-2 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-1 text-xs font-black">
      {[
        ["pl", "PL"],
        ["sv", "SV"],
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
