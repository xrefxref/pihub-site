/* ============================================================
   Store — 行程状态 + localStorage 持久化
   ============================================================ */
(function () {
  const KEY = "szpdi_plan_v1";

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    return { id: "default", name: "我的默认行程", project_ids: [], project_durations: {}, start_time: null };
  }

  let plan = load();
  let saveTimer = null;

  function persist(immediate) {
    clearTimeout(saveTimer);
    const doSave = () => {
      try { localStorage.setItem(KEY, JSON.stringify(plan)); } catch (e) {}
      window.dispatchEvent(new CustomEvent("plan:changed"));
    };
    if (immediate) doSave();
    else saveTimer = setTimeout(doSave, 600); // 自动保存（防抖）
  }

  const Store = {
    get() { return plan; },
    has(id) { return plan.project_ids.includes(id); },
    count() { return plan.project_ids.length; },

    add(project) {
      if (this.has(project.id)) return false;
      plan.project_ids.push(project.id);
      if (!plan.project_durations[project.id]) plan.project_durations[project.id] = 30;
      persist(false);
      return true;
    },
    remove(id) {
      plan.project_ids = plan.project_ids.filter(x => x !== id);
      delete plan.project_durations[id];
      persist(false);
    },
    reorder(ids) { plan.project_ids = ids; persist(false); },
    setDuration(id, mins) { plan.project_durations[id] = mins; persist(false); },
    setStartTime(t) { plan.start_time = t; persist(false); },
    clear() { plan.project_ids = []; plan.project_durations = {}; persist(false); },
    saveNow() { persist(true); }
  };

  window.Store = Store;
})();
