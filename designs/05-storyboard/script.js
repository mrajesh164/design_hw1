// Give every stroke a normalized length so a shot can re-draw itself on hover
document.querySelectorAll(".art svg :is(path, circle, ellipse)").forEach(el => el.setAttribute("pathLength", "1"));
