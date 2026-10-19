// SVG-иконки скинов: силуэт оружия, окрашенный в цвета скина, с узором и бликом.

const WEAPON_TYPES = {
  pistol:   "Пистолет",
  deagle:   "Desert Eagle",
  rifle:    "Винтовка",
  smg:      "Пистолет-пулемёт",
  sniper:   "Снайперская винтовка",
  shotgun:  "Дробовик",
  heavy:    "Пулемёт",
  knife:    "Нож",
  karambit: "Керамбит",
  gloves:   "Перчатки",
};

const PATTERNS = { solid: "Однотонный", fade: "Градиент", stripes: "Полосы", camo: "Камуфляж", dots: "Точки", hex: "Соты" };

// Силуэты в координатах viewBox 0 0 128 48
const SHAPES = {
  pistol:
    "M30 14 L96 14 L99 16 L99 23 L62 23 L60 28 L52 28 L53 23 L50 23 L46 40 Q45 42 43 42 L35 42 Q33 42 33.5 40 L38 23 L30 23 Z",
  deagle:
    "M22 11 L104 11 L107 13 L107 22 L64 22 L62 28 L53 28 L53 22 L49 22 L44 42 Q43 44 41 44 L30 44 Q28 44 28.5 42 L34 22 L22 22 Z M30 9 L36 9 L36 11 L30 11 Z",
  rifle:
    "M2 17 L26 15 L30 13 L86 13 L88 15 L110 15 L110 12 L113 12 L113 15 L126 15 L126 19 L88 19 L86 22 L76 22 L80 30 L76 41 L67 38 L70 30 L66 22 L54 22 L50 34 Q49 35 47 35 L41 35 Q40 35 40.5 33 L44 22 L32 22 L6 31 L2 31 Z",
  smg:
    "M8 18 L22 16 L26 14 L88 14 L90 16 L106 16 L106 20 L90 20 L88 23 L64 23 L66 41 L57 41 L56 23 L52 23 L48 35 L40 35 L42 23 L28 23 L11 27 L8 27 Z",
  sniper:
    "M2 18 L10 16 L30 16 L36 20 L80 20 L82 18 L126 18 L126 21 L82 21 L80 24 L66 24 L66 32 L58 32 L58 24 L50 24 L46 34 L38 34 L40 25 L30 25 L10 31 L2 31 Z " +
    "M40 9 L46 7 L74 7 L80 9 L80 15 L74 13 L46 13 L40 15 Z M54 13 L58 13 L58 20 L54 20 Z M66 13 L70 13 L70 20 L66 20 Z",
  shotgun:
    "M2 18 L24 16 L28 14 L72 14 L74 15 L125 15 L125 19 L74 19 L74 21 L119 21 L119 24 L72 24 L70 23 L50 23 L46 34 L38 34 L40 23 L28 23 L6 30 L2 30 Z M84 19 L108 19 L108 28 L84 28 Z",
  heavy:
    "M2 16 L22 14 L28 12 L86 12 L88 14 L125 14 L125 18 L88 18 L86 22 L72 22 L72 37 L52 37 L52 22 L48 22 L44 34 L36 34 L38 22 L28 22 L6 28 L2 28 Z " +
    "M100 18 L103 18 L111 33 L108 33 Z M106 18 L109 18 L101 33 L98 33 Z",
  knife:
    "M48 19 L106 16 Q120 17 126 22 Q112 28 48 29 Z M42 13 L49 13 L49 35 L42 35 Z M10 19.5 Q4 24 10 28.5 L42 29 L42 19 Z",
  karambit:
    "M56 21 Q90 4 120 9 Q102 13 88 22 Q75 31 58 33 Z M14 29 L57 21 L59 33 L18 40 Z " +
    "M8 33 A7 7 0 1 0 22 33 A7 7 0 1 0 8 33 Z M11 33 A4 4 0 1 1 19 33 A4 4 0 1 1 11 33 Z",
  gloves:
    "M44 40 L43 24 L41 11 Q41 6 45.5 6 Q50 6 50 11 L51.5 22 L52 6 Q52 2 56 2 Q60 2 60 6 L60.5 22 L62 7 Q62.5 3 66.5 3 Q70.5 3.5 70 8 L69 23 L72 12 Q73 8 77 9 Q80.5 10 79.5 14 L76 30 L84 24 Q88 21 90.5 24.5 Q92 28 88.5 31 L77 41 Z " +
    "M41 40 L79 40 L79 47 L41 47 Z",
};

let iconDefs = null;
const iconDefsDone = new Set();

// Общие <defs> для всех иконок на странице (узоры, блик, градиенты скинов)
function getIconDefs() {
  if (iconDefs) return iconDefs;
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("aria-hidden", "true");
  svg.style.cssText = "position:absolute;width:0;height:0;overflow:hidden";
  svg.innerHTML = `<defs>
    <linearGradient id="ic-shine" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity=".45"/>
      <stop offset=".45" stop-color="#fff" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity=".35"/>
    </linearGradient>
    <pattern id="ic-stripes" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(40)">
      <rect width="3" height="7" fill="#fff" fill-opacity=".22"/>
    </pattern>
    <pattern id="ic-camo" width="28" height="18" patternUnits="userSpaceOnUse">
      <ellipse cx="6" cy="5" rx="6" ry="3.5" fill="#000" fill-opacity=".28"/>
      <ellipse cx="20" cy="12" rx="7" ry="4" fill="#000" fill-opacity=".22"/>
      <ellipse cx="14" cy="3" rx="4" ry="2.5" fill="#fff" fill-opacity=".15"/>
      <ellipse cx="4" cy="15" rx="4" ry="2.5" fill="#fff" fill-opacity=".12"/>
    </pattern>
    <pattern id="ic-dots" width="5" height="5" patternUnits="userSpaceOnUse">
      <circle cx="2.5" cy="2.5" r="1.1" fill="#fff" fill-opacity=".3"/>
    </pattern>
    <pattern id="ic-hex" width="9" height="15.6" patternUnits="userSpaceOnUse">
      <path d="M4.5 0 L9 2.6 L9 7.8 L4.5 10.4 L0 7.8 L0 2.6 Z M4.5 10.4 L4.5 15.6" fill="none" stroke="#000" stroke-opacity=".35" stroke-width=".8"/>
    </pattern>
  </defs>`;
  document.body.appendChild(svg);
  iconDefs = svg.querySelector("defs");
  return iconDefs;
}

function skinColors(skin) {
  const base = (RARITIES[skin.rarity] || RARITIES.consumer).color;
  const ok = c => typeof c === "string" && /^#[0-9a-f]{3,8}$/i.test(c);
  return [ok(skin.c1) ? skin.c1 : base, ok(skin.c2) ? skin.c2 : "#1d2132"];
}

function iconGradId(skin) {
  return "ic-g-" + String(skin.id).replace(/[^a-zA-Z0-9_-]/g, "_");
}

function ensureSkinGradient(skin) {
  const id = iconGradId(skin);
  const [c1, c2] = skinColors(skin);
  const key = id + c1 + c2;
  if (iconDefsDone.has(key)) return id;
  iconDefsDone.add(key);
  const defs = getIconDefs();
  const old = defs.querySelector("#" + id);
  if (old) old.remove();
  defs.insertAdjacentHTML("beforeend", `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2=".35">
    <stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>`);
  return id;
}

function skinIcon(skin) {
  const d = SHAPES[skin.type] || SHAPES.rifle;
  const grad = ensureSkinGradient(skin);
  const pat = PATTERNS[skin.pattern] && !["solid", "fade"].includes(skin.pattern)
    ? `<path d="${d}" fill="url(#ic-${skin.pattern})" fill-rule="evenodd"/>` : "";
  return `<svg class="wicon" viewBox="0 0 128 48" xmlns="http://www.w3.org/2000/svg">
    <path d="${d}" fill="url(#${grad})" fill-rule="evenodd" stroke="#06070c" stroke-width="1.4" stroke-linejoin="round"/>
    ${pat}
    <path d="${d}" fill="url(#ic-shine)" fill-rule="evenodd"/>
  </svg>`;
}
