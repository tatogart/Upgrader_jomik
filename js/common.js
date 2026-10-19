// Общие данные и состояние для всех страниц.
// Всё хранится только в localStorage браузера: баланс и скины виртуальные.

const RARITIES = {
  consumer:   { name: "Ширпотреб",       color: "#b0c3d9" },
  industrial: { name: "Промышленное",    color: "#5e98d9" },
  milspec:    { name: "Армейское",       color: "#4b69ff" },
  restricted: { name: "Запрещённое",     color: "#8847ff" },
  classified: { name: "Засекреченное",   color: "#d32ce6" },
  covert:     { name: "Тайное",          color: "#eb4b4b" },
  gold:       { name: "Редкий предмет",  color: "#e4ae39" },
};

// id, оружие, название, редкость, цена, тип силуэта, цвет 1, цвет 2, узор
const BASE_SKINS = [
  // Ширпотреб
  ["sand-dune", "P250", "Песчаная дюна", "consumer", 3, "pistol", "#c9ad7c", "#7a6444", "solid"],
  ["safari-mesh", "MP9", "Сафари", "consumer", 4, "smg", "#a3a374", "#55553a", "camo"],
  ["forest-ddpat", "Nova", "Лесной DDPAT", "consumer", 5, "shotgun", "#58784a", "#26361e", "camo"],
  ["boreal-ump", "UMP-45", "Хвойный лес", "consumer", 3.5, "smg", "#46684a", "#1c2c1e", "camo"],
  ["groundwater-tec", "Tec-9", "Грунтовые воды", "consumer", 4, "pistol", "#679090", "#2b4242", "stripes"],
  ["sage-spray", "G3SG1", "Полынь", "consumer", 6, "sniper", "#97a684", "#4e5742", "dots"],
  ["contractor-m249", "M249", "Подрядчик", "consumer", 5, "heavy", "#857a66", "#40392f", "solid"],
  ["night-ops-p2000", "P2000", "Ночные операции", "consumer", 3, "pistol", "#4a5060", "#1a1d24", "solid"],
  ["storm-mag7", "MAG-7", "Буря", "consumer", 4, "shotgun", "#7b8c9c", "#36414c", "stripes"],
  // Промышленное
  ["urban-ddpat", "MAC-10", "Городской DDPAT", "industrial", 9, "smg", "#9aa0aa", "#454852", "camo"],
  ["blue-laminate", "Glock-18", "Синий ламинат", "industrial", 14, "pistol", "#4a7ef0", "#1a3378", "stripes"],
  ["boreal", "SSG 08", "Бореальный лес", "industrial", 18, "sniper", "#567a56", "#243424", "camo"],
  ["tornado-famas", "FAMAS", "Торнадо", "industrial", 11, "rifle", "#9ab2c4", "#465662", "stripes"],
  ["bright-water-m4", "M4A1-S", "Чистая вода", "industrial", 22, "rifle", "#3fb4e0", "#15506e", "fade"],
  ["amber-fade-p2000", "P2000", "Янтарный градиент", "industrial", 16, "pistol", "#ffc23a", "#a3400c", "fade"],
  ["copper-galaxy", "Galil AR", "Медная галактика", "industrial", 12, "rifle", "#c98040", "#4e2a12", "dots"],
  ["nuclear-xm", "XM1014", "Ядерные отходы", "industrial", 10, "shotgun", "#a8e04a", "#2f4c0c", "hex"],
  // Армейское
  ["elite-build", "AK-47", "Элитное снаряжение", "milspec", 35, "rifle", "#4a80f0", "#dfe3ea", "stripes"],
  ["guardian", "USP-S", "Страж", "milspec", 48, "pistol", "#3f62e6", "#c8d0de", "solid"],
  ["desert-storm", "M4A4", "Пустынная буря", "milspec", 60, "rifle", "#d6ae6a", "#62492a", "camo"],
  ["dragon-tattoo-glock", "Glock-18", "Татуировка дракона", "milspec", 40, "pistol", "#e24a24", "#3e0e0e", "dots"],
  ["trigon-p90", "P90", "Тригон", "milspec", 32, "smg", "#eceef2", "#c83434", "stripes"],
  ["pulse-mp7", "MP7", "Импульс", "milspec", 38, "smg", "#2ed8ff", "#0e3448", "stripes"],
  ["seasons-xm", "XM1014", "Времена года", "milspec", 45, "shotgun", "#e0852f", "#356a2e", "fade"],
  ["neon-ride-mac", "MAC-10", "Неоновая поездка", "milspec", 55, "smg", "#ff3db8", "#4014ff", "fade"],
  ["crimson-web-deagle", "Desert Eagle", "Кровавая паутина", "milspec", 75, "deagle", "#c21c1c", "#2a0606", "hex"],
  // Запрещённое
  ["water-elemental", "Glock-18", "Водная стихия", "restricted", 120, "pistol", "#2fbcf0", "#e0402e", "fade"],
  ["cyrex", "M4A1-S", "Сайрекс", "restricted", 160, "rifle", "#eef0f4", "#d42222", "stripes"],
  ["redline", "AK-47", "Красная линия", "restricted", 210, "rifle", "#262626", "#d61c1c", "stripes"],
  ["kill-confirmed", "USP-S", "Подтверждённое убийство", "restricted", 290, "pistol", "#2c2c2c", "#e8aa34", "stripes"],
  ["blaze", "Desert Eagle", "Пламя", "restricted", 340, "deagle", "#ffbe2a", "#e01e10", "fade"],
  ["starlight-mp9", "MP9", "Звёздный свет", "restricted", 140, "smg", "#8a66ff", "#160e4a", "dots"],
  ["frontside-misty", "AK-47", "Туманный фронт", "restricted", 180, "rifle", "#74bcea", "#26283a", "fade"],
  ["the-traitor", "USP-S", "Предатель", "restricted", 150, "pistol", "#ecca44", "#2c2c2c", "solid"],
  ["fever-dream", "SSG 08", "Лихорадка", "restricted", 115, "sniper", "#ff60d4", "#2aa8ff", "fade"],
  ["atheris", "AWP", "Атерис", "restricted", 130, "sniper", "#80dca8", "#163626", "hex"],
  // Засекреченное
  ["hyper-beast", "AWP", "Скоростной зверь", "classified", 420, "sniper", "#40dc74", "#b23ed8", "fade"],
  ["neo-noir", "USP-S", "Неонуар", "classified", 520, "pistol", "#ff4646", "#262626", "stripes"],
  ["asiimov", "M4A4", "Азимов", "classified", 780, "rifle", "#f4f4f4", "#ff6e1c", "solid"],
  ["printstream-deagle", "Desert Eagle", "Принтстрим", "classified", 690, "deagle", "#f6f6f6", "#161616", "stripes"],
  ["neon-revolution", "AK-47", "Неоновая революция", "classified", 610, "rifle", "#2effa0", "#ff2ea0", "fade"],
  ["bloodsport", "AK-47", "Кровавый спорт", "classified", 880, "rifle", "#e42424", "#161616", "hex"],
  ["nightmare-m4", "M4A1-S", "Кошмар", "classified", 450, "rifle", "#7442c0", "#0e0e0e", "dots"],
  ["code-red-deagle", "Desert Eagle", "Код красный", "classified", 980, "deagle", "#d82424", "#f2f2f2", "stripes"],
  ["mortis", "AWP", "Мортис", "classified", 480, "sniper", "#a4a4dc", "#262646", "camo"],
  ["negev-power", "Negev", "Сила", "classified", 400, "heavy", "#ff9020", "#161616", "stripes"],
  ["sawed-off-kiss", "Sawed-Off", "Поцелуй любви", "classified", 430, "shotgun", "#ff5a8a", "#3a0a1e", "dots"],
  // Тайное
  ["fade-glock", "Glock-18", "Градиент", "covert", 2100, "pistol", "#ffd640", "#c636ff", "fade"],
  ["vulcan", "AK-47", "Вулкан", "covert", 1450, "rifle", "#2e90e0", "#f2f2f2", "stripes"],
  ["printstream-m4", "M4A1-S", "Принтстрим", "covert", 1600, "rifle", "#f6f6f6", "#161616", "stripes"],
  ["asiimov-awp", "AWP", "Азимов", "covert", 1900, "sniper", "#f4f4f4", "#ff6e1c", "solid"],
  ["fire-serpent", "AK-47", "Огненный змей", "covert", 4200, "rifle", "#3e823e", "#d8a824", "hex"],
  ["howl", "M4A4", "Вой", "covert", 9500, "rifle", "#e83412", "#f4a824", "fade"],
  ["wild-lotus", "AK-47", "Дикий лотос", "covert", 11000, "rifle", "#2c7050", "#e6d6a6", "dots"],
  ["medusa", "AWP", "Медуза", "covert", 13000, "sniper", "#40aa78", "#c8a856", "hex"],
  ["gungnir", "AWP", "Гунгнир", "covert", 14500, "sniper", "#2e60b8", "#e8c858", "stripes"],
  ["dragon-lore", "AWP", "Драконья легенда", "covert", 18000, "sniper", "#e8c878", "#3c923c", "hex"],
  // Ножи и перчатки
  ["hand-wraps", "Обмотки рук", "Скиталец", "gold", 2600, "gloves", "#ac8456", "#3a2a1a", "camo"],
  ["driver-king", "Водительские перчатки", "Король змей", "gold", 3100, "gloves", "#45682e", "#c8c864", "hex"],
  ["bayonet-tiger", "Штык-нож", "Зуб тигра", "gold", 4200, "knife", "#ffaa22", "#a83c10", "stripes"],
  ["moto-pois", "Мотоперчатки", "Пои", "gold", 4900, "gloves", "#ff8020", "#262626", "stripes"],
  ["talon-slaughter", "Коготь", "Убийство", "gold", 5600, "karambit", "#e64464", "#f4a8a8", "dots"],
  ["m9-crimson", "M9 Bayonet", "Кровавая паутина", "gold", 6400, "knife", "#c21c1c", "#2a0606", "hex"],
  ["specialist-crimson", "Перчатки специалиста", "Багровое кимоно", "gold", 7200, "gloves", "#d82424", "#260808", "hex"],
  ["karambit-doppler", "Керамбит", "Доплер", "gold", 7800, "karambit", "#c840ff", "#2a0a52", "fade"],
  ["skeleton-case", "Скелетный нож", "Закалка", "gold", 8800, "knife", "#3e70d8", "#d8a844", "fade"],
  ["sport-vice", "Спортивные перчатки", "Порок", "gold", 9900, "gloves", "#ff4ed6", "#2ed8ff", "fade"],
  ["butterfly-fade", "Нож-бабочка", "Градиент", "gold", 12500, "knife", "#ffd640", "#c636ff", "fade"],
  ["karambit-lore", "Керамбит", "Легенда", "gold", 15000, "karambit", "#e8c878", "#3c923c", "hex"],
  ["karambit-gamma", "Керамбит", "Гамма-доплер", "gold", 21000, "karambit", "#30ff80", "#0a3a2a", "fade"],
  ["karambit-ruby", "Керамбит", "Рубин", "gold", 28000, "karambit", "#ff2444", "#560010", "fade"],
  ["butterfly-sapphire", "Нож-бабочка", "Сапфир", "gold", 32000, "knife", "#2e60ff", "#0a1a6a", "fade"],
].map(([id, weapon, name, rarity, price, type, c1, c2, pattern]) => ({ id, weapon, name, rarity, price, type, c1, c2, pattern }));

const DEFAULT_SETTINGS = {
  startBalance: 1000,
  edge: { upgrader: 5, cases: 10, crash: 4, coinflip: 4, mines: 3 },
  upgraderBoost: 0,     // добавка к шансу апгрейда в процентных пунктах
  maxUpgradeChance: 90, // максимальный шанс апгрейда
  customSkins: [],
};

const LS_KEY = "jomik_state_v1";
const LS_SETTINGS = "jomik_settings_v1";

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function saveJSON(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* приватный режим */ }
}

const Store = {
  settings: null,
  state: null,

  init() {
    const s = loadJSON(LS_SETTINGS, {});
    this.settings = { ...DEFAULT_SETTINGS, ...s, edge: { ...DEFAULT_SETTINGS.edge, ...(s.edge || {}) } };
    this.state = loadJSON(LS_KEY, null) || this.freshState();
  },

  freshState() {
    return { balance: this.settings.startBalance, inventory: [], log: [], nextUid: 1 };
  },

  save() {
    saveJSON(LS_KEY, this.state);
    renderBalance();
  },

  saveSettings() {
    saveJSON(LS_SETTINGS, this.settings);
  },

  get balance() { return this.state.balance; },

  setBalance(v) {
    this.state.balance = round2(Math.max(0, v));
    this.save();
  },

  addBalance(v) { this.setBalance(this.state.balance + v); },

  // Списывает ставку; возвращает false, если денег не хватает
  take(v) {
    if (!(v > 0) || v > this.state.balance + 1e-9) return false;
    this.setBalance(this.state.balance - v);
    return true;
  },

  addSkin(skinId) {
    const item = { uid: this.state.nextUid++, skinId };
    this.state.inventory.unshift(item);
    this.save();
    if (typeof pushLiveDrop === "function") pushLiveDrop(skinById(skinId), "Ты", true);
    return item;
  },

  removeItem(uid) {
    this.state.inventory = this.state.inventory.filter(i => i.uid !== uid);
    this.save();
  },

  log(text) {
    this.state.log.unshift({ t: Date.now(), text });
    this.state.log = this.state.log.slice(0, 100);
    this.save();
  },

  resetAll() {
    localStorage.removeItem(LS_KEY);
    localStorage.removeItem(LS_SETTINGS);
    this.init();
    this.save();
  },
};

function allSkins() {
  return BASE_SKINS.concat(Store.settings.customSkins || []);
}

function skinById(id) {
  return allSkins().find(s => s.id === id);
}

function inventoryItems() {
  return Store.state.inventory
    .map(i => ({ ...i, skin: skinById(i.skinId) }))
    .filter(i => i.skin);
}

function round2(v) { return Math.round(v * 100) / 100; }

function fmt(v) {
  return Number(v).toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function skinHTML(skin, extra = "", cls = "") {
  const r = RARITIES[skin.rarity] || RARITIES.consumer;
  return `<div class="skin ${cls}" style="--rc:${r.color}" title="${esc(skin.weapon)} | ${esc(skin.name)} — ${esc(r.name)}">
    <div class="ico">${skinIcon(skin)}</div>
    <div class="w">${esc(skin.weapon)}</div>
    <div class="n">${esc(skin.name)}</div>
    <div class="p">${fmt(skin.price)} ₽</div>
    ${extra}
  </div>`;
}

// ---------- UI ----------

const PAGES = [
  ["index.html", "Главная", "🏠"],
  ["upgrader.html", "Апгрейдер", "⬆️"],
  ["cases.html", "Кейсы", "📦"],
  ["crash.html", "Краш", "🚀"],
  ["roulette.html", "Рулетка", "🎡"],
  ["coinflip.html", "Монетка", "🪙"],
  ["mines.html", "Мины", "💎"],
  ["inventory.html", "Инвентарь", "🎒"],
  ["admin.html", "Админка", "🛠️"],
];

const BOT_NAMES = ["s1mple_fan", "kotik228", "AWPer", "jomik", "noob_master", "headshot", "zxc_ghoul",
  "ricardo", "pro100vasya", "luckyboy", "sniper_kz", "clutch_king", "dimon", "ez_win", "flick"];

function renderLayout() {
  const current = location.pathname.split("/").pop() || "index.html";
  const nav = PAGES.map(([href, title, icon]) =>
    `<a href="${href}" class="${href === current ? "active" : ""}"><span class="ni">${icon}</span>${title}</a>`).join("");

  document.body.insertAdjacentHTML("afterbegin", `
    <header class="header">
      <a class="logo" href="index.html"><span class="logo-mark">J</span><span class="logo-text">JOMIK<span>.FUN</span></span></a>
      <nav class="nav">${nav}</nav>
      <div class="balance">
        <span class="coin">₽</span><span id="balance"></span>
        <a class="plus" href="admin.html" title="Пополнить в админке">+</a>
      </div>
    </header>
    <div class="disclaimer">
      ⚠️ <b>Это только фановая версия.</b> Скины и баланс виртуальные —
      <b>вывести их нельзя</b>, пополнить реальными деньгами тоже нельзя. Просто для развлечения.
    </div>
    <div class="live">
      <div class="live-label"><span class="dot"></span>LIVE</div>
      <div class="live-track" id="liveTrack"></div>
    </div>`);

  document.body.insertAdjacentHTML("beforeend", `
    <footer class="footer">
      <div class="logo" style="justify-content:center"><span class="logo-mark">J</span><span class="logo-text">JOMIK<span>.FUN</span></span></div>
      <p>Фан-проект без реальных денег. Все предметы ненастоящие и не выводятся.
      Прогресс хранится только в этом браузере.</p>
    </footer>
    <div class="toasts" id="toasts"></div>`);

  renderBalance();
  initLiveFeed();
}

// Лента выпадений: случайные «игроки» + твои настоящие дропы
function liveItemHTML(skin, who, mine) {
  const r = RARITIES[skin.rarity] || RARITIES.consumer;
  return `<div class="live-item ${mine ? "mine" : ""}" style="--rc:${r.color}" title="${esc(skin.weapon)} | ${esc(skin.name)}">
    <div class="ico">${skinIcon(skin)}</div>
    <div class="li-text"><div class="w">${esc(who)}</div><div class="n">${esc(skin.name)}</div></div>
  </div>`;
}

function pushLiveDrop(skin, who, mine) {
  const track = document.getElementById("liveTrack");
  if (!track || !skin) return;
  track.insertAdjacentHTML("afterbegin", liveItemHTML(skin, who, mine));
  while (track.children.length > 24) track.lastElementChild.remove();
}

function randomDrop() {
  const skins = allSkins();
  const weights = skins.map(s => 1 / Math.sqrt(s.price));
  let r = Math.random() * weights.reduce((a, b) => a + b, 0);
  for (let i = 0; i < skins.length; i++) { r -= weights[i]; if (r <= 0) return skins[i]; }
  return skins[0];
}

function initLiveFeed() {
  for (let i = 0; i < 16; i++) pushLiveDrop(randomDrop(), BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)]);
  setInterval(() => pushLiveDrop(randomDrop(), BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)]),
    2500 + Math.random() * 2000);
}

function renderBalance() {
  const el = document.getElementById("balance");
  if (el) el.textContent = fmt(Store.balance);
}

function toast(text, kind = "") {
  const box = document.getElementById("toasts");
  if (!box) return;
  const t = document.createElement("div");
  t.className = "toast " + kind;
  t.textContent = text;
  box.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}

function modal(html) {
  const bg = document.createElement("div");
  bg.className = "modal-bg";
  bg.innerHTML = `<div class="modal">${html}<div class="row" style="justify-content:center;margin-top:14px">
    <button class="btn btn-accent" data-close>Ок</button></div></div>`;
  bg.addEventListener("click", e => {
    if (e.target === bg || e.target.hasAttribute("data-close")) bg.remove();
  });
  document.body.appendChild(bg);
  return bg;
}

function showWithdrawBlocked() {
  modal(`<h2>🚫 Вывод недоступен</h2>
    <p class="muted">Это фановая версия апгрейдера. Скины виртуальные и не существуют в Steam,
    поэтому вывести их нельзя. Играйте просто ради интереса!</p>`);
}

// Чтение суммы ставки из инпута
function readBet(input) {
  const v = round2(parseFloat(String(input.value).replace(",", ".")));
  if (!(v > 0)) { toast("Введите ставку больше нуля", "lose"); return null; }
  if (v > Store.balance) { toast("Недостаточно средств. Пополните баланс в админке 😉", "lose"); return null; }
  return v;
}

// Кнопки ½, ×2, макс рядом со ставкой
function bindBetChips(input, container) {
  container.innerHTML = `
    <button class="btn btn-sm" data-a="half">½</button>
    <button class="btn btn-sm" data-a="double">×2</button>
    <button class="btn btn-sm" data-a="10">+10</button>
    <button class="btn btn-sm" data-a="100">+100</button>
    <button class="btn btn-sm" data-a="max">Макс</button>`;
  container.addEventListener("click", e => {
    const a = e.target.dataset.a;
    if (!a) return;
    let v = parseFloat(input.value) || 0;
    if (a === "half") v = v / 2;
    else if (a === "double") v = v * 2;
    else if (a === "max") v = Store.balance;
    else v += Number(a);
    input.value = round2(Math.min(v, Store.balance));
  });
}

Store.init();
renderLayout(); // скрипт подключается в конце body
