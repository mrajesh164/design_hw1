const journal = document.getElementById("journal");
const pad = n => String(n).padStart(2, "0");

function entryHTML(e) {
  const href = e.path && e.status !== "planned" ? e.path : null;
  const tag = href ? "a" : "div";
  const link = href ? ` href="${href}"` : "";
  return `
  <article class="entry status-${e.status}" data-phase="${e.phase}" style="--hue:${e.hue}">
    <${tag} class="frame"${link} aria-label="Design ${pad(e.n)}: ${e.title}">
      <span class="frame-num">${pad(e.n)}</span>
      <span class="frame-title">${e.title}</span>
      <span class="frame-status">${href ? "Open design →" : "Not yet shot"}</span>
    </${tag}>
    <div class="notes">
      <p class="meta"><span class="tag">${e.tag}</span><span class="badge">${e.status}</span><span class="date">${e.date || "undated"}</span></p>
      <h3>${pad(e.n)} — ${e.title}</h3>
      <p class="question"><b>Testing:</b> ${e.question}</p>
      <p class="idea"><b>Plan:</b> ${e.idea}</p>
      <p class="result"><b>Result:</b> ${e.result || "<i>to be written after shooting</i>"}</p>
      ${e.ledTo ? `<p class="ledto"><b>Led to:</b> ${e.ledTo}</p>` : ""}
    </div>
  </article>`;
}

journal.innerHTML = `<div class="entries">${ENTRIES.map(entryHTML).join("")}</div>`;
