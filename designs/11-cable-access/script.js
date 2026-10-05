const GENRES = [
  { id: "horror", name: "Horror", color: "#ff6b8a", tag: "Rated R for Roast", items: [
    ["The Final Girl", "$4.00", "Dark roast, brewed black. Hot enough to wake the dead."],
    ["Basement Cold Brew", "$5.00", "Cold brew steeped for twenty-four hours. Don't ask what else is down there."],
    ["The Call Is Coming From Inside", "$5.50", "Blood orange shrub, sparkling. Sweet, red, a little too sharp."] ] },
  { id: "scifi", name: "Sci-Fi", color: "#3fe0d0", tag: "In space, no one can hear you sip", items: [
    ["Warp Drive", "$6.00", "Espresso tonic with butterfly pea. Starts blue, ends purple."],
    ["First Contact", "$6.50", "Ceremonial matcha with edible glitter."],
    ["Replicant", "$5.25", "Oat flat white. More human than the human kind."] ] },
  { id: "noir", name: "Noir", color: "#b9aee8", tag: "Always served after dark", items: [
    ["Bitter End", "$5.00", "Double espresso, amaro syrup, no sugar."],
    ["The Long Goodbye", "$4.50", "Cortado, served slowly."],
    ["Femme Fatale", "$4.75", "Hibiscus iced tea. Red, cold, not what you expected."] ] },
  { id: "romance", name: "Romance", color: "#ffa6cf", tag: "Best enjoyed with someone", items: [
    ["Meet Cute", "$8.00", "Cappuccino, one croissant, two forks."],
    ["Rainstorm Kiss", "$5.75", "Rose latte. Soft, floral, a little dramatic."],
    ["The Grand Gesture", "$6.25", "Honey lavender latte, with a handwritten note."] ] },
  { id: "western", name: "Western", color: "#ffc15e", tag: "Strong, simple, no questions asked", items: [
    ["High Noon", "$3.75", "Cowboy coffee, grounds and all."],
    ["The Good, The Bad, and The Oatmeal", "$7.00", "Skillet oatmeal with three toppings. Pick one."] ] },
  { id: "mystery", name: "Mystery", color: "#c3a2f5", tag: "Every sip is a clue", items: [
    ["The Usual Suspect", "$4.25", "Earl Grey with a lemon twist. Hiding in plain sight."],
    ["Red Herring", "$5.50", "Smoked tea latte with a hint of cinnamon. Not what it seems."],
    ["Plot Twist", "$6.00", "Iced chai with a shot of espresso. Sweet, then suddenly not."] ] },
  { id: "fantasy", name: "Fantasy", color: "#7ee8a2", tag: "Brewed with a little magic", items: [
    ["The Chosen One", "$6.50", "Golden turmeric latte with honey. Destined for greatness."],
    ["Dragon's Breath", "$5.75", "Spiced hot chocolate with chili and cinnamon. Mind the fire."],
    ["Elixir of Life", "$6.25", "Sparkling elderflower lemonade with edible flowers."] ] },
  { id: "comedy", name: "Comedy", color: "#ffe66d", tag: "Guaranteed to lighten the mood", items: [
    ["Slapstick", "$4.50", "Banana milk latte. Slips right down."],
    ["Punchline", "$5.25", "Peanut butter mocha. Sweet setup, salty finish."],
    ["Laugh Track", "$5.00", "Cold brew float with vanilla ice cream. Canned laughter not included."] ] }
];

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const grid = document.getElementById("grid");
const slate = document.getElementById("slate");
const view = document.getElementById("prog-view");
const screenEl = document.getElementById("screen");
const lower = document.getElementById("lower-third");

// Guide: a time header row, then one channel per genre
const TIMES = ["7:00 AM", "7:30 AM", "8:00 AM"];
grid.insertAdjacentHTML("beforeend", `<div class="time corner">Channel</div>${TIMES.map(t => `<div class="time">${t}</div>`).join("")}`);

const progs = [];
GENRES.forEach((g, r) => {
  const chan = document.createElement("div");
  chan.className = "chan";
  chan.style.setProperty("--c", g.color);
  chan.innerHTML = `<b>${String(r + 4).padStart(2, "0")} ${g.name}</b><small>${g.tag}</small>`;
  grid.appendChild(chan);

  g.items.forEach((it, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "prog" + (g.items.length === 2 && i === 1 ? " wide" : "");
    b.style.setProperty("--c", g.color);
    b.setAttribute("aria-pressed", "false");
    b.innerHTML = `<b>${it[0]}</b><i>${it[1]}</i>`;
    b.addEventListener("click", () => select(b, g, it));
    progs.push(b);
    grid.appendChild(b);
  });
});

function select(btn, g, it) {
  progs.forEach(p => p.setAttribute("aria-pressed", String(p === btn)));
  slate.hidden = true;
  view.hidden = false;
  view.style.setProperty("--accent", g.color);
  document.getElementById("p-title").textContent = it[0];
  document.getElementById("p-desc").textContent = it[2];
  document.getElementById("p-seg").textContent = `Segment: ${g.name}`;
  document.getElementById("p-price").textContent = it[1];
  // replay the lower-third slide
  lower.style.animation = "none";
  void lower.offsetWidth;
  lower.style.animation = "";
  // bring the ON NOW panel into view only if it has scrolled off screen
  const r = screenEl.getBoundingClientRect();
  if (r.top < 0 || r.bottom > innerHeight) screenEl.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
}

// Community bulletin crawl (text is duplicated once so the loop is seamless)
const LINES = [
  "Open daily 7 a.m. to 10 p.m.",
  "Order ahead: call 555-0420",
  "Volunteers needed for latte art workshop",
  "Lost: one iced tea, last seen in Noir",
  "Tonight's special: The Plot Twist",
  "Bring a friend to Romance, split the croissant"
];
const track = document.getElementById("crawl-track");
track.innerHTML = LINES.map(l => `<span>${l}</span>`).join("") + LINES.map(l => `<span class="dup" aria-hidden="true">${l}</span>`).join("");

const crawl = track.parentElement;
const toggle = document.getElementById("crawl-toggle");
toggle.addEventListener("click", () => {
  const paused = crawl.classList.toggle("paused");
  toggle.setAttribute("aria-pressed", String(paused));
  toggle.textContent = paused ? "Play" : "Pause";
});
