const MENU = [
  { id: "horror", name: "Horror", tag: "Rated R for Roast", items: [
    ["The Final Girl", "$4.00", "Dark roast, brewed black. Hot enough to wake the dead."],
    ["Basement Cold Brew", "$5.00", "Cold brew steeped for twenty-four hours. Don't ask what else is down there."],
    ["The Call Is Coming From Inside", "$5.50", "Blood orange shrub, sparkling. Sweet, red, a little too sharp."] ] },
  { id: "scifi", name: "Sci-Fi", tag: "In space, no one can hear you sip", items: [
    ["Warp Drive", "$6.00", "Espresso tonic with butterfly pea. Starts blue, ends purple."],
    ["First Contact", "$6.50", "Ceremonial matcha with edible glitter."],
    ["Replicant", "$5.25", "Oat flat white. More human than the human kind."] ] },
  { id: "noir", name: "Noir", tag: "Always served after dark", items: [
    ["Bitter End", "$5.00", "Double espresso, amaro syrup, no sugar."],
    ["The Long Goodbye", "$4.50", "Cortado, served slowly."],
    ["Femme Fatale", "$4.75", "Hibiscus iced tea. Red, cold, not what you expected."] ] },
  { id: "romance", name: "Romance", tag: "Best enjoyed with someone", items: [
    ["Meet Cute", "$8.00", "Cappuccino, one croissant, two forks."],
    ["Rainstorm Kiss", "$5.75", "Rose latte. Soft, floral, a little dramatic."],
    ["The Grand Gesture", "$6.25", "Honey lavender latte, with a handwritten note."] ] },
  { id: "western", name: "Western", tag: "Strong, simple, no questions asked", items: [
    ["True Grit", "$3.75", "Strong black coffee, brewed bold. No sugar, no fuss."],
    ["A Fistful of Espresso", "$4.25", "A triple shot of espresso. Quick on the draw."] ] },
  { id: "mystery", name: "Mystery", tag: "Every sip is a clue", items: [
    ["The Usual Suspect", "$4.25", "Earl Grey with a lemon twist. Hiding in plain sight."],
    ["Red Herring", "$5.50", "Smoked tea latte with a hint of cinnamon. Not what it seems."],
    ["Plot Twist", "$6.00", "Iced chai with a shot of espresso. Sweet, then suddenly not."] ] },
  { id: "fantasy", name: "Fantasy", tag: "Brewed with a little magic", items: [
    ["The Chosen One", "$6.50", "Golden turmeric latte with honey. Destined for greatness."],
    ["Dragon's Breath", "$5.75", "Spiced hot chocolate with chili and cinnamon. Mind the fire."],
    ["Elixir of Life", "$6.25", "Sparkling elderflower lemonade with edible flowers."] ] },
  { id: "comedy", name: "Comedy", tag: "Guaranteed to lighten the mood", items: [
    ["Slapstick", "$4.50", "Banana milk latte. Don't slip!"],
    ["Punchline", "$5.25", "Peanut butter mocha. Sweet setup, salty finish."],
    ["Laugh Track", "$5.00", "Cold brew float with vanilla ice cream. Canned laughter not included."] ] }
];

// There is no variable font here, so each "axis" is a number blended between stops.
// Stop 0 is the resting state (dial value -100); stops 1-8 are the genres (dial values 0, 100 ... 700).
// ls: letter-spacing em, sx/sy: letter scale, sk: skew deg, wave/ws: vertical wobble px and speed,
// rot: tilt jitter deg, blur px, fade: how far letters dip in and out, h/s/l: word color,
// glow/gh: glow radius and hue, th/ts/tl: page tint.
const SANS = '"Helvetica Neue", Helvetica, Arial, sans-serif';
const STOPS = [
  { label: "Rest", font: { f: SANS, w: 700, i: "normal", c: "none" },
    p: { ls: 0.02, sx: 1, sy: 1, sk: 0, wave: 0, ws: 0, rot: 0, blur: 0, fade: 0, h: 30, s: 8, l: 20, glow: 0, gh: 30, th: 40, ts: 20, tl: 95 } },
  { label: "Horror", font: { f: SANS, w: 200, i: "normal", c: "uppercase" },
    p: { ls: -0.02, sx: 0.8, sy: 1.35, sk: 0, wave: 1.6, ws: 38, rot: 1.1, blur: 0, fade: 0, h: 0, s: 72, l: 27, glow: 0, gh: 0, th: 0, ts: 22, tl: 93 } },
  { label: "Sci-Fi", font: { f: '"Courier New", Menlo, Consolas, monospace', w: 700, i: "normal", c: "uppercase" },
    p: { ls: 0.14, sx: 1.22, sy: 0.88, sk: 0, wave: 0, ws: 0, rot: 0, blur: 0, fade: 0, h: 190, s: 60, l: 28, glow: 7, gh: 190, th: 190, ts: 25, tl: 93 } },
  { label: "Noir", font: { f: '"Arial Narrow", "Avenir Next Condensed", "Helvetica Neue", Arial, sans-serif', w: 700, i: "normal", c: "uppercase" },
    p: { ls: -0.01, sx: 0.72, sy: 1.25, sk: 0, wave: 0, ws: 0, rot: 0, blur: 0, fade: 0, h: 0, s: 0, l: 13, glow: 0, gh: 0, th: 0, ts: 0, tl: 90 } },
  { label: "Romance", font: { f: 'Georgia, "Palatino Linotype", Palatino, serif', w: 400, i: "italic", c: "none" },
    p: { ls: 0.04, sx: 1, sy: 1, sk: -9, wave: 5, ws: 1.6, rot: 2.5, blur: 0, fade: 0, h: 340, s: 55, l: 40, glow: 8, gh: 340, th: 340, ts: 40, tl: 94 } },
  { label: "Western", font: { f: 'Rockwell, "Roboto Slab", "Courier New", Georgia, serif', w: 900, i: "normal", c: "uppercase" },
    p: { ls: 0.02, sx: 1.1, sy: 0.95, sk: 0, wave: 0, ws: 0, rot: 0, blur: 0, fade: 0, h: 28, s: 50, l: 28, glow: 0, gh: 28, th: 36, ts: 38, tl: 90 } },
  { label: "Mystery", font: { f: '"Baskerville", "Palatino Linotype", Palatino, Georgia, serif', w: 400, i: "normal", c: "none" },
    p: { ls: 0.06, sx: 1, sy: 1, sk: 0, wave: 2, ws: 0.8, rot: 0, blur: 0.4, fade: 0.8, h: 265, s: 40, l: 34, glow: 0, gh: 265, th: 265, ts: 25, tl: 92 } },
  { label: "Fantasy", font: { f: 'Copperplate, "Copperplate Gothic Light", "Palatino Linotype", Palatino, Georgia, serif', w: 700, i: "normal", c: "uppercase" },
    p: { ls: 0.1, sx: 1, sy: 1.05, sk: 0, wave: 3, ws: 1.2, rot: 1, blur: 0, fade: 0, h: 42, s: 75, l: 33, glow: 12, gh: 45, th: 150, ts: 28, tl: 92 } },
  { label: "Comedy", font: { f: '"Marker Felt", "Chalkboard SE", "Arial Rounded MT Bold", "Comic Sans MS", "Trebuchet MS", sans-serif', w: 700, i: "normal", c: "none" },
    p: { ls: 0.03, sx: 1.05, sy: 1, sk: 6, wave: 12, ws: 5, rot: 6, blur: 0, fade: 0, h: 24, s: 85, l: 42, glow: 0, gh: 24, th: 45, ts: 55, tl: 93 } }
];
const HUE_KEYS = new Set(["h", "gh", "th"]);
const MIN = -100;
const MAX = 700;
const STOP_VALUES = STOPS.map((_, i) => (i - 1) * 100);

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const stage = document.getElementById("stage");
const lettersEl = document.getElementById("letters");
const dial = document.getElementById("dial");
const readout = document.getElementById("readout");
const pillsEl = document.getElementById("pills");
const marksEl = document.getElementById("marks");
const menuEl = document.getElementById("menu");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const restBtn = document.getElementById("rest");
const wobbleBtn = document.getElementById("wobble");
const fxs = [...document.querySelectorAll(".bgfx .fx")];

// ---- letters ----
const spans = [];
[..."Scene & Sip"].forEach(ch => {
  const s = document.createElement("span");
  if (ch === " ") { s.className = "gap"; } else { s.textContent = ch; spans.push(s); }
  lettersEl.appendChild(s);
});

// ---- controls ----
STOPS.slice(1).forEach((st, i) => {
  const b = document.createElement("button");
  b.type = "button";
  b.textContent = st.label;
  b.dataset.stop = i + 1;
  b.addEventListener("click", () => animateTo(STOP_VALUES[i + 1]));
  pillsEl.appendChild(b);
  const m = document.createElement("i");
  m.style.left = ((STOP_VALUES[i + 1] - MIN) / (MAX - MIN) * 100) + "%";
  marksEl.appendChild(m);
});
const pills = [...pillsEl.children];

// ---- blending ----
const lerp = (a, b, t) => a + (b - a) * t;
const lerpHue = (a, b, t) => a + (((b - a + 540) % 360) - 180) * t;

function shapeAt(v) {
  const x = (Math.max(MIN, Math.min(MAX, v)) - MIN) / 100;
  const i = Math.min(STOPS.length - 2, Math.floor(x));
  const t = x - i;
  const a = STOPS[i].p;
  const b = STOPS[i + 1].p;
  const out = {};
  for (const k in a) out[k] = HUE_KEYS.has(k) ? lerpHue(a[k], b[k], t) : lerp(a[k], b[k], t);
  return out;
}

let cur = MIN;
let snap = -1;
let shape = shapeAt(MIN);
let fontPx = 80;
let paused = reduce;
let clock = 0;
const STATIC_T = 0.7;

function applyFont(f) {
  lettersEl.style.fontFamily = f.f;
  lettersEl.style.fontWeight = f.w;
  lettersEl.style.fontStyle = f.i;
  lettersEl.style.textTransform = f.c;
}

function fit() {
  lettersEl.style.fontSize = "100px";
  const natural = lettersEl.getBoundingClientRect().width || 1;
  const avail = stage.clientWidth * 0.96;
  const cap = Math.min(innerWidth * 0.11, 124);
  fontPx = Math.max(24, Math.min(cap, 100 * avail / natural));
  lettersEl.style.fontSize = fontPx + "px";
  stage.style.minHeight = Math.round(fontPx * 1.9) + "px";
}

function paint(t) {
  const p = shape;
  const amp = fontPx / 80;
  spans.forEach((s, j) => {
    const dy = p.wave * amp * Math.sin(t * p.ws + j * 0.75);
    const rot = p.rot * Math.sin(t * p.ws * 1.3 + j * 1.9);
    s.style.transform = `translateY(${dy.toFixed(2)}px) rotate(${rot.toFixed(2)}deg) scale(${p.sx.toFixed(3)}, ${p.sy.toFixed(3)}) skewX(${p.sk.toFixed(2)}deg)`;
    const wave01 = 0.5 + 0.5 * Math.sin(t * 0.9 + j * 1.7);
    s.style.opacity = (1 - p.fade * 0.85 * wave01).toFixed(3);
  });
}

function applyShape(v) {
  cur = v;
  shape = shapeAt(v);
  const p = shape;
  const nearest = Math.max(0, Math.min(STOPS.length - 1, Math.round((v - MIN) / 100)));
  if (nearest !== snap) {
    snap = nearest;
    applyFont(STOPS[snap].font);
    renderMenu(snap);
    readout.textContent = STOPS[snap].label;
    dial.setAttribute("aria-valuetext", STOPS[snap].label);
    pills.forEach(b => {
      if (Number(b.dataset.stop) === snap) b.setAttribute("aria-current", "true"); else b.removeAttribute("aria-current");
    });
  }
  const color = `hsl(${p.h.toFixed(1)} ${p.s.toFixed(1)}% ${p.l.toFixed(1)}%)`;
  lettersEl.style.letterSpacing = p.ls.toFixed(3) + "em";
  lettersEl.style.color = color;
  lettersEl.style.filter = p.blur > 0.02 ? `blur(${p.blur.toFixed(2)}px)` : "none";
  lettersEl.style.textShadow = p.glow > 0.3 ? `0 0 ${(p.glow).toFixed(1)}px hsla(${p.gh.toFixed(0)}, 80%, 55%, .55)` : "none";
  spans.forEach(s => { s.style.marginInline = ((p.sx - 1) * 0.28).toFixed(3) + "em"; });
  const bg = `hsl(${p.th.toFixed(1)} ${p.ts.toFixed(1)}% ${p.tl.toFixed(1)}%)`;
  document.documentElement.style.background = bg;
  document.documentElement.style.setProperty("--mood", color);
  fxs.forEach((el, i) => { el.style.opacity = Math.max(0, 1 - Math.abs(v - STOP_VALUES[i]) / 100).toFixed(3); });
  fit();
  paint(paused || reduce ? STATIC_T : clock);
  prevBtn.disabled = v <= MIN;
  nextBtn.disabled = v >= MAX;
  restBtn.disabled = v <= MIN;
}

function renderMenu(idx) {
  if (idx === 0) {
    menuEl.innerHTML = `<p class="rest">The word is resting.<br>Turn the dial, or pick a genre above, to see that genre's drinks here.</p>`;
    return;
  }
  const g = MENU[idx - 1];
  menuEl.innerHTML = `<h2>${g.name}</h2><p class="tag">${g.tag}</p><ul>${g.items.map(it =>
    `<li><div class="line"><span class="nm">${it[0]}</span><span class="pr">${it[1]}</span></div><p class="ds">${it[2]}</p></li>`).join("")}</ul>`;
}

// ---- moving the dial ----
let tween = null;
function setValue(v) { dial.value = v; applyShape(v); }
function animateTo(target) {
  cancelAnimationFrame(tween);
  target = Math.max(MIN, Math.min(MAX, target));
  const from = cur;
  if (reduce || Math.abs(target - from) < 1) { setValue(target); return; }
  const dur = Math.min(1500, 350 + Math.abs(target - from) * 1.6);
  const start = performance.now();
  (function step(now) {
    const k = Math.min(1, (now - start) / dur);
    const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
    setValue(from + (target - from) * e);
    if (k < 1) tween = requestAnimationFrame(step);
  })(start);
}
const nextStop = () => STOP_VALUES.find(s => s > cur + 0.5) ?? MAX;
const prevStop = () => [...STOP_VALUES].reverse().find(s => s < cur - 0.5) ?? MIN;

dial.addEventListener("input", () => { cancelAnimationFrame(tween); applyShape(Number(dial.value)); });
dial.addEventListener("keydown", e => {
  if (e.key === "ArrowRight" || e.key === "ArrowUp") { e.preventDefault(); animateTo(nextStop()); }
  else if (e.key === "ArrowLeft" || e.key === "ArrowDown") { e.preventDefault(); animateTo(prevStop()); }
});
nextBtn.addEventListener("click", () => animateTo(nextStop()));
prevBtn.addEventListener("click", () => animateTo(prevStop()));
restBtn.addEventListener("click", () => animateTo(MIN));

function syncWobble() {
  wobbleBtn.setAttribute("aria-pressed", String(!paused));
  wobbleBtn.textContent = paused ? "Wobble: off" : "Wobble: on";
  document.body.classList.toggle("still", paused);
}
wobbleBtn.addEventListener("click", () => { paused = !paused; syncWobble(); paint(paused ? STATIC_T : clock); });
if (reduce) wobbleBtn.disabled = true;

// continuous wobble (transform and opacity only, so it never reflows the page)
let last = performance.now();
(function frame(now) {
  const dt = Math.min(0.1, (now - last) / 1000);
  last = now;
  if (!paused && !reduce) {
    clock += dt;
    if (shape.wave > 0.01 || shape.rot > 0.01 || shape.fade > 0.01) paint(clock);
  }
  requestAnimationFrame(frame);
})(last);

addEventListener("resize", () => applyShape(cur));
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => applyShape(cur));

syncWobble();
setValue(MIN);
