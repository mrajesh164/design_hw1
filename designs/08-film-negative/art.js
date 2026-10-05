// One flat illustration per menu item, drawn as inline SVG on a 220 x 110 canvas.
const shadow = (cx, rx) => `<ellipse cx="${cx}" cy="94" rx="${rx}" ry="5" fill="rgba(0,0,0,.18)"/>`;
const steam = (cx, top) => `<g fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".8">
  <path d="M${cx - 10} ${top + 30} q-6 -8 0 -14 t0 -14"/><path d="M${cx} ${top + 32} q-6 -8 0 -14 t0 -14"/><path d="M${cx + 10} ${top + 30} q-6 -8 0 -14 t0 -14"/></g>`;
const glass = (d) => `<path d="${d}" fill="rgba(255,255,255,.55)" stroke="#9db0b3" stroke-width="2"/>`;
const ice = (x, y, r = -12) => `<rect x="${x}" y="${y}" width="13" height="13" rx="2" fill="rgba(255,255,255,.6)" stroke="rgba(255,255,255,.9)" transform="rotate(${r} ${x + 6} ${y + 6})"/>`;
const star = (x, y, c = "#ffd45e") => `<path d="M${x} ${y - 7} l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" fill="${c}"/>`;
const handle = (x, y, c = "#f4f1ea") => `<path d="M${x} ${y} q18 0 16 14 q-2 12 -16 12" fill="none" stroke="${c}" stroke-width="7" stroke-linecap="round"/>`;

const ART = {
  "The Final Girl": () => `${shadow(110, 36)}
    <path d="M82 46 H138 V80 Q138 92 126 92 H94 Q82 92 82 80 Z" fill="#f4f1ea"/>
    <ellipse cx="110" cy="46" rx="28" ry="6" fill="#2b1a12"/>${handle(138, 54)}${steam(110, 6)}
    <path d="M96 70 l8 -6 8 6 8 -6" fill="none" stroke="#b3341f" stroke-width="3" stroke-linecap="round"/>`,

  "Basement Cold Brew": () => `${shadow(110, 26)}
    ${glass("M88 20 H132 L128 92 H92 Z")}
    <path d="M90 34 H130 L127.6 90 H92.4 Z" fill="#3a2214"/>
    ${ice(96, 40)}${ice(112, 52, 10)}${ice(100, 66, -6)}
    <path d="M120 8 L112 70" stroke="#e5484d" stroke-width="4" stroke-linecap="round"/>`,

  "The Call Is Coming From Inside": () => `${shadow(110, 26)}
    ${glass("M90 28 H130 L127 92 H93 Z")}
    <path d="M91.5 38 H128.5 L127 90 H93 Z" fill="#c8361b"/>
    <path d="M91.5 38 H128.5 L128.2 52 H91.8 Z" fill="#e8592b" opacity=".75"/>
    <circle cx="134" cy="28" r="13" fill="#f28a1e"/><circle cx="134" cy="28" r="10" fill="#ffb347"/>
    <path d="M134 18 V38 M124 28 H144 M127 21 L141 35 M141 21 L127 35" stroke="#f28a1e" stroke-width="1.5"/>
    <g fill="#fff" opacity=".75"><circle cx="104" cy="62" r="2.5"/><circle cx="116" cy="72" r="2"/><circle cx="110" cy="52" r="2"/><circle cx="120" cy="60" r="2.5"/></g>`,

  "Warp Drive": (n) => `${shadow(110, 26)}
    <clipPath id="c${n}"><path d="M90 24 H130 L127.6 90 H92.4 Z"/></clipPath>
    ${glass("M88 20 H132 L128 92 H92 Z")}
    <g clip-path="url(#c${n})"><rect x="80" y="24" width="60" height="18" fill="#2a1a14"/><rect x="80" y="42" width="60" height="22" fill="#7a4bd0"/><rect x="80" y="64" width="60" height="30" fill="#2f6bff"/></g>
    ${ice(97, 46)}${ice(112, 58, 8)}
    ${star(66, 34)}${star(156, 28, "#fff")}${star(150, 64)}${star(70, 70, "#fff")}`,

  "First Contact": () => `${shadow(110, 44)}
    <path d="M70 52 H150 Q150 92 110 92 Q70 92 70 52 Z" fill="#e8e1d2"/>
    <ellipse cx="110" cy="52" rx="40" ry="8" fill="#6faa3a"/><ellipse cx="110" cy="51" rx="34" ry="5" fill="#9cd45f"/>
    <path d="M96 93 h28" stroke="#c9bfa8" stroke-width="3"/>
    ${star(88, 28)}${star(112, 20)}${star(136, 30)}${star(124, 40, "#fff")}${star(98, 38, "#fff")}`,

  "Replicant": () => `${shadow(110, 46)}
    <ellipse cx="110" cy="88" rx="44" ry="8" fill="#e8e1d2"/>
    <path d="M84 50 H136 V70 Q136 88 110 88 Q84 88 84 70 Z" fill="#f4f1ea"/>
    <ellipse cx="110" cy="50" rx="26" ry="7" fill="#b8793e"/><ellipse cx="110" cy="50" rx="21" ry="5" fill="#f3e3c6"/>
    <path d="M110 53.5 C104 49.5 105 45.5 108.5 46.5 C109.5 46.8 110 47.6 110 47.6 C110 47.6 110.5 46.8 111.5 46.5 C115 45.5 116 49.5 110 53.5Z" fill="#fff"/>
    ${handle(136, 56)}
    <g fill="#d9b36a"><ellipse cx="54" cy="84" rx="3" ry="6" transform="rotate(-25 54 84)"/><ellipse cx="62" cy="88" rx="3" ry="6" transform="rotate(20 62 88)"/><ellipse cx="168" cy="86" rx="3" ry="6" transform="rotate(30 168 86)"/></g>`,

  "Bitter End": () => `${shadow(62, 24)}${shadow(158, 24)}
    <rect x="102" y="30" width="16" height="50" rx="4" fill="#5b2a14"/><rect x="107" y="16" width="6" height="16" fill="#5b2a14"/><rect x="104" y="44" width="12" height="16" fill="#f0e4cc"/>
    ${[62, 158].map(x => `<ellipse cx="${x}" cy="90" rx="24" ry="5" fill="#e8e1d2"/>
    <path d="M${x - 18} 62 H${x + 18} V74 Q${x + 18} 90 ${x} 90 Q${x - 18} 90 ${x - 18} 74 Z" fill="#f4f1ea"/>
    <ellipse cx="${x}" cy="62" rx="18" ry="4" fill="#2b1a12"/><ellipse cx="${x}" cy="62" rx="14" ry="2.6" fill="#9a6a3a"/>
    <path d="M${x + 18} 66 q10 0 9 8 q-1 6 -9 6" fill="none" stroke="#f4f1ea" stroke-width="5" stroke-linecap="round"/>`).join("")}`,

  "The Long Goodbye": (n) => `${shadow(100, 24)}
    <clipPath id="c${n}"><path d="M94 54 H126 L123.4 90 H96.6 Z"/></clipPath>
    ${glass("M92 52 H128 L125 92 H95 Z")}
    <g clip-path="url(#c${n})"><rect x="90" y="54" width="40" height="16" fill="#3a2214"/><rect x="90" y="70" width="40" height="24" fill="#f0dcc0"/></g>
    <circle cx="160" cy="44" r="20" fill="#fff" stroke="#333" stroke-width="3"/>
    <path d="M160 44 V30 M160 44 L170 50" stroke="#333" stroke-width="3" stroke-linecap="round"/><circle cx="160" cy="44" r="2" fill="#333"/>
    <path d="M52 86 H84" stroke="#aaa" stroke-width="3" stroke-linecap="round"/>`,

  "Femme Fatale": () => `${shadow(110, 26)}
    ${glass("M88 22 H132 L128 92 H92 Z")}
    <path d="M90 34 H130 L127.6 90 H92.4 Z" fill="#b3122f"/><path d="M90 34 H130 L129.4 46 H90.6 Z" fill="#d9304f" opacity=".8"/>
    ${ice(97, 50)}${ice(112, 64, 10)}
    <path d="M102 62 q4 -6 8 -1 q4 -5 8 1 q-8 8 -16 0z" fill="#7a0a1e" opacity=".85"/>
    <g fill="#e02a4a"><circle cx="138" cy="24" r="8"/><circle cx="148" cy="30" r="8"/><circle cx="144" cy="40" r="8"/><circle cx="132" cy="38" r="8"/><circle cx="130" cy="28" r="8"/></g><circle cx="139" cy="31" r="4" fill="#ffd45e"/>`,

  "Meet Cute": () => `${shadow(72, 30)}${shadow(150, 40)}
    <ellipse cx="72" cy="90" rx="30" ry="6" fill="#e8e1d2"/>
    <path d="M52 56 H92 V72 Q92 90 72 90 Q52 90 52 72 Z" fill="#f4f1ea"/>
    <ellipse cx="72" cy="56" rx="20" ry="5" fill="#c9915a"/><ellipse cx="72" cy="56" rx="15" ry="3.5" fill="#f6e8d0"/>
    <path d="M92 62 q10 0 9 8 q-1 6 -9 6" fill="none" stroke="#f4f1ea" stroke-width="5" stroke-linecap="round"/>
    <ellipse cx="150" cy="90" rx="42" ry="8" fill="#fff" stroke="#d9d3c4"/>
    <path d="M122 84 Q124 58 150 54 Q176 58 178 84 Q164 76 150 78 Q136 76 122 84Z" fill="#e2a042"/>
    <path d="M136 60 L134 80 M150 56 V78 M164 60 L166 80" stroke="#b97a22" stroke-width="2" fill="none"/>
    <g stroke="#9a9a9a" stroke-width="2" fill="none" stroke-linecap="round"><path d="M190 90 V66 M186 58 V66 H194 V58"/><path d="M104 96 L96 74"/></g>`,

  "Rainstorm Kiss": () => `${shadow(110, 30)}
    <g fill="#fff" opacity=".95"><circle cx="100" cy="18" r="10"/><circle cx="114" cy="14" r="13"/><circle cx="128" cy="19" r="9"/><rect x="96" y="18" width="36" height="10" rx="5"/></g>
    <path d="M104 36 l-3 8 M114 36 l-3 8 M124 36 l-3 8" stroke="#6fa8dc" stroke-width="2" stroke-linecap="round"/>
    <path d="M84 56 H136 V78 Q136 92 122 92 H98 Q84 92 84 78Z" fill="rgba(255,255,255,.5)" stroke="#d9a3b3" stroke-width="2"/>
    <path d="M86 62 H134 V78 Q134 90 122 90 H98 Q86 90 86 78Z" fill="#f3a8bd"/>
    <ellipse cx="108" cy="60" rx="7" ry="3" fill="#d63a63" transform="rotate(-15 108 60)"/><ellipse cx="120" cy="62" rx="6" ry="3" fill="#e5577d" transform="rotate(20 120 62)"/>
    <path d="M136 64 q14 0 12 10 q-2 8 -12 8" fill="none" stroke="#d9a3b3" stroke-width="5" stroke-linecap="round"/>
    <ellipse cx="62" cy="92" rx="8" ry="4" fill="#d63a63" transform="rotate(-20 62 92)"/><ellipse cx="158" cy="90" rx="8" ry="4" fill="#d63a63" transform="rotate(25 158 90)"/>`,

  "The Grand Gesture": () => `${shadow(90, 32)}
    <ellipse cx="90" cy="90" rx="32" ry="6" fill="#e8e1d2"/>
    <path d="M68 54 H112 V70 Q112 90 90 90 Q68 90 68 70 Z" fill="#f4f1ea"/>
    <ellipse cx="90" cy="54" rx="22" ry="5" fill="#a77fcf"/><ellipse cx="90" cy="54" rx="17" ry="3.5" fill="#d9c1ee"/>
    <path d="M112 60 q12 0 10 9 q-2 7 -10 7" fill="none" stroke="#f4f1ea" stroke-width="5" stroke-linecap="round"/>
    <path d="M132 94 Q130 62 134 28" stroke="#5c7a3a" stroke-width="2.5" fill="none"/>
    <g fill="#8b5fc7"><ellipse cx="131" cy="34" rx="3" ry="6"/><ellipse cx="137" cy="40" rx="3" ry="6"/><ellipse cx="130" cy="46" rx="3" ry="6"/><ellipse cx="137" cy="52" rx="3" ry="6"/><ellipse cx="130" cy="58" rx="3" ry="6"/><ellipse cx="136" cy="64" rx="3" ry="6"/></g>
    <g transform="rotate(8 170 62)"><rect x="150" y="42" width="40" height="38" fill="#fffdf2" stroke="#d9d3c4"/><path d="M156 54 H184 M156 62 H178" stroke="#7a8aa8" stroke-width="2"/><path d="M176 72 c-4 -4 -8 0 -4 4 l4 3 l4 -3 c4 -4 0 -8 -4 -4z" fill="#d63a63"/></g>`,

  "High Noon": () => `${shadow(110, 28)}
    <circle cx="110" cy="46" r="32" fill="#ffd36b" opacity=".85"/>
    <path d="M88 48 H132 L128 90 H92 Z" fill="#b8bec6" stroke="#8c939c" stroke-width="2"/>
    <g fill="#fff" opacity=".7"><circle cx="98" cy="62" r="1.6"/><circle cx="110" cy="70" r="1.6"/><circle cx="120" cy="60" r="1.6"/><circle cx="104" cy="80" r="1.6"/><circle cx="118" cy="78" r="1.6"/></g>
    <ellipse cx="110" cy="48" rx="22" ry="5" fill="#2b1a12" stroke="#8c939c" stroke-width="2"/>
    <path d="M132 58 q16 0 14 14 q-2 10 -14 10" fill="none" stroke="#8c939c" stroke-width="6" stroke-linecap="round"/>${steam(110, 2)}`,

  "The Good, The Bad, and The Oatmeal": () => `
    <rect x="136" y="46" width="70" height="10" rx="5" fill="#2a2a2a"/>
    <circle cx="100" cy="52" r="42" fill="#2a2a2a"/><circle cx="100" cy="52" r="35" fill="#f1e2c0"/>
    <g fill="#3b4ea8"><circle cx="82" cy="38" r="4.5"/><circle cx="91" cy="43" r="4.5"/><circle cx="84" cy="49" r="4.5"/><circle cx="76" cy="44" r="4.5"/></g>
    <g fill="#f6d86a" stroke="#d9b03a" stroke-width="1.5"><circle cx="108" cy="36" r="6"/><circle cx="118" cy="44" r="6"/><circle cx="109" cy="48" r="6"/></g>
    <g fill="#8a5a2b"><ellipse cx="90" cy="68" rx="5" ry="3.5"/><ellipse cx="100" cy="72" rx="5" ry="3.5"/><ellipse cx="111" cy="68" rx="5" ry="3.5"/><ellipse cx="104" cy="62" rx="5" ry="3.5"/></g>`
};
