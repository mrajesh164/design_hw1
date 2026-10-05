const GENRES = [
  { id: "horror", name: "Horror", tag: "Rated R for Roast", items: [
    ["The Final Girl", "$4.00", "Dark roast, brewed black."],
    ["Basement Cold Brew", "$5.00", "Cold brew steeped for twenty-four hours."],
    ["The Call Is Coming From Inside", "$5.50", "Blood orange shrub, sparkling."] ] },
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
    ["High Noon", "$3.75", "Cowboy coffee, grounds and all."],
    ["The Good, The Bad, and The Oatmeal", "$7.00", "Skillet oatmeal with three toppings. Pick one."] ] }
];

const strips = document.getElementById("strips");
let n = 0;

GENRES.forEach(g => {
  const edgeText = `SAFETY FILM 400 ▸ ${g.name.toUpperCase()} ▸ `.repeat(8);
  const frames = g.items.map((it, i) => {
    n++;
    return `<button class="frame ${g.id}" type="button" aria-pressed="false" aria-label="${it[0]}, ${it[1]}. Hover or press to develop the frame.">
      <span class="pic" data-num="${n}A"><svg viewBox="0 0 220 110" aria-hidden="true" focusable="false">${ART[it[0]](n)}</svg></span>
      <span class="info"><b>${it[0]}<i>${it[1]}</i></b><span>${it[2]}</span></span>
    </button>`;
  }).join("");
  const wrap = document.createElement("section");
  wrap.className = "strip-wrap";
  wrap.setAttribute("aria-label", g.name + " menu");
  wrap.innerHTML = `
    <p class="strip-label"><b>${g.name}</b><span>${g.tag}</span></p>
    <div class="strip">
      <div class="lane">
        <div class="perf top"><span class="edge" aria-hidden="true">${edgeText}</span></div>
        <div class="frames">${frames}<span class="strip-end"></span></div>
        <div class="perf bottom"><span class="edge" aria-hidden="true">${edgeText}</span></div>
      </div>
    </div>`;
  strips.appendChild(wrap);
});

// Hover develops a frame on a computer; pressing it does the same on touch screens and keyboards
strips.addEventListener("click", e => {
  const f = e.target.closest(".frame");
  if (!f) return;
  const on = f.classList.toggle("developed");
  f.setAttribute("aria-pressed", String(on));
});
