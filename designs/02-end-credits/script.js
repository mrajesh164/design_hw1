const roll = document.getElementById("roll");
const playBtn = document.getElementById("play");
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

let speed = 75; // px per second
let playing = !reduceMotion;
let hovering = false;
let idleUntil = 0;
let endedAt = 0;
let pos = 0;
let last = performance.now();

function syncButton() {
  playBtn.textContent = playing ? "Pause" : "Play";
  playBtn.setAttribute("aria-pressed", String(!playing));
}

function frame(now) {
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
  requestAnimationFrame(frame);
}

// Pause while the pointer rests on a menu row, so it can be read
roll.addEventListener("pointerover", e => { hovering = !!e.target.closest(".row"); });
roll.addEventListener("pointerleave", () => { hovering = false; });

// Manual scrolling takes over briefly, then the roll resumes from there
["wheel", "touchstart", "touchmove", "keydown"].forEach(type =>
  roll.addEventListener(type, () => { idleUntil = performance.now() + 2500; endedAt = 0; }, { passive: true }));

playBtn.addEventListener("click", () => { playing = !playing; syncButton(); });
document.getElementById("slower").addEventListener("click", () => { speed = Math.max(10, speed - 15); });
document.getElementById("faster").addEventListener("click", () => { speed = Math.min(200, speed + 15); });
document.getElementById("restart").addEventListener("click", () => { pos = 0; roll.scrollTop = 0; endedAt = 0; });

document.addEventListener("keydown", e => {
  if (e.code === "Space" && e.target === document.body) { e.preventDefault(); playing = !playing; syncButton(); }
});

syncButton();
requestAnimationFrame(frame);

// Atmosphere: tint follows the unit on screen, perforations and timecode follow scroll
const tinted = [...document.querySelectorAll("[data-h]")];
const bg = document.querySelector(".bg");
const tc = document.querySelector(".tc");
const perfs = document.querySelectorAll(".perfs");
let current = null;

function atmosphere() {
  const mid = innerHeight * 0.5;
  const hit = tinted.find(el => {
    const r = el.getBoundingClientRect();
    return r.top < mid && r.bottom > mid;
  });
  if (hit && hit !== current) {
    current = hit;
    bg.style.setProperty("--h", hit.dataset.h);
    bg.style.setProperty("--s", hit.dataset.s);
  }
  const y = roll.scrollTop;
  perfs.forEach(p => p.style.setProperty("--y", y));
  const max = roll.scrollHeight - roll.clientHeight || 1;
  const t = Math.floor((y / max) * 5400); // a 90-minute feature
  const f = n => String(n).padStart(2, "0");
  tc.textContent = `${f(Math.floor(t / 3600))}:${f(Math.floor(t / 60) % 60)}:${f(t % 60)}:${f(Math.floor((y % 24)))}`;
}
roll.addEventListener("scroll", () => requestAnimationFrame(atmosphere), { passive: true });
atmosphere();
