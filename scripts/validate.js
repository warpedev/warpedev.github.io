#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

function readJson(relativePath) {
  const fullPath = path.join(__dirname, "..", relativePath);
  const raw = fs.readFileSync(fullPath, "utf8");
  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new Error(`Kunne ikke parse ${relativePath}: ${error.message}`);
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function isIsoDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function validateProjects() {
  const data = readJson("data/projects.json");
  ["tools", "sites", "experiments"].forEach((section) => {
    assert(Array.isArray(data[section]), `projects.json: feltet ${section} må være en liste.`);
  });
}

function validateManifest() {
  const manifestPath = "public/projects.json";
  const fullPath = path.join(__dirname, "..", manifestPath);
  if (!fs.existsSync(fullPath)) {
    return;
  }
  const manifest = readJson(manifestPath);
  assert(Array.isArray(manifest) && manifest.length > 0, "public/projects.json må være en liste.");
  manifest.forEach((entry, index) => {
    const prefix = `manifest[${index}]`;
    ["name", "slug", "url", "pitch"].forEach((field) => {
      assert(typeof entry[field] === "string" && entry[field].trim() !== "", `${prefix}.${field} må være tekst.`);
    });
    if (entry.updated) {
      assert(isIsoDate(entry.updated), `${prefix}.updated må være på formatet YYYY-MM-DD.`);
    }
  });
}

function validateFerier() {
  const dir = path.join(__dirname, "..", "ferie", "data");
  const files = fs
    .readdirSync(dir)
    .filter((file) => file.startsWith("ferier-") && file.endsWith(".json"))
    .sort();

  assert(files.length > 0, "Ingen feriedata funnet i ferie/data");

  files.forEach((file) => {
    const ferier = readJson(path.join("ferie", "data", file));
    assert(
      ferier && typeof ferier === "object" && !Array.isArray(ferier),
      `${file} må være et objekt med fylker som nøkler`
    );

    Object.entries(ferier).forEach(([region, entries]) => {
      assert(entries && typeof entries === "object", `${file}: ${region} må være et objekt.`);

      Object.entries(entries).forEach(([name, range]) => {
        assert(Array.isArray(range) && range.length === 2, `${file}: ${region}.${name} må ha [start, slutt].`);
        range.forEach((date) => {
          assert(isIsoDate(date), `${file}: ${region}.${name} -> ${date} må være på formatet YYYY-MM-DD.`);
        });
      });
    });
  });
}

function validatePrices() {
  const items = readJson("hvakoster/data/items.json");
  assert(Array.isArray(items), "items.json må være en liste.");

  items.forEach((item, index) => {
    const prefix = `items[${index}]`;
    ["q", "answer", "source", "updated"].forEach((field) => {
      assert(typeof item[field] === "string" && item[field].trim() !== "", `${prefix}.${field} må være tekst.`);
    });
    assert(isIsoDate(item.updated), `${prefix}.updated må være på formatet YYYY-MM-DD.`);
  });
}

try {
  validateProjects();
  validateManifest();
  validateFerier();
  validatePrices();
  console.log("✅ Alle JSON-filer består validering.");
} catch (error) {
  console.error("❌ Valideringsfeil:", error.message);
  process.exit(1);
}
