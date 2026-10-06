// Wrapped in a function so nothing here can clash with the names art.js declares (shadow, steam, glass, ice, star, handle, ART)
(function () {
  "use strict";

  var COLS = 22;
  var ROWS = 5;
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  var MENU = [
    { id: "horror", name: "Horror", tag: "Rated R for Roast", drinks: [
      ["The Final Girl", "$4.00", "Dark roast, brewed black. Hot enough to wake the dead."],
      ["Basement Cold Brew", "$5.00", "Cold brew steeped for twenty-four hours. Don't ask what else is down there."],
      ["The Call Is Coming From Inside", "$5.50", "Blood orange shrub, sparkling. Sweet, red, a little too sharp."] ] },
    { id: "scifi", name: "Sci-Fi", tag: "In space, no one can hear you sip", drinks: [
      ["Warp Drive", "$6.00", "Espresso tonic with butterfly pea. Starts blue, ends purple."],
      ["First Contact", "$6.50", "Ceremonial matcha with edible glitter."],
      ["Replicant", "$5.25", "Oat flat white. More human than the human kind."] ] },
    { id: "noir", name: "Noir", tag: "Always served after dark", drinks: [
      ["Bitter End", "$5.00", "Double espresso, amaro syrup, no sugar."],
      ["The Long Goodbye", "$4.50", "Cortado, served slowly."],
      ["Femme Fatale", "$4.75", "Hibiscus iced tea. Red, cold, not what you expected."] ] },
    { id: "romance", name: "Romance", tag: "Best enjoyed with someone", drinks: [
      ["Meet Cute", "$8.00", "Cappuccino, one croissant, two forks."],
      ["Rainstorm Kiss", "$5.75", "Rose latte. Soft, floral, a little dramatic."],
      ["The Grand Gesture", "$6.25", "Honey lavender latte, with a handwritten note."] ] },
    { id: "western", name: "Western", tag: "Strong, simple, no questions asked", drinks: [
      ["True Grit", "$3.75", "Strong black coffee, brewed bold. No sugar, no fuss."],
      ["A Fistful of Espresso", "$4.25", "A triple shot of espresso. Quick on the draw."] ] },
    { id: "mystery", name: "Mystery", tag: "Every sip is a clue", drinks: [
      ["The Usual Suspect", "$4.25", "Earl Grey with a lemon twist. Hiding in plain sight."],
      ["Red Herring", "$5.50", "Smoked tea latte with a hint of cinnamon. Not what it seems."],
      ["Plot Twist", "$6.00", "Iced chai with a shot of espresso. Sweet, then suddenly not."] ] },
    { id: "fantasy", name: "Fantasy", tag: "Brewed with a little magic", drinks: [
      ["The Chosen One", "$6.50", "Golden turmeric latte with honey. Destined for greatness."],
      ["Dragon's Breath", "$5.75", "Spiced hot chocolate with chili and cinnamon. Mind the fire."],
      ["Elixir of Life", "$6.25", "Sparkling elderflower lemonade with edible flowers."] ] },
    { id: "comedy", name: "Comedy", tag: "Guaranteed to lighten the mood", drinks: [
      ["Slapstick", "$4.50", "Banana milk latte. Don't slip!"],
      ["Punchline", "$5.25", "Peanut butter mocha. Sweet setup, salty finish."],
      ["Laugh Track", "$5.00", "Cold brew float with vanilla ice cream. Canned laughter not included."] ] }
  ];

  // ---------- the letter board on the marquee ----------
  var lbEl = document.getElementById("lb");
  var tiles = [];
  var CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$&.-";
  var timers = [];

  for (var r = 0; r < ROWS; r++) {
    var row = document.createElement("div");
    row.className = "lb-row" + (r === 0 ? " head" : "");
    tiles[r] = [];
    for (var c = 0; c < COLS; c++) {
      var t = document.createElement("span");
      t.className = "lb-tile";
      t.textContent = " ";
      row.appendChild(t);
      tiles[r][c] = t;
    }
    lbEl.appendChild(row);
  }

  function centered(s) {
    var pad = Math.max(0, COLS - s.length);
    return " ".repeat(Math.floor(pad / 2)) + s;
  }

  function flipTo(lines) {
    timers.forEach(clearTimeout);
    timers = [];
    for (var rr = 0; rr < ROWS; rr++) {
      var text = centered(lines[rr] || "").padEnd(COLS).slice(0, COLS);
      for (var cc = 0; cc < COLS; cc++) {
        (function (tile, ch, row, col) {
          if (reduce) { tile.textContent = ch; return; }
          if (tile.textContent === ch) return;
          var start = col * 22 + row * 70;
          var flips = 5 + Math.floor(Math.random() * 4);
          for (var f = 0; f < flips; f++) {
            timers.push(setTimeout(function () {
              tile.classList.add("spin");
              tile.textContent = CHARS[Math.floor(Math.random() * CHARS.length)];
            }, start + f * 45));
          }
          timers.push(setTimeout(function () { tile.classList.remove("spin"); tile.textContent = ch; }, start + flips * 45));
        })(tiles[rr][cc], text[cc], rr, cc);
      }
    }
  }

  // every row is 22 characters or fewer
  var WELCOME = ["NOW SERVING", "COFFEE, TEA, AND A", "GOOD STORY IN", "EVERY CUP.", "OPEN DAILY 7AM-10PM"];
  var TEASERS = {
    about: ["ABOUT US", "", "A NEIGHBORHOOD CAFE", "WITH A BIG IDEA", "COME FOR THE COFFEE"],
    menu: ["NOW SHOWING", "EIGHT GENRES", "TWENTY-THREE DRINKS", "PICK ONE BELOW", "CLICK A DRINK"],
    visit: ["VISIT US", "1138 MARQUEE LANE", "CHICAGO IL 60615", "OPEN DAILY 7AM-10PM", "CALL 555 019 0420"]
  };

  flipTo(WELCOME);

  // tickets: flip the board, then scroll to that part of the page. The board never changes on its own.
  var ticketBtns = [].slice.call(document.querySelectorAll(".tix-btn"));
  ticketBtns.forEach(function (b) {
    b.setAttribute("aria-pressed", "false");
    b.addEventListener("click", function () {
      var key = b.dataset.go;
      ticketBtns.forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      flipTo(TEASERS[key]);
      document.getElementById(key).scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    });
  });

  // ---------- the display case ----------
  var baysEl = document.getElementById("bays");
  var cabinetEl = document.getElementById("cabinet");
  var glassEl = document.getElementById("glass");
  var cardEl = document.getElementById("card");

  // Give the flat drink drawings a pencil outline, like the hand-drawn pictures in design 22:
  // every filled shape gets a dark ink edge, and thick strokes (handles) get an ink border underneath.
  var INK = "#2a1a12";
  function inkOutline(markup) {
    return markup.replace(/<(path|ellipse|rect|circle|polygon)\b([^>]*?)(\/?)>/g, function (all, tag, attrs, close) {
      var fill = (attrs.match(/\sfill="([^"]*)"/) || [])[1];
      var stroke = (attrs.match(/\sstroke="([^"]*)"/) || [])[1];
      var sw = parseFloat((attrs.match(/stroke-width="([\d.]+)"/) || [])[1]);
      if (fill && fill !== "none" && !stroke && fill.indexOf("rgba(0, 0, 0") !== 0 && fill.indexOf("rgba(0,0,0") !== 0) {
        return "<" + tag + attrs + ' stroke="' + INK + '" stroke-width="1.8" stroke-linejoin="round"' + close + ">";
      }
      if ((!fill || fill === "none") && stroke && sw >= 4) {
        var under = attrs.replace(/stroke="[^"]*"/, 'stroke="' + INK + '"').replace(/stroke-width="[\d.]+"/, 'stroke-width="' + (sw + 3.4) + '"');
        return "<" + tag + under + close + "><" + tag + attrs + close + ">";
      }
      return all;
    });
  }

  function svgFor(name, n) {
    return '<svg viewBox="0 0 220 110" aria-hidden="true" focusable="false">' + inkOutline(ART[name](n)) + "</svg>";
  }

  var count = 0;
  baysEl.innerHTML = MENU.map(function (g, gi) {
    return '<section class="bay ' + g.id + '" aria-label="' + g.name + ' shelf" style="--n:' + g.drinks.length + '">' +
      '<span class="bay-wall" aria-hidden="true"></span>' +
      '<div class="plaque"><b>' + g.name + "</b><small>" + g.tag + "</small></div>" +
      '<div class="stage">' +
      g.drinks.map(function (d, di) {
        count++;
        return '<button type="button" class="drink" data-g="' + gi + '" data-d="' + di + '" data-n="' + count + '" aria-haspopup="dialog" aria-label="' + d[0] + ", " + d[1] + '. Read about it.">' +
          '<span class="fig">' + svgFor(d[0], count) + "</span>" +
          '<span class="ledge" aria-hidden="true"></span>' +
          '<span class="label"><b>' + d[0] + "</b><i>" + d[1] + "</i></span></button>";
      }).join("") +
      "</div></section>";
  }).join("");

  function openDrink(btn) {
    var g = MENU[Number(btn.dataset.g)];
    var d = g.drinks[Number(btn.dataset.d)];
    var art = document.getElementById("c-art");
    art.innerHTML = svgFor(d[0], 100 + Number(btn.dataset.n));
    art.style.setProperty("--tint", getComputedStyle(btn.closest(".bay")).getPropertyValue("--tint"));
    document.getElementById("c-genre").textContent = g.name + " shelf";
    document.getElementById("c-name").textContent = d[0];
    document.getElementById("c-price").textContent = d[1];
    document.getElementById("c-desc").textContent = d[2];
    cardEl.showModal();
  }

  baysEl.addEventListener("click", function (e) {
    var b = e.target.closest(".drink");
    if (b) openDrink(b);
  });
  document.getElementById("c-close").addEventListener("click", function () { cardEl.close(); });
  cardEl.addEventListener("click", function (e) { if (e.target === cardEl) cardEl.close(); });

  // Parallax: layers shift by different amounts with the pointer and a soft light follows it.
  // Skipped on touch screens and for reduced motion, where the case is already fully lit.
  var still = matchMedia("(hover: none), (prefers-reduced-motion: reduce)").matches;
  if (!still) {
    var raf = 0;
    var nx = 0, ny = 0, mx = 50, my = 30;
    var apply = function () {
      raf = 0;
      cabinetEl.style.setProperty("--px", nx.toFixed(3));
      cabinetEl.style.setProperty("--py", ny.toFixed(3));
      glassEl.style.setProperty("--mx", mx.toFixed(1) + "%");
      glassEl.style.setProperty("--my", my.toFixed(1) + "%");
    };
    glassEl.addEventListener("pointermove", function (e) {
      if (e.pointerType === "touch") return;
      var rect = glassEl.getBoundingClientRect();
      mx = ((e.clientX - rect.left) / rect.width) * 100;
      my = ((e.clientY - rect.top) / rect.height) * 100;
      nx = (mx / 100) * 2 - 1;
      ny = (my / 100) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(apply);
    });
    glassEl.addEventListener("pointerleave", function () {
      nx = 0; ny = 0; mx = 50; my = 30;
      if (!raf) raf = requestAnimationFrame(apply);
    });
  }

  // ---------- the service bell: scroll up to the case and open a random drink ----------
  var bell = document.getElementById("bell");
  var pickEl = document.getElementById("pick");
  var allDrinks = [].slice.call(baysEl.querySelectorAll(".drink"));
  var lastPick = null;

  bell.addEventListener("click", function () {
    bell.classList.remove("ring");
    void bell.offsetWidth;
    bell.classList.add("ring");

    allDrinks.forEach(function (b) { b.classList.remove("picked"); });
    var pick;
    do { pick = allDrinks[Math.floor(Math.random() * allDrinks.length)]; } while (pick === lastPick && allDrinks.length > 1);
    lastPick = pick;
    pick.classList.add("picked");
    pickEl.textContent = "Barista's pick: " + pick.querySelector(".label b").textContent;
    pick.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    setTimeout(function () { openDrink(pick); }, reduce ? 0 : 650);
  });

  // ---------- mark the section you are in on the top bar ----------
  var navLinks = [].slice.call(document.querySelectorAll(".tb-links a"));
  var sections = ["about", "menu", "visit"].map(function (id) { return document.getElementById(id); });
  function markNav() {
    var line = innerHeight * 0.4;
    var current = "";
    sections.forEach(function (s) { if (s.getBoundingClientRect().top <= line) current = s.id; });
    navLinks.forEach(function (a) {
      if (a.getAttribute("href") === "#" + current) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
    });
  }
  addEventListener("scroll", markNav, { passive: true });
  addEventListener("resize", markNav);
  markNav();
})();
