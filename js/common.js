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

const ICONS = { knife: "🔪", gloves: "🧤", pistol: "🔫", rifle: "🎯", sniper: "🔭", smg: "💥", heavy: "💣" };

const BASE_SKINS = [
  ["sand-dune", "P250", "Песчаная дюна", "consumer", 3, "pistol"],
  ["safari-mesh", "MP9", "Сафари", "consumer", 4, "smg"],
  ["forest-ddpat", "Nova", "Лесной DDPAT", "consumer", 5, "heavy"],
  ["urban-ddpat", "MAC-10", "Городской DDPAT", "industrial", 9, "smg"],
  ["blue-laminate", "Glock-18", "Синий ламинат", "industrial", 14, "pistol"],
  ["boreal", "SSG 08", "Бореальный лес", "industrial", 18, "sniper"],
  ["elite-build", "AK-47", "Элитное снаряжение", "milspec", 35, "rifle"],
  ["guardian", "USP-S", "Страж", "milspec", 48, "pistol"],
  ["desert-storm", "M4A4", "Пустынная буря", "milspec", 60, "rifle"],
  ["water-elemental", "Glock-18", "Водная стихия", "restricted", 120, "pistol"],
  ["cyrex", "M4A1-S", "Сайрекс", "restricted", 160, "rifle"],
  ["redline", "AK-47", "Красная линия", "restricted", 210, "rifle"],
  ["hyper-beast", "AWP", "Скоростной зверь", "classified", 420, "sniper"],
  ["neo-noir", "USP-S", "Неонуар", "classified", 520, "pistol"],
  ["asiimov", "M4A4", "Азимов", "classified", 780, "rifle"],
  ["vulcan", "AK-47", "Вулкан", "covert", 1450, "rifle"],
  ["asiimov-awp", "AWP", "Азимов", "covert", 1900, "sniper"],
  ["fire-serpent", "AK-47", "Огненный змей", "covert", 4200, "rifle"],
  ["howl", "M4A4", "Вой", "covert", 9500, "rifle"],
  ["dragon-lore", "AWP", "Драконья легенда", "covert", 18000, "sniper"],
  ["karambit-doppler", "Керамбит", "Доплер", "gold", 7800, "knife"],
  ["butterfly-fade", "Нож-бабочка", "Градиент", "gold", 12500, "knife"],
  ["m9-crimson", "M9 Bayonet", "Кровавая паутина", "gold", 6400, "knife"],
  ["sport-vice", "Спортивные перчатки", "Порок", "gold", 9900, "gloves"],
  ["driver-king", "Водительские перчатки", "Король змей", "gold", 3100, "gloves"],
].map(([id, weapon, name, rarity, price, type]) => ({ id, weapon, name, rarity, price, type }));

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
    <div class="ico">${ICONS[skin.type] || "🎁"}</div>
    <div class="w">${esc(skin.weapon)}</div>
    <div class="n">${esc(skin.name)}</div>
    <div class="p">${fmt(skin.price)} ₽</div>
    ${extra}
  </div>`;
}

// ---------- UI ----------

const PAGES = [
  ["index.html", "Главная"],
  ["upgrader.html", "Апгрейдер"],
  ["cases.html", "Кейсы"],
  ["crash.html", "Краш"],
  ["roulette.html", "Рулетка"],
  ["coinflip.html", "Монетка"],
  ["mines.html", "Мины"],
  ["inventory.html", "Инвентарь"],
  ["admin.html", "Админка"],
];

function renderLayout() {
  const current = location.pathname.split("/").pop() || "index.html";
  const nav = PAGES.map(([href, title]) =>
    `<a href="${href}" class="${href === current ? "active" : ""}">${title}</a>`).join("");

  document.body.insertAdjacentHTML("afterbegin", `
    <header class="header">
      <a class="logo" href="index.html">JOMIK<span>.FUN</span></a>
      <nav class="nav">${nav}</nav>
      <div class="balance"><span class="coin">●</span><span id="balance"></span> ₽</div>
    </header>
    <div class="disclaimer">
      ⚠️ <b>Это только фановая версия.</b> Скины и баланс виртуальные —
      <b>вывести их нельзя</b>, пополнить реальными деньгами тоже нельзя. Просто для развлечения.
    </div>`);

  document.body.insertAdjacentHTML("beforeend", `
    <footer class="footer">
      JOMIK.FUN — фан-проект без реальных денег. Все предметы ненастоящие и не выводятся.
      Прогресс хранится только в этом браузере.
    </footer>
    <div class="toasts" id="toasts"></div>`);

  renderBalance();
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
