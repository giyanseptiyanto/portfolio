# Giyan Septiyanto — Personal Portfolio

Responsive single-page portfolio built with HTML5, Tailwind CSS v4, custom CSS, and vanilla JavaScript.

## Features

- Responsive layouts for mobile, tablet, laptop, and desktop.
- Light and dark themes. New visitors see light mode by default; a manual selection is saved.
- Three language modes, with **English (`EN`) as the first-visit default**:
  - `EN`: full English.
  - `ID`: full Indonesian.
  - `ID/EN`: English navigation, headings, labels, categories, and buttons with Indonesian descriptions.
- Project category filters, desktop More dropdown, mobile navigation, certificate preview links, native project notes, and reveal animations.
- Visual & Graphic Design gallery with four artwork previews.
- Separate professional experience, organizational experience, education, and certifications sections.

## Project structure

```text
giyan-portfolio/
├── index.html
├── package.json
├── README.md
├── src/
│   └── input.css
├── assets/
│   ├── css/
│   │   ├── style.css
│   │   └── tailwind.generated.css
│   ├── js/
│   │   ├── main.js
│   │   ├── languages.js
│   │   └── projects.js
│   └── images/
└── scripts/
    └── check-translations.mjs
```

## Preview locally

1. Extract the ZIP.
2. Open the project folder in VS Code.
3. Run `index.html` with Live Server or another static server.

The page uses the locally generated Tailwind stylesheet. It does not require the Tailwind Browser CDN at runtime.

## Build and checks

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run build
npm run check
```

- `npm run build` compiles Tailwind utilities into `assets/css/tailwind.generated.css`.
- `npm run dev:css` watches the HTML and JavaScript source files and rebuilds CSS when utility classes change.
- `npm run check:js` runs Node syntax checks on all JavaScript files.
- `npm run check:translations` verifies that every `data-i18n` key in `index.html` exists in the Indonesian, English, and hybrid dictionaries.
- `npm run check` runs both JavaScript and translation checks.

## CSS responsibilities

- `src/input.css` is the Tailwind v4 entry point. It imports Tailwind, declares source paths, and defines shared design tokens.
- `assets/css/tailwind.generated.css` is generated output. Do not edit it manually; rebuild it with `npm run build`.
- `assets/css/style.css` contains custom theme variables, components, responsive refinements, and animations.

## Language system

Language dictionaries are maintained in `assets/js/languages.js` under `id`, `en`, and `hybrid`. The language selector values use those same names.

The hybrid `ID/EN` mode is a real translation dictionary, not a restore of the initial HTML. It uses English for navigation, section headings, labels, categories, project titles, and buttons while retaining Indonesian descriptions. When adding a new `data-i18n` attribute to `index.html`, add its translation to all three dictionaries and run `npm run check:translations`.

The selected language is saved in `localStorage` under `giyan-language-v4`. New visitors, and visitors without a v4 preference, start in English. Older v3 preferences are intentionally not migrated so the updated default takes effect once.

## Certificate links

In `index.html`, find a certificate panel using its `data-certificate-name` value and fill `data-certificate-url` with the public certificate URL. Empty links stay disabled intentionally.

Certificate panel names:

- `organization_dpm` — Dewan Perwakilan Mahasiswa Fakultas
- `organization_expo` — UI Vocational Expo
- `organization_hima` — Himpunan Mahasiswa Sistem Informasi
- `cert_bnsp` — BNSP Junior Graphic Designer
- `cert_revou` — RevoU

To replace a preview image, save the certificate image in `assets/images/` and update the matching image `src` in `index.html`. For a PDF certificate, use an image as the preview and the PDF URL as the link.

## Hero contact button

The former CV-request button now reads `Get in touch` in English and links to the Contact section. It no longer sends a prefilled CV request email or implies that a downloadable CV is available.

## Before publishing

- Run `npm run build` and `npm run check`.
- Test all project URLs, certificate links, and contact methods.
- Test all three language modes and both themes.
- Review desktop, tablet, and mobile layouts.
- Confirm that the Pexels-hosted insight images load while online and keep the visible photographer credits.
- Replace any remaining placeholder artwork or certificate preview with the original asset when available.

## Update v2.9.0

- Fixed the `ID/EN` language mode. The selector uses the value `hybrid`, while the previous dictionary was named `hy`; the mismatch caused the app to restore the initial HTML instead of applying the mixed-language dictionary.
- Renamed the dictionary to `hybrid` so the select value, startup state, and translation lookup use one consistent key.
- Removed the HTML snapshot/restore translation path. All three modes now use the same `data-i18n` translation flow.
- Updated the hybrid dictionary to retain current Indonesian descriptions and the latest RUN GAMES NFT artwork copy.
- Added missing Registry Magazine article translations to all three language dictionaries.
- Updated the page title and meta descriptions when the visitor changes language.
- Fixed migration of the older saved Indonesian preference and added cache-busting query strings to local CSS and JavaScript references.
- Added a translation integrity check to `npm run check`.


## v23 updates

- Reworked the Notes section into short practical insights about UX decision-making (Hick’s Law), workflow documentation, personal cash flow, and clear website calls to action.
- Set the first-visit language preference to ID/EN (hybrid) using the `giyan-language-v3` storage key. A visitor's later manual language selection is still remembered.
- Updated asset cache query versions to v23.


## Update v3.1.0

- Set English as the default language for new visitors using the `giyan-language-v4` preference key. Existing saved preferences from older keys are not migrated, so the English default takes effect after this update; later manual selections are remembered.
- Replaced the awkward `Request CV` / `Minta CV` hero action with `Get in touch` / `Hubungi saya`, linking to the Contact section instead of sending a prefilled CV request email.
- Added four natural stock photographs to the Insights cards, sourced from Pexels. Each card includes descriptive alt text and a visible photographer/source credit linking to the original Pexels photo page. Images are loaded from the Pexels CDN, so visitors need an internet connection to see them.
- Added responsive image framing for the Insights cards and balanced the four-card grid without changing the existing insight copy.


## v25.1 — Certificate link status fix

- Fixed DPM Faculty and Information Systems Student Association certificate cards. Their Drive URLs were already present in `data-certificate-url`, but the markup still used `href="#"`, `aria-disabled="true"`, the pending CSS class, and the pending translation key.
- The cards now use their actual Drive URLs and the ready-state label (`organization_view_certificate`).
- `initializeCertificateLinks()` now synchronizes the visible label with the actual URL state, so a populated URL cannot continue to display “Certificate link has not been added”.
- UI Vocational Expo, BNSP, and RevoU certificate links are preserved.
