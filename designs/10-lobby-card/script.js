const GENRES = [
  { id: "horror", name: "Horror", title: "HORROR!", tag: "Rated R for Roast", items: [
    ["The Final Girl", "$4.00", "Dark roast, brewed black. Hot enough to wake the dead."],
    ["Basement Cold Brew", "$5.00", "Cold brew steeped for twenty-four hours. Don't ask what else is down there."],
    ["The Call Is Coming From Inside", "$5.50", "Blood orange shrub, sparkling. Sweet, red, a little too sharp."] ] },
  { id: "scifi", name: "Sci-Fi", title: "SCI-FI!", tag: "In space, no one can hear you sip", items: [
    ["Warp Drive", "$6.00", "Espresso tonic with butterfly pea. Starts blue, ends purple."],
    ["First Contact", "$6.50", "Ceremonial matcha with edible glitter."],
    ["Replicant", "$5.25", "Oat flat white. More human than the human kind."] ] },
  { id: "noir", name: "Noir", title: "NOIR!", tag: "Always served after dark", items: [
    ["Bitter End", "$5.00", "Double espresso, amaro syrup, no sugar."],
    ["The Long Goodbye", "$4.50", "Cortado, served slowly."],
    ["Femme Fatale", "$4.75", "Hibiscus iced tea. Red, cold, not what you expected."] ] },
  { id: "romance", name: "Romance", title: "ROMANCE!", tag: "Best enjoyed with someone", items: [
    ["Meet Cute", "$8.00", "Cappuccino, one croissant, two forks."],
    ["Rainstorm Kiss", "$5.75", "Rose latte. Soft, floral, a little dramatic."],
    ["The Grand Gesture", "$6.25", "Honey lavender latte, with a handwritten note."] ] },
  { id: "western", name: "Western", title: "WESTERN!", tag: "Strong, simple, no questions asked", items: [
    ["High Noon", "$3.75", "Cowboy coffee, grounds and all."],
    ["The Good, The Bad, and The Oatmeal", "$7.00", "Skillet oatmeal with three toppings. Pick one."] ] },
  { id: "mystery", name: "Mystery", title: "MYSTERY!", tag: "Every sip is a clue", items: [
    ["The Usual Suspect", "$4.25", "Earl Grey with a lemon twist. Hiding in plain sight."],
    ["Red Herring", "$5.50", "Smoked tea latte with a hint of cinnamon. Not what it seems."],
    ["Plot Twist", "$6.00", "Iced chai with a shot of espresso. Sweet, then suddenly not."] ] },
  { id: "fantasy", name: "Fantasy", title: "FANTASY!", tag: "Brewed with a little magic", items: [
    ["The Chosen One", "$6.50", "Golden turmeric latte with honey. Destined for greatness."],
    ["Dragon's Breath", "$5.75", "Spiced hot chocolate with chili and cinnamon. Mind the fire."],
    ["Elixir of Life", "$6.25", "Sparkling elderflower lemonade with edible flowers."] ] },
  { id: "comedy", name: "Comedy", title: "COMEDY!", tag: "Guaranteed to lighten the mood", items: [
    ["Slapstick", "$4.50", "Banana milk latte. Don't slip!"],
    ["Punchline", "$5.25", "Peanut butter mocha. Sweet setup, salty finish."],
    ["Laugh Track", "$5.00", "Cold brew float with vanilla ice cream. Canned laughter not included."] ] }
];

const wall = document.getElementById("wall");
const viewer = document.getElementById("viewer");
const vTitle = document.getElementById("v-title");
const vTag = document.getElementById("v-tag");
const vList = document.getElementById("v-list");
const vCount = document.getElementById("v-count");
const vPrev = document.getElementById("v-prev");
const vNext = document.getElementById("v-next");
let current = 0;
let opener = null;

wall.innerHTML = GENRES.map((g, i) => `
  <li class="slot ${g.id}">
    <button class="card" type="button" data-i="${i}" aria-haspopup="dialog" aria-label="${g.name}: ${g.tag}. Open the menu.">
      <span class="pin" aria-hidden="true"></span>
      <span class="frame" aria-hidden="true">
        <span class="scene"></span><span class="dots"></span>
        <span class="burst">NOW<br>SERVING!</span>
        <span class="title">${g.title}</span>
        <span class="caption">${g.tag}</span>
      </span>
    </button>
  </li>`).join("");

function fill(i) {
  current = (i + GENRES.length) % GENRES.length;
  const g = GENRES[current];
  viewer.className = `viewer ${g.id}`;
  vTitle.textContent = g.title;
  vTag.textContent = g.tag;
  vList.innerHTML = g.items.map(it => `<li><span class="v-name">${it[0]}</span><span class="v-price">${it[1]}</span><p>${it[2]}</p></li>`).join("");
  vCount.textContent = `Card ${current + 1} of ${GENRES.length}`;
  vPrev.textContent = `‹ ${GENRES[(current + GENRES.length - 1) % GENRES.length].name}`;
  vNext.textContent = `${GENRES[(current + 1) % GENRES.length].name} ›`;
  viewer.querySelector(".v-inner").scrollTop = 0;
}

wall.addEventListener("click", e => {
  const card = e.target.closest(".card");
  if (!card) return;
  opener = card;
  fill(Number(card.dataset.i));
  viewer.showModal();
});
vPrev.addEventListener("click", () => fill(current - 1));
vNext.addEventListener("click", () => fill(current + 1));
document.getElementById("v-close").addEventListener("click", () => viewer.close());
viewer.addEventListener("click", e => { if (e.target === viewer) viewer.close(); });
viewer.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") { e.preventDefault(); fill(current - 1); }
  if (e.key === "ArrowRight") { e.preventDefault(); fill(current + 1); }
});
viewer.addEventListener("close", () => { if (opener) opener.focus(); });
