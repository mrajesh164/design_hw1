document.documentElement.classList.add("js");

const items = document.querySelectorAll(".reveal, .slug");
items.forEach(el => {
  if (el.classList.contains("slug")) el.style.setProperty("--n", el.textContent.length);
});

const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in");
    io.unobserve(e.target);
  });
}, { threshold: 0.2 });

items.forEach(el => io.observe(el));
