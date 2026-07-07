/* ============================================================
   NEONDECK Charts — v1.0.0
   Tiny dependency-free SVG charts tuned for the NEONDECK theme.
   Usage: give an element [data-nd-chart] and call NDCharts.render()
   (auto-runs on DOMContentLoaded). See README for options.
   ============================================================ */
(function (global) {
  "use strict";

  var NS = "http://www.w3.org/2000/svg";
  var uid = 0;

  function el(name, attrs, parent) {
    var node = document.createElementNS(NS, name);
    for (var k in attrs) node.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(node);
    return node;
  }

  function scale(values, min, max, size, invert) {
    var span = max - min || 1;
    return values.map(function (v) {
      var t = (v - min) / span;
      return invert ? size - t * size : t * size;
    });
  }

  function smoothPath(xs, ys) {
    // Catmull-Rom → cubic bezier for a smooth neon line
    var d = "M" + xs[0] + "," + ys[0];
    for (var i = 0; i < xs.length - 1; i++) {
      var x0 = xs[i > 0 ? i - 1 : i], y0 = ys[i > 0 ? i - 1 : i];
      var x1 = xs[i], y1 = ys[i];
      var x2 = xs[i + 1], y2 = ys[i + 1];
      var x3 = xs[i + 2 < xs.length ? i + 2 : i + 1], y3 = ys[i + 2 < ys.length ? i + 2 : i + 1];
      var c1x = x1 + (x2 - x0) / 6, c1y = y1 + (y2 - y0) / 6;
      var c2x = x2 - (x3 - x1) / 6, c2y = y2 - (y3 - y1) / 6;
      d += "C" + c1x + "," + c1y + " " + c2x + "," + c2y + " " + x2 + "," + y2;
    }
    return d;
  }

  function parseSeries(host) {
    try { return JSON.parse(host.getAttribute("data-values")); }
    catch (e) { return []; }
  }

  /* ---------- Line / area chart ---------- */
  function lineChart(host) {
    var series = parseSeries(host);            // [[..],[..]] or [..]
    if (typeof series[0] === "number") series = [series];
    var labels = (host.getAttribute("data-labels") || "").split(",").filter(Boolean);
    var colors = (host.getAttribute("data-colors") || "#00f3ff,#ff00ff").split(",");
    var W = host.clientWidth || 600, H = host.clientHeight || 240;
    var pad = { t: 12, r: 12, b: labels.length ? 26 : 12, l: 40 };
    var iw = W - pad.l - pad.r, ih = H - pad.t - pad.b;

    var all = [].concat.apply([], series);
    var min = Math.min.apply(null, all), max = Math.max.apply(null, all);
    var head = (max - min || 1) * 0.12; max += head; min = Math.max(0, min - head);

    var svg = el("svg", { viewBox: "0 0 " + W + " " + H, width: "100%", height: "100%" });
    var defs = el("defs", {}, svg);
    var id = "nd" + (++uid);

    // glow filter
    var f = el("filter", { id: id + "-glow", x: "-40%", y: "-40%", width: "180%", height: "180%" }, defs);
    el("feGaussianBlur", { stdDeviation: 3.2, result: "b" }, f);
    var m = el("feMerge", {}, f);
    el("feMergeNode", { in: "b" }, m);
    el("feMergeNode", { in: "SourceGraphic" }, m);

    // gridlines + y labels (precision adapts so labels stay distinct on narrow ranges)
    var step = (max - min) / 4;
    for (var g = 0; g <= 4; g++) {
      var gy = pad.t + (ih / 4) * g;
      el("line", { x1: pad.l, x2: W - pad.r, y1: gy, y2: gy, stroke: "rgba(140,150,190,0.12)", "stroke-dasharray": "3 5" }, svg);
      var val = max - step * g;
      var label;
      if (val >= 1000) label = (val / 1000).toFixed(step < 250 ? 2 : 1) + "k";
      else if (step < 1) label = val.toFixed(1);
      else label = String(Math.round(val));
      el("text", { x: pad.l - 8, y: gy + 4, "text-anchor": "end", fill: "#5c6178", "font-size": 10, "font-family": "IBM Plex Mono, monospace" }, svg)
        .textContent = label;
    }
    // x labels
    labels.forEach(function (lab, i) {
      var lx = pad.l + (iw / (labels.length - 1 || 1)) * i;
      el("text", { x: lx, y: H - 8, "text-anchor": "middle", fill: "#5c6178", "font-size": 10, "font-family": "IBM Plex Mono, monospace" }, svg)
        .textContent = lab.trim();
    });

    series.forEach(function (vals, si) {
      var color = (colors[si] || colors[0]).trim();
      var xs = vals.map(function (_, i) { return pad.l + (iw / (vals.length - 1 || 1)) * i; });
      var ys = scale(vals, min, max, ih, true).map(function (y) { return y + pad.t; });
      var d = smoothPath(xs, ys);

      // area fill (first series only)
      if (si === 0) {
        var grad = el("linearGradient", { id: id + "-area", x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
        el("stop", { offset: "0%", "stop-color": color, "stop-opacity": 0.28 }, grad);
        el("stop", { offset: "100%", "stop-color": color, "stop-opacity": 0 }, grad);
        el("path", { d: d + "L" + xs[xs.length - 1] + "," + (pad.t + ih) + "L" + xs[0] + "," + (pad.t + ih) + "Z", fill: "url(#" + id + "-area)" }, svg);
      }
      var path = el("path", { d: d, fill: "none", stroke: color, "stroke-width": 2.2, "stroke-linecap": "round", filter: "url(#" + id + "-glow)" }, svg);

      // draw-in animation (skipped for live re-renders, e.g. the Pulse Engine)
      if (!host.hasAttribute("data-nd-noanim")) {
        var len = path.getTotalLength();
        path.style.strokeDasharray = len;
        path.style.strokeDashoffset = len;
        path.style.transition = "stroke-dashoffset 1.4s cubic-bezier(.3,.7,.2,1) " + (si * 0.2) + "s";
        requestAnimationFrame(function () { requestAnimationFrame(function () { path.style.strokeDashoffset = 0; }); });
      }

      // end-point dot
      el("circle", { cx: xs[xs.length - 1], cy: ys[ys.length - 1], r: 3.5, fill: color, filter: "url(#" + id + "-glow)" }, svg);
    });

    host.appendChild(svg);
  }

  /* ---------- Sparkline ---------- */
  function sparkline(host) {
    var vals = parseSeries(host);
    var color = host.getAttribute("data-color") || "#00f3ff";
    var W = host.clientWidth || 120, H = host.clientHeight || 36;
    var min = Math.min.apply(null, vals), max = Math.max.apply(null, vals);
    var xs = vals.map(function (_, i) { return 2 + ((W - 4) / (vals.length - 1 || 1)) * i; });
    var ys = scale(vals, min, max, H - 8, true).map(function (y) { return y + 4; });
    var svg = el("svg", { viewBox: "0 0 " + W + " " + H, width: "100%", height: "100%" });
    el("path", { d: smoothPath(xs, ys), fill: "none", stroke: color, "stroke-width": 1.8, "stroke-linecap": "round", opacity: 0.95 }, svg);
    el("circle", { cx: xs[xs.length - 1], cy: ys[ys.length - 1], r: 2.6, fill: color }, svg);
    host.appendChild(svg);
  }

  /* ---------- Donut ---------- */
  function donut(host) {
    var vals = parseSeries(host);              // [{label,value,color}, ...]
    var size = Math.min(host.clientWidth || 180, host.clientHeight || 180);
    var cx = size / 2, cy = size / 2, r = size / 2 - 10, sw = 13;
    var total = vals.reduce(function (s, d) { return s + d.value; }, 0) || 1;
    var svg = el("svg", { viewBox: "0 0 " + size + " " + size, width: "100%", height: "100%" });
    var circ = 2 * Math.PI * r, offset = circ * 0.25; // start at 12 o'clock
    el("circle", { cx: cx, cy: cy, r: r, fill: "none", stroke: "rgba(140,150,190,0.1)", "stroke-width": sw }, svg);
    vals.forEach(function (d) {
      var frac = d.value / total;
      var seg = el("circle", {
        cx: cx, cy: cy, r: r, fill: "none", stroke: d.color, "stroke-width": sw,
        "stroke-dasharray": (circ * frac - 2) + " " + (circ - circ * frac + 2),
        "stroke-dashoffset": offset, "stroke-linecap": "butt",
        style: "filter: drop-shadow(0 0 5px " + d.color + "66)"
      }, svg);
      offset -= circ * frac;
    });
    var center = host.getAttribute("data-center");
    if (center) {
      var t = el("text", { x: cx, y: cy - 2, "text-anchor": "middle", fill: "#e8eaf6", "font-size": size / 7, "font-weight": 600, "font-family": "IBM Plex Mono, monospace" }, svg);
      t.textContent = center;
      var sub = host.getAttribute("data-center-sub");
      if (sub) {
        el("text", { x: cx, y: cy + size / 9, "text-anchor": "middle", fill: "#5c6178", "font-size": size / 16, "font-family": "IBM Plex Mono, monospace" }, svg).textContent = sub;
      }
    }
    host.appendChild(svg);
  }

  /* ---------- Bars ---------- */
  function bars(host) {
    var vals = parseSeries(host);
    var labels = (host.getAttribute("data-labels") || "").split(",").filter(Boolean);
    var colors = (host.getAttribute("data-colors") || "#00f3ff,#7b5cff,#ff00ff").split(",");
    var W = host.clientWidth || 600, H = host.clientHeight || 220;
    var pad = { t: 10, r: 8, b: labels.length ? 24 : 8, l: 8 };
    var iw = W - pad.l - pad.r, ih = H - pad.t - pad.b;
    var max = Math.max.apply(null, vals) * 1.1 || 1;
    var bw = Math.min(26, (iw / vals.length) * 0.55);
    var svg = el("svg", { viewBox: "0 0 " + W + " " + H, width: "100%", height: "100%" });
    vals.forEach(function (v, i) {
      var x = pad.l + (iw / vals.length) * (i + 0.5) - bw / 2;
      var h = (v / max) * ih;
      var color = colors[i % colors.length].trim();
      var bar = el("rect", { x: x, y: pad.t + ih - h, width: bw, height: h, rx: 4, fill: color, opacity: 0.85, style: "filter: drop-shadow(0 0 6px " + color + "55)" }, svg);
      bar.style.transformOrigin = "50% 100%";
      bar.style.transform = "scaleY(0)";
      bar.style.transition = "transform .7s cubic-bezier(.3,.7,.2,1) " + i * 0.05 + "s";
      requestAnimationFrame(function () { requestAnimationFrame(function () { bar.style.transform = "scaleY(1)"; }); });
      if (labels[i]) {
        el("text", { x: x + bw / 2, y: H - 6, "text-anchor": "middle", fill: "#5c6178", "font-size": 10, "font-family": "IBM Plex Mono, monospace" }, svg).textContent = labels[i].trim();
      }
    });
    host.appendChild(svg);
  }

  var renderers = { line: lineChart, sparkline: sparkline, donut: donut, bars: bars };

  var NDCharts = {
    render: function (root) {
      (root || document).querySelectorAll("[data-nd-chart]").forEach(function (host) {
        if (host.dataset.ndRendered) return;
        host.dataset.ndRendered = "1";
        var type = host.getAttribute("data-nd-chart");
        if (renderers[type]) renderers[type](host);
      });
    }
  };

  global.NDCharts = NDCharts;
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { NDCharts.render(); });
  } else {
    NDCharts.render();
  }
})(window);
