# Studio Figura Andrespol

Statyczna strona wizerunkowa **Studio Figura Andrespol** - nowoczesnego gabinetu łączącego fitness, wellness i kosmetologię estetyczną w Wiśniowej Górze pod Andrespolem.
Bez frameworków, bez bundlera - czysty HTML, CSS i JavaScript.

```
├── index.html                  - strona główna (hero + zabiegi + proces + galeria + dlaczego my + CTA)
├── oferta.html                 - opis czterech kategorii zabiegów (modelowanie, HIFU, LipoHIFU, kosmetologia)
├── realizacje.html             - galeria wnętrz studia
├── o-pracowni.html             - o studiu, proces współpracy, wartości
├── faq.html                    - najczęściej zadawane pytania (z FAQPage JSON-LD)
├── kontakt.html                - dane kontaktowe i formularz
├── polityka-prywatnosci.html   - polityka prywatności (RODO)
├── regulamin.html              - regulamin współpracy
├── style.css                   - pełny design system (biel + pomarańcz)
├── main.js                     - nawigacja, animacje, cookies, galeria zdjęć
├── assets/
│   └── favicon.svg             - favicon
├── photos/                     - placeholdery zdjęć (do podmiany)
└── vercel.json                 - konfiguracja Vercel (nagłówki, cache)
```

## Dane kontaktowe firmy

- **Studio Figura Andrespol**
- Adres: Tuszyńska 107a, 95-020 Wiśniowa Góra
- Telefon: +48 661 661 025
- E-mail: sf.andrespol@gmail.com
- Instagram: [@studio.figura.andrespol](https://www.instagram.com/studio.figura.andrespol/)

## Zdjęcia

W katalogu `photos/` znajdują się placeholdery o nazwach semantycznych:

- `hero-studio.{webp,avif}` - zdjęcie tła w hero na stronie głównej
- `modelowanie.{webp,avif}` - strefa modelowania sylwetki
- `hifu.{webp,avif}` - stanowisko HIFU
- `lipohifu.{webp,avif}` - stanowisko LipoHIFU
- `kosmetologia.{webp,avif}` - strefa kosmetologii estetycznej
- `recepcja.{webp,avif}` - recepcja i wnętrze studia
- `salon-wnetrze.{webp,avif}` - inne wnętrza

Aby podmienić zdjęcia, wystarczy umieścić nowe pliki pod tymi samymi nazwami w katalogu `photos/`.

## Uruchomienie lokalnie

Strona jest w pełni statyczna - wystarczy otworzyć `index.html`
w przeglądarce lub wystawić lokalny serwer:

```bash
python3 -m http.server 5173   # albo: npx serve .
```

Otwórz <http://localhost:5173>.

## Wdrożenie na Vercel

### Opcja A - przez GUI
1. Zaloguj się na <https://vercel.com> i kliknij **Add New → Project**.
2. Zaimportuj to repozytorium.
3. W kroku *Configure Project*:
   - **Framework Preset:** `Other`
   - **Root Directory:** `.`
   - **Build Command:** *(pozostaw puste)*
   - **Output Directory:** *(pozostaw puste)*
4. Kliknij **Deploy**.

### Opcja B - z linii poleceń

```bash
npm i -g vercel
vercel           # pierwsza konfiguracja (link / create)
vercel --prod    # wdrożenie produkcyjne
```

`vercel.json` w katalogu głównym repozytorium konfiguruje nagłówki bezpieczeństwa i cache.

## Branding

- **Kolory:** biel (#FFFFFF) jako tło, pomarańcz (#F26B1A) jako kolor wiodący.
- **Typografia:** Satoshi (display + body), Inter Tight (UI).
- **Cookies:** baner z trzema opcjami i modal kategorii (niezbędne, analityczne, marketingowe). Wybór trafia do `localStorage` pod kluczem `sf_andrespol_cookie_consent_v1`.
- **RWD:** breakpointy 1024/768/600 px, mobilny drawer.
- **Dostępność:** `aria-label`, redukcja animacji przy `prefers-reduced-motion`, focus states.

---

Strona stworzona przez [kontaktio.pl](https://kontaktio.pl).
