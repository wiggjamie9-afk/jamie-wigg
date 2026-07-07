/* ============================================================
   NEONDECK Data Binder — v1.1.0
   Connects templates to the local API server (server/server.js).

   How it works:
   - <body data-nd-api="analytics"> tells this script to fetch
     /api/analytics on load.
   - [data-api-text="stats.sessions"]   → textContent from JSON
   - [data-api-series="charts.throughput"] on a [data-nd-chart]
     element → chart re-renders with the server's values
   - [data-api-feed="events"] on a .nd-terminal → event lines
     stream in one at a time
   - <form data-api-login data-redirect="..."> → real POST to
     /api/login; stores the token; redirects on success.

   No server running (e.g. files opened directly, or the static
   demo on GitHub Pages)? Every fetch fails silently and the
   built-in sample data in the HTML stays — pages always work.
   ============================================================ */
(function () {
  "use strict";

  function get(obj, dotted) {
    return dotted.split(".").reduce(function (o, k) { return o && o[k]; }, obj);
  }

  function bindData(root, data) {
    // Text bindings
    root.querySelectorAll("[data-api-text]").forEach(function (el) {
      var v = get(data, el.getAttribute("data-api-text"));
      if (v !== undefined && v !== null) el.textContent = v;
    });

    // Chart bindings
    var dirty = false;
    root.querySelectorAll("[data-api-series]").forEach(function (el) {
      var s = get(data, el.getAttribute("data-api-series"));
      if (!s || !s.values) return;
      el.setAttribute("data-values", JSON.stringify(s.values));
      if (s.labels) el.setAttribute("data-labels", s.labels);
      if (s.colors) el.setAttribute("data-colors", s.colors);
      if (s.center) el.setAttribute("data-center", s.center);
      delete el.dataset.ndRendered;
      el.innerHTML = "";
      dirty = true;
    });
    if (dirty && window.NDCharts) window.NDCharts.render(root);

    // Terminal feeds: stream lines in, newest first, looping
    root.querySelectorAll("[data-api-feed]").forEach(function (term) {
      var events = get(data, term.getAttribute("data-api-feed"));
      if (!Array.isArray(events) || !events.length) return;
      var icons = { ok: "✓", info: "ℹ", warn: "⚠", err: "✗" };
      term.innerHTML = "";
      var i = 0;
      function push() {
        var e = events[i % events.length];
        var line = document.createElement("div");
        line.innerHTML =
          '<span class="t-time">' + e.time + "</span>" +
          '<span class="t-' + (e.kind || "info") + '">' + (icons[e.kind] || "ℹ") + " " + e.tag + "</span> " +
          e.text;
        term.insertBefore(line, term.firstChild);
        while (term.children.length > 24) term.removeChild(term.lastChild);
        i++;
      }
      for (var k = 0; k < Math.min(8, events.length); k++) push();
      setInterval(push, 3000);
    });
  }

  function initDashboard() {
    var key = document.body.getAttribute("data-nd-api");
    if (!key) return;
    fetch("/api/" + key)
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (data) {
        bindData(document, data);
        document.documentElement.setAttribute("data-nd-live", "1");
      })
      .catch(function () { /* no server → keep built-in sample data */ });
  }

  function initLogin() {
    var form = document.querySelector("form[data-api-login]");
    if (!form) return;
    var msg = form.querySelector("[data-api-message]");
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var email = (form.querySelector('input[type="email"]') || {}).value || "";
      var password = (form.querySelector('input[type="password"]') || {}).value || "";
      if (msg) { msg.textContent = "AUTHENTICATING…"; msg.style.color = "var(--nd-cyan)"; }
      fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, password: password })
      })
        .then(function (r) { return r.json().then(function (b) { return { ok: r.ok, body: b }; }); })
        .then(function (res) {
          if (res.ok && res.body.token) {
            localStorage.setItem("nd_token", res.body.token);
            localStorage.setItem("nd_email", res.body.email);
            if (msg) { msg.textContent = "ACCESS GRANTED — REDIRECTING…"; msg.style.color = "var(--nd-acid)"; }
            setTimeout(function () {
              window.location.href = form.getAttribute("data-redirect") || "analytics.html";
            }, 700);
          } else {
            if (msg) { msg.textContent = (res.body && res.body.error) || "Access denied"; msg.style.color = "var(--nd-red)"; }
          }
        })
        .catch(function () {
          if (msg) {
            msg.textContent = "No server running — start it with: node server/server.js";
            msg.style.color = "var(--nd-amber)";
          }
        });
    });
  }

  function boot() { initDashboard(); initLogin(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
