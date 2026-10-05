const COLS = 22;
const ROWS = 5;

const INTRO = ["NOW SERVING", "HOME BREW", "EVERY DRINK IS A GENRE", "PICK A TICKET BELOW", "OPEN DAILY 7AM-10PM"];

const GENRES = [
  { id: "horror", name: "Horror", tag: "Rated R for Roast", footer: "DON'T GO IN THE BASEMENT",
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
function itemRow(name, price) {
  return name + " ".repeat(Math.max(1, COLS - name.length - price.length)) + price;
}
function rowsFor(g) {
  const rows = [("NOW SHOWING: " + g.name).toUpperCase()];
  g.items.forEach(i => rows.push(itemRow(i[1], i[2])));
  while (rows.length < ROWS - 1) rows.push("");
  rows.push(g.footer);
  return rows;
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
    <h3>Now showing: ${g.name}</h3>
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
  b.addEventListener("click", () => { auto = false; select(g); });
  ticketsEl.appendChild(b);
});

function select(g) {
  ticketsEl.querySelectorAll(".ticket").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.id === g.id)));
  show(rowsFor(g), false);
  renderProgram(g);
}

// Start on the intro board, then idle through the genres until the visitor picks one
show(INTRO, true);
let auto = !reduce;
let idx = 0;
ticketsEl.addEventListener("pointerenter", () => { auto = false; });
if (auto) {
  setTimeout(function loop() {
    if (!auto) return;
    select(GENRES[idx++ % GENRES.length]);
    setTimeout(loop, 6500);
  }, 3500);
}
