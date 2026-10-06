const GLYPHS = {
  horror: '<path fill="currentColor" d="M5 22V11a7 7 0 0 1 14 0v11l-2.3-2.2L14.4 22 12 19.8 9.6 22l-2.3-2.2z"/><circle cx="9.5" cy="11" r="1.5" fill="#15110d"/><circle cx="14.5" cy="11" r="1.5" fill="#15110d"/>',
  scifi: '<ellipse cx="12" cy="15.5" rx="10" ry="3.6" fill="currentColor"/><path fill="currentColor" d="M7.2 14.2a5 5 0 0 1 9.6 0z"/><circle cx="7.5" cy="16" r=".9" fill="#15110d"/><circle cx="12" cy="17" r=".9" fill="#15110d"/><circle cx="16.5" cy="16" r=".9" fill="#15110d"/>',
  noir: '<ellipse cx="12" cy="16.5" rx="10" ry="3" fill="currentColor"/><path fill="currentColor" d="M6.5 15.5c0-5 1.8-9 5.5-9s5.5 4 5.5 9z"/><rect x="6.8" y="12.4" width="10.4" height="1.8" fill="#15110d"/>',
  romance: '<path fill="currentColor" d="M12 21s-8-4.9-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6.1-8 11-8 11z"/>',
  action: '<path fill="currentColor" d="M14 2L5 13.5h5.6L9 22l9.5-12H13z"/>',
  mystery: '<circle cx="10" cy="10" r="6.2" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M14.7 14.7L21 21" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>',
  fantasy: '<path fill="currentColor" d="M3 19L4.6 8l4.6 4.4L12 5l2.8 7.4L19.4 8 21 19z"/><rect x="3" y="19.5" width="18" height="2" fill="currentColor"/>',
  comedy: '<circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="8.6" cy="10" r="1.4" fill="currentColor"/><circle cx="15.4" cy="10" r="1.4" fill="currentColor"/><path d="M7.6 14.2c1 2.6 7.8 2.6 8.8 0" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>'
};

const MENU = [
  { id: "horror", name: "Horror", tag: "Rated R for Roast", rgb: "154, 47, 40", drinks: [
    ["The Final Girl", "$4.00", "Dark roast, brewed black. Hot enough to wake the dead."],
    ["Basement Cold Brew", "$5.00", "Cold brew steeped for twenty-four hours. Don't ask what else is down there."],
    ["The Call Is Coming From Inside", "$5.50", "Blood orange shrub, sparkling. Sweet, red, a little too sharp."] ] },
  { id: "scifi", name: "Sci-Fi", tag: "In space, no one can hear you sip", rgb: "47, 127, 122", drinks: [
    ["Warp Drive", "$6.00", "Espresso tonic with butterfly pea. Starts blue, ends purple."],
    ["First Contact", "$6.50", "Ceremonial matcha with edible glitter."],
    ["Replicant", "$5.25", "Oat flat white. More human than the human kind."] ] },
  { id: "noir", name: "Noir", tag: "Always served after dark", rgb: "94, 100, 112", drinks: [
    ["Bitter End", "$5.00", "Double espresso, amaro syrup, no sugar."],
    ["The Long Goodbye", "$4.50", "Cortado, served slowly."],
    ["Femme Fatale", "$4.75", "Hibiscus iced tea. Red, cold, not what you expected."] ] },
  { id: "romance", name: "Romance", tag: "Best enjoyed with someone", rgb: "168, 73, 106", drinks: [
    ["Meet Cute", "$8.00", "Cappuccino, one croissant, two forks."],
    ["Rainstorm Kiss", "$5.75", "Rose latte. Soft, floral, a little dramatic."],
    ["The Grand Gesture", "$6.25", "Honey lavender latte, with a handwritten note."] ] },
  { id: "action", name: "Action", tag: "Fast, loud, and fully caffeinated", rgb: "200, 80, 30", drinks: [
    ["Full Throttle", "$3.75", "Strong black coffee, brewed bold. No sugar, no slowing down."],
    ["Mission: Espresso", "$4.25", "A triple shot of espresso. Your mission, should you choose to accept it."] ] },
  { id: "mystery", name: "Mystery", tag: "Every sip is a clue", rgb: "111, 74, 150", drinks: [
    ["The Usual Suspect", "$4.25", "Earl Grey with a lemon twist. Hiding in plain sight."],
    ["Red Herring", "$5.50", "Smoked tea latte with a hint of cinnamon. Not what it seems."],
    ["Plot Twist", "$6.00", "Iced chai with a shot of espresso. Sweet, then suddenly not."] ] },
  { id: "fantasy", name: "Fantasy", tag: "Brewed with a little magic", rgb: "62, 125, 86", drinks: [
    ["The Chosen One", "$6.50", "Golden turmeric latte with honey. Destined for greatness."],
    ["Dragon's Breath", "$5.75", "Spiced hot chocolate with chili and cinnamon. Mind the fire."],
    ["Elixir of Life", "$6.25", "Sparkling elderflower lemonade with edible flowers."] ] },
  { id: "comedy", name: "Comedy", tag: "Guaranteed to lighten the mood", rgb: "176, 106, 26", drinks: [
    ["Slapstick", "$4.50", "Banana milk latte. Don't slip!"],
    ["Punchline", "$5.25", "Peanut butter mocha. Sweet setup, salty finish."],
    ["Laugh Track", "$5.00", "Cold brew float with vanilla ice cream. Canned laughter not included."] ] }
];

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const panelsEl = document.getElementById("panels");
const bell = document.getElementById("bell");
const pickEl = document.getElementById("pick");

panelsEl.innerHTML = MENU.map((g, gi) => `
  <section class="panel" style="--rgb:${g.rgb}" aria-labelledby="h-${g.id}">
    <header class="ph">
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${GLYPHS[g.id]}</svg>
      <h2 id="h-${g.id}">${g.name}</h2>
    </header>
    <p class="tag">${g.tag}</p>
    <ul class="drinks">
      ${g.drinks.map((d, i) => `
      <li class="drink">
        <button type="button" class="row" aria-expanded="false" aria-controls="d-${gi}-${i}">
          <span class="nm">${d[0]}</span><span class="ld" aria-hidden="true"></span><span class="pr">${d[1]}</span><span class="mk" aria-hidden="true"></span>
        </button>
        <p class="desc" id="d-${gi}-${i}">${d[2]}</p>
      </li>`).join("")}
    </ul>
  </section>`).join("");

const allRows = [...panelsEl.querySelectorAll(".row")];

function setOpen(row, open) {
  if (open) {
    row.closest(".panel").querySelectorAll(".row").forEach(r => { if (r !== row) r.setAttribute("aria-expanded", "false"); });
  }
  row.setAttribute("aria-expanded", String(open));
}

panelsEl.addEventListener("click", e => {
  const row = e.target.closest(".row");
  if (!row) return;
  setOpen(row, row.getAttribute("aria-expanded") !== "true");
});

// The service bell: highlight a random drink, open it, and say which one it is
let lastPick = null;
bell.addEventListener("click", () => {
  bell.classList.remove("ring");
  void bell.offsetWidth;
  bell.classList.add("ring");

  panelsEl.querySelectorAll(".drink.picked").forEach(li => li.classList.remove("picked"));
  let row;
  do { row = allRows[Math.floor(Math.random() * allRows.length)]; } while (row === lastPick && allRows.length > 1);
  lastPick = row;
  const li = row.closest(".drink");
  li.classList.add("picked");
  setOpen(row, true);
  pickEl.textContent = `Barista's pick: ${row.querySelector(".nm").textContent}`;

  const r = li.getBoundingClientRect();
  if (r.top < 70 || r.bottom > innerHeight - 70) li.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
});
