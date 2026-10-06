const journal = document.getElementById("journal");
const pad = n => String(n).padStart(2, "0");

function entryHTML(e) {
  const href = e.path && e.status !== "planned" ? e.path : null;
  const label = `Design ${pad(e.n)}: ${e.title}`;
  const picture = `<img src="thumbs/${pad(e.n)}.jpg" alt="Home page of ${e.title}" width="640" height="360" loading="lazy">`;
  const frame = href
    ? `<a class="frame" href="${href}" target="_blank" rel="noopener" aria-label="Open ${label}">${picture}</a>`
    : `<div class="frame" aria-label="${label}, not built yet">${picture}</div>`;
  return `
  <article class="entry">
    ${frame}
    <div class="notes">
      <h3>${pad(e.n)} — ${e.title}</h3>
      <p class="desc">${e.desc}</p>
    </div>
  </article>`;
}

journal.innerHTML = `<div class="entries">${ENTRIES.map(entryHTML).join("")}</div>`;
