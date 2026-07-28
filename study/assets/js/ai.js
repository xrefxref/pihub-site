/* ============================================================
   AI 模块
   - 优先调用本地代理 /api/ai/*（真实大模型，密钥在服务端）
   - 任何失败（如直接双击打开、代理未起）自动降级为内置模拟
   ============================================================ */
(function () {
  const BASE = window.AI_BASE || ""; // 同源；代理同端口时即真实模型
  async function call(path, payload) {
    const r = await fetch(BASE + "/api/ai/" + path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!r.ok) throw new Error("HTTP " + r.status);
    return await r.json();
  }

  function findDistrict(address) {
    const D = window.APP_DATA.DISTRICT_COORDS || {};
    for (const key in D) if (address && address.indexOf(key) >= 0) return key;
    return null;
  }
  function mockCoord(address) {
    const d = findDistrict(address);
    if (d) { const [la, lo] = window.APP_DATA.DISTRICT_COORDS[d]; return { lat: la, lng: lo, mock: true, district: d }; }
    return null;
  }
  function haversine(a, b) {
    const R = 6371, toRad = x => x * Math.PI / 180;
    const dLat = toRad(b.lat - a.lat), dLng = toRad(b.lng - a.lng);
    const s = Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(s));
  }

  const AI = {
    mode: "auto", // auto | mock | live
    async geocode(name, address) {
      if (this.mode === "mock") return mockCoord(address);
      try { return await call("geocode", { name, address }); }
      catch (e) { return mockCoord(address); }
    },
    async image(name) {
      if (this.mode === "mock") return null;
      try { const r = await call("image", { name }); return r.image_url || null; }
      catch (e) { return null; }
    },
    async route(from, to) {
      if (this.mode === "mock" || !from.lat || !to.lat) {
        const dist = (from.lat && to.lat) ? haversine(from, to) : 8 + Math.random() * 20;
        const time = Math.round(dist / 35 * 60 + 12);
        return {
          summary: "（模拟）沿城市主干路网行驶",
          distance: +dist.toFixed(1),
          time,
          landmarks: ["沿途可关注城市公共空间节点"],
          mock: true
        };
      }
      try {
        const r = await call("route", { from, to });
        return { summary: r.summary, distance: r.distance, time: r.time, landmarks: r.landmarks || [], mock: !!r.mock };
      } catch (e) {
        const dist = haversine(from, to);
        return { summary: "（模拟）沿城市主干路网行驶", distance: +dist.toFixed(1), time: Math.round(dist / 35 * 60 + 12), landmarks: [], mock: true };
      }
    }
  };

  window.AI = AI;
})();
