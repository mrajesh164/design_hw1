const roll = document.getElementById("roll");
const playBtn = document.getElementById("play");
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

let speed = 45; // px per second
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
