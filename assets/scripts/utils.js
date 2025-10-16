(function (global) {
  const locale = "no";

  function toDate(value) {
    if (value instanceof Date) {
      return value;
    }
    return new Date(value);
  }

  function formatDateRange(range) {
    if (!Array.isArray(range) || range.length < 2) {
      return "";
    }
    const formatter = new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "short"
    });
    const start = toDate(range[0]);
    const end = toDate(range[1]);
    return `${formatter.format(start)} – ${formatter.format(end)}`;
  }

  function weeksBetween(target) {
    const start = new Date();
    const end = toDate(target);
    const diffMs = end.getTime() - start.getTime();
    return Math.max(0, Math.round(diffMs / (7 * 24 * 60 * 60 * 1000)));
  }

  function getIsoWeek(target) {
    const date = toDate(target);
    const tmp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const day = tmp.getUTCDay() || 7;
    tmp.setUTCDate(tmp.getUTCDate() + 4 - day);
    const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
    return Math.ceil(((tmp - yearStart) / 86400000 + 1) / 7);
  }

  function normalise(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function scoreWords(text, query) {
    const target = normalise(text);
    const words = normalise(query)
      .split(/\s+/)
      .filter(Boolean);

    return words.reduce((acc, word) => (target.includes(word) ? acc + 1 : acc), 0);
  }

  global.WarpedevUtils = {
    formatDateRange,
    weeksBetween,
    getIsoWeek,
    normalise,
    scoreWords
  };
})(window);
