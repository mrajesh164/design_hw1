const GENRES = [
  { id: "horror", name: "Horror", tag: "Rated R for Roast", drinks: [
    ["The Final Girl", "$4.00", "Dark roast, brewed black. Hot enough to wake the dead."],
    ["Basement Cold Brew", "$5.00", "Cold brew steeped for twenty-four hours. Don't ask what else is down there."],
    ["The Call Is Coming From Inside", "$5.50", "Blood orange shrub, sparkling. Sweet, red, a little too sharp."] ] },
  { id: "scifi", name: "Sci-Fi", tag: "In space, no one can hear you sip", drinks: [
    ["Warp Drive", "$6.00", "Espresso tonic with butterfly pea. Starts blue, ends purple."],
    ["First Contact", "$6.50", "Ceremonial matcha with edible glitter."],
    ["Replicant", "$5.25", "Oat flat white. More human than the human kind."] ] },
  { id: "noir", name: "Noir", tag: "Always served after dark", drinks: [
    ["Bitter End", "$5.00", "Double espresso, amaro syrup, no sugar."],
    ["The Long Goodbye", "$4.50", "Cortado, served slowly."],
    ["Femme Fatale", "$4.75", "Hibiscus iced tea. Red, cold, not what you expected."] ] },
  { id: "romance", name: "Romance", tag: "Best enjoyed with someone", drinks: [
    ["Meet Cute", "$8.00", "Cappuccino, one croissant, two forks."],
    ["Rainstorm Kiss", "$5.75", "Rose latte. Soft, floral, a little dramatic."],
    ["The Grand Gesture", "$6.25", "Honey lavender latte, with a handwritten note."] ] },
  { id: "western", name: "Western", tag: "Strong, simple, no questions asked", drinks: [
    ["True Grit", "$3.75", "Strong black coffee, brewed bold. No sugar, no fuss."],
    ["A Fistful of Espresso", "$4.25", "A triple shot of espresso. Quick on the draw."] ] },
  { id: "mystery", name: "Mystery", tag: "Every sip is a clue", drinks: [
    ["The Usual Suspect", "$4.25", "Earl Grey with a lemon twist. Hiding in plain sight."],
    ["Red Herring", "$5.50", "Smoked tea latte with a hint of cinnamon. Not what it seems."],
    ["Plot Twist", "$6.00", "Iced chai with a shot of espresso. Sweet, then suddenly not."] ] },
  { id: "fantasy", name: "Fantasy", tag: "Brewed with a little magic", drinks: [
    ["The Chosen One", "$6.50", "Golden turmeric latte with honey. Destined for greatness."],
    ["Dragon's Breath", "$5.75", "Spiced hot chocolate with chili and cinnamon. Mind the fire."],
    ["Elixir of Life", "$6.25", "Sparkling elderflower lemonade with edible flowers."] ] },
  { id: "comedy", name: "Comedy", tag: "Guaranteed to lighten the mood", drinks: [
    ["Slapstick", "$4.50", "Banana milk latte. Don't slip!"],
    ["Punchline", "$5.25", "Peanut butter mocha. Sweet setup, salty finish."],
    ["Laugh Track", "$5.00", "Cold brew float with vanilla ice cream. Canned laughter not included."] ] }
];

const baysEl = document.getElementById("bays");
const cabinet = document.getElementById("cabinet");
const glassEl = document.getElementById("glass");
const card = document.getElementById("card");
const svg = (name, n) => `<svg viewBox="0 0 220 110" aria-hidden="true" focusable="false">${ART[name](n)}</svg>`;

// Build one lit bay per genre; each drink is a button standing on the shelf
let n = 0;
baysEl.innerHTML = GENRES.map((g, gi) => `
  <section class="bay ${g.id}" aria-label="${g.name} shelf" style="--n:${g.drinks.length}">
    <span class="layer wall" aria-hidden="true"></span>
    <div class="plaque"><b>${g.name}</b><small>${g.tag}</small></div>
    <div class="stage">
      ${g.drinks.map((d, di) => {
        n++;
        return `<button type="button" class="drink" data-g="${gi}" data-d="${di}" data-n="${n}" aria-haspopup="dialog" aria-label="${d[0]}, ${d[1]}. Read about it.">
          <span class="fig">${svg(d[0], n)}</span>
          <span class="ledge" aria-hidden="true"></span>
          <span class="label"><b>${d[0]}</b><i>${d[1]}</i></span>
        </button>`;
      }).join("")}
    </div>
  </section>`).join("");

// Description card
baysEl.addEventListener("click", e => {
  const b = e.target.closest(".drink");
  if (!b) return;
  const g = GENRES[Number(b.dataset.g)];
  const d = g.drinks[Number(b.dataset.d)];
  document.getElementById("c-art").innerHTML = svg(d[0], 100 + Number(b.dataset.n));
  document.getElementById("c-art").style.setProperty("--tint", getComputedStyle(b.closest(".bay")).getPropertyValue("--tint"));
  document.getElementById("c-genre").textContent = `${g.name} shelf`;
  document.getElementById("c-name").textContent = d[0];
  document.getElementById("c-price").textContent = d[1];
  document.getElementById("c-desc").textContent = d[2];
  card.showModal();
});
document.getElementById("c-close").addEventListener("click", () => card.close());
card.addEventListener("click", e => { if (e.target === card) card.close(); });

// Parallax: layers shift by different amounts with the pointer, and a soft light follows it.
// Skipped on touch screens and for reduced motion, where the static case is already lit.
const still = matchMedia("(hover: none), (prefers-reduced-motion: reduce)").matches;
if (!still) {
  let raf = 0;
  let nx = 0;
  let ny = 0;
  let mx = 50;
  let my = 30;
  const apply = () => {
    raf = 0;
    cabinet.style.setProperty("--px", nx.toFixed(3));
    cabinet.style.setProperty("--py", ny.toFixed(3));
    glassEl.style.setProperty("--mx", mx.toFixed(1) + "%");
    glassEl.style.setProperty("--my", my.toFixed(1) + "%");
  };
  glassEl.addEventListener("pointermove", e => {
    if (e.pointerType === "touch") return;
    const r = glassEl.getBoundingClientRect();
    mx = ((e.clientX - r.left) / r.width) * 100;
    my = ((e.clientY - r.top) / r.height) * 100;
    nx = (mx / 100) * 2 - 1;
    ny = (my / 100) * 2 - 1;
    if (!raf) raf = requestAnimationFrame(apply);
  });
  glassEl.addEventListener("pointerleave", () => {
    nx = 0; ny = 0; mx = 50; my = 30;
    if (!raf) raf = requestAnimationFrame(apply);
  });
}
