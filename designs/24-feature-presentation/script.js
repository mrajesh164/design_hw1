(() => {
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
  { id: "western", name: "Western", tag: "Strong, simple, no questions asked", drinks: [
    ["True Grit", "$3.75", "Strong black coffee, brewed bold. No sugar, no fuss.",
      "No sugar, no fuss, no stunt double. It's just coffee, and it showed up on time."],
    ["A Fistful of Espresso", "$4.25", "A triple shot of espresso. Quick on the draw.",
      "Triple shot, one take. The saloon doors cost less than the sound mixing."] ] },
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

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const stage = document.getElementById("stage");
const tabs = [...document.querySelectorAll(".tab")];
const comm = document.getElementById("comm");
const tcEl = document.getElementById("tc");
const bg = document.querySelector(".bg");
const perfs = document.querySelectorAll(".perfs");
const pad = n => String(n).padStart(2, "0");
const WORDS = ["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight"];
const HUE = { horror: [0, 45], scifi: [200, 40], noir: [215, 8], romance: [338, 45], western: [32, 55], mystery: [270, 35], fantasy: [150, 40], comedy: [45, 70] };
const NOTE = '<svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true" focusable="false"><path d="M4 4h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H10l-5 4v-4H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" fill="currentColor"/></svg>';
const INTRO = "Pick a movie genre, find your favorite drink. Our coffees, teas and seasonal specials are sorted into eight genres, from horror to romance to comedy, so ordering feels like choosing tonight&rsquo;s movie.";

let view = "home";
let ch = 0;
let commentary = true;
let credits = null;

/* ---------- views ---------- */
function homeHTML() {
  return `
  <section class="card home" aria-labelledby="vh">
    <div class="disc-head"><span>Disc 1</span><span>Special Edition</span></div>
    <p class="kicker">Your friendly neighborhood caf&eacute;</p>
    <h1 id="vh" tabindex="-1">Scene &amp; Sip</h1>
    <p class="tagline">Coffee, tea, and a good story in every cup.</p>
    <p class="orn" aria-hidden="true"><span>&#9670;</span></p>
    <p class="intro">${INTRO}</p>
    <nav class="dvd" aria-label="Main menu">
      <button type="button" class="dvd-btn" data-go="menu" data-ch="0">Menu <small>start the show</small></button>
      <button type="button" class="dvd-btn" data-go="scenes">Scene Selection <small>jump to a genre</small></button>
      <button type="button" class="dvd-btn" data-go="about">About us <small>our story</small></button>
      <button type="button" class="dvd-btn" data-go="visit">Visit us <small>address and hours</small></button>
      <button type="button" class="dvd-btn dvd-switch" data-act="comm" role="switch" aria-checked="${commentary}">
        <span>Commentary: <b>${commentary ? "ON" : "OFF"}</b></span><span class="sw" aria-hidden="true"></span>
      </button>
    </nav>
    <p class="help">${commentary
      ? "Commentary is on. In the menu, tap or hover a drink to read the director&rsquo;s note."
      : "Commentary is off. Switch it on to read the director&rsquo;s notes on each drink."}
      <span class="keys">Click an option, or use the up and down arrow keys and Enter.</span></p>
    <p class="visit-line">1138 Marquee Lane, Chicago, IL 60615 &middot; Open daily, 7 a.m. to 10 p.m.</p>
  </section>`;
}

function aboutHTML() {
  return `
  <section class="card about" aria-labelledby="vh">
    <p class="eyebrow">About us</p>
    <h2 id="vh" tabindex="-1">The story so far</h2>
    <p class="orn" aria-hidden="true"><span>&#9670;</span></p>
    <p class="body">Scene &amp; Sip is a small neighborhood caf&eacute; in Hyde Park built around a simple idea: a menu you can browse like a movie night. Our baristas pull espresso, steep tea and shake up seasonal specials from early morning until late evening, and every drink lives in one of eight film genres.</p>
    <p class="body">Pull up a stool, pick a genre and find a drink to match your mood. Come for the coffee, stay for the plot.</p>
    <div class="actions">
      <button type="button" class="btn alt" data-go="home">&larr; Main menu</button>
      <button type="button" class="btn" data-go="menu" data-ch="0">See the menu &rarr;</button>
      <button type="button" class="btn alt" data-go="visit">Visit us</button>
    </div>
  </section>`;
}

function scenesHTML() {
  return `
  <section class="card scenes-card" aria-labelledby="vh">
    <p class="eyebrow">Scene Selection</p>
    <h2 id="vh" tabindex="-1">Choose a chapter</h2>
    <p class="tagline">Each chapter is one genre and its drinks.</p>
    <div class="scene-grid">
      ${GENRES.map((g, i) => `
      <button type="button" class="scene ${g.id}" data-go="menu" data-ch="${i}">
        <span class="sn">Chapter ${pad(i + 1)}</span>
        <span class="sname">${g.name}</span>
        <span class="stag">${g.tag}</span>
      </button>`).join("")}
    </div>
    <div class="actions"><button type="button" class="btn alt" data-go="home">&larr; Main menu</button></div>
  </section>`;
}

function chapterHTML() {
  const g = GENRES[ch];
  const rows = g.drinks.map((d, i) => commentary ? `
      <li class="row">
        <button type="button" class="drink" aria-expanded="false" aria-controls="note${i}" data-act="drink">
          <span class="dtop"><span class="dn">${d[0]}</span><span class="dots" aria-hidden="true"></span><span class="dp">${d[1]}</span></span>
          <span class="dd">${d[2]}</span>
          <span class="badge">${NOTE} Director&rsquo;s note</span>
        </button>
        <div class="note" id="note${i}" role="note">
          <p class="nl">Director&rsquo;s commentary</p>
          <p class="nt">${d[3]}</p>
        </div>
      </li>` : `
      <li class="row">
        <div class="drink">
          <span class="dtop"><span class="dn">${d[0]}</span><span class="dots" aria-hidden="true"></span><span class="dp">${d[1]}</span></span>
          <span class="dd">${d[2]}</span>
        </div>
      </li>`).join("");
  return `
  <section class="card chapter ${g.id}" aria-labelledby="vh">
    <p class="eyebrow">Chapter ${WORDS[ch]} of Eight</p>
    <h2 id="vh" tabindex="-1">${g.name}</h2>
    <p class="tagline">${g.tag}</p>
    <p class="orn" aria-hidden="true"><span>&#9670;</span></p>
    <ol class="drinks" aria-label="${g.name} drinks">${rows}</ol>
    <p class="help">${commentary
      ? "Tap or hover a drink for the director&rsquo;s note. Left and right arrow keys change the chapter."
      : "Commentary is off. Use the switch at the top to turn it on. Left and right arrow keys change the chapter."}</p>
  </section>
  <nav class="reels" aria-label="Chapters">
    <button type="button" class="r-nav" data-act="prev" ${ch === 0 ? "disabled" : ""}>&#9664; Back</button>
    <div class="r-list">${GENRES.map((x, i) => `<button type="button" class="r-chip" data-act="pick" data-ch="${i}"${i === ch ? ' aria-current="true"' : ""}>${x.name}</button>`).join("")}</div>
    <button type="button" class="r-nav" data-act="next" ${ch === GENRES.length - 1 ? "disabled" : ""}>Next &#9654;</button>
  </nav>`;
}

function visitHTML() {
  return `
  <section class="credits-view" aria-labelledby="vh">
    <h1 class="sr-only" id="vh" tabindex="-1">Visit us</h1>
    <div class="roll" id="roll" tabindex="0" aria-label="Visit us: the end credits. Scroll to move, or use the buttons below.">
      <div class="credits">
        <section class="cc opening">
          <p class="small">Now showing at</p>
          <p class="big">Visit us</p>
          <p class="small">The end credits, with everything you need to find us</p>
        </section>
        <section class="cc">
          <h3>Filmed on location at</h3>
          <p class="solo">1138 Marquee Lane<br>Chicago, IL 60615</p>
        </section>
        <section class="cc">
          <h3>Showtimes</h3>
          <p class="solo">Open daily<br>7 a.m. to 10 p.m.</p>
        </section>
        <section class="cc">
          <h3>Call ahead</h3>
          <p class="solo">(555) 019-0420</p>
          <p class="small">We will have it ready</p>
        </section>
        <section class="cc">
          <h3>Cast and crew</h3>
          <div class="row"><span class="role">Head Barista</span><span class="name">Rosalind Vance</span></div>
          <div class="row"><span class="role">Pastry by</span><span class="name">The Early Shift</span></div>
          <div class="row"><span class="role">Oat Milk Coordinator</span><span class="name">Dev Okafor</span></div>
          <div class="row"><span class="role">Director of Commentary</span><span class="name">The Director</span></div>
          <div class="row"><span class="role">Stunt Banana</span><span class="name">As itself</span></div>
        </section>
        <section class="cc closing">
          <p class="solo">No oat milk was harmed in the making of this menu</p>
          <p class="small">And so, as the lights grow dim, the doors stay open until ten.</p>
          <p class="logo">SCENE &amp; SIP</p>
        </section>
      </div>
    </div>
    <div class="cred-controls" role="group" aria-label="Credits controls">
      <span class="lbl">Credits</span>
      <button type="button" class="cbtn main" id="c-play">Pause</button>
      <button type="button" class="cbtn" id="c-slower">Slower</button>
      <button type="button" class="cbtn" id="c-faster">Faster</button>
      <button type="button" class="cbtn" id="c-restart">Restart</button>
    </div>
  </section>`;
}

/* ---------- the credits roll: auto-scroll, hover to pause, manual scroll takes over ---------- */
function startCredits() {
  const roll = document.getElementById("roll");
  const playBtn = document.getElementById("c-play");
  let speed = 55;
  let playing = !reduce;
  let hovering = false;
  let idleUntil = 0;
  let endedAt = 0;
  let pos = 0;
  let last = performance.now();
  let raf = 0;

  const paint = () => {
    playBtn.textContent = playing ? "Pause" : "Play";
    playBtn.setAttribute("aria-pressed", String(!playing));
  };
  const timecode = () => {
    const y = roll.scrollTop;
    perfs.forEach(p => p.style.setProperty("--y", y));
    const max = roll.scrollHeight - roll.clientHeight || 1;
    const t = Math.floor((y / max) * 5400);
    tcEl.textContent = `${pad(Math.floor(t / 3600))}:${pad(Math.floor(t / 60) % 60)}:${pad(t % 60)}:${pad(Math.floor(y % 24))}`;
  };
  const frame = now => {
    const dt = Math.min((now - last) / 1000, 0.1);
    last = now;
    if (now < idleUntil) {
      pos = roll.scrollTop;
    } else if (playing && !hovering) {
      const max = roll.scrollHeight - roll.clientHeight;
      if (pos >= max - 1) {
        if (!endedAt) endedAt = now;
        if (now - endedAt > 5000) { pos = 0; roll.scrollTop = 0; endedAt = 0; }
      } else {
        pos = Math.min(max, pos + speed * dt);
        roll.scrollTop = pos;
      }
    }
    raf = requestAnimationFrame(frame);
  };
  const toggle = () => { playing = !playing; paint(); };

  roll.addEventListener("pointerover", e => { hovering = !!e.target.closest(".cc"); });
  roll.addEventListener("pointerleave", () => { hovering = false; });
  ["wheel", "touchstart", "touchmove", "keydown"].forEach(t =>
    roll.addEventListener(t, () => { idleUntil = performance.now() + 2500; endedAt = 0; }, { passive: true }));
  roll.addEventListener("scroll", timecode, { passive: true });
  playBtn.addEventListener("click", toggle);
  document.getElementById("c-slower").addEventListener("click", () => { speed = Math.max(15, speed - 15); });
  document.getElementById("c-faster").addEventListener("click", () => { speed = Math.min(220, speed + 20); });
  document.getElementById("c-restart").addEventListener("click", () => { pos = 0; roll.scrollTop = 0; endedAt = 0; });

  paint();
  timecode();
  raf = requestAnimationFrame(frame);
  return { toggle, stop() { cancelAnimationFrame(raf); perfs.forEach(p => p.style.setProperty("--y", 0)); } };
}

/* ---------- rendering and navigation ---------- */
const tabFor = v => (v === "scenes" ? "menu" : v);

function render(focusHeading) {
  if (credits) { credits.stop(); credits = null; }
  document.body.dataset.view = view;
  stage.innerHTML = view === "home" ? homeHTML()
    : view === "about" ? aboutHTML()
    : view === "scenes" ? scenesHTML()
    : view === "visit" ? visitHTML()
    : chapterHTML();
  tabs.forEach(t => {
    if (t.dataset.go === tabFor(view)) t.setAttribute("aria-current", "page"); else t.removeAttribute("aria-current");
  });
  comm.setAttribute("aria-checked", String(commentary));
  comm.querySelector("b").textContent = commentary ? "ON" : "OFF";
  const hue = view === "menu" ? HUE[GENRES[ch].id] : [345, 45];
  bg.style.setProperty("--h", hue[0]);
  bg.style.setProperty("--s", hue[1]);
  tcEl.hidden = view !== "visit";
  if (view === "visit") credits = startCredits();
  document.title = view === "menu" ? `Scene & Sip: ${GENRES[ch].name}`
    : view === "home" ? "Scene & Sip: The Feature Presentation"
    : `Scene & Sip: ${{ about: "About us", visit: "Visit us", scenes: "Scene Selection" }[view]}`;
  if (focusHeading) {
    const el = view === "home" ? stage.querySelector(".dvd-btn") : stage.querySelector("#vh");
    if (el) el.focus({ preventScroll: true });
  }
  if (focusHeading) window.scrollTo(0, 0);
}

function go(v, n) {
  view = v;
  if (typeof n === "number" && !Number.isNaN(n)) ch = Math.max(0, Math.min(GENRES.length - 1, n));
  render(true);
}

function toggleCommentary() {
  commentary = !commentary;
  const fromHome = view === "home";
  render(false);
  const target = fromHome ? stage.querySelector('[data-act="comm"]') : comm;
  if (target) target.focus({ preventScroll: true });
}

document.addEventListener("click", e => {
  const goBtn = e.target.closest("[data-go]");
  if (goBtn) {
    const v = goBtn.dataset.go;
    go(v, goBtn.dataset.ch === undefined ? undefined : Number(goBtn.dataset.ch));
    return;
  }
  if (e.target.closest("#comm") || e.target.closest('[data-act="comm"]')) { toggleCommentary(); return; }
  const drink = e.target.closest('[data-act="drink"]');
  if (drink) {
    const row = drink.closest(".row");
    const open = row.classList.toggle("open");
    drink.setAttribute("aria-expanded", String(open));
    return;
  }
  const act = e.target.closest("[data-act]");
  if (!act) return;
  if (act.dataset.act === "prev") go("menu", ch - 1);
  else if (act.dataset.act === "next") go("menu", ch + 1);
  else if (act.dataset.act === "pick") go("menu", Number(act.dataset.ch));
});

document.addEventListener("keydown", e => {
  if (e.altKey || e.ctrlKey || e.metaKey) return;
  if (view === "menu" && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
    e.preventDefault();
    const n = ch + (e.key === "ArrowRight" ? 1 : -1);
    if (n >= 0 && n < GENRES.length) go("menu", n);
  } else if (view === "home" && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
    const btns = [...stage.querySelectorAll(".dvd-btn")];
    if (!btns.length) return;
    e.preventDefault();
    const i = btns.indexOf(document.activeElement);
    btns[i === -1 ? 0 : (i + (e.key === "ArrowDown" ? 1 : btns.length - 1)) % btns.length].focus();
  } else if (e.key === "Escape" && view !== "home") {
    go("home");
  } else if (view === "visit" && e.code === "Space" && e.target === document.body && credits) {
    e.preventDefault();
    credits.toggle();
  }
});

// swipe between chapters on touch screens
let touchX = null;
stage.addEventListener("touchstart", e => { touchX = e.touches[0].clientX; }, { passive: true });
stage.addEventListener("touchend", e => {
  if (touchX === null || view !== "menu") { touchX = null; return; }
  const dx = e.changedTouches[0].clientX - touchX;
  touchX = null;
  if (Math.abs(dx) > 70) {
    const n = ch + (dx < 0 ? 1 : -1);
    if (n >= 0 && n < GENRES.length) go("menu", n);
  }
}, { passive: true });

render(false);
const first = stage.querySelector(".dvd-btn");
if (first) first.focus({ preventScroll: true });

})();
