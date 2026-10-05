(function () {
  "use strict";

  var MENU = [
    { id: "horror", name: "Horror", burst: "BOO!", tag: "Rated R for Roast", drinks: [
      ["The Final Girl", "$4.00", "Dark roast, brewed black. Hot enough to wake the dead."],
      ["Basement Cold Brew", "$5.00", "Cold brew steeped for twenty-four hours. Don't ask what else is down there."],
      ["The Call Is Coming From Inside", "$5.50", "Blood orange shrub, sparkling. Sweet, red, a little too sharp."] ] },
    { id: "scifi", name: "Sci-Fi", burst: "ZAP!", tag: "In space, no one can hear you sip", drinks: [
      ["Warp Drive", "$6.00", "Espresso tonic with butterfly pea. Starts blue, ends purple."],
      ["First Contact", "$6.50", "Ceremonial matcha with edible glitter."],
      ["Replicant", "$5.25", "Oat flat white. More human than the human kind."] ] },
    { id: "noir", name: "Noir", burst: "SHH!", tag: "Always served after dark", drinks: [
      ["Bitter End", "$5.00", "Double espresso, amaro syrup, no sugar."],
      ["The Long Goodbye", "$4.50", "Cortado, served slowly."],
      ["Femme Fatale", "$4.75", "Hibiscus iced tea. Red, cold, not what you expected."] ] },
    { id: "romance", name: "Romance", burst: "AWW!", tag: "Best enjoyed with someone", drinks: [
      ["Meet Cute", "$8.00", "Cappuccino, one croissant, two forks."],
      ["Rainstorm Kiss", "$5.75", "Rose latte. Soft, floral, a little dramatic."],
      ["The Grand Gesture", "$6.25", "Honey lavender latte, with a handwritten note."] ] },
    { id: "western", name: "Western", burst: "YEEHAW!", tag: "Strong, simple, no questions asked", drinks: [
      ["True Grit", "$3.75", "Strong black coffee, brewed bold. No sugar, no fuss."],
      ["A Fistful of Espresso", "$4.25", "A triple shot of espresso. Quick on the draw."] ] },
    { id: "mystery", name: "Mystery", burst: "HMM?", tag: "Every sip is a clue", drinks: [
      ["The Usual Suspect", "$4.25", "Earl Grey with a lemon twist. Hiding in plain sight."],
      ["Red Herring", "$5.50", "Smoked tea latte with a hint of cinnamon. Not what it seems."],
      ["Plot Twist", "$6.00", "Iced chai with a shot of espresso. Sweet, then suddenly not."] ] },
    { id: "fantasy", name: "Fantasy", burst: "POOF!", tag: "Brewed with a little magic", drinks: [
      ["The Chosen One", "$6.50", "Golden turmeric latte with honey. Destined for greatness."],
      ["Dragon's Breath", "$5.75", "Spiced hot chocolate with chili and cinnamon. Mind the fire."],
      ["Elixir of Life", "$6.25", "Sparkling elderflower lemonade with edible flowers."] ] },
    { id: "comedy", name: "Comedy", burst: "HA!", tag: "Guaranteed to lighten the mood", drinks: [
      ["Slapstick", "$4.50", "Banana milk latte. Don't slip!"],
      ["Punchline", "$5.25", "Peanut butter mocha. Sweet setup, salty finish."],
      ["Laugh Track", "$5.00", "Cold brew float with vanilla ice cream. Canned laughter not included."] ] }
  ];

  // A comic starburst: alternating long and short points around a circle
  function starPoints(points, outer, inner) {
    var out = [];
    for (var i = 0; i < points * 2; i++) {
      var r = i % 2 === 0 ? outer : inner;
      var a = Math.PI * i / points - Math.PI / 2;
      out.push((50 + r * Math.cos(a)).toFixed(1) + "," + (50 + r * Math.sin(a)).toFixed(1));
    }
    return out.join(" ");
  }
  var STAR = starPoints(12, 48, 38);

  var cardsEl = document.getElementById("cards");
  var jumpEl = document.getElementById("jump");
  var artN = 0;

  MENU.forEach(function (g, gi) {
    var a = document.createElement("a");
    a.href = "#" + g.id;
    a.textContent = g.name;
    a.className = g.id;
    jumpEl.appendChild(a);

    var li = document.createElement("li");
    li.innerHTML =
      '<article class="gcard ' + g.id + '" id="' + g.id + '">' +
        '<div class="panel">' +
          '<svg class="art" viewBox="0 0 220 110" aria-hidden="true" focusable="false">' + ART[g.drinks[0][0]](++artN) + "</svg>" +
          '<span class="burst" aria-hidden="true"><svg viewBox="0 0 100 100"><polygon points="' + STAR + '"/></svg><b' + (g.burst.length > 5 ? ' class="long"' : '') + '>' + g.burst + "</b></span>" +
        "</div>" +
        '<h3 class="gtitle">' + g.name + "</h3>" +
        '<p class="gtag">' + g.tag + "</p>" +
        '<ul class="drinks" aria-label="' + g.name + ' drinks">' +
          g.drinks.map(function (d, di) {
            return '<li><button type="button" class="drink" data-g="' + gi + '" data-d="' + di + '" aria-haspopup="dialog">' +
              '<span class="dn">' + d[0] + '</span><span class="dp">' + d[1] + "</span></button></li>";
          }).join("") +
        "</ul>" +
      "</article>";
    cardsEl.appendChild(li);
  });

  // Pop-up card: the only place a drink's description appears
  var dlg = document.getElementById("drink-card");
  var opener = null;
  cardsEl.addEventListener("click", function (e) {
    var b = e.target.closest(".drink");
    if (!b) return;
    opener = b;
    var g = MENU[Number(b.dataset.g)];
    var d = g.drinks[Number(b.dataset.d)];
    var art = document.getElementById("dc-art");
    art.innerHTML = '<svg viewBox="0 0 220 110" aria-hidden="true" focusable="false">' + ART[d[0]](200 + Number(b.dataset.g) * 10 + Number(b.dataset.d)) + "</svg>";
    var style = getComputedStyle(b.closest(".gcard"));
    dlg.style.setProperty("--c1", style.getPropertyValue("--c1"));
    document.getElementById("dc-genre").textContent = g.name + " menu";
    document.getElementById("dc-name").textContent = d[0];
    document.getElementById("dc-price").textContent = d[1];
    document.getElementById("dc-desc").textContent = d[2];
    dlg.showModal();
  });
  document.getElementById("dc-close").addEventListener("click", function () { dlg.close(); });
  dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener("close", function () { if (opener) opener.focus(); });

  // Mark the section you are in on the top bar
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".links a"));
  var sections = ["home", "about", "menu", "visit"].map(function (id) { return document.getElementById(id); });
  function updateNav() {
    var mid = innerHeight * 0.4;
    var current = "about";
    sections.forEach(function (s) { if (s.getBoundingClientRect().top <= mid) current = s.id === "home" ? "about" : s.id; });
    navLinks.forEach(function (a) {
      if (a.getAttribute("href") === "#" + current) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
    });
  }
  addEventListener("scroll", updateNav, { passive: true });
  addEventListener("resize", updateNav);
  updateNav();
})();
