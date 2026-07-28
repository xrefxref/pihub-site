/* ============================================================
   深规院考察助手 · 应用逻辑
   路由 / 页面 / 交互 / 主题 / 动画
   ============================================================ */
(function () {
  const { THEMES, REGIONS, DISTRICT_COORDS, PROJECTS } = window.APP_DATA;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ---------- Icons ---------- */
  const P = {
    home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v9h5v-5h4v5h5v-9"/>',
    layers: '<path d="M12 3 3 8l9 5 9-5-9-5Z"/><path d="M3 13l9 5 9-5"/>',
    map: '<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z"/><path d="M9 4v14M15 6v14"/>',
    import: '<path d="M12 3v12"/><path d="m8 11 4 4 4-4"/><path d="M4 17v2h16v-2"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19"/>',
    moon: '<path d="M21 12.8A8 8 0 1 1 11.2 3 6.2 6.2 0 0 0 21 12.8Z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    check: '<path d="m5 12 4 4 10-10"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/>',
    trash: '<path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13"/>',
    drag: '<circle cx="9" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="18" r="1"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    sparkles: '<path d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3Z"/><path d="M19 14l.9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9L19 14Z"/>',
    location: '<path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    route: '<circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.5 6H15a3 3 0 0 1 0 6H9a3 3 0 0 0 0 6h6.5"/>'
  };
  const svg = (n, cls = "") => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${P[n] || ""}</svg>`;

  /* ---------- Toast ---------- */
  let toastT;
  function toast(msg) {
    let t = $("#toast");
    if (!t) { t = document.createElement("div"); t.id = "toast"; t.className = "toast"; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 2600);
  }

  /* ---------- Blueprint thumbnail (offline-safe) ---------- */
  function hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function blueprint(seed) {
    const h = hash(seed);
    const rnd = (n) => ((h >> (n * 3)) % 1000) / 1000;
    let bld = "";
    for (let i = 0; i < 5; i++) {
      const x = 20 + rnd(i) * 320, w = 26 + rnd(i + 1) * 54, y = 70 + rnd(i + 2) * 40, hh = 24 + rnd(i + 3) * 40;
      bld += `<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${w.toFixed(0)}" height="${hh.toFixed(0)}" rx="2" fill="rgba(99,140,248,.18)" stroke="rgba(129,200,255,.55)" stroke-width="1"/>`;
    }
    const cx = 30 + rnd(6) * 340, cy = 30 + rnd(7) * 30;
    return `<svg viewBox="0 0 400 140" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="g${h.toString(36)}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#0b1222"/><stop offset="1" stop-color="#10243f"/></linearGradient></defs>
      <rect width="400" height="140" fill="url(#g${h.toString(36)})"/>
      <g stroke="rgba(120,160,220,.16)" stroke-width="1">
        ${Array.from({ length: 9 }, (_, i) => `<line x1="${i * 50}" y1="0" x2="${i * 50}" y2="140"/>`).join("")}
        ${Array.from({ length: 4 }, (_, i) => `<line x1="0" y1="${i * 40}" x2="400" y2="${i * 40}"/>`).join("")}
      </g>
      <path d="M0 110 C 120 90, 260 120, 400 96" stroke="rgba(34,211,238,.55)" stroke-width="2" fill="none"/>
      ${bld}
      <circle cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" r="5" fill="#22d3ee"/>
      <circle cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" r="10" fill="none" stroke="#22d3ee" stroke-width="1.5" opacity=".6"/>
    </svg>`;
  }

  /* ---------- Theme ---------- */
  function applyTheme(mode) {
    const root = document.documentElement;
    if (mode === "system") {
      const m = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.setAttribute("data-theme", m);
    } else root.setAttribute("data-theme", mode);
  }
  function initTheme() {
    let mode = localStorage.getItem("szpdi_theme") || "system";
    applyTheme(mode);
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
      if ((localStorage.getItem("szpdi_theme") || "system") === "system") applyTheme("system");
    });
    const btn = $("#themeToggle");
    const icons = { light: P.sun, dark: P.moon, system: '<circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18"/>' };
    const labels = { light: "浅色", dark: "深色", system: "跟随系统" };
    function paint() {
      const m = localStorage.getItem("szpdi_theme") || "system";
      btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${icons[m]}</svg>`;
      btn.title = "主题：" + labels[m] + "（点击切换）";
    }
    paint();
    btn.addEventListener("click", () => {
      const order = ["light", "dark", "system"];
      const cur = localStorage.getItem("szpdi_theme") || "system";
      const next = order[(order.indexOf(cur) + 1) % 3];
      localStorage.setItem("szpdi_theme", next);
      applyTheme(next); paint();
    });
  }

  /* ---------- Magnetic + reveal ---------- */
  function initMagnetic(root = document) {
    $$(".magnetic", root).forEach(node => {
      if (node._mag) return; node._mag = 1;
      node.addEventListener("mousemove", e => {
        const r = node.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        node.style.transform = `translate(${x * 0.18}px, ${y * 0.28}px)`;
      });
      node.addEventListener("mouseleave", () => { node.style.transform = ""; });
    });
  }
  let io;
  function initReveal(root = document) {
    if (!io) io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.12 });
    $$(".reveal", root).forEach(el => io.observe(el));
  }

  /* ---------- Hero canvas (light particle grid) ---------- */
  function initHeroCanvas(canvas) {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w, h, pts;
    function resize() {
      const r = canvas.getBoundingClientRect();
      w = canvas.width = r.width; h = canvas.height = r.height;
      pts = Array.from({ length: Math.min(70, Math.floor(w / 22)) }, () => ({
        x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25
      }));
    }
    resize(); window.addEventListener("resize", resize);
    const dark = () => document.documentElement.getAttribute("data-theme") === "dark";
    function tick() {
      ctx.clearRect(0, 0, w, h);
      const stroke = dark() ? "rgba(129,200,255,.18)" : "rgba(99,102,241,.16)";
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.4, 0, 7); ctx.fillStyle = stroke; ctx.fill();
      }
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, d = Math.hypot(dx, dy);
        if (d < 120) { ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.strokeStyle = stroke; ctx.globalAlpha = 1 - d / 120; ctx.stroke(); ctx.globalAlpha = 1; }
      }
      requestAnimationFrame(tick);
    }
    tick();
  }

  /* ============================================================
     Components
     ============================================================ */
  function projectCard(p) {
    const inPlan = window.Store.has(p.id);
    const tags = (p.themes || []).slice(0, 3).map(t => `<span class="tag">${t}</span>`).join("");
    return `<article class="card project-card reveal">
      <div class="project-thumb">${blueprint(p.id + p.name)}</div>
      <div class="project-body">
        <h3>${p.name}</h3>
        <div class="tag-row">${tags}</div>
        <div class="meta-row"><span>${svg("location", "w-4 h-4")} ${p.city}·${p.district}</span><span>${p.year || ""}</span></div>
        <p>${p.description}</p>
        <div class="project-actions">
          <a class="btn btn-ghost" href="#/project/${p.id}">${svg("arrow")} 查看详情</a>
          <button class="btn ${inPlan ? "btn-soft" : "btn-primary"}" data-add="${p.id}">
            ${inPlan ? svg("check") + " 已在行程" : svg("plus") + " 加入行程"}
          </button>
        </div>
      </div>
    </article>`;
  }

  /* ============================================================
     Pages
     ============================================================ */
  function pageIndex() {
    const chips = THEMES.map(t => `<span class="chip">${t}</span>`).join("");
    return `
    <section class="hero">
      <div class="hero-grid"></div>
      <canvas id="heroCanvas"></canvas>
      <div class="container hero-inner">
        <span class="eyebrow reveal">深规院 · 考察路线规划</span>
        <h1 class="reveal">深规院<span class="gradient-text">精品项目考察</span></h1>
        <p class="lead reveal">助您探索深圳市城市规划设计研究院的精品项目实例，规划您的专属考察路线。</p>
        <div class="hero-actions reveal">
          <a class="btn btn-primary magnetic" href="#/projects">${svg("layers")} 开始探索</a>
          <a class="btn btn-ghost magnetic" href="#/plan">${svg("map")} 我的行程</a>
        </div>
        <div class="chip-row reveal">${chips}</div>
      </div>
    </section>
    <section class="container section">
      <div class="grid grid-cols-3">
        ${[
          ["按主题探索", "滨海空间、城市更新、历史保护、公园绿地等 12 类考察主题任选。"],
          ["多维度检索", "省 / 市 / 区三级联动，叠加名称搜索，秒级定位目标项目。"],
          ["智能路线规划", "AI 自动补充坐标与图片，生成点与点之间的最优驾车路线。"],
        ].map(([t, d], i) => `<div class="glass card reveal" style="animation-delay:${i * 80}ms">
            <h3>${t}</h3><p>${d}</p></div>`).join("")}
      </div>
    </section>`;
  }

  function pageProjects() {
    const themePills = `<button class="pill active" data-theme="all">全部主题</button>` +
      THEMES.map(t => `<button class="pill" data-theme="${t}">${t}</button>`).join("");
    const provOpts = `<option value="">所有省份</option>` + REGIONS.map(r => `<option value="${r.name}">${r.name}</option>`).join("");
    return `
    <section class="container section">
      <div class="reveal">
        <h2 style="font-size:1.9rem;letter-spacing:-.02em;margin:0">项目中心</h2>
        <p class="muted" style="margin:.3rem 0 1.2rem">浏览所有精品项目，按主题或区域筛选后加入您的考察行程。</p>
      </div>
      <div class="glass filter-bar reveal">
        <div class="grow"><span class="field-label">按主题</span><div class="pill-group" id="themePills">${themePills}</div></div>
        <div style="flex:1 1 220px">
          <span class="field-label">按区域</span>
          <div class="row wrap" style="gap:.5rem">
            <select class="select" id="fProv" style="flex:1">${provOpts}</select>
            <select class="select" id="fCity" style="flex:1"><option value="">所有城市</option></select>
            <select class="select" id="fDist" style="flex:1"><option value="">所有区域</option></select>
          </div>
        </div>
        <div style="flex:1 1 220px"><span class="field-label">搜索</span>
          <div class="row" style="gap:.5rem"><span class="input-icon">${svg("search", "w-4 h-4")}</span>
          <input class="input" id="fSearch" placeholder="输入项目名称关键词..."/></div>
        </div>
      </div>
      <div class="grid grid-cols-3" id="projectGrid"></div>
      <div class="empty" id="projEmpty" style="display:none">未找到相关项目。</div>
    </section>`;
  }

  function pageDetail(id) {
    const p = PROJECTS.find(x => x.id === id);
    if (!p) return `<section class="container section"><div class="empty">项目未找到。<a class="btn btn-ghost" href="#/projects">返回项目中心</a></div></section>`;
    const tags = (p.themes || []).map(t => `<span class="tag">${t}</span>`).join("");
    const amap = `https://uri.amap.com/marker?position=${p.lng},${p.lat}&name=${encodeURIComponent(p.name)}&src=myapp&coordinate=gaode`;
    const inPlan = window.Store.has(p.id);
    return `
    <section class="container section">
      <a class="btn btn-ghost magnetic" href="#/projects" style="margin-bottom:1.2rem">${svg("arrow")} 返回项目中心</a>
      <div class="glass card reveal" style="overflow:hidden;padding:0">
        <div style="height:200px;position:relative" id="detailThumb">${blueprint(p.id + p.name)}</div>
        <div style="padding:1.4rem">
          <div class="tag-row" style="margin-bottom:.6rem">${tags}</div>
          <h2 style="font-size:1.7rem;letter-spacing:-.02em;margin:.2rem 0">${p.name}</h2>
          <div class="row wrap" style="gap:1.2rem;color:var(--text-mute);font-size:.85rem;margin:.4rem 0 1rem">
            <span>${svg("location", "w-4 h-4")} ${p.address}</span>
            <span>${svg("calendar", "w-4 h-4")} 完成年份：${p.year || "—"}</span>
            <span>${svg("sparkles", "w-4 h-4")} 获奖：${p.award || "—"}</span>
          </div>
          <div class="row" style="gap:1rem;flex-wrap:wrap">
            <button class="btn ${inPlan ? "btn-soft" : "btn-primary"} magnetic" data-add="${p.id}">${inPlan ? svg("check") + " 已在行程" : svg("plus") + " 加入我的行程"}</button>
            <a class="btn btn-ghost" href="${amap}" target="_blank" rel="noopener">${svg("location")} 高德地图查看坐标</a>
          </div>
          <hr class="divider"/>
          <div class="grid grid-cols-2" style="gap:1.2rem">
            <div><div class="field-label">主要内容</div><p style="margin:0;color:var(--text-soft)">${p.mainContent}</p></div>
            <div><div class="field-label">项目核心价值</div><p style="margin:0;color:var(--text-soft)">${p.coreValue}</p></div>
            <div><div class="field-label">考察主题</div><p style="margin:0;color:var(--text-soft)">${(p.themes || []).join("、")}</p></div>
            <div><div class="field-label">具体考察点</div><p style="margin:0;color:var(--text-soft)">${p.specificPoint || p.address}</p></div>
          </div>
          <div class="row" style="gap:.5rem;margin-top:1rem;color:var(--accent);font-weight:600;font-size:.85rem">
            ${svg("location", "w-4 h-4")} 坐标：${p.lat.toFixed(4)}°N, ${p.lng.toFixed(4)}°E
            <span class="muted" style="font-weight:400" id="coordNote"></span>
          </div>
        </div>
      </div>
    </section>`;
  }

  async function pagePlan() {
    const plan = window.Store.get();
    const ids = plan.project_ids;
    if (ids.length === 0) {
      return `<section class="container section">
        <div class="empty glass card" style="padding:3rem">
          <div style="font-size:2.4rem;margin-bottom:.5rem">🗺️</div>
          <h3 style="margin:.2rem 0">您的行程还是空的</h3>
          <p class="muted">请前往“项目中心”添加您感兴趣的考察点。</p>
          <a class="btn btn-primary magnetic" href="#/projects" style="margin-top:1rem">${svg("layers")} 去项目中心</a>
        </div></section>`;
    }
    const items = ids.map(id => PROJECTS.find(p => p.id === id)).filter(Boolean);
    const listHtml = items.map((p, i) => `
      <div class="plan-item" draggable="true" data-id="${p.id}">
        <span class="plan-index">${i + 1}</span>
        <div class="grow">
          <div style="font-weight:700">${p.name}</div>
          <div class="muted" style="font-size:.82rem">${p.address}</div>
        </div>
        <label class="muted" style="font-size:.78rem;display:flex;align-items:center;gap:.3rem">
          时长<input type="number" min="5" step="5" value="${plan.project_durations[p.id] || 30}" data-dur="${p.id}" class="input" style="width:64px;padding:.3rem .5rem"/>分
        </label>
        <button class="btn btn-danger" data-rm="${p.id}" title="移除">${svg("trash")}</button>
        <span class="muted" style="cursor:grab" title="拖拽排序">${svg("drag", "w-5 h-5")}</span>
      </div>`).join("");

    return `
    <section class="container section">
      <div class="row between wrap reveal" style="margin-bottom:1.2rem">
        <div><h2 style="font-size:1.9rem;letter-spacing:-.02em;margin:0">我的行程</h2>
          <p class="muted" style="margin:.3rem 0" id="planHint">已为您规划了 ${items.length} 个考察点。可拖拽调整顺序。</p></div>
        <div class="row" style="gap:.6rem">
          <label class="muted" style="font-size:.82rem;display:flex;align-items:center;gap:.4rem">
            ${svg("clock", "w-4 h-4")} 起始时间 T
            <input type="time" id="startTime" class="input" style="width:120px;padding:.4rem .6rem" value="${plan.start_time || ""}"/>
          </label>
          <button class="btn btn-danger magnetic" id="clearPlan">${svg("trash")} 清空行程</button>
        </div>
      </div>
      <div class="stat-grid reveal" style="margin-bottom:1.4rem">
        <div class="stat"><div class="num" id="stCount">${items.length}</div><div class="lbl">考察点总数</div></div>
        <div class="stat"><div class="num" id="stDist">—</div><div class="lbl">预计总路程 (km)</div></div>
        <div class="stat"><div class="num" id="stTime">—</div><div class="lbl">预计总耗时 (min)</div></div>
      </div>
      <div class="glass card reveal" style="padding:1rem">
        <div class="plan-list" id="planList">${listHtml}</div>
        <div id="routeBox" style="margin-top:1rem"></div>
        <div class="divider"></div>
        <div class="field-label">详细行程计划表</div>
        <div id="planTable" style="font-size:.85rem;color:var(--text-soft)"></div>
      </div>
    </section>`;
  }

  function pageImport() {
    const sample = "项目名称,省,城市,区/县,具体考察点,主要内容,项目核心价值,考察主题\n" +
      "某滨海活力岸线设计,广东省,深圳市,南山区,深圳湾畔,滨海公共空间连续化营造,湾区滨水生活范式,滨海空间|公园绿地";
    const sampleUri = "data:text/csv;charset=utf-8," + encodeURIComponent(sample);
    return `
    <section class="container section">
      <div class="reveal">
        <h2 style="font-size:1.9rem;letter-spacing:-.02em;margin:0">批量导入项目</h2>
        <p class="muted" style="margin:.3rem 0 1.2rem">将 Excel / Word 表格转换为 CSV 后，直接粘贴内容。AI 会自动为每个项目补全坐标与图片。</p>
      </div>
      <div class="grid grid-cols-2" style="gap:1.2rem">
        <div class="glass card reveal">
          <div class="field-label">粘贴 CSV 内容</div>
          <textarea class="input" id="csvInput" placeholder="请粘贴 CSV 内容，例如：&#10;项目名称,省,城市,区/县,具体考察点,主要内容,项目核心价值,考察主题&#10;深圳市建设儿童友好型城市系列规划,广东省,深圳市,福田区,福田区妇儿大厦周边片区,...,滨海空间|公园绿地"></textarea>
          <div class="row between" style="margin-top:.8rem">
            <a class="btn btn-ghost" href="${sampleUri}" download="sample.csv">${svg("import")} 下载示例 CSV</a>
            <button class="btn btn-primary magnetic" id="importBtn">${svg("sparkles")} 开始导入</button>
          </div>
          <div class="progress" style="margin-top:1rem;display:none" id="impProg"><span></span></div>
          <div id="impMsg" class="muted" style="font-size:.85rem;margin-top:.6rem"></div>
        </div>
        <div class="glass card reveal">
          <div class="field-label">操作指引</div>
          <ol style="margin:.2rem 0;padding-left:1.2rem;color:var(--text-soft);font-size:.9rem;line-height:1.9">
            <li>在 Excel / WPS 中整理为上方 8 列格式</li>
            <li>另存为 <span class="kbd">CSV (UTF-8)</span></li>
            <li>用记事本打开复制全部内容，粘贴到左侧</li>
            <li>点击「开始导入」，AI 自动补全坐标与图片</li>
          </ol>
          <hr class="divider"/>
          <div class="field-label">或手动添加单个项目</div>
          <div class="row wrap" style="gap:.5rem">
            <input class="input" id="mName" placeholder="项目名称 *" style="flex:1 1 140px"/>
            <input class="input" id="mAddr" placeholder="项目地址 *" style="flex:1 1 160px"/>
            <input class="input" id="mTheme" placeholder="主题(用|分隔)" style="flex:1 1 140px"/>
            <button class="btn btn-soft magnetic" id="manualAdd">${svg("plus")} 添加</button>
          </div>
        </div>
      </div>
    </section>`;
  }

  /* ============================================================
     Render & routing
     ============================================================ */
  const routes = {
    "": pageIndex, "index": pageIndex,
    "projects": pageProjects, "project": pageDetail,
    "plan": pagePlan, "import": pageImport
  };

  async function render() {
    const hash = location.hash.replace(/^#\/?/, "");
    const seg = hash.split("/").filter(Boolean);
    const key = seg[0] || "";
    const main = $("#appMain");
    let html;
    if (key === "project") html = pageDetail(seg[1]);
    else if (key === "plan") html = await pagePlan();
    else html = (routes[key] || pageIndex)();
    main.innerHTML = html;
    window.scrollTo({ top: 0, behavior: "auto" });

    // route-specific wiring
    if (key === "projects") wireProjects();
    if (key === "project") wireDetail(seg[1]);
    if (key === "plan") wirePlan();
    if (key === "import") wireImport();
    if (key === "") initHeroCanvas($("#heroCanvas"));

    initMagnetic(main); initReveal(main);
    updateNavActive(key); updatePlanBadge();
  }

  function updateNavActive(key) {
    const map = { "": "index", "index": "index", "projects": "projects", "project": "projects", "plan": "plan", "import": "import" };
    $$(".nav-links a").forEach(a => a.classList.toggle("active", a.dataset.nav === (map[key] || "index")));
  }
  function updatePlanBadge() {
    const b = $("#planBadge"); if (!b) return;
    const n = window.Store.count();
    b.textContent = n; b.style.display = n ? "grid" : "none";
  }

  /* ---------- Projects wiring ---------- */
  function filteredProjects() {
    const tp = document.querySelector("#themePills .pill.active")?.dataset.theme || "all";
    const prov = $("#fProv")?.value || "", city = $("#fCity")?.value || "", dist = $("#fDist")?.value || "";
    const q = ($("#fSearch")?.value || "").trim().toLowerCase();
    return PROJECTS.filter(p => {
      if (tp !== "all" && !(p.themes || []).includes(tp)) return false;
      if (prov && p.province !== prov) return false;
      if (city && p.city !== city) return false;
      if (dist && p.district !== dist) return false;
      if (q && !p.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }
  function wireProjects() {
    const grid = $("#projectGrid"), empty = $("#projEmpty");
    function paint() {
      const list = filteredProjects();
      grid.innerHTML = list.map(projectCard).join("");
      empty.style.display = list.length ? "none" : "block";
      initReveal(grid); initMagnetic(grid); bindAdd(grid);
    }
    $$("#themePills .pill").forEach(b => b.addEventListener("click", () => {
      $$("#themePills .pill").forEach(x => x.classList.remove("active"));
      b.classList.add("active"); paint();
    }));
    const prov = $("#fProv"), city = $("#fCity"), dist = $("#fDist");
    prov.addEventListener("change", () => {
      const r = REGIONS.find(x => x.name === prov.value);
      city.innerHTML = `<option value="">所有城市</option>` + (r ? r.children.map(c => `<option>${c.name}</option>`).join("") : "");
      city.dispatchEvent(new Event("change"));
    });
    city.addEventListener("change", () => {
      const r = REGIONS.find(x => x.name === prov.value);
      const c = r && r.children.find(x => x.name === city.value);
      dist.innerHTML = `<option value="">所有区域</option>` + (c && c.children ? c.children.map(d => `<option>${d.name}</option>`).join("") : "");
      paint();
    });
    dist.addEventListener("change", paint);
    $("#fSearch").addEventListener("input", paint);
    paint();
  }

  /* ---------- Detail wiring (AI image + coord note) ---------- */
  function wireDetail(id) {
    const p = PROJECTS.find(x => x.id === id); if (!p) return;
    bindAdd($("#appMain"));
    // AI 图片增强
    const thumb = $("#detailThumb");
    window.AI.image(p.name).then(url => {
      if (url) {
        const img = new Image();
        img.onload = () => { thumb.innerHTML = `<img src="${url}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover"/>`; };
        img.src = url;
      }
    });
    // 坐标来源提示
    const note = $("#coordNote");
    if (note) {
      window.AI.geocode(p.name, p.address).then(g => {
        if (g && g.mock) note.textContent = "（坐标由区域兜底，可能不准确）";
        else if (g) note.textContent = "（坐标由 AI 联网获取）";
      });
    }
  }

  /* ---------- Plan wiring ---------- */
  function wirePlan() {
    const list = $("#planList"), routeBox = $("#routeBox"), planTable = $("#planTable");
    // durations
    $$("[data-dur]").forEach(inp => inp.addEventListener("input", e => {
      window.Store.setDuration(e.target.dataset.dur, +e.target.value || 0);
    }));
    // remove
    $$("[data-rm]").forEach(b => b.addEventListener("click", () => { window.Store.remove(b.dataset.rm); render(); }));
    // clear
    $("#clearPlan").addEventListener("click", () => { if (confirm("确定清空整个行程？")) { window.Store.clear(); render(); } });
    // start time
    const st = $("#startTime");
    if (st) st.addEventListener("change", e => window.Store.setStartTime(e.target.value));
    // drag reorder
    let dragId = null;
    $$(".plan-item", list).forEach(item => {
      item.addEventListener("dragstart", () => { dragId = item.dataset.id; item.classList.add("dragging"); });
      item.addEventListener("dragend", () => { item.classList.remove("dragging"); $$(".plan-item").forEach(i => i.classList.remove("drop-target")); });
      item.addEventListener("dragover", e => { e.preventDefault(); item.classList.add("drop-target"); });
      item.addEventListener("dragleave", () => item.classList.remove("drop-target"));
      item.addEventListener("drop", e => {
        e.preventDefault();
        const plan = window.Store.get();
        const from = plan.project_ids.indexOf(dragId);
        const to = plan.project_ids.indexOf(item.dataset.id);
        if (from < 0 || to < 0 || from === to) return;
        plan.project_ids.splice(to, 0, plan.project_ids.splice(from, 1)[0]);
        window.Store.reorder(plan.project_ids);
        render();
      });
    });
    // routes + stats (async)
    computeRoutes();
    async function computeRoutes() {
      const plan = window.Store.get();
      const items = plan.project_ids.map(id => PROJECTS.find(p => p.id === id)).filter(Boolean);
      let totalDist = 0, totalTravel = 0;
      routeBox.innerHTML = `<div class="muted" style="font-size:.85rem">${svg("route", "w-4 h-4")} 正在智能规划路线…</div>`;
      const cards = [];
      for (let i = 0; i < items.length - 1; i++) {
        const a = items[i], b = items[i + 1];
        const r = await window.AI.route({ name: a.name, address: a.address, lat: a.lat, lng: a.lng }, { name: b.name, address: b.address, lat: b.lat, lng: b.lng });
        totalDist += (r.distance || 0); totalTravel += (r.time || 0);
        cards.push(`<div class="route-card">
          <div class="row" style="gap:.4rem;font-weight:700;margin-bottom:.2rem">${svg("route", "w-4 h-4")} ${a.name} → ${b.name}</div>
          <div class="muted" style="font-size:.84rem">${r.summary} ｜ 约 ${r.distance} km ｜ 约 ${r.time} 分钟${r.mock ? "（模拟）" : ""}</div>
          ${(r.landmarks || []).map(l => `<div class="muted" style="font-size:.8rem">· ${l}</div>`).join("")}
        </div>`);
      }
      const stay = items.reduce((s, p) => s + (plan.project_durations[p.id] || 30), 0);
      routeBox.innerHTML = cards.join("") || `<div class="muted" style="font-size:.85rem">仅 1 个考察点，暂无路线。</div>`;
      $("#stDist").textContent = totalDist ? totalDist.toFixed(1) : "—";
      $("#stTime").textContent = (stay + totalTravel) || "—";
      // table
      let html = `<table style="width:100%;border-collapse:collapse">
        <tr style="text-align:left;color:var(--text-mute)"><th>#</th><th>考察点</th><th>地址</th><th>停留(分)</th><th>路程(分)</th></tr>`;
      items.forEach((p, i) => {
        html += `<tr style="border-top:1px solid var(--border)">
          <td style="padding:.35rem 0">${i + 1}</td><td style="padding:.35rem 0;font-weight:600">${p.name}</td>
          <td style="padding:.35rem 0" class="muted">${p.address}</td>
          <td style="padding:.35rem 0">${plan.project_durations[p.id] || 30}</td>
          <td style="padding:.35rem 0" class="muted">${i < items.length - 1 ? (cards[i] ? "—" : "") : "终点"}</td></tr>`;
      });
      html += `</table>`;
      planTable.innerHTML = html;
    }
  }

  /* ---------- Import wiring ---------- */
  function wireImport() {
    const btn = $("#importBtn"), input = $("#csvInput"), prog = $("#impProg"), msg = $("#impMsg");
    btn.addEventListener("click", async () => {
      const text = input.value.trim();
      if (!text) { toast("请先粘贴 CSV 内容"); return; }
      const lines = text.split(/\r?\n/).filter(l => l.trim());
      // 去掉表头（若首行含“项目名称”）
      let data = lines;
      if (data[0] && data[0].includes("项目名称")) data = data.slice(1);
      if (data.length === 0) { toast("未解析到有效数据"); return; }
      btn.disabled = true; prog.style.display = "block"; msg.textContent = `正在解析 ${data.length} 行…`;
      let ok = 0, withCoord = 0, withImg = 0;
      for (let i = 0; i < data.length; i++) {
        const cols = data[i].split(",");
        const name = (cols[0] || "").trim(); if (!name) continue;
        const prov = (cols[1] || "").trim(), city = (cols[2] || "").trim(), dist = (cols[3] || "").trim();
        const point = (cols[4] || "").trim(), main = (cols[5] || "").trim(), core = (cols[6] || "").trim();
        const themes = (cols[7] || "").split("|").map(s => s.trim()).filter(Boolean);
        const address = point || `${city}${dist}`;
        const id = "imp" + Date.now() + i;
        const proj = { id, name, province: prov, city, district: dist, address, description: main || core, themes, mainContent: main, coreValue: core, specificPoint: point, imageUrl: null, lat: 0, lng: 0, year: "", award: null };
        // AI / 兜底坐标
        const g = await window.AI.geocode(name, address);
        if (g && g.lat) { proj.lat = g.lat; proj.lng = g.lng; withCoord++; }
        const img = await window.AI.image(name);
        if (img) { proj.imageUrl = img; withImg++; }
        PROJECTS.unshift(proj); ok++;
        prog.querySelector("span").style.width = Math.round(((i + 1) / data.length) * 100) + "%";
        msg.textContent = `已处理 ${i + 1}/${data.length}…`;
      }
      btn.disabled = false; prog.querySelector("span").style.width = "100%";
      msg.textContent = `✅ 成功导入 ${ok} 个项目！  • ${withCoord} 个获取了坐标 • ${withImg} 个获取了图片  可到“项目中心”查看。`;
      toast(`成功导入 ${ok} 个项目`);
      input.value = "";
    });
    $("#manualAdd").addEventListener("click", () => {
      const name = $("#mName").value.trim(), addr = $("#mAddr").value.trim();
      if (!name || !addr) { toast("请填写项目名称与地址"); return; }
      const themes = $("#mTheme").value.split("|").map(s => s.trim()).filter(Boolean);
      const id = "imp" + Date.now();
      const g = window.AI.geocode(name, addr);
      g.then(gg => {
        PROJECTS.unshift({ id, name, province: "", city: "", district: "", address: addr, description: "", themes, mainContent: "", coreValue: "", specificPoint: addr, imageUrl: null, lat: gg ? gg.lat : 0, lng: gg ? gg.lng : 0, year: "", award: null });
        toast(`已添加「${name}」`);
        $("#mName").value = ""; $("#mAddr").value = ""; $("#mTheme").value = "";
      });
    });
  }

  /* ---------- Add-to-plan binding (delegated) ---------- */
  function bindAdd(root) {
    $$("[data-add]", root).forEach(b => {
      if (b._bound) return; b._bound = 1;
      b.addEventListener("click", () => {
        const p = PROJECTS.find(x => x.id === b.dataset.add); if (!p) return;
        if (window.Store.has(p.id)) { window.Store.remove(p.id); toast(`已从行程移除「${p.name}」`); }
        else { window.Store.add(p); toast(`「${p.name}」已加入行程！`); }
        // refresh button label
        const inPlan = window.Store.has(p.id);
        b.className = "btn " + (inPlan ? "btn-soft" : "btn-primary");
        b.innerHTML = (inPlan ? svg("check") + " 已在行程" : svg("plus") + " 加入行程");
        updatePlanBadge();
      });
    });
  }

  /* ---------- Boot ---------- */
  function navHtml() {
    const links = [["index", "首页", "home"], ["projects", "项目中心", "layers"], ["plan", "我的行程", "map"], ["import", "数据导入", "import"]];
    return `<nav class="nav"><div class="container nav-inner">
      <a class="brand" href="#/index"><span class="logo">规</span><span>深圳规划考察助手<small>Field-trip Planner</small></span></a>
      <div class="nav-links">
        ${links.map(([k, t, ic]) => `<a href="#/${k}" data-nav="${k}">${svg(ic, "w-4 h-4")} ${t}</a>`).join("")}
        <a href="#/plan" class="plan-badge-wrap" title="行程数量" style="position:relative;display:grid;place-items:center;width:34px;height:34px">
          <span id="planBadge" style="display:none;position:absolute;top:-4px;right:-4px;min-width:18px;height:18px;padding:0 4px;background:var(--accent);color:#fff;border-radius:999px;font-size:11px;font-weight:800;place-items:center;display:none">0</span>
          ${svg("map", "w-5 h-5")}
        </a>
        <button class="theme-toggle" id="themeToggle" aria-label="切换主题"></button>
      </div>
    </div></nav>`;
  }

  function boot() {
    document.body.insertAdjacentHTML("afterbegin", navHtml());
    const main = document.createElement("main");
    main.id = "appMain"; main.style.minHeight = "70vh";
    document.body.appendChild(main);
    initTheme();
    window.addEventListener("hashchange", render);
    render();
    // 跨标签页同步
    window.addEventListener("plan:changed", updatePlanBadge);
    window.addEventListener("storage", e => { if (e.key === "szpdi_plan_v1") updatePlanBadge(); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
