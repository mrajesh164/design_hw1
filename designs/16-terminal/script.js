const MENU = [
  { id: "horror", name: "Horror", tag: "Rated R for Roast", drinks: [
    ["The Final Girl", 4.00, "Dark roast, brewed black. Hot enough to wake the dead."],
    ["Basement Cold Brew", 5.00, "Cold brew steeped for twenty-four hours. Don't ask what else is down there."],
    ["The Call Is Coming From Inside", 5.50, "Blood orange shrub, sparkling. Sweet, red, a little too sharp."] ] },
  { id: "scifi", name: "Sci-Fi", tag: "In space, no one can hear you sip", drinks: [
    ["Warp Drive", 6.00, "Espresso tonic with butterfly pea. Starts blue, ends purple."],
    ["First Contact", 6.50, "Ceremonial matcha with edible glitter."],
    ["Replicant", 5.25, "Oat flat white. More human than the human kind."] ] },
  { id: "noir", name: "Noir", tag: "Always served after dark", drinks: [
    ["Bitter End", 5.00, "Double espresso, amaro syrup, no sugar."],
    ["The Long Goodbye", 4.50, "Cortado, served slowly."],
    ["Femme Fatale", 4.75, "Hibiscus iced tea. Red, cold, not what you expected."] ] },
  { id: "romance", name: "Romance", tag: "Best enjoyed with someone", drinks: [
    ["Meet Cute", 8.00, "Cappuccino, one croissant, two forks."],
    ["Rainstorm Kiss", 5.75, "Rose latte. Soft, floral, a little dramatic."],
    ["The Grand Gesture", 6.25, "Honey lavender latte, with a handwritten note."] ] },
  { id: "western", name: "Western", tag: "Strong, simple, no questions asked", drinks: [
    ["True Grit", 3.75, "Strong black coffee, brewed bold. No sugar, no fuss."],
    ["A Fistful of Espresso", 4.25, "A triple shot of espresso. Quick on the draw."] ] },
  { id: "mystery", name: "Mystery", tag: "Every sip is a clue", drinks: [
    ["The Usual Suspect", 4.25, "Earl Grey with a lemon twist. Hiding in plain sight."],
    ["Red Herring", 5.50, "Smoked tea latte with a hint of cinnamon. Not what it seems."],
    ["Plot Twist", 6.00, "Iced chai with a shot of espresso. Sweet, then suddenly not."] ] },
  { id: "fantasy", name: "Fantasy", tag: "Brewed with a little magic", drinks: [
    ["The Chosen One", 6.50, "Golden turmeric latte with honey. Destined for greatness."],
    ["Dragon's Breath", 5.75, "Spiced hot chocolate with chili and cinnamon. Mind the fire."],
    ["Elixir of Life", 6.25, "Sparkling elderflower lemonade with edible flowers."] ] },
  { id: "comedy", name: "Comedy", tag: "Guaranteed to lighten the mood", drinks: [
    ["Slapstick", 4.50, "Banana milk latte. Don't slip!"],
    ["Punchline", 5.25, "Peanut butter mocha. Sweet setup, salty finish."],
    ["Laugh Track", 5.00, "Cold brew float with vanilla ice cream. Canned laughter not included."] ] }
];

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const fineSurface = matchMedia("(pointer: fine)").matches;

const money = n => "$" + n.toFixed(2);
const norm = s => s.toLowerCase().replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();
const noThe = s => s.replace(/^the /, "");

const ALL = MENU.flatMap(g => g.drinks.map(d => ({ name: d[0], price: d[1], desc: d[2], genre: g, key: norm(d[0]) })));
const GENRE_NAMES = { horror: ["horror"], scifi: ["sci-fi", "scifi", "sci fi", "science fiction"], noir: ["noir"], romance: ["romance"], western: ["western"], mystery: ["mystery"], fantasy: ["fantasy"], comedy: ["comedy"] };

// every word that can start a command, with the canonical name it maps to
const COMMANDS = {
  help: ["help", "?", "h", "commands"],
  menu: ["menu", "ls", "genres", "list"],
  cat: ["cat", "show", "open", "view"],
  order: ["order", "add", "buy"],
  ticket: ["ticket", "cart", "bill", "receipt", "checkout"],
  remove: ["remove", "rm", "del", "delete"],
  hours: ["hours", "visit", "address", "info", "where"],
  surprise: ["surprise", "random"],
  clear: ["clear", "cls"]
};
const WORD_TO_CMD = {};
Object.entries(COMMANDS).forEach(([c, ws]) => ws.forEach(w => { WORD_TO_CMD[w] = c; }));

const log = document.getElementById("log");
const form = document.getElementById("entry");
const input = document.getElementById("cmd");
const chipsCmd = document.getElementById("chips-cmd");
const chipsGenre = document.getElementById("chips-genre");

// ---------- tiny DOM helpers ----------
function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined) n.textContent = text;
  return n;
}
function print(...nodes) {
  nodes.forEach(n => log.appendChild(n));
  log.scrollTop = log.scrollHeight;
}
function say(text, cls) { print(el("p", "line " + (cls || ""), text)); }
function button(label, cls, onClick) {
  const b = el("button", cls, label);
  b.type = "button";
  b.addEventListener("click", onClick);
  return b;
}
function echo(text) {
  const d = el("p", "line echo");
  d.append(el("span", "p", "$"), document.createTextNode(text));
  print(d);
}

// ---------- ticket (lives in memory only) ----------
const ticket = new Map(); // drink name -> quantity
function ticketCount() { let n = 0; ticket.forEach(q => { n += q; }); return n; }
function ticketTotal() { let t = 0; ticket.forEach((q, name) => { t += q * ALL.find(d => d.name === name).price; }); return t; }
let ticketChipCount = null;
function updateTicketChip() { if (ticketChipCount) ticketChipCount.textContent = ticketCount() ? ` (${ticketCount()})` : ""; }

// ---------- matching ----------
function findGenre(q) {
  const n = norm(q);
  if (!n) return null;
  if (/^[1-8]$/.test(n)) return MENU[Number(n) - 1];
  for (const g of MENU) if (GENRE_NAMES[g.id].some(a => norm(a) === n)) return g;
  if (n.length >= 3) for (const g of MENU) if (GENRE_NAMES[g.id].some(a => norm(a).startsWith(n))) return g;
  return null;
}
function findDrinks(q) {
  const n = norm(q);
  if (!n) return [];
  const exact = ALL.filter(d => d.key === n || noThe(d.key) === noThe(n));
  if (exact.length) return exact;
  const words = n.split(" ").filter(w => w !== "the");
  if (!words.length) return [];
  const byWords = ALL.filter(d => words.every(w => d.key.split(" ").some(k => k.startsWith(w))));
  if (byWords.length) return byWords;
  return ALL.filter(d => d.key.includes(n));
}
function distance(a, b) {
  const m = a.length, n = b.length;
  if (!m) return n;
  if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[n];
}
function closest(word, vocab) {
  let best = null, score = Infinity;
  vocab.forEach(v => { const d = distance(word, v); if (d < score) { score = d; best = v; } });
  return score <= Math.max(2, Math.floor(word.length / 2)) ? best : null;
}

// ---------- output blocks ----------
function drinkRow(d) {
  const row = el("div", "drow");
  const top = el("div", "dtop");
  top.append(button(d.name, "dn", () => runLine("order " + d.name.toLowerCase())), el("span", "lead2"), el("span", "pr", money(d.price)));
  row.append(top, el("p", "dd", d.desc));
  return row;
}
function showGenre(g) {
  const box = el("div", "block");
  box.append(el("p", "gh", g.name), el("p", "gtag", g.tag));
  g.drinks.forEach(d => box.appendChild(drinkRow({ name: d[0], price: d[1], desc: d[2] })));
  box.append(el("p", "hint", "Click a drink's name to add it to your ticket."));
  print(box);
}
function showDrink(d) {
  const box = el("div", "block");
  box.append(el("p", "gtag", d.genre.name + ": " + d.genre.tag), drinkRow(d), el("p", "hint", "Click the name to add it to your ticket."));
  print(box);
}
function listChoices(list, intro) {
  const box = el("div", "block");
  box.append(el("p", "line", intro));
  const row = el("div", "choices");
  list.forEach(d => row.appendChild(button(`${d.name} ${money(d.price)}`, "inline-btn", () => runLine("order " + d.name.toLowerCase()))));
  box.appendChild(row);
  print(box);
}
function suggestion(text, command) {
  const box = el("div", "block");
  box.append(el("p", "line err", text));
  if (command) {
    const row = el("div", "choices");
    row.appendChild(button(`Run "${command}"`, "inline-btn", () => runLine(command)));
    box.appendChild(row);
  }
  print(box);
}

// ---------- commands ----------
function cmdHelp() {
  const box = el("div", "block");
  box.appendChild(el("p", "gh", "Commands"));
  [
    ["menu", "list the eight genres"],
    ["horror  (or cat horror, or a number 1-8)", "show that genre's drinks"],
    ["order <drink>", "add a drink to your ticket, a partial name works"],
    ["ticket", "see your ticket and total"],
    ["remove <drink>", "take a drink off the ticket"],
    ["hours", "address and opening hours"],
    ["surprise me", "a random drink"],
    ["clear", "wipe the screen"]
  ].forEach(([c, d]) => {
    const r = el("p", "line");
    r.append(el("span", "amber", c), el("span", "dim", "  " + d));
    box.appendChild(r);
  });
  box.appendChild(el("p", "hint", "Tab completes a word. The up and down arrows bring back earlier commands."));
  print(box);
}
function cmdMenu() {
  const box = el("div", "block");
  box.append(el("p", "gh", "Eight genres"), el("p", "hint", "Click a row, or type its name or number."));
  const list = el("div", "glist");
  MENU.forEach((g, i) => {
    const b = el("button", "grow");
    b.type = "button";
    b.append(el("span", "n", String(i + 1)), el("span", "g", g.name), el("span", "t", g.tag));
    b.addEventListener("click", () => runLine(g.name.toLowerCase()));
    list.appendChild(b);
  });
  box.appendChild(list);
  print(box);
}
function addDrink(d) {
  ticket.set(d.name, (ticket.get(d.name) || 0) + 1);
  updateTicketChip();
  const box = el("div", "block");
  const p = el("p", "line ok");
  p.textContent = `Added ${d.name} (${money(d.price)}). Ticket: ${ticketCount()} ${ticketCount() === 1 ? "drink" : "drinks"}, ${money(ticketTotal())}.`;
  box.appendChild(p);
  box.appendChild(button("View ticket", "inline-btn", () => runLine("ticket")));
  print(box);
}
function cmdOrder(arg) {
  if (!arg) {
    say("Which drink? Type: order true grit. Or click any drink's name after opening a genre.", "dim");
    print(button("Show the menu", "inline-btn", () => runLine("menu")));
    return;
  }
  const hits = findDrinks(arg);
  if (hits.length === 1) return addDrink(hits[0]);
  if (hits.length > 1) return listChoices(hits.slice(0, 8), `Several drinks match "${arg}". Click the one you want:`);
  const near = closest(norm(arg), ALL.map(d => d.key));
  const d = near && ALL.find(x => x.key === near);
  suggestion(`No drink called "${arg}".` + (d ? ` Closest is ${d.name}.` : " Try the menu to browse."), d ? "order " + d.name.toLowerCase() : "menu");
}
function cmdTicket() {
  if (!ticket.size) {
    say("Your ticket is empty. Click a drink's name, or type: order <drink>.", "dim");
    return;
  }
  const box = el("div", "block");
  box.appendChild(el("p", "gh", "Your ticket"));
  ticket.forEach((q, name) => {
    const d = ALL.find(x => x.name === name);
    const r = el("div", "ticket-line");
    r.append(el("span", "q", q + "x"), el("span", "nm", name), el("span", "lead2"), el("span", "pr", money(q * d.price)));
    box.appendChild(r);
  });
  const t = el("div", "ticket-total");
  t.append(el("span", "", "Total"), el("span", "pr", money(ticketTotal())));
  box.append(t, el("p", "hint", "Nothing is really ordered. Read this to the barista at the counter."));
  print(box);
}
function cmdRemove(arg) {
  if (!ticket.size) return say("Your ticket is empty, so there is nothing to remove.", "dim");
  const hits = arg ? findDrinks(arg).filter(d => ticket.has(d.name)) : [];
  if (!hits.length) return suggestion(arg ? `"${arg}" is not on your ticket.` : "Remove which drink? Type: remove <drink>.", "ticket");
  const d = hits[0];
  const q = ticket.get(d.name) - 1;
  if (q > 0) ticket.set(d.name, q); else ticket.delete(d.name);
  updateTicketChip();
  say(`Removed one ${d.name}. Ticket: ${ticketCount()} ${ticketCount() === 1 ? "drink" : "drinks"}, ${money(ticketTotal())}.`, "ok");
}
function cmdHours() {
  const box = el("div", "block");
  box.append(el("p", "gh", "Visit"), el("p", "line", "Scene & Sip"), el("p", "line", "1138 Marquee Lane, Hyde Park, Chicago"), el("p", "line", "Open daily, 7 a.m. to 10 p.m."));
  print(box);
}
function cmdSurprise() {
  const d = ALL[Math.floor(Math.random() * ALL.length)];
  const box = el("div", "block");
  box.append(el("p", "line ok", "Your surprise:"), drinkRow(d));
  box.appendChild(button("Order it", "inline-btn", () => runLine("order " + d.name.toLowerCase())));
  print(box);
}
function cmdClear() {
  log.textContent = "";
  say("Screen cleared. Type help, or click any suggestion below.", "dim");
}

function unknown(text, first) {
  const vocab = [...Object.keys(WORD_TO_CMD).filter(w => w.length > 1), ...Object.values(GENRE_NAMES).flat()];
  const near = closest(first, vocab);
  if (near) {
    const as = WORD_TO_CMD[near] ? near : near;
    return suggestion(`I don't know "${text}". Did you mean "${as}"?`, as);
  }
  suggestion(`I don't know "${text}". Type help to see what works.`, "help");
}

// ---------- run ----------
const history = [];
let histIdx = 0;
let draft = "";

function runLine(raw) {
  finishBoot();
  const text = raw.trim();
  if (!text) return;
  echo(text);
  if (history[history.length - 1] !== text) history.push(text);
  histIdx = history.length;

  const parts = text.toLowerCase().split(/\s+/);
  const first = parts[0];
  const arg = parts.slice(1).join(" ");
  const cmd = WORD_TO_CMD[first];

  if (cmd === "help") return cmdHelp();
  if (cmd === "menu") return cmdMenu();
  if (cmd === "cat") {
    if (!arg) return cmdMenu();
    const g = findGenre(arg);
    if (g) return showGenre(g);
    const ds = findDrinks(arg);
    if (ds.length === 1) return showDrink(ds[0]);
    return suggestion(`Nothing called "${arg}" to show.`, "menu");
  }
  if (cmd === "order") return cmdOrder(arg);
  if (cmd === "ticket") return cmdTicket();
  if (cmd === "remove") return cmdRemove(arg);
  if (cmd === "hours") return cmdHours();
  if (cmd === "surprise") return cmdSurprise();
  if (cmd === "clear") return cmdClear();

  const g = findGenre(text);
  if (g) return showGenre(g);
  const ds = findDrinks(text);
  if (ds.length === 1) return showDrink(ds[0]);
  if (ds.length > 1) return listChoices(ds.slice(0, 8), `Several drinks match "${text}". Click one to add it:`);
  unknown(text, first);
}

form.addEventListener("submit", e => {
  e.preventDefault();
  const v = input.value;
  input.value = "";
  runLine(v);
});

// ---------- chips (always on screen) ----------
[["help"], ["menu"], ["order"], ["ticket"], ["hours"], ["surprise me"], ["clear"]].forEach(([label]) => {
  const b = el("button", "chip", label);
  b.type = "button";
  if (label === "ticket") { ticketChipCount = el("span", "count"); b.appendChild(ticketChipCount); }
  b.addEventListener("click", () => { runLine(label); if (fineSurface) input.focus(); });
  chipsCmd.appendChild(b);
});
MENU.forEach(g => {
  const b = el("button", "chip", g.name.toLowerCase());
  b.type = "button";
  b.addEventListener("click", () => { runLine(g.name.toLowerCase()); if (fineSurface) input.focus(); });
  chipsGenre.appendChild(b);
});

// ---------- history and tab completion ----------
function commonPrefix(list) {
  let p = list[0];
  list.forEach(s => { while (!s.toLowerCase().startsWith(p.toLowerCase())) p = p.slice(0, -1); });
  return p;
}
function complete() {
  const v = input.value;
  const m = v.match(/^(\S*)(\s+)?([\s\S]*)$/);
  const head = m[1].toLowerCase();
  let pool, prefix, rest = "";
  if (!m[2]) {
    pool = [...Object.keys(COMMANDS), ...Object.values(GENRE_NAMES).map(a => a[0])];
    prefix = head;
  } else {
    const c = WORD_TO_CMD[head];
    rest = m[3].toLowerCase();
    if (c === "order" || c === "remove") pool = ALL.map(d => d.name);
    else if (c === "cat") pool = MENU.map(g => g.name);
    else return;
    prefix = norm(rest);
  }
  const hits = pool.filter(p => {
    const n = norm(p);
    return n.startsWith(prefix) || noThe(n).startsWith(prefix) || n.split(" ").some(w => w.startsWith(prefix) && prefix.length >= 2);
  });
  if (!hits.length) return;
  const base = m[2] ? m[1] + m[2] : "";
  if (hits.length === 1) { input.value = base + (m[2] ? hits[0].toLowerCase() : hits[0].toLowerCase() + " "); return; }
  const common = commonPrefix(hits.map(h => h.toLowerCase()));
  if (common.length > prefix.length && (!m[2] || common.toLowerCase().startsWith(rest))) input.value = base + common;
  say("Tab: " + hits.map(h => h.toLowerCase()).join(", "), "dim");
}
input.addEventListener("keydown", e => {
  if (e.key === "Tab" && !e.shiftKey) {
    e.preventDefault();
    complete();
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    if (histIdx === history.length) draft = input.value;
    histIdx = Math.max(0, histIdx - 1);
    if (history.length) input.value = history[histIdx];
  } else if (e.key === "ArrowDown") {
    e.preventDefault();
    histIdx = Math.min(history.length, histIdx + 1);
    input.value = histIdx === history.length ? draft : history[histIdx];
  }
});

// ---------- boot, then the welcome screen ----------
const BOOT = ["scene-and-sip v1.0", "loading menu ........ 8 genres, 23 drinks", "warming the espresso machine ... ok"];
let booting = !reduce;
let bootIdx = 0;
let bootTimer = null;

function welcome() {
  const w = el("div", "block welcome");
  w.append(el("h2", "", "Scene & Sip"), el("p", "line lead", "Every drink is a genre."));
  const how = el("div", "how");
  how.append(el("p", "line", "Type a command and press Enter, or click any suggestion below."));
  const ul = el("ul");
  ["Try: menu, horror, or surprise me", "Click a drink's name in any list to add it to your ticket", "Tab completes a word; the up and down arrows bring back earlier commands"].forEach(t => ul.appendChild(el("li", "", t)));
  how.appendChild(ul);
  w.appendChild(how);
  print(w);
}
function bootStep() {
  if (bootIdx < BOOT.length) {
    say(BOOT[bootIdx++], "dim");
    bootTimer = setTimeout(bootStep, 330);
  } else {
    finishBoot();
  }
}
function finishBoot() {
  if (!booting) return;
  booting = false;
  clearTimeout(bootTimer);
  while (bootIdx < BOOT.length) say(BOOT[bootIdx++], "dim");
  welcome();
}
document.addEventListener("keydown", finishBoot);
document.addEventListener("pointerdown", finishBoot);

if (booting) bootStep(); else welcome();
if (fineSurface) input.focus();
