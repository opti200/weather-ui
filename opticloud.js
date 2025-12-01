// app.js — Weather UI starter (mock data + DOM rendering)
// Module mode so we can use modern features

/* ============
   Mock data (replace with real API later)
   ============ */
const mock = {
  city: "Nairobi",
  date: new Date().toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }),
  current: {
    temp: 21,
    desc: "Cloudy",
    feelsLike: 20,
    icon: "cloud"
  },
  hourly: [
    { time: "Now", temp: 21, icon: "cloud" },
    { time: "10AM", temp: 22, icon: "sun" },
    { time: "11AM", temp: 24, icon: "sun" },
    { time: "12PM", temp: 26, icon: "sun" },
    { time: "1PM", temp: 27, icon: "sun" },
    { time: "2PM", temp: 26, icon: "cloud" },
    { time: "3PM", temp: 25, icon: "rain" }
  ],
  daily: [
    { day: "Mon", hi: 27, lo: 17, icon: "sun" },
    { day: "Tue", hi: 28, lo: 18, icon: "sun" },
    { day: "Wed", hi: 24, lo: 16, icon: "cloud" },
    { day: "Thu", hi: 22, lo: 15, icon: "rain" },
    { day: "Fri", hi: 23, lo: 16, icon: "cloud" },
    { day: "Sat", hi: 25, lo: 17, icon: "sun" },
    { day: "Sun", hi: 26, lo: 18, icon: "sun" }
  ]
};

/* ============
   Utility: simple SVGs for icons
   ============ */
function weatherSvg(name, size = 36) {
  // minimal, clean icons for the preview kit
  switch (name) {
    case "sun":
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>`;
    case "cloud":
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 17.58A4 4 0 0016 14H7a4 4 0 010-8 5 5 0 015 5h1"/></svg>`;
    case "rain":
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M16 13a4 4 0 10-8 0"/><path d="M8 19l0 2M12 19l0 2M16 19l0 2" /></svg>`;
    default:
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24"><circle cx="12" cy="12" r="${size/6}" fill="currentColor"/></svg>`;
  }
}

/* ============
   DOM references
   ============ */
const refs = {
  cityName: document.getElementById("city-name"),
  cityDate: document.getElementById("city-date"),
  tempValue: document.getElementById("temp-value"),
  tempDesc: document.getElementById("temp-desc"),
  feelsLike: document.getElementById("feels-like"),
  weatherIcon: document.getElementById("weather-icon"),
  hourlyList: document.getElementById("hourly-list"),
  dailyList: document.getElementById("daily-list"),
  searchInput: document.getElementById("search-input"),
  searchClear: document.getElementById("search-clear"),
  btnTheme: document.getElementById("btn-theme"),
  btnRefresh: document.getElementById("btn-refresh"),
  navButtons: document.querySelectorAll(".nav-btn")
};

/* ============
   Render functions
   ============ */
function renderHeader(data) {
  refs.cityName.textContent = data.city;
  refs.cityDate.textContent = data.date;
}
function renderCurrent(current) {
  refs.tempValue.textContent = `${current.temp}°`;
  refs.tempDesc.textContent = current.desc;
  refs.feelsLike.textContent = `Feels like ${current.feelsLike}°`;
  refs.weatherIcon.innerHTML = weatherSvg(current.icon, 100);
}
function createHourlyCard(h) {
  const btn = document.createElement("button");
  btn.className = "hour-card";
  btn.type = "button";
  btn.setAttribute("role", "listitem");
  btn.innerHTML = `
    <div class="hour">${h.time}</div>
    <div class="hour-icon">${weatherSvg(h.icon, 28)}</div>
    <div class="hour-temp">${h.temp}°</div>
  `;
  btn.addEventListener("click", ()=> {
    // simple selection behaviour: mark selected and update main temp
    document.querySelectorAll(".hour-card").forEach(c => c.classList.remove("selected"));
    btn.classList.add("selected");
    renderCurrent({ temp: h.temp, desc: `${h.icon[0].toUpperCase() + h.icon.slice(1)}`, feelsLike: h.temp - 1, icon: h.icon });
  });
  return btn;
}
function renderHourly(items) {
  refs.hourlyList.innerHTML = "";
  items.forEach((h,i) => {
    const el = createHourlyCard(h);
    if (i === 0) el.classList.add("selected");
    refs.hourlyList.appendChild(el);
  });
}
function createDailyCard(day) {
  const wrapper = document.createElement("div");
  wrapper.className = "daily-card";
  wrapper.setAttribute("role","listitem");
  wrapper.innerHTML = `
    <div style="display:flex;align-items:center;gap:12px">
      <div class="day">${day.day}</div>
      <div class="day-icon" aria-hidden="true">${weatherSvg(day.icon,28)}</div>
    </div>
    <div class="temps"><div class="hi">${day.hi}°</div><div class="lo">${day.lo}°</div></div>
  `;
  return wrapper;
}
function renderDaily(items) {
  refs.dailyList.innerHTML = "";
  items.forEach(d => refs.dailyList.appendChild(createDailyCard(d)));
}

/* ============
   Interactions
   ============ */
function attachSearch() {
  refs.searchInput.addEventListener("input", (e) => {
    const v = e.target.value.trim();
    refs.searchClear.hidden = v.length === 0;
    // for preview, we do a simple filter on daily by name to show "results"
    // In real app you'd call a geocoding endpoint here.
  });
  refs.searchClear.addEventListener("click", () => {
    refs.searchInput.value = "";
    refs.searchClear.hidden = true;
    refs.searchInput.focus();
  });
}

function attachThemeToggle() {
  refs.btnTheme.addEventListener("click", () => {
    const body = document.body;
    const isDark = body.classList.toggle("theme-dark");
    refs.btnTheme.setAttribute("aria-pressed", String(isDark));
  });
}

function attachRefresh() {
  refs.btnRefresh.addEventListener("click", () => {
    // In real app, re-fetch data. Here show a brief animation and re-render
    refs.btnRefresh.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(360deg)' }], { duration: 700 });
    // simulate refresh by re-rendering with the same mock data
    renderAll(mock);
  });
}

function attachNav() {
  refs.navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      refs.navButtons.forEach(b => { b.classList.remove("active"); b.setAttribute("aria-pressed","false"); });
      btn.classList.add("active");
      btn.setAttribute("aria-pressed","true");
      // Optionally do view switching here
      const tab = btn.dataset.tab;
      if (tab === "search") {
        refs.searchInput.focus();
      } else {
        // scroll to top of main for home
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  });
}

/* ============
   Boot / Render everything
   ============ */
function renderAll(data) {
  renderHeader({ city: data.city, date: data.date });
  renderCurrent(data.current);
  renderHourly(data.hourly);
  renderDaily(data.daily);
}

function init() {
  renderAll(mock);
  attachSearch();
  attachThemeToggle();
  attachRefresh();
  attachNav();
}

document.addEventListener("DOMContentLoaded", init);
