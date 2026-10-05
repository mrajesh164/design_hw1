const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const cards = [...document.querySelectorAll(".card")];
const captions = [...document.querySelectorAll(".caption")];

// Iris-in reveal. Everything is plain visible content unless the browser can observe it and motion is welcome.
if ("IntersectionObserver" in window && !reduce) {
  document.documentElement.classList.add("js");
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      io.unobserve(e.target);
    });
  }, { threshold: 0.05 });
  [...cards, ...captions].forEach(el => io.observe(el));
}

// Reel counter follows whichever card is nearest the middle of the screen
const counter = document.createElement("div");
counter.className = "reel-count";
counter.setAttribute("aria-hidden", "true");
document.body.appendChild(counter);

let ticking = false;
function updateReel() {
  ticking = false;
  const mid = innerHeight / 2;
  let best = cards[0];
  let bestDist = Infinity;
  cards.forEach(c => {
    const r = c.getBoundingClientRect();
    const dist = r.top <= mid && r.bottom >= mid ? 0 : Math.min(Math.abs(r.top - mid), Math.abs(r.bottom - mid));
    if (dist < bestDist) { bestDist = dist; best = c; }
  });
  counter.textContent = `Reel ${best.dataset.reel} of ${cards.length}`;
}
addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(updateReel); } }, { passive: true });
addEventListener("resize", updateReel);
updateReel();
