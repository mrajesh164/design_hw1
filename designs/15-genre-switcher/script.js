const GENRES = [
  { id: "horror", name: "Horror", tag: "Rated R for Roast",
    kicker: "Scene &amp; Sip presents a film you should not watch alone",
    about: "We open early so you can leave before dark. Probably.",
    drinks: [
      ["The Final Girl", "$4.00", "Dark roast, brewed black. Hot enough to wake the dead."],
      ["Basement Cold Brew", "$5.00", "Cold brew steeped for twenty-four hours. Don't ask what else is down there."],
      ["The Call Is Coming From Inside", "$5.50", "Blood orange shrub, sparkling. Sweet, red, a little too sharp."] ] },
  { id: "scifi", name: "Sci-Fi", tag: "In space, no one can hear you sip",
    kicker: "Incoming transmission from Scene &amp; Sip",
    about: "Signal received. Coffee detected on the planet Earth, Hyde Park sector. Proceed to the counter.",
    drinks: [
      ["Warp Drive", "$6.00", "Espresso tonic with butterfly pea. Starts blue, ends purple."],
      ["First Contact", "$6.50", "Ceremonial matcha with edible glitter."],
      ["Replicant", "$5.25", "Oat flat white. More human than the human kind."] ] },
  { id: "noir", name: "Noir", tag: "Always served after dark",
    kicker: "a Scene &amp; Sip picture",
    about: "It was a Tuesday, and the rain hadn't stopped. Neither had the espresso machine.",
    drinks: [
      ["Bitter End", "$5.00", "Double espresso, amaro syrup, no sugar."],
      ["The Long Goodbye", "$4.50", "Cortado, served slowly."],
      ["Femme Fatale", "$4.75", "Hibiscus iced tea. Red, cold, not what you expected."] ] },
  { id: "romance", name: "Romance", tag: "Best enjoyed with someone",
    kicker: "Scene &amp; Sip, with love",
    about: "A small table by the window, two cups, and nowhere else you would rather be.",
    drinks: [
      ["Meet Cute", "$8.00", "Cappuccino, one croissant, two forks."],
      ["Rainstorm Kiss", "$5.75", "Rose latte. Soft, floral, a little dramatic."],
      ["The Grand Gesture", "$6.25", "Honey lavender latte, with a handwritten note."] ] },
  { id: "western", name: "Western", tag: "Strong, simple, no questions asked",
    kicker: "Wanted: good coffee",
    about: "Pull up a stool, partner. The coffee's hot and the oatmeal's honest.",
    drinks: [
      ["High Noon", "$3.75", "Cowboy coffee, grounds and all."],
      ["The Good, The Bad, and The Oatmeal", "$7.00", "Skillet oatmeal with three toppings. Pick one."] ] },
  { id: "mystery", name: "Mystery", tag: "Every sip is a clue",
    kicker: "Case file no. 1138",
    about: "Subject: a café with eight secrets. Witnesses report the tea was suspiciously good.",
    drinks: [
      ["The Usual Suspect", "$4.25", "Earl Grey with a lemon twist. Hiding in plain sight."],
      ["Red Herring", "$5.50", "Smoked tea latte with a hint of cinnamon. Not what it seems."],
      ["Plot Twist", "$6.00", "Iced chai with a shot of espresso. Sweet, then suddenly not."] ] },
  { id: "fantasy", name: "Fantasy", tag: "Brewed with a little magic",
    kicker: "Here begins the tale of Scene &amp; Sip",
    about: "In a realm between sleep and morning, a kettle sings, and the brew is never ordinary.",
    drinks: [
      ["The Chosen One", "$6.50", "Golden turmeric latte with honey. Destined for greatness."],
      ["Dragon's Breath", "$5.75", "Spiced hot chocolate with chili and cinnamon. Mind the fire."],
      ["Elixir of Life", "$6.25", "Sparkling elderflower lemonade with edible flowers."] ] },
  { id: "comedy", name: "Comedy", tag: "Guaranteed to lighten the mood",
    kicker: "Now playing: Scene &amp; Sip!",
    about: "Walk in, order a drink, and nobody gets hurt. Probably. Watch the floor.",
    drinks: [
      ["Slapstick", "$4.50", "Banana milk latte. Don't slip!"],
      ["Punchline", "$5.25", "Peanut butter mocha. Sweet setup, salty finish."],
      ["Laugh Track", "$5.00", "Cold brew float with vanilla ice cream. Canned laughter not included."] ] }
];

const stage = document.getElementById("stage");
const btnWrap = document.getElementById("switch-btns");
const statusEl = document.getElementById("status");

const buttons = GENRES.map((g, i) => {
  const b = document.createElement("button");
  b.type = "button";
  b.textContent = g.name;
  b.setAttribute("aria-pressed", "false");
  b.addEventListener("click", () => choose(i));
  btnWrap.appendChild(b);
  return b;
});

let current = -1;

function render(g) {
  stage.innerHTML = `
    <section class="skin" aria-labelledby="gname">
      <span class="deco d1" aria-hidden="true"></span><span class="deco d2" aria-hidden="true"></span>
      <span class="deco d3" aria-hidden="true"></span><span class="deco d4" aria-hidden="true"></span>
      <header class="hero">
        <p class="kicker">${g.kicker}</p>
        <h1 id="gname">Scene &amp; Sip</h1>
        <p class="tagline">${g.tag}</p>
      </header>
      <p class="about">${g.about}</p>
      <ol class="drinks" aria-label="${g.name} drinks">
        ${g.drinks.map(d => `
        <li class="drink">
          <div class="dline"><h2 class="dname">${d[0]}</h2><span class="dleader" aria-hidden="true"></span><span class="dprice">${d[1]}</span></div>
          <p class="ddesc">${d[2]}</p>
        </li>`).join("")}
      </ol>
    </section>`;
}

function choose(i) {
  i = (i + GENRES.length) % GENRES.length;
  if (i === current) return;
  current = i;
  const g = GENRES[i];
  document.body.dataset.genre = g.id;
  buttons.forEach((b, k) => b.setAttribute("aria-pressed", String(k === i)));
  render(g);
  statusEl.textContent = `Showing the ${g.name} menu`;
  document.title = `Scene & Sip: ${g.name}`;
}

// Left and right arrows cycle through the genres
addEventListener("keydown", e => {
  if (e.altKey || e.ctrlKey || e.metaKey) return;
  if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
  e.preventDefault();
  choose(current + (e.key === "ArrowRight" ? 1 : -1));
  if (btnWrap.contains(document.activeElement)) buttons[current].focus();
});

choose(GENRES.findIndex(g => g.id === "noir"));
