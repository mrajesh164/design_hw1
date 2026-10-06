const pad = n => String(n).padStart(2, "0");
const byN = Object.fromEntries(ENTRIES.map(e => [e.n, e]));
const thumb = n => `thumbs/${pad(n)}.jpg`;
const FINAL_N = 25;

// ---------- tab 1: all 25 ----------
function entryHTML(e) {
  const label = `Design ${pad(e.n)}: ${e.title}`;
  const picture = `<img src="${thumb(e.n)}" alt="Home page of ${e.title}" width="640" height="360" loading="lazy">`;
  const ribbon = e.n === FINAL_N ? `<span class="ribbon">My final pick</span>` : "";
  return `
  <article class="entry">
    <div class="frame-wrap">
      <a class="frame" href="${e.path}" target="_blank" rel="noopener" aria-label="Open ${label}">${picture}</a>
      ${ribbon}
    </div>
    <div class="notes">
      <h3>${pad(e.n)} — ${e.title}</h3>
      <p class="desc">${e.desc}</p>
    </div>
  </article>`;
}
document.getElementById("journal").innerHTML = `<div class="entries">${ENTRIES.map(entryHTML).join("")}</div>`;

// ---------- tab 2: journey ----------
const mini = n => `<li><a class="mini" href="${byN[n].path}" target="_blank" rel="noopener" aria-label="Open design ${pad(n)}, ${byN[n].title}">
    <img src="${thumb(n)}" alt="" loading="lazy" width="320" height="180"><span><b>${pad(n)}</b> ${byN[n].title}</span></a></li>`;

function journeyHTML() {
  const phases = PHASES.map(p => {
    const nums = []; for (let n = p.range[0]; n <= p.range[1]; n++) nums.push(n);
    return `
    <section class="phase" aria-labelledby="ph${p.id}">
      <div class="phase-head"><span class="phase-no" aria-hidden="true">${p.id}</span>
        <div><h2 id="ph${p.id}">${p.title}</h2><p class="phase-range">Designs ${p.range[0]} to ${p.range[1]}</p></div></div>
      ${p.text.map(t => `<p class="lead">${t}</p>`).join("")}
      <ul class="strip">${nums.map(mini).join("")}</ul>
      <div class="learned"><h3>What I noticed</h3><ul>${p.learned.map(l => `<li>${l}</li>`).join("")}</ul></div>
    </section>`;
  }).join("");
  const f = byN[FINAL.n];
  return `
  <p class="intro-story">I explored a couple of ideas at a time, refining each until it was presentable. Around design 20 I started combining my favorites until one felt right.</p>
  ${phases}
  <section class="final" aria-labelledby="final-h">
    <a class="final-pic" href="${f.path}" target="_blank" rel="noopener" aria-label="Open design ${FINAL.n}, ${f.title}">
      <img src="${thumb(FINAL.n)}" alt="Home page of ${f.title}" width="640" height="360" loading="lazy"><span class="ribbon">My final pick</span></a>
    <div><h2 id="final-h">${FINAL.title}</h2>${FINAL.text.map(t => `<p class="lead">${t}</p>`).join("")}
      <p><a class="open-link" href="${f.path}" target="_blank" rel="noopener">Open design ${FINAL.n}, ${f.title} &rarr;</a></p></div>
  </section>`;
}
document.getElementById("journey-body").innerHTML = journeyHTML();

// ---------- tab 3: family tree ----------
const LEVEL_Y = [0, 1, 2, 3];
const parentsOf = n => (TREE.hybrids[n] ? TREE.hybrids[n].parents : []);
const childrenOf = n => Object.keys(TREE.hybrids).map(Number).filter(h => parentsOf(h).includes(n));
function lineage(n) {
  const set = new Set([n]);
  (function up(m) { parentsOf(m).forEach(p => { if (!set.has(p)) { set.add(p); up(p); } }); })(n);
  (function down(m) { childrenOf(m).forEach(c => { if (!set.has(c)) { set.add(c); down(c); } }); })(n);
  return set;
}
const treePos = {}; // n -> { x (0..1), level }
TREE.favorites.forEach((n, i) => { treePos[n] = { x: (i + 0.5) / TREE.favorites.length, level: 0 }; });
[21, 24, 25, 22, 23].forEach(n => {
  const ps = parentsOf(n);
  const level = 1 + Math.max(...ps.map(p => (treePos[p] ? treePos[p].level : 0)));
  treePos[n] = { x: ps.reduce((s, p) => s + treePos[p].x, 0) / ps.length, level };
});

function treeHTML() {
  const nodes = Object.keys(treePos).map(Number).map(n => {
    const { x, level } = treePos[n];
    const cls = ["node", level === 0 ? "fav" : "hyb", n === FINAL_N ? "is-final" : ""].join(" ");
    return `<button type="button" class="${cls}" data-n="${n}" style="left:${(x * 100).toFixed(2)}%;top:${LEVEL_Y[level] * 190}px" aria-pressed="false" aria-label="Design ${pad(n)}, ${byN[n].title}">
      <img src="${thumb(n)}" alt="" width="320" height="180"><span><b>${pad(n)}</b> ${byN[n].title}</span></button>`;
  }).join("");
  const makes = [21, 22, 23, 24, 25].map(n => {
    const h = TREE.hybrids[n];
    const parents = h.parents.map(p => `<li><a class="mini" href="${byN[p].path}" target="_blank" rel="noopener" aria-label="Open design ${pad(p)}, ${byN[p].title}"><img src="${thumb(p)}" alt="" loading="lazy" width="320" height="180"><span><b>${pad(p)}</b> ${byN[p].title}</span></a></li>`).join('<li class="plus" aria-hidden="true">+</li>');
    return `
    <article class="make${n === FINAL_N ? " is-final" : ""}">
      <h3>${pad(n)} — ${byN[n].title}${n === FINAL_N ? ' <span class="chip">Final</span>' : ""}</h3>
      <div class="make-row"><ul class="parents">${parents}</ul><span class="arrow" aria-hidden="true">&rarr;</span>
        <a class="mini big" href="${byN[n].path}" target="_blank" rel="noopener" aria-label="Open design ${pad(n)}, ${byN[n].title}"><img src="${thumb(n)}" alt="" loading="lazy" width="320" height="180"><span><b>${pad(n)}</b> ${byN[n].title}</span></a></div>
      <ul class="gives">${h.parents.map(p => `<li><b>${pad(p)}</b> gave it ${h.gives[p]}.</li>`).join("")}</ul>
    </article>`;
  }).join("");
  const aside = Object.keys(TREE.aside).map(Number).map(n => `<li><a class="mini" href="${byN[n].path}" target="_blank" rel="noopener" aria-label="Open design ${pad(n)}, ${byN[n].title}"><img src="${thumb(n)}" alt="" loading="lazy" width="320" height="180"><span><b>${pad(n)}</b> ${byN[n].title}</span></a>${TREE.aside[n] ? `<p>${TREE.aside[n]}</p>` : ""}</li>`).join("");
  return `
  <p class="intro-story">Ten of the first twenty designs kept pulling me back, and the hybrids were built from them.</p>
  <div class="tree-wrap" id="tree-wrap">
    <p class="tree-hint">Select a design to light up everything it came from and everything it turned into.</p>
    <p class="level-label l0">My ten favorites</p>
    <p class="level-label l1">Hybrids</p>
    <div class="tree-stage" id="tree-stage"><svg class="tree-lines" id="tree-lines" aria-hidden="true"></svg>${nodes}</div>
    <div class="tree-detail" id="tree-detail" aria-live="polite"></div>
  </div>
  <h2 class="sub-h">How each hybrid was made</h2>
  <div class="makes">${makes}</div>
  <h2 class="sub-h">Just explored</h2>
  <ul class="aside">${aside}</ul>`;
}
document.getElementById("tree-body").innerHTML = treeHTML();

const stage = document.getElementById("tree-stage");
const linesEl = document.getElementById("tree-lines");
const detailEl = document.getElementById("tree-detail");
const nodeEls = [...stage.querySelectorAll(".node")];
const edges = [];
Object.keys(TREE.hybrids).map(Number).forEach(c => parentsOf(c).forEach(p => edges.push([p, c])));
let pinned = FINAL_N;

function drawTree() {
  const W = stage.clientWidth;
  if (!W) return;
  const H = stage.clientHeight;
  linesEl.setAttribute("viewBox", `0 0 ${W} ${H}`);
  linesEl.setAttribute("width", W);
  linesEl.setAttribute("height", H);
  const el = n => nodeEls.find(e => Number(e.dataset.n) === n);
  linesEl.innerHTML = edges.map(([p, c]) => {
    const a = el(p), b = el(c);
    const x1 = a.offsetLeft, y1 = a.offsetTop + a.offsetHeight;
    const x2 = b.offsetLeft, y2 = b.offsetTop;
    const dy = Math.max(40, (y2 - y1) * 0.45);
    return `<path data-from="${p}" data-to="${c}" d="M${x1} ${y1} C${x1} ${y1 + dy} ${x2} ${y2 - dy} ${x2} ${y2}"/>`;
  }).join("");
  paintLineage();
}

function paintLineage() {
  const set = lineage(pinned);
  nodeEls.forEach(e => {
    const n = Number(e.dataset.n);
    e.classList.toggle("dim", !set.has(n));
    e.setAttribute("aria-pressed", String(n === pinned));
  });
  linesEl.querySelectorAll("path").forEach(p => {
    const on = set.has(Number(p.dataset.from)) && set.has(Number(p.dataset.to));
    p.classList.toggle("on", on);
  });
  const e = byN[pinned];
  const from = parentsOf(pinned);
  const into = childrenOf(pinned);
  const list = ns => ns.map(n => `${pad(n)} ${byN[n].title}`).join(", ");
  detailEl.innerHTML = `
    <a class="detail-pic" href="${e.path}" target="_blank" rel="noopener" aria-label="Open design ${pad(e.n)}"><img src="${thumb(e.n)}" alt="Home page of ${e.title}" width="640" height="360"></a>
    <div><h3>${pad(e.n)} — ${e.title}${pinned === FINAL_N ? ' <span class="chip">Final</span>' : ""}</h3>
      <p>${e.desc}</p>
      ${from.length ? `<p class="trace"><b>Built from:</b> ${list(from)}.</p>` : ""}
      ${into.length ? `<p class="trace"><b>Went into:</b> ${list(into)}.</p>` : (from.length ? "" : `<p class="trace">A starting point that was not carried into a hybrid.</p>`)}
      <p><a class="open-link" href="${e.path}" target="_blank" rel="noopener">Open this design &rarr;</a></p></div>`;
}

nodeEls.forEach(e => e.addEventListener("click", () => { pinned = Number(e.dataset.n); paintLineage(); }));
if (window.ResizeObserver) new ResizeObserver(drawTree).observe(stage);
addEventListener("resize", drawTree);

// ---------- tab 4: decisions ----------
document.getElementById("decisions-body").innerHTML = `
  <p class="intro-story">A running log of what I asked Claude to change, in the order it happened, and what changed because of it. I shaped most of these designs by reacting to them.</p>
  <ol class="log">${DECISIONS.map(d => `
    <li class="decision">
      <div class="d-pic">${d.n ? `<a href="${byN[d.n].path}" target="_blank" rel="noopener" aria-label="Open design ${pad(d.n)}, ${byN[d.n].title}"><img src="${thumb(d.n)}" alt="" loading="lazy" width="320" height="180"></a><span><b>${pad(d.n)}</b> ${byN[d.n].title}</span>` : `<span class="d-all">${d.label === "Plan" ? "The plan" : "Every design"}</span>`}</div>
      <div class="d-text"><p><b>What I told Claude</b>${d.said}</p><p><b>What changed</b>${d.changed}</p></div>
    </li>`).join("")}</ol>`;

// ---------- tabs ----------
const TAB_IDS = ["all", "journey", "tree", "decisions"];
const tabs = [...document.querySelectorAll('[role="tab"]')];
const tabsBar = document.querySelector(".tabs");

function select(id, opts = {}) {
  if (!TAB_IDS.includes(id)) id = "all";
  tabs.forEach(t => { const on = t.dataset.tab === id; t.setAttribute("aria-selected", String(on)); t.tabIndex = on ? 0 : -1; });
  TAB_IDS.forEach(t => { document.getElementById("panel-" + t).hidden = t !== id; });
  if (opts.updateHash !== false) history.replaceState(null, "", "#" + id);
  if (id === "tree") requestAnimationFrame(drawTree);
  if (opts.scroll) window.scrollTo({ top: Math.max(0, tabsBar.offsetTop - 18), behavior: "auto" });
  if (opts.focus) document.getElementById("tab-" + id).focus();
}
tabs.forEach(t => t.addEventListener("click", () => select(t.dataset.tab, { scroll: true })));
tabsBar.addEventListener("keydown", e => {
  const i = tabs.findIndex(t => t.getAttribute("aria-selected") === "true");
  let j = null;
  if (e.key === "ArrowRight") j = (i + 1) % tabs.length;
  else if (e.key === "ArrowLeft") j = (i - 1 + tabs.length) % tabs.length;
  else if (e.key === "Home") j = 0;
  else if (e.key === "End") j = tabs.length - 1;
  if (j === null) return;
  e.preventDefault();
  select(tabs[j].dataset.tab, { focus: true });
});
addEventListener("hashchange", () => select(location.hash.slice(1), { updateHash: false }));
select(location.hash.slice(1), { updateHash: false });
