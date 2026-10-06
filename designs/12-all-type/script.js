const MENU = [
  { id: "horror", name: "Horror", tag: "Rated R for Roast", drinks: [
    ["The Final Girl", 4.00, "Dark roast, brewed black. Hot enough to wake the dead."],
    ["Basement Cold Brew", 5.00, "Cold brew steeped for twenty-four hours. Don't ask what else is down there."],
    ["The Call Is Coming From Inside", 5.50, "Blood orange shrub, sparkling. Sweet, red, a little too sharp."] ] },
  { id: "scifi", name: "Sci-Fi", tag: "In space, no one can hear you sip", drinks: [
    ["Warp Drive", 6.00, "Espresso tonic with butterfly pea. Starts blue, ends purple."],
    ["First Contact", 6.50, "Ceremonial matcha with edible glitter."],
    ["Replicant", 5.25, "Oat flat white. More human than the human kind."] ] },
  { id: "noir", name: "Noir", tag: "Always served after dark", drinks: [
    ["Bitter End", 5.00, "Double espresso, amaro syrup, no sugar."],
    ["The Long Goodbye", 4.50, "Cortado, served slowly."],
    ["Femme Fatale", 4.75, "Hibiscus iced tea. Red, cold, not what you expected."] ] },
  { id: "romance", name: "Romance", tag: "Best enjoyed with someone", drinks: [
    ["Meet Cute", 8.00, "Cappuccino, one croissant, two forks."],
    ["Rainstorm Kiss", 5.75, "Rose latte. Soft, floral, a little dramatic."],
    ["The Grand Gesture", 6.25, "Honey lavender latte, with a handwritten note."] ] },
  { id: "action", name: "Action", tag: "Fast, loud, and fully caffeinated", drinks: [
    ["Full Throttle", 3.75, "Strong black coffee, brewed bold. No sugar, no slowing down."],
    ["Mission: Espresso", 4.25, "A triple shot of espresso. Your mission, should you choose to accept it."] ] },
  { id: "mystery", name: "Mystery", tag: "Every sip is a clue", drinks: [
    ["The Usual Suspect", 4.25, "Earl Grey with a lemon twist. Hiding in plain sight."],
    ["Red Herring", 5.50, "Smoked tea latte with a hint of cinnamon. Not what it seems."],
    ["Plot Twist", 6.00, "Iced chai with a shot of espresso. Sweet, then suddenly not."] ] },
  { id: "fantasy", name: "Fantasy", tag: "Brewed with a little magic", drinks: [
    ["The Chosen One", 6.50, "Golden turmeric latte with honey. Destined for greatness."],
    ["Dragon's Breath", 5.75, "Spiced hot chocolate with chili and cinnamon. Mind the fire."],
    ["Elixir of Life", 6.25, "Sparkling elderflower lemonade with edible flowers."] ] },
  { id: "comedy", name: "Comedy", tag: "Guaranteed to lighten the mood", drinks: [
    ["Slapstick", 4.50, "Banana milk latte. Don't slip!"],
    ["Punchline", 5.25, "Peanut butter mocha. Sweet setup, salty finish."],
    ["Laugh Track", 5.00, "Cold brew float with vanilla ice cream. Canned laughter not included."] ] }
];

// Flatten once; each drink keeps its menu number (01-23) in every sort order
let num = 0;
const ALL = MENU.flatMap(g => g.drinks.map(d => ({ no: ++num, genre: g, name: d[0], price: d[1], desc: d[2] })));

const menuEl = document.getElementById("menu");
const indexEl = document.getElementById("index");
const barEl = document.getElementById("bar");
const sortBtns = [...document.querySelectorAll("[data-sort]")];
const pad2 = n => String(n).padStart(2, "0");
const money = n => "$" + n.toFixed(2);
const key = s => s.replace(/^the\s+/i, "").toLowerCase();

function rowHTML(d, showGenre) {
  return `<div class="row" role="row">
    <div class="cell no" role="cell">${pad2(d.no)}</div>
    <div class="cell nm" role="cell">${showGenre ? `<span class="chip">${d.genre.name}</span><br>` : ""}${d.name}</div>
    <div class="cell ds" role="cell">${d.desc}</div>
    <div class="cell pr" role="cell">${money(d.price)}</div>
  </div>`;
}

function renderGenre() {
  menuEl.innerHTML = MENU.map((g, i) => {
    const rows = ALL.filter(d => d.genre === g);
    const from = Math.min(...rows.map(d => d.price));
    return `<section class="band" id="g-${g.id}" aria-label="${g.name} menu">
      <header class="band-head">
        <h2><span class="fit" data-fit data-max="10">${g.name}</span></h2>
        <div class="band-meta"><p>${g.tag}</p><p class="count">${rows.length} drinks, from ${money(from)}</p></div>
      </header>
      <div class="table" role="table" aria-label="${g.name} drinks">${rows.map(d => rowHTML(d, false)).join("")}</div>
    </section>`;
  }).join("");
  indexEl.innerHTML = MENU.map(g => `<a href="#g-${g.id}">${g.name}</a>`).join("");
}

function renderFlat(mode) {
  const list = [...ALL].sort(mode === "price"
    ? (a, b) => a.price - b.price || key(a.name).localeCompare(key(b.name))
    : (a, b) => key(a.name).localeCompare(key(b.name)));
  const title = mode === "price" ? "By price" : "A-Z";
  const note = mode === "price" ? "Lowest price first" : "Alphabetical, ignoring The";
  menuEl.innerHTML = `<section class="band" aria-label="All drinks, sorted">
    <header class="band-head">
      <h2><span class="fit" data-fit data-max="10">${title}</span></h2>
      <div class="band-meta"><p>${note}</p><p class="count">${list.length} drinks, all genres</p></div>
    </header>
    <div class="table" role="table" aria-label="All drinks">${list.map(d => rowHTML(d, true)).join("")}</div>
  </section>`;
  indexEl.innerHTML = `<span>${note}. Genre shown on each row.</span>`;
}

// Size each [data-fit] line so it fills the width of its box, never overflowing
function fit() {
  document.querySelectorAll("[data-fit]").forEach(el => {
    const box = el.parentElement;
    const cs = getComputedStyle(box);
    const avail = box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    if (avail <= 0) return;
    el.style.fontSize = "100px";
    const w = el.getBoundingClientRect().width;
    if (!w) return;
    let size = 100 * avail / w;
    const maxVw = parseFloat(el.dataset.max);
    if (maxVw) size = Math.min(size, innerWidth * maxVw / 100);
    el.style.fontSize = size + "px";
  });
  document.documentElement.style.setProperty("--bar-h", barEl.offsetHeight + "px");
}

function setSort(mode, scroll) {
  sortBtns.forEach(b => b.setAttribute("aria-pressed", String(b.dataset.sort === mode)));
  if (mode === "genre") renderGenre(); else renderFlat(mode);
  fit();
  if (scroll) menuEl.scrollIntoView({ block: "start" });
}

sortBtns.forEach(b => b.addEventListener("click", () => setSort(b.dataset.sort, true)));

let queued = false;
addEventListener("resize", () => { if (!queued) { queued = true; requestAnimationFrame(() => { fit(); queued = false; }); } });
if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);

setSort("genre", false);
