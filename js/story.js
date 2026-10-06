// The process story behind the gallery. Written in the first person so it can be edited in your own voice.

const PHASES = [
  {
    id: 1, title: "Exploring", range: [1, 20],
    text: [
      "I worked on a couple of ideas at a time, refining each one until it felt presentable before moving on to the next. That gave me twenty different directions, from a screenplay and a cinema marquee to a VHS tape, a terminal and a glass display case.",
      "Partway through I added three more genres (mystery, fantasy and comedy), so every design had to grow from five genres to eight."
    ],
    learned: [
      "My feedback mainly involved making it clear how to use the page, having a menu that is easy to read and understand but also creative, and using cohesive color schemes and layouts.",
      "Three stood out to me: the storyboard look (5), the silent film once it stepped through cards with the arrow keys (9), and the genre switcher with its home page (15)."
    ]
  },
  {
    id: 2, title: "Combining", range: [21, 25],
    text: [
      "Around design 20 I stopped starting new ideas and combined my ten favorites (2, 3, 5, 9, 10, 11, 15, 17, 19 and 20) into hybrids: a colored storyboard, a full café site, a pop art version, a film-DVD version and a cinema-café front."
    ],
    learned: [
      "The first storyboard-inspired design felt slightly incomplete for a café website, so I added a home page, About us, the menu and Visit us sections to make it feel more complete. For the rest of my combined versions I used this similar format."
    ]
  }
];

// Why 25: the part that is mostly your own thinking.
const FINAL = {
  n: 25,
  title: "Why I chose design 25",
  text: [
    "I wanted something warmer and cozier than the brighter, daytime look of most café websites. A café that glows after dark, with a marquee, a lit display case and a counter with a bell, felt like a cozy, relaxing atmosphere people would enjoy.",
    "It is also the design I refined the most until it felt like one place instead of three ideas stuck together. It contains the similar café website format with an About us and Visit us section, and I liked the creative menu layout where the drinks are displayed."
  ]
};

// The family tree. Row 0 holds the ten favorites; every hybrid lists its parents and what it took from each.
const TREE = {
  favorites: [10, 11, 5, 15, 9, 2, 17, 3, 19, 20],
  hybrids: {
    21: { parents: [5, 9, 15], gives: {
      5:  "the pencil and paper storyboard look",
      9:  "a line of story on every panel",
      15: "a color and pattern for each genre" } },
    22: { parents: [21], gives: {
      21: "the colored storyboard panels, now inside a full café site: a home section, About us, the menu and Visit us" } },
    23: { parents: [10, 11], gives: {
      10: "lobby-card style genre cards and chunky lettering",
      11: "the bright 1980s palette and the pop-up description card" } },
    24: { parents: [2, 9, 17], gives: {
      2:  "the end-credits roll, used for Visit us",
      9:  "stepping card by card with the arrow keys",
      17: "the DVD main menu and the director's notes" } },
    25: { parents: [3, 19, 20], gives: {
      3:  "the marquee, the flipping letter board and the ticket buttons",
      19: "the lit glass display case for the menu",
      20: "the backlit panels and the counter with a bell for Visit us" } }
  },
  // Designs that were explored and not carried into a hybrid, with what I said about them where I did.
  aside: {
    1:  "I liked it as a screenplay, but the menu was hard to read.",
    4:  "It was cinematic, but very confusing to figure out.",
    6:  "",
    7:  "I did not love the bright blue.",
    8:  "Its drink drawings live on in designs 19, 23 and 25.",
    12: "It felt too blocky and big.",
    13: "",
    14: "",
    16: "",
    18: ""
  }
};

// Feedback log, in the order it happened. Paraphrased from my notes to Claude.
const DECISIONS = [
  { n: 1,  said: "I like the screenplay idea, but the menu is very hard to understand.",
    changed: "Each drink now has its name and price on one bold line, the ingredients are plain text, and a key on the title page explains how to read the menu." },
  { n: 2,  said: "The plain black background is not doing it for me. I want more detail, and the opening is too slow.",
    changed: "Added a colored wash for each genre, film grain, a projector beam, moving film-strip edges and a timecode, and the title appears right away." },
  { n: 3,  said: "I do not like the menu being repeated in the flashing sign and again below it.",
    changed: "The sign now only teases each genre. Names, prices and descriptions appear once, underneath." },
  { n: 4,  said: "This one is very confusing. I cannot tell how it works.",
    changed: "Added a big play button, video-style controls, a counter and a pop-up menu for each genre." },
  { n: 5,  said: "I really like the storyboard style, but the animation makes it hard to get around.",
    changed: "Removed the scroll animation and the auto-playing tour, and added jump links to each genre." },
  { n: 7,  said: "I do not love the bright blue, the be-kind-rewind line does not make sense, and the blinking clock is not nice. Make the play button do something.",
    changed: "Moved to a dim teal-black screen, dropped the slogan, swapped the blinking clock for the real time, and made Play run a tour of the tapes." },
  { n: 8,  said: "I do not like the patterns on the frames. Make each menu item a picture of the drink itself.",
    changed: "Drew a small illustration for every drink." },
  { n: 0,  label: "All", said: "Add three more genres: mystery, fantasy and comedy.",
    changed: "Every design was updated to eight genres, each with three new drinks." },
  { n: 9,  said: "I do not like this one. Add something more. I do not know how to get to the menu, and I want to click through the story with the arrow keys.",
    changed: "Turned it into a card-by-card show with a Start button, arrow keys, a reel index along the bottom, a walking silhouette and optional live piano. I liked it much better after." },
  { n: 11, said: "When I click a menu item, do not scroll back up. Let a description card pop up.",
    changed: "Descriptions open in a pop-up card over the guide, and a See program button scrolls down to it." },
  { n: 12, said: "I do not like the neon yellow, and everything is too blocky and big.",
    changed: "Switched to a calmer vermilion, thinner lines and smaller type, with color used as a highlight instead of big blocks." },
  { n: 15, said: "I like this one. Add a home page when it first opens.",
    changed: "It now opens on a home page with a preview tile for each of the eight looks." },
  { n: 17, said: "Designs 9 and 17 look kind of similar, so change one.",
    changed: "I tried a glossy restyle of 17, then decided I liked it better before and reverted it. Later I saw that 9 and 17 were different enough." },
  { n: 0,  label: "Plan", said: "I will pick the designs I like most, group them by feel, make two or three hybrids, then refine the best one.",
    changed: "Designs 21 to 25 became hybrids of my ten favorites." },
  { n: 22, said: "The storyboard makes it unclear that this is a café. I want a home page, an about section, and a way to scroll to the menu and contact info.",
    changed: "Built a full café site with a home section, About us, the menu and Visit us, with a sticky bar to jump between them." },
  { n: 23, said: "Keep the full café site, but go in a different direction inspired by 10 and 11, with bright pop art colors.",
    changed: "The same structure in pop art: halftone dots, thick outlines, starbursts and lobby-card genre cards." },
  { n: 25, said: "The red and yellow box at the top is too bold and not cozy. The title font is hard to read, and the lights blink too much. I liked the moving lights, just slower.",
    changed: "Softened the sign to a dusty burgundy with cream lettering, matched the fonts to the section titles, drew the drinks by hand like in 22, and slowed the bulbs." }
];
