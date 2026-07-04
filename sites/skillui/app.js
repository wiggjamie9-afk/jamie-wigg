/* =========================================================================
   SkillUI — MindBlow Media
   Shared behaviour: consent-dismiss demo + scroll reveal + header state.
   Vanilla JS, no dependencies. Localises demo strings from <html lang>.
   ========================================================================= */
(function () {
  "use strict";

  var LANG = (document.documentElement.lang || "en").slice(0, 2);
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Localised strings for the demo status toast ------------------- */
  var STR = {
    en: {
      load:    "Loading serenity-spa.example.com",
      detect:  "Consent wall detected",
      dismiss: "Dismissing cookie banner…",
      cleared: "Consent cleared",
      scan:    "Extracting design system…",
      done:    "Design system ready",
    },
    de: {
      load:    "Lade serenity-spa.example.com",
      detect:  "Consent-Wand erkannt",
      dismiss: "Cookie-Banner wird geschlossen…",
      cleared: "Zustimmung entfernt",
      scan:    "Design-System wird extrahiert…",
      done:    "Design-System bereit",
    },
  };
  var t = STR[LANG] || STR.en;

  /* ---- Icons for the toast ------------------------------------------- */
  var IC_SPIN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M21 12a9 9 0 1 1-6.2-8.6"/></svg>';
  var IC_CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';

  /* ================= Demo state machine ============================== */
  var stage   = document.getElementById("stage");
  if (stage) {
    var cookie  = document.getElementById("cookie");
    var accept  = document.getElementById("acceptBtn");
    var cursor  = document.getElementById("cursor");
    var scan    = document.getElementById("scan");
    var toast   = document.getElementById("toast");
    var toastIc = document.getElementById("toastIc");
    var toastTx = document.getElementById("toastText");
    var extract = document.getElementById("extract");
    var steps   = document.getElementById("steps").children;
    var groups  = extract.querySelectorAll(".ex-group");
    var replay  = document.getElementById("replay");

    var timers = [];
    var running = false;

    function after(ms, fn) { timers.push(setTimeout(fn, ms)); }
    function clearAll() { timers.forEach(clearTimeout); timers = []; }

    function say(text, working) {
      toastTx.textContent = text;
      toastIc.innerHTML = working ? IC_SPIN : IC_CHECK;
      toast.classList.toggle("working", !!working);
      toast.classList.add("show");
    }
    function hideToast() { toast.classList.remove("show"); }

    function setStep(i) {
      for (var k = 0; k < steps.length; k++) steps[k].classList.toggle("on", k <= i);
    }

    function moveCursor(el) {
      var s = stage.getBoundingClientRect();
      var b = el.getBoundingClientRect();
      cursor.style.left = (b.left - s.left + b.width / 2) + "px";
      cursor.style.top  = (b.top  - s.top  + b.height / 2) + "px";
    }

    function reset() {
      clearAll();
      cookie.className = "cookie";
      cursor.className = "cursor";
      scan.className = "scan";
      extract.className = "extract";
      accept.classList.remove("targeted");
      stage.classList.remove("scanning");
      groups.forEach(function (g) { g.classList.remove("in"); });
      hideToast();
      setStep(-1);
    }

    /* Static "finished" state for reduced-motion users. */
    function showStatic() {
      cookie.classList.add("out");
      extract.classList.add("in");
      groups.forEach(function (g) { g.classList.add("in"); });
      say(t.done, false);
      setStep(3);
    }

    function play() {
      if (reduce) { reset(); showStatic(); return; }
      reset();
      running = true;

      // 1 — load
      say(t.load, true); setStep(0);

      // 2 — cookie wall appears + detected
      after(900,  function () { cookie.classList.add("in"); });
      after(1500, function () { say(t.detect, false); setStep(1); });

      // 3 — SkillUI moves in and dismisses it
      after(2100, function () {
        cursor.classList.add("show");
        moveCursor(accept);
        say(t.dismiss, true);
      });
      after(2900, function () { accept.classList.add("targeted"); });
      after(3200, function () { cursor.classList.add("click"); });
      after(3450, function () {
        cursor.classList.remove("click");
        cookie.classList.remove("in");
        cookie.classList.add("out");
        accept.classList.remove("targeted");
      });
      after(3800, function () { cursor.classList.remove("show"); say(t.cleared, false); setStep(2); });

      // 4 — scan + extract
      after(4500, function () {
        stage.classList.add("scanning");
        scan.classList.add("run");
        say(t.scan, true);
      });
      after(5200, function () { extract.classList.add("in"); });
      groups.forEach(function (g, i) {
        after(5500 + i * 450, function () { g.classList.add("in"); });
      });
      after(6100, function () { stage.classList.remove("scanning"); });
      after(7400, function () { say(t.done, false); setStep(3); running = false; });

      // loop
      after(11000, play);
    }

    if (replay) replay.addEventListener("click", play);

    // Start when the demo scrolls into view (once), or immediately if already visible.
    if ("IntersectionObserver" in window) {
      var started = false;
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting && !started) { started = true; play(); io.disconnect(); }
        });
      }, { threshold: 0.35 });
      io.observe(stage);
    } else {
      play();
    }

    // Pause the loop when the tab is hidden; restart cleanly when back.
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) { clearAll(); }
      else if (!reduce) { play(); }
    });
  }

  /* ================= Scroll reveal =================================== */
  var reveals = document.querySelectorAll(".reveal");
  if (reveals.length) {
    if (reduce || !("IntersectionObserver" in window)) {
      reveals.forEach(function (el) { el.classList.add("in"); });
    } else {
      var ro = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add("in"); ro.unobserve(e.target); }
        });
      }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
      reveals.forEach(function (el) { ro.observe(el); });
    }
  }

  /* ================= Header shadow on scroll ========================= */
  var header = document.getElementById("siteHeader");
  if (header) {
    var onScroll = function () { header.classList.toggle("is-stuck", window.scrollY > 8); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }
})();
