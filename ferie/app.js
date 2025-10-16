const yearPicker = document.getElementById("year-picker");
const regionPicker = document.getElementById("region-picker");
const timeline = document.querySelector(".timeline");
const nextName = document.querySelector("[data-next-name]");
const nextWeek = document.querySelector("[data-next-week]");
const yearLabel = document.querySelector("[data-year-label]");
const { formatDateRange, weeksBetween, getIsoWeek } = window.WarpedevUtils;

const YEARS = ["2025", "2026"];
const YEAR_LABELS = {
  2025: "2024–2025",
  2026: "2025–2026"
};
const datasets = new Map();
let currentYear = YEARS[0];
let currentRegion;

function formatRegionName(region) {
  return region.replace(/-/g, " ").replace(/\b\w/g, (match) => match.toUpperCase());
}

function setYearLabel(year) {
  if (yearLabel) {
    yearLabel.textContent = YEAR_LABELS[year] ?? year;
  }
}

function renderRegion(region, data) {
  timeline.innerHTML = "";

  const entries = Object.entries(data[region] || {});
  if (!entries.length) {
    timeline.innerHTML = '<p class="note">Ingen datoer tilgjengelig for valgt fylke enda.</p>';
    return;
  }

  const upcoming = [];

  entries.forEach(([name, [start, end]]) => {
    const startDate = new Date(start);
    upcoming.push({ name, startDate });

    const card = document.createElement("article");
    card.className = "card timeline__card";

    const title = document.createElement("h2");
    title.textContent = name;
    card.appendChild(title);

    const badges = document.createElement("div");
    badges.className = "timeline__dates";

    const range = document.createElement("span");
    range.className = "badge badge--accent timeline__badge";
    range.textContent = formatDateRange([start, end]);
    badges.appendChild(range);

    const weekInfo = document.createElement("span");
    weekInfo.className = "badge timeline__meta";
    weekInfo.textContent = `Uke ${getIsoWeek(startDate)}`;
    badges.appendChild(weekInfo);

    const countdown = document.createElement("span");
    countdown.className = "badge timeline__meta";
    countdown.textContent = `Om ${weeksBetween(startDate)} uker`;
    badges.appendChild(countdown);

    card.appendChild(badges);
    timeline.appendChild(card);
  });

  upcoming.sort((a, b) => a.startDate - b.startDate);
  const next = upcoming.find((item) => item.startDate >= new Date());
  if (next) {
    nextName.textContent = next.name.toLowerCase();
    nextWeek.textContent = String(getIsoWeek(next.startDate));
  } else {
    nextName.textContent = "?";
    nextWeek.textContent = "?";
  }
}

function populateRegions(regions) {
  regionPicker.innerHTML = "";
  regions.forEach((region) => {
    const option = document.createElement("option");
    option.value = region;
    option.textContent = formatRegionName(region);
    regionPicker.appendChild(option);
  });
}

async function loadYear(year) {
  if (datasets.has(year)) {
    return datasets.get(year);
  }
  const response = await fetch(`data/ferier-${year}.json`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Ugyldig respons for ${year}`);
  }
  const data = await response.json();
  datasets.set(year, data);
  return data;
}

async function refreshView() {
  try {
    const data = await loadYear(currentYear);
    const regions = Object.keys(data).sort();

    if (!regions.length) {
      timeline.innerHTML = '<p class="note">Ingen data for valgt år ennå.</p>';
      return;
    }

    if (!currentRegion || !regions.includes(currentRegion)) {
      [currentRegion] = regions;
    }

    populateRegions(regions);
    regionPicker.value = currentRegion;
    renderRegion(currentRegion, data);
    setYearLabel(currentYear);
  } catch (error) {
    console.error("Kan ikke laste feriedatoer", error);
    timeline.innerHTML = `<p class="note">Kunne ikke laste data for ${currentYear}. Sjekk <code>data/ferier-${currentYear}.json</code>.</p>`;
  }
}

function initPickers() {
  YEARS.forEach((year) => {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = YEAR_LABELS[year] ?? year;
    yearPicker.appendChild(option);
  });
  yearPicker.value = currentYear;

  yearPicker.addEventListener("change", () => {
    currentYear = yearPicker.value;
    refreshView();
  });

  regionPicker.addEventListener("change", () => {
    currentRegion = regionPicker.value;
    loadYear(currentYear).then((data) => {
      renderRegion(currentRegion, data);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initPickers();
  refreshView();
});
