// ---- data ----
const ORDER = ["horror", "scifi", "noir", "romance", "action", "mystery", "fantasy", "comedy"];
const GENRES = {
  horror: { name: "Horror", tag: "Rated R for Roast", send: "The lights flicker once. Take the seat nearest the exit.", drinks: [
    ["The Final Girl", "$4.00", "Dark roast, brewed black. Hot enough to wake the dead."],
    ["Basement Cold Brew", "$5.00", "Cold brew steeped for twenty-four hours. Don't ask what else is down there."],
    ["The Call Is Coming From Inside", "$5.50", "Blood orange shrub, sparkling. Sweet, red, a little too sharp."] ] },
  scifi: { name: "Sci-Fi", tag: "In space, no one can hear you sip", send: "The engines settle into a hum. Your seat is in the front row of tomorrow.", drinks: [
    ["Warp Drive", "$6.00", "Espresso tonic with butterfly pea. Starts blue, ends purple."],
    ["First Contact", "$6.50", "Ceremonial matcha with edible glitter."],
    ["Replicant", "$5.25", "Oat flat white. More human than the human kind."] ] },
  noir: { name: "Noir", tag: "Always served after dark", send: "A match flares in the dark. Trust no one, and tip well.", drinks: [
    ["Bitter End", "$5.00", "Double espresso, amaro syrup, no sugar."],
    ["The Long Goodbye", "$4.50", "Cortado, served slowly."],
    ["Femme Fatale", "$4.75", "Hibiscus iced tea. Red, cold, not what you expected."] ] },
  romance: { name: "Romance", tag: "Best enjoyed with someone", send: "Two cups, one table by the window. Someone is already saving you a seat.", drinks: [
    ["Meet Cute", "$8.00", "Cappuccino, one croissant, two forks."],
    ["Rainstorm Kiss", "$5.75", "Rose latte. Soft, floral, a little dramatic."],
    ["The Grand Gesture", "$6.25", "Honey lavender latte, with a handwritten note."] ] },
  action: { name: "Action", tag: "Fast, loud, and fully caffeinated", send: "The getaway car is idling outside and the engine is already roaring. The coffee is hot.", drinks: [
    ["Full Throttle", "$3.75", "Strong black coffee, brewed bold. No sugar, no slowing down."],
    ["Mission: Espresso", "$4.25", "A triple shot of espresso. Your mission, should you choose to accept it."] ] },
  mystery: { name: "Mystery", tag: "Every sip is a clue", send: "Every clue points to the counter, and the suspect is waiting there, warm.", drinks: [
    ["The Usual Suspect", "$4.25", "Earl Grey with a lemon twist. Hiding in plain sight."],
    ["Red Herring", "$5.50", "Smoked tea latte with a hint of cinnamon. Not what it seems."],
    ["Plot Twist", "$6.00", "Iced chai with a shot of espresso. Sweet, then suddenly not."] ] },
  fantasy: { name: "Fantasy", tag: "Brewed with a little magic", send: "The kettle sings an old song. Your quest begins with the first sip.", drinks: [
    ["The Chosen One", "$6.50", "Golden turmeric latte with honey. Destined for greatness."],
    ["Dragon's Breath", "$5.75", "Spiced hot chocolate with chili and cinnamon. Mind the fire."],
    ["Elixir of Life", "$6.25", "Sparkling elderflower lemonade with edible flowers."] ] },
  comedy: { name: "Comedy", tag: "Guaranteed to lighten the mood", send: "The crowd is laughing already. Take a bow, then take a cup.", drinks: [
    ["Slapstick", "$4.50", "Banana milk latte. Don't slip!"],
    ["Punchline", "$5.25", "Peanut butter mocha. Sweet setup, salty finish."],
    ["Laugh Track", "$5.00", "Cold brew float with vanilla ice cream. Canned laughter not included."] ] }
};

// Each question lists its choices. "to" is another question id, or "end:<genre>".
const NODES = {
  q1: { title: "Two doors in the lobby", text: "The lobby is quiet. Two doors glow at the far end, one bright and warm, one dark and humming. Which do you open?", choices: [
    { label: "The light one", crumb: "Light door", to: "light" },
    { label: "The dark one", crumb: "Dark door", to: "dark" } ] },
  light: { title: "A sunny street", text: "Warm light spills over awnings and open windows. Somewhere a bell rings. What do you feel like?", choices: [
    { label: "Falling in love", to: "end:romance" },
    { label: "Laughing", to: "end:comedy" },
    { label: "An adventure", to: "end:fantasy" } ] },
  dark: { title: "A rainy alley", text: "Rain taps the bricks and a single lamp flickers. Something is waiting at the end of the alley. What do you want?", choices: [
    { label: "A mystery to solve", to: "trust" },
    { label: "A scare", to: "end:horror" },
    { label: "The far future", to: "end:scifi" },
    { label: "A rooftop chase", to: "end:action" } ] },
  trust: { title: "Who do you trust?", text: "A figure in a long coat waits under the lamp. Someone in this story is lying. Who do you trust?", choices: [
    { label: "Nobody", to: "end:noir" },
    { label: "Everybody, until proven guilty", crumb: "Everybody", to: "end:mystery" } ] }
};

// ---- UI ----
const screen = document.getElementById("screen");
const crumbsEl = document.getElementById("crumbs");
const dlg = document.getElementById("menu-dialog");

let stack = [{ id: "start", via: "Lobby" }];
let first = true;

const cur = () => stack[stack.length - 1];
const has = id => stack.some(s => s.id === id);
const pathName = () => (has("light") ? "light" : has("dark") ? "dark" : "start");

function drinksHTML(g) {
  return `<ul class="drinks">${g.drinks.map(d => `
    <li class="drink"><div class="line"><h3>${d[0]}</h3><span class="price">${d[1]}</span></div><p>${d[2]}</p></li>`).join("")}</ul>`;
}

function stepHTML(n, total) {
  const pips = [1, 2, 3, 4].map(i => `<i class="${i <= n ? "on" : ""}"></i>`).join("");
  return `<p class="step"><span class="pips" aria-hidden="true">${pips}</span><span>Step ${n} of ${total}</span></p>`;
}

function render() {
  const c = cur();
  const n = stack.length - 1;
  let html = "";
  let endGenre = "";

  if (c.id === "start") {
    html = `
      <p class="eyebrow">Now playing</p>
      <h1 tabindex="-1" id="heading">Tonight at Scene &amp; Sip&hellip;</h1>
      <p class="lede">Eight genres, one very good espresso machine. Answer a few questions and we will find the movie, and the drink, that fits your mood.</p>
      <div class="actions">
        <button type="button" class="btn primary big" data-act="begin">Begin your screening</button>
        <button type="button" class="btn" data-act="menu">Skip the story and see the whole menu</button>
      </div>
      <p class="howto">Either take a quick survey or browse the complete menu to find your perfect drink.</p>`;
  } else if (c.id.startsWith("end:")) {
    endGenre = c.id.slice(4);
    const g = GENRES[endGenre];
    html = `
      ${stepHTML(n, n)}
      <p class="eyebrow">The end</p>
      <h2 tabindex="-1" id="heading">Your screening: ${g.name}</h2>
      <p class="tag">${g.tag}</p>
      <p class="send">${g.send}</p>
      ${drinksHTML(g)}
      <div class="actions">
        <button type="button" class="btn primary" data-act="restart">Start over</button>
        <button type="button" class="btn" data-act="back">Back one step</button>
        <button type="button" class="btn" data-act="door">Try a different door</button>
        <button type="button" class="btn" data-act="menu">Browse the full menu</button>
      </div>`;
  } else {
    const q = NODES[c.id];
    const total = has("trust") ? 4 : has("light") ? 3 : "3 or 4";
    html = `
      ${stepHTML(n, total)}
      <h2 tabindex="-1" id="heading">${q.title}</h2>
      <p class="story">${q.text}</p>
      <div class="choices" role="group" aria-label="Your choices">
        ${q.choices.map((ch, i) => `<button type="button" class="choice" data-i="${i}"><span class="num" aria-hidden="true">${i + 1}</span><span>${ch.label}</span></button>`).join("")}
      </div>
      <div class="actions">
        <button type="button" class="btn" data-act="back">&larr; Back</button>
        <button type="button" class="btn" data-act="restart">Start over</button>
      </div>
      <p class="howto">Click a choice, or press ${q.choices.length === 2 ? "1 or 2" : `1 to ${q.choices.length}`} on your keyboard.</p>`;
  }

  screen.style.animation = "none";
  void screen.offsetWidth;
  screen.style.animation = "";
  screen.innerHTML = html;

  document.body.dataset.path = pathName();
  document.body.dataset.end = endGenre;
  crumbsEl.innerHTML = stack.length === 1
    ? `<li>Start here</li>`
    : stack.slice(1).map(s => `<li>${s.via}</li>`).join("");

  const g = endGenre ? GENRES[endGenre].name : null;
  document.title = g ? `Scene & Sip: ${g}` : "Scene & Sip: Choose Your Screening";

  if (!first) {
    const h = document.getElementById("heading");
    if (h) h.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }
  first = false;
}

function go(to, via) { stack.push({ id: to, via }); render(); }
function back() { if (stack.length > 1) { stack.pop(); render(); } }
function restart() { stack = [{ id: "start", via: "Lobby" }]; render(); }
function differentDoor() { stack = stack.slice(0, 2); render(); }

screen.addEventListener("click", e => {
  const choice = e.target.closest(".choice");
  if (choice) {
    const ch = NODES[cur().id].choices[Number(choice.dataset.i)];
    go(ch.to, ch.crumb || ch.label);
    return;
  }
  const act = e.target.closest("[data-act]");
  if (!act) return;
  const a = act.dataset.act;
  if (a === "begin") go("q1", "Lobby");
  else if (a === "back") back();
  else if (a === "restart") restart();
  else if (a === "door") differentDoor();
  else if (a === "menu") openMenu();
});

// Number keys choose, as promised on screen
addEventListener("keydown", e => {
  if (e.altKey || e.ctrlKey || e.metaKey || dlg.open) return;
  const n = Number(e.key);
  if (!n) return;
  const btn = screen.querySelectorAll(".choice")[n - 1];
  if (btn) { e.preventDefault(); btn.click(); }
});

// ---- the whole menu, in one place ----
document.getElementById("menu-body").innerHTML = ORDER.map(id => {
  const g = GENRES[id];
  return `<section aria-label="${g.name}"><h3 class="g">${g.name}</h3><p class="gtag">${g.tag}</p>${drinksHTML(g)}</section>`;
}).join("");
let opener = null;
function openMenu() { opener = document.activeElement; dlg.showModal(); document.getElementById("menu-title").focus(); }
document.getElementById("bar-menu").addEventListener("click", openMenu);
document.getElementById("menu-close").addEventListener("click", () => dlg.close());
dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });
dlg.addEventListener("close", () => { if (opener && document.contains(opener)) opener.focus(); });

render();
