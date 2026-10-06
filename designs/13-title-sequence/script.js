const GENRES = [
  { id: "horror", name: "Horror", tag: "Rated R for Roast", pal: ["#8f2a22", "#d9531e", "#1c1713"], items: [
    ["The Final Girl", "$4.00", "Dark roast, brewed black. Hot enough to wake the dead."],
    ["Basement Cold Brew", "$5.00", "Cold brew steeped for twenty-four hours. Don't ask what else is down there."],
    ["The Call Is Coming From Inside", "$5.50", "Blood orange shrub, sparkling. Sweet, red, a little too sharp."] ] },
  { id: "scifi", name: "Sci-Fi", tag: "In space, no one can hear you sip", pal: ["#2f6f73", "#d9531e", "#1c1713"], items: [
    ["Warp Drive", "$6.00", "Espresso tonic with butterfly pea. Starts blue, ends purple."],
    ["First Contact", "$6.50", "Ceremonial matcha with edible glitter."],
    ["Replicant", "$5.25", "Oat flat white. More human than the human kind."] ] },
  { id: "noir", name: "Noir", tag: "Always served after dark", pal: ["#2b2723", "#8f2a22", "#9d927e"], items: [
    ["Bitter End", "$5.00", "Double espresso, amaro syrup, no sugar."],
    ["The Long Goodbye", "$4.50", "Cortado, served slowly."],
    ["Femme Fatale", "$4.75", "Hibiscus iced tea. Red, cold, not what you expected."] ] },
  { id: "romance", name: "Romance", tag: "Best enjoyed with someone", pal: ["#c4616f", "#8f2a22", "#1c1713"], items: [
    ["Meet Cute", "$8.00", "Cappuccino, one croissant, two forks."],
    ["Rainstorm Kiss", "$5.75", "Rose latte. Soft, floral, a little dramatic."],
    ["The Grand Gesture", "$6.25", "Honey lavender latte, with a handwritten note."] ] },
  { id: "action", name: "Action", tag: "Fast, loud, and fully caffeinated", pal: ["#d9531e", "#e3a63a", "#1c1713"], items: [
    ["Full Throttle", "$3.75", "Strong black coffee, brewed bold. No sugar, no slowing down."],
    ["Mission: Espresso", "$4.25", "A triple shot of espresso. Your mission, should you choose to accept it."] ] },
  { id: "mystery", name: "Mystery", tag: "Every sip is a clue", pal: ["#5b3f7a", "#d9531e", "#1c1713"], items: [
    ["The Usual Suspect", "$4.25", "Earl Grey with a lemon twist. Hiding in plain sight."],
    ["Red Herring", "$5.50", "Smoked tea latte with a hint of cinnamon. Not what it seems."],
    ["Plot Twist", "$6.00", "Iced chai with a shot of espresso. Sweet, then suddenly not."] ] },
  { id: "fantasy", name: "Fantasy", tag: "Brewed with a little magic", pal: ["#3f7a52", "#c9852b", "#1c1713"], items: [
    ["The Chosen One", "$6.50", "Golden turmeric latte with honey. Destined for greatness."],
    ["Dragon's Breath", "$5.75", "Spiced hot chocolate with chili and cinnamon. Mind the fire."],
    ["Elixir of Life", "$6.25", "Sparkling elderflower lemonade with edible flowers."] ] },
  { id: "comedy", name: "Comedy", tag: "Guaranteed to lighten the mood", pal: ["#d49a2a", "#c4455a", "#1c1713"], items: [
    ["Slapstick", "$4.50", "Banana milk latte. Don't slip!"],
    ["Punchline", "$5.25", "Peanut butter mocha. Sweet setup, salty finish."],
    ["Laugh Track", "$5.00", "Cold brew float with vanilla ice cream. Canned laughter not included."] ] }
];

const DEFAULT_PAL = ["#d9531e", "#8f2a22", "#1c1713"];
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const body = document.body;
const intro = document.getElementById("intro");
const credit = document.getElementById("i-credit");
const app = document.getElementById("app");
const art = document.getElementById("art");
const list = document.getElementById("genres");
const card = document.getElementById("card");
const pad2 = n => String(n).padStart(2, "0");

/* ---------- the poster ---------- */
function setPalette(pal, i) {
  const r = document.documentElement.style;
  r.setProperty("--c1", pal[0]);
  r.setProperty("--c2", pal[1]);
  r.setProperty("--c3", pal[2]);
  art.style.setProperty("--r", i == null ? 0 : (i * 23) % 70 - 20);
  art.style.setProperty("--dx", i == null ? 0 : ((i % 4) - 1.5) * 18);
}

GENRES.forEach((g, i) => {
  const li = document.createElement("li");
  const b = document.createElement("button");
  b.type = "button";
  b.innerHTML = `<span class="n">${pad2(i + 1)}</span><span class="g">${g.name}</span><span class="k">${g.items.length} drinks &rsaquo;</span>`;
  b.addEventListener("mouseenter", () => setPalette(g.pal, i));
  b.addEventListener("focus", () => setPalette(g.pal, i));
  b.addEventListener("click", () => openCard(g, i, b));
  li.appendChild(b);
  list.appendChild(li);
});
list.addEventListener("mouseleave", () => { if (!card.open) setPalette(DEFAULT_PAL); });

function openCard(g, i, opener) {
  setPalette(g.pal, i);
  document.getElementById("c-title").textContent = g.name;
  document.getElementById("c-tag").textContent = g.tag;
  document.getElementById("c-list").innerHTML = g.items.map(it => `<li><b>${it[0]}</b><i>${it[1]}</i><p>${it[2]}</p></li>`).join("");
  card.showModal();
  card.addEventListener("close", () => { opener.focus({ preventScroll: true }); }, { once: true });
}
document.getElementById("c-close").addEventListener("click", () => card.close());
card.addEventListener("click", e => { if (e.target === card) card.close(); });

/* ---------- the opening ---------- */
let timers = [];
let playing = false;
const later = (fn, ms) => timers.push(setTimeout(fn, ms));

function say(text, flash) {
  credit.textContent = text;
  credit.className = "i-credit pop" + (flash ? " flash" : "");
}

function finish() {
  if (!playing) return;
  playing = false;
  timers.forEach(clearTimeout);
  timers = [];
  intro.classList.add("out");
  later(() => {
    body.classList.remove("playing");
    app.inert = false;
    app.removeAttribute("aria-hidden");
    intro.className = "intro";
    credit.textContent = "";
    document.getElementById("title").setAttribute("tabindex", "-1");
    document.getElementById("title").focus({ preventScroll: true });
  }, reduce ? 0 : 700);
}

function play() {
  if (reduce) return;
  playing = true;
  window.scrollTo(0, 0);
  timers.forEach(clearTimeout);
  timers = [];
  intro.className = "intro";
  credit.className = "i-credit";
  credit.textContent = "";
  body.classList.add("playing");
  app.inert = true;
  app.setAttribute("aria-hidden", "true");
  intro.getBoundingClientRect();

  later(() => intro.classList.add("s1"), 100);          // small text fades in
  later(() => intro.classList.add("s2"), 1700);         // orange bar sweeps across
  later(() => { intro.classList.add("s3"); say("Eight genres"); }, 2700);
  later(() => say("Twenty-three drinks"), 3700);
  later(() => say("Now serving"), 4700);
  GENRES.forEach((g, i) => later(() => say(g.name, true), 5300 + i * 330));
  later(() => intro.classList.add("s5"), 8100);         // title stamps in
  later(finish, 9900);
}

document.getElementById("skip").addEventListener("click", finish);
addEventListener("keydown", e => {
  if (playing && (e.key === "Escape" || e.key === " " || e.key === "Enter")) { e.preventDefault(); finish(); }
});
document.getElementById("replay").addEventListener("click", play);

setPalette(DEFAULT_PAL);
play();
