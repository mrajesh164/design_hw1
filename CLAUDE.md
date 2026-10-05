# Home Brew

A gallery of 25 landing page designs for a fictional café (Home Brew) whose menu is built around film and TV genres. The root `index.html` is the gallery; each design lives in `designs/NN-slug/`.

## Goals
- Explore a wide variety of directions with few constraints.
- 20 of 25 designs must be completely unique and look unlike anyone else's in class. Avoid the generic navbar + hero image + card grid. Vary layout, interaction, visual register and concept together.
- I'm assessed on breadth of exploration, quality of choices, and how clearly I tell the story of exploring and iterating.

## Constraints
- Plain HTML, CSS and JS only. No frameworks, no packages, no build step, no external APIs or CDN assets, no data storage.
- Must work as static files on Vercel and when opened from disk. Relative paths only.
- Each design is self-contained: its own `index.html`, `style.css`, `script.js`, plus a "← Home Brew gallery" link to `../../index.html`.
- Keep café facts (name, address, hours, menu, prices) consistent across designs.
- Respect `prefers-reduced-motion`; work on mobile.

## Gallery
- Entries live in `js/entries.js`. When a design is built, set its `status`, `date` and `path`.
- Never write the `result` or `ledTo` fields. Those are my own reflections.

## Working style
- Build one design at a time and open it so I can review before moving on.
- Keep replies short. Don't add features I didn't ask for.
- Commit small and often with messages that explain the design decision, since the commit history is part of the iteration story. Don't push unless I ask.
- Update this file when I say so.
