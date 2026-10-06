const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const root = document.documentElement;
const wrap = document.querySelector(".reel-wrap");
const cards = [...document.querySelectorAll(".card")];
const list = document.getElementById("reel-list");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const walker = document.getElementById("walker");

// Without this class the page is just a stack of cards, so it still reads fine if the script fails
root.classList.add("stage");

const counter = document.createElement("div");
counter.className = "reel-count";
counter.setAttribute("aria-hidden", "true");
document.body.appendChild(counter);

const kindOf = card => [...card.classList].find(c => !["card", "current", "leaving"].includes(c));

// Reel index along the bottom: the quickest way to reach any genre's menu
const reelBtns = cards.map((card, i) => {
  const b = document.createElement("button");
  b.type = "button";
  b.textContent = i === 0 ? "Title" : card.classList.contains("end") ? "The End" : card.querySelector("h2").textContent;
  b.addEventListener("click", () => go(i));
  list.appendChild(b);
  return b;
});

let cur = -1;
let timer = null;

function go(i) {
  i = Math.max(0, Math.min(cards.length - 1, i));
  if (i === cur) return;
  clearTimeout(timer);
  const prev = cards[cur];
  cards.forEach(c => c.classList.remove("current", "leaving"));
  const enter = () => { cards[i].classList.add("current"); wrap.scrollTop = 0; };
  if (prev && !reduce) {
    prev.classList.add("leaving");
    timer = setTimeout(() => { prev.classList.remove("leaving"); enter(); }, 430);
  } else {
    enter();
  }
  cur = i;
  refresh();
}

function refresh() {
  counter.textContent = `Reel ${cur + 1} of ${cards.length}`;
  reelBtns.forEach((b, i) => {
    if (i === cur) b.setAttribute("aria-current", "true"); else b.removeAttribute("aria-current");
  });
  prevBtn.disabled = cur === 0;
  nextBtn.disabled = cur === cards.length - 1;
  prevBtn.style.opacity = prevBtn.disabled ? ".35" : "";
  nextBtn.style.opacity = nextBtn.disabled ? ".35" : "";
  const cur_btn = reelBtns[cur];
  if (cur_btn && cur_btn.scrollIntoView) cur_btn.scrollIntoView({ block: "nearest", inline: "center" });
  if (!reduce) {
    walker.classList.remove("go");
    void walker.offsetWidth;
    walker.classList.add("go");
  }
}

prevBtn.addEventListener("click", () => go(cur - 1));
nextBtn.addEventListener("click", () => go(cur + 1));
document.querySelectorAll("[data-go]").forEach(b =>
  b.addEventListener("click", () => go(b.dataset.go === "next" ? cur + 1 : Number(b.dataset.go))));

// Arrow keys turn the cards. Up and Down are left alone so a tall card can still be scrolled.
addEventListener("keydown", e => {
  if (e.altKey || e.ctrlKey || e.metaKey) return;
  const k = e.key;
  if (k === "ArrowRight" || k === "PageDown") { e.preventDefault(); go(cur + 1); }
  else if (k === "ArrowLeft" || k === "PageUp") { e.preventDefault(); go(cur - 1); }
  else if (k === "Home") { e.preventDefault(); go(0); }
  else if (k === "End") { e.preventDefault(); go(cards.length - 1); }
  else if (k === " " && e.target === document.body) { e.preventDefault(); go(cur + 1); }
});

// Swipe on touch screens
let touchX = null;
wrap.addEventListener("touchstart", e => { touchX = e.touches[0].clientX; }, { passive: true });
wrap.addEventListener("touchend", e => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  touchX = null;
  if (Math.abs(dx) > 60) go(cur + (dx < 0 ? 1 : -1));
}, { passive: true });

// ---------- live piano (optional, off until asked) ----------
// A tiny ragtime-ish loop made with the browser's built-in Web Audio: oom-pah bass and chords, wandering melody.
// Genres with a dark mood play in a minor scale, the rest in major, each from its own root note.
const pianoBtn = document.getElementById("piano");
const pianist = document.getElementById("pianist");
const AC = window.AudioContext || window.webkitAudioContext;
const MAJOR = [0, 2, 4, 5, 7, 9, 11];
const MINOR = [0, 2, 3, 5, 7, 8, 10];
const DARK = new Set(["horror", "noir", "mystery"]);
const ROOT = { title: 0, horror: -5, scifi: 2, noir: -2, romance: 3, action: 0, mystery: -3, fantasy: 5, comedy: 7, end: 0 };
let ac = null;
let loop = null;
let step = 0;
let melody = 4;

const freq = semi => 220 * Math.pow(2, semi / 12);
function tone(hz, at, dur, vol, type) {
  const o = ac.createOscillator();
  const g = ac.createGain();
  o.type = type;
  o.frequency.value = hz;
  g.gain.setValueAtTime(0.0001, at);
  g.gain.linearRampToValueAtTime(vol, at + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  o.connect(g).connect(ac.destination);
  o.start(at);
  o.stop(at + dur + 0.05);
}
function beat() {
  const at = ac.currentTime + 0.02;
  const kind = kindOf(cards[cur]);
  const scale = DARK.has(kind) ? MINOR : MAJOR;
  const root = ROOT[kind] ?? 0;
  const b = step % 8;
  if (b === 0 || b === 4) tone(freq(root - 12 + (b === 0 ? 0 : 7)), at, 0.3, 0.14, "triangle");
  if (b === 2 || b === 6) [0, scale[2], scale[4]].forEach(s => tone(freq(root + s), at, 0.2, 0.05, "triangle"));
  if (Math.random() < 0.7) {
    melody = Math.max(0, Math.min(13, melody + [-2, -1, -1, 0, 1, 1, 2][Math.floor(Math.random() * 7)]));
    tone(freq(root + 12 + scale[melody % 7] + 12 * Math.floor(melody / 7)), at, 0.22, 0.07, "sine");
  }
  step++;
}
if (!AC) {
  pianist.style.display = "none";
} else {
  pianoBtn.addEventListener("click", () => {
    const on = pianoBtn.getAttribute("aria-pressed") !== "true";
    if (on) {
      ac = ac || new AC();
      ac.resume();
      loop = setInterval(beat, 190);
    } else {
      clearInterval(loop);
    }
    pianoBtn.setAttribute("aria-pressed", String(on));
    pianoBtn.innerHTML = on ? "&#9834; Live piano: on" : "&#9834; Live piano: off";
    pianist.classList.toggle("playing", on);
  });
}

go(0);
