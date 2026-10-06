// Each drink: [name, price, description, director's note]
const GENRES = [
  { id: "horror", name: "Horror", tag: "Rated R for Roast", drinks: [
    ["The Final Girl", "$4.00", "Dark roast, brewed black. Hot enough to wake the dead.",
      "She survives every sequel. Dark roast has the same range: bitter, resilient, still standing at dawn."],
    ["Basement Cold Brew", "$5.00", "Cold brew steeped for twenty-four hours. Don't ask what else is down there.",
      "Steeped for 24 hours in the basement. We did not film the basement. The insurance forms were long enough."],
    ["The Call Is Coming From Inside", "$5.50", "Blood orange shrub, sparkling. Sweet, red, a little too sharp.",
      "A shrub is drinking vinegar. Telling the cast that was the scariest take of the entire shoot."] ] },
  { id: "scifi", name: "Sci-Fi", tag: "In space, no one can hear you sip", drinks: [
    ["Warp Drive", "$6.00", "Espresso tonic with butterfly pea. Starts blue, ends purple.",
      "The color change is chemistry, not CGI. The effects budget was one flower and a lot of optimism."],
    ["First Contact", "$6.50", "Ceremonial matcha with edible glitter.",
      "The glitter is edible. The aliens declined to comment, but they left five stars."],
    ["Replicant", "$5.25", "Oat flat white. More human than the human kind.",
      "Oat milk steams like a dream. Half the crew could not tell it from dairy, which was the whole point."] ] },
  { id: "noir", name: "Noir", tag: "Always served after dark", drinks: [
    ["Bitter End", "$5.00", "Double espresso, amaro syrup, no sugar.",
      "No sugar, by design. We shot the scene in black and white, and the drink agreed."],
    ["The Long Goodbye", "$4.50", "Cortado, served slowly.",
      "A cortado is quick. We made the barista serve it slowly. They call that method acting."],
    ["Femme Fatale", "$4.75", "Hibiscus iced tea. Red, cold, not what you expected.",
      "The glass turns red the moment you look away. Nobody saw it coming, which was the plan."] ] },
  { id: "romance", name: "Romance", tag: "Best enjoyed with someone", drinks: [
    ["Meet Cute", "$8.00", "Cappuccino, one croissant, two forks.",
      "Two forks, one croissant, zero improvisation. The extras fought over the last bite in take four."],
    ["Rainstorm Kiss", "$5.75", "Rose latte. Soft, floral, a little dramatic.",
      "We used real rose and fake rain. The rain was more expensive, and less romantic."],
    ["The Grand Gesture", "$6.25", "Honey lavender latte, with a handwritten note.",
      "The handwritten note took eleven takes and one pen. The pen has since retired."] ] },
  { id: "action", name: "Action", tag: "Fast, loud, and fully caffeinated", drinks: [
    ["Full Throttle", "$3.75", "Strong black coffee, brewed bold. No sugar, no slowing down.",
      "No sugar, no fuss, no stunt double. It's just coffee, and it showed up on time."],
    ["Mission: Espresso", "$4.25", "A triple shot of espresso. Your mission, should you choose to accept it.",
      "Triple shot, one take. The explosion cost less than the sound mixing."] ] },
  { id: "mystery", name: "Mystery", tag: "Every sip is a clue", drinks: [
    ["The Usual Suspect", "$4.25", "Earl Grey with a lemon twist. Hiding in plain sight.",
      "Earl Grey with lemon is in every scene and nobody checks it. That is the whole trick."],
    ["Red Herring", "$5.50", "Smoked tea latte with a hint of cinnamon. Not what it seems.",
      "The smoke is the red herring. You will swear it is the plot. It is the tea."],
    ["Plot Twist", "$6.00", "Iced chai with a shot of espresso. Sweet, then suddenly not.",
      "Sweet chai, then the espresso arrives. We tested it on interns. Their faces are the trailer."] ] },
  { id: "fantasy", name: "Fantasy", tag: "Brewed with a little magic", drinks: [
    ["The Chosen One", "$6.50", "Golden turmeric latte with honey. Destined for greatness.",
      "Turmeric stains everything gold. The prophecy was mostly a laundry problem."],
    ["Dragon's Breath", "$5.75", "Spiced hot chocolate with chili and cinnamon. Mind the fire.",
      "The chili is real. The dragon was a very patient intern in a costume. Please apologize to him."],
    ["Elixir of Life", "$6.25", "Sparkling elderflower lemonade with edible flowers.",
      "It does not grant immortality. The flowers were a late addition, after the legal read-through."] ] },
  { id: "comedy", name: "Comedy", tag: "Guaranteed to lighten the mood", drinks: [
    ["Slapstick", "$4.50", "Banana milk latte. Don't slip!",
      "Yes, there was a peel on set. No, we are not discussing the insurance claim."],
    ["Punchline", "$5.25", "Peanut butter mocha. Sweet setup, salty finish.",
      "Sweet setup, salty finish. The writers' room runs on this drink, and it shows."],
    ["Laugh Track", "$5.00", "Cold brew float with vanilla ice cream. Canned laughter not included.",
      "The laughter is canned. The float is not. The foam is real and it will get on your shirt."] ] }
];

const screen = document.getElementById("screen");
const pad = n => String(n).padStart(2, "0");
const MIC = '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false"><path d="M4 4h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H10l-5 4v-4H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" fill="currentColor"/></svg>';

let view = "home";
let ch = 0;
let commentary = true;

function homeHTML() {
  return `
  <section class="view home" aria-labelledby="vh">
    <div class="titleblock">
      <h1 id="vh" tabindex="-1">Scene &amp; Sip</h1>
      <p class="edition">Special Edition</p>
    </div>
    <nav class="menu" aria-label="Main menu">
      <button type="button" class="menu-btn" data-act="scenes">Scene Selection <small>jump to a genre</small></button>
      <button type="button" class="menu-btn" data-act="toggle" role="switch" aria-checked="${commentary}">
        Commentary: <b>${commentary ? "ON" : "OFF"}</b><span class="sw" aria-hidden="true"></span>
      </button>
    </nav>
    <p class="help">${commentary
      ? "Commentary is on. When you read a genre's menu, hover over or tap a drink to read the director's note."
      : "Commentary is off. Switch it on to read the director's notes on each drink."}
      <span class="keys">Click an option, or use the up and down arrow keys and Enter.</span></p>
  </section>`;
}

function scenesHTML() {
  return `
  <section class="view scenes" aria-labelledby="vh">
    <p class="crumb">Main menu &rsaquo; Scene Selection</p>
    <h2 id="vh" tabindex="-1">Scene Selection</h2>
    <p class="sub">Choose a chapter. Each chapter is one genre and its drinks.</p>
    <div class="grid">
      ${GENRES.map((g, i) => `
      <button type="button" class="scene" data-act="pick" data-ch="${i}">
        <span class="sn">Chapter ${pad(i + 1)}</span>
        <span class="sname">${g.name}</span>
        <span class="stag">${g.tag}</span>
      </button>`).join("")}
    </div>
    <div class="navrow"><button type="button" class="nav" data-act="menu">&larr; Main menu</button></div>
  </section>`;
}

function chapterHTML() {
  const g = GENRES[ch];
  const rows = g.drinks.map((d, i) => commentary ? `
      <li class="row">
        <button type="button" class="drink" aria-expanded="false" aria-controls="note${i}">
          <span class="dtop"><span class="dn">${d[0]}</span><span class="dp">${d[1]}</span></span>
          <span class="dd">${d[2]}</span>
          <span class="badge">${MIC} Commentary</span>
        </button>
        <div class="note" id="note${i}" role="note">
          <p class="nl">Director's commentary</p>
          <p class="nt">${d[3]}</p>
        </div>
      </li>` : `
      <li class="row">
        <div class="drink plain">
          <span class="dtop"><span class="dn">${d[0]}</span><span class="dp">${d[1]}</span></span>
          <span class="dd">${d[2]}</span>
        </div>
      </li>`).join("");
  return `
  <section class="view chapter" aria-labelledby="vh">
    <div class="chap-top">
      <p class="crumb">Chapter ${pad(ch + 1)} of ${pad(GENRES.length)}</p>
      <button type="button" class="tog" data-act="toggle" role="switch" aria-checked="${commentary}">
        Commentary <b>${commentary ? "ON" : "OFF"}</b><span class="sw" aria-hidden="true"></span>
      </button>
    </div>
    <h2 id="vh" tabindex="-1">${g.name}</h2>
    <p class="tag">${g.tag}</p>
    <ol class="drinks" aria-label="${g.name} drinks">${rows}</ol>
    <p class="help">${commentary
      ? "Commentary is on. Hover over, tap or press a drink to read the director's note."
      : "Commentary is off. Use the switch above to turn it on."}
      <span class="keys">Left and right arrow keys change the chapter.</span></p>
    <div class="navrow">
      <button type="button" class="nav" data-act="prev" ${ch === 0 ? "disabled" : ""}>&larr; Previous chapter</button>
      <button type="button" class="nav alt" data-act="menu">Main menu</button>
      <button type="button" class="nav alt" data-act="scenes">All chapters</button>
      <button type="button" class="nav" data-act="next" ${ch === GENRES.length - 1 ? "disabled" : ""}>Next chapter &rarr;</button>
    </div>
  </section>`;
}

function render(firstLoad) {
  screen.innerHTML = view === "home" ? homeHTML()
    : view === "scenes" ? scenesHTML()
    : chapterHTML();
  document.title = view === "chapter" ? `Scene & Sip: ${GENRES[ch].name}` : "Scene & Sip: Special Edition";
  if (view === "home") {
    const first = screen.querySelector(".menu-btn");
    if (first && !firstLoad) first.focus({ preventScroll: true });
  } else {
    const h = screen.querySelector("#vh");
    if (h) h.focus({ preventScroll: true });
  }
  if (!firstLoad) window.scrollTo(0, 0);
}

function go(v, n) {
  view = v;
  if (typeof n === "number") ch = Math.max(0, Math.min(GENRES.length - 1, n));
  render(false);
}

function toggleCommentary() {
  commentary = !commentary;
  const keep = view === "home" ? ".menu-btn[data-act='toggle']" : ".tog";
  render(true);
  const el = screen.querySelector(keep);
  if (el) el.focus({ preventScroll: true });
}

screen.addEventListener("click", e => {
  const drink = e.target.closest("button.drink");
  if (drink) {
    const row = drink.closest(".row");
    const open = row.classList.toggle("open");
    drink.setAttribute("aria-expanded", String(open));
    return;
  }
  const b = e.target.closest("[data-act]");
  if (!b) return;
  switch (b.dataset.act) {
    case "scenes": go("scenes"); break;
    case "menu": go("home"); break;
    case "toggle": toggleCommentary(); break;
    case "pick": go("chapter", Number(b.dataset.ch)); break;
    case "prev": go("chapter", ch - 1); break;
    case "next": go("chapter", ch + 1); break;
  }
});

addEventListener("keydown", e => {
  if (e.altKey || e.ctrlKey || e.metaKey) return;
  if (view === "home" && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
    const btns = [...screen.querySelectorAll(".menu-btn")];
    if (!btns.length) return;
    e.preventDefault();
    const i = btns.indexOf(document.activeElement);
    const next = e.key === "ArrowDown" ? (i + 1) % btns.length : (i - 1 + btns.length) % btns.length;
    btns[i === -1 ? 0 : next].focus();
  } else if (view === "chapter" && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
    e.preventDefault();
    const n = ch + (e.key === "ArrowRight" ? 1 : -1);
    if (n >= 0 && n < GENRES.length) go("chapter", n);
  } else if (e.key === "Escape" && view !== "home") {
    go("home");
  }
});

render(true);
const firstBtn = screen.querySelector(".menu-btn");
if (firstBtn) firstBtn.focus({ preventScroll: true });
