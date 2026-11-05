import fs from "node:fs";

const html = fs.readFileSync("./index.html", "utf8");
const languageSource = fs.readFileSync("./assets/js/languages.js", "utf8");
const languageJson = languageSource
  .replace(/^\s*window\.portfolioLanguages\s*=\s*/, "")
  .replace(/;\s*$/, "");
const dictionaries = JSON.parse(languageJson);

const requiredLanguages = ["id", "en", "hybrid"];
const htmlKeys = new Set(
  [...html.matchAll(/data-i18n=["']([^"']+)["']/g)].map((match) => match[1])
);
const errors = [];

for (const language of requiredLanguages) {
  const dictionary = dictionaries[language];

  if (!dictionary) {
    errors.push(`Missing language dictionary: ${language}`);
    continue;
  }

  for (const key of htmlKeys) {
    if (typeof dictionary[key] !== "string") {
      errors.push(`Missing translation: ${language}.${key}`);
    }
  }

  for (const metadataKey of ["page_title", "page_description", "page_og_description"]) {
    if (typeof dictionary[metadataKey] !== "string") {
      errors.push(`Missing metadata translation: ${language}.${metadataKey}`);
    }
  }
}

if (
  dictionaries.hybrid?.nav_work !== dictionaries.en?.nav_work
  || dictionaries.hybrid?.work_description !== dictionaries.id?.work_description
  || dictionaries.hybrid?.hero_description !== dictionaries.id?.hero_description
) {
  errors.push("Hybrid mode must use English navigation and Indonesian descriptions.");
}

for (const value of requiredLanguages) {
  if (!new RegExp(`<option\\s+value=["']${value}["']`).test(html)) {
    errors.push(`Missing language selector option: ${value}`);
  }
}

if (!html.includes('src="./assets/js/languages.js?v=24"')) {
  errors.push("Language script cache version is missing or outdated.");
}

if (!html.includes('<html lang="en"') || !html.includes('data-language="en"')) {
  errors.push("English must be the initial document language.");
}

if (!html.includes('<option value="en" selected>EN</option>')) {
  errors.push("English must be selected by default in the language control.");
}

if (html.includes("hero_cta_cv") || html.includes("CV%20Request")) {
  errors.push("The hero CTA must not use the old CV request action.");
}

if (errors.length) {
  console.error("Translation check failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log(
    `Translation check passed: ${htmlKeys.size} HTML keys across ${requiredLanguages.join(", ")}.`
  );
}
