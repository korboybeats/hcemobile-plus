window.__HI=function(){try{return typeof HaloInput!=="undefined"?HaloInput:window.HaloInput}catch(e){return window.HaloInput}};
window.__gyroSaved=function(){try{return JSON.parse(localStorage.getItem("halo-web-settings")||"{}")||{}}catch(e){return{}}};
(function(){var el=null,f=function(v){return v==null?"-":(typeof v==="number"?v.toFixed(2):String(v))};
function sync(){var on=localStorage.getItem("gyroDbgHide")!=="1";document.querySelectorAll(".gyro-dbg-toggle").forEach(function(c){c.checked=on;c.onchange=function(){localStorage.setItem("gyroDbgHide",c.checked?"0":"1");sync()}});return on}
function mk(){if(el&&el.isConnected)return el;el=document.createElement("pre");el.id="gyro-dbg";el.hidden=!0;el.style.cssText="position:fixed;left:4px;top:4px;z-index:2147483647;margin:0;padding:4px 6px;font:10px/1.25 ui-monospace,Menlo,monospace;color:#0f0;background:rgba(0,0,0,.7);pointer-events:none;white-space:pre;max-width:60vw;border-radius:4px";(document.body||document.documentElement).appendChild(el);return el}
function tick(){try{var show=sync(),H=__HI(),st=null,saved=__gyroSaved(),sm=__gyroMode(saved);try{st=H&&H.gyroStat?H.gyroStat():null}catch(e){st={err:e.message}}
var im=!H?"no HaloInput":!st?"no gyroStat":st.err?"err:"+st.err:(st.on?(st.zo?"zoom":"always"):"off");
if(sm!=="off"&&H&&st&&!st.err&&im!==sm){__gyroApply(saved)}
mk();if(!show||(sm==="off"&&im==="off")){el.hidden=!0;return}el.hidden=!1;
var t="GYRO saved="+sm+" input="+im+(im!==sm?"  MISMATCH":"");if(st&&!st.err&&st.G){var G=st.G,gi=st.gi||{};t+=" zoomed="+st.zoomed+" zoomLvl="+st.zl+" zsens="+f(st.zs)+"\ngate: hidden="+st.hidden+" edit="+st.editing+" menuHid="+gi.menuHidden+" fatalHid="+gi.fatalHidden+" fn="+st.gate+" => OK="+st.ok+"\nev/s="+G.eps+" raw a/b/g="+(G.raw||[]).map(f).join(" ")+"\ninterval="+f(G.iv)+" ("+G.ivU+") dt="+((G.dt||0)*1e3).toFixed(1)+"ms orient="+st.orient+"\ndx/dy="+f(G.dx)+"/"+f(G.dy)+" stop="+(G.whyStop||"none")+"\ngyro D sent="+G.sent+" touch D sent="+st.touchN+" ring(k)="+st.k+" E="+f(st.E)+"\nmotion ev/s="+G.eps+" rAF sends/s="+(G.sps||0)+" avg delta/send="+(G.avg||0).toFixed(3)}
el.textContent=t}catch(e){try{mk().hidden=!1;el.textContent="GYRO overlay error: "+e.message}catch(_){}}}
fetch("version.json?t="+Date.now(),{cache:"no-store"}).then(function(r){return r.json()}).then(function(v){var b=document.getElementById("menu-build");b&&(b.textContent="Build "+(v.fork||"")+" ("+v.version+")")}).catch(function(){});
setTimeout(tick,0);setInterval(tick,250)})();
window.__gyroMode=function(a){var m=a.gyro;return m===!0?"always":m==="always"||m==="zoom"?m:"off"};
window.__gyroDef={gyro:"off",gyroH:1,gyroV:1,gyroZoom1:.6,gyroZoom2:.3,gyroInvert:!1,gyroInvertH:!1,gyroSwap:!1};
window.__gyroApply=function(a){var d=__gyroDef;(function(H){H&&H.setGyro&&H.setGyro({on:__gyroMode(a)!=="off",zoomOnly:__gyroMode(a)==="zoom",h:a.gyroH??d.gyroH,v:a.gyroV??d.gyroV,zoom1:a.gyroZoom1??a.gyroZoom??d.gyroZoom1,zoom2:a.gyroZoom2??d.gyroZoom2,invert:!!a.gyroInvert,invertH:!!a.gyroInvertH,swap:!!a.gyroSwap})})(__HI())};
(function(){var M=window.DeviceMotionEvent;if(!M||typeof M.requestPermission!=="function")return;var fn=function(){if(window.__gyroPerm==="granted"){rm();return}var sv;try{sv=__gyroSaved()}catch(e){return}if(__gyroMode(sv)==="off")return;rm();var O=window.DeviceOrientationEvent;try{O&&typeof O.requestPermission==="function"&&O.requestPermission().catch(function(){})}catch(e){}var pr;try{pr=M.requestPermission()}catch(e){pr=Promise.reject(e)}pr.then(function(r){window.__gyroPerm=r;if(r==="granted")__gyroApply(__gyroSaved())},function(){window.__gyroPerm="error"})},rm=function(){document.removeEventListener("touchend",fn,!0);document.removeEventListener("click",fn,!0)};document.addEventListener("touchend",fn,!0);document.addEventListener("click",fn,!0)})();
window.__gyroMsg=function(p,m){var el=document.getElementById(p+"-gyro-msg");if(!el)return;el.textContent=m;el.hidden=!m;clearTimeout(el._t);m&&(el._t=setTimeout(function(){el.hidden=!0},12e3))};
window.__gyroUI=function(p,a,save){var d=__gyroDef,g=function(i){return document.getElementById(p+"-"+i)};if(!g("gyro"))return;
var sl=[["gyro-h","gyroH"],["gyro-v","gyroV"],["gyro-zoom","gyroZoom1"],["gyro-zoom2","gyroZoom2"]];if(a.gyroZoom1==null&&a.gyroZoom!=null){a.gyroZoom1=a.gyroZoom;delete a.gyroZoom;save()}
a.gyro=__gyroMode(a);g("gyro-invert").checked=!!a.gyroInvert;
sl.forEach(function(q){var el=g(q[0]),v=a[q[1]]??d[q[1]];el.value=v;__lookVal(p+"-"+q[0],v);el.oninput=function(){a[q[1]]=parseFloat(el.value);__lookVal(p+"-"+q[0],a[q[1]]);save();__gyroApply(a)}});
g("gyro-invert").onchange=function(){a.gyroInvert=g("gyro-invert").checked;save();__gyroApply(a)};[["gyro-invert-h","gyroInvertH"],["gyro-swap","gyroSwap"]].forEach(function(q){var el=g(q[0]);if(!el)return;el.checked=!!a[q[1]];el.onchange=function(){a[q[1]]=el.checked;save();__gyroApply(a)}});
var seg=g("gyro"),st=document.getElementById(p+"-gyro-status");
var mark=function(){seg.querySelectorAll("button").forEach(function(b){b.classList.toggle("on",b.dataset.gyro===a.gyro)})};mark();
var stat=function(){if(!st)return;var M=window.DeviceMotionEvent,s=!M?"no sensor":(window.__gyroPerm||(typeof M.requestPermission==="function"?"not asked":"granted"));st.textContent="Motion: "+s+(window.__gyroRecv?" \u2014 receiving data":"")};stat();clearInterval(st&&st._iv);st&&(st._iv=setInterval(stat,1e3));
var set=function(m){a.gyro=m;save();__gyroApply(a);mark();stat()};
seg.querySelectorAll("button").forEach(function(b){b.onclick=function(){var want=b.dataset.gyro;if(want==="off"){set("off");__gyroMsg(p,"");return}
var M=window.DeviceMotionEvent;if(!M){window.__gyroPerm="no sensor";set("off");__gyroMsg(p,"Gyro isn't available on this device.");return}
if(typeof M.requestPermission!=="function"||window.__gyroPerm==="granted"){window.__gyroPerm="granted";set(want);return}
var pr;try{pr=M.requestPermission()}catch(err){pr=Promise.reject(err)}
var O=window.DeviceOrientationEvent;try{O&&typeof O.requestPermission==="function"&&O.requestPermission().catch(function(){})}catch(e){}
pr.then(function(r){window.__gyroPerm=r;if(r==="granted"){set(want);__gyroMsg(p,"")}else{set("off");__gyroMsg(p,"Motion access is denied for this app (iOS remembered an earlier choice, so no prompt). Reset it: iOS Settings \u203a Safari \u203a Advanced \u203a Website Data \u2192 remove this site, or delete and re-add the home-screen app, then tap Always/Zoom again.")}},
function(err){window.__gyroPerm="error";set("off");__gyroMsg(p,"iOS blocked the permission request ("+(err&&(err.name||err.message)||"error")+") \u2014 it must come straight from a tap. Tap Always or Zoom again.")})}})};
"use strict";
window.__lookVal = function (i, v) {
  var o = document.getElementById(i + "-val");
  o &&
    (o.textContent = /lookf$/.test(i) && +v <= 0 ? "Raw 1:1" : (+v).toFixed(2));
};
(() => {
  const e = (e) => document.getElementById(e),
    t = 34816,
    o = {
      memory: null,
      canRun: null,
      audio: null,
      started: !1,
      shared: null,
      offsets: null,
      log: [],
      wakeLock: null,
      version: null,
      games: [],
      importing: null,
    },
    n = matchMedia("(pointer: coarse)").matches,
    a = {
      touch: n,
      touchLayout: "modern",
      look: 1.4,
      lookFilter: 0,
      vsync: !0,
      glDebug: !1,
      showTiming: !1,
      showFps: !1,
      showPing: !1,
      silentSound: !0,
      touchCustom: {},
      touchOpacity: 1,
      playerRules: 0,
      playerCharacter: 0,
      smallTextures: !1,
      resolution: "auto",
      sharpTextures: !n,
    };
  try {
    const e = JSON.parse(localStorage.getItem("halo-web-settings") || "{}");
    (Object.assign(a, e),
      a.rawAimV18 || ((a.lookFilter = 0), (a.rawAimV18 = !0)),
      e.showTiming &&
        void 0 === e.showFps &&
        ((a.showFps = !0), (a.showTiming = !1)));
  } catch {}
  if (((a.playerRules = 0), (a.playerCharacter = 0), !a.smallTexturesChosen))
    try {
      const e = document.createElement("canvas").getContext("webgl2");
      ((a.smallTextures =
        !!e && !e.getExtension("WEBGL_compressed_texture_s3tc")),
        e?.getExtension("WEBGL_lose_context")?.loseContext());
    } catch {}
  function r() {
    try {
      localStorage.setItem("halo-web-settings", JSON.stringify(a));
    } catch {}
  }
  const s = "halo-web-last-session";
  try {
    o.previousLog = localStorage.getItem(s) || "";
  } catch {}
  function i() {
    o.logSaveTimer = null;
    try {
      localStorage.setItem(
        s,
        `${new Date().toISOString()} ${navigator.userAgent}\n` +
          o.log.slice(-400).join("\n"),
      );
    } catch {}
  }
  function c(e) {
    const t = String(e);
    (o.log.push(t),
      o.log.length > 2e3 && o.log.splice(0, o.log.length - 2e3),
      o.watch && o.watch.on && pn(t),
      console.log(t),
      o.logSaveTimer || (o.logSaveTimer = setTimeout(i, 4e3)));
  }
  async function l() {
    try {
      const e = await (
        await (
          await (async function () {
            let e = await navigator.storage.getDirectory();
            const t = ce();
            for (const o of (t && t.path) || [])
              e = await e.getDirectoryHandle(o);
            return e;
          })()
        ).getFileHandle("debug.txt")
      ).getFile();
      return await e.text();
    } catch {
      return "";
    }
  }
  function d(e) {
    const t = [],
      o = /^[^\n]*halobeta xbox [^\n]*$/gm;
    let n;
    for (; (n = o.exec(e));) t.push(n.index);
    return t;
  }
  async function u() {
    const e = await l(),
      t = [`${navigator.userAgent}  ·  build ${o.version || "?"}`];
    if (o.started) {
      t.push(`--- this run ---\n${o.log.join("\n")}`);
      const n = e.slice(Math.min(o.debugStart || 0, e.length)).trim();
      n && t.push(`--- this run's debug.txt ---\n${n}`);
    } else {
      (t.push(`--- this page ---\n${o.log.join("\n")}`),
        o.previousLog && t.push(`--- the last run ---\n${o.previousLog}`));
      const n = d(e),
        a = n.length ? e.slice(n[n.length - 1]).trim() : "";
      a && t.push(`--- the last run's debug.txt ---\n${a}`);
    }
    return t.join("\n\n");
  }
  async function m() {
    const e = await l();
    return (
      `${navigator.userAgent}  ·  build ${o.version || "?"}\n\n--- page and console ---\n${o.log.join("\n")}` +
      (o.previousLog
        ? `\n\n--- the session before this one ---\n${o.previousLog}`
        : "") +
      (e ? `\n\n--- debug.txt (the last 5 runs) ---\n${e}` : "")
    );
  }
  function h(t, o = 3500, n = "", a = !1) {
    if (document.body.classList.contains("playing") && !a)
      return void c("note: " + t);
    const r = e("toast");
    ((r.textContent = t),
      n && r.insertAdjacentHTML("afterbegin", n),
      (r.hidden = !1),
      clearTimeout(h.timer),
      (h.timer = setTimeout(() => {
        r.hidden = !0;
      }, o)));
  }
  function g(t, o) {
    const n = e("lobby-notice");
    ((e("lobby-notice-name").textContent = t),
      (e("lobby-notice-line").textContent = o || "Lobby chat joined"),
      (n.hidden = !1),
      n.classList.remove("show"),
      n.offsetWidth,
      n.classList.add("show"),
      clearTimeout(g.timer),
      (g.timer = setTimeout(() => {
        ((n.hidden = !0), n.classList.remove("show"));
      }, 3800)));
  }
  const p = { posts: [], editing: null, showAll: !1 };
  function f(e) {
    return new Date(e).toLocaleDateString([], {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  function A() {
    const t = p.posts;
    e("news").hidden = !t.length;
    const o = e("news-list");
    o.textContent = "";
    for (const e of p.showAll ? t : t.slice(0, 2)) {
      const t = document.createElement("article");
      t.className = "news-post";
      const n = document.createElement("p");
      ((n.className = "news-meta"),
        (n.textContent = f(e.time) + (e.by ? ` · ${e.by}` : "")));
      const a = document.createElement("h3");
      ((a.textContent = e.title), t.append(n, a));
      for (const o of String(e.body || "").split(/\n{2,}/)) {
        const e = document.createElement("p");
        ((e.textContent = o.trim()), e.textContent && t.append(e));
      }
      o.append(t);
    }
    const n = e("news-more");
    ((n.hidden = t.length <= 2),
      (n.textContent = p.showAll
        ? "Show fewer posts"
        : `Show older posts (${t.length - 2})`),
      (function () {
        const t = e("mod-news-list");
        t.textContent = "";
        for (const e of p.posts) {
          const o = document.createElement("div");
          o.className = "mod-news-row";
          const n = document.createElement("div");
          n.className = "who";
          const a = document.createElement("strong");
          a.textContent = e.title;
          const r = document.createElement("small");
          ((r.textContent = f(e.time)), n.append(a, r));
          const s = document.createElement("button");
          ((s.type = "button"),
            (s.className = "button small-button"),
            (s.textContent = "Edit"),
            (s.onclick = () => w(e)));
          const i = document.createElement("button");
          ((i.type = "button"),
            (i.className = "button small-button danger"),
            (i.textContent = "Delete"),
            (i.onclick = async () => {
              if (confirm(`Delete "${e.title}"?`)) {
                try {
                  ((p.posts =
                    (await HaloAccount.postNews({ delete: e.id })).posts || []),
                    p.editing === e.id && w(null),
                    Vo("Post deleted."));
                } catch (e) {
                  Vo(e.message, !0);
                }
                A();
              }
            }),
            o.append(n, s, i),
            t.append(o));
        }
      })());
  }
  async function y() {
    try {
      p.posts = (await HaloAccount.news()).posts || [];
    } catch (e) {
      c("news: " + e.message);
    }
    A();
  }
  function w(t) {
    ((p.editing = t ? t.id : null),
      (e("mod-news-title").value = t ? t.title : ""),
      (e("mod-news-body").value = t ? t.body : ""),
      (e("mod-news-submit").textContent = t ? "Save changes" : "Post"),
      (e("mod-news-cancel").hidden = !t),
      t && e("mod-news-title").focus());
  }
  const b = "halo-web-problems",
    v = "halo-web-problems-seen",
    k = "halo-web-device-id",
    C = "halo-web-alive",
    S = {
      sent: 0,
      fps: [],
      hitches: [],
      lastFrame: 0,
      frames: 0,
      second: 0,
      low: 0,
      started: Date.now(),
      gpu: null,
    };
  function L() {
    try {
      let e = localStorage.getItem(k);
      return (
        e ||
          ((e = Array.from(crypto.getRandomValues(new Uint8Array(8)), (e) =>
            e.toString(16).padStart(2, "0"),
          ).join("")),
          localStorage.setItem(k, e)),
        e
      );
    } catch {
      return "";
    }
  }
  function H() {
    if (null !== S.gpu) return S.gpu;
    S.gpu = "";
    try {
      const e =
          document.createElement("canvas").getContext("webgl2") ||
          document.createElement("canvas").getContext("webgl"),
        t = e && e.getExtension("WEBGL_debug_renderer_info");
      S.gpu = e
        ? String(
            t
              ? e.getParameter(t.UNMASKED_RENDERER_WEBGL)
              : e.getParameter(e.RENDERER),
          )
        : "no WebGL";
      const o = e && e.getExtension("WEBGL_lose_context");
      o && o.loseContext();
    } catch {}
    return S.gpu;
  }
  function E() {
    const e = navigator.userAgent,
      t =
        /iPhone|iPad|iPod/.test(e) ||
        ("MacIntel" === navigator.platform && navigator.maxTouchPoints > 1);
    return [
      /iPad/.test(e) || (t && !/iPhone|iPod/.test(e))
        ? "iPad"
        : /iPhone|iPod/.test(e)
          ? "iPhone"
          : /Android/.test(e)
            ? (
                (/Android [^;]*; ([^;)]+)\)/.exec(e) || [])[1] || "Android"
              ).trim()
            : /Mac OS X/.test(e)
              ? "Mac"
              : /Windows/.test(e)
                ? "Windows PC"
                : /CrOS/.test(e)
                  ? "Chromebook"
                  : /Linux/.test(e)
                    ? "Linux PC"
                    : "Device",
      t
        ? "iOS " +
          ((/OS (\d+)[._](\d+)/.exec(e) || []).slice(1).join(".") ||
            (/Version\/(\d+\.\d+)/.exec(e) || [])[1] ||
            "")
        : /Android (\d+(\.\d+)?)/.test(e)
          ? "Android " + /Android (\d+(\.\d+)?)/.exec(e)[1]
          : "",
      /EdgA?\//.test(e)
        ? "Edge"
        : /SamsungBrowser/.test(e)
          ? "Samsung Internet"
          : /CriOS|Chrome\//.test(e)
            ? "Chrome"
            : /FxiOS|Firefox\//.test(e)
              ? "Firefox"
              : /Safari\//.test(e)
                ? "Safari"
                : "Browser",
      navigator.standalone ||
      matchMedia("(display-mode: standalone)").matches ||
      matchMedia("(display-mode: fullscreen)").matches
        ? "app"
        : "browser tab",
    ]
      .filter(Boolean)
      .join(" · ");
  }
  function x() {
    const e = performance.memory
      ? {
          used: performance.memory.usedJSHeapSize,
          limit: performance.memory.jsHeapSizeLimit,
        }
      : null;
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      screen: `${screen.width}x${screen.height} @${window.devicePixelRatio || 1}x`,
      window: `${innerWidth}x${innerHeight}`,
      cores: navigator.hardwareConcurrency || null,
      memoryGB: navigator.deviceMemory || null,
      gpu: H(),
      standalone: !!(
        navigator.standalone ||
        matchMedia("(display-mode: standalone)").matches ||
        matchMedia("(display-mode: fullscreen)").matches
      ),
      isolated: !!window.crossOriginIsolated,
      touch: navigator.maxTouchPoints || 0,
      freeStorage: o.freeBytes || null,
      heap: e,
      gamepads: Array.from(
        (navigator.getGamepads && navigator.getGamepads()) || [],
      )
        .filter(Boolean)
        .map((e) => e.id)
        .slice(0, 4),
    };
  }
  function N() {
    return {
      resolution: a.resolution,
      lowEnd: !!a.lowEnd,
      smallTextures: !!a.smallTextures,
      sharpTextures: !!a.sharpTextures,
      drawPath: a.drawPath || "auto",
      fog: !1 !== a.fog,
      vsync: !!a.vsync,
      touch: !!a.touch,
      touchLayout: a.touchLayout,
      silentSound: !!a.silentSound,
      aimSmoothing: a.aimSmoothing === !0,
      hudLayout: Object.keys(a.hudLayout || {}).length > 0,
    };
  }
  function T() {
    return !!(
      o.started &&
      !document.hidden &&
      o.gameStatus &&
      Date.now() - o.gameStatus.time < 15e3 &&
      document.body.classList.contains("playing") &&
      e("game-menu").hidden &&
      e("fatal").hidden
    );
  }
  function $() {
    const e = performance.now(),
      t = S.lastFrame ? e - S.lastFrame : 0;
    if (((S.lastFrame = e), !T()))
      return ((S.second = e), (S.frames = 0), void (S.low = 0));
    if (t > 250 && t < 3e3) {
      (S.hitches.push({ time: Date.now(), ms: Math.round(t) }),
        S.hitches.length > 60 && S.hitches.shift());
      const e = S.hitches.filter((e) => Date.now() - e.time < 3e4);
      e.length >= 8 &&
        D(
          "stutter",
          `${e.length} hitches in 30 seconds (longest ${Math.max(...e.map((e) => e.ms))} ms)`,
        );
    }
    if ((S.frames++, S.second || (S.second = e), e - S.second >= 1e3)) {
      const t = Math.round((1e3 * S.frames) / (e - S.second));
      if (
        (S.fps.push({ time: Date.now(), fps: t }),
        S.fps.length > 120 && S.fps.shift(),
        (S.low = t < 12 ? S.low + 1 : 0),
        S.low >= 20 &&
          !S.slowHostWarned &&
          wt() &&
          bt() &&
          (HaloNet.status().players || 0) > 0)
      ) {
        S.slowHostWarned = !0;
        const e = S.fps.slice(-20);
        c(
          `slow host: ${Math.round(e.reduce((e, t) => e + t.fps, 0) / e.length)} fps hosting ${HaloNet.status().players} players`,
        );
      }
      if (
        ((S.slow = t < 20 ? (S.slow || 0) + 1 : 0),
        S.slow >= 30 && "auto" === a.resolution && n && !a.lowEnd)
      ) {
        const e = S.fps.slice(-30);
        ((a.lowEnd = !0),
          r(),
          o.shared && Qe(),
          c(
            `low-end mode: ${Math.round(e.reduce((e, t) => e + t.fps, 0) / e.length)} fps at 480 lines: 360 from now on`,
          ),
          h(
            "This device was running slowly, so the game now draws at a lower resolution to run faster. Settings > Resolution changes it.",
            8e3,
          ));
      }
      if (S.low >= 20) {
        const e = S.fps.slice(-20);
        (D(
          "low-fps",
          `${Math.round(e.reduce((e, t) => e + t.fps, 0) / e.length)} fps on average for 20 seconds`,
        ),
          (S.low = 0));
      }
      ((S.frames = 0), (S.second = e));
    }
  }
  function I() {
    try {
      return JSON.parse(localStorage.getItem(b) || "[]") || [];
    } catch {
      return [];
    }
  }
  function M(e) {
    try {
      let t = e.slice(-4);
      for (; t.length && JSON.stringify(t).length > 15e5;) t = t.slice(1);
      localStorage.setItem(b, JSON.stringify(t));
    } catch {}
  }
  const R = new Set();
  function D(e, t, n) {
    const a = (function (e, t) {
      const o = String(t || "")
        .replace(/https?:\/\/\S+/g, "")
        .replace(/0x[0-9a-f]+/gi, "#")
        .replace(/\d+/g, "#")
        .trim()
        .slice(0, 120);
      return "low-fps" === e || "stutter" === e
        ? `${e}:${E().split(" · ").slice(0, 2).join(" ")}`
        : `${e}:${o}`;
    })(e, t);
    if (R.has(a)) return;
    const r = (function () {
        try {
          return JSON.parse(localStorage.getItem(v) || "{}") || {};
        } catch {
          return {};
        }
      })(),
      s = "unsupported" === e ? 2592e6 : 864e5,
      i = !(!n || !n.manual);
    if (!i && (S.sent >= 3 || (r[a] && Date.now() - r[a] < s)))
      return (c(`problem (not sent again): ${e}: ${t}`), void R.add(a));
    (i || S.sent++, (r[a] = Date.now()));
    for (const e of Object.keys(r)) Date.now() - r[e] > 2592e6 && delete r[e];
    try {
      localStorage.setItem(v, JSON.stringify(r));
    } catch {}
    c(`problem: ${e}: ${t}`);
    const d = o.log.length,
      u = {
        kind: e,
        message: String(t || "").slice(0, 500),
        signature: a,
        time: Date.now(),
        build: o.version || "",
        deviceId: L(),
        label: E(),
        device: x(),
        settings: N(),
        game: o.gameStatus
          ? { ...o.gameStatus, age: Date.now() - o.gameStatus.time }
          : null,
        copy: (ce() || {}).name || "",
        started: !!o.started,
        uptime: Date.now() - S.started,
        graphics: o.graphicsCheck || "",
        online: wt() ? "lobby" : St() ? "matchmaking" : "",
        fps: S.fps.slice(-90),
        hitches: S.hitches.slice(-30),
        before: o.log.slice(i ? -100 : -300, -1),
        event: o.log[d - 1],
        after: [],
        ...(n || {}),
      };
    delete u.manual;
    const m = I();
    (m.push(u),
      M(m),
      setTimeout(
        async () => {
          u.after = o.log.slice(d, d + 150);
          try {
            const e = await l();
            u.debug = e
              .slice(Math.min(o.debugStart || 0, e.length))
              .slice(i ? -3e3 : -12e3);
          } catch {}
          (M(I().map((e) => (e.time === u.time && e.signature === a ? u : e))),
            O());
        },
        n && n.now ? 0 : 8e3,
      ));
  }
  async function O() {
    let e = I();
    if (!e.length || O.busy) return;
    if (
      ((O.busy = !0), e.some((e) => void 0 === e.debug && e.time < S.started))
    )
      try {
        const t = await l(),
          n = Math.min(o.debugStart || t.length, t.length),
          a = d(t.slice(0, n)),
          r = t.slice(a.length ? a[a.length - 1] : 0, n).slice(-12e3);
        ((e = e.map((e) =>
          void 0 === e.debug && e.time < S.started ? { ...e, debug: r } : e,
        )),
          M(e));
      } catch {}
    const t = [];
    for (const o of e)
      try {
        await HaloAccount.reportProblem(o);
      } catch (e) {
        /too large|bad request/i.test(e.message) || t.push(o);
      }
    (M(t), (O.busy = !1));
  }
  function P() {
    try {
      T()
        ? localStorage.setItem(
            C,
            JSON.stringify({
              time: Date.now(),
              hidden: document.hidden,
              build: o.version || "",
              game: o.gameStatus,
              fps: S.fps.slice(-30),
              uptime: Date.now() - S.started,
            }),
          )
        : localStorage.removeItem(C);
    } catch {}
  }
  const B = { lines: null, sent: !1 };
  function _(e) {
    const t = String(e);
    (!(function (e) {
      if (B.lines) return void B.lines.push(e.slice(0, 200));
      const t =
        /halo-linux: cannot (compile the (\w+) shader|link a shader program)/.exec(
          e,
        );
      t &&
        !B.sent &&
        ((B.sent = !0),
        (B.lines = [e.slice(0, 300)]),
        setTimeout(() => {
          const e = B.lines;
          B.lines = null;
          const o = e.findIndex((e) => /#version/.test(e));
          D(
            "shader",
            t[2]
              ? `cannot compile a ${t[2]} shader`
              : "cannot link a shader program",
            {
              shader: {
                info: e
                  .slice(0, o > 0 ? o : 4)
                  .join("\n")
                  .slice(0, 2e3),
                source:
                  o > 0
                    ? e
                        .slice(o, o + 400)
                        .join("\n")
                        .slice(0, 3e4)
                    : "",
              },
            },
          );
        }, 1500));
    })(t),
      /graphics self-check "/.test(t) &&
        (o.graphicsCheck = t
          .replace(/^.*graphics self-check /, "")
          .slice(0, 400)));
    (/custom content: \[state\].*\(changed mid-game\)/.test(t) ||
      /custom content: \[state\] camera third person.*character asked [01],.*\(new body\)/.test(
        t,
      )) &&
      "owner" !== jo() &&
      ((/\(changed mid-game\)/.test(t) &&
        Date.now() - (o.staffRulesAt || 0) < 15e3) ||
        D("game-state", t.replace(/^.*\[state\] /, "").slice(0, 300)));
  }
  async function W(t, o = "crash") {
    (c("fatal: " + t),
      D(o, t),
      (e("fatal-text").textContent = t),
      (e("fatal").hidden = !1),
      document.body.classList.remove("playing"));
  }
  function U(t, o, n) {
    const a = document.createElement("div");
    return (
      (a.className = "check" + (t ? "" : "warn" === n ? " warn" : " bad")),
      (a.textContent = o),
      (a.dataset.en = o),
      e("checks").appendChild(a),
      t
    );
  }
  async function F() {
    let n = !0;
    if (!window.isSecureContext) {
      return (
        U(
          !1,
          `This page isn't secure (http). Open ${"https://" + location.host + location.pathname} instead.`,
        ),
        !1
      );
    }
    if (
      ((n =
        U(
          window.crossOriginIsolated && "undefined" != typeof SharedArrayBuffer,
          window.crossOriginIsolated
            ? "Threads (SharedArrayBuffer)"
            : "Threads: unavailable. Reload the page; if this message stays, your browser is too old.",
        ) && n),
      (n =
        U(
          (function () {
            try {
              return (
                "undefined" != typeof OffscreenCanvas &&
                !!new OffscreenCanvas(1, 1).getContext("webgl2")
              );
            } catch {
              return !1;
            }
          })(),
          "Graphics: WebGL 2 in a worker (iOS 17 or later)",
        ) && n),
      (function () {
        try {
          return WebAssembly.validate(
            new Uint8Array([
              0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 123, 3, 2, 1, 0,
              10, 10, 1, 8, 0, 65, 0, 253, 15, 253, 98, 11,
            ]),
          );
        } catch {
          return !1;
        }
      })() ||
        (n =
          U(
            !1,
            "WebAssembly SIMD: not available. Update your browser; on a PC, the processor may be too old (it needs SSE4.1).",
          ) && n),
      (n =
        U(
          !(!navigator.storage || !navigator.storage.getDirectory),
          "Private file storage",
        ) && n),
      n)
    ) {
      let e = null;
      for (const n of [0, 300, 900, 1800]) {
        n && (await new Promise((e) => setTimeout(e, n)));
        try {
          ((o.memory = new WebAssembly.Memory({
            initial: t,
            maximum: t,
            shared: !0,
          })),
            (e = null));
          break;
        } catch (t) {
          e = t;
        }
      }
      e
        ? ((o.memoryShort = !0),
          (n = U(
            !1,
            "Memory: your device didn't have 2.1 GB free for the game just now (" +
              e.message +
              "). Close other tabs and apps, then reload.",
          )))
        : U(!0, "Memory: 2.1 GB reserved");
    }
    if (navigator.storage && navigator.storage.estimate)
      try {
        const t = await navigator.storage.estimate(),
          n = (t.quota || 0) - (t.usage || 0);
        ((e("storage-summary").textContent =
          `Storage: ${(t.usage / 1e9).toFixed(2)} GB used of ${(t.quota / 1e9).toFixed(1)} GB this site may use.`),
          (o.freeBytes = n));
      } catch {}
    return n;
  }
  const G = ["a10.map", "a30.map", "b30.map", "c10.map", "d40.map"];
  async function j(e, t) {
    try {
      return JSON.parse(
        await (await (await e.getFileHandle(t)).getFile()).text(),
      );
    } catch {
      return null;
    }
  }
  function Y(e) {
    if (!e) return "";
    const t = (e.files || []).map((e) => String(e).toLowerCase());
    if (!t.includes("ui.map"))
      return "This copy of the game is missing its menus (ui.map). It is most likely a bad rip of the disc, and the game will probably stay on a black screen. Try another disc image.";
    if (!t.some((e) => e.endsWith(".map") && "ui.map" !== e))
      return "This copy of the game has no levels or multiplayer maps in it. It is most likely a bad rip of the disc, and the game will probably stay on a black screen. Try another disc image.";
    const o = te(e);
    if (o && "damaged" === o.status && o.unmatched.length) {
      return `Some maps in this copy (${o.unmatched.map((e) => e.replace(/\.map$/, "")).join(", ")}) don't match the same maps in other players' copies, though its other maps do. The disc image is most likely a bad rip: those levels may stay on a black screen or crash. Try another disc image.`;
    }
    return "";
  }
  const q = new Set([
    "e348f2b94141",
    "24e16638ea2d",
    "8be88efb8704",
    "34182e84f95d",
    "c97dccdda74b",
  ]);
  /^(127\.0\.0\.1|localhost)$/.test(location.hostname) &&
    "1" === new URLSearchParams(location.search).get("testrefuse") &&
    q.clear();
  const z = "This copy of the game isn't supported",
    J =
      "HCEMobile only accepts verified copies of Halo: Combat Evolved for the original Xbox. This disc image doesn't match one, so it can't be used. For help, join our Discord: discord.gg/HCEMobile";
  async function V(e, t) {
    if (!t) return null;
    const o = Object.keys(t)
      .slice(0, 64)
      .map((o) => ({
        name: String(o)
          .toLowerCase()
          .replace(/[^a-z0-9_.-]/g, "")
          .slice(0, 40),
        size: Math.max(0, Math.min(4e9, Number((e || {})[o]) || 0)),
        crc: String(t[o] || "").toLowerCase(),
      }))
      .filter((e) => e.name.endsWith(".map") && /^[0-9a-f]{8}$/.test(e.crc));
    if (!o.length) return null;
    const n = o
        .map((e) => `${e.name}:${e.size}:${e.crc}`)
        .sort()
        .join("|"),
      a = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(n));
    return [...new Uint8Array(a)]
      .map((e) => e.toString(16).padStart(2, "0"))
      .join("")
      .slice(0, 12);
  }
  function Q(e) {
    return e && e.rip ? (q.has(e.rip) ? "ok" : "unsupported") : "unknown";
  }
  const Z = "halo-web-copy-check",
    X = (() => {
      try {
        return JSON.parse(localStorage.getItem(Z) || "{}") || {};
      } catch {
        return {};
      }
    })(),
    K = {};
  function ee(e) {
    return e.crcs
      ? Object.keys(e.crcs)
          .sort()
          .map((t) => `${t}:${e.crcs[t]}`)
          .join("|")
      : "";
  }
  function te(e) {
    const t = e && X[e.id];
    return t && t.key === ee(e) ? t.result : null;
  }
  function oe(e) {
    if (void 0 !== K[e.id]) return `Checking this copy… ${K[e.id]}%`;
    if ("unsupported" === Q(e))
      return "✕ Not a supported copy: it can't be played";
    const t = te(e);
    return t
      ? "verified" === t.status
        ? "✓ Verified copy" +
          (t.players > 1
            ? `, the same as ${t.players - 1} other player${2 === t.players ? "'s" : "s'"}`
            : "")
        : "damaged" === t.status
          ? `⚠ ${t.unmatched.length} map${1 === t.unmatched.length ? "" : "s"} don't match other players' copies`
          : "A version few players have yet"
      : "";
  }
  let ne = !1;
  async function ae() {
    if (!(ne || o.started || o.importing)) {
      ne = !0;
      try {
        for (const e of o.games) {
          if (o.started) break;
          if (!e.crcs) {
            const t = await re(e);
            if (!t) break;
            ((e.crcs = t.crcs),
              (e.sizes = t.sizes),
              (e.rip = await V(e.sizes, e.crcs).catch(() => null)),
              "unsupported" === Q(e) &&
                c(`copy: ${e.name} is not a supported copy (rip ${e.rip})`));
          }
          const t = ee(e),
            n = X[e.id];
          if (
            HaloAccount.current &&
            !(n && n.key === t && Date.now() - n.at < 864e5)
          ) {
            try {
              const o = Object.keys(e.crcs).map((t) => ({
                  name: t,
                  size: (e.sizes || {})[t] || 0,
                  crc: e.crcs[t],
                })),
                n = await HaloAccount.copyCheck(o);
              X[e.id] = { key: t, at: Date.now(), result: n };
              try {
                localStorage.setItem(Z, JSON.stringify(X));
              } catch {}
              c(
                `copy check: ${e.name}: ${n.status}${n.unmatched && n.unmatched.length ? " (" + n.unmatched.join(", ") + ")" : ""}, rip ${n.rip}`,
              );
            } catch (e) {
              c("copy check: " + e.message);
            }
            se();
          }
        }
      } finally {
        ((ne = !1), se());
      }
    }
  }
  function re(e) {
    return new Promise((t) => {
      const n = new Worker("xiso-worker.js");
      o.hashWorker = n;
      const a = (a) => {
        (n.terminate(),
          o.hashWorker === n && (o.hashWorker = null),
          delete K[e.id],
          t(a));
      };
      ((n.onmessage = (t) => {
        const o = t.data;
        if ("progress" === o.type) {
          const t = Math.floor((100 * o.done) / Math.max(1, o.total));
          t !== K[e.id] && ((K[e.id] = t), se());
        } else
          "done" === o.type
            ? a(o)
            : "error" === o.type && (c("copy check: " + o.message), a(null));
      }),
        (n.onerror = () => a(null)),
        (o.hashWorker.stop = () => a(null)),
        n.postMessage({ op: "hash", target: e.path }));
    });
  }
  function se() {
    for (const e of document.querySelectorAll("#games .game")) {
      const t = o.games.find((t) => t.id === e.dataset.id),
        n = e.querySelector("small");
      if (t && n) {
        const o = oe(t);
        ((n.textContent =
          ie(t) + (t.source ? ` · ${t.source}` : "") + (o ? ` · ${o}` : "")),
          e.classList.toggle(
            "copy-damaged",
            "unsupported" === Q(t) || !(!te(t) || "damaged" !== te(t).status),
          ));
      }
    }
    const t = ce();
    t &&
      !o.copyWarned &&
      (e("data-summary").textContent =
        "unsupported" === Q(t)
          ? `Selected: ${t.name}. ${z}.`
          : Y(t)
            ? `Selected: ${t.name}. This copy looks like a bad rip.`
            : `Selected: ${t.name}`);
  }
  function ie(e) {
    const t = (e.files || []).map((e) => e.toLowerCase());
    return `${G.some((e) => t.includes(e)) ? "Campaign and multiplayer" : "Multiplayer only"} · ${t.length} maps · ${(e.bytes / 1e9).toFixed(2)} GB`;
  }
  function ce() {
    return o.games.find((e) => e.id === a.game) || o.games[0] || null;
  }
  async function le() {
    o.games = await (async function () {
      const e = [];
      let t;
      try {
        t = await navigator.storage.getDirectory();
      } catch {
        return e;
      }
      try {
        const o = await j(await t.getDirectoryHandle("maps"), ".complete");
        o &&
          e.push({
            id: "default",
            name: (a.gameNames && a.gameNames.default) || "Halo",
            files: o.files,
            bytes: o.bytes,
            sizes: o.sizes,
            crcs: o.crcs,
            added: 0,
            path: [],
            dataRoot: "/data",
          });
      } catch {}
      try {
        const n = await t.getDirectoryHandle("games");
        for await (const [t, a] of n.entries()) {
          if ("directory" !== a.kind || t === o.importing) continue;
          let r = null;
          try {
            r = await j(await a.getDirectoryHandle("maps"), ".complete");
          } catch {}
          if (!r) {
            await n.removeEntry(t, { recursive: !0 }).catch(() => {});
            continue;
          }
          const s = (await j(a, "info.json")) || {};
          e.push({
            id: t,
            name: s.name || "Halo",
            source: s.source,
            files: r.files,
            bytes: r.bytes,
            sizes: r.sizes,
            crcs: r.crcs,
            added: s.added || 0,
            path: ["games", t],
            dataRoot: "/data/games/" + t,
          });
        }
      } catch {}
      e.sort((e, t) => e.added - t.added);
      for (const t of e) t.rip = await V(t.sizes, t.crcs).catch(() => null);
      return e;
    })();
    const t = e("games");
    t.textContent = "";
    const n = ce();
    for (const e of o.games) {
      const o = document.createElement("div");
      ((o.className = "game" + (n && e.id === n.id ? " chosen" : "")),
        (o.dataset.id = e.id));
      const s = document.createElement("label");
      s.className = "game-pick";
      const i = document.createElement("input");
      ((i.type = "radio"),
        (i.name = "game"),
        (i.checked = !(!n || e.id !== n.id)),
        (i.onchange = () => {
          ((a.game = e.id), r(), le());
        }));
      const c = document.createElement("span");
      ((c.innerHTML = "<strong></strong><small></small>"),
        (c.querySelector("strong").textContent = e.name),
        (c.querySelector("small").textContent =
          ie(e) + (e.source ? ` · ${e.source}` : "")),
        s.append(i, c));
      const l = document.createElement("button");
      ((l.type = "button"),
        (l.className = "button small-button"),
        (l.textContent = "Rename"),
        (l.onclick = () => ue(e)));
      const d = document.createElement("button");
      ((d.type = "button"),
        (d.className = "button small-button danger"),
        (d.textContent = "Delete"),
        (d.onclick = () => ge(e)),
        o.append(s, l, d),
        t.appendChild(o));
    }
    const s = o.games.length > 0;
    ((e("step-play").hidden = !s || !o.canRun),
      (e("data-intro").hidden = s),
      (e("add-label").textContent = s
        ? "Add another disc image…"
        : "Choose disc image…"),
      e("add-label").classList.toggle("primary", !s),
      n &&
        (e("data-summary").textContent = Y(n)
          ? `Selected: ${n.name}. This copy looks like a bad rip.`
          : `Selected: ${n.name}`),
      (o.copyWarned = !1),
      e("data-summary").classList.remove("copy-warning"),
      (e("play").textContent = "Play"),
      se(),
      setTimeout(() => ae(), 3e3),
      window.HaloLobby &&
        o.lobbyStarted &&
        HaloLobby.mapsFingerprint(n).then((e) => {
          o.lobbyMaps = e;
        }));
  }
  function de(e, t) {
    return new Promise((o, n) => {
      const a = new Worker("xiso-worker.js");
      ((a.onmessage = (e) => {
        const r = e.data;
        "progress" === r.type
          ? t && t(r)
          : "done" === r.type
            ? (a.terminate(), o(r))
            : "error" === r.type && (a.terminate(), n(new Error(r.message)));
      }),
        (a.onerror = (e) => {
          (a.terminate(), n(new Error(e.message || "The copy stopped.")));
        }),
        a.postMessage(e));
    });
  }
  async function ue(e) {
    const t = (prompt("Name this copy of the game:", e.name) || "")
      .trim()
      .slice(0, 60);
    if (t && t !== e.name) {
      if ("default" === e.id)
        ((a.gameNames = { ...(a.gameNames || {}), default: t }), r());
      else
        try {
          await de({ op: "rename", target: e.path, name: t });
        } catch (e) {
          h("Cannot rename it: " + e.message);
        }
      le();
    }
  }
  function me(t) {
    const o = e("import-banner");
    if (
      ((o.hidden = !t),
      o.classList.toggle("done", "done" === t),
      (o.textContent = ""),
      !t)
    )
      return;
    o.append(
      "done" === t
        ? "Complete! Your game is ready to play."
        : "Do not leave this page or close the browser until the process is complete",
    );
    const n = document.createElement("small");
    ((n.textContent =
      "done" === t
        ? "It's saved on this device, so you won't need to add it again."
        : "Leaving, switching apps for long, or locking your phone can stop it, and it will have to start over."),
      o.append(n));
  }
  function he(e) {
    return (e.preventDefault(), (e.returnValue = ""), "");
  }
  async function ge(e) {
    if (
      confirm(
        `Delete ${e.name} (${(e.bytes / 1e9).toFixed(2)} GB)? Its saved games go with it.`,
      )
    ) {
      try {
        const t = await navigator.storage.getDirectory();
        "default" === e.id
          ? await t.removeEntry("maps", { recursive: !0 })
          : await (
              await t.getDirectoryHandle("games")
            ).removeEntry(e.id, { recursive: !0 });
      } catch (e) {
        c("delete: " + e);
      }
      (a.game === e.id && ((a.game = null), r()), le());
    }
  }
  function pe({ title: t, percent: o = null, text: n = "", state: a = "" }) {
    const r = e("progress");
    ((r.hidden = !1),
      r.classList.toggle("waiting", null === o && "" === a),
      r.classList.toggle("failed", "failed" === a),
      r.classList.toggle("done", "done" === a),
      void 0 !== t && (e("progress-title").textContent = t),
      (e("progress-percent").textContent =
        null === o || "failed" === a ? "" : `${Math.floor(o)}%`),
      null !== o &&
        (e("progress-fill").style.width =
          Math.max(0, Math.min(100, o)).toFixed(1) + "%"),
      (e("progress-text").textContent = n));
  }
  async function fe(e) {
    const t = e.target.files && e.target.files[0];
    ((e.target.value = ""), t && (await ye(t, t.name)));
  }
  function Ae() {
    const t = (t) => {
      ((e("link-form").hidden = !t),
        (e("add-label").hidden = t),
        (e("link-open").parentElement.hidden = t),
        t && e("link-url").focus());
    };
    ((e("link-open").onclick = () => t(!0)),
      (e("link-cancel").onclick = () => t(!1)),
      (e("link-form").onsubmit = async (o) => {
        o.preventDefault();
        const n = (function (e) {
          let t;
          try {
            t = new URL(e.trim());
          } catch {
            return { error: "Enter the full link, starting with https://" };
          }
          return "https:" !== t.protocol && "http:" !== t.protocol
            ? { error: "Enter a web link (https://)." }
            : /(^|\.)drive\.google\.com$|(^|\.)docs\.google\.com$/.test(
                  t.hostname,
                )
              ? {
                  error:
                    "Google Drive links can't be read by the browser. Use Dropbox, Amazon S3, Cloudflare R2 or your own web server.",
                }
              : (/(^|\.)dropbox\.com$/.test(t.hostname) &&
                  !/dropboxusercontent\.com$/.test(t.hostname) &&
                  ((t.hostname = "dl.dropboxusercontent.com"),
                  t.searchParams.delete("dl")),
                { url: t.href });
        })(e("link-url").value);
        if (n.error)
          pe({
            title: "Couldn't use that link",
            percent: 0,
            text: n.error,
            state: "failed",
          });
        else {
          e("link-load").disabled = !0;
          try {
            let o = "Halo";
            try {
              o =
                decodeURIComponent(new URL(n.url).pathname.split("/").pop()) ||
                o;
            } catch {}
            (await ye({ url: n.url }, o)) &&
              (t(!1), (e("link-url").value = ""));
          } finally {
            e("link-load").disabled = !1;
          }
        }
      }));
  }
  async function ye(t, n) {
    (void 0 !== o.freeBytes &&
      o.freeBytes < 21e8 &&
      h(
        "There may not be enough free storage for another copy of the game (up to 1.8 GB).",
        6e3,
      ),
      navigator.storage &&
        navigator.storage.persist &&
        navigator.storage.persist().catch(() => {}));
    const s = !o.games.length,
      i = s ? "default" : Date.now().toString(36),
      l =
        n
          .replace(/\.(x?iso)$/i, "")
          .replace(/[_]+/g, " ")
          .trim()
          .slice(0, 60) || "Halo";
    ((e("iso-file").disabled = !0),
      (e("link-open").disabled = !0),
      (o.importing = i),
      tt(!0),
      me("working"),
      window.addEventListener("beforeunload", he));
    let d = !1;
    try {
      const e = await (function (e, t, o) {
        const n = !(e instanceof Blob);
        let a = 0,
          r = 0;
        return (
          pe({
            title: n ? "Connecting to the link" : "Reading the disc image",
            text: n ? "Checking that the link can be downloaded…" : "",
          }),
          de(
            n
              ? { url: e.url, target: t, name: o }
              : { file: e, target: t, name: o },
            (e) => {
              if (e.stage)
                return void pe({
                  title: n ? "Connected" : "Reading the disc image",
                  text: e.stage,
                });
              r || ((r = Date.now()), (a = e.done));
              const t = e.total ? e.done / e.total : 0,
                o = (Date.now() - r) / 1e3,
                s = (e.done - a) / Math.max(o, 0.1),
                i = s > 0 ? (e.total - e.done) / s : 0,
                c = (e) => (e / 1e9).toFixed(2),
                l =
                  s >= 1e6
                    ? `${(s / 1e6).toFixed(1)} MB/s`
                    : `${Math.round(s / 1e3)} KB/s`,
                d =
                  i >= 90
                    ? `about ${Math.ceil(i / 60)} min left`
                    : `about ${Math.max(1, Math.ceil(i))} s left`;
              pe({
                title: n ? "Downloading the maps" : "Copying the maps",
                percent: 100 * t,
                text:
                  `${c(e.done)} of ${c(e.total)} GB` +
                  (o > 3 ? ` · ${l} · ${d}` : "") +
                  ` · maps/${e.file}`,
              });
            },
          )
        );
      })(t, s ? [] : ["games", i], l);
      c(`extracted ${e.files} files, ${e.bytes} bytes`);
      const o = await V(e.sizes, e.crcs).catch(() => null);
      if (!o || !q.has(o))
        return (
          c(`copy: refused ${l} (rip ${o || "unknown"})`),
          await (async function (e) {
            try {
              const t = await navigator.storage.getDirectory();
              "default" === e
                ? await t.removeEntry("maps", { recursive: !0 })
                : await (
                    await t.getDirectoryHandle("games")
                  ).removeEntry(e, { recursive: !0 });
            } catch (e) {
              c("remove copy: " + e);
            }
          })(s ? "default" : i),
          me(""),
          pe({ title: z, percent: 0, text: J, state: "failed" }),
          !1
        );
      (me("done"),
        pe({
          title: "Done",
          percent: 100,
          text: `${e.files} maps, ${(e.bytes / 1e9).toFixed(2)} GB, ready to play.`,
          state: "done",
        }),
        s && (a.gameNames = { ...(a.gameNames || {}), default: l }),
        (a.game = i),
        r(),
        (d = !0));
    } catch (e) {
      (me(""),
        pe({
          title: "Couldn't add it",
          percent: 0,
          text: e.message,
          state: "failed",
        }),
        c("extraction failed: " + e.message));
    } finally {
      (window.removeEventListener("beforeunload", he),
        (o.importing = null),
        tt(!1),
        !1 !== o.canRun &&
          ((e("iso-file").disabled = !1), (e("link-open").disabled = !1)),
        le());
    }
    return d;
  }
  const we = (() => {
    const e = new Uint32Array(256);
    for (let t = 0; t < 256; t++) {
      let o = t;
      for (let e = 0; e < 8; e++) o = 1 & o ? 3988292384 ^ (o >>> 1) : o >>> 1;
      e[t] = o >>> 0;
    }
    return e;
  })();
  function be(e) {
    let t = 4294967295;
    for (let o = 0; o < e.length; o++) t = we[255 & (t ^ e[o])] ^ (t >>> 8);
    return (4294967295 ^ t) >>> 0;
  }
  const ve = /^save\/z\/(cache\d+|characters-\w+|arena-\w+)\.map(\.part)?$/i;
  async function ke() {
    const e = [];
    try {
      let t = await navigator.storage.getDirectory();
      const o = ce();
      for (const e of o ? o.path : []) t = await t.getDirectoryHandle(e);
      await (async function t(o, n) {
        for await (const [a, r] of o.entries())
          "directory" === r.kind
            ? await t(r, n + a + "/")
            : ve.test(n + a) ||
              e.push({
                name: n + a,
                bytes: new Uint8Array(await (await r.getFile()).arrayBuffer()),
              });
      })(await t.getDirectoryHandle("save"), "save/");
      try {
        const o = await (await t.getFileHandle("config.toml")).getFile();
        e.push({
          name: "config.toml",
          bytes: new Uint8Array(await o.arrayBuffer()),
        });
      } catch {}
    } catch {
      return void h("There are no saved games yet.");
    }
    const t = document.createElement("a");
    t.href = URL.createObjectURL(
      (function (e) {
        const t = new TextEncoder(),
          o = [],
          n = [];
        let a = 0;
        for (const { name: r, bytes: s } of e) {
          const e = t.encode(r),
            i = be(s),
            c = new DataView(new ArrayBuffer(30));
          (c.setUint32(0, 67324752, !0),
            c.setUint16(4, 20, !0),
            c.setUint32(14, i, !0),
            c.setUint32(18, s.length, !0),
            c.setUint32(22, s.length, !0),
            c.setUint16(26, e.length, !0),
            o.push(new Uint8Array(c.buffer), e, s));
          const l = new DataView(new ArrayBuffer(46));
          (l.setUint32(0, 33639248, !0),
            l.setUint16(4, 20, !0),
            l.setUint16(6, 20, !0),
            l.setUint32(16, i, !0),
            l.setUint32(20, s.length, !0),
            l.setUint32(24, s.length, !0),
            l.setUint16(28, e.length, !0),
            l.setUint32(42, a, !0),
            n.push(new Uint8Array(l.buffer), e),
            (a += 30 + e.length + s.length));
        }
        const r = n.reduce((e, t) => e + t.length, 0),
          s = new DataView(new ArrayBuffer(22));
        return (
          s.setUint32(0, 101010256, !0),
          s.setUint16(8, e.length, !0),
          s.setUint16(10, e.length, !0),
          s.setUint32(12, r, !0),
          s.setUint32(16, a, !0),
          new Blob([...o, ...n, new Uint8Array(s.buffer)], {
            type: "application/zip",
          })
        );
      })(e),
    );
    const o = ce();
    ((t.download = `halo-saves${o && "default" !== o.id ? "-" + o.name.replace(/[^\w-]+/g, "-") : ""}.zip`),
      document.body.appendChild(t),
      t.click(),
      t.remove(),
      setTimeout(() => URL.revokeObjectURL(t.href), 6e4));
  }
  async function Ce(e) {
    const t = e.target.files && e.target.files[0];
    e.target.value = "";
    const o = ce();
    if (t && o)
      try {
        const e = await (async function (e) {
            const t = new Uint8Array(await e.arrayBuffer()),
              o = new DataView(t.buffer);
            let n = -1;
            for (let e = t.length - 22; e >= Math.max(0, t.length - 65557); e--)
              if (101010256 === o.getUint32(e, !0)) {
                n = e;
                break;
              }
            if (n < 0) throw new Error("This is not a .zip file.");
            const a = o.getUint16(n + 10, !0);
            let r = o.getUint32(n + 16, !0);
            const s = [];
            for (let e = 0; e < a; e++) {
              if (33639248 !== o.getUint32(r, !0))
                throw new Error("The .zip file is damaged.");
              const e = o.getUint16(r + 10, !0),
                n = o.getUint32(r + 20, !0),
                a = o.getUint16(r + 28, !0),
                i = o.getUint16(r + 30, !0),
                c = o.getUint16(r + 32, !0),
                l = o.getUint32(r + 42, !0),
                d = new TextDecoder().decode(t.subarray(r + 46, r + 46 + a));
              if (((r += 46 + a + i + c), d.endsWith("/"))) continue;
              const u =
                l + 30 + o.getUint16(l + 26, !0) + o.getUint16(l + 28, !0);
              let m = t.subarray(u, u + n);
              if (8 === e) {
                const e = new Blob([m])
                  .stream()
                  .pipeThrough(new DecompressionStream("deflate-raw"));
                m = new Uint8Array(await new Response(e).arrayBuffer());
              } else if (0 !== e)
                throw new Error(
                  `${d} uses a compression format that isn't supported.`,
                );
              s.push({ name: d, bytes: m });
            }
            return s;
          })(t),
          n = [];
        for (const { name: t, bytes: o } of e) {
          const e = t.split("/").filter((e) => e && "." !== e && ".." !== e),
            a = e.indexOf("save");
          a >= 0 && e.length > a + 1
            ? ve.test(e.slice(a).join("/")) ||
              n.push({ path: e.slice(a), bytes: o })
            : "config.toml" === e[e.length - 1] &&
              n.push({ path: ["config.toml"], bytes: o });
        }
        if (!n.some((e) => "save" === e.path[0]))
          throw new Error("This .zip file has no save folder.");
        if (
          !confirm(
            `Restore ${n.length} files into ${o.name}? Saved games with the same names are replaced.`,
          )
        )
          return;
        (await de({ op: "write-files", target: o.path, files: n }),
          h(`Restored ${n.length} files into ${o.name}.`),
          c(`restored ${n.length} files from ${t.name}`));
      } catch (e) {
        (h("Cannot restore the saved games: " + e.message, 6e3),
          c("restore: " + e));
      }
  }
  async function Se() {
    if (
      o.games.length &&
      confirm(
        "Delete every copy of the game and the saved games of the copies added after the first?",
      )
    ) {
      try {
        const e = await navigator.storage.getDirectory();
        (await e.removeEntry("maps", { recursive: !0 }).catch(() => {}),
          await e.removeEntry("games", { recursive: !0 }).catch(() => {}));
      } catch {}
      ((a.game = null), r(), le());
    }
  }
  function Le(t, o) {
    const n = e("layout-editor");
    n.hidden = !1;
    const s = (a.touchCustom || {})[t] || {};
    HaloInput.editTouchLayout(n, t, s, a.touchOpacity, (e, s, x) => {
      ((n.hidden = !0),
        (a.touchCustom = { ...(a.touchCustom || {}), [t]: e }),
        (a.touchOpacity = s),
        x && ((a.touchOpacityMode = x.mode), (a.touchButtonOpacity = x.per)),
        r(),
        o && o());
    });
  }
  function He() {
    HaloInput.setTouchLayout(
      a.touchLayout,
      (a.touchCustom || {})[a.touchLayout],
      a.touchOpacity,
    );
  }
  function Ee() {
    ((e("menu-look").value = a.look),
      __lookVal("menu-look", a.look),
      (e("menu-lookf").value = a.lookFilter ?? 0),
      __lookVal("menu-lookf", a.lookFilter ?? 0),
      __gyroUI("menu", a, r),
      (e("menu-coop-row").hidden = !HaloNet.status().room),
      (e("menu-coop").checked = HaloCoop.hosting),
      mt(),
      (e("menu-layout").value = a.touchLayout),
      (e("menu-layout-row").hidden = !HaloInput.isTouchEnabled()),
      (e("menu-silent").checked = a.silentSound),
      (e("menu-hud-lock").checked = a.hudWeaponLock !== !1),
      (e("menu-fps").checked = !!a.showFps),
      (e("menu-ping").checked = !!a.showPing),
      (e("menu-timing").checked = !!a.showTiming));
    const t = e("menu-game");
    t.textContent = "";
    const n = ce();
    for (const e of o.games) {
      const o = document.createElement("option");
      ((o.value = e.id),
        (o.textContent = e.name),
        (o.selected = !(!n || n.id !== e.id)),
        t.appendChild(o));
    }
    ((e("menu-game-row").hidden = o.games.length < 2),
      (e("game-menu").hidden = !1));
  }
  function xe() {
    e("game-menu").hidden = !0;
  }
  const Ne = 1920,
    Te = 1080;
  function $e(t) {
    ((o.photoMode = !!t),
      document.body.classList.toggle("photo-mode", o.photoMode),
      (e("photo-bar").hidden = !o.photoMode),
      (e("photo-ready").hidden = !0),
      De(),
      c("photo mode " + (o.photoMode ? "on" : "off")));
  }
  function Ie(e) {
    return new Promise((t) => {
      const n = e.width,
        a = e.height;
      o.photoFrom = `${n}x${a}`;
      const r = Math.min(n, Math.round((16 * a) / 9)),
        s = Math.min(a, Math.round((9 * n) / 16)),
        i = document.createElement("canvas");
      ((i.width = Ne), (i.height = Te));
      const c = i.getContext("2d");
      ((c.imageSmoothingQuality = "high"),
        c.drawImage(
          e,
          Math.floor((n - r) / 2),
          Math.floor((a - s) / 2),
          r,
          s,
          0,
          0,
          Ne,
          Te,
        ),
        i.toBlob(t, "image/png"));
    });
  }
  async function Me(t) {
    if (
      (/iPhone|iPad|iPod/.test(navigator.userAgent) ||
        ("MacIntel" === navigator.platform && navigator.maxTouchPoints > 1)) &&
      navigator.canShare &&
      navigator.canShare({ files: [t] })
    )
      try {
        return (
          await navigator.share({ files: [t] }),
          void (e("photo-ready").hidden = !0)
        );
      } catch (t) {
        if (t && "AbortError" === t.name)
          return void (e("photo-ready").hidden = !0);
        if (t && "NotAllowedError" === t.name)
          return void (e("photo-ready").hidden = !1);
      }
    const o = URL.createObjectURL(t),
      n = document.createElement("a");
    ((n.href = o),
      (n.download = t.name),
      document.body.appendChild(n),
      n.click(),
      n.remove(),
      setTimeout(() => URL.revokeObjectURL(o), 6e4),
      (e("photo-ready").hidden = !0),
      h("Picture saved.", 2500, "", !0));
  }
  function Re() {
    ((e("menu-photo").onclick = () => {
      (xe(), $e(!0));
    }),
      (e("photo-shot").onclick = (t) => {
        (t.stopPropagation(),
          (async function () {
            if (o.photoBusy || !o.shared) return;
            o.photoBusy = !0;
            const t = e("screen"),
              n = e("photo-flash");
            ((n.hidden = !1),
              n.classList.remove("go"),
              n.offsetWidth,
              n.classList.add("go"),
              setTimeout(() => {
                n.hidden = !0;
              }, 700));
            let a = null;
            try {
              const e = Je(),
                n = e.width / e.height,
                r = Math.max(Te, 2 * Math.ceil(Ne / n / 2)),
                s = { width: 2 * Math.round((r * n) / 2), height: r };
              ((o.photoSize = s),
                Qe(),
                (a = await new Promise((e) => {
                  let n = 0;
                  const a = setTimeout(() => {
                    ((o.photoWaiter = null), Ie(t).then(e));
                  }, 8e3);
                  o.photoWaiter = () => {
                    (t.height === s.height && n++,
                      n >= 3 &&
                        ((o.photoWaiter = null),
                        clearTimeout(a),
                        Ie(t).then(e)));
                  };
                })));
            } catch (e) {
              c("photo: " + e);
            } finally {
              ((o.photoWaiter = null),
                (o.photoSize = null),
                Qe(),
                (o.photoBusy = !1));
            }
            a
              ? (c(
                  `photo: ${Math.round(a.size / 1024)} KB from a ${o.photoFrom} frame`,
                ),
                (o.photoFile = new File(
                  [a],
                  `HCEMobile-${new Date().toISOString().slice(0, 19).replace(/[T:]/g, "-")}.png`,
                  { type: "image/png" },
                )),
                Me(o.photoFile))
              : h("The picture could not be taken.", 3500, "", !0);
          })());
      }),
      (e("photo-exit").onclick = (e) => {
        (e.stopPropagation(), $e(!1));
      }),
      (e("photo-save").onclick = () => {
        o.photoFile && Me(o.photoFile);
      }));
    for (const t of ["photo-bar", "photo-ready"])
      for (const o of [
        "touchstart",
        "touchmove",
        "touchend",
        "pointerdown",
        "pointerup",
        "mousedown",
      ])
        e(t).addEventListener(o, (e) => e.stopPropagation(), { passive: !0 });
  }
  function De() {
    if (!o.shared || !o.offsets || void 0 === o.offsets.menuOptions) return;
    const e = new Int32Array(o.memory.buffer);
    Atomics.store(
      e,
      Ve("menuOptions"),
      (!1 === a.menuScene ? 1 : 0) |
        (!1 === a.menuMusic ? 2 : 0) |
        (o.photoMode ? 4 : 0) |
        (o.hudPreview ? 8 : 0) |
        16,
    );
  }
  const Oe = [
    { key: "shields", name: "Shields and health" },
    { key: "radar", name: "Radar" },
    { key: "weapon", name: "Weapon and ammo" },
    { key: "grenades", name: "Grenades" },
    { key: "crosshair", name: "Crosshair", sizeOnly: !0 },
    { key: "messages", name: "Messages" },
    { key: "score", name: "Scores" },
    { key: "flashlight", name: "Flashlight" },
  ];
  function Pe() {
    if (!o.shared || !o.offsets || void 0 === o.offsets.hudLayout) return;
    const e = new Int32Array(o.memory.buffer),
      t = Ve("hudLayout"),
      n = a.hudLayout || {};
    Oe.forEach((a, r) => {
      if (r >= o.offsets.hudPieces) return;
      const s = n[a.key] || {};
      (Atomics.store(
        e,
        t + 3 * r,
        a.sizeOnly ? 0 : Math.round(1e3 * (s.x || 0)),
      ),
        Atomics.store(
          e,
          t + 3 * r + 1,
          a.sizeOnly ? 0 : Math.round(1e3 * (s.y || 0)),
        ),
        Atomics.store(e, t + 3 * r + 2, Math.round(1e3 * (s.s || 1))));
    });
  }
  function __hudLockInit() {
    var W = Oe.findIndex(function (p) {
      return p.key === "weapon";
    });
    if (W < 0) return;
    var last = null;
    function rd() {
      if (
        !o.shared ||
        !o.offsets ||
        void 0 === o.offsets.hudBoxes ||
        void 0 === o.offsets.hudLayout ||
        W >= o.offsets.hudPieces
      )
        return null;
      var m = new Int32Array(o.memory.buffer),
        b = Ve("hudBoxes") + 4 * W,
        sc = Ve("hudScreen"),
        n = Atomics.load(m, sc),
        h = Atomics.load(m, sc + 1);
      if (n <= 0 || h <= 0) return null;
      var L = m[b],
        T = m[b + 1],
        R = m[b + 2],
        B = m[b + 3];
      if (R <= L || B <= T) return null;
      var l = Ve("hudLayout") + 3 * W;
      var ax = Atomics.load(m, l) / 1e3,
        ay = Atomics.load(m, l + 1) / 1e3;
      return {
        L: L / n,
        T: T / h,
        R: R / n,
        B: B / h,
        ax: ax,
        ay: ay,
        m: m,
        l: l,
      };
    }
    window.__hudLockSave = function () {
      var lay = a.hudLayout || {},
        w = lay.weapon;
      var b = rd();
      if (!b || !w || (!w.x && !w.y)) {
        delete a.hudWeaponRef;
        return;
      }
      a.hudWeaponRef = { x: b.L, y: b.B, sx: w.x || 0, sy: w.y || 0 };
    };
    function tick() {
      try {
        var b = rd(),
          ref = a.hudWeaponRef,
          w = (a.hudLayout || {}).weapon;
        if (b && window.__hudBoxDebug) {
          var k = [b.L, b.T, b.R, b.B, b.ax, b.ay]
            .map(function (v) {
              return v.toFixed(3);
            })
            .join(",");
          if (k !== last) {
            last = k;
            console.log("[hudBox] weapon L,T,R,B,offX,offY =", k);
          }
        }
        if (
          b &&
          ref &&
          w &&
          a.hudWeaponLock !== !1 &&
          !o.hudPreview &&
          ref.sx === (w.x || 0) &&
          ref.sy === (w.y || 0)
        ) {
          var nx = ref.x - (b.L - b.ax),
            ny = ref.y - (b.B - b.ay);
          if (Math.abs(nx - ref.sx) < 0.35 && Math.abs(ny - ref.sy) < 0.5) {
            var X = Math.round(1e3 * nx),
              Y = Math.round(1e3 * ny);
            if (
              Math.abs(X - Atomics.load(b.m, b.l)) > 1 ||
              Math.abs(Y - Atomics.load(b.m, b.l + 1)) > 1
            ) {
              (Atomics.store(b.m, b.l, X), Atomics.store(b.m, b.l + 1, Y));
            }
          }
        }
      } catch (e) {}
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(__hudLockInit);
  function Be() {
    const t = e("screen"),
      o = t.getBoundingClientRect();
    if (!(t.width > 0 && t.height > 0 && o.width > 0 && o.height > 0)) return o;
    const n = Math.min(o.width / t.width, o.height / t.height),
      a = t.width * n,
      r = t.height * n;
    return {
      left: o.left + (o.width - a) / 2,
      top: o.top + (o.height - r) / 2,
      width: a,
      height: r,
      right: o.left + (o.width + a) / 2,
      bottom: o.top + (o.height + r) / 2,
    };
  }
  function _e() {
    if (!o.started) return;
    const t = e("hud-editor");
    ((t.hidden = !1), (t.textContent = ""));
    const n = JSON.parse(JSON.stringify(a.hudLayout || {})),
      s = new Map();
    ((o.hudPreview = !0), De());
    const i = document.createElement("div");
    ((i.className = "editor-bar hud-editor-bar"),
      (i.innerHTML =
        '<div class="editor-bar-header" data-drag><span class="editor-title">HUD layout</span></div><div class="editor-tools"><span class="hud-editor-name" data-name>Tap a piece of the HUD to move or size it</span><div class="editor-row"><div class="editor-row-head"><span class="editor-row-label">Size</span><span class="editor-row-value" data-sv>—</span></div><input type="range" min="0.5" max="2.5" step="0.05" value="1" data-size disabled aria-label="Size"></div><div class="editor-actions"><button type="button" class="editor-action" data-reset>Reset</button><button type="button" class="button small-button primary" data-done>Done</button></div></div>'),
      t.appendChild(i));
    (() => {
      const H = i.querySelector("[data-drag]"),
        V = i.querySelector("[data-sv]"),
        S = i.querySelector("[data-size]"),
        U = () => {
          V.textContent = S.disabled
            ? "—"
            : Math.round(100 * parseFloat(S.value)) + "%";
        };
      S.addEventListener("input", U);
      new MutationObserver(U).observe(S, { attributes: !0 });
      setInterval(() => {
        i.isConnected && U();
      }, 250);
      H.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        e.stopPropagation();
        H.setPointerCapture(e.pointerId);
        const r = i.getBoundingClientRect(),
          gx = e.clientX - r.left,
          gy = e.clientY - r.top;
        i.style.transform = "none";
        i.style.bottom = "auto";
        i.style.left = r.left + "px";
        i.style.top = r.top + "px";
        i.classList.add("dragging");
        const m = (e) => {
            const r = i.getBoundingClientRect();
            i.style.left =
              Math.min(innerWidth - r.width - 4, Math.max(4, e.clientX - gx)) +
              "px";
            i.style.top =
              Math.min(
                innerHeight - H.offsetHeight - 4,
                Math.max(4, e.clientY - gy),
              ) + "px";
          },
          q = () => {
            i.classList.remove("dragging");
            H.removeEventListener("pointermove", m);
            H.removeEventListener("pointerup", q);
            H.removeEventListener("pointercancel", q);
          };
        H.addEventListener("pointermove", m);
        H.addEventListener("pointerup", q);
        H.addEventListener("pointercancel", q);
      });
    })();
    const l = i.querySelector("[data-size]"),
      d = i.querySelector("[data-name]");
    let u = null;
    const m = () => {
      ((a.hudLayout = n), Pe());
    };
    m();
    const h = (e) => {
      (u && s.get(u) && s.get(u).classList.remove("editing"), (u = e));
      const t = Oe.find((t) => t.key === e);
      if (!t)
        return (
          (l.disabled = !0),
          void (d.textContent = "Tap a piece of the HUD to move or size it")
        );
      (s.get(e).classList.add("editing"),
        (l.disabled = !1),
        (l.value = (n[e] && n[e].s) || 1),
        (d.textContent = t.name + (t.sizeOnly ? " (size only)" : "")));
    };
    for (const e of Oe) {
      const o = document.createElement("div");
      ((o.className = "hud-piece"),
        (o.dataset.piece = e.key),
        (o.hidden = !0),
        (o.innerHTML = `<span class="hud-piece-name">${e.name}</span>`),
        t.appendChild(o),
        s.set(e.key, o),
        o.addEventListener("pointerdown", (t) => {
          if ((t.preventDefault(), t.stopPropagation(), h(e.key), e.sizeOnly))
            return;
          o.setPointerCapture(t.pointerId);
          const a = Be(),
            r = t.clientX,
            s = t.clientY,
            i = (n[e.key] && n[e.key].x) || 0,
            c = (n[e.key] && n[e.key].y) || 0,
            l = o.getBoundingClientRect(),
            d = {
              left: (a.left - (l.left + 6)) / a.width,
              right: (a.right - (l.right - 6)) / a.width,
              top: (a.top - (l.top + 6)) / a.height,
              bottom: (a.bottom - (l.bottom - 6)) / a.height,
            },
            u = (t) => {
              const o = Math.min(
                  d.right,
                  Math.max(d.left, (t.clientX - r) / a.width),
                ),
                l = Math.min(
                  d.bottom,
                  Math.max(d.top, (t.clientY - s) / a.height),
                ),
                u = Math.min(1, Math.max(-1, i + o)),
                h = Math.min(1, Math.max(-1, c + l));
              ((n[e.key] = { ...(n[e.key] || {}), x: u, y: h }), m());
            },
            g = () => {
              (o.removeEventListener("pointermove", u),
                o.removeEventListener("pointerup", g),
                o.removeEventListener("pointercancel", g));
            };
          (o.addEventListener("pointermove", u),
            o.addEventListener("pointerup", g),
            o.addEventListener("pointercancel", g));
        }));
    }
    ((t.onpointerdown = (e) => {
      e.target === t && h(null);
    }),
      (l.oninput = () => {
        u && ((n[u] = { ...(n[u] || {}), s: parseFloat(l.value) }), m());
      }),
      (i.querySelector("[data-reset]").onclick = () => {
        for (const e of Object.keys(n)) delete n[e];
        (m(), h(null));
      }));
    let g = !0;
    const p = new Map(),
      f = () => {
        if (!g) return;
        const e = (function () {
            if (!o.shared || !o.offsets || void 0 === o.offsets.hudBoxes)
              return [];
            const e = new Int32Array(o.memory.buffer),
              t = Ve("hudBoxes"),
              n = Atomics.load(e, Ve("hudScreen")),
              a = Atomics.load(e, Ve("hudScreen") + 1);
            if (n <= 0 || a <= 0) return [];
            const r = Be();
            return Oe.map((s, i) => {
              if (i >= o.offsets.hudPieces) return null;
              const c = e[t + 4 * i],
                l = e[t + 4 * i + 1],
                d = e[t + 4 * i + 2],
                u = e[t + 4 * i + 3];
              return d < c || u < l
                ? null
                : {
                    left: r.left + (c / n) * r.width,
                    top: r.top + (l / a) * r.height,
                    width: Math.max(8, ((d - c) / n) * r.width),
                    height: Math.max(8, ((u - l) / a) * r.height),
                  };
            });
          })(),
          t = Date.now();
        (Oe.forEach((o, n) => {
          const a = s.get(o.key);
          let r = e[n];
          (r
            ? p.set(o.key, { box: r, at: t })
            : p.has(o.key) &&
              t - p.get(o.key).at < 8e3 &&
              (r = p.get(o.key).box),
            a.classList.toggle("stale", !e[n]),
            (a.hidden = !r),
            r &&
              ((a.style.left = r.left - 6 + "px"),
              (a.style.top = r.top - 6 + "px"),
              (a.style.width = `${r.width + 12}px`),
              (a.style.height = `${r.height + 12}px`)));
        }),
          requestAnimationFrame(f));
      };
    (requestAnimationFrame(f),
      (i.querySelector("[data-done]").onclick = () => {
        ((g = !1),
          (t.hidden = !0),
          (t.textContent = ""),
          (o.hudPreview = !1),
          De(),
          (a.hudLayout = n),
          window.__hudLockSave && window.__hudLockSave(),
          r(),
          Pe(),
          c(
            "HUD layout: " +
              (Object.keys(n).length
                ? JSON.stringify(n)
                : "as the game draws it"),
          ));
      }));
  }
  function We() {
    (e("menu-scene").setAttribute("aria-pressed", String(!1 !== a.menuScene)),
      e("menu-music").setAttribute("aria-pressed", String(!1 !== a.menuMusic)),
      (e("menu-scene").title =
        !1 !== a.menuScene ? "Hide the background" : "Show the background"),
      (e("menu-music").title =
        !1 !== a.menuMusic ? "Turn the music off" : "Turn the music on"));
  }
  function Ue() {
    (De(),
      We(),
      (e("menu-scene").onclick = () => {
        ((a.menuScene = !1 === a.menuScene), r(), De(), We());
      }),
      (e("menu-music").onclick = () => {
        ((a.menuMusic = !1 === a.menuMusic), r(), De(), We());
      }),
      setInterval(() => {
        if (!o.shared || !o.offsets || void 0 === o.offsets.mainMenuUp) return;
        De();
        const t = !(
          1 & ~Atomics.load(new Int32Array(o.memory.buffer), Ve("mainMenuUp"))
        );
        ((e("menu-options").hidden = !t),
          document.body.classList.toggle("at-menus", t));
      }, 400),
      Re(),
      (e("menu-button").hidden = !1),
      (e("menu-button").onclick = Ee),
      (e("menu-resume").onclick = xe),
      (e("menu-coop").onchange = (e) => HaloCoop.setHosting(e.target.checked)),
      e("game-menu").addEventListener("click", (t) => {
        t.target === e("game-menu") && xe();
      }),
      (e("menu-look").oninput = (e) => {
        ((a.look = parseFloat(e.target.value)),
          __lookVal("menu-look", a.look),
          r(),
          HaloInput.setLookSensitivity(a.look),
          HaloInput.setLookFilter(a.lookFilter ?? 0));
      }),
      (e("menu-lookf").oninput = (e) => {
        ((a.lookFilter = parseFloat(e.target.value)),
          __lookVal("menu-lookf", a.lookFilter),
          r(),
          HaloInput.setLookFilter(a.lookFilter));
      }),
      (e("menu-layout").onchange = (e) => {
        ((a.touchLayout = e.target.value), r(), He());
      }),
      (e("menu-edit-layout").onclick = () => {
        (xe(),
          document.body.classList.add("unified-edit"),
          Le(a.touchLayout, He),
          _e());
        const L = e("layout-editor"),
          UE = window.__ueUnify && window.__ueUnify(),
          O = new MutationObserver(() => {
            if (L.hidden) {
              (O.disconnect(),
                UE && UE(),
                document.body.classList.remove("unified-edit"));
              const d = document.querySelector("#hud-editor [data-done]");
              d && d.click();
            }
          });
        O.observe(L, { attributes: !0, attributeFilter: ["hidden"] });
      }),
      (e("menu-silent").onchange = (e) =>
        (function (e) {
          if (((a.silentSound = e), r(), e))
            o.silentAudio ? o.silentAudio.play().catch(() => {}) : at();
          else {
            try {
              navigator.audioSession && (navigator.audioSession.type = "auto");
            } catch {}
            o.silentAudio && o.silentAudio.pause();
          }
        })(e.target.checked)),
      (window.__fpsCfg = { get: () => a, save: r }),
      (e("menu-hud-lock").onchange = (e) => {
        ((a.hudWeaponLock = e.target.checked),
          r(),
          window.__hudLockSave && window.__hudLockSave(),
          Pe(),
          c("weapon HUD lock " + (a.hudWeaponLock ? "on" : "off")));
      }));
    for (const [t, o] of [
      ["menu-fps", "showFps"],
      ["menu-ping", "showPing"],
      ["menu-timing", "showTiming"],
    ])
      e(t).onchange = (e) => {
        ((a[o] = e.target.checked), r(), Xe());
      };
    ((e("menu-switch-game").onclick = () => {
      ((a.game = e("menu-game").value), r(), location.reload());
    }),
      (e("menu-quit").onclick = () => location.reload()),
      (e("menu-graphics-report").onclick = () => {
        (xe(),
          (async function () {
            if (!o.started || !o.shared)
              return void h(
                "Start the game first, then use this while it looks wrong.",
                5e3,
              );
            if (o.graphicsReportAt && Date.now() - o.graphicsReportAt < 6e4)
              return void h("A report was sent a moment ago. Thanks!", 4e3);
            let t = "";
            try {
              t = String(
                window.prompt("What looks wrong? (optional)", "") || "",
              ).slice(0, 300);
            } catch {}
            let n = "";
            try {
              const t = e("screen"),
                o = t.width,
                a = t.height;
              if (o && a) {
                for (const [e, r] of [
                  [640, 0.7],
                  [640, 0.5],
                  [480, 0.5],
                  [360, 0.4],
                ]) {
                  const s = document.createElement("canvas"),
                    i = Math.min(1, e / o);
                  if (
                    ((s.width = Math.max(1, Math.round(o * i))),
                    (s.height = Math.max(1, Math.round(a * i))),
                    s.getContext("2d").drawImage(t, 0, 0, s.width, s.height),
                    (n = s.toDataURL("image/jpeg", r)),
                    n.length <= 9e4)
                  )
                    break;
                }
                n.length > 9e4 && (n = "");
              }
            } catch (e) {
              c("graphics report: no picture: " + e.message);
            }
            ((o.graphicsReportAt = Date.now()),
              D("graphics", t || "The player says the graphics look wrong", {
                screenshot: n,
                note: t,
                drawPath: a.drawPath || "auto",
                manual: !0,
                now: !0,
                signature: "graphics:" + Date.now(),
              }),
              h("Thanks! Your graphics report is on its way.", 5e3));
          })());
      }),
      (e("menu-copy-log").onclick = async () => {
        try {
          (await navigator.clipboard.writeText(await u()),
            h("The log is copied."));
        } catch {
          h("Could not copy the log.");
        }
      }));
  }
  const Fe = "launcher-background.jpg",
    Ge = window.__haloBackdropFrame || 720;
  function je(e) {
    (o.presented !== Ge || o.hasBackdrop || Ye(e),
      HaloCoop.streaming && HaloCoop.frame(e),
      (o.presented = (o.presented || 0) + 1),
      $(),
      o.photoWaiter && o.photoWaiter());
  }
  function Ye(e) {
    try {
      const t = new OffscreenCanvas(e.width, e.height);
      (t.getContext("2d").drawImage(e, 0, 0),
        (o.hasBackdrop = !0),
        t
          .convertToBlob({ type: "image/jpeg", quality: 0.82 })
          .then(async (e) => {
            const t = new Uint8Array(await e.arrayBuffer());
            (await de({
              op: "write-files",
              target: [],
              files: [{ path: [Fe], bytes: t }],
            }),
              c("start page background saved"));
          })
          .catch((e) => c("background: " + e)));
    } catch (e) {
      c("background: " + e);
    }
  }
  const qe = "halo-web-welcomed";
  function ze() {
    if (window.__haloLines) return window.__haloLines;
    const e = Math.max(1, Math.min(window.innerWidth, window.innerHeight)),
      t = Math.round(e * (window.devicePixelRatio || 1));
    let o;
    return (
      (o =
        "native" === a.resolution
          ? t
          : "auto" === a.resolution
            ? a.lowEnd
              ? 360
              : n || a.smallTextures
                ? 480
                : Math.min(t, 1080)
            : Number(a.resolution) || 480),
      -2 & Math.max(360 === o ? 360 : 480, Math.min(2160, o))
    );
  }
  function Je() {
    if (o.photoSize) return o.photoSize;
    const e = (e, t) => Math.abs(e - t) <= 8,
      t =
        e(window.innerWidth, screen.width) ||
        e(window.innerHeight, screen.height) ||
        e(window.innerWidth, screen.height) ||
        e(window.innerHeight, screen.width),
      a =
        n && t && screen.width > 0 && screen.height > 0
          ? [screen.width, screen.height]
          : [window.innerWidth, window.innerHeight],
      r = Math.max(a[0], a[1]),
      s = Math.max(1, Math.min(a[0], a[1])),
      i = ze();
    return {
      width: -2 & Math.min(Math.round((i * r) / s), Math.round(2.4 * i)),
      height: i,
    };
  }
  function Ve(e) {
    return (o.shared + o.offsets[e]) >> 2;
  }
  function Qe() {
    const t = new Int32Array(o.memory.buffer),
      { width: n, height: a } = Je();
    (Atomics.store(t, Ve("displayWidth"), n),
      Atomics.store(t, Ve("displayHeight"), a),
      (e("rotate").hidden = !(
        o.started && window.innerHeight > window.innerWidth
      )));
  }
  function Ze() {
    const e = new Int32Array(o.memory.buffer);
    ((e[Ve("coopFullViews")] = HaloCoop.fullViews() ? 1 : 0),
      Atomics.add(e, Ve("frameCounter"), 1),
      Atomics.notify(e, Ve("frameCounter")),
      HaloInput.pollGamepads(),
      requestAnimationFrame(Ze));
  }
  function Xe() {
    (a.showFps || a.showPing || a.showTiming) && o.started
      ? (function () {
          const t = e("fps");
          if (((t.hidden = !1), o.frameRateTimer)) return;
          let n = 0,
            r = 0,
            s = performance.now();
          const i = () => {
            (r++, requestAnimationFrame(i));
          };
          (requestAnimationFrame(i),
            (o.frameRateTimer = setInterval(() => {
              const e = performance.now(),
                i = (e - s) / 1e3,
                c = (o.presented || 0) - n,
                l = [];
              if (
                ((a.showFps || a.showTiming) &&
                  l.push(
                    `${Math.round(c / i)} fps` +
                      (a.showTiming
                        ? ` · display ${Math.round(r / i)} Hz`
                        : ""),
                  ),
                a.showPing)
              ) {
                const e = (function () {
                  const e = HaloNet.connections().filter(
                    (e) => null !== e.rtt && void 0 !== e.rtt,
                  );
                  if (!e.length) return null;
                  const t = Fn.room && zn() ? Fn.gameHost : wt() ? Jt() : "",
                    o = Dn().toLowerCase();
                  if (t && t.toLowerCase() !== o) {
                    const o = e.find(
                      (e) => e.name.toLowerCase() === t.toLowerCase(),
                    );
                    if (o) return { ms: Math.round(o.rtt), to: "host" };
                  }
                  return t && t.toLowerCase() === o
                    ? {
                        ms: Math.round(Math.max(...e.map((e) => e.rtt))),
                        to: "players",
                      }
                    : {
                        ms: Math.round(Math.min(...e.map((e) => e.rtt))),
                        to: "",
                      };
                })();
                l.push(
                  e
                    ? `ping ${e.ms} ms${"players" === e.to ? " (hosting)" : ""}`
                    : "ping: offline",
                );
              }
              (a.showTiming &&
                (o.timing && l.push(o.timing),
                o.glTiming && l.push(o.glTiming)),
                (t.textContent = l.join("\n")),
                (t.hidden = !l.length),
                (n = o.presented || 0),
                (r = 0),
                (s = e));
            }, 1e3)));
        })()
      : (e("fps").hidden = !0);
  }
  function Ke() {
    if (!o.shared) return;
    const e = new Int32Array(o.memory.buffer),
      t = document.hidden ? 1 : 0;
    (Atomics.store(e, Ve("pageHidden"), t),
      Atomics.notify(e, Ve("frameCounter")),
      o.audio &&
        (t
          ? o.audio.suspend().catch(() => {})
          : o.audio.resume().catch(() => {})),
      o.silentAudio &&
        (t ? o.silentAudio.pause() : o.silentAudio.play().catch(() => {})),
      t || ot());
  }
  const et =
    "data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAZ0bW9vdgAAAGxtdmhkAAAAAAAAAAAAAAAAAAAD6AAAB9AAAQAAAQAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwAAApl0cmFrAAAAXHRraGQAAAADAAAAAAAAAAAAAAABAAAAAAAAB9AAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAABAAAAAQAAAAAAAkZWR0cwAAABxlbHN0AAAAAAAAAAEAAAfQAAAAAAABAAAAAAIRbWRpYQAAACBtZGhkAAAAAAAAAAAAAAAAAAAoAAAAUABVxAAAAAAALWhkbHIAAAAAAAAAAHZpZGUAAAAAAAAAAAAAAABWaWRlb0hhbmRsZXIAAAABvG1pbmYAAAAUdm1oZAAAAAEAAAAAAAAAAAAAACRkaW5mAAAAHGRyZWYAAAAAAAAAAQAAAAx1cmwgAAAAAQAAAXxzdGJsAAAAuHN0c2QAAAAAAAAAAQAAAKhhdmMxAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAABAAEABIAAAASAAAAAAAAAABFUxhdmM2MC4zMS4xMDIgbGlieDI2NAAAAAAAAAAAAAAAGP//AAAALmF2Y0MBQsAK/+EAFmdCwArZHsBEAAADAAQAAAMAKDxImSABAAVoy4PEyAAAABBwYXNwAAAAAQAAAAEAAAAUYnRydAAAAAAAAAuIAAALiAAAABhzdHRzAAAAAAAAAAEAAAAKAAAIAAAAABRzdHNzAAAAAAAAAAEAAAABAAAAHHN0c2MAAAAAAAAAAQAAAAEAAAABAAAAAQAAADxzdHN6AAAAAAAAAAAAAAAKAAAChgAAAAsAAAALAAAACgAAAAoAAAAKAAAACgAAAAoAAAAKAAAACgAAADhzdGNvAAAAAAAAAAoAAAa5AAAJRwAACVoAAAlpAAAJewAACYkAAAmbAAAJqQAACbsAAAnNAAADBXRyYWsAAABcdGtoZAAAAAMAAAAAAAAAAAAAAAIAAAAAAAAH0AAAAAAAAAAAAAAAAQEAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAACRlZHRzAAAAHGVsc3QAAAAAAAAAAQAAB9AAAAQAAAEAAAAAAn1tZGlhAAAAIG1kaGQAAAAAAAAAAAAAAAAAAB9AAABCgFXEAAAAAAAtaGRscgAAAAAAAAAAc291bgAAAAAAAAAAAAAAAFNvdW5kSGFuZGxlcgAAAAIobWluZgAAABBzbWhkAAAAAAAAAAAAAAAkZGluZgAAABxkcmVmAAAAAAAAAAEAAAAMdXJsIAAAAAEAAAHsc3RibAAAAH5zdHNkAAAAAAAAAAEAAABubXA0YQAAAAAAAAABAAAAAAAAAAAAAQAQAAAAAB9AAAAAAAA2ZXNkcwAAAAADgICAJQACAASAgIAXQBUAAAAAAB9AAAABPwWAgIAFFYhW5QAGgICAAQIAAAAUYnRydAAAAAAAAB9AAAABPwAAACBzdHRzAAAAAAAAAAIAAAAQAAAEAAAAAAEAAAKAAAAAfHN0c2MAAAAAAAAACQAAAAEAAAABAAAAAQAAAAIAAAACAAAAAQAAAAQAAAABAAAAAQAAAAUAAAACAAAAAQAAAAYAAAABAAAAAQAAAAcAAAACAAAAAQAAAAgAAAABAAAAAQAAAAkAAAACAAAAAQAAAAsAAAABAAAAAQAAAFhzdHN6AAAAAAAAAAAAAAARAAAAFQAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAA8c3RjbwAAAAAAAAALAAAGpAAACT8AAAlSAAAJZQAACXMAAAmFAAAJkwAACaUAAAmzAAAJxQAACdcAAAAac2dwZAEAAAByb2xsAAAAAgAAAAH//wAAABxzYmdwAAAAAHJvbGwAAAABAAAAEQAAAAEAAABidWR0YQAAAFptZXRhAAAAAAAAACFoZGxyAAAAAAAAAABtZGlyYXBwbAAAAAAAAAAAAAAAAC1pbHN0AAAAJal0b28AAAAdZGF0YQAAAAEAAAAATGF2ZjYwLjE2LjEwMAAAAAhmcmVlAAADP21kYXTeAgBMYXZjNjAuMzEuMTAyAAIwQA4AAAJyBgX//27cRem95tlIt5Ys2CDZI+7veDI2NCAtIGNvcmUgMTY0IHIzMTA4IDMxZTE5ZjkgLSBILjI2NC9NUEVHLTQgQVZDIGNvZGVjIC0gQ29weWxlZnQgMjAwMy0yMDIzIC0gaHR0cDovL3d3dy52aWRlb2xhbi5vcmcveDI2NC5odG1sIC0gb3B0aW9uczogY2FiYWM9MCByZWY9MyBkZWJsb2NrPTE6LTM6LTMgYW5hbHlzZT0weDE6MHgxMTEgbWU9aGV4IHN1Ym1lPTcgcHN5PTEgcHN5X3JkPTIuMDA6MC43MCBtaXhlZF9yZWY9MSBtZV9yYW5nZT0xNiBjaHJvbWFfbWU9MSB0cmVsbGlzPTEgOHg4ZGN0PTAgY3FtPTAgZGVhZHpvbmU9MjEsMTEgZmFzdF9wc2tpcD0xIGNocm9tYV9xcF9vZmZzZXQ9LTQgdGhyZWFkcz0xIGxvb2thaGVhZF90aHJlYWRzPTEgc2xpY2VkX3RocmVhZHM9MCBucj0wIGRlY2ltYXRlPTEgaW50ZXJsYWNlZD0wIGJsdXJheV9jb21wYXQ9MCBjb25zdHJhaW5lZF9pbnRyYT0wIGJmcmFtZXM9MCB3ZWlnaHRwPTAga2V5aW50PTI1MCBrZXlpbnRfbWluPTUgc2NlbmVjdXQ9NDAgaW50cmFfcmVmcmVzaD0wIHJjX2xvb2thaGVhZD00MCByYz1jcmYgbWJ0cmVlPTEgY3JmPTIzLjAgcWNvbXA9MC42MCBxcG1pbj0wIHFwbWF4PTY5IHFwc3RlcD00IGlwX3JhdGlvPTEuNDAgYXE9MToxLjIwAIAAAAAMZYiEBTOcmKAAP7+AARggBwEYIAcAAAAHQZo4Cmc6gAEYIAcBGCAHAAAAB0GaVAKZzqABGCAHAAAABkGaYBTOdQEYIAcBGCAHAAAABkGagBTOdQEYIAcAAAAGQZqgFM51ARggBwEYIAcAAAAGQZrAFM51ARggBwAAAAZBmuAUznUBGCAHARggBwAAAAZBmwATznUBGCAHARggBwAAAAZBmyASznUBGCAH";
  async function tt(e) {
    const t =
      o.awake || (o.awake = { lock: null, asking: null, video: null, on: !1 });
    if (((t.on = e), !e)) {
      const e = t.lock;
      ((t.lock = null),
        t.video &&
          (t.video.pause(),
          t.video.removeAttribute("src"),
          t.video.load(),
          t.video.remove(),
          (t.video = null)));
      try {
        e && (await e.release());
      } catch {}
      return;
    }
    const n =
        /iPhone|iPad|iPod/.test(navigator.userAgent) ||
        ("MacIntel" === navigator.platform && navigator.maxTouchPoints > 1),
      a =
        /OS (\d+)_(\d+)/.exec(navigator.userAgent) ||
        /Version\/(\d+)\.(\d+)/.exec(navigator.userAgent),
      r = !a || 100 * Number(a[1]) + Number(a[2]) < 1804,
      s =
        !0 === navigator.standalone ||
        window.matchMedia("(display-mode: standalone)").matches;
    if (n && (!navigator.wakeLock || (s && r)) && !t.video) {
      const e = document.createElement("video");
      ((e.src = et),
        e.setAttribute("playsinline", ""),
        e.setAttribute("aria-hidden", "true"),
        (e.style.cssText =
          "position:fixed;left:0;top:0;width:1px;height:1px;opacity:0.01;pointer-events:none;"),
        e.addEventListener("timeupdate", () => {
          e.currentTime > 0.5 && (e.currentTime = 0.4 * Math.random());
        }),
        document.body.appendChild(e),
        (t.video = e));
    }
    if (
      (t.video && t.video.play().catch(() => {}),
      navigator.wakeLock && !document.hidden && !t.lock && !t.asking)
    ) {
      t.asking = navigator.wakeLock.request("screen");
      try {
        const e = await t.asking;
        (e.addEventListener("release", () => {
          t.lock === e && (t.lock = null);
        }),
          t.on ? (t.lock = e) : e.release().catch(() => {}));
      } catch {
      } finally {
        t.asking = null;
      }
    }
  }
  async function ot() {
    try {
      navigator.wakeLock &&
        !document.hidden &&
        (o.wakeLock = await navigator.wakeLock.request("screen"));
    } catch {}
  }
  function nt() {
    const e = (e) => {
        try {
          const t = e();
          t && "function" == typeof t.catch && t.catch(() => {});
        } catch {}
      },
      t = document.documentElement;
    (t.requestFullscreen &&
      !navigator.standalone &&
      e(() => t.requestFullscreen({ navigationUI: "hide" })),
      screen.orientation &&
        screen.orientation.lock &&
        e(() => screen.orientation.lock("landscape")));
  }
  function at() {
    if (!a.silentSound) return;
    try {
      if (navigator.audioSession)
        return void (navigator.audioSession.type = "playback");
    } catch {}
    if (!(
      /iPhone|iPad|iPod/.test(navigator.userAgent) ||
      ("MacIntel" === navigator.platform && navigator.maxTouchPoints > 1)
    ))
      return;
    const e = 4e3,
      t = new Uint8Array(4044),
      n = new DataView(t.buffer),
      r = (e, o) => {
        for (let n = 0; n < o.length; n++) t[e + n] = o.charCodeAt(n);
      };
    (r(0, "RIFF"),
      n.setUint32(4, 4036, !0),
      r(8, "WAVE"),
      r(12, "fmt "),
      n.setUint32(16, 16, !0),
      n.setUint16(20, 1, !0),
      n.setUint16(22, 1, !0),
      n.setUint32(24, 8e3, !0),
      n.setUint32(28, 8e3, !0),
      n.setUint16(32, 1, !0),
      n.setUint16(34, 8, !0),
      r(36, "data"),
      n.setUint32(40, e, !0),
      t.fill(128, 44));
    const s = document.createElement("audio");
    ((s.src = URL.createObjectURL(new Blob([t], { type: "audio/wav" }))),
      (s.loop = !0),
      s.setAttribute("playsinline", ""),
      s.play().catch((e) => c("silent switch: " + e)),
      (o.silentAudio = s));
  }
  function rt() {
    if (o.started) return;
    {
      const t = ce(),
        o = Q(t);
      if (t && "unsupported" === o)
        return (
          (e("data-summary").textContent = `${z}. ${J}`),
          e("data-summary").classList.add("copy-warning"),
          e("data-summary").scrollIntoView({
            block: "center",
            behavior: "smooth",
          }),
          void c(`copy: refused to play ${t.name} (rip ${t.rip})`)
        );
      if (t && "unknown" === o)
        return (
          (e("data-summary").textContent =
            "Checking this copy of the game before it can be played. Tap Play again in a moment."),
          e("data-summary").classList.add("copy-warning"),
          void ae()
        );
    }
    const n = Y(ce());
    if (n && !o.copyWarned)
      return (
        (o.copyWarned = !0),
        (e("data-summary").textContent = n),
        e("data-summary").classList.add("copy-warning"),
        (e("play").textContent = "Play anyway"),
        e("data-summary").scrollIntoView({
          block: "center",
          behavior: "smooth",
        }),
        void c("copy: " + n)
      );
    if (!o.memory)
      try {
        ((o.memory = new WebAssembly.Memory({
          initial: t,
          maximum: t,
          shared: !0,
        })),
          c("memory: reserved at the second try"));
      } catch (e) {
        return (
          c("memory: not reserved at start (" + e.message + ")"),
          void h(
            "Your device doesn't have enough free memory to start the game right now. Close other apps and tabs (on iPhone, swipe the app away and open it again), then try again.",
            9e3,
          )
        );
      }
    (o.hashWorker && o.hashWorker.stop && o.hashWorker.stop(),
      (o.started = !0),
      at());
    try {
      const e = window.AudioContext || window.webkitAudioContext;
      ((o.audio = new e({ sampleRate: 48e3, latencyHint: "interactive" })),
        o.audio.resume().catch(() => {}),
        (function () {
          const e = () => {
            (o.audio &&
              "running" !== o.audio.state &&
              !document.hidden &&
              o.audio.resume().catch(() => {}),
              o.silentAudio &&
                o.silentAudio.paused &&
                !document.hidden &&
                o.silentAudio.play().catch(() => {}));
          };
          (window.addEventListener("touchstart", e, { passive: !0 }),
            window.addEventListener("keydown", e),
            window.addEventListener("pointerdown", e),
            o.audio &&
              (o.audio.onstatechange = () => c("audio: " + o.audio.state)));
        })());
    } catch (e) {
      c("audio context: " + e);
    }
    (document.body.classList.add("playing"),
      nr(),
      nt(),
      ot(),
      history.pushState({ playing: !0 }, ""),
      window.addEventListener("popstate", () => {
        (e("chat").hidden
          ? e("game-menu").hidden
            ? e("layout-editor").hidden && HaloInput.pressBack()
            : xe()
          : Mo(),
          history.pushState({ playing: !0 }, ""));
      }),
      Ue());
    const s = [];
    let i = e("screen");
    const l =
        /Chrome\/\d+/.test(navigator.userAgent) &&
        !/iPhone|iPad|iPod/.test(navigator.userAgent) &&
        "bitmap" !== new URLSearchParams(location.search).get("present"),
      d = l
        ? (function (e) {
            const t = e.getContext("webgl2", {
              alpha: !1,
              antialias: !1,
              depth: !1,
              stencil: !1,
              preserveDrawingBuffer: !0,
              premultipliedAlpha: !1,
              powerPreference: "high-performance",
            });
            if (!t) return null;
            let n = null,
              a = null,
              r = null,
              s = 0,
              i = 0;
            const l = () => {
              const e = (e, o) => {
                const n = t.createShader(e);
                return (t.shaderSource(n, o), t.compileShader(n), n);
              };
              return (
                (n = t.createProgram()),
                t.attachShader(
                  n,
                  e(
                    t.VERTEX_SHADER,
                    "#version 300 es\n        out vec2 uv;\n        uniform float flip;\n        void main() {\n          vec2 p = vec2(gl_VertexID == 1 ? 3.0 : -1.0, gl_VertexID == 2 ? 3.0 : -1.0);\n          uv = vec2(p.x * 0.5 + 0.5, flip > 0.5 ? p.y * 0.5 + 0.5 : 0.5 - p.y * 0.5);\n          gl_Position = vec4(p, 0.0, 1.0);\n        }",
                  ),
                ),
                t.attachShader(
                  n,
                  e(
                    t.FRAGMENT_SHADER,
                    "#version 300 es\n        precision mediump float;\n        in vec2 uv;\n        uniform sampler2D frame;\n        out vec4 color;\n        void main() { color = vec4(texture(frame, uv).rgb, 1.0); }",
                  ),
                ),
                t.linkProgram(n),
                t.getProgramParameter(n, t.LINK_STATUS)
                  ? ((a = t.getUniformLocation(n, "flip")),
                    (r = t.createTexture()),
                    t.bindTexture(t.TEXTURE_2D, r),
                    t.texParameteri(
                      t.TEXTURE_2D,
                      t.TEXTURE_MIN_FILTER,
                      t.NEAREST,
                    ),
                    t.texParameteri(
                      t.TEXTURE_2D,
                      t.TEXTURE_MAG_FILTER,
                      t.NEAREST,
                    ),
                    t.texParameteri(
                      t.TEXTURE_2D,
                      t.TEXTURE_WRAP_S,
                      t.CLAMP_TO_EDGE,
                    ),
                    t.texParameteri(
                      t.TEXTURE_2D,
                      t.TEXTURE_WRAP_T,
                      t.CLAMP_TO_EDGE,
                    ),
                    t.pixelStorei(t.UNPACK_ALIGNMENT, 1),
                    (s = 0),
                    (i = 0),
                    !0)
                  : (c("screen: " + t.getProgramInfoLog(n)), !1)
              );
            };
            if (!l()) return null;
            (e.addEventListener("webglcontextlost", (e) => {
              (e.preventDefault(), c("screen: its graphics context was lost"));
            }),
              e.addEventListener("webglcontextrestored", () => {
                (c("screen: its graphics context is back"), l());
              }));
            const d = (o) => {
                (t.viewport(0, 0, e.width, e.height),
                  t.useProgram(n),
                  t.uniform1f(a, o ? 1 : 0),
                  t.drawArrays(t.TRIANGLES, 0, 3));
              },
              u = (o, n) => {
                ((e.width === o && e.height === n) ||
                  ((e.width = o), (e.height = n)),
                  (s === o && i === n) ||
                    ((s = o),
                    (i = n),
                    t.bindTexture(t.TEXTURE_2D, r),
                    t.texImage2D(
                      t.TEXTURE_2D,
                      0,
                      t.RGBA8,
                      o,
                      n,
                      0,
                      t.RGBA,
                      t.UNSIGNED_BYTE,
                      null,
                    )));
              };
            return {
              start(n, a) {
                const s = n >> 2;
                let i = 0;
                c("screen: the game's frames through its memory");
                const l = () => {
                  if ((requestAnimationFrame(l), t.isContextLost())) return;
                  const n = new Int32Array(o.memory.buffer),
                    m = Atomics.load(n, s);
                  if (m === i) return;
                  const h = Atomics.load(n, s + 8);
                  let g = -1;
                  for (let e = 0; e < 4; e++) {
                    const e = Atomics.load(n, s + 1);
                    if (e < 0) break;
                    if (
                      (Atomics.store(n, s + 2, e), Atomics.load(n, s + 1) === e)
                    ) {
                      g = e;
                      break;
                    }
                  }
                  let p = !1;
                  try {
                    if (g >= 0) {
                      const e = Atomics.load(n, s + 3),
                        a = Atomics.load(n, s + 4),
                        i = Atomics.load(n, s + 5 + g);
                      e > 0 &&
                        a > 0 &&
                        i > 0 &&
                        Atomics.load(n, s + 8) === h &&
                        (u(e, a),
                        t.bindTexture(t.TEXTURE_2D, r),
                        t.texSubImage2D(
                          t.TEXTURE_2D,
                          0,
                          0,
                          0,
                          e,
                          a,
                          t.RGBA,
                          t.UNSIGNED_BYTE,
                          new Uint8Array(o.memory.buffer, i, e * a * 4),
                        ),
                        (p = !0));
                    }
                  } finally {
                    Atomics.store(n, s + 2, -1);
                  }
                  p &&
                    (i || c(`screen: first frame ${e.width}x${e.height}`),
                    (i = m),
                    d(!0),
                    a());
                };
                requestAnimationFrame(l);
              },
              drawBitmap(e) {
                (u(e.width, e.height),
                  t.bindTexture(t.TEXTURE_2D, r),
                  t.texSubImage2D(
                    t.TEXTURE_2D,
                    0,
                    0,
                    0,
                    t.RGBA,
                    t.UNSIGNED_BYTE,
                    e,
                  ),
                  e.close(),
                  d(!1));
              },
            };
          })(i)
        : null;
    if (l && !d) {
      const e = i.cloneNode(!1);
      (i.replaceWith(e), (i = e));
    }
    const u = d ? null : i.getContext("bitmaprenderer");
    d && s.push("--HALO_WEB_PIXEL_PRESENT=1");
    const m = Array.isArray(window.__haloArgs) ? window.__haloArgs.slice() : [];
    m.push(...s);
    const g = ce();
    (g &&
      "default" !== g.id &&
      m.push(
        "--HALO_DATA_ROOT=" + g.dataRoot,
        "--HALO_SAVE_ROOT=" + g.dataRoot + "/save",
      ),
      c("playing " + (g ? `${g.name} (${g.dataRoot})` : "nothing")),
      a.vsync || m.push("--HALO_NO_VSYNC=1"));
    const p = HaloInput.keyPromptNames(a.keyBinds || {});
    (p && m.push("--HALO_WEB_KEY_NAMES=" + p),
      a.glDebug && m.push("--HALO_GL_DEBUG=1"),
      a.smallTextures && m.push("--HALO_WEB_SMALL_TEXTURES=1"),
      ["texture", "block", "uniforms"].includes(a.drawPath) &&
        m.push("--HALO_WEB_CONSTANTS_WAY=" + a.drawPath),
      !1 === a.fog && m.push("--HALO_WEB_NO_FOG=1"),
      a.sharpTextures && m.push("--HALO_WEB_ANISOTROPY=16"),
      a.showTiming && m.push("--HALO_WEB_GL_STATS=1"),
      (window.Module = {
        wasmMemory: o.memory,
        arguments: m,
        instantiateWasm: (e, t) => (
          (async function (e) {
            let t;
            for (let o = 0; o < 4; o++)
              try {
                const t = o ? `halo.wasm?retry=${Date.now()}` : "halo.wasm",
                  n = await fetch(t, o ? { cache: "no-store" } : void 0);
                if (!n.ok) throw new Error(`halo.wasm: HTTP ${n.status}`);
                return !o &&
                  WebAssembly.instantiateStreaming &&
                  /application\/wasm/.test(n.headers.get("Content-Type") || "")
                  ? await WebAssembly.instantiateStreaming(n, e)
                  : await WebAssembly.instantiate(await n.arrayBuffer(), e);
              } catch (e) {
                if (
                  ((t = e),
                  e instanceof WebAssembly.LinkError ||
                    (o && e instanceof WebAssembly.CompileError))
                )
                  break;
                (c(
                  `the game's code could not be fetched (try ${o + 1} of 4): ${e && e.message}`,
                ),
                  await new Promise((e) => setTimeout(e, 1500 * (o + 1))));
              }
            throw t;
          })(e).then(
            ({ instance: e, module: o }) => t(e, o),
            (e) =>
              W(
                /SIMD/i.test(String(e && e.message))
                  ? "This browser can't run the game's code: it has no WebAssembly SIMD. Update your browser; on a PC, the processor may be too old (it needs SSE4.1)."
                  : `Could not load the game's code (${e && e.message}). Check the connection and open the app again.`,
              ),
          ),
          {}
        ),
        print: (e) => {
          (c(e), _(e));
        },
        printErr: (e) => {
          (c(e), _(e));
        },
        haloPresent: (e) => {
          if (e) {
            if (d) return (d.drawBitmap(e), void je(i));
            ((i.width === e.width && i.height === e.height) ||
              ((i.width = e.width), (i.height = e.height)),
              o.presented !== Ge || o.hasBackdrop || Ye(e),
              HaloCoop.streaming && HaloCoop.frame(e),
              u.transferFromImageBitmap(e),
              (o.presented = (o.presented || 0) + 1),
              $(),
              o.photoWaiter && o.photoWaiter());
          }
        },
        haloPresentPixels: (e) => {
          d && d.start(e, () => je(i));
        },
        haloPresentView: (e) => {
          if (e) {
            if (e.bytes) {
              const t = new ImageData(
                new Uint8ClampedArray(e.bytes),
                e.width,
                e.height,
              );
              return void createImageBitmap(t, { imageOrientation: "flipY" })
                .then((e) => HaloCoop.viewFrame(e))
                .catch(() => {});
            }
            HaloCoop.viewFrame(e);
          }
        },
        haloMessage: (t, n) => {
          0 === t
            ? c("game: " + n)
            : 1 === t
              ? h(n, Math.max(5e3, 90 * n.length))
              : 2 === t
                ? c("clipboard: " + n)
                : 4 === t
                  ? (c("thread error: " + n), D("thread-error", n))
                  : 6 === t
                    ? (o.timing = n)
                    : 7 === t
                      ? (o.glTiming = n)
                      : 8 === t
                        ? (async function (t) {
                            let n;
                            try {
                              n = JSON.parse(t);
                            } catch {
                              return;
                            }
                            if ("status" === n.event)
                              return (
                                (o.gameStatus = { ...n, time: Date.now() }),
                                (function (e) {
                                  const t = HaloAccount.current;
                                  if (
                                    !t ||
                                    ("campaign" !== e.mode && "coop" !== e.mode)
                                  )
                                    return;
                                  const o = Wt.indexOf(e.map),
                                    n = Ut.indexOf(e.difficulty);
                                  if (o < 0 || n < 0) return;
                                  let a = {};
                                  try {
                                    a =
                                      JSON.parse(
                                        localStorage.getItem(Ft) || "{}",
                                      )[t.gamertag.toLowerCase()] || {};
                                  } catch {}
                                  if (
                                    (0 | a.level) >= o &&
                                    (0 | a.difficulty) >= n &&
                                    void 0 !== a.level
                                  )
                                    return;
                                  const r = {
                                    level: Math.max(
                                      o,
                                      void 0 === a.level ? -1 : a.level,
                                    ),
                                    difficulty: Math.max(n, 0 | a.difficulty),
                                  };
                                  HaloAccount.stats({ campaign: r })
                                    .then(() => {
                                      try {
                                        const e = JSON.parse(
                                          localStorage.getItem(Ft) || "{}",
                                        );
                                        ((e[t.gamertag.toLowerCase()] = r),
                                          localStorage.setItem(
                                            Ft,
                                            JSON.stringify(e),
                                          ));
                                      } catch {}
                                    })
                                    .catch((e) => c("stats: " + e.message));
                                })(n),
                                void nr()
                              );
                            if ("custom-played" === n.event)
                              return void (
                                HaloAccount.current &&
                                HaloAccount.stats({ customGame: !0 }).catch(
                                  (e) => c("stats: " + e.message),
                                )
                              );
                            if ("owner-style" === n.event) {
                              const e = HaloAccount.current;
                              if (!e || "owner" !== e.role) return;
                              return (
                                _t({ icon: n.icon, color: n.color }),
                                void HaloAccount.setStyle(
                                  Bt.icon,
                                  Bt.color,
                                ).catch((e) => h(e.message))
                              );
                            }
                            if ("social" === n.event)
                              return void (await (async function (t) {
                                if (!HaloAccount.current)
                                  return void h(
                                    "Sign in to use the friends list: Play online > Your account, on the start page.",
                                    6e3,
                                  );
                                const o = Qa[0 | t.list] || [],
                                  n = String(t.gamertag || "").toLowerCase(),
                                  a = n
                                    ? o.find(
                                        (e) => e.gamertag.toLowerCase() === n,
                                      ) ||
                                      []
                                        .concat(...Qa)
                                        .find(
                                          (e) => e.gamertag.toLowerCase() === n,
                                        )
                                    : o[0 | t.row],
                                  r = async (e, t) => {
                                    try {
                                      const o = await e();
                                      (o && Array.isArray(o.friends) && _a(o),
                                        t &&
                                          h(
                                            "function" == typeof t ? t(o) : t,
                                            5e3,
                                          ));
                                    } catch (e) {
                                      h(e.message, 6e3);
                                    }
                                    (await Promise.all([Ua(!1), Ka()]), tr());
                                  },
                                  s = String(t.text || "").trim();
                                switch (t.action) {
                                  case "open":
                                    await Promise.all([Ua(!1), Ka()]);
                                    break;
                                  case "profile":
                                    t.gamertag &&
                                      (await (async function (e) {
                                        ((Ga.asked = e), ja(1, null, e));
                                        try {
                                          const t = await HaloAccount.player(e);
                                          Ga.asked === e && ja(2, t, e);
                                        } catch {
                                          Ga.asked === e && ja(3, null, e);
                                        }
                                      })(String(t.gamertag)));
                                    break;
                                  case "friend-add":
                                    if (!s) break;
                                    await r(
                                      () => HaloAccount.addFriend(s),
                                      (e) =>
                                        e.accepted
                                          ? `${e.gamertag} is your friend now.`
                                          : `Friend request sent to ${e.gamertag}.`,
                                    );
                                    break;
                                  case "add":
                                    a &&
                                      (await r(
                                        () => HaloAccount.addFriend(a.gamertag),
                                        `Friend request sent to ${a.gamertag}.`,
                                      ));
                                    break;
                                  case "accept":
                                    a &&
                                      (await r(
                                        () =>
                                          HaloAccount.acceptFriend(a.gamertag),
                                        `${a.gamertag} is your friend now.`,
                                      ));
                                    break;
                                  case "decline":
                                  case "remove":
                                  case "cancel":
                                    a &&
                                      (await r(
                                        () =>
                                          HaloAccount.removeFriend(a.gamertag),
                                        "remove" === t.action
                                          ? `${a.gamertag} removed.`
                                          : "",
                                      ));
                                    break;
                                  case "join":
                                    (a && "friend" === a.kind
                                      ? await ar(
                                          a.gamertag,
                                          a.friend.presence || {},
                                          !1,
                                        )
                                      : a && "member" === a.kind
                                        ? await ar(
                                            a.gamertag,
                                            a.member.presence || {},
                                            !1,
                                          )
                                        : a && "recent" === a.kind && a.friend
                                          ? await ar(
                                              a.gamertag,
                                              a.friend.presence || {},
                                              !1,
                                            )
                                          : a &&
                                            "invite" === a.kind &&
                                            (await rr(a.invite)),
                                      tr());
                                    break;
                                  case "dismiss":
                                    a &&
                                      "invite" === a.kind &&
                                      (await (async function (e) {
                                        (sr(),
                                          await Wa(() =>
                                            HaloAccount.answerInvite(e.id),
                                          ));
                                      })(a.invite));
                                    break;
                                  case "invite":
                                    (a &&
                                      (await (async function (t) {
                                        if (St())
                                          return void h(
                                            "Invite friends before you search: everyone in your lobby searches with you as a party.",
                                            6e3,
                                          );
                                        if (
                                          !wt() &&
                                          !(await Et(
                                            e("lobby-public-new").checked,
                                          ))
                                        )
                                          return;
                                        const o = yt.current;
                                        (await Wa(
                                          () => HaloAccount.invite(t, o.id),
                                          `Invited ${t} to ${o.name}.`,
                                        ),
                                          nr());
                                      })(a.gamertag)),
                                      tr());
                                    break;
                                  case "invite-all": {
                                    const e = (
                                      xa.data ? xa.data.friends : []
                                    ).filter(
                                      (e) =>
                                        e.online &&
                                        !(
                                          e.presence &&
                                          "lobby" === e.presence.activity &&
                                          wt() &&
                                          e.presence.lobby === yt.current.id
                                        ),
                                    );
                                    if (!e.length) {
                                      h(
                                        "None of your friends are online to invite.",
                                      );
                                      break;
                                    }
                                    if (!wt() && !(await Et(!0))) break;
                                    const t = yt.current;
                                    if (!t) break;
                                    let o = 0;
                                    for (const n of e)
                                      try {
                                        (await HaloAccount.invite(
                                          n.gamertag,
                                          t.id,
                                        ),
                                          o++);
                                      } catch {}
                                    h(
                                      `Invited ${o} friend${1 === o ? "" : "s"} to ${t.name}.`,
                                      5e3,
                                    );
                                    break;
                                  }
                                  case "message": {
                                    const e = a
                                      ? a.gamertag
                                      : String(t.gamertag || "");
                                    if (!e) break;
                                    if (s)
                                      try {
                                        (await HaloLive.sendDm(e, s),
                                          h(`Message sent to ${e}.`));
                                      } catch (e) {
                                        h(e.message, 5e3);
                                      }
                                    else await In(e);
                                    break;
                                  }
                                  case "clan-create":
                                    s &&
                                      (await r(
                                        () => HaloAccount.clans.create(s),
                                        (e) =>
                                          `You founded ${e.clan.name}. You are its Overlord.`,
                                      ));
                                    break;
                                  case "clan-invite": {
                                    const e =
                                      s ||
                                      (a && a.gamertag) ||
                                      String(t.gamertag || "");
                                    e &&
                                      (await r(
                                        () => HaloAccount.clans.invite(e),
                                        (e) =>
                                          `Invited ${e.gamertag} to the clan.`,
                                      ));
                                    break;
                                  }
                                  case "clan-accept":
                                  case "clan-decline":
                                    a &&
                                      "clan-invite" === a.kind &&
                                      (await r(
                                        () =>
                                          HaloAccount.clans.answer(
                                            a.invite.id,
                                            "clan-accept" === t.action,
                                          ),
                                        "clan-accept" === t.action
                                          ? `You joined ${a.invite.clan}.`
                                          : "",
                                      ));
                                    break;
                                  case "clan-rank":
                                    if (a && "member" === a.kind) {
                                      const e = 0 | t.rank;
                                      await r(
                                        () =>
                                          HaloAccount.clans.rank(a.gamertag, e),
                                        `${a.gamertag} is a ${qa[e]} now.`,
                                      );
                                    }
                                    break;
                                  case "clan-kick":
                                    a &&
                                      "member" === a.kind &&
                                      (await r(
                                        () =>
                                          HaloAccount.clans.kick(a.gamertag),
                                        `${a.gamertag} was removed from the clan.`,
                                      ));
                                    break;
                                  case "clan-leave":
                                    await r(
                                      () => HaloAccount.clans.leave(),
                                      "You left the clan.",
                                    );
                                    break;
                                  case "clan-disband":
                                    await r(
                                      () => HaloAccount.clans.disband(),
                                      "The clan was disbanded.",
                                    );
                                    break;
                                  case "report":
                                    a &&
                                      (await r(
                                        () =>
                                          HaloAccount.command(
                                            `/report ${a.gamertag} reported from the friends list`,
                                          ),
                                        "Thanks: the moderators have your report.",
                                      ));
                                }
                              })(n));
                            if ("player-options" === n.event)
                              return void (function (e) {
                                ((a.playerRules = 0 | Number(e.rules)),
                                  (a.playerCharacter = 0 | Number(e.character)),
                                  r());
                              })(n);
                            if ("game-over-reset" === n.event)
                              return (
                                o.robot && ut(!1),
                                void (Fo.rules
                                  ? un(0)
                                  : o.staffRules && ((o.staffRules = 0), ct()))
                              );
                            if ("color" === n.event)
                              return void HaloNet.setColor(
                                Number.isInteger(n.color) ? n.color : -1,
                              );
                            if ("team" === n.event)
                              return (
                                (Rt.team =
                                  1 === n.team || 2 === n.team ? n.team : 0),
                                HaloNet.setTeam(Rt.team),
                                void Ot()
                              );
                            if ("game-record" === n.event)
                              return void (function (e) {
                                const t = HaloNet.status(),
                                  n = t.link || {},
                                  a =
                                    o.linkBase && o.linkBase.since === n.since
                                      ? o.linkBase
                                      : {
                                          reliableIn: 0,
                                          unreliableIn: 0,
                                          ringDrops: 0,
                                        };
                                o.linkBase = { ...n };
                                const r = wt() ? yt.current : null,
                                  s = {
                                    ...e,
                                    event: void 0,
                                    rid: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                                    room: t.room || "",
                                    lobby: r ? r.id : "",
                                    lobbyHost: r ? r.owner : "",
                                    kind:
                                      Fn.room && t.room === Fn.room
                                        ? "matchmaking"
                                        : r
                                          ? "custom"
                                          : "other",
                                    match:
                                      (Fn.room && t.room === Fn.room && fa()) ||
                                      "",
                                    playlist:
                                      Fn.room && t.room === Fn.room
                                        ? 0 | Fn.playlist
                                        : -1,
                                    build: o.version || "",
                                    device: E(),
                                    gpu: H(),
                                    ended: Date.now(),
                                    fps: (() => {
                                      const e = S.fps.filter(
                                        (e) => Date.now() - e.time < 12e4,
                                      );
                                      return e.length
                                        ? Math.round(
                                            e.reduce((e, t) => e + t.fps, 0) /
                                              e.length,
                                          )
                                        : 0;
                                    })(),
                                    copy: `${(ce() || {}).name || ""} ${o.lobbyMaps || ""}`.trim(),
                                    ...(r
                                      ? (() => {
                                          const t =
                                              jt.handoff &&
                                              jt.handoff.lobby === r.id &&
                                              Date.now() -
                                                1e3 * (0 | e.seconds) >=
                                                jt.handoff.at - 5e3
                                                ? jt.handoff
                                                : null,
                                            o =
                                              !t &&
                                              jt.handoff &&
                                              jt.handoff.lobby === r.id &&
                                              Date.now() - jt.handoff.at < 3e4
                                                ? jt.handoff
                                                : null,
                                            n = t ? t.to : o ? o.from : Jt();
                                          return {
                                            hostedBy: n,
                                            handoffFrom: t ? t.from : "",
                                            hostLeft: !!o,
                                            hostVia: t
                                              ? "handoff"
                                              : n.toLowerCase() ===
                                                  String(
                                                    r.owner || "",
                                                  ).toLowerCase()
                                                ? "owner"
                                                : "elected",
                                          };
                                        })()
                                      : {}),
                                    link: {
                                      reliableIn:
                                        (0 | n.reliableIn) - (0 | a.reliableIn),
                                      unreliableIn:
                                        (0 | n.unreliableIn) -
                                        (0 | a.unreliableIn),
                                      ringDrops:
                                        (0 | n.ringDrops) - (0 | a.ringDrops),
                                      peersOpen: 0 | n.peersOpen,
                                      unreliableOpen: 0 | n.unreliableOpen,
                                    },
                                  };
                                s.fps > 0 && (o.lastGameFps = s.fps);
                                let i = [];
                                try {
                                  i = JSON.parse(
                                    localStorage.getItem(ha) || "[]",
                                  );
                                } catch {
                                  i = [];
                                }
                                i.push(s);
                                try {
                                  localStorage.setItem(
                                    ha,
                                    JSON.stringify(i.slice(-6)),
                                  );
                                } catch {}
                                pa();
                              })(n);
                            if (
                              (c("matchmaking: " + t),
                              String(n.event).startsWith("custom-") ||
                                "remote-coop" === n.event ||
                                "remote-coop-stop" === n.event ||
                                "remote-coop-playing" === n.event)
                            )
                              return "custom-opened" === n.event ||
                                "custom-closed" === n.event
                                ? ((o.customGamesOpen =
                                    "custom-opened" === n.event),
                                  void (o.customGamesOpen && Tt()))
                                : void (await (async function (e) {
                                    if (!HaloAccount.current)
                                      return void h(
                                        "Sign in to play online: Play online > Your account, on the start page.",
                                        6e3,
                                      );
                                    const t = async (e) => {
                                      ((Rt.busy = !0), Ot());
                                      try {
                                        await e();
                                      } finally {
                                        ((Rt.busy = !1), Ot());
                                      }
                                    };
                                    if ("custom-refresh" === e.event)
                                      await Tt();
                                    else if ("custom-quick" === e.event)
                                      await t(Zt);
                                    else if ("custom-create" === e.event)
                                      await t(() => Et(!!e.public));
                                    else if ("custom-join" === e.event) {
                                      const o = Rt.listed[0 | e.row];
                                      o
                                        ? await t(() => Ht(o.id))
                                        : h("That lobby is gone.");
                                    } else if ("custom-leave" === e.event)
                                      await xt();
                                    else if ("custom-privacy" === e.event) {
                                      if (wt() && bt()) {
                                        const t =
                                          void 0 === e.public
                                            ? !yt.current.public
                                            : !!e.public;
                                        t !== !!yt.current.public &&
                                          (await Nt(t));
                                      }
                                    } else if ("custom-settings" === e.event)
                                      !(function (e) {
                                        if (
                                          !e ||
                                          "object" != typeof e ||
                                          !wt() ||
                                          !bt()
                                        )
                                          return;
                                        const t = yt.current;
                                        ((t.settings = e),
                                          Ot(),
                                          HaloNet.sendRoom("lobby-settings", e),
                                          clearTimeout(Rt.settingsTimer),
                                          (Rt.settingsTimer = setTimeout(() => {
                                            yt.current &&
                                              yt.current.id === t.id &&
                                              HaloAccount.lobbySettings(
                                                t.id,
                                                null,
                                                e,
                                              ).catch((e) =>
                                                c(
                                                  "lobby settings: " +
                                                    e.message,
                                                ),
                                              );
                                          }, 1200)));
                                      })(e.settings);
                                    else if (
                                      "custom-host-fallback" === e.event &&
                                      bt() &&
                                      HaloAccount.current
                                    )
                                      ((jt.elected =
                                        HaloAccount.current.gamertag),
                                        (jt.electedAt = Date.now()),
                                        c(
                                          "lobby host: the elected host's game never came: hosting here",
                                        ),
                                        Ot(),
                                        HaloNet.sendRoom("lobby-host", {
                                          host: jt.elected,
                                          ranked: jt.ranked || [],
                                        }).catch(() => {}));
                                    else if (
                                      "custom-hosting" === e.event &&
                                      HaloAccount.current
                                    )
                                      ((jt.startedAt = Date.now()),
                                        bt() &&
                                          Jt().toLowerCase() !==
                                            HaloAccount.current.gamertag.toLowerCase() &&
                                          ((jt.elected =
                                            HaloAccount.current.gamertag),
                                          Ot()));
                                    else if (
                                      "custom-start-remote" === e.event
                                    ) {
                                      jt.startedAt = Date.now();
                                      const e = Jt();
                                      (c(
                                        `lobby host: START GAME on ${e}'s machine`,
                                      ),
                                        HaloNet.sendRoom("lobby-start", {
                                          host: e,
                                        }).catch(() => {}));
                                    } else if (
                                      "custom-browse-join" === e.event
                                    ) {
                                      const o = Rt.browsed[0 | e.row];
                                      o
                                        ? await t(() => Ht(o.id))
                                        : h("That lobby is gone.");
                                    } else if ("custom-invite" === e.event)
                                      Io("friends");
                                    else if ("remote-coop" === e.event) {
                                      const e = (o.coopGeneration =
                                        1 + (0 | o.coopGeneration));
                                      if (!wt() && !o.coopOpening) {
                                        o.coopOpening = !0;
                                        try {
                                          await t(() => Et(!1));
                                        } finally {
                                          o.coopOpening = !1;
                                        }
                                        wt() && (o.coopLobby = yt.current.id);
                                      }
                                      if (e !== o.coopGeneration)
                                        return (
                                          !o.coopLobby ||
                                            !wt() ||
                                            yt.current.id !== o.coopLobby ||
                                            0 | HaloNet.status().players ||
                                            (await xt()),
                                          void (o.coopLobby = null)
                                        );
                                      wt() &&
                                        !HaloCoop.hosting &&
                                        HaloCoop.setHosting(!0);
                                    } else
                                      "remote-coop-stop" === e.event &&
                                        ((o.coopGeneration =
                                          1 + (0 | o.coopGeneration)),
                                        HaloCoop.hosting &&
                                          HaloCoop.setHosting(!1),
                                        !o.coopLobby ||
                                          !wt() ||
                                          yt.current.id !== o.coopLobby ||
                                          0 | HaloNet.status().players ||
                                          (await xt()),
                                        (o.coopLobby = null));
                                  })(n));
                            if ("search" === n.event && Fn.moving && zn())
                              await (async function () {
                                const e = Fn.moving;
                                if (
                                  ((e.searched = !0),
                                  e.to.toLowerCase() === Dn().toLowerCase())
                                )
                                  return (
                                    (Fn.game = 0 | e.game),
                                    (Fn.movedFor = 0 | e.game),
                                    (Fn.phase = "hosting"),
                                    (Fn.lobbySince = Date.now()),
                                    void setTimeout(() => {
                                      Fn.moving === e &&
                                        (Jn(
                                          e.handoff ? Un.HANDOFF_HOST : Un.HOST,
                                        ),
                                        c(
                                          "matchmaking: hosting the room's game here" +
                                            (e.handoff ? ", carried on" : ""),
                                        ));
                                    }, 1e3)
                                  );
                                ((Fn.phase = "joining"),
                                  setTimeout(() => {
                                    Fn.moving === e &&
                                      (Jn(Un.JOIN),
                                      c(
                                        `matchmaking: joining the room's game on ${e.to}'s device`,
                                      ));
                                  }, 2500));
                              })();
                            else if ("search" === n.event)
                              await (async function (e) {
                                if (!_n[e]) return;
                                o.lobbyMaps || (o.lobbyMaps = await On());
                                if (!HaloAccount.current)
                                  return void h(
                                    "Sign in to play Matchmaking: Play online > Your account, on the start page.",
                                    6e3,
                                  );
                                const t = HaloNet.status().room;
                                if (
                                  ((Fn.home =
                                    t && t !== Fn.room && wt() ? t : null),
                                  t && t !== Fn.room)
                                ) {
                                  const n = HaloNet.status().players;
                                  ((Fn.party =
                                    n > 0
                                      ? {
                                          id: await Qn(t),
                                          home: t,
                                          size: n + 1,
                                        }
                                      : null),
                                    Fn.party
                                      ? h(
                                          `Searching ${_n[e].name} as a party of ${n + 1}.`,
                                          6e3,
                                        )
                                      : HaloLobby.isListing() &&
                                        (await (async function () {
                                          ((o.listedCode = null),
                                            await HaloLobby.withdraw());
                                        })()));
                                } else t || (Fn.party = null);
                                (await ta(),
                                  !Fn.party &&
                                    HaloNet.status().room &&
                                    (await HaloNet.leave()));
                                ((Fn.playlist = e),
                                  (Fn.since = Date.now()),
                                  (Fn.partySearchId = Math.random()
                                    .toString(36)
                                    .slice(2, 10)),
                                  (Fn.followFails = 0),
                                  Fn.party &&
                                    wt() &&
                                    bt() &&
                                    HaloNet.sendRoom("party-search", {
                                      playlist: e,
                                      sid: Fn.partySearchId,
                                    }).catch(() => {}));
                                o.shared &&
                                  Atomics.store(
                                    new Int32Array(o.memory.buffer),
                                    Ve("matchmakingParty"),
                                    Fn.party
                                      ? (parseInt(Fn.party.id.slice(0, 4), 16) %
                                          511) +
                                          1
                                      : 0,
                                  );
                                (Zn(),
                                  clearInterval(Fn.timer),
                                  (Fn.timer = setInterval(
                                    () =>
                                      (async function () {
                                        if (Fn.busy || Fn.playlist < 0) return;
                                        ((function () {
                                          const e = Date.now();
                                          if (
                                            !HaloAccount.current ||
                                            Fn.roomsBusy ||
                                            e - (Fn.roomsAt || 0) < 5e3
                                          )
                                            return;
                                          const t =
                                            Fn.owner &&
                                            Fn.room &&
                                            Fn.advertBuild;
                                          if (!t && "searching" !== Fn.phase)
                                            return;
                                          ((Fn.roomsAt = e),
                                            (Fn.roomsBusy = !0));
                                          const o = Fn.playlist;
                                          let n = null;
                                          if (t) {
                                            const e = Fn.advertBuild();
                                            n = {
                                              code: e.code,
                                              maps: e.maps,
                                              players: e.players,
                                              open: e.open,
                                              rank: e.rank,
                                              created: e.created,
                                            };
                                          }
                                          HaloAccount.matchRooms(o, n)
                                            .then((e) =>
                                              Fn.playlist === o
                                                ? HaloLobby.heardFromServer(
                                                    e.rooms,
                                                  )
                                                : null,
                                            )
                                            .catch(() => {})
                                            .finally(() => {
                                              Fn.roomsBusy = !1;
                                            });
                                        })(),
                                          (function () {
                                            if (!zn() || !HaloAccount.current)
                                              return;
                                            const e = HaloNet.status(),
                                              t = Dn();
                                            "host" === Fn.role
                                              ? (Fn.gameHost = t)
                                              : e.gameHost &&
                                                (Fn.gameHost = e.gameHost);
                                            e.hostGame > 0 &&
                                              (Fn.hostGameSeen = e.hostGame);
                                            "host" === Fn.role &&
                                              (Fn.hostGameSeen = Math.max(
                                                Fn.hostGameSeen,
                                                0 | Fn.game,
                                              ));
                                            const o = Date.now();
                                            if (o - (Fn.qualitySent || 0) < ca)
                                              return;
                                            Fn.qualitySent = o;
                                            const n = qt();
                                            if (
                                              (Fn.reports.set(t.toLowerCase(), {
                                                name: t,
                                                at: o,
                                                report: n,
                                              }),
                                              HaloNet.sendRoom(
                                                "mm-quality",
                                                n,
                                              ).catch(() => {}),
                                              "host" !== Fn.role || Fn.moving)
                                            )
                                              return;
                                            const a = la(),
                                              r = {};
                                            for (const e of a) {
                                              const t = Fn.reports.get(
                                                e.toLowerCase(),
                                              );
                                              !t ||
                                                o - t.at > 12e3 ||
                                                (t.report && t.report.hidden) ||
                                                (r[t.name] = Math.round(
                                                  zt(
                                                    t.report,
                                                    a.filter(
                                                      (t) =>
                                                        t.toLowerCase() !==
                                                        e.toLowerCase(),
                                                    ),
                                                  ),
                                                ));
                                            }
                                            const s = Object.entries(r).sort(
                                              (e, t) =>
                                                e[1] - t[1] ||
                                                (e[0] < t[0] ? -1 : 1),
                                            );
                                            ((Fn.ranked = s.map(([e]) => e)),
                                              HaloNet.sendRoom("mm-ranked", {
                                                ranked: Fn.ranked,
                                                game: 0 | Fn.game,
                                              }).catch(() => {}));
                                            const i = e,
                                              l = i.players + 1;
                                            if (
                                              "lobby" !== Fn.phase ||
                                              Fn.movedFor === (0 | Fn.game) ||
                                              i.connecting ||
                                              l < 2 ||
                                              l < _n[Fn.playlist].minimum ||
                                              o - (Fn.lobbySince || o) < 4e3 ||
                                              !s.length
                                            )
                                              return;
                                            const [d, u] = s[0],
                                              m = r[t] ?? 1 / 0,
                                              h =
                                                "1" ===
                                                  new URLSearchParams(
                                                    location.search,
                                                  ).get("mmmove") &&
                                                d === t &&
                                                s[1],
                                              g = h ? s[1][0] : d,
                                              p = h ? s[1][1] : u;
                                            if (
                                              g === t ||
                                              !(
                                                h ||
                                                (p < 0.67 * m && m - p > 60)
                                              )
                                            )
                                              return;
                                            ((Fn.movedFor = 0 | Fn.game),
                                              (async function (e, t, o) {
                                                c(
                                                  `matchmaking: ${e} is the better host (${o} to ${t}): the game moves there`,
                                                );
                                                try {
                                                  await HaloAccount.matchDelegate(
                                                    Fn.room,
                                                    e,
                                                  );
                                                } catch (e) {
                                                  c(
                                                    "matchmaking: no grant for the next host: " +
                                                      e.message,
                                                  );
                                                }
                                                if (
                                                  "host" !== Fn.role ||
                                                  "lobby" !== Fn.phase ||
                                                  !zn()
                                                )
                                                  return;
                                                const n = {
                                                  to: e,
                                                  from: Dn(),
                                                  handoff: !1,
                                                  game: 0 | Fn.game,
                                                };
                                                (HaloNet.sendRoom(
                                                  "mm-move",
                                                  n,
                                                ).catch(() => {}),
                                                  ua(n));
                                              })(
                                                g,
                                                Math.round(m),
                                                Math.round(p),
                                              ).catch((e) =>
                                                c(
                                                  "matchmaking: the move failed: " +
                                                    e.message,
                                                ),
                                              ));
                                          })());
                                        const e = Fn.playlist,
                                          t = o.lobbyMaps || "",
                                          n = Date.now();
                                        for (const [e, t] of Fn.excluded)
                                          t < n && Fn.excluded.delete(e);
                                        const a = ea(Fn.since),
                                          r = Fn.mergeTested
                                            ? 0
                                            : Number(
                                                new URLSearchParams(
                                                  location.search,
                                                ).get("mmalone") || 0,
                                              ),
                                          s =
                                            r && n - Fn.since < 1e3 * r
                                              ? []
                                              : HaloLobby.seekers(e, t),
                                          i = s.filter((e) => !e.follow),
                                          l = (e, t) =>
                                            e.since - t.since ||
                                            (e.id < t.id ? -1 : 1),
                                          d = i.filter(
                                            (e) =>
                                              !e.party ||
                                              !i.some(
                                                (t) =>
                                                  t.party === e.party &&
                                                  l(t, e) < 0,
                                              ),
                                          ),
                                          u =
                                            "searching" === Fn.phase ||
                                            ("host" === Fn.role &&
                                              ("hosting" === Fn.phase ||
                                                "lobby" === Fn.phase) &&
                                              !HaloNet.status().players),
                                          m =
                                            "host" === Fn.role
                                              ? Math.max(
                                                  Fn.since,
                                                  Fn.lobbySince || 0,
                                                )
                                              : Fn.since,
                                          h =
                                            u &&
                                            !Fn.slowReported &&
                                            n - m > 45e3
                                              ? HaloLobby.allSeekers()
                                              : null,
                                          g = h
                                            ? HaloLobby.rooms().filter(
                                                (e) => e.code !== Fn.room,
                                              )
                                            : null;
                                        if (
                                          h &&
                                          (h.some((t) => t.playlist === e) ||
                                            g.some((t) => t.playlist === e))
                                        ) {
                                          Fn.slowReported = !0;
                                          const o = h,
                                            a = g;
                                          D(
                                            "slow-search",
                                            `no match in 45 seconds searching ${_n[e].name}, others searching it`,
                                            {
                                              search: {
                                                playlist: e,
                                                maps: t,
                                                phase: Fn.phase,
                                                role: Fn.role || "",
                                                seconds: Math.round(
                                                  (n - m) / 1e3,
                                                ),
                                                live: HaloLive.connected,
                                                liveReady: HaloLive.ready,
                                                heard: o.length,
                                                samePlaylist: o.filter(
                                                  (t) => t.playlist === e,
                                                ).length,
                                                sameMaps: o.filter(
                                                  (o) =>
                                                    o.playlist === e &&
                                                    HaloLobby.sameMaps(
                                                      o.maps,
                                                      t,
                                                    ),
                                                ).length,
                                                otherMaps: [
                                                  ...new Set(
                                                    o
                                                      .filter(
                                                        (o) =>
                                                          o.playlist === e &&
                                                          !HaloLobby.sameMaps(
                                                            o.maps,
                                                            t,
                                                          ),
                                                      )
                                                      .map((e) => e.maps),
                                                  ),
                                                ],
                                                rooms: a.length,
                                                playlistRooms: a.filter(
                                                  (t) => t.playlist === e,
                                                ).length,
                                                openRooms: a.filter(
                                                  (o) =>
                                                    o.playlist === e &&
                                                    HaloLobby.sameMaps(
                                                      o.maps,
                                                      t,
                                                    ) &&
                                                    o.open,
                                                ).length,
                                              },
                                            },
                                          );
                                        }
                                        if ("searching" === Fn.phase) {
                                          Fn.party &&
                                            wt() &&
                                            bt() &&
                                            HaloNet.status().room ===
                                              Fn.party.home &&
                                            Date.now() -
                                              (Fn.partySearchSent || 0) >
                                              3e3 &&
                                            ((Fn.partySearchSent = Date.now()),
                                            HaloNet.sendRoom("party-search", {
                                              playlist: e,
                                              sid: Fn.partySearchId,
                                            }).catch(() => {}));
                                          let o = 1;
                                          if (Fn.party) {
                                            const e = s.filter(
                                                (e) => e.party === Fn.party.id,
                                              ),
                                              t = e.find((e) => e.follow);
                                            if (
                                              t &&
                                              t.follow !== Fn.room &&
                                              Date.now() >
                                                (Fn.followRetryAt || 0)
                                            )
                                              return void (await ia({
                                                code: t.follow,
                                                host: "your party",
                                              }));
                                            const r = [
                                              {
                                                id: Fn.seekId,
                                                since: a,
                                                leader: !(!wt() || !bt()),
                                              },
                                              ...e.filter((e) => !e.follow),
                                            ].sort(
                                              (e, t) =>
                                                (t.leader ? 1 : 0) -
                                                  (e.leader ? 1 : 0) || l(e, t),
                                            );
                                            if (
                                              (Vn(1 + i.length),
                                              r[0].id !== Fn.seekId)
                                            )
                                              return;
                                            if (
                                              r.length < Fn.party.size &&
                                              n - Fn.since < 15e3
                                            )
                                              return;
                                            o = Math.max(
                                              r.length,
                                              0 | Fn.party.size,
                                            );
                                          }
                                          const u =
                                            r && n - Fn.since < 1e3 * r
                                              ? []
                                              : HaloLobby.rooms().filter(
                                                  (n) =>
                                                    n.playlist === e &&
                                                    HaloLobby.sameMaps(
                                                      n.maps,
                                                      t,
                                                    ) &&
                                                    n.open &&
                                                    n.players + o <=
                                                      _n[e].players &&
                                                    n.code !== Fn.room &&
                                                    !Fn.excluded.has(n.code),
                                                );
                                          if (
                                            (Vn(
                                              1 +
                                                i.length +
                                                u.reduce(
                                                  (e, t) => e + t.players,
                                                  0,
                                                ),
                                            ),
                                            u.length)
                                          ) {
                                            const t = Yn(e);
                                            return (
                                              u.sort(
                                                (e, o) =>
                                                  Math.abs(e.rank - t) -
                                                    Math.abs(o.rank - t) ||
                                                  o.players - e.players,
                                              ),
                                              void (await ia(u[0]))
                                            );
                                          }
                                          const m = d.filter(
                                              (e) =>
                                                !Fn.party ||
                                                e.party !== Fn.party.id,
                                            ),
                                            h = Kn(),
                                            g = [
                                              {
                                                id: Fn.seekId,
                                                since: a,
                                                mayHost: h,
                                              },
                                              ...m,
                                            ]
                                              .filter((e) => !1 !== e.mayHost)
                                              .sort(l),
                                            p = n - Fn.since,
                                            f = Fn.party ? 5e3 : 45e3;
                                          h &&
                                            g.length &&
                                            ((g[0].id === Fn.seekId &&
                                              (m.length > 0 || p > f)) ||
                                              (m.length > 0 && p > 25e3) ||
                                              p > f) &&
                                            (await (async function () {
                                              Fn.busy = !0;
                                              try {
                                                const e = Fn.playlist,
                                                  t = Fn.seekId;
                                                let o = null;
                                                if (HaloAccount.current)
                                                  try {
                                                    o = (
                                                      await HaloAccount.matchHost(
                                                        e,
                                                      )
                                                    ).room;
                                                  } catch (e) {
                                                    c(
                                                      "matchmaking: no room granted: " +
                                                        e.message,
                                                    );
                                                  }
                                                if (!ra(e, t)) return;
                                                const n = await Ct(
                                                  o || HaloNet.newRoomCode(),
                                                );
                                                if (!n) return;
                                                if (!ra(e, t))
                                                  return void (
                                                    HaloNet.status().room ===
                                                      n &&
                                                    (await HaloNet.leave())
                                                  );
                                                ((Fn.created = Date.now()),
                                                  aa(n, "host"),
                                                  (Fn.gameHost = Dn()),
                                                  await sa(n, e),
                                                  na(),
                                                  Jn(Un.HOST),
                                                  c(
                                                    `matchmaking: hosting ${_n[e].name} in room ${n}`,
                                                  ));
                                              } finally {
                                                Fn.busy = !1;
                                              }
                                            })());
                                        } else if (
                                          "host" !== Fn.role ||
                                          ("lobby" !== Fn.phase &&
                                            "hosting" !== Fn.phase)
                                        )
                                          "searching-again" === Fn.phase &&
                                            Date.now() - (Fn.researchAt || 0) >
                                              6e3 &&
                                            (c(
                                              "matchmaking: still in the lobby, not searching again",
                                            ),
                                            (Fn.phase = "lobby"),
                                            (Fn.lobbySince = Date.now()));
                                        else {
                                          na();
                                          const o = HaloNet.status(),
                                            n = o.players + 1;
                                          Fn.lobbyPlayers !== o.players &&
                                            ((Fn.lobbyPlayers = o.players),
                                            (Fn.lobbySince = Date.now()));
                                          if (
                                            Fn.owner &&
                                            "lobby" === Fn.phase &&
                                            n < _n[e].minimum &&
                                            !o.connecting &&
                                            !(o.parties && o.parties.length) &&
                                            Date.now() -
                                              (Fn.lobbySince || Date.now()) >
                                              (0 === o.players ? 1e4 : 2e4)
                                          ) {
                                            const o = HaloLobby.rooms().find(
                                              (o) =>
                                                o.playlist === e &&
                                                HaloLobby.sameMaps(o.maps, t) &&
                                                o.open &&
                                                o.code !== Fn.room &&
                                                o.created < ea(Fn.created) &&
                                                !Fn.excluded.has(o.code) &&
                                                o.players + n <= _n[e].players,
                                            );
                                            o &&
                                              !Fn.party &&
                                              (c(
                                                `matchmaking: joining the older game in room ${o.code}`,
                                              ),
                                              (Fn.phase = "searching-again"),
                                              (Fn.researchAt = Date.now()),
                                              (Fn.mergeTested = !0),
                                              HaloNet.sendRoom(
                                                "mm-merge",
                                                {},
                                              ).catch(() => {}),
                                              Jn(Un.RESEARCH));
                                          }
                                        }
                                      })().catch((e) => c("matchmaking: " + e)),
                                    1e3,
                                  )));
                              })(0 | n.playlist);
                            else if ("host-lost" === n.event)
                              ma(Fn.gameHost, "game");
                            else if ("stop" === n.event || "left" === n.event)
                              await oa();
                            else if ("main-menu" !== n.event || Fn.moving)
                              if ("host-gone" === n.event) {
                                if (Fn.moving && zn()) return;
                                (Fn.room &&
                                  Fn.excluded.set(Fn.room, Date.now() + 6e4),
                                  await ta());
                              } else if (
                                "join-failed" === n.event ||
                                "host-failed" === n.event
                              ) {
                                if (
                                  (Fn.moving &&
                                    c(
                                      `matchmaking: the game's move to ${Fn.moving.to} failed here (${n.event})`,
                                    ),
                                  (Fn.moving = null),
                                  Fn.room &&
                                    !Fn.party &&
                                    Fn.excluded.set(Fn.room, Date.now() + 6e4),
                                  Fn.party &&
                                    ((Fn.followRetryAt = Date.now() + 5e3),
                                    (Fn.followFails =
                                      1 + (0 | Fn.followFails))),
                                  await ta(),
                                  Fn.party && Fn.followFails >= 3)
                                )
                                  return (
                                    h(
                                      "Couldn't connect to your party's game. You are back in the lobby.",
                                      6e3,
                                    ),
                                    Jn(Un.PARTY_STOP),
                                    void (await oa())
                                  );
                                (Fn.party &&
                                  Fn.party.home &&
                                  HaloNet.status().room !== Fn.party.home &&
                                  yt.current &&
                                  (await Ct(Fn.party.home)),
                                  Fn.playlist >= 0 && Zn());
                              } else {
                                if (
                                  "lobby" === n.event &&
                                  Fn.moving &&
                                  !Fn.moving.searched
                                )
                                  return;
                                if ("lobby" === n.event) {
                                  ((Fn.phase = "lobby"),
                                    (Fn.lobbySince = Date.now()));
                                  const e = Fn.role;
                                  (n.host
                                    ? ((Fn.role = "host"),
                                      (Fn.gameHost = Dn()),
                                      ct(),
                                      Fn.owner && HaloLobby.refresh())
                                    : ("host" === Fn.role || Fn.moving) &&
                                      (Fn.role = "guest"),
                                    Fn.moving &&
                                      (n.host || (Fn.gameHost = Fn.moving.to),
                                      c(
                                        `matchmaking: the game moved: ${Fn.gameHost} hosts it`,
                                      ),
                                      (Fn.moving = null)),
                                    e !== Fn.role &&
                                      HaloNet.setMatchmaking(wa()));
                                } else if ("playing" === n.event) {
                                  ((Fn.phase = "playing"),
                                    (Fn.opponents = (
                                      HaloNet.status().ranks || []
                                    ).slice()),
                                    (Fn.playersAtStart =
                                      (HaloNet.status().players || 0) + 1));
                                  const e = HaloAccount.current;
                                  ((Fn.gamesBefore =
                                    e && e.ranks
                                      ? e.ranks.map((e) => e.games)
                                      : null),
                                    "host" === Fn.role &&
                                      ((Fn.game = 1 + (0 | Fn.game)),
                                      HaloNet.setMatchmaking(wa())),
                                    Fn.owner && HaloLobby.refresh(),
                                    HaloLobby.unseek(),
                                    Aa());
                                } else
                                  "draw" === n.event
                                    ? (async function (e) {
                                        if (
                                          !o.shared ||
                                          !HaloAccount.current ||
                                          "host" !== Fn.role ||
                                          !Fn.room
                                        )
                                          return;
                                        const t = `${Fn.room}:${1 + (0 | Fn.game)}`,
                                          n = Array.isArray(e.players)
                                            ? e.players
                                            : [];
                                        let a;
                                        try {
                                          a = await HaloAccount.matchDraw(
                                            t,
                                            0 | e.playlist,
                                            n,
                                          );
                                        } catch (e) {
                                          return void c(
                                            `matchmaking: no draw for ${t}: ${e.message}`,
                                          );
                                        }
                                        const r = new Int32Array(
                                            o.memory.buffer,
                                          ),
                                          s = Ve("matchmakingDraw"),
                                          i = Object.entries(
                                            a.teams || {},
                                          ).slice(0, 16);
                                        (Atomics.store(r, s + 1, 0 | a.game),
                                          Atomics.store(r, s + 2, i.length),
                                          i.forEach(([e, t], o) => {
                                            const a =
                                              n
                                                .map((e) =>
                                                  String(e.gamertag || ""),
                                                )
                                                .find(
                                                  (t) => t.toLowerCase() === e,
                                                ) || e;
                                            (Dt(r, s + 3 + 7 * o, 6, a),
                                              Atomics.store(
                                                r,
                                                s + 3 + 7 * o + 6,
                                                0 | t,
                                              ));
                                          }),
                                          Atomics.store(r, s, 0 | e.request),
                                          c(
                                            `matchmaking: the server drew game ${a.game} for ${t}${i.length ? ", teams " + JSON.stringify(a.teams) : ""}`,
                                          ));
                                      })(n)
                                    : "result" === n.event
                                      ? ya(n)
                                      : "quit" === n.event &&
                                        ya({
                                          playlist: n.playlist,
                                          place: 1,
                                          groups: 2,
                                          team: !0,
                                          tied: !1,
                                          quit: !0,
                                        });
                              }
                            else {
                              const e = _n[Fn.playlist]
                                ? _n[Fn.playlist].name
                                : `playlist ${Fn.playlist}`;
                              D(
                                "matchmaking-dropped",
                                `put out to the main menu while ${Fn.phase || "searching"} in ${e}`,
                                {
                                  matchmaking: {
                                    phase: Fn.phase || "",
                                    role: Fn.role || "",
                                    room: Fn.room || "",
                                    party: Fn.party ? 0 | Fn.party.size : 0,
                                    seconds: Fn.since
                                      ? Math.round(
                                          (Date.now() - Fn.since) / 1e3,
                                        )
                                      : 0,
                                    net: HaloNet.status(),
                                    game: n,
                                  },
                                },
                              );
                            }
                            nr();
                          })(n)
                        : 3 === t &&
                            /graphics context was lost/.test(n) &&
                            (document.hidden ||
                              (o.hiddenAt &&
                                Date.now() - (o.visibleAt || 0) < 6e4))
                          ? W(
                              "Your phone released the game's graphics while the app was in the background. Reload to continue.",
                              "gpu-lost-background",
                            )
                          : 3 === t && /graphics context was lost/.test(n)
                            ? ((a.smallTextures = !0),
                              (a.smallTexturesChosen = !0),
                              (a.resolution = "auto"),
                              r(),
                              W(n, "gpu-lost"))
                            : 5 === t
                              ? (c("game: " + n),
                                (e("fatal").querySelector("h2").textContent =
                                  "The game quit"),
                                W(n + " Reload to start it again."))
                              : W(n);
        },
        onAbort: (e) => W("The game stopped: " + e),
        onRuntimeInitialized: () => {
          const t = window.Module;
          ((o.shared = t._web_shared_state()),
            (o.offsets = (function (e) {
              const t = e._web_shared_offsets(),
                n = [
                  "size",
                  "eventWrite",
                  "eventRead",
                  "events",
                  "eventSize",
                  "gamepads",
                  "gamepadSize",
                  "displayWidth",
                  "displayHeight",
                  "frameCounter",
                  "framesPresented",
                  "vsync",
                  "audioRate",
                  "audioOpen",
                  "audioWrite",
                  "audioRead",
                  "audioUnderruns",
                  "audioRing",
                  "audioRingFrames",
                  "pageHidden",
                  "gameStarted",
                  "eventCapacity",
                  "gamepadCount",
                  "netLocalAddress",
                  "netOutWrite",
                  "netOutRead",
                  "netInWrite",
                  "netInRead",
                  "netOut",
                  "netOutBytes",
                  "netIn",
                  "netInBytes",
                  "customRules",
                  "customCharacter",
                  "customCharacterStatus",
                  "splitViews",
                  "coopFullViews",
                  "matchmakingCommand",
                  "matchmakingPlayers",
                  "matchmakingRanks",
                  "matchmakingParties",
                  "matchmakingParty",
                  "matchmakingGamertag",
                  "accountNames",
                  "customLobby",
                  "accountRoles",
                  "social",
                  "matchmakingDraw",
                  "menuOptions",
                  "mainMenuUp",
                  "hudLayout",
                  "hudBoxes",
                  "hudScreen",
                  "hudPieces",
                ],
                a = new Int32Array(o.memory.buffer, t, n.length),
                r = {};
              return (
                n.forEach((e, t) => {
                  r[e] = a[t];
                }),
                r
              );
            })(t)),
            De(),
            Pe(),
            qn(),
            Ot(),
            Qe(),
            HaloInput.attach({
              memory: o.memory,
              base: o.shared,
              offsets: o.offsets,
              canvas: i,
              touchRoot: e("touch"),
              touch: a.touch,
              touchLayout: a.touchLayout,
              touchCustom: (a.touchCustom || {})[a.touchLayout],
              touchOpacity: a.touchOpacity,
            }),
            HaloInput.setLookSensitivity(a.look),
            HaloInput.setLookFilter(a.lookFilter ?? 0),
            __gyroApply(a),
            HaloInput.setGyroGate(()=>!document.hidden&&!document.body.classList.contains("editing-layout")&&e("game-menu").hidden&&e("fatal").hidden,()=>({started:!!o.started,playing:document.body.classList.contains("playing"),statusAge:o.gameStatus?Date.now()-o.gameStatus.time:null,menuHidden:e("game-menu").hidden,fatalHidden:e("fatal").hidden})),
            HaloInput.onController((e, t) => {
              h(
                t ? `Controller connected: ${e}` : "Controller disconnected",
                2500,
              );
            }),
            HaloNet.attach({
              memory: o.memory,
              base: o.shared,
              offsets: o.offsets,
            }),
            ct(),
            (e("touch").hidden = !a.touch),
            requestAnimationFrame(Ze),
            setInterval(() => HaloInput.pollGamepads(), 8),
            Xe(),
            (async function () {
              const e = o.audio;
              if (e)
                try {
                  await e.audioWorklet.addModule("audio-worklet.js");
                  const t = new Int32Array(o.memory.buffer),
                    n = new AudioWorkletNode(e, "halo-audio", {
                      numberOfInputs: 0,
                      numberOfOutputs: 1,
                      outputChannelCount: [2],
                      processorOptions: {
                        buffer: o.memory.buffer,
                        ring: o.shared + o.offsets.audioRing,
                        ringFrames: o.offsets.audioRingFrames,
                        write: o.shared + o.offsets.audioWrite,
                        read: o.shared + o.offsets.audioRead,
                        underruns: o.shared + o.offsets.audioUnderruns,
                        rate: 48e3,
                      },
                    });
                  (n.connect(e.destination),
                    (o.audioNode = n),
                    Atomics.store(t, Ve("audioOpen"), 1),
                    c(`audio: ${e.sampleRate} Hz`));
                } catch (e) {
                  (c("audio: " + e), h("Sound is not available: " + e.message));
                }
            })(),
            c("runtime ready"));
          let n = 0;
          setInterval(() => {
            const e = new Int32Array(o.memory.buffer),
              t = Atomics.load(e, Ve("framesPresented")),
              a = performance.memory
                ? ` · page ${Math.round(performance.memory.usedJSHeapSize / 1048576)} MB`
                : "";
            (c(
              `heartbeat: ${t - n} frames from the game in 10 s (${o.presented || 0} shown)` +
                (document.hidden ? ", page hidden" : "") +
                (o.timing ? ` · ${o.timing}` : "") +
                a,
            ),
              (n = t));
          }, 1e4);
        },
      }));
    const f = document.createElement("script");
    ((f.src = "halo.js"),
      (f.onerror = () => W("Could not load halo.js.")),
      document.body.appendChild(f));
  }
  (document.addEventListener("visibilitychange", () => {
    !document.hidden && o.awake && o.awake.on && tt(!0);
  }),
    document.addEventListener(
      "pointerdown",
      () => {
        o.awake &&
          o.awake.on &&
          o.awake.video &&
          o.awake.video.paused &&
          o.awake.video.play().catch(() => {});
      },
      !0,
    ));
  const st = 644,
    it = 645;
  function ct() {
    if (o.shared) {
      const e = new Int32Array(o.memory.buffer);
      (Atomics.store(e, Ve("customRules"), 0 | a.playerRules),
        Atomics.store(e, Ve("customCharacter"), 0 | a.playerCharacter),
        o.offsets &&
          void 0 !== o.offsets.customLobby &&
          (Atomics.store(
            e,
            Ve("customLobby") + st,
            zn()
              ? 0
              : (function () {
                  const e = HaloNet.status().room;
                  return e && o.staffRulesRoom === e && !zn()
                    ? o.staffRules & Go
                    : 0;
                })(),
          ),
          Atomics.store(
            e,
            Ve("customLobby") + it,
            (function () {
              if (zn()) return !1;
              const e = !!o.robot && "owner" === jo(),
                t = !!o.robotHeard && Date.now() - o.robotHeard < lt;
              return e || t;
            })()
              ? 1
              : 0,
          )));
    }
  }
  const lt = 15e3;
  function dt() {
    HaloNet.status().room &&
      HaloNet.sendRoom("staff-robot", { on: !!o.robot }).catch(() => {});
  }
  function ut(t) {
    if (t && "owner" !== jo()) return !1;
    ((o.robot = !!t),
      t &&
        HaloAccount.current &&
        Bt.name !== HaloAccount.current.gamertag &&
        ((Bt.name = HaloAccount.current.gamertag), Ot()),
      ct(),
      dt(),
      clearInterval(o.robotTimer),
      t && (o.robotTimer = setInterval(dt, 5e3)));
    const n = e("mod-robot");
    return (
      n && (n.textContent = o.robot ? "Back to normal" : "Morph into robot"),
      !0
    );
  }
  function mt() {
    const t = HaloCoop.hostStatus();
    let n = "";
    t.enabled &&
      (n =
        t.guest && t.connected
          ? `${t.guest} is player 2` +
            (null !== t.rtt ? ` (${t.rtt} ms)` : "") +
            "."
          : t.guest
            ? `${t.guest} is joining…`
            : "Waiting for a friend in the lobby to join as player 2.");
    for (const t of ["coop-status", "menu-coop-status"])
      ((e(t).textContent = n), (e(t).hidden = !n));
    ((e("coop-host").checked = t.enabled),
      (function (e) {
        if (!o.shared || !o.offsets || void 0 === o.offsets.customLobby) return;
        const t = new Int32Array(o.memory.buffer),
          n = Ve("customLobby"),
          a = e.enabled ? (e.guest && e.connected ? 3 : e.guest ? 2 : 1) : 0,
          r =
            e.connected && Number.isFinite(e.rtt)
              ? Math.max(1, Math.min(9999, Math.round(e.rtt)))
              : 0;
        (Atomics.store(t, n + ht, a | (r << 8)),
          Dt(t, n + ht + 1, 6, e.guest || ""));
      })(t));
    const a = e("coop-hosts");
    a.textContent = "";
    const r = Date.now();
    for (const [e, t] of o.coopHosts) {
      if (r - t.seen > 1e4) {
        o.coopHosts.delete(e);
        continue;
      }
      const n = document.createElement("button");
      ((n.type = "button"),
        (n.className = "button primary"),
        (n.textContent = t.busy
          ? `${t.name}'s co-op is full`
          : `Join ${t.name}'s game as player 2`),
        (n.disabled = t.busy || o.started),
        (n.onclick = () => pt(e, t.name)),
        a.appendChild(n));
    }
    !(function () {
      if (o.coopGuest || HaloCoop.hosting) return;
      const e = [...o.coopHosts.entries()].filter(([, e]) => !e.busy);
      let t = "";
      try {
        t = sessionStorage.getItem(gt) || "";
      } catch {}
      if (t && !o.started) {
        const o = e.find(([, e]) => e.name === t);
        if (o || performance.now() > 6e4)
          try {
            sessionStorage.removeItem(gt);
          } catch {}
        return void (o && pt(o[0], o[1].name));
      }
      if (!o.lobbyJoinedAt || Date.now() - o.lobbyJoinedAt > 12e4) return;
      const n = String((yt.current && yt.current.owner) || "").toLowerCase(),
        a = e.find(([, e]) => String(e.name).toLowerCase() === n);
      if (!a) return;
      const [r, s] = a;
      if (
        ((o.lobbyJoinedAt = 0),
        g(`${s.name}'s Remote Co-op`, "You're player 2"),
        o.started)
      ) {
        try {
          sessionStorage.setItem(gt, s.name);
        } catch {}
        setTimeout(() => location.reload(), 1500);
      } else pt(r, s.name);
    })();
  }
  o.coopHosts = new Map();
  const ht = 656;
  const gt = "halo-web-coop-join";
  function pt(t, n) {
    ((o.coopGuest = !0),
      document.body.classList.add("playing", "coop-guest"),
      (e("coop-view").hidden = !1),
      nt(),
      ot());
    const r = e("coop-video");
    (HaloInput.attachLocal({
      surface: r,
      touchRoot: e("touch"),
      touch: a.touch,
      touchLayout: a.touchLayout,
      touchCustom: (a.touchCustom || {})[a.touchLayout],
      touchOpacity: a.touchOpacity,
    }),
      HaloInput.setLookSensitivity(a.look),
      HaloInput.setLookFilter(a.lookFilter ?? 0),
      __gyroApply(a),
      HaloInput.setGyroGate(()=>!document.hidden&&!document.body.classList.contains("editing-layout")&&e("game-menu").hidden&&e("fatal").hidden,()=>({started:!!o.started,playing:document.body.classList.contains("playing"),statusAge:o.gameStatus?Date.now()-o.gameStatus.time:null,menuHidden:e("game-menu").hidden,fatalHidden:e("fatal").hidden})),
      (e("touch").hidden = !a.touch),
      (e("coop-part").onchange = (e) => HaloCoop.setView(e.target.value)),
      (e("coop-leave").onclick = () => {
        (HaloCoop.leave(), location.reload());
      }),
      (e("coop-friend-status").textContent = `Joining ${n}'s game…`),
      HaloCoop.join(t, n, r));
  }
  const ft = "halo-web-lobby",
    At = 16,
    yt = {
      current: null,
      list: [],
      timer: null,
      identityTimer: null,
      key: null,
      restored: !1,
      who: "",
    };
  function wt() {
    const e = HaloNet.status().room;
    return !(!yt.current || !e || e !== yt.current.room);
  }
  function bt() {
    const e = HaloAccount.current;
    return !(
      !e ||
      !yt.current ||
      yt.current.owner.toLowerCase() !== e.gamertag.toLowerCase()
    );
  }
  function vt(e, t) {
    const o = document.createElement("b");
    ((o.className = "count"),
      (o.textContent = String(t)),
      (e.textContent = ""),
      e.append(
        1 === t ? "There is currently " : "There are currently ",
        o,
        1 === t ? " user in this lobby." : " users in this lobby.",
      ));
  }
  function kt(t) {
    const o = HaloAccount.current;
    ((e("online-locked").hidden = !!o), (e("online-open").hidden = !o));
    const n = !!o && wt();
    if (
      ((e("online-room").hidden = !n),
      (e("online-start").hidden = !0),
      (e("online-quick").hidden = !0),
      (e("lobby-section").hidden = !0),
      n)
    ) {
      const n = yt.current;
      ((e("lobby-name").textContent = n.name),
        (e("lobby-privacy").textContent = n.public ? "Public" : "Private"),
        (e("lobby-privacy").className = "pill" + (n.public ? "" : " private")),
        vt(e("online-status"), 1 + (0 | t.players)),
        t.brokers || e("online-status").append(" (connecting…)"),
        (e("online-names").textContent = [o.gamertag, ...t.names].join(", ")),
        (e("lobby-public-row").hidden = !0),
        (e("lobby-public").checked = n.public),
        (e("lobby-invite").hidden = !0),
        (e("online-leave").hidden = !0));
    } else Bn(null);
    ((e("tab-room-label").textContent = "Lobby"),
      no() && "room" === oo.tab && Eo(),
      It(),
      Ot(),
      tr());
  }
  async function Ct(e) {
    try {
      return await HaloNet.join(
        e,
        (function () {
          const e = {},
            t = String(a.turnUrl || "").trim();
          return (
            /^(turns?|stun):\S+$/i.test(t) &&
              (e.turn = {
                urls: t,
                username: a.turnUser || "",
                credential: a.turnPassword || "",
              }),
            e
          );
        })(),
      );
    } catch (e) {
      return (h(e.message), null);
    }
  }
  function St() {
    return Fn.playlist >= 0 && !!Fn.phase;
  }
  async function Lt(e, t) {
    if (St())
      return (
        h(
          "Leave matchmaking first: press B in the search or in the game's lobby.",
          5e3,
        ),
        !1
      );
    if (!(await Ct(e.room))) return !1;
    yt.current = e;
    try {
      localStorage.setItem(ft, e.id);
    } catch {}
    const n = bt();
    return (
      (o.lobbyJoinedAt = 0),
      Bn(n ? "host" : "guest", e.owner),
      t || g(e.name),
      kt(HaloNet.status()),
      nr(),
      !0
    );
  }
  async function Ht(e, t) {
    if (!HaloAccount.current) return (h("Sign in to play online."), !1);
    if (wt() && yt.current.id === e) return !0;
    try {
      const { lobby: o } = await HaloAccount.joinLobby(e);
      return await Lt(o, t);
    } catch (e) {
      return (t || h(e.message, 5e3), !1);
    }
  }
  async function Et(e) {
    if (!HaloAccount.current) return (h("Sign in to play online."), !1);
    try {
      const { lobby: t } = await HaloAccount.makeLobby(e);
      return await Lt(t);
    } catch (e) {
      return (h(e.message, 5e3), !1);
    }
  }
  async function xt() {
    const e = yt.current;
    yt.current = null;
    try {
      localStorage.removeItem(ft);
    } catch {}
    (e && HaloAccount.current && HaloAccount.leaveLobby(e.id).catch(() => {}),
      await HaloNet.leave(),
      nr(),
      Tt());
  }
  async function Nt(e) {
    const t = yt.current;
    if (t) {
      try {
        const o = await HaloAccount.lobbySettings(t.id, e);
        ((yt.current = { ...yt.current, public: o.lobby.public }),
          h(
            o.lobby.public
              ? "Your lobby is public: anyone signed in can find it in Browse Lobbies."
              : "Your lobby is private: only players you invite can join.",
            5e3,
          ));
      } catch (e) {
        h(e.message);
      }
      kt(HaloNet.status());
    }
  }
  async function Tt() {
    if (!HaloAccount.current) return ((yt.list = []), void It());
    try {
      yt.list = (await HaloAccount.lobbies()).lobbies.filter(
        (e) => !(e.settings && 1 === e.settings.mode),
      );
    } catch (e) {
      c("lobbies: " + e.message);
    }
    It();
  }
  function $t(e) {
    const t = wt() && yt.current.id === e.id,
      o = e.players >= At,
      n = document.createElement("div");
    n.className = "lobby-room" + (t ? " mine" : "");
    const a = document.createElement("span");
    a.className = "who";
    const r = document.createElement("strong");
    r.textContent = e.name;
    const s = document.createElement("small");
    ((s.textContent = 1 === e.players ? "1 player" : `${e.players} players`),
      a.append(r, s));
    const i = document.createElement("span");
    ((i.className = "count"), (i.textContent = `${e.players}/${At}`));
    const c = document.createElement("button");
    return (
      (c.type = "button"),
      (c.className = "button small-button"),
      (c.textContent = t ? "Joined" : o ? "Full" : "Join"),
      (c.disabled = t || o),
      (c.onclick = () => Ht(e.id)),
      n.append(a, i, c),
      n
    );
  }
  function It() {
    const t = HaloAccount.current;
    for (const [t, o] of [
      ["lobby-list", "lobby-empty"],
      ["pane-lobby-list", "pane-lobby-empty"],
    ]) {
      const n = e(t);
      n.textContent = "";
      for (const e of yt.list) n.appendChild($t(e));
      e(o).hidden = yt.list.length > 0;
    }
    ((e("pane-lobby-empty").textContent = t
      ? "No public lobbies right now. Open yours, or ask a friend for an invite."
      : "Sign in on the start page to play online."),
      (e("pane-lobby-create").closest(".row").hidden = !t),
      (e("lobby-count").textContent = yt.list.length
        ? `(${yt.list.length})`
        : ""),
      Ot());
  }
  const Mt = {
      SEQUENCE: 0,
      STATE: 1,
      FLAGS: 2,
      MEMBERS: 3,
      NAME: 4,
      MEMBER_NAMES: 16,
      LIST_COUNT: 112,
      LIST: 113,
      MEMBER_ROLES: 192,
      STRIDE: 13,
      SLOTS: 6,
      LIST_VERSION: 191,
      MAP_KEY: 208,
      MAP_NAME: 216,
      TYPE: 228,
      SCORE: 240,
      TIME: 248,
      WEAPONS: 256,
      SETTINGS_FLAGS: 272,
      COMMAND: 273,
      SETTINGS_VALUES: 274,
      SETTINGS_COUNT: 11,
      MODE: 286,
      OWNER_STYLE: 287,
      OWNER_NAME: 648,
      HOST_ROLE: 663,
      HOST_START: 664,
      HOST_NAME: 665,
      HANDOFF: 671,
      BROWSE_COUNT: 288,
      BROWSE: 289,
      BROWSE_STRIDE: 44,
      BROWSE_SLOTS: 8,
    },
    Rt = {
      sequence: 0,
      busy: !1,
      listed: [],
      listKey: "",
      listVersion: 0,
      browsed: [],
      command: 0,
      settingsTimer: null,
      settingsSent: 0,
      team: 0,
      hostStart: 0,
      handoff: 0,
    };
  function Dt(e, t, o, n) {
    n = String(n || "").slice(0, 2 * o - 1);
    for (let a = 0; a < o; a++) {
      const o = 2 * a < n.length ? n.charCodeAt(2 * a) : 0,
        r = 2 * a + 1 < n.length ? n.charCodeAt(2 * a + 1) : 0;
      Atomics.store(e, t + a, o | (r << 16));
    }
  }
  function Ot() {
    if (!o.shared || !o.offsets || void 0 === o.offsets.customLobby) return;
    const e = new Int32Array(o.memory.buffer),
      t = Ve("customLobby"),
      n = HaloAccount.current,
      a = wt(),
      r = a ? yt.current : null,
      s = HaloNet.status();
    (Atomics.store(e, t + Mt.STATE, a ? (bt() ? 2 : 1) : 0),
      Atomics.store(
        e,
        t + Mt.FLAGS,
        (r && r.public ? 1 : 0) | (Rt.busy ? 2 : 0),
      ));
    const i = a && n ? [n.gamertag, ...s.names] : [];
    (Atomics.store(e, t + Mt.MEMBERS, i.length),
      Dt(e, t + Mt.NAME, 12, r ? r.name : ""));
    for (let o = 0; o < 16; o++)
      Dt(e, t + Mt.MEMBER_NAMES + 6 * o, 6, i[o] || "");
    const c = a && n ? [n.role || "", ...(s.roles || [])] : [];
    for (let o = 0; o < 16; o++) {
      const n = 0 === o ? -1 : (s.colors || [])[o - 1],
        r = a ? (0 === o ? Rt.team : 0 | (s.teams || [])[o - 1]) : 0;
      Atomics.store(
        e,
        t + Mt.MEMBER_ROLES + o,
        ("owner" === c[o] ? 2 : "mod" === c[o] ? 1 : 0) |
          ((Number.isInteger(n) && n >= 0 && n < 18 ? n + 1 : 0) << 8) |
          ((3 & r) << 16),
      );
    }
    Rt.listed = yt.list.filter((e) => !(r && e.id === r.id)).slice(0, Mt.SLOTS);
    const l = Rt.listed.map((e) => e.id + ":" + e.players).join();
    (l !== Rt.listKey && ((Rt.listKey = l), Rt.listVersion++),
      Atomics.store(e, t + Mt.LIST_COUNT, Rt.listed.length));
    for (let o = 0; o < Mt.SLOTS; o++) {
      const n = Rt.listed[o],
        a = t + Mt.LIST + o * Mt.STRIDE;
      (Atomics.store(e, a, n ? n.players : 0),
        Dt(e, a + 1, 12, n ? n.name : ""));
    }
    Atomics.store(e, t + Mt.LIST_VERSION, Rt.listVersion);
    const d = (r && r.settings) || {};
    (Dt(e, t + Mt.MAP_KEY, 8, d.key || ""),
      Dt(e, t + Mt.MAP_NAME, 12, d.map || ""),
      Dt(e, t + Mt.TYPE, 12, d.type || ""),
      Dt(e, t + Mt.SCORE, 8, d.score || ""),
      Dt(e, t + Mt.TIME, 8, d.time || ""),
      Dt(e, t + Mt.WEAPONS, 16, d.weapons || ""),
      Atomics.store(e, t + Mt.SETTINGS_FLAGS, d.teams ? 1 : 0));
    const u =
      Array.isArray(d.values) && d.values.length >= Mt.SETTINGS_COUNT
        ? d.values
        : null;
    for (let o = 0; o < Mt.SETTINGS_COUNT; o++)
      Atomics.store(e, t + Mt.SETTINGS_VALUES + o, u ? 0 | u[o] : 0);
    (Atomics.store(
      e,
      t + Mt.SETTINGS_VALUES + Mt.SETTINGS_COUNT,
      u && d.key ? 1 : 0,
    ),
      Atomics.store(e, t + Mt.COMMAND, Rt.command),
      Atomics.store(
        e,
        t + Mt.MODE,
        d.mode |
          (d.playlist << 8) |
          ((31 & (d.characters ?? 30)) << 16) |
          ((63 & d.rules) << 21),
      ),
      Atomics.store(e, t + Mt.OWNER_STYLE, Bt.icon | (Bt.color << 8)),
      Dt(e, t + Mt.OWNER_NAME, 6, Bt.name || ""));
    const m = a ? Jt() : "",
      h = n ? n.gamertag.toLowerCase() : "";
    (Atomics.store(
      e,
      t + Mt.HOST_ROLE,
      !m || (r && m.toLowerCase() === r.owner.toLowerCase())
        ? 0
        : m.toLowerCase() === h
          ? 1
          : 2,
    ),
      Atomics.store(e, t + Mt.HOST_START, Rt.hostStart),
      Atomics.store(e, t + Mt.HANDOFF, Rt.handoff),
      Dt(e, t + Mt.HOST_NAME, 6, m || ""),
      (Rt.browsed = yt.list
        .filter((e) => !(r && e.id === r.id))
        .slice(0, Mt.BROWSE_SLOTS)),
      Atomics.store(e, t + Mt.BROWSE_COUNT, Rt.browsed.length));
    for (let o = 0; o < Mt.BROWSE_SLOTS; o++) {
      const n = Rt.browsed[o],
        a = (n && n.settings) || {},
        r = t + Mt.BROWSE + o * Mt.BROWSE_STRIDE;
      (Atomics.store(e, r, n ? n.players : 0),
        Dt(e, r + 1, 12, n ? n.name : ""),
        Dt(e, r + 13, 8, (n && a.key) || ""),
        Dt(e, r + 21, 8, (n && a.map) || ""),
        Dt(e, r + 29, 8, (n && a.type) || ""),
        Dt(e, r + 37, 7, (n && a.score) || ""));
    }
    Atomics.store(e, t + Mt.SEQUENCE, ++Rt.sequence);
  }
  const Pt = [
      { name: "Purple", css: "#a066f0" },
      { name: "Lavender", css: "#c9a6ff" },
      { name: "Pink", css: "#ff6fcf" },
      { name: "Crimson", css: "#ff4a5a" },
      { name: "Gold", css: "#ffd24a" },
      { name: "Lime", css: "#a8f05a" },
      { name: "Emerald", css: "#3fd98a" },
      { name: "Cyan", css: "#4ee6f0" },
      { name: "Sky", css: "#5aa8ff" },
      { name: "White", css: "#f4f6ff" },
      { name: "Rainbow", css: "#ff6fcf", rainbow: "still" },
      { name: "Rainbow scroll", css: "#ff6fcf", rainbow: "scroll" },
    ],
    Bt = { icon: 0, color: 0, name: "" };
  function _t(e) {
    ((Bt.icon = Math.max(0, Math.min(1, e && 0 | e.icon))),
      (Bt.color = Math.max(0, Math.min(Pt.length - 1, e && 0 | e.color))),
      e &&
        "string" == typeof e.name &&
        e.name &&
        (Bt.name = e.name.slice(0, 15)),
      document.documentElement.style.setProperty(
        "--owner-color",
        Pt[Bt.color].css,
      ));
    const t = Pt[Bt.color].rainbow;
    (document.documentElement.classList.toggle("owner-rainbow", "still" === t),
      document.documentElement.classList.toggle(
        "owner-rainbow-scroll",
        "scroll" === t,
      ),
      Ot(),
      no() &&
        ("global" === oo.tab
          ? wn()
          : "friends" === oo.tab || "dm" === oo.tab
            ? Ba()
            : Eo()));
  }
  const Wt = [
      "Pillar of Autumn",
      "Halo",
      "Truth and Reconciliation",
      "Silent Cartographer",
      "Control Room",
      "343 Guilty Spark",
      "The Library",
      "Two Betrayals",
      "Keyes",
      "The Maw",
    ],
    Ut = ["Easy", "Normal", "Heroic", "Legendary"],
    Ft = "halo-web-campaign-progress";
  function Gt(e) {
    if (
      (function (e) {
        if ("owner" !== e.role && "mod" !== e.role) return !1;
        if ("staff-fun" === e.kind)
          return (ln(e.data || {}, e.name, e.role), !0);
        if ("staff-robot" === e.kind)
          return (
            "owner" === e.role &&
              ((t = e.data || {}),
              (n = e.name),
              (o.robotHeard = t && t.on ? Date.now() : 0),
              o.robotHeard &&
                n &&
                Bt.name !== n &&
                ((Bt.name = String(n).slice(0, 15)), Ot()),
              ct(),
              clearTimeout(o.robotExpiry),
              o.robotHeard && (o.robotExpiry = setTimeout(ct, lt + 200))),
            !0
          );
        var t, n;
        if ("staff-rules" === e.kind)
          return (dn(e.data || {}, e.name, e.role), !0);
        return !1;
      })(e)
    )
      return;
    if (
      (function (e) {
        if (
          !["mm-quality", "mm-ranked", "mm-move", "mm-merge"].includes(e.kind)
        )
          return !1;
        if (!zn()) return !0;
        const t = String(e.name || ""),
          o = e.data || {};
        "mm-quality" === e.kind
          ? 1 === o.v &&
            Fn.reports.set(t.toLowerCase(), {
              name: t,
              at: Date.now(),
              report: o,
            })
          : "mm-ranked" === e.kind
            ? t.toLowerCase() === (Fn.gameHost || "").toLowerCase() &&
              Array.isArray(o.ranked) &&
              (Fn.ranked = o.ranked.slice(0, 16).map(String))
            : "mm-merge" === e.kind
              ? t.toLowerCase() === (Fn.gameHost || "").toLowerCase() &&
                (Fn.mergeAt = Date.now())
              : "mm-move" === e.kind &&
                (t.toLowerCase() !== (Fn.gameHost || "").toLowerCase() ||
                  Fn.moving ||
                  "string" != typeof o.to ||
                  ua({
                    to: o.to.slice(0, 16),
                    from: t,
                    handoff: !1,
                    game: 0 | o.game,
                  }));
        return !0;
      })(e)
    )
      return;
    if (
      (function (e) {
        const t = yt.current;
        if (!t || !wt()) return !1;
        const o = e.name.toLowerCase() === t.owner.toLowerCase();
        if ("host-quality" === e.kind)
          return (
            e.data &&
              1 === e.data.v &&
              jt.reports.set(e.name.toLowerCase(), {
                name: e.name,
                at: Date.now(),
                report: e.data,
              }),
            !0
          );
        if ("lobby-host" === e.kind) {
          if (o && !bt() && e.data && "string" == typeof e.data.host) {
            Jt();
            const t = e.data.host.slice(0, 16);
            ((jt.ranked = Array.isArray(e.data.ranked)
              ? e.data.ranked.slice(0, 16).map(String)
              : []),
              t !== jt.elected &&
                ((jt.elected = t),
                (jt.electedAt = Date.now()),
                c(`lobby host: ${t} (the owner's choice)`),
                Ot()));
          }
          return !0;
        }
        if ("lobby-start" === e.kind) {
          const t = HaloAccount.current
            ? HaloAccount.current.gamertag.toLowerCase()
            : "";
          return (
            o &&
              e.data &&
              String(e.data.host || "").toLowerCase() === t &&
              (c("lobby host: starting the lobby's game here"),
              Rt.hostStart++,
              Ot()),
            !0
          );
        }
        return !1;
      })(e)
    )
      return;
    const t = yt.current;
    if (t)
      if (
        "party-stop" !== e.kind ||
        e.name.toLowerCase() !== t.owner.toLowerCase() ||
        bt()
      ) {
        if (
          wt() &&
          ("lobby-settings" !== e.kind ||
            e.name.toLowerCase() !== t.owner.toLowerCase() ||
            bt() ||
            ((t.settings = e.data), Ot()),
          "party-search" === e.kind &&
            e.name.toLowerCase() === t.owner.toLowerCase() &&
            !bt())
        ) {
          const o = 0 | e.data.playlist,
            n = "string" == typeof e.data.sid ? e.data.sid.slice(0, 16) : "";
          _n[o] &&
            Fn.playlist < 0 &&
            HaloAccount.current &&
            (!n || n !== Fn.declinedPartySearch) &&
            ((Fn.followingPartySearch = n),
            Jn(Un.PARTY_SEARCH + o),
            Date.now() - (Fn.partyToldAt || 0) > 3e4 &&
              ((Fn.partyToldAt = Date.now()),
              h(
                `${t.owner} started a search for ${_n[o].name}. Your party is searching together.`,
                5e3,
              )));
        }
      } else Fn.party && Fn.playlist >= 0 && Jn(Un.PARTY_STOP);
  }
  const jt = {
    reports: new Map(),
    elected: "",
    electedAt: 0,
    scores: {},
    timer: null,
  };
  function Yt() {
    const e = S.fps.slice(-30),
      t = e.length
        ? Math.round(e.reduce((e, t) => e + t.fps, 0) / e.length)
        : 60;
    return o.lastGameFps ? Math.min(o.lastGameFps, t) : t;
  }
  function qt() {
    return {
      v: 1,
      fps: Yt(),
      playing: Vt(),
      hidden: document.hidden,
      bias: Math.max(
        0,
        Math.min(
          5e3,
          Number(new URLSearchParams(location.search).get("hostbias")) || 0,
        ),
      ),
      links: HaloNet.connections().map((e) => ({
        name: e.name,
        rtt: e.rtt,
        jitter: e.jitter,
        loss: e.loss,
      })),
    };
  }
  function zt(e, t) {
    if (!e || !t.length) return 1 / 0;
    let o = 0;
    for (const n of t) {
      const t = (e.links || []).find(
        (e) => e.name.toLowerCase() === n.toLowerCase(),
      );
      o +=
        t && null !== t.rtt && void 0 !== t.rtt
          ? t.rtt + 2 * (0 | t.jitter) + 400 * (t.loss || 0)
          : 400;
    }
    const n = Number(e.fps) || 0;
    return (
      o / t.length +
      (n < 50 ? 10 * (50 - n) : 0) +
      Math.max(0, Math.min(5e3, Number(e.bias) || 0))
    );
  }
  function Jt() {
    const e = yt.current;
    return e
      ? (jt.lobby !== e.id &&
          ((jt.lobby = e.id), (jt.elected = ""), jt.reports.clear()),
        jt.elected || e.owner)
      : "";
  }
  function Vt() {
    return (
      document.body.classList.contains("playing") &&
      !document.body.classList.contains("at-menus")
    );
  }
  async function Qt() {
    const e = HaloAccount.current;
    if ((clearTimeout(yt.identityTimer), !e)) {
      yt.current = null;
      try {
        localStorage.removeItem(ft);
      } catch {}
      return (
        St() && (await oa()),
        await HaloNet.setIdentity(null),
        kt(HaloNet.status()),
        !1
      );
    }
    try {
      yt.key || (yt.key = (await HaloAccount.ticketKey()).jwk);
      const e = await HaloAccount.ticket(HaloNet.id);
      (HaloNet.setRelays(e.ice),
        await HaloNet.setIdentity({
          ticket: e.ticket,
          gamertag: e.gamertag,
          key: yt.key,
          role: e.role || "",
          muted: e.muted || 0,
        }),
        HaloAccount.current && HaloAccount.setRole(e.role || ""),
        (yt.identityTimer = setTimeout(Qt, 216e5)));
    } catch (e) {
      return (
        c("online: " + e.message),
        (yt.identityTimer = setTimeout(Qt, 6e4)),
        !1
      );
    }
    if (!yt.restored) {
      yt.restored = !0;
      let e = null;
      try {
        e = localStorage.getItem(ft);
      } catch {}
      if (e && !HaloNet.status().room && !(await Ht(e, !0)))
        try {
          localStorage.removeItem(ft);
        } catch {}
    }
    return (Tt(), !0);
  }
  async function Zt() {
    if (!HaloAccount.current) return void h("Sign in to play online.");
    if (!ce()) return void h("Add a disc image first (Game data).");
    const t = e("quick-match");
    ((t.disabled = !0), (t.textContent = "Searching…"));
    try {
      await Tt();
      const e = HaloAccount.current.gamertag.toLowerCase(),
        t = yt.list.filter(
          (t) =>
            t.owner.toLowerCase() !== e &&
            t.players < At &&
            !(wt() && yt.current.id === t.id),
        );
      t.length
        ? await Ht(t[0].id)
        : wt()
          ? h("No other public lobbies right now.")
          : (await Et(!0)) &&
            h(
              "No public lobbies right now, so you opened your own. Others can find it in Browse Lobbies.",
              6e3,
            );
    } finally {
      ((t.disabled = !1), (t.textContent = "Quick Match"));
    }
  }
  (document.addEventListener("visibilitychange", () => {
    document.hidden ? (o.hiddenAt = Date.now()) : (o.visibleAt = Date.now());
  }),
    document.addEventListener("visibilitychange", () => {
      if (!wt() || !HaloAccount.current) return;
      const e = HaloAccount.current.gamertag,
        t = qt();
      (jt.reports.set(e.toLowerCase(), { name: e, at: Date.now(), report: t }),
        HaloNet.sendRoom("host-quality", t).catch(() => {}));
    }),
    (jt.timer = setInterval(() => {
      try {
        !(function () {
          if (!wt() || !HaloAccount.current) return;
          Jt();
          const e = HaloAccount.current.gamertag,
            t = qt();
          if (
            (jt.reports.set(e.toLowerCase(), {
              name: e,
              at: Date.now(),
              report: t,
            }),
            HaloNet.sendRoom("host-quality", t).catch(() => {}),
            !bt())
          )
            return;
          const o = [e, ...HaloNet.status().names],
            n = {};
          for (const e of o) {
            const t = jt.reports.get(e.toLowerCase());
            !t ||
              Date.now() - t.at > 12e3 ||
              (t.report && t.report.hidden) ||
              (n[t.name] = Math.round(
                zt(
                  t.report,
                  o.filter((t) => t.toLowerCase() !== e.toLowerCase()),
                ),
              ));
          }
          const a = Object.entries(n).sort(
              (e, t) => e[1] - t[1] || (e[0] < t[0] ? -1 : 1),
            ),
            r =
              jt.elected &&
              o.some((e) => e.toLowerCase() === jt.elected.toLowerCase())
                ? jt.elected
                : e;
          let s = r;
          if (a.length) {
            const [e, t] = a[0],
              o = n[r] ?? 1 / 0,
              i =
                Vt() ||
                Date.now() - (jt.startedAt || 0) < 12e4 ||
                [...jt.reports.values()].some(
                  (e) =>
                    Date.now() - e.at < 12e3 && e.report && e.report.playing,
                );
            e !== r && t < o - Math.max(20, 0.15 * o) && !i && (s = e);
          }
          ((jt.scores = n),
            (jt.ranked = a.map(([e]) => e)),
            s !== jt.elected &&
              (c(
                `lobby host: ${s} (${a.map(([e, t]) => `${e} ${t}`).join(", ")})`,
              ),
              (jt.elected = s),
              (jt.electedAt = Date.now()),
              Ot()),
            HaloNet.sendRoom("lobby-host", {
              host: jt.elected,
              ranked: jt.ranked,
            }).catch(() => {}));
        })();
      } catch (e) {
        c("lobby host: " + (e && e.message));
      }
    }, 3e3)),
    setInterval(() => {
      wt() && Vt() && (o.lobbyGameSeenAt = Date.now());
    }, 1e3));
  const Xt = [
      "GG",
      "Nice shot!",
      "Need backup",
      "On my way",
      "Ready?",
      "One more?",
    ],
    Kt = "halo-web-muted",
    eo = { messages: [], unread: 0, room: null };
  const to = !0,
    oo = {
      tab: "friends",
      dmWith: null,
      dms: new Map(),
      global: { messages: [], online: 0, unread: !1 },
      stopTimer: null,
      picked: null,
    };
  function no() {
    return !e("chat").hidden;
  }
  function ao() {
    try {
      return new Set(JSON.parse(localStorage.getItem(Kt) || "[]"));
    } catch {
      return new Set();
    }
  }
  const ro =
      '<svg class="rank-ring" viewBox="0 0 24 24" aria-hidden="true"><g transform="rotate(-17 12 12)"><ellipse cx="12" cy="12" rx="10.4" ry="5.2" fill="none" stroke="#0a1220" stroke-width="3.4" opacity=".55"/><path d="M1.6 12A10.4 5.2 0 0 1 22.4 12" fill="none" stroke="#c9d0dc" stroke-width="1"/><path d="M2.9 12.2A9.1 4.1 0 0 1 21.1 12.2" fill="none" stroke="#3f95d6" stroke-width="2"/><path d="M6 8.9A9.1 4.1 0 0 1 10.5 8.1" fill="none" stroke="#5fb873" stroke-width="2"/><path d="M14.6 8.2A9.1 4.1 0 0 1 18.4 9.3" fill="none" stroke="#5fb873" stroke-width="2"/><path d="M1.6 12A10.4 5.2 0 0 0 22.4 12" fill="none" stroke="#e9eef6" stroke-width="1.8"/></g></svg>',
    so =
      '<img class="rank-ring rank-bulldog" src="art/owner-bulldog.png" alt="" aria-hidden="true">',
    io =
      '<svg class="rank-ring rank-banhammer" viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 9.5 L3.2 20.8" stroke="#0a1220" stroke-width="4.4" stroke-linecap="round"/> <path d="M14.5 9.5 L3.2 20.8" stroke="#8a5428" stroke-width="2.4" stroke-linecap="round"/> <path d="M11.6 12.9 L3.9 20.6" stroke="#c0803f" stroke-width="0.8" stroke-linecap="round"/> <g transform="rotate(45 14.5 9.5) translate(0 0)"> <rect x="7.6" y="5.7" width="13.8" height="7.6" rx="1.6" fill="#0a1220"/> <rect x="8.6" y="6.7" width="11.8" height="5.6" rx="1" fill="#ff9d3b"/> <rect x="8.6" y="6.7" width="11.8" height="1.7" rx="0.8" fill="#ffc27a"/> <rect x="8.6" y="10.6" width="11.8" height="1.7" rx="0.8" fill="#d06a12"/> <rect x="12.9" y="6.2" width="3.2" height="6.6" rx="0.6" fill="#0a1220"/> <rect x="13.5" y="6.7" width="2" height="5.6" fill="#ffd8a8"/> </g></svg>',
    co = { owner: "Owner", mod: "Moderator" };
  function lo(e, t, o) {
    const n = o || document.createElement("b");
    ((n.textContent = ""),
      co[t] &&
        (n.classList.add("rank-" + t),
        (n.title = co[t]),
        "owner" === t
          ? n.insertAdjacentHTML("afterbegin", 1 === Bt.icon ? so : ro)
          : "mod" === t && n.insertAdjacentHTML("afterbegin", io)));
    const a = document.createElement("span");
    return ((a.className = "rank-name"), (a.textContent = e), n.append(a), n);
  }
  const uo = { global: null, room: null };
  function mo() {
    const e = new Map(),
      t = (t) => {
        const o = String(t || "").trim();
        o && !e.has(o.toLowerCase()) && e.set(o.toLowerCase(), o);
      };
    HaloAccount.current && t(HaloAccount.current.gamertag);
    for (const e of HaloNet.status().names || []) t(e);
    for (const e of eo.messages) e.system || t(e.name);
    if (xa.data) for (const e of xa.data.friends) t(e.gamertag);
    for (const e of oo.global.messages.slice(-80)) e.system || t(e.from);
    return e;
  }
  function ho(e) {
    const t = [],
      o = [...mo().values()].sort((e, t) => t.length - e.length),
      n = String(e).toLowerCase();
    for (let a = n.indexOf("@"); a >= 0; a = n.indexOf("@", a + 1)) {
      if (a > 0 && /[\w@]/.test(n[a - 1])) continue;
      const r = n.slice(a + 1);
      let s = o.find(
        (e) =>
          r.startsWith(e.toLowerCase()) && !/[\w]/.test(r.charAt(e.length)),
      );
      if (!s) {
        const t = /^[\w-]{1,15}/.exec(String(e).slice(a + 1));
        if (!t) continue;
        s = t[0];
      }
      (t.push({ start: a, end: a + 1 + s.length, name: s }), (a += s.length));
    }
    return t;
  }
  const go = /\b(?:https?:\/\/|www\.)[^\s<>"']+/gi;
  function po(e, t) {
    const o = HaloAccount.current
      ? HaloAccount.current.gamertag.toLowerCase()
      : "";
    let n = 0;
    for (const a of ho(t)) {
      a.start > n && e.append(document.createTextNode(t.slice(n, a.start)));
      const r = document.createElement("span");
      ((r.className = "mention" + (a.name.toLowerCase() === o ? " me" : "")),
        (r.textContent = t.slice(a.start, a.end)),
        e.append(r),
        (n = a.end));
    }
    n < t.length && e.append(document.createTextNode(t.slice(n)));
  }
  function fo(e) {
    const t = HaloAccount.current;
    if (!t || e.system || e.self) return !1;
    const o = t.gamertag.toLowerCase();
    return (
      (e.reply && String(e.reply.from || e.reply.name || "").toLowerCase()) ===
        o || ho(e.text || "").some((e) => e.name.toLowerCase() === o)
    );
  }
  function Ao(t, o) {
    if (!o || o.system || !HaloAccount.current) return;
    ((uo[t] =
      "global" === t
        ? { id: o.id, from: o.from, text: String(o.text).slice(0, 80) }
        : { name: o.self ? Dn() : o.name, text: String(o.text).slice(0, 80) }),
      yo(t));
    e("global" === t ? "global-input" : "chat-input").focus();
  }
  function yo(t) {
    const o = e("global" === t ? "global-replying" : "chat-replying"),
      n = uo[t];
    if (((o.hidden = !n), !n)) return;
    const a = o.querySelector("span");
    a.textContent = "";
    const r = document.createElement("b");
    ((r.textContent = n.from || n.name),
      a.append("Replying to ", r, ": " + n.text));
  }
  function wo(e) {
    ((uo[e] = null), yo(e));
  }
  function bo(t, o) {
    const n = e(t),
      a = n.value,
      r = n.selectionStart ?? a.length,
      s = a.slice(0, r).replace(/@[^@]{0,24}$/, ""),
      i = s && !/\s$/.test(s) ? s + " " : s;
    n.value = `${i}@${o} ${a.slice(r).replace(/^\s+/, "")}`;
    const c = i.length + o.length + 2;
    n.focus();
    try {
      n.setSelectionRange(c, c);
    } catch {}
    ko(t);
  }
  function vo(t) {
    const o = e(t),
      n = e("global-input" === t ? "global-mentions" : "chat-mentions"),
      a = o.value.slice(0, o.selectionStart ?? o.value.length),
      r = /(?:^|\s)@([^@]{0,15})$/.exec(a);
    if (((n.textContent = ""), !r)) return void (n.hidden = !0);
    const s = r[1].toLowerCase(),
      i = HaloAccount.current ? HaloAccount.current.gamertag.toLowerCase() : "",
      c = [...mo().values()]
        .filter((e) => e.toLowerCase() !== i && e.toLowerCase().startsWith(s))
        .slice(0, 6);
    n.hidden = !c.length;
    for (const e of c) {
      const o = document.createElement("button");
      ((o.type = "button"),
        (o.className = "button small-button"),
        (o.textContent = "@" + e),
        (o.onpointerdown = (o) => {
          (o.preventDefault(), bo(t, e));
        }),
        n.appendChild(o));
    }
  }
  function ko(t) {
    const o = e("global-input" === t ? "global-mentions" : "chat-mentions");
    ((o.hidden = !0), (o.textContent = ""));
  }
  function Co(e, t) {
    const n = e.from || e.name || "Someone",
      a =
        e.reply &&
        String(e.reply.from || e.reply.name || "").toLowerCase() ===
          (HaloAccount.current
            ? HaloAccount.current.gamertag.toLowerCase()
            : ""),
      r = "global" === t ? "the global chat" : "the lobby chat";
    o.started
      ? Oo(e, "global" === t ? "global" : "room")
      : h(
          `${n} ${a ? "replied to you" : "mentioned you"} in ${r}: ${e.text}`,
          6e3,
        );
  }
  function So(t, o = "room") {
    const n = document.createElement("div");
    if (
      ((n.className =
        `chat-line ${o}` +
        (t.self ? " self" : "") +
        (t.system ? " system " + t.system : "")),
      t.system)
    )
      return ((n.textContent = t.text), n);
    const a =
        t.role ||
        (t.self && HaloAccount.current ? HaloAccount.current.role : ""),
      r = lo(
        t.self && HaloAccount.current
          ? HaloAccount.current.gamertag
          : t.name || t.from,
        a,
      );
    if (t.reply && ("global" === o || "room" === o || "feed" === o)) {
      const e = document.createElement("span");
      e.className = "chat-reply";
      const o = document.createElement("b");
      ((o.textContent = t.reply.from || t.reply.name || ""),
        e.append("↪ ", o, " " + (t.reply.text || "")),
        n.appendChild(e));
    }
    if (
      (n.append(r),
      (function (e, t) {
        t = String(t || "");
        let o = 0;
        for (const n of t.matchAll(go)) {
          let a = n[0].replace(/[.,!?;:)\]}]+$/, "");
          n.index > o && po(e, t.slice(o, n.index));
          const r = /^https?:\/\//i.test(a) ? a : "https://" + a;
          let s = null;
          try {
            s = new URL(r);
          } catch {
            s = null;
          }
          if (!s || ("https:" !== s.protocol && "http:" !== s.protocol))
            e.append(document.createTextNode(a));
          else {
            const t = document.createElement("a");
            ((t.className = "chat-link"),
              (t.href = s.href),
              (t.target = "_blank"),
              (t.rel = "noopener noreferrer nofollow"),
              (t.textContent = a),
              (t.onclick = (e) => e.stopPropagation()),
              e.append(t));
          }
          o = n.index + a.length;
        }
        o < t.length && po(e, t.slice(o));
      })(n, t.text),
      t.image && "global" === o)
    ) {
      const o = document.createElement("img");
      ((o.className = "chat-image"),
        (o.loading = "lazy"),
        (o.alt = "Picture"),
        (o.src = HaloAccount.chatImageUrl(t.image)),
        (o.onload = () => {
          const e = n.parentElement;
          e &&
            e.scrollHeight - e.scrollTop - e.clientHeight < o.height + 60 &&
            (e.scrollTop = e.scrollHeight);
        }),
        (o.onclick = () => {
          ((e("picture-view-image").src = o.src),
            (e("picture-view").hidden = !1));
        }),
        n.appendChild(o));
    }
    if (
      (!t.self && fo(t) && n.classList.add("mentioned"), t.time && "feed" !== o)
    ) {
      const e = document.createElement("time");
      ((e.textContent = (function (e) {
        return new Date(e || Date.now()).toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        });
      })(t.time)),
        n.appendChild(e));
    }
    return n;
  }
  function Lo(e, t) {
    const o = document.createElement("p");
    ((o.className = "empty"), (o.textContent = t), e.appendChild(o));
  }
  function Ho(e, t) {
    const o = e.scrollHeight - e.scrollTop - e.clientHeight < 40;
    ((e.textContent = ""),
      t(e),
      (!o && e.dataset.filled) || (e.scrollTop = e.scrollHeight),
      (e.dataset.filled = "1"));
  }
  function Eo() {
    const t = HaloNet.status(),
      o = !!t.room;
    ((e("pane-lobbies").hidden = !0),
      (e("pane-room-note").hidden = o),
      (e("pane-lobby-head").hidden = !o));
    for (const t of ["chat-log", "chat-form", "chat-quick"]) e(t).hidden = !o;
    if (!o)
      return (
        (e("chat-log").textContent = ""),
        void (e("chat-replying").hidden = !0)
      );
    const n = wt() ? yt.current : null;
    ((e("chat-room-name").textContent = n ? n.name : "Matchmaking game"),
      vt(e("chat-room"), 1 + (0 | t.players)),
      (e("pane-lobby-invite").hidden = !0),
      (e("pane-lobby-leave").hidden = !0),
      Ho(e("chat-log"), (e) => {
        eo.messages.length || Lo(e, "No messages yet. Say hi!");
        for (const t of eo.messages) {
          const o = So(t);
          if (!t.system) {
            o.onclick = () => Ao("room", t);
            const e = o.querySelector(":scope > b");
            (e &&
              !t.self &&
              (e.onclick = (e) => {
                (e.stopPropagation(), Nn(t.name, "chat"));
              }),
              !t.self &&
                Ln(t.name, t.role) &&
                o.append(
                  ...Hn(t.name, t.text, "r" + t.time + t.name, () => {
                    no() && "room" === oo.tab && Eo();
                  }),
                ));
          }
          e.appendChild(o);
        }
      }));
  }
  function xo(t) {
    ("global" !== t || to || (t = HaloNet.status().room ? "room" : "friends"),
      "dm" !== t || oo.dmWith || (t = "friends"),
      (oo.tab = t));
    const o = "dm" === t ? "friends" : t;
    for (const e of document.querySelectorAll("#chat .tab"))
      e.setAttribute("aria-selected", String(e.dataset.tab === o));
    for (const o of ["friends", "dm", "room", "global"])
      e("pane-" + o).hidden = o !== t;
    ("room" === t
      ? ((eo.unread = 0), Eo(), HaloNet.status().room || Tt())
      : "global" === t
        ? ((oo.global.unread = !1),
          HaloAccount.current && HaloLive.start(),
          wn())
        : "dm" === t
          ? Mn()
          : (Ba(), Ua().then(or)),
      clearTimeout(oo.stopTimer),
      Do());
  }
  const No = { locked: !1, scroll: 0 };
  function To(e) {
    const t = document.documentElement;
    (e && !No.locked
      ? ((No.locked = !0),
        (No.scroll = window.scrollY || 0),
        (document.body.style.top = `-${No.scroll}px`),
        t.classList.add("chat-open"))
      : !e &&
        No.locked &&
        ((No.locked = !1),
        t.classList.remove("chat-open"),
        (document.body.style.top = ""),
        window.scrollTo(0, No.scroll)),
      $o());
  }
  function $o() {
    const e = document.documentElement,
      t = window.visualViewport;
    if (!No.locked || !t)
      return (
        e.style.removeProperty("--chat-top"),
        void e.style.removeProperty("--chat-height")
      );
    const o = t.height < window.innerHeight - 100;
    (o || (!window.scrollY && !t.offsetTop) || window.scrollTo(0, 0),
      e.style.setProperty("--chat-top", `${Math.round(o ? t.offsetTop : 0)}px`),
      e.style.setProperty("--chat-height", `${Math.round(t.height)}px`),
      clearTimeout($o.settle),
      $o.settling ||
        ($o.settle = setTimeout(() => {
          $o.settling = !0;
          try {
            $o();
          } finally {
            $o.settling = !1;
          }
        }, 300)));
  }
  function Io(t) {
    if (
      ((e("chat").hidden = !1),
      To(!0),
      xo(
        t ||
          (function () {
            const e = xa.data;
            return e && e.invites.length + e.incoming.length + Ro()
              ? "friends"
              : eo.unread
                ? "room"
                : oo.tab;
          })(),
      ),
      or(),
      !matchMedia("(pointer: coarse)").matches)
    ) {
      const t = { room: "chat-input", global: "global-input", dm: "dm-input" }[
        oo.tab
      ];
      t && !e(t).closest("[hidden]") && e(t).focus();
    }
  }
  function Mo() {
    ((e("chat").hidden = !0), To(!1));
    for (const t of [
      "chat-input",
      "global-input",
      "dm-input",
      "friends-add-input",
    ])
      e(t).blur();
    or();
  }
  function Ro() {
    return xa.data
      ? xa.data.friends.reduce((e, t) => e + (0 | t.unread), 0)
      : 0;
  }
  function Do() {
    const t = xa.data || { invites: [], incoming: [] },
      o = t.invites.length + t.incoming.length + Ro(),
      n = o + eo.unread,
      a = (t, o) => {
        ((e(t).textContent = ((e) => (e > 9 ? "9+" : String(e)))(o)),
          (e(t).hidden = !o));
      };
    (a("chat-button-unread", n),
      a("menu-chat-badge", n),
      a("account-friends-badge", o),
      a("tab-friends-badge", o),
      a("tab-room-badge", eo.unread),
      (e("chat-unread").hidden = !0),
      (e("tab-global-badge").hidden =
        !oo.global.unread || (no() && "global" === oo.tab)),
      (e("online-chat").textContent = eo.unread
        ? `Chat (${eo.unread})`
        : "Chat"),
      (e("tab-room-label").textContent = "Lobby"));
  }
  function Oo(t, o) {
    const n = e("chat-feed"),
      a = So(t, o);
    for (n.appendChild(a); n.children.length > 4;) n.firstChild.remove();
    (setTimeout(() => a.classList.add("fading"), 6e3),
      setTimeout(() => a.remove(), 6800));
  }
  async function Po(e, t) {
    if (await _o(e, "room")) return !0;
    if (!HaloNet.status().room)
      return (h("Join a lobby to chat with its players."), !1);
    try {
      return await HaloNet.sendChat(e, t);
    } catch (e) {
      return (h(e.message), !1);
    }
  }
  (document.addEventListener("focusout", (e) => {
    No.locked &&
      e.target &&
      /^(INPUT|TEXTAREA)$/.test(e.target.tagName) &&
      setTimeout($o, 120);
  }),
    window.visualViewport &&
      (window.visualViewport.addEventListener("resize", $o),
      window.visualViewport.addEventListener("scroll", $o)),
    window.addEventListener("pageshow", () => setTimeout($o, 50)),
    document.addEventListener("visibilitychange", () => {
      "visible" === document.visibilityState && ($o(), setTimeout($o, 300));
    }));
  const Bo = /^\s*([!/,])\s*([A-Za-z]+)\b/;
  async function _o(e, t) {
    e = String(e || "")
      .replace(/^(\s*)[\uff01\u00a1]/, "$1!")
      .replace(/^(\s*)[\uff0c\u3001\u201a]/, "$1,");
    const n = Bo.exec(e);
    if (!n || !HaloAccount.current) return !1;
    if (/^(robot|morph)$/i.test(n[2]) && "owner" === jo()) {
      const n =
        !/\b(off|stop|no)\b/i.test(e) && (!!/\bon\b/i.test(e) || !o.robot);
      return (
        ut(n),
        Uo(
          t,
          n
            ? "Robot on: you morph in Custom Games (/robot again to turn back)."
            : "Robot off.",
        ),
        !0
      );
    }
    let a;
    try {
      a = await HaloAccount.command(e.trim());
    } catch (e) {
      return (Uo(t, e.message), !0);
    }
    return (
      !(a.unknown && "/" !== n[1] && !jo()) &&
      (Uo(t, a.reply || "Done."),
      a.role && (HaloAccount.setRole(a.role), Qt()),
      !0)
    );
  }
  let Wo = 0;
  function Uo(e, t, o = "reply") {
    const n = { system: o, text: t, id: "system-" + ++Wo, time: Date.now() };
    ("global" === e
      ? (oo.global.messages.push(n), no() && "global" === oo.tab && wn())
      : "dm" === e && oo.dmWith
        ? (Tn(oo.dmWith).messages.push(n), no() && "dm" === oo.tab && Mn())
        : (eo.messages.push(n), no() && "room" === oo.tab && Eo()),
      no() || h(t, 6e3));
  }
  const Fo = {
      tab: "players",
      selected: null,
      rules: 0,
      rulesTimer: null,
      lastFun: 0,
      funTimers: [],
    },
    Go = 63;
  function jo() {
    const e = HaloAccount.current;
    return !e || ("owner" !== e.role && "mod" !== e.role) ? "" : e.role;
  }
  function Yo() {
    return !e("mod").hidden;
  }
  function qo() {
    const t = jo();
    ((e("mod-button").hidden = !t),
      (e("mod-tab-owner").hidden = "owner" !== t),
      !t && Yo() && zo());
  }
  function zo() {
    e("mod").hidden = !0;
    for (const t of e("mod").querySelectorAll("input")) t.blur();
  }
  function Jo(t) {
    ("owner" === t && "owner" !== jo() && (t = "players"), (Fo.tab = t));
    for (const o of e("mod").querySelectorAll(".tab"))
      o.setAttribute("aria-selected", String(o.dataset.modTab === t));
    for (const o of ["players", "server", "fun", "owner"])
      e("mod-pane-" + o).hidden = o !== t;
    ("players" === t && Ko(), "fun" === t && on());
  }
  function Vo(t, o) {
    const n = e("mod-output");
    ((n.hidden = !t),
      (n.textContent = t || ""),
      n.classList.toggle("error", !!o),
      (n.scrollTop = 0));
  }
  async function Qo(e) {
    Vo("…");
    try {
      return (Vo((await HaloAccount.command(e)).reply || "Done."), !0);
    } catch (e) {
      return (Vo(e.message, !0), !1);
    }
  }
  function Zo() {
    const e = HaloNet.status();
    return e.room
      ? (e.names || []).map((t, o) => ({
          name: t,
          role: (e.roles || [])[o] || "",
        }))
      : [];
  }
  function Xo(e) {
    return "owner" === e ? "Owner" : "mod" === e ? "Moderator" : "";
  }
  function Ko() {
    const t = e("mod-here"),
      o = Zo(),
      n = HaloNet.status();
    if (
      ((e("mod-here-title").textContent = n.room
        ? zn()
          ? "In this matchmaking game"
          : yt.current && wt()
            ? `In ${yt.current.name}`
            : "In this game"
        : "In this lobby"),
      (t.textContent = ""),
      !o.length)
    ) {
      const e = document.createElement("div");
      return (
        (e.className = "mod-empty"),
        (e.textContent = n.room
          ? "No one else is here."
          : "Not in a lobby or game. Find a player by gamertag."),
        void t.append(e)
      );
    }
    for (const e of o) {
      const o = document.createElement("button");
      ((o.type = "button"),
        (o.className =
          "mod-row" +
          (Fo.selected &&
          Fo.selected.name.toLowerCase() === e.name.toLowerCase()
            ? " on"
            : "")));
      const n = document.createElement("span");
      n.textContent = e.name;
      const a = document.createElement("span");
      ((a.className = "mod-role " + e.role),
        (a.textContent = Xo(e.role)),
        o.append(n, a),
        (o.onclick = () => en(e.name, e.role)),
        t.append(o));
    }
  }
  function en(t, o) {
    ((Fo.selected = { name: t, role: o || "" }),
      (e("mod-player").hidden = !1),
      (e("mod-player-name").textContent = t),
      (e("mod-player-role").className = "mod-role " + (o || "")),
      (e("mod-player-role").textContent = Xo(o)),
      (e("mod-owner-actions").hidden = "owner" !== jo()),
      e("mod-duration").selectedOptions[0] &&
        e("mod-duration").selectedOptions[0].hidden &&
        (e("mod-duration").value = "1h"),
      Ko(),
      Qo(`/lookup "${t}"`));
  }
  async function tn(t) {
    const o = Fo.selected;
    if (!o) return;
    const n = o.name,
      a = `"${n}"`,
      r = e("mod-reason").value.trim(),
      s = e("mod-duration").value;
    let i = "";
    switch (t) {
      case "warn":
        if (!r)
          return void Vo(
            "Write the warning in the Reason or message field.",
            !0,
          );
        i = `/warn ${a} ${r}`;
        break;
      case "kick":
        i = `/kick ${a} ${r}`;
        break;
      case "mute":
        i = `/mute ${a} ${s} ${r}`;
        break;
      case "unmute":
        i = `/unmute ${a}`;
        break;
      case "ban":
        if (
          !confirm(
            `Ban ${n} (${e("mod-duration").selectedOptions[0].textContent.toLowerCase()})?`,
          )
        )
          return;
        i = `/ban ${a} ${s} ${r}`;
        break;
      case "unban":
        i = `/unban ${a}`;
        break;
      case "flags":
        i = `/flags ${a}`;
        break;
      case "closelobby":
        if (!confirm(`Close ${n}'s lobby? Everyone in it is removed.`)) return;
        i = `/closelobby ${a}`;
        break;
      case "spotlight":
        return void nn({ fx: "spotlight", text: n });
      case "promote":
        i = `/promote ${a}`;
        break;
      case "demote":
        i = `/demote ${a}`;
        break;
      case "resetrank":
        if (!confirm(`Reset all of ${n}'s matchmaking ranks?`)) return;
        i = `/resetrank ${a}`;
        break;
      case "rename": {
        const e = (prompt(`Rename ${n} to:`, "") || "").trim();
        if (!e) return;
        i = `/rename ${a} ${e}`;
        break;
      }
      case "logout":
        i = `/logout ${a}`;
        break;
      case "deleteaccount":
        if (
          "DELETE" !==
          prompt(
            `Delete ${n}'s account and everything of it, for good? Type DELETE to confirm.`,
          )
        )
          return;
        i = `/deleteaccount ${a} confirm`;
    }
    i &&
      (await Qo(i.trim())) &&
      ["warn", "kick", "mute", "ban"].includes(t) &&
      (e("mod-reason").value = "");
  }
  function on() {
    const t = HaloNet.status(),
      o = t.room
        ? zn()
          ? "In this matchmaking game: messages and effects only (its rules are the playlist's)."
          : "Everyone in this lobby sees these."
        : "Join a lobby or game first: these show to everyone in it.";
    e("mod-fun-where").textContent = o;
    const n = !!t.room && !zn();
    for (const t of e("mod-rules").querySelectorAll("input"))
      ((t.disabled = !n),
        (t.checked = 0 !== (Fo.rules & Number(t.dataset.modRule))));
    e("mod-rules-apply").disabled = e("mod-rules-clear").disabled = !n;
  }
  async function nn(e) {
    HaloNet.status().room
      ? (ln(e, HaloAccount.current.gamertag, jo()),
        await HaloNet.sendRoom("staff-fun", e).catch(() => {}))
      : Vo("Join a lobby or game first.", !0);
  }
  function an(e, t) {
    Fo.funTimers.push(setTimeout(e, t));
  }
  function rn(t, o, n = 5) {
    const a = e("fun-banner");
    (a.classList.remove("leaving"),
      (a.querySelector(".fun-text").textContent = String(t || "").slice(0, 60)),
      (a.querySelector(".fun-from").textContent = o || ""),
      (a.hidden = !0),
      a.offsetWidth,
      (a.hidden = !1),
      clearTimeout(rn.timer),
      clearTimeout(rn.hideTimer),
      (rn.timer = setTimeout(() => {
        (a.classList.add("leaving"),
          (rn.hideTimer = setTimeout(() => {
            ((a.hidden = !0), a.classList.remove("leaving"));
          }, 650)));
      }, 1e3 * n)));
  }
  function sn(t, o) {
    const n = e("fun-count");
    !(function () {
      for (const e of Fo.funTimers) clearTimeout(e);
      Fo.funTimers = [];
    })();
    for (let e = t; e >= 0; e--)
      an(
        () => {
          if (0 === e) return ((n.hidden = !0), void rn("GO!", o, 2));
          ((n.textContent = String(e)),
            (n.hidden = !1),
            n.classList.remove("tick"),
            n.offsetWidth,
            n.classList.add("tick"));
        },
        1e3 * (t - e),
      );
  }
  function cn(t) {
    const o = e("fun-canvas"),
      n = Math.min(2, window.devicePixelRatio || 1);
    ((o.width = Math.round(innerWidth * n)),
      (o.height = Math.round(innerHeight * n)),
      (o.hidden = !1));
    const a = o.getContext("2d"),
      r = [
        "#7fd1ff",
        "#ffd36e",
        "#ff6b6b",
        "#8fe3a0",
        "#d9a8ff",
        "#ffffff",
        "#ff9f43",
      ],
      s = [],
      i = performance.now(),
      c = "fireworks" === t ? 5200 : 4200;
    if ("fireworks" !== t)
      for (let e = 0; e < 160; e++)
        s.push({
          x: Math.random() * o.width,
          y: -Math.random() * o.height * 0.6,
          vx: 2 * (Math.random() - 0.5) * n,
          vy: (2 + 3 * Math.random()) * n,
          spin: 6 * Math.random(),
          turn: 0.3 * (Math.random() - 0.5),
          color: r[(Math.random() * r.length) | 0],
          size: (5 + 5 * Math.random()) * n,
          life: 1,
        });
    let l = 0;
    const d = (e) => {
      const u = e - i;
      (a.clearRect(0, 0, o.width, o.height),
        "fireworks" === t &&
          u < c - 1500 &&
          u >= l &&
          (((e, t) => {
            const o = r[(Math.random() * r.length) | 0];
            for (let a = 0; a < 90; a++) {
              const a = Math.random() * Math.PI * 2,
                r = (1.5 + 4 * Math.random()) * n;
              s.push({
                x: e,
                y: t,
                vx: Math.cos(a) * r,
                vy: Math.sin(a) * r,
                life: 1,
                color: o,
                size: (2.5 + 1.5 * Math.random()) * n,
                spark: !0,
              });
            }
          })(
            o.width * (0.15 + 0.7 * Math.random()),
            o.height * (0.12 + 0.35 * Math.random()),
          ),
          (l = u + 350 + 400 * Math.random())));
      for (const e of s)
        if (((e.x += e.vx), (e.y += e.vy), e.spark)) {
          if (
            ((e.vy += 0.05 * n),
            (e.vx *= 0.985),
            (e.vy *= 0.985),
            (e.life -= 0.009),
            e.life <= 0)
          )
            continue;
          ((a.globalCompositeOperation = "lighter"),
            (a.globalAlpha = Math.min(1, 1.3 * e.life)),
            (a.strokeStyle = e.color),
            (a.lineWidth = 0.6 * e.size),
            a.beginPath(),
            a.moveTo(e.x - 3 * e.vx, e.y - 3 * e.vy),
            a.lineTo(e.x, e.y),
            a.stroke(),
            (a.fillStyle = e.color),
            a.beginPath(),
            a.arc(e.x, e.y, e.size, 0, 2 * Math.PI),
            a.fill(),
            (a.globalCompositeOperation = "source-over"));
        } else
          ((e.spin += e.turn),
            (e.vy += 0.02 * n),
            (a.globalAlpha = u > c - 800 ? Math.max(0, (c - u) / 800) : 1),
            a.save(),
            a.translate(e.x, e.y),
            a.rotate(e.spin),
            (a.fillStyle = e.color),
            a.fillRect(-e.size / 2, -e.size / 4, e.size, e.size / 2),
            a.restore());
      ((a.globalAlpha = 1),
        u < c
          ? requestAnimationFrame(d)
          : (a.clearRect(0, 0, o.width, o.height), (o.hidden = !0)));
    };
    requestAnimationFrame(d);
  }
  function ln(e, t, o) {
    const n = Date.now();
    if (n - Fo.lastFun < 700) return;
    Fo.lastFun = n;
    const a = `${Xo(o)} ${t}`.trim();
    switch (e.fx) {
      case "banner":
        rn(e.text, a, 6);
        break;
      case "countdown":
        sn(Math.max(3, Math.min(60, 0 | e.seconds)), a);
        break;
      case "confetti":
        cn("confetti");
        break;
      case "fireworks":
        cn("fireworks");
        break;
      case "gg":
        (rn("GG", a, 4), cn("confetti"));
        break;
      case "spotlight":
        (rn(
          `★ ${String(e.text || "").slice(0, 16)} ★`,
          `Spotlight from ${a}`,
          6,
        ),
          cn("fireworks"));
    }
  }
  function dn(e, t, n) {
    const a = (0 | e.rules) & Go,
      r =
        o.staffRulesRoom !== HaloNet.status().room || (0 | o.staffRules) !== a;
    ((o.staffRules = a),
      (o.staffRulesRoom = HaloNet.status().room),
      r && !zn() && (o.staffRulesAt = Date.now()),
      ct(),
      r &&
        !zn() &&
        h(
          a
            ? `${Xo(n)} ${t} turned on event rules for this lobby.`
            : `${Xo(n)} ${t} turned the event rules off.`,
          5e3,
        ));
  }
  async function un(e) {
    const t = HaloNet.status().room;
    t &&
      !zn() &&
      ((Fo.rules = e),
      clearInterval(Fo.rulesTimer),
      dn({ rules: e }, HaloAccount.current.gamertag, jo()),
      await HaloNet.sendRoom("staff-rules", { rules: e }).catch(() => {}),
      e &&
        (Fo.rulesTimer = setInterval(() => {
          if (HaloNet.status().room !== t || !jo())
            return (clearInterval(Fo.rulesTimer), void (Fo.rules = 0));
          HaloNet.sendRoom("staff-rules", { rules: e }).catch(() => {});
        }, 8e3)),
      on(),
      Vo(e ? "Event rules on for this lobby." : "Event rules off."));
  }
  function mn(t) {
    const o = e("event-banner");
    (clearTimeout(mn.timer),
      t && t.until > Date.now()
        ? ((o.textContent = String(t.text || "").slice(0, 120)),
          (o.hidden = !1),
          (mn.timer = setTimeout(
            () => {
              o.hidden = !0;
            },
            Math.min(t.until - Date.now(), 2147483647),
          )))
        : (o.hidden = !0));
  }
  function hn() {
    ((e("mod-button").onclick = () => {
      var t;
      Yo() ? zo() : jo() && ((e("mod").hidden = !1), Jo(t || Fo.tab));
    }),
      (e("mod-close").onclick = zo),
      e("mod").addEventListener("keydown", (e) => {
        "Escape" === e.key && zo();
      }));
    for (const t of e("mod").querySelectorAll(".tab"))
      t.onclick = () => Jo(t.dataset.modTab);
    ((e("mod-find").onsubmit = (t) => {
      t.preventDefault();
      const o = e("mod-find-input").value.trim();
      if (!/^[A-Za-z0-9 ]{1,15}$/.test(o))
        return void Vo("Type a gamertag.", !0);
      const n = Zo().find((e) => e.name.toLowerCase() === o.toLowerCase());
      (en(n ? n.name : o, n ? n.role : ""), (e("mod-find-input").value = ""));
    }),
      (e("mod-player-lookup").onclick = () => {
        Fo.selected && Qo(`/lookup "${Fo.selected.name}"`);
      }));
    for (const t of e("mod").querySelectorAll("[data-mod-act]"))
      t.onclick = () => tn(t.dataset.modAct);
    for (const t of e("mod").querySelectorAll("[data-mod-cmd]"))
      t.onclick = () => Qo(t.dataset.modCmd);
    for (const t of e("mod").querySelectorAll("[data-mod-form]"))
      t.onsubmit = async (e) => {
        e.preventDefault();
        const o = t.querySelector("input"),
          n = o.value.trim();
        n || /celebrate/.test(t.dataset.modForm)
          ? (t.dataset.confirm && !confirm(t.dataset.confirm)) ||
            ((await Qo(`${t.dataset.modForm} ${n}`.trim())) && (o.value = ""))
          : Vo("Type something first.", !0);
      };
    ((e("mod-robot").onclick = () => {
      (ut(!o.robot),
        Vo(o.robot ? "Robot on: you morph in Custom Games." : "Robot off."));
    }),
      (e("mod-owner-banner").onsubmit = async (t) => {
        t.preventDefault();
        const o = e("mod-owner-banner").querySelector("input"),
          n = e("mod-owner-banner").querySelector("select").value;
        o.value.trim()
          ? (await Qo(`/banner ${n} ${o.value.trim()}`)) && (o.value = "")
          : Vo("Type the banner first.", !0);
      }),
      (e("mod-fun-banner").onsubmit = (t) => {
        t.preventDefault();
        const o = e("mod-fun-banner").querySelector("input");
        o.value.trim() &&
          (nn({ fx: "banner", text: o.value.trim().slice(0, 60) }),
          (o.value = ""));
      }));
    for (const t of e("mod").querySelectorAll("[data-mod-fun]"))
      t.onclick = () =>
        nn({ fx: t.dataset.modFun, seconds: Number(t.dataset.seconds) || 0 });
    ((e("mod-rules-apply").onclick = () => {
      let t = 0;
      for (const o of e("mod-rules").querySelectorAll("input"))
        o.checked && (t |= Number(o.dataset.modRule));
      un(t);
    }),
      (e("mod-rules-clear").onclick = () => un(0)),
      qo(),
      setInterval(() => {
        (qo(),
          Yo() && "players" === Fo.tab && Ko(),
          o.staffRules &&
            o.staffRulesRoom !== HaloNet.status().room &&
            ((o.staffRules = 0), ct()));
      }, 3e3));
  }
  const gn = {
    en: {
      title: "Need help getting started?",
      text: "Hello! It looks like you're asking how to play or how to get the game set up. To keep the global chat clear for everyone, we've put everything you need into our setup guide, including how to add your own copy of the game.",
      note: "Still stuck after reading it? Our community and staff are happy to help on the official Discord.",
      guide: "Open the setup guide",
      discord: "Join our Discord",
      close: "Close",
    },
    es: {
      title: "¿Necesitas ayuda para empezar?",
      text: "¡Hola! Parece que estás preguntando cómo jugar o cómo configurar el juego. Para mantener el chat global ordenado para todos, reunimos todo lo que necesitas en nuestra guía de configuración, incluido cómo agregar tu propia copia del juego.",
      note: "¿Sigues con dudas después de leerla? Nuestra comunidad y el staff te ayudarán con gusto en el Discord oficial.",
      guide: "Abrir la guía",
      discord: "Unirse al Discord",
      close: "Cerrar",
    },
  };
  function pn(e) {
    const t = o.watch;
    (t.buffer.push(`${new Date().toISOString().slice(11, 23)} ${e}`),
      t.buffer.length > 1e3 && t.buffer.splice(0, t.buffer.length - 1e3));
  }
  function fn() {
    const e = o.watch;
    if (!e || !e.on) return;
    if (Date.now() > e.until) return void yn(!1);
    try {
      for (const t of navigator.getGamepads ? navigator.getGamepads() : []) {
        if (!t) continue;
        const o = e.pads[t.index] || [],
          n = t.buttons.map((e) => !(!e || !e.pressed));
        (n.forEach((e, n) => {
          e !== !!o[n] &&
            pn(
              `press: controller ${t.index + 1} button ${n} ${e ? "down" : "up"}`,
            );
        }),
          (e.pads[t.index] = n));
      }
    } catch {}
    if (!e.buffer.length && Date.now() - e.sentAt < 5e3) return;
    const t = e.buffer.splice(0);
    let n = [],
      a = 0;
    for (const e of t) {
      const t = e.slice(0, 2e3);
      (n.length &&
        (a + t.length > 12e3 || n.length >= 300) &&
        (HaloLive.watchLog(n), (n = []), (a = 0)),
        n.push(t),
        (a += t.length + 8));
    }
    (HaloLive.watchLog(n), (e.sentAt = Date.now()));
  }
  function An(e) {
    const t = o.watch;
    if (!t || !t.on) return;
    if ("keydown" === e.type || "keyup" === e.type) {
      if (e.repeat) return;
      const t = e.target instanceof Element ? e.target : null;
      if (t && (t.matches("input, textarea, select") || t.isContentEditable))
        return;
      return void pn(
        `press: key ${e.code || e.key} ${"keydown" === e.type ? "down" : "up"}`,
      );
    }
    if ("mousedown" === e.type || "mouseup" === e.type)
      return void pn(
        `press: mouse button ${e.button} ${"mousedown" === e.type ? "down" : "up"}`,
      );
    if ("mouse" === e.pointerType) return;
    const n = e.target instanceof Element ? e.target : null,
      a = n && n.closest("[aria-label]");
    pn(
      `press: touch ${a ? a.getAttribute("aria-label") : n ? (n.id ? "#" + n.id : String(n.className || n.tagName).split(" ")[0]) : "?"} ${"pointerdown" === e.type ? "down" : "up"}`,
    );
  }
  function yn(e, t) {
    const n =
      o.watch ||
      (o.watch = {
        on: !1,
        by: "",
        buffer: [],
        pads: [],
        sentAt: 0,
        timer: null,
        until: 0,
      });
    if (e && n.on && n.by === t) return;
    const a = [
      "keydown",
      "keyup",
      "mousedown",
      "mouseup",
      "pointerdown",
      "pointerup",
    ];
    if (e) {
      if (!n.on) for (const e of a) window.addEventListener(e, An, !0);
      ((n.on = !0),
        (n.by = t || "staff"),
        (n.until = Date.now() + 36e5),
        (n.buffer = []),
        (n.pads = []),
        pn(
          `watch: ${n.by} is watching · build ${o.version || "?"} · ${E()} · ${o.started ? "playing" : "start page"}` +
            (o.gameStatus ? ` · ${JSON.stringify(o.gameStatus)}` : ""),
        ),
        pn("watch: settings " + JSON.stringify(N())),
        pn("watch: device " + JSON.stringify(x())),
        pn("watch: the log so far ↓"));
      for (const e of o.log.slice(-250)) pn(e);
      (pn("watch: live from here ↓"),
        clearInterval(n.timer),
        (n.timer = setInterval(fn, 1e3)),
        fn(),
        c(`watch: ${n.by} (staff) is watching this game's log and presses`));
    } else {
      if (!n.on) return;
      for (const e of a) window.removeEventListener(e, An, !0);
      ((n.on = !1),
        clearInterval(n.timer),
        (n.timer = null),
        (n.buffer = []),
        c("watch: no longer watched"));
    }
  }
  function wn() {
    const t = HaloAccount.current,
      o = e("global-status");
    if (((o.textContent = ""), t))
      if (HaloLive.connected) {
        const e = document.createElement("b");
        ((e.className = "count"),
          (e.textContent = `${oo.global.online} online`),
          o.append(e, " · Halo CE: Mobile Global Chat. Be Nice."));
      } else o.textContent = "Connecting…";
    else o.textContent = "Halo CE Mobile global chat. Please be respectful.";
    ((e("global-form").hidden = !t),
      (e("global-picture").hidden = !jo()),
      (e("global-signed-out").hidden = !!t));
    const n = ao(),
      a = t ? t.gamertag.toLowerCase() : "";
    Ho(e("global-log"), (e) => {
      if (!t) return Lo(e, "The global chat is for players with an account.");
      oo.global.motd &&
        e.appendChild(So({ system: "motd", text: oo.global.motd }, "global"));
      const o = oo.global.messages.filter(
        (e) => e.system || !n.has(e.from.toLowerCase()),
      );
      o.length ||
        Lo(
          e,
          HaloLive.connected
            ? "No messages yet. Say hi to everyone!"
            : "Connecting to the global chat…",
        );
      for (const t of o) {
        if (t.system) {
          e.appendChild(So(t, "global"));
          continue;
        }
        const o = So({ ...t, self: t.from.toLowerCase() === a }, "global");
        ((o.querySelector(":scope > b").onclick = (e) => {
          (e.stopPropagation(), Nn(t.from));
        }),
          (o.onclick = () => Ao("global", t)),
          t.id && bn(t) && o.appendChild(kn(t)),
          Ln(t.from, t.role) &&
            o.append(
              ...Hn(t.from, t.text, "g" + (t.id || t.time), () => {
                no() && "global" === oo.tab && wn();
              }),
            ),
          e.appendChild(o));
      }
    });
  }
  function bn(e) {
    const t = HaloAccount.current,
      o = jo();
    return (
      !(!t || !o) &&
      (e.from.toLowerCase() === t.gamertag.toLowerCase() ||
        "owner" === o ||
        !e.role)
    );
  }
  const vn = { id: 0, timer: null };
  function kn(e) {
    const t = document.createElement("button");
    ((t.type = "button"),
      (t.className = "chat-delete"),
      (t.title = "Delete this message"),
      t.setAttribute("aria-label", "Delete this message"));
    const o = vn.id === e.id;
    return (
      (t.textContent = o ? "Delete" : "✕"),
      t.classList.toggle("armed", o),
      (t.onclick = async (o) => {
        if ((o.stopPropagation(), clearTimeout(vn.timer), vn.id !== e.id))
          return (
            (vn.id = e.id),
            (vn.timer = setTimeout(() => {
              ((vn.id = 0), no() && "global" === oo.tab && wn());
            }, 3e3)),
            void wn()
          );
        ((vn.id = 0), (t.disabled = !0));
        try {
          (await HaloAccount.deleteMessage(e.id),
            (oo.global.messages = oo.global.messages.filter(
              (t) => t.id !== e.id,
            )),
            wn());
        } catch (e) {
          ((t.disabled = !1),
            h(e.message || "The message could not be deleted.", 4e3));
        }
      }),
      t
    );
  }
  const Cn = { key: "", timer: null },
    Sn = [
      ["mute", "Mute", "1h"],
      ["ban", "Ban", "1d"],
    ];
  function Ln(e, t) {
    const o = HaloAccount.current,
      n = jo();
    return (
      !!(o && n && e) &&
      e.toLowerCase() !== o.gamertag.toLowerCase() &&
      ("owner" === n ? "owner" !== t : !t)
    );
  }
  function Hn(e, t, o, n) {
    const a = [];
    for (const [r, s, i] of Sn) {
      const c = document.createElement("button");
      ((c.type = "button"), (c.className = "chat-delete chat-mod " + r));
      const l = Cn.key === r + ":" + o,
        d = `${s} ${e} (${"mute" === r ? "1 hour" : "1 day"})`;
      ((c.title = d),
        c.setAttribute("aria-label", d),
        (c.textContent = l ? `${s} ${i}?` : s),
        c.classList.toggle("armed", l),
        (c.onclick = async (a) => {
          if (
            (a.stopPropagation(),
            clearTimeout(Cn.timer),
            Cn.key !== r + ":" + o)
          )
            return (
              (Cn.key = r + ":" + o),
              (Cn.timer = setTimeout(() => {
                ((Cn.key = ""), n());
              }, 3e3)),
              void n()
            );
          ((Cn.key = ""), (c.disabled = !0));
          const s = String(t || "")
              .replace(/\s+/g, " ")
              .trim(),
            l = s
              ? `in chat: "${s.length > 60 ? s.slice(0, 59) + "…" : s}"`
              : "in chat";
          try {
            h(
              (await HaloAccount.command(`/${r} "${e}" ${i} ${l}`)).reply ||
                "Done.",
              4e3,
            );
          } catch (t) {
            h(
              t.message ||
                `${e} could not be ${"mute" === r ? "muted" : "banned"}.`,
              5e3,
            );
          }
          n();
        }),
        a.push(c));
    }
    return a;
  }
  function En(t) {
    (document.pointerLockElement && document.exitPointerLock(),
      (e("history-frame").src = t),
      (e("history-view").hidden = !1));
  }
  function xn() {
    const e = new URLSearchParams(location.search).get("api");
    return e ? "&api=" + encodeURIComponent(e) : "";
  }
  function Nn(t, o = "global") {
    const n = HaloAccount.current;
    if (!t || (n && t.toLowerCase() === n.gamertag.toLowerCase())) return;
    const a = e(`${o}-name-actions`);
    if (!a.hidden && oo.picked === t && oo.pickedWhere === o)
      return void (a.hidden = !0);
    ((oo.picked = t), (oo.pickedWhere = o), (e(`${o}-name`).textContent = t));
    const r =
      xa.data &&
      xa.data.friends.some((e) => e.gamertag.toLowerCase() === t.toLowerCase());
    ((e(`${o}-name-friend`).hidden = !n || r),
      (e(`${o}-name-games`).href =
        "games/?player=" + encodeURIComponent(t) + xn()),
      (a.hidden = !1));
  }
  function Tn(e) {
    const t = e.toLowerCase();
    return (
      oo.dms.has(t) || oo.dms.set(t, { messages: [], loaded: !1 }),
      oo.dms.get(t)
    );
  }
  function $n(e) {
    return (
      xa.data &&
      xa.data.friends.find(
        (t) => t.gamertag.toLowerCase() === String(e).toLowerCase(),
      )
    );
  }
  async function In(t) {
    ((oo.dmWith = t), (e("chat").hidden = !1), To(!0), xo("dm"));
    const o = $n(t);
    o && o.unread && ((o.unread = 0), Do());
    const n = Tn(t);
    try {
      const e = await HaloAccount.messages(t),
        o = new Set(n.messages.map((e) => e.id));
      ((n.messages = [
        ...e.messages.filter((e) => !o.has(e.id)),
        ...n.messages,
      ].sort((e, t) => e.id - t.id)),
        (n.loaded = !0));
    } catch (e) {
      ka("friends-error", e.message);
    }
    ("dm" === oo.tab && oo.dmWith === t && Mn(),
      matchMedia("(pointer: coarse)").matches || e("dm-input").focus());
  }
  function Mn() {
    const t = oo.dmWith;
    if (!t) return;
    const o = $n(t) || { gamertag: t, online: !1 };
    ((e("dm-name").textContent = o.gamertag),
      (e("dm-doing").textContent = $a(o)),
      (e("dm-dot").className = "dot" + (o.online ? " online" : "")));
    const n = e("dm-actions");
    ((n.textContent = ""), n.append(...Pa(o, !0)));
    const a = HaloAccount.current
        ? HaloAccount.current.gamertag.toLowerCase()
        : "",
      r = Tn(t);
    Ho(e("dm-log"), (e) => {
      r.messages.length ||
        Lo(
          e,
          r.loaded
            ? `Your messages with ${o.gamertag} show here. Only the two of you see them.`
            : "Loading…",
        );
      let t = "";
      for (const o of r.messages) {
        const n = new Date(o.time).toDateString();
        if (n !== t) {
          t = n;
          const a = document.createElement("div");
          ((a.className = "day"),
            (a.textContent =
              n === new Date().toDateString()
                ? "Today"
                : new Date(o.time).toLocaleDateString()),
            e.appendChild(a));
        }
        const r = o.from.toLowerCase() === a,
          s = So(o, "dm");
        (s.classList.add(r ? "mine-bubble" : "their-bubble"), e.appendChild(s));
      }
    });
  }
  function Rn() {
    (HaloNet.on((e, t) => {
      var n;
      "chat" === e &&
        (((n = t).time = n.time || Date.now()),
        eo.messages.push(n),
        eo.messages.length > 100 && eo.messages.shift(),
        no() && "room" === oo.tab
          ? Eo()
          : n.self ||
            (eo.unread++,
            Do(),
            fo(n)
              ? Co(n, "room")
              : o.started
                ? Oo(n, "room")
                : h(`${n.name}: ${n.text}`, 4e3)));
    }),
      HaloLive.on((e, t) => {
        "hello" === e
          ? ((oo.global.messages = t.global),
            (oo.global.online = t.online),
            (oo.global.motd = t.motd ? `Message of the day: ${t.motd}` : ""),
            no() && "global" === oo.tab && wn())
          : "global" === e
            ? (function ({ message: e, online: t }) {
                ((oo.global.online = t || oo.global.online),
                  (e.id && oo.global.messages.some((t) => t.id === e.id)) ||
                    (oo.global.messages.push(e),
                    oo.global.messages.length > 200 &&
                      oo.global.messages.shift(),
                    no() && "global" === oo.tab
                      ? wn()
                      : ao().has(e.from.toLowerCase()) ||
                        ((oo.global.unread = !0),
                        Do(),
                        fo(e) && Co(e, "global"))));
              })(t)
            : "dm" === e
              ? (function ({ message: e }) {
                  const t = HaloAccount.current;
                  if (!t) return;
                  const n = e.from.toLowerCase() === t.gamertag.toLowerCase(),
                    a = n ? e.to : e.from,
                    r = Tn(a);
                  if (r.messages.some((t) => t.id === e.id)) return;
                  if (
                    (r.messages.push(e),
                    r.messages.length > 300 && r.messages.shift(),
                    no() &&
                      "dm" === oo.tab &&
                      oo.dmWith &&
                      oo.dmWith.toLowerCase() === a.toLowerCase())
                  )
                    return (
                      Mn(),
                      void (n || HaloAccount.markRead(a).catch(() => {}))
                    );
                  if (n) return;
                  const s = $n(a);
                  (s ? (s.unread = 1 + (0 | s.unread)) : Ua(),
                    Do(),
                    no() && "friends" === oo.tab && Ba(),
                    o.started
                      ? Oo({ name: `${e.from} (private)`, text: e.text }, "dm")
                      : h(`${e.from} (private): ${e.text}`, 5e3));
                })(t)
              : "moderation" === e
                ? (function (e) {
                    const t = HaloAccount.current;
                    switch (e.type) {
                      case "watch":
                        yn(!!e.on, e.by);
                        break;
                      case "announce": {
                        const t = e.from
                          ? ` (${co[e.role] || ""} ${e.from})`.replace(
                              "( ",
                              "(",
                            )
                          : "";
                        (Uo(
                          "global",
                          `Announcement${t}: ${e.text}`,
                          "announce",
                        ),
                          HaloNet.status().room &&
                            Uo(
                              "room",
                              `Announcement${t}: ${e.text}`,
                              "announce",
                            ),
                          h(`Announcement: ${e.text}`, 1e4, "", !0));
                        break;
                      }
                      case "deleted": {
                        const t = new Set(Array.isArray(e.ids) ? e.ids : []);
                        oo.global.messages = oo.global.messages.filter(
                          (e) => e.system || !t.has(e.id),
                        );
                        for (const e of oo.global.messages)
                          e.reply && t.has(e.reply.id) && (e.reply = null);
                        (uo.global &&
                          t.has(uo.global.id) &&
                          ((uo.global = null), yo("global")),
                          no() && "global" === oo.tab && wn());
                        break;
                      }
                      case "clear":
                        ((oo.global.messages = e.gamertag
                          ? oo.global.messages.filter(
                              (t) =>
                                t.system ||
                                t.from.toLowerCase() !==
                                  e.gamertag.toLowerCase(),
                            )
                          : []),
                          no() && "global" === oo.tab && wn());
                        break;
                      case "notice":
                        (Uo("global", e.text, "notice"),
                          e.staff && h(e.text, 8e3));
                        break;
                      case "banner":
                        mn(e.banner);
                        break;
                      case "celebrate":
                        (cn("confetti"),
                          e.text &&
                            rn(e.text, e.from ? `Owner ${e.from}` : "", 6));
                        break;
                      case "role":
                        (HaloAccount.setRole(e.role || ""),
                          h(
                            "owner" === e.role
                              ? "You are the Owner."
                              : "mod" === e.role
                                ? "You are a Moderator now: the shield button at the top right opens the moderator panel."
                                : "You are a Player again.",
                            6e3,
                          ),
                          qo(),
                          Qt());
                        break;
                      case "kick":
                        (h(
                          e.text || "You were removed from the lobby.",
                          8e3,
                          "",
                          !0,
                        ),
                          St() && oa(),
                          (wt() || HaloNet.status().room) && xt());
                        break;
                      case "mute":
                      case "unmute":
                        (t && (t.muted = "mute" === e.type ? e.until : 0),
                          Uo(
                            HaloNet.status().room ? "room" : "global",
                            e.text,
                            "notice",
                          ),
                          Qt());
                        break;
                      case "warn":
                        (Uo(
                          HaloNet.status().room ? "room" : "global",
                          e.text,
                          "warn",
                        ),
                          h(e.text, 1e4, "", !0));
                        break;
                      case "renamed":
                        (h(e.text, 8e3),
                          HaloAccount.me()
                            .then(() => Qt())
                            .catch(() => {}));
                        break;
                      case "ban":
                      case "logout":
                        (h(e.text || "You were signed out.", 12e3, "", !0),
                          (wt() || HaloNet.status().room) && xt(),
                          HaloAccount.signOut());
                    }
                  })(t)
                : "authed" === e && HaloAccount.current
                  ? (HaloAccount.current.role || "") !== t.role &&
                    (HaloAccount.setRole(t.role), Qt())
                  : "state" === e && no() && "global" === oo.tab
                    ? wn()
                    : "lobby" === e
                      ? (function (e) {
                          const t = yt.current;
                          if (!e.lobby || !t || e.lobby.id !== t.id) return;
                          const o = t.owner;
                          if (
                            ((yt.current = {
                              ...t,
                              ...e.lobby,
                              settings: e.lobby.settings || t.settings,
                            }),
                            o.toLowerCase() !== yt.current.owner.toLowerCase())
                          ) {
                            ((jt.lobby === t.id && jt.elected
                              ? jt.elected
                              : o
                            ).toLowerCase() === o.toLowerCase() && Rt.command++,
                              Bn(bt() ? "host" : "guest", yt.current.owner));
                            const n = HaloAccount.current
                              ? HaloAccount.current.gamertag.toLowerCase()
                              : "";
                            h(
                              e.host
                                ? `${o} left. You are the host of ${yt.current.name} now.`
                                : o.toLowerCase() === n
                                  ? `You were away, so ${yt.current.owner} is the host of the lobby now.`
                                  : `${o} left. ${yt.current.owner} is the host now.`,
                              6e3,
                            );
                          }
                          (kt(HaloNet.status()), nr());
                        })(t)
                      : "style" === e
                        ? _t(t.style)
                        : "social" === e &&
                          (t.text && h(t.text, 6e3), Ua(!1), Ka());
      }),
      (function () {
        const t = () => {
          e("help-popup").hidden = !0;
        };
        ((e("help-popup-close").onclick = t),
          e("help-popup").addEventListener("click", (o) => {
            o.target === e("help-popup") && t();
          }),
          e("help-popup").addEventListener("keydown", (e) => {
            "Escape" === e.key && t();
          }));
        for (const o of ["help-popup-guide", "help-popup-discord"])
          e(o).addEventListener("click", () => setTimeout(t, 300));
      })(),
      (e("chat-close").onclick = Mo),
      e("chat").addEventListener("keydown", (e) => {
        "Escape" === e.key && Mo();
      }));
    for (const e of document.querySelectorAll(".social .tab"))
      e.onclick = () => {
        ("friends" === e.dataset.tab && (oo.dmWith = null), xo(e.dataset.tab));
      };
    ((e("online-chat").onclick = () => Io("room")),
      (e("online-global").onclick = () => Io("global")),
      to ||
        ((e("tab-global").hidden = !0),
        (e("online-global").hidden = !0),
        "global" === oo.tab && (oo.tab = "friends")),
      (e("menu-chat").onclick = () => {
        (xe(), Io());
      }),
      (e("chat-button").onclick = () => {
        no() ? Mo() : Io();
      }),
      (e("dm-back").onclick = () => {
        ((oo.dmWith = null), xo("friends"));
      }),
      (e("chat-button").hidden = !1),
      Do(),
      hn(),
      setInterval(() => {
        no() && "room" === oo.tab && Eo();
      }, 3e3),
      (e("chat-form").onsubmit = async (t) => {
        t.preventDefault();
        const o = e("chat-input");
        (await Po(o.value, uo.room)) &&
          ((o.value = ""), wo("room"), ko("chat-input"));
      }));
    for (const [t, o] of [
      ["chat-input", "room"],
      ["global-input", "global"],
    ])
      (e(t).addEventListener("input", () => vo(t)),
        e(t).addEventListener("blur", () => setTimeout(() => ko(t), 150)),
        (e(
          "global" === o ? "global-replying-close" : "chat-replying-close",
        ).onclick = () => wo(o)));
    e("global-name-mention").onclick = () => {
      ((e("global-name-actions").hidden = !0), bo("global-input", oo.picked));
    };
    const t = e("chat-quick");
    for (const e of Xt) {
      const o = document.createElement("button");
      ((o.type = "button"),
        (o.className = "button"),
        (o.textContent = e),
        (o.onclick = () => Po(e)),
        t.appendChild(o));
    }
    const n = async (t, o, n) => {
      t.preventDefault();
      const a = e(o).value.trim();
      if (!a) return;
      const r = t.target;
      r.querySelector("button").disabled = !0;
      try {
        (await n(a), (e(o).value = ""));
      } catch (e) {
        h(e.message);
      } finally {
        r.querySelector("button").disabled = !1;
      }
    };
    ((e("global-form").onsubmit = (t) =>
      n(t, "global-input", async (t) => {
        if (!(await _o(t, "global")))
          try {
            await HaloLive.sendGlobal(t, uo.global);
          } catch (t) {
            if (t && "faq" === t.code)
              !(function (t) {
                const o = gn["es" === t ? "es" : "en"];
                ((e("help-popup-title").textContent = o.title),
                  (e("help-popup-text").textContent = o.text),
                  (e("help-popup-note").textContent = o.note),
                  (e("help-popup-guide").textContent = o.guide),
                  (e("help-popup-discord").textContent = o.discord),
                  (e("help-popup-close").textContent = o.close),
                  (e("help-popup").hidden = !1),
                  c("chat: help popup shown (" + (t || "en") + ")"),
                  setTimeout(() => e("help-popup-discord").focus(), 0));
              })(t.lang);
            else {
              if (!t || "link" !== t.code) throw t;
              Uo("global", t.message, "notice");
            }
          }
        (wo("global"), ko("global-input"));
      })),
      (e("picture-view").onclick = () => {
        ((e("picture-view").hidden = !0),
          e("picture-view-image").removeAttribute("src"));
      }),
      (e("global-picture-file").onchange = async (t) => {
        const o = t.target.files && t.target.files[0];
        if (((t.target.value = ""), !o || !jo())) return;
        const n = e("global-picture");
        n.classList.add("busy");
        try {
          const t = await createImageBitmap(o),
            n = Math.min(1, 1280 / Math.max(t.width, t.height)),
            a = Math.max(1, Math.round(t.width * n)),
            r = Math.max(1, Math.round(t.height * n)),
            s = new OffscreenCanvas(a, r),
            i = s.getContext("2d");
          ((i.fillStyle = "#000"),
            i.fillRect(0, 0, a, r),
            i.drawImage(t, 0, 0, a, r),
            t.close());
          let c = null;
          for (const e of [0.85, 0.7, 0.55, 0.4])
            if (
              ((c = await s.convertToBlob({ type: "image/jpeg", quality: e })),
              c.size <= 665600)
            )
              break;
          if (!c || c.size > 665600)
            throw new Error("That picture is too large.");
          const l = new Uint8Array(await c.arrayBuffer());
          let d = "";
          for (let e = 0; e < l.length; e += 32768)
            d += String.fromCharCode(...l.subarray(e, e + 32768));
          const { id: u } = await HaloAccount.uploadChatImage(btoa(d), a, r),
            m = e("global-input").value.trim();
          (await HaloLive.sendGlobal(m, uo.global, u),
            (e("global-input").value = ""),
            wo("global"));
        } catch (e) {
          h(e && e.message ? e.message : "The picture could not be posted.");
        } finally {
          n.classList.remove("busy");
        }
      }),
      (e("dm-form").onsubmit = (e) =>
        n(e, "dm-input", async (e) => {
          (await _o(e, "dm")) || (await HaloLive.sendDm(oo.dmWith, e));
        })),
      (e("global-name-close").onclick = () => {
        e("global-name-actions").hidden = !0;
      }),
      (e("chat-name-close").onclick = () => {
        e("chat-name-actions").hidden = !0;
      }),
      document.addEventListener("keydown", (t) => {
        "Escape" === t.key &&
          (function () {
            for (const t of ["global-name-actions", "chat-name-actions"])
              e(t).hidden = !0;
          })();
      }),
      (e("chat-name-mention").onclick = () => {
        ((e("chat-name-actions").hidden = !0), bo("chat-input", oo.picked));
      }),
      (e("chat-name-games").onclick = (t) => {
        (t.preventDefault(),
          (e("chat-name-actions").hidden = !0),
          En(e("chat-name-games").href));
      }),
      (e("chat-name-friend").onclick = async () => {
        ((e("chat-name-actions").hidden = !0),
          await Wa(async () => {
            const e = await HaloAccount.addFriend(oo.picked);
            return (
              h(
                e.accepted
                  ? `${e.gamertag} is your friend now.`
                  : `Friend request sent to ${e.gamertag}.`,
              ),
              e
            );
          }));
      }));
    for (const e of document.querySelectorAll(".history-link"))
      e.href = "games/" + xn().replace("&", "?");
    e("global-name-games").onclick = (t) => {
      (t.preventDefault(),
        (e("global-name-actions").hidden = !0),
        En(e("global-name-games").href));
    };
    for (const e of document.querySelectorAll(".history-link"))
      e.onclick = (t) => {
        (t.preventDefault(), En(e.href));
      };
    ((e("global-name-mute").onclick = () => {
      const t = ao();
      t.add(oo.picked.toLowerCase());
      try {
        localStorage.setItem(Kt, JSON.stringify([...t]));
      } catch {}
      ((e("global-name-actions").hidden = !0),
        h(`${oo.picked} muted in the global chat.`),
        wn());
    }),
      (e("global-name-friend").onclick = async () => {
        ((e("global-name-actions").hidden = !0),
          await Wa(async () => {
            const e = await HaloAccount.addFriend(oo.picked);
            return (
              h(
                e.accepted
                  ? `${e.gamertag} is your friend now.`
                  : `Friend request sent to ${e.gamertag}.`,
              ),
              e
            );
          }));
      }));
  }
  function Dn() {
    return HaloAccount.current ? HaloAccount.current.gamertag : "Player";
  }
  async function On() {
    return HaloLobby.mapsFingerprint(ce());
  }
  function Pn(e) {
    if (!e) return "";
    const t = (e.files || []).map((e) => e.toLowerCase());
    return `${G.some((e) => t.includes(e)) ? "Full game" : "Multiplayer disc"} · ${t.length} maps`;
  }
  function Bn(t, n) {
    ((o.onlineRole = t), ct());
    const a = e("online-role");
    ("host" === t
      ? (a.textContent =
          "Your lobby. In Halo, Multiplayer > Custom Games starts a game for everyone here, and Remote Co-op plays the campaign with a friend as player 2.")
      : "guest" === t &&
        (a.textContent = `You're in ${n}'s lobby. In Halo, Multiplayer > Custom Games joins ${n}'s game, even one already started.`),
      (a.hidden = !t));
  }
  window.addEventListener("message", (t) => {
    t.origin === location.origin &&
      t.data &&
      "halo-games-close" === t.data.type &&
      ((e("history-view").hidden = !0),
      (e("history-frame").src = "about:blank"));
  });
  const _n = [
      { name: "Team Slayer", players: 8, minimum: 4 },
      { name: "Slayer", players: 8, minimum: 2 },
      { name: "Head to Head", players: 2, minimum: 2 },
      { name: "Big Team Battle", players: 16, minimum: 12, unranked: !0 },
      { name: "Big Head Slayer", players: 8, minimum: 4, unranked: !0 },
      { name: "Third-Person Slayer", players: 8, minimum: 4, unranked: !0 },
      { name: "Hunter Wars", players: 8, minimum: 4, unranked: !0 },
    ],
    Wn = [1],
    Un = {
      NONE: 0,
      HOST: 1,
      JOIN: 2,
      RESEARCH: 3,
      PARTY_STOP: 4,
      HANDOFF: 5,
      HANDOFF_HOST: 6,
      PARTY_SEARCH: 16,
    },
    Fn = {
      playlist: -1,
      phase: null,
      role: null,
      room: null,
      since: 0,
      created: 0,
      seekId: null,
      timer: null,
      busy: !1,
      excluded: new Map(),
      party: null,
      owner: !1,
      ownerName: "",
      gameHost: "",
      hostGameSeen: 0,
      reports: new Map(),
      ranked: [],
      moving: null,
      movedFor: -1,
    };
  function Gn(e) {
    if (_n[e] && _n[e].unranked) return 0;
    const t = HaloAccount.current,
      o = t && t.ranks && t.ranks[e];
    return o ? 0 | o.rank : 0;
  }
  function jn(e, t = 22) {
    e = Math.max(1, Math.min(50, 0 | e));
    return `<span class="insignia" style="width:${t}px;height:${t}px;background-position:${-Math.floor((e - 1) / 5) * t}px 0;background-size:${10 * t}px ${t}px;font-size:${Math.round(0.5 * t)}px">${e}</span>`;
  }
  function Yn(e) {
    return Gn(e);
  }
  function qn() {
    if (o.shared) {
      const e = new Int32Array(o.memory.buffer),
        t = HaloAccount.current
          ? HaloAccount.current.gamertag.slice(0, 11)
          : "";
      for (let o = 0; o < 6; o++) {
        const n = 2 * o < t.length ? t.charCodeAt(2 * o) : 0,
          a = 2 * o + 1 < t.length ? t.charCodeAt(2 * o + 1) : 0;
        Atomics.store(e, Ve("matchmakingGamertag") + o, n | (a << 16));
      }
    }
    if (o.shared) {
      const e = _n.slice(0, 4).reduce((e, t, o) => e | (Yn(o) << (8 * o)), 0);
      Atomics.store(new Int32Array(o.memory.buffer), Ve("matchmakingRanks"), e);
    }
    const t = e("mm-ranks");
    t &&
      (t.innerHTML = HaloAccount.current
        ? _n
            .map((e, t) =>
              e.unranked || !Wn.includes(t)
                ? ""
                : `<span class="mm-rank">${jn(Yn(t) || 1, 24)}${e.name}</span>`,
            )
            .filter(Boolean)
            .join(" ")
        : "sign in to get them.");
  }
  function zn() {
    return !!Fn.room && HaloNet.status().room === Fn.room;
  }
  function Jn(e) {
    o.shared &&
      Atomics.store(
        new Int32Array(o.memory.buffer),
        Ve("matchmakingCommand"),
        e,
      );
  }
  function Vn(e) {
    o.shared &&
      Atomics.store(
        new Int32Array(o.memory.buffer),
        Ve("matchmakingPlayers"),
        e,
      );
  }
  async function Qn(e) {
    const t = new Uint8Array(
      await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode("halo-web-party-v1:" + e),
      ),
    );
    return Array.from(t.slice(0, 4), (e) =>
      e.toString(16).padStart(2, "0"),
    ).join("");
  }
  function Zn() {
    ((Fn.phase = "searching"),
      (Fn.slowReported = !1),
      (Fn.role = null),
      (Fn.seekId = Array.from(crypto.getRandomValues(new Uint8Array(8)), (e) =>
        (e % 36).toString(36),
      ).join("")),
      Xn());
  }
  function Xn() {
    const e = Fn.playlist;
    HaloLobby.seek(Fn.seekId, () => ({
      playlist: e,
      maps: o.lobbyMaps || "",
      rank: Yn(e),
      since: ea(Fn.since),
      party: Fn.party ? Fn.party.id : "",
      partySize: Fn.party ? Fn.party.size : 1,
      follow: Fn.party && Fn.room && "searching" !== Fn.phase ? Fn.room : "",
      leader: !!(Fn.party && wt() && bt()),
      mayHost: Kn(),
    }));
  }
  function Kn() {
    const e = HaloAccount.current;
    return !e || !1 !== e.trusted || Date.now() - Fn.since > 6e4;
  }
  function ea(e) {
    return e + (HaloLive.now() - Date.now());
  }
  async function ta() {
    Fn.room &&
      ((Fn.moving = null),
      Fn.reports.clear(),
      (Fn.ranked = []),
      (Fn.gameHost = ""),
      (Fn.hostGameSeen = 0),
      (Fn.movedFor = -1),
      Fn.owner &&
        (await HaloLobby.withdraw(),
        Fn.advertBuild &&
          Fn.playlist >= 0 &&
          HaloAccount.matchRooms(Fn.playlist, {
            code: Fn.room,
            gone: !0,
          }).catch(() => {}),
        (Fn.advertBuild = null)),
      HaloNet.status().room === Fn.room && (await HaloNet.leave()),
      HaloNet.setMatchmaking(null),
      (Fn.room = null),
      (Fn.role = null),
      (Fn.owner = !1),
      (Fn.ownerName = ""),
      ct());
  }
  async function oa() {
    (clearInterval(Fn.timer),
      (Fn.timer = null),
      Fn.followingPartySearch &&
        (Fn.declinedPartySearch = Fn.followingPartySearch),
      (Fn.followingPartySearch = ""),
      Fn.party &&
        yt.current &&
        bt() &&
        HaloNet.status().room &&
        (await HaloNet.sendRoom("party-stop", {}).catch(() => {})),
      HaloLobby.unseek(),
      await ta(),
      (Fn.playlist = -1),
      (Fn.phase = null),
      Vn(0));
    const e = Fn.party ? Fn.party.home : Fn.home;
    (e && HaloNet.status().room !== e && yt.current && (await Ct(e)),
      (Fn.home = null));
  }
  function na() {
    if (!o.shared) return;
    const e = new Int32Array(o.memory.buffer),
      t = Ve("matchmakingParties"),
      n = (e) => (e ? (parseInt(e.slice(0, 7), 16) + 1) | 0 : 0),
      a = [];
    Fn.party && a.push({ address: HaloNet.address >>> 0, party: Fn.party.id });
    for (const e of HaloNet.status().parties || []) a.push(e);
    for (let o = 0; o < 16; o++) {
      const r = a[o];
      (Atomics.store(e, t + 2 * o, r ? 0 | r.address : 0),
        Atomics.store(e, t + 2 * o + 1, r ? n(r.party) : 0));
    }
  }
  function aa(e, t) {
    try {
      localStorage.removeItem("halo-web-room");
    } catch {}
    ((Fn.room = e),
      (Fn.role = t),
      (Fn.phase = "host" === t ? "hosting" : "joining"),
      Fn.party ? Xn() : HaloLobby.unseek(),
      HaloNet.setMatchmaking(wa()),
      ct());
  }
  function ra(e, t) {
    return Fn.playlist === e && Fn.seekId === t && "searching" === Fn.phase;
  }
  async function sa(e, t) {
    ((Fn.owner = !0), (Fn.ownerName = Dn()));
    const n = ce(),
      a = o.lobbyMaps || "";
    Fn.created || (Fn.created = Date.now());
    const r = () => ({
      code: e,
      host: Dn(),
      players: (HaloNet.status().players || 0) + 1,
      maps: a,
      mapsLabel: Pn(n),
      note: _n[t].name,
      playlist: t,
      open: "playing" !== Fn.phase,
      rank: Yn(t),
      created: ea(Fn.created),
    });
    ((Fn.advertBuild = r), await HaloLobby.advertise(e, r), (Fn.roomsAt = 0));
  }
  async function ia(e) {
    Fn.busy = !0;
    try {
      const t = Fn.playlist,
        o = Fn.seekId,
        n = await Ct(e.code);
      if (!n) return void Fn.excluded.set(e.code, Date.now() + 6e4);
      if (!ra(t, o))
        return void (HaloNet.status().room === n && (await HaloNet.leave()));
      (aa(n, "guest"),
        (Fn.owner = !1),
        (Fn.ownerName = e.host || ""),
        (Fn.gameHost = e.host || ""),
        Jn(Un.JOIN),
        c(`matchmaking: joining ${e.host}'s game in room ${n}`));
    } finally {
      Fn.busy = !1;
    }
  }
  const ca = 3e3;
  function la() {
    return [Dn(), ...(HaloNet.status().names || [])];
  }
  function da(e) {
    const t = Fn.reports.get(String(e).toLowerCase());
    return !!(t && t.report && t.report.hidden);
  }
  function ua(e) {
    const t = Dn().toLowerCase();
    ((Fn.moving = { ...e, at: Date.now() }),
      (Fn.phase = "moving"),
      Jn(e.from.toLowerCase() === t ? Un.RESEARCH : Un.HANDOFF));
    const o = e.to.toLowerCase() === t;
    (e.handoff
      ? h(
          `${e.from} left: ${o ? "your device is" : e.to + " is"} hosting the game now. Its scores carry on.`,
          6e3,
        )
      : h(
          o
            ? "Your connection is the best here: the game moves to your device."
            : `Moving the game to ${e.to}'s connection, the best for everyone…`,
          5e3,
        ),
      c(
        `matchmaking: the game moves from ${e.from} to ${e.to}${e.handoff ? " (mid-game)" : ""}`,
      ),
      o &&
        (e.handoff &&
          HaloAccount.matchTakeover(Fn.room).catch((e) =>
            c("matchmaking: no grant: " + e.message),
          ),
        Fn.owner ||
          la().some(
            (e) => e.toLowerCase() === (Fn.ownerName || "").toLowerCase(),
          ) ||
          sa(Fn.room, Fn.playlist).catch(() => {})));
    const n = Fn.moving.at;
    setTimeout(() => {
      Fn.moving &&
        Fn.moving.at === n &&
        (c("matchmaking: the game's move came to nothing: searching again"),
        (Fn.moving = null),
        ta().then(() => {
          Fn.playlist >= 0 && Zn();
        }));
    }, 6e4);
  }
  function ma(e, t = "room") {
    if (!zn() || Fn.moving || !e || "host" === Fn.role) return;
    if (e.toLowerCase() !== (Fn.gameHost || "").toLowerCase()) return;
    if (Date.now() - (Fn.mergeAt || 0) < 3e4) return;
    const o = "playing" === Fn.phase;
    if (!o && "lobby" !== Fn.phase) return;
    if (
      "game" === t &&
      (HaloNet.status().names || []).some(
        (t) => t.toLowerCase() === e.toLowerCase(),
      )
    )
      return;
    const n = la().filter((t) => t.toLowerCase() !== e.toLowerCase());
    if (n.length < 2) return;
    const a = n.filter((e) => !da(e)),
      r =
        (Fn.ranked || []).find(
          (t) =>
            t.toLowerCase() !== e.toLowerCase() &&
            ((e) => n.some((t) => t.toLowerCase() === String(e).toLowerCase()))(
              t,
            ) &&
            !da(t),
        ) ||
        [...(a.length ? a : n)].sort((e, t) =>
          e.toLowerCase() < t.toLowerCase() ? -1 : 1,
        )[0];
    (c(`matchmaking: the host ${e} is gone (${t})${o ? " mid-game" : ""}`),
      ua({ to: r, from: e, handoff: o, game: 0 | Fn.hostGameSeen }));
  }
  const ha = "halo-web-game-records";
  function ga() {
    try {
      return JSON.parse(localStorage.getItem(ha) || "[]");
    } catch {
      return [];
    }
  }
  async function pa() {
    if (HaloAccount.current && !pa.busy) {
      pa.busy = !0;
      try {
        for (;;) {
          const e = ga()[0];
          if (!e) break;
          try {
            await HaloAccount.gameRecord(e);
          } catch (e) {
            if (
              !e ||
              !e.status ||
              e.status >= 500 ||
              429 === e.status ||
              401 === e.status
            )
              break;
          }
          const t = ga().filter((t) => t.rid !== e.rid);
          try {
            localStorage.setItem(ha, JSON.stringify(t));
          } catch {
            break;
          }
        }
      } finally {
        pa.busy = !1;
      }
    }
  }
  function fa() {
    const e = "host" === Fn.role ? Fn.game : HaloNet.status().hostGame || 0;
    return e > 0 ? `${Fn.room || "NOROOM"}:${e}` : null;
  }
  function Aa(e = 0) {
    if (!HaloAccount.current || "playing" !== Fn.phase || !Fn.room) return;
    const t = fa();
    if (!t || ("host" !== Fn.role && t === Fn.registeredKey))
      return void (e < 15 && setTimeout(() => Aa(e + 1), 2e3));
    Fn.registeredKey = t;
    ("host" === Fn.role
      ? HaloAccount.matchStart(
          t,
          Fn.playlist,
          (HaloNet.status().names || []).slice(0, 16),
        )
      : HaloAccount.matchJoin(t)
    )
      .then(() =>
        c(
          `matchmaking: ${"host" === Fn.role ? "started" : "joined"} match ${t}`,
        ),
      )
      .catch((o) => {
        (c(`matchmaking: match ${t} not registered: ${o.message}`),
          (Fn.registeredKey = null),
          e < 3 && setTimeout(() => Aa(e + 1), 5e3));
      });
  }
  async function ya(e) {
    const t = 0 | e.playlist;
    if (!_n[t]) return;
    if (!HaloAccount.current)
      return (
        Fn.rankHintShown ||
          h("Sign in on the start page (Play online) to earn ranks.", 6e3),
        void (Fn.rankHintShown = !0)
      );
    const n = {
      match: fa() || `${Fn.room || "NOROOM"}:0`,
      playlist: t,
      players: Math.max(1, Fn.playersAtStart || 1),
      team: e.team && e.teamIndex >= 0 ? e.teamIndex : -1,
      place: 0 | e.place,
      groups: 0 | e.groups,
      tied: !!e.tied,
      quit: !!e.quit,
      kills: e.kills,
      deaths: e.deaths,
      shots: e.shots,
      hits: e.hits,
      seconds: e.seconds,
      build: o.version || "",
    };
    (Array.isArray(e.players) && (n.view = e.players),
      Number.isInteger(e.game) && (n.game = e.game));
    const a = Gn(t);
    try {
      ("host" === Fn.role ||
        n.match === Fn.registeredKey ||
        e.quit ||
        ((Fn.registeredKey = n.match),
        await HaloAccount.matchJoin(n.match).catch(() => {})),
        await HaloAccount.report(n),
        c(`matchmaking: reported ${JSON.stringify(n)}`));
    } catch (e) {
      return void c("matchmaking: the result was not counted: " + e.message);
    }
    if (!_n[t].unranked)
      for (let e = 0; e < 24; e++) {
        let o;
        await new Promise((t) => setTimeout(t, e ? 1e4 : 1500));
        try {
          o = await HaloAccount.me();
        } catch {
          continue;
        }
        const n = o && o.ranks && o.ranks[t];
        if (!n) return;
        if (n.games !== (Fn.gamesBefore && Fn.gamesBefore[t])) {
          (qn(), HaloNet.setMatchmaking(wa()));
          const e = n.rank,
            o = _n[t].name;
          return (
            h(
              e > a ? `Rank up! ${o}: ${e}` : `${o} rank: ${e}`,
              6e3,
              jn(e, 28),
            ),
            void c(
              `matchmaking: ${o} rank ${a} -> ${e} (rating ${n.rating.toFixed(2)})`,
            )
          );
        }
      }
  }
  function wa() {
    return {
      playlist: Fn.playlist,
      rank: Yn(Fn.playlist),
      party: Fn.party ? Fn.party.id : "",
      host: "host" === Fn.role,
      game: 0 | Fn.game,
    };
  }
  function ba(t) {
    ((e("account-out").hidden = !!t),
      (e("account-in").hidden = !t),
      (e("mm-ranks-line").hidden = !t),
      t
        ? ((e("account-name").textContent = t.gamertag),
          (e("account-email-shown").textContent =
            t.email || "None. Add one below so you can recover your account."),
          document.activeElement !== e("settings-gamertag") &&
            (e("settings-gamertag").value = t.gamertag))
        : (e("account-settings").hidden = !0),
      qn(),
      Fn.playlist >= 0 && HaloNet.setMatchmaking(wa()));
    const o = t ? t.gamertag : "";
    (yt.who !== o && ((yt.who = o), Qt()),
      kt(HaloNet.status()),
      (function (e) {
        const t = e ? e.gamertag : "";
        xa.who !== t &&
          ((xa.who = t),
          oo.dms.clear(),
          (oo.dmWith = null),
          "dm" === oo.tab && (oo.tab = "friends"),
          e
            ? (HaloLive.start(), HaloLive.restart())
            : (HaloLive.stop(), (oo.global.messages = [])));
        if (!e)
          return (
            clearTimeout(xa.timer),
            (xa.data = null),
            xa.seenInvites.clear(),
            sr(),
            void Ba()
          );
        Ua().then(or);
      })(t));
  }
  setTimeout(pa, 2e4);
  const va = {
    signin: { submit: "Sign in", password: "current-password" },
    create: {
      submit: "Create account",
      password: "new-password",
      note: "An email address is optional. Without one, there is no way to recover your account if you lose your password.",
    },
    recover: {
      submit: "Send code",
      note: "Enter the email address on your account. We'll send you a code to reset your password, along with your gamertag.",
    },
    reset: {
      submit: "Reset password",
      password: "new-password",
      note: "Enter the code we emailed you and choose a new password.",
    },
  };
  function ka(t, o) {
    ((e(t).textContent = o || ""), (e(t).hidden = !o));
  }
  function Ca(t) {
    const o = e("account-form");
    o.dataset.mode = t;
    for (const e of o.querySelectorAll("[data-modes]"))
      e.hidden = !e.dataset.modes.split(" ").includes(t);
    ((e("account-submit").textContent = va[t].submit),
      (e("account-password").autocomplete =
        va[t].password || "current-password"),
      (e("account-password").placeholder =
        "reset" === t ? "New password" : "Password"),
      (e("account-email").placeholder =
        "create" === t ? "Email address (optional)" : "Email address"),
      (e("account-note").textContent = va[t].note || ""),
      (e("account-note").hidden = !va[t].note),
      ka("account-error", ""));
  }
  async function Sa(t) {
    t.preventDefault();
    const o = e("account-form").dataset.mode,
      n = e("account-gamertag").value.trim(),
      a = e("account-email").value.trim(),
      r = e("account-password").value,
      s = e("account-confirm").value,
      i = e("account-code").value.trim(),
      c =
        ("signin" !== o && "create" !== o) || n
          ? "signin" === o ||
            ("create" === o && !a) ||
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a)
            ? "reset" !== o || i
              ? "recover" === o || r
                ? ("create" === o || "reset" === o) && r.length < 6
                  ? "Passwords must be at least 6 characters."
                  : ("create" !== o && "reset" !== o) || r === s
                    ? ""
                    : "The passwords don't match."
                : "Enter a password."
              : "Enter the code we emailed you."
            : "create" === o
              ? "That email address doesn't look right. Check it, or leave it empty."
              : "Enter your email address."
          : "Enter your gamertag.";
    if (c) ka("account-error", c);
    else {
      ((e("account-submit").disabled = !0), ka("account-error", ""));
      try {
        if ("signin" === o) {
          h(`Signed in as ${(await HaloAccount.signIn(n, r)).gamertag}.`);
        } else if ("create" === o) {
          h(`Welcome, ${(await HaloAccount.register(n, a, r)).gamertag}.`);
        } else {
          if ("recover" === o) {
            const t = await HaloAccount.recover(a);
            return (
              Ca("reset"),
              (e("account-note").textContent = t.message || va.reset.note),
              t.devCode && (e("account-code").value = t.devCode),
              void e("account-code").focus()
            );
          }
          h(
            `New password set. Signed in as ${(await HaloAccount.reset(a, i, r)).gamertag}.`,
            5e3,
          );
        }
        for (const t of ["account-password", "account-confirm", "account-code"])
          e(t).value = "";
        Ca("signin");
      } catch (e) {
        ka("account-error", e.message);
      } finally {
        e("account-submit").disabled = !1;
      }
    }
  }
  function La() {
    (Ca("signin"),
      (e("account-form").onsubmit = Sa),
      (e("account-to-create").onclick = () => {
        (Ca("create"), e("account-gamertag").focus());
      }),
      (e("account-to-signin").onclick = () => Ca("signin")),
      (e("account-to-recover").onclick = () => {
        (Ca("recover"), e("account-email").focus());
      }),
      (e("account-signout").onclick = () => HaloAccount.signOut()),
      (e("account-gamertag-form").onsubmit = async (t) => {
        t.preventDefault();
        const o = HaloAccount.current,
          n = e("settings-gamertag").value.trim();
        if (o) {
          if (n.toLowerCase() !== o.gamertag.toLowerCase())
            return (
              (e("settings-gamertag").value = o.gamertag),
              ka(
                "settings-error",
                `You can change which letters of ${o.gamertag} are capitals, not the gamertag itself.`,
              )
            );
          if (n === o.gamertag) return ka("settings-error", "");
          try {
            const e = await HaloAccount.changeGamertag(n);
            (ka("settings-error", ""),
              h(`Your gamertag is now written ${e.gamertag}.`));
          } catch (e) {
            ka("settings-error", e.message);
          }
        }
      }),
      (e("account-settings-toggle").onclick = () => {
        const t = e("account-settings").hidden;
        ((e("account-settings").hidden = !t),
          e("account-settings-toggle").setAttribute("aria-expanded", String(t)),
          ka("settings-error", ""));
      }),
      (e("account-email-form").onsubmit = async (t) => {
        t.preventDefault();
        const o = e("settings-email").value.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(o))
          return ka("settings-error", "Enter a valid email address.");
        if (!e("settings-email-password").value)
          return ka("settings-error", "Enter your password.");
        try {
          (await HaloAccount.changeEmail(e("settings-email-password").value, o),
            (e("settings-email").value = e("settings-email-password").value =
              ""),
            ka("settings-error", ""),
            h("Email address changed."));
        } catch (e) {
          ka("settings-error", e.message);
        }
      }),
      (e("account-password-form").onsubmit = async (t) => {
        t.preventDefault();
        const o = e("settings-current").value,
          n = e("settings-new").value;
        if (!o) return ka("settings-error", "Enter your current password.");
        if (n.length < 6)
          return ka(
            "settings-error",
            "Passwords must be at least 6 characters.",
          );
        if (n !== e("settings-confirm").value)
          return ka("settings-error", "The new passwords don't match.");
        try {
          await HaloAccount.changePassword(o, n);
          for (const t of [
            "settings-current",
            "settings-new",
            "settings-confirm",
          ])
            e(t).value = "";
          (ka("settings-error", ""),
            h("Password changed. Your other devices are signed out.", 5e3));
        } catch (e) {
          ka("settings-error", e.message);
        }
      }),
      (e("account-friends").onclick = () => Io("friends")),
      (e("friends-add").onsubmit = async (t) => {
        t.preventDefault();
        const o = e("friends-add-input").value.trim();
        o &&
          (await Wa(async () => {
            const t = await HaloAccount.addFriend(o);
            return (
              (e("friends-add-input").value = ""),
              h(
                t.accepted
                  ? `${t.gamertag} is your friend now.`
                  : `Friend request sent to ${t.gamertag}.`,
              ),
              t
            );
          }));
      }),
      (e("friends-requests-open").onchange = async () => {
        const t = e("friends-requests-open").checked;
        xa.requestsBusy = !0;
        try {
          await Wa(
            () => HaloAccount.setFriendRequests(t),
            t
              ? "Players can send you friend requests."
              : "Friend requests are off: no one can send you one.",
          );
        } finally {
          ((xa.requestsBusy = !1),
            xa.data &&
              (e("friends-requests-open").checked = !xa.data.requestsOff));
        }
      }),
      HaloNet.on((e) => {
        "status" === e && nr();
      }),
      document.addEventListener("visibilitychange", () => {
        "visible" === document.visibilityState &&
          HaloAccount.current &&
          Ua().then(or);
      }),
      HaloAccount.on(ba),
      ba(HaloAccount.current),
      HaloAccount.current &&
        HaloAccount.me().catch((e) => c("account: " + e.message)));
  }
  const Ha = 6e4,
    Ea = 1e4,
    xa = {
      data: null,
      timer: null,
      seenInvites: new Set(),
      shownInvite: null,
      busy: !1,
      lastPresence: "",
    };
  function Na() {
    const e =
      o.gameStatus &&
      Date.now() - o.gameStatus.time < 3e4 &&
      document.body.classList.contains("playing")
        ? (function (e) {
            const t = { mode: e.mode };
            e.map && (t.map = e.map);
            e.type && (t.type = e.type);
            e.score && (t.score = e.score);
            e.difficulty && (t.difficulty = e.difficulty);
            return t;
          })(o.gameStatus)
        : void 0;
    if (St()) {
      const t =
        "lobby" === Fn.phase
          ? "lobby"
          : "playing" === Fn.phase
            ? "playing"
            : "searching";
      return {
        activity: "matchmaking",
        playlist: Fn.playlist,
        phase: t,
        since: "searching" === t && Fn.since ? ea(Fn.since) : void 0,
        game: e,
      };
    }
    return wt()
      ? {
          activity: "lobby",
          lobby: yt.current.id,
          players: 1 + (0 | HaloNet.status().players),
          game: e,
        }
      : document.body.classList.contains("playing")
        ? { activity: "playing", game: e }
        : { activity: "menus" };
  }
  const Ta = {
    custom: "Custom Game",
    matchmaking: "Matchmaking",
    campaign: "Campaign",
    coop: "Co-op Campaign",
    "remote-coop": "Remote Co-op",
    splitscreen: "Split Screen",
    systemlink: "System Link",
  };
  function $a(e) {
    if (!e.online) {
      if (!e.lastSeen) return "Offline";
      const t = Math.max(1, Math.round((Date.now() - e.lastSeen) / 6e4));
      return (
        "Offline · seen " +
        (t < 60
          ? `${t} min ago`
          : t < 1440
            ? `${Math.round(t / 60)} h ago`
            : `${Math.round(t / 1440)} d ago`)
      );
    }
    const t = e.presence || { activity: "menus" },
      o = t.game;
    if (o && Ta[o.mode]) {
      const e = "lobby" === t.activity && t.name ? ` in ${t.name}` : "",
        n = (function (e) {
          return [e.map, e.type || e.difficulty, e.score]
            .filter(Boolean)
            .join(" · ");
        })(o);
      return `${Ta[o.mode]}${e}${n ? ": " + n : ""}`;
    }
    if ("lobby" === t.activity)
      return (
        `In ${t.name || "a lobby"} · ${1 === t.players ? "1 player" : `${t.players} players`}` +
        (!1 === t.public ? " · private" : "")
      );
    if ("matchmaking" === t.activity) {
      const e = (_n[t.playlist] || _n[0]).name;
      return "playing" === t.phase
        ? `Matchmaking: in a ${e} game`
        : "lobby" === t.phase
          ? `Matchmaking: ${e} lobby`
          : `Matchmaking: searching ${e}`;
    }
    return "playing" === t.activity ? "Playing Halo" : "Online";
  }
  function Ia(e, t) {
    const o = t || {};
    if (!e || "lobby" !== o.activity || !o.lobby) return { joinable: !1 };
    if (wt() && yt.current.id === o.lobby)
      return { joinable: !1, together: !0 };
    if (!1 === o.public) return { joinable: !1, why: "private" };
    const n = _n[o.playlist] || _n[0],
      a =
        1 === o.mode
          ? n.unranked
            ? n.players
            : Math.max(1, n.players / 2)
          : At;
    return (0 | o.players) >= a
      ? { joinable: !1, why: "full" }
      : St()
        ? { joinable: !1 }
        : { joinable: !0, playing: !(!o.game || "custom" !== o.game.mode) };
  }
  function Ma(e, t) {
    if (!e.online)
      return e.lastSeen ? "Offline - " + Xa(e.lastSeen) : "Offline";
    const o = e.presence || { activity: "menus" },
      n = o.game;
    if ("lobby" === o.activity) {
      t = t || Ia(!0, o);
      const e = (_n[o.playlist] || _n[0]).name,
        a =
          1 === o.mode
            ? `${e} lobby`
            : n && "custom" === n.mode
              ? [n.map, n.type].filter(Boolean).join(" ") || "Custom game"
              : 0 === o.mode
                ? "Custom Games lobby"
                : o.name || "In a lobby";
      return t.together
        ? "In your lobby"
        : t.joinable
          ? `Joinable - ${a}`
          : "full" === t.why
            ? `Full - ${a}`
            : "private" === t.why
              ? `Private - ${a}`
              : a;
    }
    if ("matchmaking" === o.activity) {
      const e = (_n[o.playlist] || _n[0]).name;
      return "searching" === o.phase ? `Searching - ${e}` : `In a match - ${e}`;
    }
    if (n && Ta[n.mode])
      return "campaign" === n.mode ||
        "coop" === n.mode ||
        "remote-coop" === n.mode
        ? "Campaign - " + (n.map || "")
        : n.map && n.type
          ? `${n.map} - ${n.type}`
          : Ta[n.mode];
    if ("lobby" === o.activity) return "In " + (o.name || "a lobby");
    if ("matchmaking" === o.activity) {
      const e = (_n[o.playlist] || _n[0]).name;
      return "playing" === o.phase
        ? "Playing " + e
        : "lobby" === o.phase
          ? e + " lobby"
          : "Searching " + e;
    }
    return "playing" === o.activity ? "Playing Halo" : "Online";
  }
  function Ra(e, t, o) {
    const n = document.createElement("button");
    return (
      (n.type = "button"),
      (n.className = "button small-button" + (o ? " primary" : "")),
      (n.textContent = e),
      (n.onclick = async () => {
        n.disabled = !0;
        try {
          await t();
        } finally {
          n.disabled = !1;
        }
      }),
      n
    );
  }
  function Da(e, t, o, n, a, r, s) {
    const i = document.createElement("div");
    i.className = "friend" + (o ? " online" : "");
    const c = document.createElement("span");
    c.className = "dot";
    const l = document.createElement("div");
    l.className = "who";
    const d = document.createElement("div");
    ((d.className = "name"), lo(e, s, d));
    const u = document.createElement("div");
    ((u.className = "doing"), (u.textContent = t), l.append(d, u));
    const m = document.createElement("div");
    if (((m.className = "actions"), r)) {
      const e = document.createElement("span");
      ((e.className = "badge"),
        (e.title = "Unread messages"),
        (e.textContent = r > 9 ? "9+" : String(r)),
        m.appendChild(e));
    }
    return (
      m.append(...n),
      m.addEventListener("click", (e) => e.stopPropagation()),
      i.append(c, l, m),
      a &&
        ((i.tabIndex = 0),
        i.setAttribute("role", "button"),
        (i.onclick = a),
        (i.onkeydown = (e) => {
          "Enter" === e.key && a();
        })),
      i
    );
  }
  function Oa(e, t, o, n) {
    const a = document.createElement("h3");
    if (((a.textContent = t), e.appendChild(a), !o.length && n)) {
      const t = document.createElement("p");
      ((t.className = "empty"), (t.textContent = n), e.appendChild(t));
    }
    for (const t of o) e.appendChild(t);
  }
  function Pa(e, t) {
    const o = [],
      n = e.presence || {},
      a = wt() ? yt.current.id : null;
    "lobby" === n.activity && n.lobby;
    return (
      t &&
        o.push(
          Ra("Remove", async () => {
            confirm(`Remove ${e.gamertag} from your friends?`) &&
              (await Wa(
                () => HaloAccount.removeFriend(e.gamertag),
                `${e.gamertag} removed.`,
              ),
              (oo.dmWith = null),
              xo("friends"));
          }),
        ),
      o
    );
  }
  function Ba() {
    const t = HaloAccount.current;
    ((e("friends-signed-out").hidden = !!t),
      (e("friends-signed-in").hidden = !t));
    const o = xa.data || {
      friends: [],
      incoming: [],
      outgoing: [],
      invites: [],
    };
    Do();
    const n = o.friends.filter((e) => e.online).length;
    if (
      ((e("friends-summary").textContent = o.friends.length
        ? `${n} of ${o.friends.length} online · tap a friend to message them`
        : ""),
      xa.requestsBusy || (e("friends-requests-open").checked = !o.requestsOff),
      !no())
    )
      return;
    if ("dm" === oo.tab) return void Mn();
    if ("friends" !== oo.tab) return;
    const a = e("friends-body");
    ((a.textContent = ""),
      o.incoming.length &&
        Oa(
          a,
          "Friend requests",
          o.incoming.map((e) =>
            Da(e.gamertag, "Wants to be your friend", !1, [
              Ra(
                "Accept",
                () =>
                  Wa(
                    () => HaloAccount.acceptFriend(e.gamertag),
                    `${e.gamertag} is your friend now.`,
                  ),
                !0,
              ),
              Ra("Decline", () =>
                Wa(() => HaloAccount.removeFriend(e.gamertag)),
              ),
            ]),
          ),
        ),
      Oa(
        a,
        "Friends",
        o.friends.map((e) =>
          Da(
            e.gamertag,
            $a(e),
            e.online,
            Pa(e, !0),
            () => In(e.gamertag),
            e.unread,
            e.role,
          ),
        ),
        "No friends yet: add one by gamertag above, or from the global chat.",
      ),
      o.outgoing.length &&
        Oa(
          a,
          "Waiting for an answer",
          o.outgoing.map((e) =>
            Da(e.gamertag, "Friend request sent", !1, [
              Ra("Cancel", () =>
                Wa(() => HaloAccount.removeFriend(e.gamertag)),
              ),
            ]),
          ),
        ));
  }
  function _a(e) {
    if (!e || !Array.isArray(e.friends)) return;
    ((xa.data = {
      friends: e.friends,
      incoming: e.incoming || [],
      outgoing: e.outgoing || [],
      invites: e.invites || [],
      requestsOff: !!e.requestsOff,
    }),
      Ba(),
      tr());
    const t = xa.data.invites.find((e) => !xa.seenInvites.has(e.id));
    for (const e of xa.data.invites) xa.seenInvites.add(e.id);
    t
      ? (function (e) {
          (xa.shownInvite && xa.shownInvite.id === e.id) ||
            h(
              `${e.from} invited you to their lobby: open the friends list in the game (Y).`,
              6e3,
            );
          xa.shownInvite = e;
        })(t)
      : xa.shownInvite &&
        !xa.data.invites.some((e) => e.id === xa.shownInvite.id) &&
        sr();
  }
  async function Wa(e, t) {
    ka("friends-error", "");
    try {
      const o = await e();
      (_a(o), (o && Array.isArray(o.friends)) || (await Ua(!0)), t && h(t));
    } catch (e) {
      ka("friends-error", e.message);
    }
  }
  async function Ua(e) {
    if (HaloAccount.current && !xa.busy) {
      xa.busy = !0;
      try {
        const t = Na();
        ((xa.lastPresence = JSON.stringify(t)),
          !1 !== e && (xa.presenceSent = Date.now()),
          _a(
            !1 === e
              ? await HaloAccount.friends()
              : await HaloAccount.presence(t),
          ));
      } catch (e) {
        c("friends: " + e.message);
      } finally {
        xa.busy = !1;
      }
    }
  }
  const Fa = {
      SEQ: 0,
      SIGNED_IN: 1,
      GAMERTAG: 2,
      CLAN_NAME: 8,
      CLAN_RANK: 18,
      CLAN_INVITES: 19,
      COUNTS: 20,
      IN_LOBBY: 23,
      FRIENDS_ONLINE: 24,
      MY_ROLE: 25,
      ROWS: 32,
      ROW_WORDS: 32,
      LIST_ROWS: 40,
      PROFILE: 3872,
      P_STATE: 0,
      P_NAME: 1,
      P_ROLE: 7,
      P_CLAN: 8,
      P_CLAN_RANK: 18,
      P_LEVEL: 19,
      P_DIFFICULTY: 20,
      P_CUSTOM: 21,
      P_RANKED: 22,
      P_RANKS: 23,
      P_GAMES: 27,
      P_UNRANKED: 31,
    },
    Ga = { asked: "" };
  function ja(e, t, n) {
    if (!o.shared || !o.offsets || void 0 === o.offsets.social) return;
    const a = new Int32Array(o.memory.buffer),
      r = Ve("social") + Fa.PROFILE,
      s = t || {};
    (Dt(a, r + Fa.P_NAME, 6, s.gamertag || n || ""),
      Atomics.store(a, r + Fa.P_ROLE, Za(s.role)),
      Dt(a, r + Fa.P_CLAN, 10, s.clan ? s.clan.name : ""),
      Atomics.store(a, r + Fa.P_CLAN_RANK, s.clan ? 0 | s.clan.rank : 0),
      Atomics.store(a, r + Fa.P_LEVEL, s.campaign ? 0 | s.campaign.level : -1),
      Atomics.store(
        a,
        r + Fa.P_DIFFICULTY,
        s.campaign ? 0 | s.campaign.difficulty : -1,
      ),
      Atomics.store(a, r + Fa.P_CUSTOM, 0 | s.customGames),
      Atomics.store(a, r + Fa.P_RANKED, 0 | s.rankedGames));
    for (let e = 0; e < 4; e++) {
      const t = (s.ranks || [])[e];
      (Atomics.store(
        a,
        r + Fa.P_RANKS + e,
        t && !1 !== t.ranked && t.games > 0
          ? 0 | t.rank
          : t && !1 === t.ranked
            ? -1
            : 0,
      ),
        Atomics.store(a, r + Fa.P_GAMES + e, t ? 0 | t.games : 0));
    }
    (Atomics.store(a, r + Fa.P_UNRANKED, 0 | s.unrankedGames),
      Atomics.store(a, r + Fa.P_STATE, e),
      Atomics.store(a, Ve("social") + Fa.SEQ, ++Va));
  }
  const Ya = {
      ONLINE: 1,
      JOINABLE: 2,
      WITH_ME: 4,
      REQUEST_IN: 8,
      REQUEST_OUT: 16,
      LOBBY_INVITE: 32,
      CLAN_INVITE: 64,
      FRIEND: 128,
      INVITABLE: 256,
      PLAYING: 512,
      SELF: 1024,
      IN_CLAN: 2048,
    },
    qa = ["", "Peon", "Member", "Staff", "Overlord"],
    za = "halo-web-recent-players",
    Ja = { data: null, timer: null };
  let Va = 0,
    Qa = [[], [], []];
  function Za(e) {
    return "owner" === e ? 2 : "mod" === e ? 1 : 0;
  }
  function Xa(e) {
    const t = Math.max(1, Math.round((Date.now() - e) / 6e4));
    return t < 60
      ? `${t} min ago`
      : t < 1440
        ? `${Math.round(t / 60)} h ago`
        : `${Math.round(t / 1440)} d ago`;
  }
  async function Ka() {
    if (HaloAccount.current) {
      try {
        Ja.data = await HaloAccount.clans.get();
      } catch (e) {
        c("clan: " + e.message);
      }
      tr();
    } else Ja.data = null;
  }
  function er() {
    const e = HaloAccount.current,
      t = xa.data || { friends: [], incoming: [], outgoing: [], invites: [] },
      o = wt() ? yt.current.id : null,
      n = !!o,
      a = new Set(t.friends.map((e) => e.gamertag.toLowerCase())),
      r = [];
    for (const e of t.invites)
      r.push({
        kind: "invite",
        invite: e,
        gamertag: e.from,
        flags: Ya.LOBBY_INVITE | Ya.ONLINE | Ya.FRIEND,
        status: `Invited you to ${e.name}`,
      });
    for (const e of t.incoming)
      r.push({
        kind: "incoming",
        gamertag: e.gamertag,
        flags: Ya.REQUEST_IN,
        status: "Sent you a friend request",
      });
    for (const e of t.friends) {
      const t = e.presence || {};
      let a = Ya.FRIEND;
      e.online && (a |= Ya.ONLINE);
      const s = "lobby" === t.activity && t.lobby === o;
      s && (a |= Ya.WITH_ME);
      const i = Ia(e.online, t);
      (i.joinable && (a |= Ya.JOINABLE),
        i.playing && (a |= Ya.PLAYING),
        e.online && n && !s && (a |= Ya.INVITABLE),
        r.push({
          kind: "friend",
          friend: e,
          gamertag: e.gamertag,
          role: e.role,
          flags: a,
          status: Ma(e, i),
        }));
    }
    for (const e of t.outgoing)
      r.push({
        kind: "outgoing",
        gamertag: e.gamertag,
        flags: Ya.REQUEST_OUT,
        status: "Friend request sent",
      });
    const s = (function () {
        const e = HaloAccount.current;
        if (!e) return [];
        try {
          const t = JSON.parse(localStorage.getItem(za) || "{}");
          return Array.isArray(t[e.gamertag.toLowerCase()])
            ? t[e.gamertag.toLowerCase()]
            : [];
        } catch {
          return [];
        }
      })().map((e) => {
        const t = $n(e.gamertag);
        let o = a.has(e.gamertag.toLowerCase()) ? Ya.FRIEND : 0;
        (t && t.online && (o |= Ya.ONLINE),
          t && t.online && n && (o |= Ya.INVITABLE));
        const r = t ? Ia(t.online, t.presence) : { joinable: !1 };
        return (
          r.joinable && (o |= Ya.JOINABLE),
          {
            kind: "recent",
            gamertag: e.gamertag,
            role: t ? t.role : "",
            flags: o,
            friend: t,
            status: r.joinable
              ? Ma(t, r)
              : `${e.where || "Played with you"} - ${Xa(e.time)}`,
          }
        );
      }),
      i = [],
      c = Ja.data || { clan: null, invites: [] },
      l = new Set(
        c.clan ? c.clan.members.map((e) => e.gamertag.toLowerCase()) : [],
      );
    for (const e of [...r, ...s])
      l.has(String(e.gamertag || "").toLowerCase()) && (e.flags |= Ya.IN_CLAN);
    if (c.clan)
      for (const t of c.clan.members) {
        const o = e && t.gamertag.toLowerCase() === e.gamertag.toLowerCase();
        let r =
          (o ? Ya.SELF : 0) | (a.has(t.gamertag.toLowerCase()) ? Ya.FRIEND : 0);
        ((t.online || o) && (r |= Ya.ONLINE),
          t.online && n && !o && (r |= Ya.INVITABLE));
        const s = o ? { joinable: !1 } : Ia(t.online, t.presence);
        s.joinable && (r |= Ya.JOINABLE);
        const c = t.online
          ? Ma({ online: !0, presence: t.presence }, s)
          : "Offline";
        i.push({
          kind: "member",
          member: t,
          gamertag: t.gamertag,
          role: t.role,
          clanRank: t.rank,
          flags: r,
          status: o ? t.rankName : `${t.rankName} · ${c}`,
        });
      }
    else
      for (const e of c.invites)
        i.push({
          kind: "clan-invite",
          invite: e,
          gamertag: e.from,
          flags: Ya.CLAN_INVITE | Ya.ONLINE,
          status: `Clan invite - ${e.clan}`,
        });
    return [r, s, i];
  }
  function tr() {
    if (!o.shared || !o.offsets || void 0 === o.offsets.social) return;
    const e = new Int32Array(o.memory.buffer),
      t = Ve("social"),
      n = HaloAccount.current,
      a = n ? er() : [[], [], []];
    Qa = a;
    const r = Ja.data && Ja.data.clan;
    (Atomics.store(e, t + Fa.SIGNED_IN, n ? 1 : 0),
      Dt(e, t + Fa.GAMERTAG, 6, n ? n.gamertag : ""),
      Dt(e, t + Fa.CLAN_NAME, 10, r ? r.name : ""),
      Atomics.store(e, t + Fa.CLAN_RANK, r ? r.rank : 0),
      Atomics.store(
        e,
        t + Fa.CLAN_INVITES,
        Ja.data && !r ? Ja.data.invites.length : 0,
      ),
      Atomics.store(e, t + Fa.IN_LOBBY, wt() ? (bt() ? 2 : 1) : 0),
      Atomics.store(e, t + Fa.MY_ROLE, n ? Za(n.role) : 0),
      Atomics.store(
        e,
        t + Fa.FRIENDS_ONLINE,
        a[0].filter((e) => "friend" === e.kind && e.flags & Ya.ONLINE).length,
      ));
    for (let o = 0; o < 3; o++) {
      Atomics.store(e, t + Fa.COUNTS + o, Math.min(a[o].length, Fa.LIST_ROWS));
      for (let n = 0; n < Fa.LIST_ROWS; n++) {
        const r = a[o][n],
          s = t + Fa.ROWS + (o * Fa.LIST_ROWS + n) * Fa.ROW_WORDS;
        (Dt(e, s, 6, r ? r.gamertag : ""),
          Atomics.store(e, s + 6, r ? r.flags : 0),
          Atomics.store(e, s + 7, r ? Za(r.role) | (r.clanRank << 4) : 0));
        let i = r
          ? String(r.status || "").replace(/[^\x20-\x7e]/g, (e) =>
              "·" === e ? "-" : " ",
            )
          : "";
        (i.length > 30 && (i = i.slice(0, 28).trimEnd() + ".."),
          Dt(e, s + 8, 20, i));
      }
    }
    Atomics.store(e, t + Fa.SEQ, ++Va);
  }
  function or() {
    (clearTimeout(xa.timer),
      HaloAccount.current &&
        (xa.timer = setTimeout(
          async () => {
            (await Ua(),
              Date.now() - (Ja.fetched || 0) > 6e5 &&
                ((Ja.fetched = Date.now()), await Ka()),
              or());
          },
          !no() || ("friends" !== oo.tab && "dm" !== oo.tab) ? Ha : Ea,
        )));
  }
  function nr() {
    const e = Na();
    if (!HaloAccount.current || JSON.stringify(e) === xa.lastPresence) return;
    let t = null;
    try {
      t = JSON.parse(xa.lastPresence || "null");
    } catch {
      t = null;
    }
    if (
      t &&
      JSON.stringify({ ...t, game: null }) ===
        JSON.stringify({ ...e, game: null })
    )
      return;
    clearTimeout(xa.changeTimer);
    const o = Date.now() - (xa.presenceSent || 0);
    xa.changeTimer = setTimeout(() => Ua(), Math.max(1500, 15e3 - o));
  }
  async function ar(e, t, n) {
    const a = await Ht(t.lobby);
    return (
      a && !bt() && (o.lobbyJoinedAt = Date.now()),
      a &&
        n &&
        h(
          o.started
            ? `In ${t.name || `${e}'s lobby`}: open Multiplayer > Custom Games in the game to join ${e}'s game.`
            : `In ${t.name || `${e}'s lobby`}: play, then Multiplayer > Custom Games joins ${e}'s game.`,
          8e3,
        ),
      a
    );
  }
  async function rr(e) {
    (sr(),
      (wt() &&
        yt.current.id !== e.lobby &&
        (0 | HaloNet.status().players) > 0 &&
        !confirm(`Leave ${yt.current.name} and join ${e.name}?`)) ||
        ((await Ht(e.lobby)) &&
          (bt() || (o.lobbyJoinedAt = Date.now()),
          await HaloAccount.answerInvite(e.id).catch(() => {}),
          Ua())));
  }
  function sr() {
    ((xa.shownInvite = null), (e("invite-card").hidden = !0));
  }
  async function ir() {
    (qn(), (o.lobbyStarted = Date.now()));
    const t = await On();
    ((!t && o.lobbyMaps) || (o.lobbyMaps = t),
      HaloLobby.start(),
      (e("quick-match").onclick = Zt),
      clearInterval(yt.timer),
      (yt.timer = setInterval(() => {
        ((no() && "room" === oo.tab && !HaloNet.status().room) ||
          o.customGamesOpen) &&
          HaloAccount.current &&
          "visible" === document.visibilityState &&
          Tt();
      }, 3e4)));
  }
  function cr() {
    (HaloNet.on((e, t) => {
      var n;
      ("status" === e && kt(t),
        "room" === e && Gt(t),
        "joined" === e &&
          (!(function (e) {
            const t = HaloAccount.current;
            if (!t || !e || e.toLowerCase() === t.gamertag.toLowerCase())
              return;
            const o = St()
              ? "Matchmaking"
              : wt()
                ? "Custom Games"
                : "System Link";
            try {
              const n = JSON.parse(localStorage.getItem(za) || "{}"),
                a = t.gamertag.toLowerCase(),
                r = (Array.isArray(n[a]) ? n[a] : []).filter(
                  (t) => t.gamertag.toLowerCase() !== e.toLowerCase(),
                );
              (r.unshift({ gamertag: e, time: Date.now(), where: o }),
                (n[a] = r.slice(0, 30)),
                localStorage.setItem(za, JSON.stringify(n)));
            } catch {}
            tr();
          })(t.name),
          wt() &&
            bt() &&
            yt.current.settings &&
            HaloNet.sendRoom("lobby-settings", yt.current.settings)),
        ("joined" === e || "left" === e) &&
          Fn.owner &&
          Fn.room &&
          HaloLobby.refresh(),
        "joined" === e && h(`${t.name} joined the ${wt() ? "lobby" : "game"}.`),
        "left" === e && h(`${t.name} left the ${wt() ? "lobby" : "game"}.`),
        "left" === e &&
          (function (e) {
            const t = yt.current;
            if (!t || !wt() || !HaloAccount.current) return;
            const n = Jt();
            if (e.toLowerCase() !== n.toLowerCase()) return;
            const a = HaloAccount.current.gamertag,
              r = [a, ...HaloNet.status().names],
              s = (e) =>
                r.some((t) => t.toLowerCase() === String(e).toLowerCase()),
              i = (e) => {
                const t = jt.reports.get(String(e).toLowerCase());
                return !!(t && t.report && t.report.hidden);
              },
              l = (jt.ranked || []).filter(
                (t) => t.toLowerCase() !== e.toLowerCase() && s(t) && !i(t),
              ),
              d = r.filter((e) => !i(e)),
              u =
                l[0] ||
                (s(t.owner) &&
                !i(t.owner) &&
                t.owner.toLowerCase() !== e.toLowerCase()
                  ? t.owner
                  : [...(d.length ? d : r)].sort((e, t) =>
                      e.toLowerCase() < t.toLowerCase() ? -1 : 1,
                    )[0]),
              m = Date.now() - (o.lobbyGameSeenAt || 0) < 15e3;
            ((jt.elected = u),
              (jt.electedAt = Date.now()),
              m &&
                (jt.handoff = { from: e, to: u, at: Date.now(), lobby: t.id }),
              c(`lobby host: ${e} left${m ? " mid-game" : ""}: ${u} hosts`),
              m && Rt.command++,
              Ot(),
              m &&
                (u.toLowerCase() === a.toLowerCase() &&
                  setTimeout(() => {
                    wt() &&
                      Jt().toLowerCase() === a.toLowerCase() &&
                      (c("lobby host: carrying the lobby's game on here"),
                      Rt.handoff++,
                      Rt.hostStart++,
                      Ot());
                  }, 1500),
                h(
                  `${e} left: ${u.toLowerCase() === a.toLowerCase() ? "you are" : u + " is"} hosting the game now.`,
                  5e3,
                )));
          })(t.name),
        "left" === e && ma(t.name),
        "left" === e &&
          zn() &&
          "host" === Fn.role &&
          !Fn.owner &&
          t.name.toLowerCase() === (Fn.ownerName || "").toLowerCase() &&
          sa(Fn.room, Fn.playlist).catch(() => {}),
        ("joined" !== e && "left" !== e) ||
          ((n = `${t.name} ${"joined" === e ? "joined" : "left"} the ${wt() ? "lobby" : "game"}.`),
          eo.messages.push({
            system: "event",
            text: n,
            id: "event-" + Date.now() + Math.random(),
            time: Date.now(),
          }),
          eo.messages.length > 100 && eo.messages.shift(),
          no() && "room" === oo.tab && Eo()),
        "status" === e &&
          (t.room || null) !== eo.room &&
          ((eo.room = t.room || null),
          (eo.messages = []),
          (eo.unread = 0),
          wo("room"),
          Do(),
          no() && "room" === oo.tab && Eo()));
    }),
      window.addEventListener("pagehide", (e) => {
        if (!e.persisted) {
          try {
            HaloLobby.goneNow();
          } catch {}
          try {
            HaloNet.goodbye();
          } catch {}
        }
      }));
    const t = (t) => Et(e(t).checked);
    ((e("lobby-create").onclick = () => t("lobby-public-new")),
      (e("pane-lobby-create").onclick = () => t("pane-lobby-public")),
      (e("lobby-public").onchange = (e) => Nt(e.target.checked)),
      (e("online-leave").onclick = xt),
      (e("pane-lobby-leave").onclick = xt),
      (e("lobby-invite").onclick = () => Io("friends")),
      (e("pane-lobby-invite").onclick = () => {
        ((oo.dmWith = null), xo("friends"));
      }),
      HaloInput.setKeyBinds(a.keyBinds || {}),
      ur(),
      (e("opt-turn-url").value = a.turnUrl || ""),
      (e("opt-turn-user").value = a.turnUser || ""),
      (e("opt-turn-password").value = a.turnPassword || ""));
    for (const [t, o] of [
      ["opt-turn-url", "turnUrl"],
      ["opt-turn-user", "turnUser"],
      ["opt-turn-password", "turnPassword"],
    ])
      e(t).onchange = (e) => {
        ((a[o] = e.target.value.trim()),
          r(),
          "turnUrl" === o &&
            a.turnUrl &&
            !/^(turns?|stun):\S+$/i.test(a.turnUrl) &&
            h(
              "That isn't a relay address (it starts with turn:), so online play won't use it. Leave the box empty if you don't have one.",
              8e3,
            ));
      };
    kt(HaloNet.status());
  }
  let lr = null;
  function dr(e) {
    return (a.keyBinds || {})[e.id] || e.keys[0];
  }
  function ur() {
    for (const t of ["opt-keys", "menu-keys"]) {
      const o = e(t);
      if (!o) continue;
      o.textContent = "";
      for (const e of HaloInput.KEY_ACTIONS) {
        const t = document.createElement("span");
        ((t.className = "key-action"), (t.textContent = e.label));
        const n = document.createElement("button");
        ((n.type = "button"),
          (n.className = "button small-button key-button"),
          (n.dataset.action = e.id));
        const r = (a.keyBinds || {})[e.id];
        n.classList.toggle("changed", !!r && r !== e.keys[0]);
        const s = new Set(Object.values(a.keyBinds || {})),
          i = r || !e.keys[1] || s.has(e.keys[1]) ? "" : e.keys[1];
        ((n.textContent =
          HaloInput.keyLabel(dr(e)) + (i ? ` / ${HaloInput.keyLabel(i)}` : "")),
          (n.onclick = (t) => {
            if ((t.stopPropagation(), gr === e.id && Date.now() - hr < 400))
              return;
            if (lr && lr.action === e) return;
            lr && ur();
            const o = [
              ...document.querySelectorAll(".key-list .key-button"),
            ].filter((t) => t.dataset.action === e.id);
            lr = { action: e, since: Date.now() };
            for (const e of o)
              (e.classList.add("listening"),
                (e.textContent = "Press a key or click…"));
          }),
          o.append(t, n));
      }
      const n = document.createElement("div");
      n.className = "key-foot";
      const s = document.createElement("button");
      if (
        ((s.type = "button"),
        (s.className = "button small-button"),
        (s.textContent = "Reset to default keys"),
        (s.onclick = () => {
          (mr(),
            (a.keyBinds = {}),
            r(),
            HaloInput.setKeyBinds({}),
            ur(),
            h("Keyboard controls are back to the default keys."));
        }),
        n.appendChild(s),
        "menu-keys" === t)
      ) {
        const e = document.createElement("span");
        ((e.className = "small"),
          (e.textContent =
            "New keys work at once; the game's on-screen hints show them the next time it starts."),
          n.appendChild(e));
      }
      o.appendChild(n);
    }
  }
  function mr() {
    ((lr = null), ur());
  }
  let hr = 0,
    gr = "";
  document.addEventListener(
    "mousedown",
    (e) => {
      if (!lr) return;
      const t = e.target.closest && e.target.closest(".key-button.listening");
      0 !== e.button || t
        ? (e.preventDefault(),
          e.stopImmediatePropagation(),
          (hr = Date.now()),
          (gr = lr.action.id),
          (0 === e.button && Date.now() - lr.since < 500) ||
            pr("Mouse" + e.button))
        : (e.target.closest && e.target.closest(".key-button")) || mr();
    },
    !0,
  );
  for (const e of ["contextmenu", "mouseup", "auxclick"])
    document.addEventListener(
      e,
      (e) => {
        (lr || Date.now() - hr < 400) && e.preventDefault();
      },
      !0,
    );
  function pr(e) {
    const { action: t } = lr,
      o = { ...(a.keyBinds || {}) },
      n = dr(t),
      s = HaloInput.KEY_ACTIONS.find((o) => o !== t && dr(o) === e);
    ((o[t.id] = e), s && (o[s.id] = n));
    for (const e of HaloInput.KEY_ACTIONS)
      o[e.id] === e.keys[0] && delete o[e.id];
    ((a.keyBinds = o),
      r(),
      HaloInput.setKeyBinds(o),
      h(
        s
          ? `${t.label}: ${HaloInput.keyLabel(e)}. ${s.label} is on ${HaloInput.keyLabel(n)} now.`
          : `${t.label}: ${HaloInput.keyLabel(e)}.`,
      ),
      mr());
  }
  window.addEventListener(
    "keydown",
    (e) => {
      if (!lr) return;
      (e.preventDefault(), e.stopImmediatePropagation());
      const t = e.code;
      "Escape" !== t || "pause" === lr.action.id
        ? !HaloInput.RESERVED_KEYS.has(t) && HaloInput.isKey(t)
          ? pr(t)
          : h(
              `${HaloInput.keyLabel(t) || "That key"} can't be used: Enter, Backspace and the arrow keys are the menus' keys.`,
            )
        : mr();
    },
    !0,
  );
  async function fr() {
    try {
      if (!o.version) {
        const t = await (await fetch("version.json")).json();
        ((o.version = t.version),
          (o.fork = t.fork || ""),
          (e("version").textContent = "Build " + t.version + (t.fork ? " · " + t.fork : "")),
          HaloAccount.setBuild(t.version));
      }
      if (
        !("serviceWorker" in navigator) ||
        !navigator.serviceWorker.controller ||
        o.updating
      )
        return;
      const t = await (
        await fetch("version.json?latest=" + Date.now(), { cache: "no-store" })
      ).json();
      t.version &&
        (t.version !== o.version || (t.fork || "") !== (o.fork || "")) &&
        (function (e) {
          if (o.updateVersion === e) return;
          ((o.updateVersion = e),
            c(`update: build ${e} is out (this is ${o.version})`),
            Ar());
        })(t.version);
    } catch {}
  }
  function Ar() {
    if ((clearTimeout(o.updateWait), o.updateVersion && !o.updating)) {
      if (
        o.coopGuest ||
        wt() ||
        HaloNet.status().room ||
        (o.started && !document.body.classList.contains("at-menus"))
      )
        return (
          o.updateBannerShown ||
            ((o.updateBannerShown = !0), (e("update-banner").hidden = !1)),
          void (o.updateWait = setTimeout(Ar, 2e3))
        );
      (o.started
        ? h("Updating to the newest version…", 4e3)
        : ((e("update-gate").hidden = !1),
          (e("update-gate-status").textContent =
            "Everyone plays online on the newest version: updating…")),
        yr());
    }
  }
  async function yr() {
    o.updating = !0;
    for (const t of ["update-gate-go", "update-banner-go"])
      ((e(t).disabled = !0), (e(t).textContent = "Updating…"));
    ((e("update-gate-status").textContent = "Downloading the new version…"),
      (e("update-gate-skip").hidden = !0));
    try {
      const e =
        navigator.serviceWorker.controller ||
        (await navigator.serviceWorker.getRegistration())?.active;
      if (!e) throw new Error("no service worker");
      e.postMessage("update");
    } catch {
      wr();
    }
  }
  function wr() {
    o.updating = !1;
    for (const t of ["update-gate-go", "update-banner-go"])
      ((e(t).disabled = !1), (e(t).textContent = "Try again"));
    ((e("update-gate-status").textContent =
      "The update couldn't be downloaded. Check your connection and try again."),
      (e("update-gate-skip").hidden = !1),
      o.started && h("The update could not be downloaded.", 5e3));
  }
  (async function () {
    (window.addEventListener("error", (e) => {
      c(`error: ${e.message} (${e.filename}:${e.lineno})`);
      const t = new RegExp(
        location.origin.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") +
          "/[^\\s:]*\\.(js|wasm)\\b",
      );
      (e.filename
        ? new URL(e.filename, location.href).origin === location.origin &&
          /\.(js|wasm)(\?|#|$)/.test(
            new URL(e.filename, location.href).pathname +
              new URL(e.filename, location.href).search,
          )
        : !(!e.error || !t.test(String(e.error.stack || "")))) &&
        ((!e.error && /^ResizeObserver loop/.test(e.message || "")) ||
          (o.started
            ? W(e.message || "An error stopped the game.")
            : D(
                "error",
                `${e.message} (${String(e.filename || "")
                  .split("/")
                  .pop()}:${e.lineno})`,
                {
                  stack:
                    e.error && e.error.stack
                      ? String(e.error.stack).slice(0, 4e3)
                      : "",
                },
              )));
    }),
      window.addEventListener("unhandledrejection", (e) => {
        c("unhandled: " + e.reason);
        const t = e.reason;
        t instanceof Error &&
          t.stack &&
          !/network|fetch|load failed|abort|notallowed|permission|server/i.test(
            `${t.name} ${t.message}`,
          ) &&
          D("error", `${t.name}: ${t.message}`, {
            stack: String(t.stack).slice(0, 4e3),
          });
      }),
      (function () {
        let e = null;
        try {
          e = JSON.parse(localStorage.getItem(C) || "null");
        } catch {
          e = null;
        }
        try {
          localStorage.removeItem(C);
        } catch {}
        if (e && !e.hidden && Date.now() - e.time < 6e5) {
          const t = e.game || {};
          D(
            "unexpected-close",
            `The app closed while playing${t.map ? " " + t.map : ""} (after ${Math.round((e.uptime || 0) / 6e4)} min)`,
            {
              now: !0,
              before: String(o.previousLog || "")
                .split("\n")
                .slice(-300),
              lastSession: e,
              build: e.build || "",
            },
          );
        }
        (setInterval(P, 4e3),
          window.addEventListener("pagehide", () => {
            try {
              localStorage.removeItem(C);
            } catch {}
          }),
          document.addEventListener("visibilitychange", P),
          setTimeout(O, 5e3));
      })(),
      window.addEventListener("resize", () => {
        o.shared && Qe();
      }),
      document.addEventListener("visibilitychange", Ke),
      (e("opt-touch").checked = a.touch),
      (e("opt-look").value = a.look),
      __lookVal("opt-look", a.look),
      (e("opt-lookf").value = a.lookFilter ?? 0),
      __lookVal("opt-lookf", a.lookFilter ?? 0),
      __gyroUI("opt", a, r),
      (e("opt-lookf").oninput = (t) => {
        ((a.lookFilter = parseFloat(t.target.value)),
          __lookVal("opt-lookf", a.lookFilter),
          r(),
          HaloInput.setLookFilter(a.lookFilter));
      }),
      (e("opt-vsync").checked = a.vsync),
      (e("opt-touch").onchange = (e) => {
        ((a.touch = e.target.checked), r());
      }),
      (e("edit-layout").onclick = (t) => {
        (t.preventDefault(), Le(e("opt-layout").value));
      }),
      (e("opt-layout").value = a.touchLayout),
      (e("opt-layout").onchange = (e) => {
        ((a.touchLayout = e.target.value), r());
      }),
      (e("opt-look").oninput = (e) => {
        ((a.look = parseFloat(e.target.value)),
          __lookVal("opt-look", a.look),
          r(),
          HaloInput.setLookSensitivity(a.look),
          HaloInput.setLookFilter(a.lookFilter ?? 0));
      }),
      (e("opt-vsync").onchange = (e) => {
        ((a.vsync = e.target.checked), r());
      }));
    for (const [t, o] of [
      ["opt-fps", "showFps"],
      ["opt-ping", "showPing"],
      ["opt-timing", "showTiming"],
    ])
      ((e(t).checked = !!a[o]),
        (e(t).onchange = (e) => {
          ((a[o] = e.target.checked), r(), Xe());
        }));
    ((e("opt-silent").checked = a.silentSound),
      (e("opt-silent").onchange = (e) => {
        ((a.silentSound = e.target.checked), r());
      }),
      (e("opt-small-textures").checked = a.smallTextures),
      (e("opt-small-textures").onchange = (e) => {
        ((a.smallTextures = e.target.checked),
          (a.smallTexturesChosen = !0),
          r());
      }));
    for (const t of ["opt-resolution", "menu-resolution"])
      ((e(t).value = a.resolution),
        (e(t).onchange = (t) => {
          ((a.resolution = t.target.value),
            (a.lowEnd = !1),
            (e("opt-resolution").value = e("menu-resolution").value =
              a.resolution),
            r(),
            o.shared && Qe(),
            c("resolution: " + a.resolution + " (" + ze() + " lines)"));
        }));
    ((e("opt-draw-path").value = a.drawPath || "auto"),
      (e("opt-draw-path").onchange = (e) => {
        ((a.drawPath = e.target.value),
          r(),
          c("drawing path: " + a.drawPath),
          h("The drawing path changes the next time the game starts."));
      }),
      (e("opt-fog").checked = !1 !== a.fog),
      (e("opt-fog").onchange = (e) => {
        ((a.fog = e.target.checked), r(), c("fog: " + (a.fog ? "on" : "off")));
      }),
      (e("opt-sharp-textures").checked = a.sharpTextures),
      (e("opt-sharp-textures").onchange = (e) => {
        ((a.sharpTextures = e.target.checked), r());
      }),
      (e("opt-gldebug").checked = a.glDebug),
      (e("opt-gldebug").onchange = (e) => {
        ((a.glDebug = e.target.checked), r());
      }),
      (e("iso-file").onchange = fe),
      Ae(),
      (e("play").onclick = rt),
      (e("export-saves").onclick = ke),
      (e("import-saves-file").onchange = Ce),
      (e("delete-data").onclick = Se));
    const t = async (t) => {
      ((o.logWhole = t),
        (e("log-text").textContent = t ? await m() : await u()),
        (e("log-whole").textContent = t
          ? "Show this run only"
          : "Show the whole log"),
        (e("log-view").hidden = !1));
    };
    ((e("show-log").onclick = () => t(!1)),
      (e("log-whole").onclick = () => t(!o.logWhole)),
      (e("log-close").onclick = () => {
        e("log-view").hidden = !0;
      }),
      (e("log-copy").onclick = async () => {
        try {
          (await navigator.clipboard.writeText(
            o.logWhole ? await m() : await u(),
          ),
            h("Copied."));
        } catch {
          h("Could not copy.");
        }
      }),
      (e("fatal-reload").onclick = () => location.reload()),
      (e("fatal-log").onclick = async () => {
        try {
          (await navigator.clipboard.writeText(await u()), h("Copied."));
        } catch {
          h("Could not copy.");
        }
      }));
    const n =
        navigator.standalone ||
        matchMedia("(display-mode: standalone)").matches ||
        matchMedia("(display-mode: fullscreen)").matches,
      s =
        /iPhone|iPad|iPod/.test(navigator.userAgent) ||
        ("MacIntel" === navigator.platform && navigator.maxTouchPoints > 1);
    e("install-hint").hidden = n || !s;
    const i = /Android/i.test(navigator.userAgent);
    ((e("install-android").hidden = n || !i),
      window.addEventListener("beforeinstallprompt", (t) => {
        (t.preventDefault(),
          (o.installPrompt = t),
          (e("install-android").hidden = n),
          (e("install-button").hidden = !1),
          (e("install-android-menu").hidden = !0));
      }),
      (e("install-button").onclick = async () => {
        if (!o.installPrompt) return;
        o.installPrompt.prompt();
        const t = await o.installPrompt.userChoice.catch(() => null);
        ((o.installPrompt = null),
          t && "accepted" === t.outcome && (e("install-android").hidden = !0));
      }),
      window.addEventListener("appinstalled", () => {
        e("install-android").hidden = !0;
      }),
      (function ({ standalone: t, ios: n, android: a }) {
        const r = e("welcome"),
          s = { ios: e("sheet-ios"), droid: e("sheet-droid") },
          i = (e) => {
            r.hidden = !1;
            for (const t in s) s[t].hidden = t !== e;
            r.classList.add("sheet-open");
          },
          c = () => {
            for (const e in s) s[e].hidden = !0;
            r.classList.remove("sheet-open");
          };
        for (const e in s)
          s[e].querySelector("[data-close]").onclick = () => {
            (c(), "launcher" === r.dataset.from && (r.hidden = !0));
          };
        for (const e of document.querySelectorAll(".guide-link"))
          e.onclick = (t) => {
            t.metaKey ||
              t.ctrlKey ||
              t.shiftKey ||
              1 === t.button ||
              (t.preventDefault(), En(e.href));
          };
        ((e("install-ios").onclick = () => i("ios")),
          (e("install-droid").onclick = async () => {
            if (o.installPrompt) {
              o.installPrompt.prompt();
              const t = await o.installPrompt.userChoice.catch(() => null);
              if (((o.installPrompt = null), t && "accepted" === t.outcome))
                return (
                  (e("install-android").hidden = !0),
                  void h(
                    "Installing. Open HCEMobile from your home screen.",
                    6e3,
                  )
                );
            }
            i("droid");
          }),
          (e("welcome-skip").onclick = () => {
            try {
              localStorage.setItem(qe, "1");
            } catch {}
            ((r.hidden = !0), c());
          }),
          (e("install-hint-how").onclick = () => {
            ((r.dataset.from = "launcher"), i("ios"));
          }),
          (e("install-android-how").onclick = () => {
            ((r.dataset.from = "launcher"), i("droid"));
          }),
          a
            ? e("install-droid").classList.add("primary")
            : e("install-ios").classList.add("primary"));
        const l = r.querySelector(".install-buttons");
        a && l.prepend(e("install-droid"));
        let d = !1;
        try {
          d = "1" === localStorage.getItem(qe);
        } catch {}
        ((r.hidden = t || d || !!window.__haloArgs),
          (r.dataset.from = "first"));
      })({ standalone: n, ios: s, android: i }),
      (async function () {
        try {
          const t = await navigator.storage.getDirectory(),
            n = await (await t.getFileHandle(Fe)).getFile();
          if (!n.size) return;
          o.hasBackdrop = !0;
          const a = URL.createObjectURL(n);
          ((e("backdrop").style.backgroundImage = `url("${a}")`),
            document.body.classList.add("has-backdrop"));
        } catch {}
      })(),
      (e("news-more").onclick = () => {
        ((p.showAll = !p.showAll), A());
      }),
      (e("mod-news-cancel").onclick = () => w(null)),
      (e("mod-news-form").onsubmit = async (t) => {
        t.preventDefault();
        const o = e("mod-news-title").value.trim(),
          n = e("mod-news-body").value.trim();
        if (o && n) {
          try {
            const e = { title: o, body: n };
            (p.editing && (e.id = p.editing),
              (p.posts = (await HaloAccount.postNews(e)).posts || []),
              Vo(
                p.editing
                  ? "Post updated."
                  : "Posted. It is at the top of the start page now.",
              ),
              w(null));
          } catch (e) {
            Vo(e.message, !0);
          }
          A();
        } else Vo("A post needs a headline and some text.", !0);
      }),
      document.addEventListener("visibilitychange", () => {
        document.hidden || o.started || y();
      }),
      y(),
      (function () {
        const t = e("controller-status"),
          n = () => {
            if (o.started) return;
            const e = HaloInput.connectedControllers();
            ((t.textContent = e.length
              ? `Controller ready: ${e.join(", ")}. It replaces the touch controls while connected.`
              : "Using a controller? Pair it (Bluetooth) or plug it in, then press any button on it."),
              t.classList.toggle("ready", e.length > 0));
          };
        (window.addEventListener("gamepadconnected", n),
          window.addEventListener("gamepaddisconnected", n),
          n(),
          setInterval(n, 1e3));
      })(),
      await (async function () {
        if (!("serviceWorker" in navigator)) return;
        try {
          await navigator.serviceWorker.register("sw.js");
        } catch (e) {
          return void c("service worker: " + e);
        }
        if (window.crossOriginIsolated) return;
        await navigator.serviceWorker.ready;
        let e = !1;
        try {
          e = "1" === sessionStorage.getItem("halo-web-isolation");
        } catch {}
        if (!e) {
          try {
            sessionStorage.setItem("halo-web-isolation", "1");
          } catch {}
          (location.reload(), await new Promise(() => {}));
        }
      })(),
      cr(),
      ct(),
      HaloCoop.configure({
        audio: () => ({ context: o.audio, node: o.audioNode }),
        splitViews: () =>
          o.shared
            ? Atomics.load(new Int32Array(o.memory.buffer), Ve("splitViews"))
            : 0,
      }),
      (e("coop-host").onchange = (e) => HaloCoop.setHosting(e.target.checked)),
      HaloCoop.on((t, o) => {
        if ("host" === t) mt();
        else if ("message" === t) h(o);
        else if ("friend" === t) {
          const t = e("coop-friend-status");
          "playing" === o.state
            ? (t.textContent =
                `Player 2 in ${o.host}'s game` +
                (void 0 !== o.rtt ? ` · ${o.rtt} ms` : ""))
            : ("failed" !== o.state && "ended" !== o.state) ||
              ((t.textContent = o.reason), h(o.reason, 6e3));
        }
      }),
      HaloNet.on((e, t) => {
        "coop-host" === e
          ? (t.coop
              ? o.coopHosts.set(t.id, {
                  name: t.name,
                  busy: t.coop.busy,
                  seen: Date.now(),
                })
              : o.coopHosts.delete(t.id),
            mt())
          : "status" !== e ||
            t.room ||
            (o.coopHosts.clear(),
            HaloCoop.hosting && HaloCoop.setHosting(!1),
            mt());
      }),
      setInterval(mt, 5e3),
      mt());
    const g = await F();
    if (((o.canRun = g), g)) {
      if (!e("checks").querySelector(".bad, .warn")) {
        const t = document.createElement("details");
        ((t.className = "checks-ok"),
          (t.innerHTML =
            "<summary>Ready: this device can run the game</summary>"));
        for (const o of [...e("checks").children]) t.appendChild(o);
        e("checks").appendChild(t);
      }
      (await le(),
        (async function () {
          try {
            const e = await fetch("shader-seed.txt");
            if (!e.ok) return;
            const t = await e.text(),
              o = await navigator.storage.getDirectory(),
              n = await o.getFileHandle("shader-seed.txt", { create: !0 }),
              a = await n.getFile();
            if (
              a.size === t.length &&
              (await a.slice(0, 256).text()) === t.slice(0, 256)
            )
              return;
            if (n.createWritable) {
              const e = await n.createWritable();
              (await e.write(t), await e.close());
            } else {
              const e =
                  "onmessage = async (e) => { try { const root = await navigator.storage.getDirectory();\n          const h = await root.getFileHandle('shader-seed.txt', { create: true }); const a = await h.createSyncAccessHandle();\n          const bytes = new TextEncoder().encode(e.data); a.truncate(0); a.write(bytes, { at: 0 }); a.flush(); a.close();\n          postMessage('ok'); } catch (error) { postMessage(String(error)); } };",
                o = URL.createObjectURL(
                  new Blob([e], { type: "text/javascript" }),
                ),
                n = new Worker(o),
                a = await new Promise((e) => {
                  ((n.onmessage = (t) => e(t.data)), n.postMessage(t));
                });
              if ((n.terminate(), URL.revokeObjectURL(o), "ok" !== a))
                throw new Error(a);
            }
            c(`shader seed: ${t.length} bytes in place`);
          } catch (e) {
            c("shader seed: " + e);
          }
        })());
      try {
        o.debugStart = (
          await (async function () {
            const e = await l(),
              t = d(e);
            if (t.length > 5 || e.length > 4e5) {
              let o = e.slice(t.length > 5 ? t[t.length - 5] : 0);
              o.length > 4e5 && (o = o.slice(-4e5));
              const n = ce();
              return (
                await de({
                  op: "write-files",
                  target: (n && n.path) || [],
                  files: [
                    { path: ["debug.txt"], bytes: new TextEncoder().encode(o) },
                  ],
                }).catch(() => {}),
                o
              );
            }
            return e;
          })()
        ).length;
      } catch {
        o.debugStart = 0;
      }
      (ir().catch((e) => c("lobby: " + e)),
        La(),
        Rn(),
        (e("update-gate-go").onclick = yr),
        (e("update-banner-go").onclick = yr),
        (e("update-banner-later").onclick = () => {
          e("update-banner").hidden = !0;
        }),
        HaloAccount.onOutdated(() => fr()),
        (e("update-gate-skip").onclick = () => {
          e("update-gate").hidden = !0;
        }),
        "serviceWorker" in navigator &&
          navigator.serviceWorker.addEventListener("message", (e) => {
            ("updated" === e.data && location.reload(),
              "update-failed" === e.data && wr());
          }),
        setInterval(fr, 6e4),
        document.addEventListener("visibilitychange", () => {
          document.hidden || fr();
        }),
        window.addEventListener("online", fr),
        fr());
    } else {
      if (window.isSecureContext) {
        const t = [...e("checks").querySelectorAll(".check.bad")].map(
          (e) => e.dataset.en || e.textContent,
        );
        c(
          `cannot run the game here (${o.memoryShort && 1 === t.length ? "low-memory" : "unsupported"}): ${t.join(" | ") || "the device"}`,
        );
      }
      ((e("iso-file").disabled = !0),
        e("add-label").classList.add("disabled"),
        (e("link-open").disabled = !0),
        e("add-label").removeAttribute("for"));
      try {
        La();
      } catch (e) {
        c("account: " + e);
      }
    }
  })().catch((e) => {
    (c("start: " + ((e && e.stack) || e)),
      U(!1, "The app couldn't start: " + e.message));
  });
})();
(function () {
  function C() {
    return window.__fpsCfg;
  }
  function A() {
    var f = document.getElementById("fps"),
      c = C();
    if (!f || !c) return;
    var a = c.get(),
      p = a.fpsPos;
    if (p && isFinite(p.x) && isFinite(p.y)) {
      f.style.left = (100 * p.x).toFixed(2) + "%";
      f.style.top = (100 * p.y).toFixed(2) + "%";
      f.style.right = "auto";
      f.style.bottom = "auto";
    }
    f.classList.toggle("fps-nobg", a.fpsBg === !1);
    var b = document.getElementById("menu-fps-bg");
    b && (b.checked = a.fpsBg !== !1);
  }
  function W() {
    var b = document.getElementById("menu-fps-bg");
    if (b && !b._w) {
      b._w = 1;
      b.onchange = function () {
        var c = C();
        if (!c) return;
        c.get().fpsBg = b.checked;
        c.save();
        A();
      };
    }
    var r = document.getElementById("menu-fps-reset");
    if (r && !r._w) {
      r._w = 1;
      r.onclick = function () {
        var c = C();
        if (!c) return;
        delete c.get().fpsPos;
        c.save();
        var f = document.getElementById("fps");
        f && (f.style.left = f.style.top = f.style.right = f.style.bottom = "");
        A();
      };
    }
  }
  var d = null;
  document.addEventListener(
    "pointerdown",
    function (e) {
      var f = document.getElementById("fps");
      if (
        !f ||
        !document.body.classList.contains("editing-layout") ||
        !f.contains(e.target)
      )
        return;
      var r = f.getBoundingClientRect();
      d = { id: e.pointerId, dx: e.clientX - r.left, dy: e.clientY - r.top };
      e.preventDefault();
      e.stopPropagation();
    },
    !0,
  );
  document.addEventListener(
    "pointermove",
    function (e) {
      if (!d || e.pointerId !== d.id) return;
      var f = document.getElementById("fps"),
        r = f.getBoundingClientRect(),
        W = innerWidth,
        H = innerHeight,
        x = Math.max(0, Math.min(W - r.width, e.clientX - d.dx)),
        y = Math.max(0, Math.min(H - r.height, e.clientY - d.dy));
      f.style.left = x + "px";
      f.style.top = y + "px";
      f.style.right = "auto";
      f.style.bottom = "auto";
      d.x = x / W;
      d.y = y / H;
      e.preventDefault();
      e.stopPropagation();
    },
    !0,
  );
  function U(e) {
    if (!d || e.pointerId !== d.id) return;
    var c = C();
    if (c && d.x != null) {
      c.get().fpsPos = { x: d.x, y: d.y };
      c.save();
    }
    d = null;
    A();
  }
  document.addEventListener("pointerup", U, !0);
  document.addEventListener("pointercancel", U, !0);
  new MutationObserver(function () {
    var f = document.getElementById("fps");
    if (!f) return;
    var ed = document.body.classList.contains("editing-layout");
    f.classList.toggle("fps-editing", ed);
  }).observe(document.body, { attributes: !0, attributeFilter: ["class"] });
  var n = 0,
    t = setInterval(function () {
      W();
      if (C()) {
        A();
        if (++n > 3) clearInterval(t);
      }
    }, 500);
  addEventListener("resize", A);
})();
window.__ueUnify = function () {
  try {
    var L = document.getElementById("layout-editor"),
      H = document.getElementById("hud-editor");
    var cb =
        L &&
        L.querySelector(".editor-bar:not(.element-panel):not(.hud-editor-bar)"),
      hb = H && H.querySelector(".hud-editor-bar");
    if (!cb || !hb) return null;
    var tools = cb.querySelector(".editor-tools"),
      title = cb.querySelector(".editor-title");
    var sec = document.createElement("div");
    sec.className = "ue-hud";
    var nm = hb.querySelector("[data-name]"),
      sz = hb.querySelector("[data-size]"),
      row = sz && sz.closest(".editor-row"),
      rs = hb.querySelector("[data-reset]");
    nm && sec.appendChild(nm);
    row && sec.appendChild(row);
    if (rs) {
      rs.textContent = "Reset HUD";
      rs.classList.add("ue-hud-reset");
      sec.appendChild(rs);
    }
    tools.insertBefore(sec, tools.firstChild);
    hb.style.display = "none";
    var ph = document.createComment("ue");
    cb.parentNode.insertBefore(ph, cb);
    document.body.appendChild(cb);
    cb.classList.add("ue-panel");
    var setHud = function (on, piece) {
      cb.classList.toggle("ue-hud-mode", on);
      if (on) {
        L.querySelectorAll(".editing").forEach(function (x) {
          x.classList.remove("editing");
        });
        var n = piece && piece.querySelector(".hud-piece-name");
        title && (title.textContent = "HUD · " + (n ? n.textContent : ""));
      } else
        H.querySelectorAll(".hud-piece.editing").forEach(function (x) {
          x.classList.remove("editing");
        });
    };
    var pd = function (ev) {
      var t = ev.target;
      if (!t || !t.closest || cb.contains(t)) return;
      var hp = t.closest("#hud-editor .hud-piece");
      if (hp) {
        setHud(!0, hp);
        return;
      }
      if (
        t.closest("#layout-editor [data-control]") ||
        t.closest("#layout-editor .touch-stick")
      )
        setHud(!1);
    };
    document.addEventListener("pointerdown", pd, !0);
    return function () {
      document.removeEventListener("pointerdown", pd, !0);
      cb.classList.remove("ue-panel", "ue-hud-mode");
      if (ph.parentNode) (ph.parentNode.insertBefore(cb, ph), ph.remove());
      else cb.remove();
    };
  } catch (e) {
    console.warn("ueUnify", e);
    return null;
  }
};
