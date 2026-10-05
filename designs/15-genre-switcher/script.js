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
    about: "Pull up a stool, partner. The coffee's hot and the talk is short.",
    drinks: [
      ["True Grit", "$3.75", "Strong black coffee, brewed bold. No sugar, no fuss."],
      ["A Fistful of Espresso", "$4.25", "A triple shot of espresso. Quick on the draw."] ] },
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

// Small previews so the home page can show what each skin looks like
const PREVIEW = {
  horror:  { bg: "#0b0708", fg: "#eadbd3", acc: "#e05a52", font: '"Bodoni 72", "Didot", "Playfair Display", Georgia, serif' },
  scifi:   { bg: "#04090b", fg: "#d3e4e2", acc: "#6cc4ba", font: '"SF Mono", Menlo, Consolas, "Courier New", monospace' },
  noir:    { bg: "#0d0d0d", fg: "#e0e0e0", acc: "#f2f2f2", font: '"American Typewriter", "Courier New", Courier, monospace' },
  romance: { bg: "#fbece7", fg: "#4a2a33", acc: "#b3425f", font: '"Palatino", "Palatino Linotype", "Book Antiqua", Georgia, serif' },
  western: { bg: "#e8d3a2", fg: "#33200e", acc: "#9b3a1c", font: '"Rockwell", "Clarendon", "Roboto Slab", "Courier New", Georgia, serif' },
  mystery: { bg: "#1c1327", fg: "#e9dff3", acc: "#d98aa0", font: '"Courier New", Courier, monospace' },
  fantasy: { bg: "#12261a", fg: "#efe3c0", acc: "#d9b45a", font: '"Palatino", "Book Antiqua", "Palatino Linotype", Georgia, serif' },
  comedy:  { bg: "#f7efdc", fg: "#2a1a14", acc: "#c0392b", font: '"Arial Rounded MT Bold", "Trebuchet MS", Verdana, sans-serif' }
};

// buttons[0] is Home; buttons[k] is genre k - 1
const labels = ["Home", ...GENRES.map(g => g.name)];
const buttons = labels.map((name, k) => {
  const b = document.createElement("button");
  b.type = "button";
  b.textContent = name;
  b.setAttribute("aria-pressed", "false");
  b.addEventListener("click", () => choose(k - 1));
  btnWrap.appendChild(b);
  return b;
});

let current = null; // null before the first render, -1 for Home, otherwise a genre index

function renderHome() {
  const money = n => "$" + Number(n).toFixed(2);
  stage.innerHTML = `
    <section class="skin home" aria-labelledby="gname">
      <header class="hero">
        <p class="kicker">A café whose menu is organized by film genre</p>
        <h1 id="gname">Scene &amp; Sip</h1>
        <p class="tagline">One café. Eight genres. Eight completely different looks.</p>
      </header>
      <ol class="how" aria-label="How it works">
        <li><b>1</b> Pick a genre below</li>
        <li><b>2</b> Watch the whole café change</li>
        <li><b>3</b> Read that genre's menu</li>
      </ol>
      <ul class="tiles" aria-label="Genres">
        ${GENRES.map((g, i) => {
          const p = PREVIEW[g.id];
          const low = Math.min(...g.drinks.map(d => parseFloat(d[1].slice(1))));
          return `<li><button type="button" class="tile" data-i="${i}" style="--tbg:${p.bg};--tfg:${p.fg};--tacc:${p.acc};--tfont:${p.font}">
            <span class="tnum">${String(i + 1).padStart(2, "0")}</span>
            <span class="tname">${g.name}</span>
            <span class="ttag">${g.tag}</span>
            <span class="tmeta">${g.drinks.length} drinks, from ${money(low)}</span>
          </button></li>`;
        }).join("")}
      </ul>
    </section>`;
  stage.querySelectorAll(".tile").forEach(t => t.addEventListener("click", () => choose(Number(t.dataset.i))));
}

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
  if (i < -1) i = GENRES.length - 1;
  if (i >= GENRES.length) i = -1;
  if (i === current) return;
  const first = current === null;
  current = i;
  buttons.forEach((b, k) => b.setAttribute("aria-pressed", String(k === i + 1)));
  if (i === -1) {
    document.body.dataset.genre = "home";
    renderHome();
    statusEl.textContent = "Home";
    document.title = "Scene & Sip: One Café, Eight Genres";
  } else {
    const g = GENRES[i];
    document.body.dataset.genre = g.id;
    render(g);
    statusEl.textContent = `Showing the ${g.name} menu`;
    document.title = `Scene & Sip: ${g.name}`;
  }
  if (!first) window.scrollTo(0, 0);
}

// Left and right arrows walk Home, then each genre, then back around
addEventListener("keydown", e => {
  if (e.altKey || e.ctrlKey || e.metaKey) return;
  if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
  e.preventDefault();
  choose(current + (e.key === "ArrowRight" ? 1 : -1));
  if (btnWrap.contains(document.activeElement)) buttons[current + 1].focus();
});

choose(-1);
