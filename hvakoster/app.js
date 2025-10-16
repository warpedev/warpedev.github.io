const input = document.getElementById("q");
const container = document.querySelector(".results");
const { normalise, scoreWords } = window.WarpedevUtils;
let index = [];
let defaultList = [];

function createMetaBadge(text) {
  const badge = document.createElement("span");
  badge.className = "badge";
  badge.textContent = text;
  return badge;
}

function render(list, queryText = "") {
  container.innerHTML = "";

  const status = document.createElement("p");
  status.className = "results__status";
  status.textContent = queryText
    ? `${list.length} treff for "${queryText}"`
    : "Foreslåtte spørsmål akkurat nå";
  container.appendChild(status);

  if (!list.length) {
    const empty = document.createElement("article");
    empty.className = "card card--minimal result-card result-card--empty";
    empty.innerHTML =
      "<p>Ingen treff enda – prøv et annet ord eller send oss et forslag under.</p>";

    const suggestions = index
      .filter((item) => normalise(item.q).includes(normalise(queryText)))
      .slice(0, 3);

    if (suggestions.length) {
      const hint = document.createElement("div");
      hint.className = "stack stack--tight";

      const label = document.createElement("p");
      label.textContent = "Forslag du kan prøve:";
      hint.appendChild(label);

      const listEl = document.createElement("ul");
      suggestions.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item.q;
        listEl.appendChild(li);
      });
      hint.appendChild(listEl);
      empty.appendChild(hint);
    }

    container.appendChild(empty);
    return;
  }

  list.forEach((item) => {
    const card = document.createElement("article");
    card.className = "card result-card";

    const title = document.createElement("h2");
    title.textContent = item.q;
    card.appendChild(title);

    const answer = document.createElement("p");
    answer.textContent = item.answer;
    card.appendChild(answer);

    const meta = document.createElement("div");
    meta.className = "result-card__meta";
    meta.appendChild(createMetaBadge(item.source));
    meta.appendChild(createMetaBadge(item.updated));

    card.appendChild(meta);
    container.appendChild(card);
  });
}

function handleSearch(value) {
  const raw = value.trim();
  const norm = normalise(raw);
  if (!norm) {
    render(defaultList);
    return;
  }

  const results = index
    .map((item) => ({
      item,
      score: scoreWords(`${item.q} ${item.answer} ${item.source}`, raw)
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map(({ item }) => item);

  render(results, raw);
}

async function init() {
  try {
    const res = await fetch("data/items.json", { cache: "no-store" });
    index = await res.json();
    defaultList = [...index].sort((a, b) => new Date(b.updated) - new Date(a.updated)).slice(0, 6);
    render(defaultList);
  } catch (error) {
    console.error("Kunne ikke laste priser", error);
    container.innerHTML =
      '<p class="results__status">Kunne ikke laste data. Sjekk <code>data/items.json</code>.</p>';
  }
}

input?.addEventListener("input", (event) => {
  handleSearch(event.target.value);
});

document.addEventListener("DOMContentLoaded", init);
