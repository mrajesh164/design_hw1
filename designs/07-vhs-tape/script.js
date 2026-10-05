const TAPES = [
  { id: "horror", name: "Horror", title: "Horror", tag: "Rated R for Roast", rating: "R",
    syn: "Hot enough to wake the dead. Survives to the sequel.",
    items: [
      ["The Final Girl", "$4.00", "Dark roast, brewed black."],
      ["Basement Cold Brew", "$5.00", "Cold brew steeped 24 hours."],
      ["The Call Is Coming From Inside", "$5.50", "Blood orange shrub, sparkling."] ] },
  { id: "scifi", name: "Sci-Fi", title: "Sci-Fi", tag: "In space, no one can hear you sip", rating: "PG-13",
    syn: "Nobody agrees on what happens between the blue and the purple.",
    items: [
      ["Warp Drive", "$6.00", "Espresso tonic with butterfly pea. Starts blue, ends purple."],
      ["First Contact", "$6.50", "Ceremonial matcha, edible glitter."],
      ["Replicant", "$5.25", "Oat flat white. More human than the human kind."] ] },
  { id: "noir", name: "Noir", title: "Noir", tag: "Always served after dark", rating: "NR",
    syn: "A rainy night, one lamp, and a drink that knows your secrets.",
    items: [
      ["Bitter End", "$5.00", "Double espresso, amaro syrup, no sugar."],
      ["The Long Goodbye", "$4.50", "Cortado, served slowly."],
      ["Femme Fatale", "$4.75", "Hibiscus iced tea. Red, cold, not what you expected."] ] },
  { id: "romance", name: "Romance", title: "Romance", tag: "Best enjoyed with someone", rating: "PG",
    syn: "Two cups, one croissant, and a rainstorm nobody minds.",
    items: [
      ["Meet Cute", "$8.00", "Cappuccino, one croissant, two forks."],
      ["Rainstorm Kiss", "$5.75", "Rose latte. Soft, floral, a little dramatic."],
      ["The Grand Gesture", "$6.25", "Honey lavender latte, with a handwritten note."] ] },
  { id: "western", name: "Western", title: "Western", tag: "Strong, simple, no questions asked", rating: "PG",
    syn: "Two cups on a rail, ten paces apart. Only one of them is coffee.",
    items: [
      ["High Noon", "$3.75", "Cowboy coffee, grounds and all."],
      ["The Good, The Bad, and The Oatmeal", "$7.00", "Skillet oatmeal with three toppings. Pick one."] ] }
];

const shelf = document.getElementById("shelf");
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const flips = [];

TAPES.forEach(t => {
  const box = document.createElement("div");
  box.className = `box ${t.id}`;
  box.innerHTML = `
    <div class="box-inner">
      <button class="face front" type="button" aria-label="Flip the ${t.name} tape over to read the menu on the back">
        <span class="spine-text"><span>SCENE &amp; SIP VIDEO &middot; ${t.name.toUpperCase()}</span></span>
        <span class="cover">
          <span class="studio">SCENE &amp; SIP VIDEO PRESENTS</span>
          <span class="sticker">NEW<br>RELEASE</span>
          <h3>${t.title}<small>${t.tag}</small></h3>
          <span class="flip-hint">Flip for the menu &#8635;</span>
        </span>
      </button>
      <div class="face rear" aria-hidden="true" inert tabindex="0">
        <div class="band"><span>SCENE &amp; SIP VIDEO</span><span>VHS &middot; HI-FI</span></div>
        <h4>${t.title}</h4>
        <p class="syn">${t.syn}</p>
        <h5>Starring</h5>
        <ul class="cast">${t.items.map(i => `<li><b>${i[0]}</b><i>${i[1]}</i><p>${i[2]}</p></li>`).join("")}</ul>
        <div class="meta"><span class="rating">${t.rating}</span><span class="barcode"></span></div>
        <p class="tap-hint">Tap the box to flip it back</p>
      </div>
    </div>`;
  const front = box.querySelector(".front");
  const rear = box.querySelector(".rear");

  function flip(toBack, auto = false) {
    if (!auto) pauseTour();
    document.body.classList.add("rewinding");
    setTimeout(() => document.body.classList.remove("rewinding"), reduce ? 0 : 600);
    box.classList.toggle("flipped", toBack);
    front.toggleAttribute("inert", toBack);
    front.setAttribute("aria-hidden", String(toBack));
    rear.toggleAttribute("inert", !toBack);
    rear.setAttribute("aria-hidden", String(!toBack));
    if (!auto) setTimeout(() => (toBack ? rear : front).focus({ preventScroll: true }), reduce ? 0 : 400);
  }
  front.addEventListener("click", () => flip(true));
  rear.addEventListener("click", () => flip(false));
  rear.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flip(false); } });
  box.addEventListener("keydown", e => { if (e.key === "Escape" && box.classList.contains("flipped")) flip(false); });
  flips.push({ box, flip });
  shelf.appendChild(box);
});

// PLAY runs a tour: each tape flips open for a few seconds, then the next one. Any manual flip pauses it.
const playBtn = document.getElementById("play");
const counter = document.getElementById("counter");
const SHOW_MS = 5500;
let touring = false;
let tourIdx = 0;
let stepTimer = null;
let tickTimer = null;
let secs = 0;

function paintCounter() {
  counter.textContent = `${Math.floor(secs / 3600)}:${String(Math.floor(secs / 60) % 60).padStart(2, "0")}:${String(secs % 60).padStart(2, "0")}`;
}
function paintButton() {
  playBtn.innerHTML = touring ? "&#10074;&#10074; PAUSE" : "&#9654; PLAY";
  playBtn.setAttribute("aria-label", touring ? "Pause the tape tour" : "Play all tapes, one after another");
}
function closeAll() { flips.forEach(f => { if (f.box.classList.contains("flipped")) f.flip(false, true); }); }

function showTape() {
  closeAll();
  const f = flips[tourIdx];
  f.box.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
  setTimeout(() => { if (touring) f.flip(true, true); }, reduce ? 0 : 500);
  stepTimer = setTimeout(() => {
    f.flip(false, true);
    tourIdx++;
    if (tourIdx >= flips.length) { tourIdx = 0; touring = false; clearInterval(tickTimer); paintButton(); return; }
    stepTimer = setTimeout(showTape, 700);
  }, SHOW_MS);
}
function startTour() {
  touring = true;
  paintButton();
  tickTimer = setInterval(() => { secs++; paintCounter(); }, 1000);
  showTape();
}
function pauseTour() {
  if (!touring) return;
  touring = false;
  clearTimeout(stepTimer);
  clearInterval(tickTimer);
  paintButton();
}
playBtn.addEventListener("click", () => (touring ? pauseTour() : startTour()));
paintButton();

// Real time in Chicago, plus whether the shop is open (7 a.m. to 10 p.m.)
const clockEl = document.getElementById("clock");
const stateEl = document.getElementById("open-state");
function updateClock() {
  const now = new Date();
  const opts = { timeZone: "America/Chicago" };
  clockEl.textContent = now.toLocaleTimeString("en-US", { ...opts, hour: "numeric", minute: "2-digit" });
  const hour = Number(now.toLocaleString("en-US", { ...opts, hour: "numeric", hour12: false })) % 24;
  stateEl.textContent = hour >= 7 && hour < 22 ? "OPEN NOW \u00b7 UNTIL 10 PM" : "CLOSED \u00b7 OPENS 7 AM";
}
updateClock();
setInterval(updateClock, 30000);
