// Give every stroke a normalized length so a shot can re-draw itself on hover
document.querySelectorAll(".art svg :is(path, circle, ellipse)").forEach(el => el.setAttribute("pathLength", "1"));

// Mark the section you are in on the top bar
const navLinks = [...document.querySelectorAll(".links a")];
const sections = ["about", "menu", "visit"].map(id => document.getElementById(id));
function updateNav() {
  const mid = innerHeight * 0.35;
  let current = sections[0].id;
  sections.forEach(s => { if (s.getBoundingClientRect().top <= mid) current = s.id; });
  navLinks.forEach(a => {
    if (a.getAttribute("href") === "#" + current) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
  });
}
addEventListener("scroll", updateNav, { passive: true });
addEventListener("resize", updateNav);
updateNav();
