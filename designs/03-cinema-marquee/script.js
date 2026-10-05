const COLS = 22;
const ROWS = 5;

const INTRO = ["NOW SERVING", "", "EVERY DRINK IS A GENRE", "PICK A TICKET BELOW", "OPEN DAILY 7AM-10PM"];

const GENRES = [
  { id: "horror", name: "Horror", tag: "Rated R for Roast", footer: "AVOID THE BASEMENT",
    items: [
      ["The Final Girl", "THE FINAL GIRL", "$4.00", "Dark roast, brewed black. Hot enough to wake the dead."],
      ["Basement Cold Brew", "BASEMENT BREW", "$5.00", "Cold brew steeped 24 hours. Don't ask what else is down there."],
      ["The Call Is Coming From Inside", "CALL FROM INSIDE", "$5.50", "Blood orange shrub, sparkling. Sweet, red, a little too sharp."]
    ] },
  { id: "scifi", name: "Sci-Fi", tag: "In space, no one can hear you sip", footer: "WE COME IN PEACE",
    items: [
      ["Warp Drive", "WARP DRIVE", "$6.00", "Espresso tonic with butterfly pea. Starts blue, ends purple."],
      ["First Contact", "FIRST CONTACT", "$6.50", "Ceremonial matcha with edible glitter."],
      ["Replicant", "REPLICANT", "$5.25", "Oat flat white. More human than the human kind."]
    ] },
  { id: "noir", name: "Noir", tag: "Always served after dark", footer: "IT RAINS ALL NIGHT",
    items: [
      ["Bitter End", "BITTER END", "$5.00", "Double espresso, amaro syrup, no sugar."],
      ["The Long Goodbye", "LONG GOODBYE", "$4.50", "Cortado, served slowly."],
      ["Femme Fatale", "FEMME FATALE", "$4.75", "Hibiscus iced tea. Red, cold, not what you expected."]
    ] },
  { id: "romance", name: "Romance", tag: "Best enjoyed with someone", footer: "BRING SOMEONE",
    items: [
      ["Meet Cute", "MEET CUTE", "$8.00", "Cappuccino, one croissant, two forks."],
      ["Rainstorm Kiss", "RAINSTORM KISS", "$5.75", "Rose latte. Soft, floral, a little dramatic."],
      ["The Grand Gesture", "GRAND GESTURE", "$6.25", "Honey lavender latte, with a handwritten note."]
    ] },
  { id: "western", name: "Western", tag: "Strong, simple, no questions asked", footer: "FASTEST SIP IN TOWN",
    items: [
      ["High Noon", "HIGH NOON", "$3.75", "Cowboy coffee, grounds and all."],
      ["The Good, The Bad, and The Oatmeal", "GOOD BAD OATMEAL", "$7.00", "Skillet oatmeal with three toppings. Pick one."]
    ] },
  { id: "mystery", name: "Mystery", tag: "Every sip is a clue", footer: "TRUST NO ONE",
    items: [
      ["The Usual Suspect", "USUAL SUSPECT", "$4.25", "Earl Grey with a lemon twist. Hiding in plain sight."],
      ["Red Herring", "RED HERRING", "$5.50", "Smoked tea latte with a hint of cinnamon. Not what it seems."],
      ["Plot Twist", "PLOT TWIST", "$6.00", "Iced chai with a shot of espresso. Sweet, then suddenly not."]
    ] },
  { id: "fantasy", name: "Fantasy", tag: "Brewed with a little magic", footer: "THE QUEST AWAITS",
    items: [
      ["The Chosen One", "THE CHOSEN ONE", "$6.50", "Golden turmeric latte with honey. Destined for greatness."],
      ["Dragon's Breath", "DRAGONS BREATH", "$5.75", "Spiced hot chocolate with chili and cinnamon. Mind the fire."],
      ["Elixir of Life", "ELIXIR OF LIFE", "$6.25", "Sparkling elderflower lemonade with edible flowers."]
    ] },
  { id: "comedy", name: "Comedy", tag: "Guaranteed to lighten the mood", footer: "NO REFUNDS ON JOKES",
    items: [
      ["Slapstick", "SLAPSTICK", "$4.50", "Banana milk latte. Slips right down."],
      ["Punchline", "PUNCHLINE", "$5.25", "Peanut butter mocha. Sweet setup, salty finish."],
      ["Laugh Track", "LAUGH TRACK", "$5.00", "Cold brew float with vanilla ice cream. Canned laughter not included."]
    ] }
];

const board = document.getElementById("board");
const ticketsEl = document.getElementById("tickets");
const programEl = document.getElementById("program");
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$&.-";

// Build tiles
const tiles = [];
for (let r = 0; r < ROWS; r++) {
  const row = document.createElement("div");
  row.className = "row" + (r === 0 ? " head" : "");
  tiles[r] = [];
  for (let c = 0; c < COLS; c++) {
    const t = document.createElement("span");
    t.className = "tile";
    t.textContent = " ";
    row.appendChild(t);
    tiles[r][c] = t;
  }
  board.appendChild(row);
}

function center(s) {
  const pad = Math.max(0, COLS - s.length);
  return " ".repeat(Math.floor(pad / 2)) + s;
}
// The sign teases; the full menu lives below, so the two never repeat each other
const TEASERS = {
  horror: "RATED R FOR ROAST",
  scifi: "NO ONE HEARS YOU SIP",
  noir: "SERVED AFTER DARK",
  romance: "BEST WITH SOMEONE",
  western: "STRONG AND SIMPLE",
  mystery: "EVERY SIP IS A CLUE",
  fantasy: "BREWED WITH MAGIC",
  comedy: "GUARANTEED TO LAUGH"
};
function rowsFor(g) {
  const low = Math.min(...g.items.map(i => parseFloat(i[2].slice(1))));
  return [
    ("NOW SHOWING: " + g.name).toUpperCase(),
    TEASERS[g.id],
    `${g.items.length} DRINKS FROM $${low.toFixed(2)}`,
    "FULL MENU BELOW",
    g.footer
  ];
}

let timers = [];
function show(lines, centered) {
  timers.forEach(clearTimeout);
  timers = [];
  for (let r = 0; r < ROWS; r++) {
    const text = (centered ? center(lines[r] || "") : (lines[r] || "")).padEnd(COLS).slice(0, COLS);
    for (let c = 0; c < COLS; c++) {
      const tile = tiles[r][c];
      const ch = text[c] === " " ? " " : text[c];
      if (reduce) { tile.textContent = ch; continue; }
      if (tile.textContent === ch) continue;
      const start = c * 22 + r * 70;
      const flips = 5 + Math.floor(Math.random() * 4);
      for (let f = 0; f < flips; f++) {
        timers.push(setTimeout(() => {
          tile.classList.add("spin");
          tile.textContent = CHARS[Math.floor(Math.random() * CHARS.length)];
        }, start + f * 45));
      }
      timers.push(setTimeout(() => { tile.classList.remove("spin"); tile.textContent = ch; }, start + flips * 45));
    }
  }
}

function renderProgram(g) {
  programEl.innerHTML = `
    <h3>${g.name} menu</h3>
    <p class="tag">${g.tag}</p>
    <ul class="items">${g.items.map(i => `
      <li><b>${i[0]}</b><span class="price">${i[2]}</span><p>${i[3]}</p></li>`).join("")}
    </ul>`;
}

// Tickets
GENRES.forEach(g => {
  const b = document.createElement("button");
  b.className = "ticket";
  b.dataset.id = g.id;
  b.setAttribute("aria-pressed", "false");
  b.innerHTML = `<span>ADMIT ONE</span><b>${g.name.toUpperCase()}</b><small>${g.items.length} drinks</small>`;
  b.addEventListener("click", () => select(g));
  ticketsEl.appendChild(b);
});

function select(g) {
  ticketsEl.querySelectorAll(".ticket").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.id === g.id)));
  show(rowsFor(g), false);
  renderProgram(g);
}

// The board stays on the intro until a ticket is picked
show(INTRO, true);
