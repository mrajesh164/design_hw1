const GENRES = [
  { id: "horror", name: "Horror", sound: "[ominous cello]", tag: "Rated R for Roast", items: [
    ["The Final Girl", "$4.00", "Dark roast, brewed black."],
    ["Basement Cold Brew", "$5.00", "Cold brew steeped for twenty-four hours."],
    ["The Call Is Coming From Inside", "$5.50", "Blood orange shrub, sparkling."] ] },
  { id: "scifi", name: "Sci-Fi", sound: "[distant beeping]", tag: "In space, no one can hear you sip", items: [
    ["Warp Drive", "$6.00", "Espresso tonic with butterfly pea. Starts blue, ends purple."],
    ["First Contact", "$6.50", "Ceremonial matcha with edible glitter."],
    ["Replicant", "$5.25", "Oat flat white. More human than the human kind."] ] },
  { id: "noir", name: "Noir", sound: "[rain on glass]", tag: "Always served after dark", items: [
    ["Bitter End", "$5.00", "Double espresso, amaro syrup, no sugar."],
    ["The Long Goodbye", "$4.50", "Cortado, served slowly."],
    ["Femme Fatale", "$4.75", "Hibiscus iced tea. Red, cold, not what you expected."] ] },
  { id: "romance", name: "Romance", sound: "[soft piano]", tag: "Best enjoyed with someone", items: [
    ["Meet Cute", "$8.00", "Cappuccino, one croissant, two forks."],
    ["Rainstorm Kiss", "$5.75", "Rose latte. Soft, floral, a little dramatic."],
    ["The Grand Gesture", "$6.25", "Honey lavender latte, with a handwritten note."] ] },
  { id: "western", name: "Western", sound: "[wind, distant harmonica]", tag: "Strong, simple, no questions asked", items: [
    ["High Noon", "$3.75", "Cowboy coffee, grounds and all."],
    ["The Good, The Bad, and The Oatmeal", "$7.00", "Skillet oatmeal with three toppings. Pick one."] ] }
];

// Each cue is one subtitle card. Scroll position picks the active cue.
const cues = [
  { scene: "intro", html: "<i>[espresso machine hissing]</i>" },
  { scene: "intro", html: "Welcome to Home Brew.<br>Every drink here is a genre." },
  { scene: "intro", html: "Open daily, 7 a.m. to 10 p.m.<br>1138 Marquee Lane, Hyde Park" }
];
GENRES.forEach(g => {
  cues.push({ scene: g.id, chapter: g.id, html: `<i>${g.sound}</i><br><b>${g.name.toUpperCase()}</b> &mdash; ${g.tag}` });
  g.items.forEach(i => cues.push({ scene: g.id, html: `<b>${i[0].toUpperCase()} &middot; ${i[1]}</b><br>${i[2]}` }));
});
cues.push({ scene: "intro", html: "That's a wrap.<br>Come in. We're open until 10." });
cues.push({ scene: "intro", html: "<i>[door bell rings]</i>" });

const track = document.getElementById("track");
const sub = document.getElementById("subtitle");
const startBtn = document.getElementById("start");
const playBtn = document.getElementById("play");
const countEl = document.getElementById("count");
const scrub = document.getElementById("scrub");
const played = document.getElementById("played");
const tc = document.getElementById("tc");
const chapters = document.getElementById("chapters");
const scenes = [...document.querySelectorAll(".scene")];
const PER_CUE = 55; // vh of scrolling per subtitle card
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

track.style.height = `${cues.length * PER_CUE + 100}vh`;

function range() { return track.offsetHeight - innerHeight; }
function scrollToCue(i) { scrollTo({ top: (i + 0.5) / cues.length * range(), behavior: reduce ? "auto" : "smooth" }); }

// Chapter buttons
const chapterBtns = [{ id: "intro", label: "Opening", cue: 0 }, ...GENRES.map(g => ({ id: g.id, label: g.name, cue: cues.findIndex(c => c.chapter === g.id) }))]
  .map(c => {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = c.label;
    b.dataset.id = c.id;
    b.addEventListener("click", () => scrollToCue(c.cue));
    chapters.appendChild(b);
    return b;
  });

let current = -1;
function update() {
  const p = Math.min(1, Math.max(0, scrollY / (range() || 1)));
  const i = Math.min(cues.length - 1, Math.floor(p * cues.length));
  played.style.width = (p * 100) + "%";
  const secs = Math.round(p * cues.length * 4);
  tc.textContent = `00:${String(Math.floor(secs / 60)).padStart(2, "0")}:${String(secs % 60).padStart(2, "0")}`;
  if (scrollY > 40) startBtn.classList.add("gone");
  countEl.textContent = `${Math.min(cues.length, Math.floor(p * cues.length) + 1)} / ${cues.length}`;
  scrub.setAttribute("aria-valuenow", Math.round(p * 100));

  if (i === current) return;
  current = i;
  const cue = cues[i];
  const swap = () => { sub.innerHTML = cue.html; sub.classList.remove("out"); };
  if (reduce) swap(); else { sub.classList.add("out"); setTimeout(swap, 140); }

  scenes.forEach(s => s.classList.toggle("on", s.dataset.scene === cue.scene));
  // chapter highlight follows the most recent genre
  let active = "intro";
  for (let k = i; k >= 0; k--) { if (cues[k].chapter) { active = cues[k].chapter; break; } }
  if (i >= cues.length - 2) active = "intro";
  chapterBtns.forEach(b => b.classList.toggle("on", b.dataset.id === active));
}
let ticking = false;
addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { update(); ticking = false; }); } }, { passive: true });
addEventListener("resize", update);
update();

// Keyboard: arrows step through cues
addEventListener("keydown", e => {
  if (e.target.closest("dialog, button, a")) return;
  if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); scrollToCue(Math.min(cues.length - 1, current + 1)); }
  if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); scrollToCue(Math.max(0, current - 1)); }
});

// Transcript: the whole menu as plain text
const body = document.getElementById("transcript-body");
body.innerHTML = GENRES.map(g => `
  <h3>${g.name}</h3>
  ${g.items.map(i => `<p><span class="p">${i[1]}</span><b>${i[0]}</b><br>${i[2]}</p>`).join("")}`).join("") +
  `<h3>Visit</h3><p>1138 Marquee Lane, Hyde Park, Chicago<br>Open daily, 7 a.m. to 10 p.m.</p>`;
const dlg = document.getElementById("transcript");
document.getElementById("open-transcript").addEventListener("click", () => dlg.showModal());

// Video-style controls: play steps through the cards on a timer, scrolling still works
const STEP_MS = 4500;
let playing = false;
let timer = null;

function syncPlay() {
  playBtn.innerHTML = playing ? "&#10074;&#10074;" : "&#9654;";
  playBtn.setAttribute("aria-label", playing ? "Pause" : "Play");
}
function pause() { playing = false; clearInterval(timer); syncPlay(); }
function play() {
  startBtn.classList.add("gone");
  if (current >= cues.length - 1) scrollToCue(0);
  playing = true;
  syncPlay();
  clearInterval(timer);
  timer = setInterval(() => {
    if (current >= cues.length - 1) { pause(); return; }
    scrollToCue(current + 1);
  }, STEP_MS);
}
startBtn.addEventListener("click", play);
playBtn.addEventListener("click", () => (playing ? pause() : play()));
document.getElementById("next").addEventListener("click", () => { pause(); startBtn.classList.add("gone"); scrollToCue(Math.min(cues.length - 1, current + 1)); });
document.getElementById("prev").addEventListener("click", () => { pause(); startBtn.classList.add("gone"); scrollToCue(Math.max(0, current - 1)); });
scrub.addEventListener("click", e => {
  const r = scrub.getBoundingClientRect();
  pause();
  startBtn.classList.add("gone");
  scrollTo({ top: ((e.clientX - r.left) / r.width) * range(), behavior: reduce ? "auto" : "smooth" });
});
// Taking over by hand pauses playback, like grabbing a video scrubber
["wheel", "touchstart"].forEach(t => addEventListener(t, pause, { passive: true }));
addEventListener("keydown", e => { if (["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown", "PageDown", "PageUp"].includes(e.key)) pause(); });
syncPlay();
