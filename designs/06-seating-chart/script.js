const GENRES = [
  { name: "Horror", tag: "Rated R for Roast", items: [
    ["The Final Girl", 4.00, "Dark roast, brewed black. Hot enough to wake the dead."],
    ["Basement Cold Brew", 5.00, "Cold brew steeped for twenty-four hours. Don't ask what else is down there."],
    ["The Call Is Coming From Inside", 5.50, "Blood orange shrub, sparkling. Sweet, red, a little too sharp."] ] },
  { name: "Sci-Fi", tag: "In space, no one can hear you sip", items: [
    ["Warp Drive", 6.00, "Espresso tonic with butterfly pea. Starts blue, ends purple."],
    ["First Contact", 6.50, "Ceremonial matcha with edible glitter."],
    ["Replicant", 5.25, "Oat flat white. More human than the human kind."] ] },
  { name: "Noir", tag: "Always served after dark", items: [
    ["Bitter End", 5.00, "Double espresso, amaro syrup, no sugar."],
    ["The Long Goodbye", 4.50, "Cortado, served slowly."],
    ["Femme Fatale", 4.75, "Hibiscus iced tea. Red, cold, not what you expected."] ] },
  { name: "Romance", tag: "Best enjoyed with someone", items: [
    ["Meet Cute", 8.00, "Cappuccino, one croissant, two forks."],
    ["Rainstorm Kiss", 5.75, "Rose latte. Soft, floral, a little dramatic."],
    ["The Grand Gesture", 6.25, "Honey lavender latte, with a handwritten note."] ] },
  { name: "Action", tag: "Fast, loud, and fully caffeinated", items: [
    ["Full Throttle", 3.75, "Strong black coffee, brewed bold. No sugar, no slowing down."],
    ["Mission: Espresso", 4.25, "A triple shot of espresso. Your mission, should you choose to accept it."] ] },
  { name: "Mystery", tag: "Every sip is a clue", items: [
    ["The Usual Suspect", 4.25, "Earl Grey with a lemon twist. Hiding in plain sight."],
    ["Red Herring", 5.50, "Smoked tea latte with a hint of cinnamon. Not what it seems."],
    ["Plot Twist", 6.00, "Iced chai with a shot of espresso. Sweet, then suddenly not."] ] },
  { name: "Fantasy", tag: "Brewed with a little magic", items: [
    ["The Chosen One", 6.50, "Golden turmeric latte with honey. Destined for greatness."],
    ["Dragon's Breath", 5.75, "Spiced hot chocolate with chili and cinnamon. Mind the fire."],
    ["Elixir of Life", 6.25, "Sparkling elderflower lemonade with edible flowers."] ] },
  { name: "Comedy", tag: "Guaranteed to lighten the mood", items: [
    ["Slapstick", 4.50, "Banana milk latte. Don't slip!"],
    ["Punchline", 5.25, "Peanut butter mocha. Sweet setup, salty finish."],
    ["Laugh Track", 5.00, "Cold brew float with vanilla ice cream. Canned laughter not included."] ] }
];

const money = n => "$" + n.toFixed(2);
const rowsEl = document.getElementById("rows");
const listEl = document.getElementById("cart-list");
const totalEl = document.getElementById("total");
const printBtn = document.getElementById("print");
const clearBtn = document.getElementById("clear");
const screenEls = {
  kicker: document.getElementById("s-kicker"),
  title: document.getElementById("s-title"),
  desc: document.getElementById("s-desc"),
  price: document.getElementById("s-price")
};
const DEFAULT_SCREEN = { kicker: "Now boarding", title: "Choose your seats", desc: "Point at a seat to see what is playing. Click a seat to add it to your tickets.", price: "" };

const seats = []; // { id, row, genre, name, price, desc, btn }
const picked = new Set();

GENRES.forEach((g, r) => {
  const letter = String.fromCharCode(65 + r);
  const row = document.createElement("div");
  row.className = "row";
  row.innerHTML = `<div class="row-label">${letter}<small>${g.name}</small></div><div class="seats"></div><div class="row-label">${letter}<small>${g.name}</small></div>`;
  const wrap = row.querySelector(".seats");
  g.items.forEach((it, i) => {
    const seat = { id: `${letter}${i + 1}`, genre: g, name: it[0], price: it[1], desc: it[2] };
    const b = document.createElement("button");
    b.type = "button";
    b.className = "seat";
    b.setAttribute("aria-pressed", "false");
    b.innerHTML = `<span class="chair" aria-hidden="true"><span>&#10003;</span></span><span class="seat-no">${seat.id}</span><span class="seat-name">${seat.name}</span><span class="seat-price">${money(seat.price)}</span>`;
    b.addEventListener("mouseenter", () => preview(seat));
    b.addEventListener("focus", () => preview(seat));
    b.addEventListener("click", () => toggle(seat));
    seat.btn = b;
    seats.push(seat);
    wrap.appendChild(b);
  });
  rowsEl.appendChild(row);
});

let lastPicked = null;
function showScreen(s) {
  screenEls.kicker.textContent = s.kicker;
  screenEls.title.textContent = s.title;
  screenEls.desc.textContent = s.desc;
  screenEls.price.textContent = s.price;
}
function preview(seat) {
  showScreen({ kicker: `Row ${seat.id[0]} · ${seat.genre.name} · ${seat.genre.tag}`, title: seat.name, desc: seat.desc, price: `Seat ${seat.id} · ${money(seat.price)}` });
}
rowsEl.addEventListener("mouseleave", () => { if (lastPicked && picked.has(lastPicked.id)) preview(lastPicked); else showScreen(DEFAULT_SCREEN); });

function toggle(seat) {
  if (picked.has(seat.id)) { picked.delete(seat.id); } else { picked.add(seat.id); lastPicked = seat; }
  preview(seat);
  render();
}

function render() {
  const chosen = seats.filter(s => picked.has(s.id));
  seats.forEach(s => s.btn.setAttribute("aria-pressed", String(picked.has(s.id))));
  listEl.innerHTML = chosen.length
    ? chosen.map(s => `<li><b>${s.id}</b><span>${s.name}</span><span>${money(s.price)}</span><button type="button" data-id="${s.id}" aria-label="Remove ${s.name}">&times;</button></li>`).join("")
    : `<li class="empty">No seats yet.</li>`;
  totalEl.textContent = money(chosen.reduce((t, s) => t + s.price, 0));
  printBtn.disabled = clearBtn.disabled = chosen.length === 0;
}

listEl.addEventListener("click", e => {
  const btn = e.target.closest("button[data-id]");
  if (!btn) return;
  picked.delete(btn.dataset.id);
  render();
});
clearBtn.addEventListener("click", () => { picked.clear(); lastPicked = null; showScreen(DEFAULT_SCREEN); render(); });

const dlg = document.getElementById("stubs");
printBtn.addEventListener("click", () => {
  const chosen = seats.filter(s => picked.has(s.id));
  document.getElementById("stub-list").innerHTML = chosen.map(s => `
    <div class="stub">
      <div class="main"><small>SCENE &amp; SIP &middot; ADMIT ONE &middot; ${s.genre.name.toUpperCase()}</small><b>${s.name}</b><small>${s.desc}</small></div>
      <div class="side"><small>SEAT</small><b>${s.id}</b><span>${money(s.price)}</span><div class="bars"></div></div>
    </div>`).join("");
  dlg.showModal();
});

render();
