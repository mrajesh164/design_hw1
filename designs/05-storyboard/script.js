document.documentElement.classList.add("js");

const shots = [...document.querySelectorAll(".shot")];

// Each stroke gets a normalized length so it can be drawn in with a dash animation
document.querySelectorAll(".art svg :is(path, circle, ellipse)").forEach((el, i) => {
  el.setAttribute("pathLength", "1");
  el.style.setProperty("--i", i % 14);
});

const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in");
    io.unobserve(e.target);
  });
}, { threshold: 0.25 });
shots.forEach(s => io.observe(s));

// Animatic: step through the panels in order, like a storyboard played as a rough cut
const btn = document.getElementById("animatic");
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
let timer = null;
let idx = 0;

function stop() {
  clearTimeout(timer);
  timer = null;
  document.body.classList.remove("playing");
  shots.forEach(s => s.classList.remove("live"));
  btn.setAttribute("aria-pressed", "false");
  btn.innerHTML = "&#9654; Play animatic";
}
function step() {
  shots.forEach((s, i) => s.classList.toggle("live", i === idx));
  const s = shots[idx];
  s.classList.add("in");
  s.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
  idx++;
  if (idx >= shots.length) { timer = setTimeout(stop, 2600); return; }
  timer = setTimeout(step, 2600);
}
btn.addEventListener("click", () => {
  if (timer) { stop(); return; }
  idx = 0;
  document.body.classList.add("playing");
  btn.setAttribute("aria-pressed", "true");
  btn.innerHTML = "&#9632; Stop";
  step();
});
