function slugify(value = "") {
  return value
    .toString()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatUpdated(isoDate) {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("no-NO", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function createCard(project) {
  const card = document.createElement("article");
  card.className = "card";

  if (project.category) {
    const category = document.createElement("span");
    category.className = "card__category";
    category.textContent = project.category;
    card.appendChild(category);
  }

  const title = document.createElement("h3");
  title.className = "card__title";
  title.textContent = project.title;
  card.appendChild(title);

  if (project.description) {
    const description = document.createElement("p");
    description.textContent = project.description;
    card.appendChild(description);
  }

  if (project.meta?.length || project.updated) {
    const metaList = document.createElement("div");
    metaList.className = "card__meta";

    (project.meta || []).forEach((metaItem) => {
      const tag = document.createElement("span");
      tag.textContent = metaItem;
      metaList.appendChild(tag);
    });

    if (project.updated) {
      const updated = document.createElement("span");
      updated.className = "card__updated badge";
      updated.textContent = `Sist oppdatert ${formatUpdated(project.updated)}`;
      metaList.appendChild(updated);
    }

    card.appendChild(metaList);
  }

  if (project.status === "upcoming") {
    const statusBadge = document.createElement("span");
    statusBadge.className = "badge badge--upcoming";
    statusBadge.textContent = "Kommer snart";
    card.appendChild(statusBadge);
  }

  if (project.url) {
    const link = document.createElement("a");
    link.className = "card__link";
    link.href = project.url;
    link.target = project.url.startsWith("http") ? "_blank" : "_self";
    link.rel = project.url.startsWith("http") ? "noreferrer" : "";
    link.innerHTML =
      'Utforsk <svg aria-hidden="true" focusable="false" viewBox="0 0 16 16"><path fill="currentColor" d="M5.3 3.5a.8.8 0 0 0 0 1.6h4.1L3.4 11c-.3.3-.3.9 0 1.2.3.3.9.3 1.2 0l6-5.9v4a.8.8 0 1 0 1.6 0V4.3a.8.8 0 0 0-.8-.8H5.3Z"/></svg>';
    card.appendChild(link);
  } else {
    const placeholder = document.createElement("span");
    placeholder.className = "badge";
    placeholder.textContent = "Oppsummering uten lenke";
    card.appendChild(placeholder);
  }

  return card;
}

function renderProjects(data) {
  const sections = document.querySelectorAll("[data-section]");

  sections.forEach((sectionEl) => {
    const key = sectionEl.getAttribute("data-section");
    const projects = data[key] ?? [];

    if (!projects.length) {
      const empty = document.createElement("p");
      empty.className = "badge";
      empty.textContent = "Ingen elementer registrert enda.";
      sectionEl.appendChild(empty);
      return;
    }

    projects.forEach((project) => {
      const card = createCard(project);
      sectionEl.appendChild(card);
    });
  });
}

function showError() {
  const main = document.querySelector("main");

  const notice = document.createElement("section");
  notice.className = "section";
  notice.innerHTML =
    "<div class='section__header'><h2>Kunne ikke laste prosjekter</h2><p>Last inn siden på nytt eller oppdater data/projects.json.</p></div>";

  main.insertBefore(notice, main.firstChild);
}

async function loadProjects() {
  try {
    const [projectsResponse, manifestResponse] = await Promise.all([
      fetch("data/projects.json", { cache: "no-store" }),
      fetch("public/projects.json", { cache: "no-store" }).catch(() => null)
    ]);

    if (!projectsResponse?.ok) {
      throw new Error("Ugyldig respons for prosjekter");
    }

    const data = await projectsResponse.json();
    let manifest = [];
    if (manifestResponse?.ok) {
      manifest = await manifestResponse.json();
    }

    const manifestMap = new Map(
      manifest.map((entry) => [entry.slug || slugify(entry.name), entry])
    );

    Object.keys(data).forEach((section) => {
      data[section] = (data[section] || []).map((item) => {
        const clone = { ...item };
        clone.slug = clone.slug || slugify(clone.title);
        const manifestEntry = manifestMap.get(clone.slug);
        if (manifestEntry) {
          if (manifestEntry.url) {
            clone.url = manifestEntry.url;
          }
          if (!clone.description && manifestEntry.pitch) {
            clone.description = manifestEntry.pitch;
          }
          if (manifestEntry.updated) {
            clone.updated = manifestEntry.updated;
          }
        }
        return clone;
      });
    });

    renderProjects(data);
  } catch (error) {
    console.error("Kunne ikke laste prosjekter:", error);
    showError();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) {
    year.textContent = new Date().getUTCFullYear();
  }

  loadProjects();
});
