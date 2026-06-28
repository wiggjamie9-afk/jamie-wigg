/* HerdCheck — Co-op Dashboard
 * Staff-facing aggregate view. Calls the herd Worker (api.md) and falls back
 * to an in-file demo dataset for verification + sales demos.
 *
 * Endpoints (see specs/herdcheck/api.md):
 *   GET  /api/herd/summary?days=7        -> SummaryResponse
 *   POST /api/herd/flag/:id/ack          -> { ok: true }
 *   GET  /api/herd/export.csv?memberId=  -> text/csv
 */
(function () {
  'use strict';

  var DEFAULT_BASE = 'https://herd.studio.starlightmix.com';
  var LS_TOKEN = 'hc_coop_token';
  var LS_BASE = 'hc_coop_base';

  // ---- App state ----
  var state = {
    token: '',
    base: DEFAULT_BASE,
    days: 7,
    memberFilter: '',
    demo: false,
    summary: null
  };

  // ---- Element refs ----
  var $ = function (id) { return document.getElementById(id); };
  var el = {
    connForm: $('connForm'), tokenInput: $('tokenInput'), baseInput: $('baseInput'),
    connectBtn: $('connectBtn'), demoBtn: $('demoBtn'), connHint: $('connHint'),
    banner: $('banner'), dash: $('dash'),
    orgName: $('orgName'), orgMeta: $('orgMeta'), validationBadge: $('validationBadge'),
    memberFilter: $('memberFilter'), refreshBtn: $('refreshBtn'),
    exportOrgBtn: $('exportOrgBtn'),
    tiles: $('tiles'), byKind: $('byKind'),
    membersBody: $('membersBody'), membersEmpty: $('membersEmpty'), membersTable: $('membersTable'),
    flagList: $('flagList'), flagsEmpty: $('flagsEmpty'), flagCount: $('flagCount')
  };

  // ---- Helpers ----
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function fmtWhen(iso) {
    if (!iso) return '—';
    var d = new Date(iso);
    if (isNaN(d)) return esc(iso);
    var diff = Date.now() - d.getTime();
    var day = 86400000;
    if (diff < 0) return d.toLocaleDateString();
    if (diff < 3600000) return Math.max(1, Math.round(diff / 60000)) + ' min ago';
    if (diff < day) return Math.round(diff / 3600000) + ' h ago';
    if (diff < 7 * day) return Math.round(diff / day) + ' d ago';
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  }
  function fmtDate(iso) {
    if (!iso) return '—';
    var d = new Date(iso);
    return isNaN(d) ? esc(iso) : d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  }
  function baseUrl() {
    return (state.base || DEFAULT_BASE).replace(/\/+$/, '');
  }

  function showBanner(kind, html) {
    el.banner.className = 'banner ' + kind;
    el.banner.innerHTML = html;
    el.banner.hidden = false;
  }
  function clearBanner() { el.banner.hidden = true; }

  var ICON = {
    info: '<svg class="b-ic" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v4h1"/></svg>',
    warn: '<svg class="b-ic" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/></svg>',
    check: '<svg class="b-ic" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>'
  };

  // ============================================================
  //  Networking
  // ============================================================
  function fetchSummary(token, days) {
    var url = baseUrl() + '/api/herd/summary?days=' + encodeURIComponent(days);
    return fetch(url, {
      headers: { 'Authorization': 'Bearer ' + token, 'Accept': 'application/json' },
      cache: 'no-store'
    }).then(function (res) {
      if (res.status === 401) { var e = new Error('unauthorized'); e.code = 401; throw e; }
      if (res.status === 503) { var e3 = new Error('unavailable'); e3.code = 503; throw e3; }
      if (!res.ok) { var e2 = new Error('http ' + res.status); e2.code = res.status; throw e2; }
      return res.json();
    });
  }

  function ackFlagRemote(flagId) {
    var url = baseUrl() + '/api/herd/flag/' + encodeURIComponent(flagId) + '/ack';
    return fetch(url, {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + state.token, 'Accept': 'application/json' }
    }).then(function (res) {
      if (!res.ok) throw new Error('ack http ' + res.status);
      return res.json();
    });
  }

  // ============================================================
  //  Load flow
  // ============================================================
  function loadLive() {
    state.demo = false;
    el.connectBtn.disabled = true;
    el.connectBtn.textContent = 'Loading…';
    fetchSummary(state.token, state.days)
      .then(function (data) {
        state.summary = data;
        try { localStorage.setItem(LS_TOKEN, state.token); localStorage.setItem(LS_BASE, state.base); } catch (e) {}
        showBanner('ok', ICON.check + 'Connected to ' + esc(baseUrl()) + ' — live data.');
        render();
      })
      .catch(function (err) {
        if (err.code === 401) {
          showBanner('error', ICON.warn + '<b>Token rejected (401).</b> Check the staff token for this org and try again. Showing demo data so you can still explore.');
        } else if (err.code === 503) {
          showBanner('error', ICON.warn + '<b>Backend unreachable (503).</b> The herd Worker is down or unreachable — showing demo data; live data will load when it recovers.');
        } else {
          showBanner('error', ICON.warn + '<b>Could not reach the dashboard backend</b> (' + esc(err.message) + '). Showing demo data instead.');
        }
        loadDemo(true);
      })
      .then(function () {
        el.connectBtn.disabled = false;
        el.connectBtn.textContent = 'Load dashboard';
      });
  }

  function loadDemo(keepBanner) {
    state.demo = true;
    state.summary = buildDemo(state.days, state.memberFilter);
    if (!keepBanner) {
      showBanner('demo', ICON.warn + '<b>Demo mode.</b> Sample co-op data — not live. Acknowledge &amp; export work locally. Paste a staff token above for live data.');
    }
    render();
  }

  // ============================================================
  //  Render
  // ============================================================
  function render() {
    var s = state.summary;
    if (!s) return;
    el.dash.hidden = false;

    // Org header + validation badge (R10)
    el.orgName.textContent = (s.org && s.org.name) || 'Organisation';
    el.orgMeta.textContent = 'Across all member herds in this deployment'
      + (state.demo ? ' · sample data' : '') + '.';
    renderValidation(s.org || {});

    // Day-window segmented control
    var segs = document.querySelectorAll('.seg-btn');
    for (var i = 0; i < segs.length; i++) {
      segs[i].classList.toggle('active', Number(segs[i].dataset.days) === state.days);
    }

    renderTiles(s.totals || {});
    renderByKind(s.byKind || {});
    renderMembers(s.members || []);
    renderMemberFilter(s.members || []);
    renderFlags(s.flags || []);
  }

  function renderValidation(org) {
    var b = el.validationBadge;
    if (org.validated) {
      b.className = 'vbadge validated';
      b.innerHTML = '<span class="vdot"></span> Scoring validated'
        + (org.validatedBy ? ' by ' + esc(org.validatedBy) : '')
        + (org.validatedAt ? ' · ' + fmtDate(org.validatedAt) : '');
    } else {
      b.className = 'vbadge pending';
      b.innerHTML = '<span class="vdot"></span> Validation pending — no clinical claims until a partner signs off';
    }
  }

  function renderTiles(t) {
    var defs = [
      { key: 'animals', cls: 'total', label: 'Animals screened', dot: '' },
      { key: 'red', cls: 'red', label: 'Red', dot: 'red' },
      { key: 'amber', cls: 'amber', label: 'Amber', dot: 'amber' },
      { key: 'green', cls: 'green', label: 'Green', dot: 'green' },
      { key: 'gray', cls: 'gray', label: 'No data', dot: 'gray' }
    ];
    el.tiles.innerHTML = defs.map(function (d) {
      var n = (t[d.key] != null) ? t[d.key] : 0;
      var dot = d.dot ? '<span class="tdot ' + d.dot + '"></span>' : '';
      var bar = d.cls === 'total' ? '' : '<span class="t-bar"></span>';
      return '<div class="tile ' + d.cls + '">' + bar
        + '<div class="t-num">' + n + '</div>'
        + '<div class="t-lbl">' + dot + esc(d.label) + '</div></div>';
    }).join('');
  }

  function renderByKind(bk) {
    var kinds = ['lameness', 'mastitis', 'calving'];
    var rows = kinds.map(function (k) {
      var v = bk[k] || { red: 0, amber: 0, green: 0 };
      var r = v.red || 0, a = v.amber || 0, g = v.green || 0;
      var total = r + a + g;
      var pct = function (x) { return total ? (x / total * 100) : 0; };
      var seg = function (cls, x) { return x ? '<div class="kind-seg ' + cls + '" style="width:' + pct(x).toFixed(2) + '%"></div>' : ''; };
      var bar = total
        ? '<div class="kind-bar">' + seg('red', r) + seg('amber', a) + seg('green', g) + '</div>'
        : '<div class="kind-bar"></div>';
      return '<div class="kind-row">'
        + '<div class="kind-top"><span class="kind-name">' + esc(k) + '</span>'
        + '<span class="kind-total">' + total + ' animal' + (total === 1 ? '' : 's') + '</span></div>'
        + bar
        + '<div class="kind-legend">'
        + '<span><span class="tdot red"></span><b>' + r + '</b> red</span>'
        + '<span><span class="tdot amber"></span><b>' + a + '</b> amber</span>'
        + '<span><span class="tdot green"></span><b>' + g + '</b> green</span>'
        + '</div></div>';
    });
    el.byKind.innerHTML = rows.join('');
  }

  function renderMembers(members) {
    var empty = !members.length;
    el.membersEmpty.hidden = !empty;
    el.membersTable.style.display = empty ? 'none' : '';
    if (empty) { el.membersBody.innerHTML = ''; return; }
    el.membersBody.innerHTML = members.map(function (m) {
      var cell = function (v, cls) {
        return '<td class="num ' + (v ? cls : 'cell-zero') + '">' + (v || 0) + '</td>';
      };
      return '<tr>'
        + '<td class="mem-name">' + esc(m.name) + '</td>'
        + '<td class="num">' + (m.animals || 0) + '</td>'
        + cell(m.red, 'cell-red') + cell(m.amber, 'cell-amber') + cell(m.green, 'cell-green')
        + '<td class="muted">' + fmtWhen(m.lastSync) + '</td>'
        + '<td class="num"><button class="csv-link" data-member="' + esc(m.memberId) + '">CSV ↓</button></td>'
        + '</tr>';
    }).join('');
  }

  function renderMemberFilter(members) {
    var cur = state.memberFilter;
    var opts = ['<option value="">All members</option>'];
    members.forEach(function (m) {
      opts.push('<option value="' + esc(m.name) + '"' + (cur === m.name ? ' selected' : '') + '>' + esc(m.name) + '</option>');
    });
    el.memberFilter.innerHTML = opts.join('');
  }

  function renderFlags(flags) {
    var list = flags;
    if (state.memberFilter) {
      list = flags.filter(function (f) { return f.memberName === state.memberFilter; });
    }
    var open = list.filter(function (f) { return !f.acked; }).length;
    el.flagCount.textContent = open;
    el.flagCount.classList.toggle('zero', open === 0);

    var empty = !list.length;
    el.flagsEmpty.hidden = !empty;
    if (empty) { el.flagList.innerHTML = ''; return; }

    el.flagList.innerHTML = list.map(function (f) {
      var tier = f.tier === 'red' ? 'red' : 'amber';
      var reasons = (f.reasons || []).map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('');
      var actionHtml = f.acked
        ? '<span class="acked-tag"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>Acknowledged</span>'
        : '<button class="ack-btn" data-flag="' + esc(f.id) + '">Acknowledge</button>';
      return '<div class="flag tier-' + tier + (f.acked ? ' acked' : '') + '" data-flag-row="' + esc(f.id) + '">'
        + '<span class="flag-dot ' + tier + '"></span>'
        + '<div class="flag-main">'
        + '<div class="flag-head">'
        + '<span class="flag-tag">' + esc(f.animalTag) + '</span>'
        + '<span class="flag-chip ' + tier + '">' + tier + '</span>'
        + '<span class="flag-chip kind">' + esc(f.kind) + '</span>'
        + '</div>'
        + '<div class="flag-meta">' + esc(f.memberName) + ' · ' + fmtWhen(f.ts) + '</div>'
        + (reasons ? '<ul class="flag-reasons">' + reasons + '</ul>' : '')
        + '</div>'
        + '<div class="flag-actions">' + actionHtml + '</div>'
        + '</div>';
    }).join('');
  }

  // ============================================================
  //  Acknowledge (R4)
  // ============================================================
  function onAck(flagId, btn) {
    var flag = (state.summary.flags || []).filter(function (f) { return f.id === flagId; })[0];
    if (!flag) return;

    if (state.demo) {
      flag.acked = true;
      renderFlags(state.summary.flags);
      return;
    }
    btn.disabled = true;
    btn.textContent = 'Acknowledging…';
    ackFlagRemote(flagId)
      .then(function () { flag.acked = true; renderFlags(state.summary.flags); })
      .catch(function () {
        btn.disabled = false;
        btn.textContent = 'Acknowledge';
        showBanner('error', ICON.warn + 'Could not acknowledge that flag — the backend did not confirm. Try again.');
      });
  }

  // ============================================================
  //  CSV export (R5)
  // ============================================================
  function exportCsv(memberId, memberName) {
    if (state.demo) {
      var rows = demoCsvRows(memberId);
      downloadCsv(rows, memberName);
      return;
    }
    var url = baseUrl() + '/api/herd/export.csv' + (memberId ? '?memberId=' + encodeURIComponent(memberId) : '');
    fetch(url, { headers: { 'Authorization': 'Bearer ' + state.token }, cache: 'no-store' })
      .then(function (res) {
        if (!res.ok) throw new Error('export http ' + res.status);
        return res.text();
      })
      .then(function (csv) { triggerDownload(csv, fileName(memberName)); })
      .catch(function (err) {
        showBanner('error', ICON.warn + 'CSV export failed (' + esc(err.message) + ').');
      });
  }

  var CSV_HEADER = 'member,animal_tag,species,kind,tier,timestamp,reasons';
  function csvCell(v) {
    v = String(v == null ? '' : v);
    return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
  }
  function downloadCsv(rows, memberName) {
    var lines = [CSV_HEADER];
    rows.forEach(function (r) {
      lines.push([r.member, r.animal_tag, r.species, r.kind, r.tier, r.timestamp,
        (r.reasons || []).join(' | ')].map(csvCell).join(','));
    });
    triggerDownload(lines.join('\n'), fileName(memberName));
  }
  function fileName(memberName) {
    var slug = memberName ? memberName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') : 'org';
    return 'herdcheck-' + slug + '-' + new Date().toISOString().slice(0, 10) + '.csv';
  }
  function triggerDownload(text, name) {
    var blob = new Blob([text], { type: 'text/csv;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 0);
  }

  // ============================================================
  //  Demo dataset — Rift Valley Dairy Co-op
  //  Mirrors the /summary response shape exactly (api.md) so the same
  //  render path serves live and demo. Reason strings echo scoring.js.
  // ============================================================
  function isoDaysAgo(days, hour) {
    var d = new Date();
    d.setDate(d.getDate() - days);
    if (hour != null) d.setHours(hour, 17, 0, 0);
    return d.toISOString();
  }

  // Per-animal observation records that drive both /summary aggregates and CSV.
  var DEMO_MEMBERS = [
    { memberId: 'm-amani',   name: 'Amani Wanjiru' },
    { memberId: 'm-joseph',  name: 'Joseph Kiptoo' },
    { memberId: 'm-grace',   name: 'Grace Naliaka' },
    { memberId: 'm-daniel',  name: 'Daniel Mwangi' },
    { memberId: 'm-fatuma',  name: 'Fatuma Hassan' },
    { memberId: 'm-peter',   name: 'Peter Odhiambo' }
  ];

  // records: { memberId, tag, species, kind, tier, daysAgo, reasons }
  var DEMO_RECORDS = [
    // Amani — clinical mastitis red + a lame amber
    { memberId: 'm-amani', tag: 'KE-047', species: 'cow', kind: 'mastitis', tier: 'red', daysAgo: 0,
      reasons: ['Sign: pain.', 'Sign: swelling.', 'Milk appearance: clotted.', 'Photo shows left/right udder asymmetry.'] },
    { memberId: 'm-amani', tag: 'KE-052', species: 'cow', kind: 'lameness', tier: 'amber', daysAgo: 2,
      reasons: ['Locomotion score 3/5 — arched back and short strides.'] },
    { memberId: 'm-amani', tag: 'KE-019', species: 'cow', kind: 'calving', tier: 'green', daysAgo: 4,
      reasons: ['38 days until expected calving (gestation day 245).'] },
    { memberId: 'm-amani', tag: 'KE-061', species: 'goat', kind: 'mastitis', tier: 'green', daysAgo: 5,
      reasons: ['No mastitis signs detected today.'] },

    // Joseph — calving red (water bag) + lameness red
    { memberId: 'm-joseph', tag: 'BUF-112', species: 'buffalo', kind: 'calving', tier: 'red', daysAgo: 0,
      reasons: ['Sign: water bag.', 'Sign: restlessness.', '1 days until expected calving (gestation day 309).'] },
    { memberId: 'm-joseph', tag: 'KE-088', species: 'cow', kind: 'lameness', tier: 'red', daysAgo: 1,
      reasons: ['Locomotion score 4/5 — clear lameness.'] },
    { memberId: 'm-joseph', tag: 'KE-090', species: 'cow', kind: 'mastitis', tier: 'amber', daysAgo: 3,
      reasons: ['Sign: yield drop.', 'Milk appearance: watery.'] },
    { memberId: 'm-joseph', tag: 'KE-091', species: 'cow', kind: 'lameness', tier: 'green', daysAgo: 6,
      reasons: ['Locomotion score 1/5 — normal gait.'] },

    // Grace — sheep flock, one amber lameness
    { memberId: 'm-grace', tag: 'SH-204', species: 'sheep', kind: 'lameness', tier: 'amber', daysAgo: 1,
      reasons: ['Locomotion score 2/5 — early lameness sign.'] },
    { memberId: 'm-grace', tag: 'SH-205', species: 'sheep', kind: 'calving', tier: 'amber', daysAgo: 2,
      reasons: ['6 days until expected calving (gestation day 141).', 'Sign: udder filling.'] },
    { memberId: 'm-grace', tag: 'SH-206', species: 'sheep', kind: 'lameness', tier: 'green', daysAgo: 8,
      reasons: ['Locomotion score 1/5 — normal gait.'] },

    // Daniel — mostly green, one amber
    { memberId: 'm-daniel', tag: 'KE-301', species: 'cow', kind: 'mastitis', tier: 'green', daysAgo: 2,
      reasons: ['No mastitis signs detected today.'] },
    { memberId: 'm-daniel', tag: 'KE-302', species: 'cow', kind: 'calving', tier: 'amber', daysAgo: 3,
      reasons: ['12 days until expected calving (gestation day 271).', 'Sign: vulva swelling.'] },
    { memberId: 'm-daniel', tag: 'KE-303', species: 'cow', kind: 'lameness', tier: 'green', daysAgo: 9,
      reasons: ['Locomotion score 1/5 — normal gait.'] },

    // Fatuma — goat does, mastitis red
    { memberId: 'm-fatuma', tag: 'GT-410', species: 'goat', kind: 'mastitis', tier: 'red', daysAgo: 1,
      reasons: ['Sign: heat.', 'Sign: redness.', 'Sign: pain.', 'Milk appearance: blood.'] },
    { memberId: 'm-fatuma', tag: 'GT-411', species: 'goat', kind: 'lameness', tier: 'green', daysAgo: 4,
      reasons: ['Locomotion score 1/5 — normal gait.'] },
    { memberId: 'm-fatuma', tag: 'GT-412', species: 'goat', kind: 'calving', tier: 'green', daysAgo: 11,
      reasons: ['41 days until expected calving (gestation day 109).'] },

    // Peter — synced a while ago, one lame amber inside 30d window
    { memberId: 'm-peter', tag: 'KE-501', species: 'cow', kind: 'lameness', tier: 'amber', daysAgo: 19,
      reasons: ['Locomotion score 3/5 — arched back and short strides.'] },
    { memberId: 'm-peter', tag: 'KE-502', species: 'cow', kind: 'mastitis', tier: 'green', daysAgo: 20,
      reasons: ['No mastitis signs detected today.'] }
  ];

  // Most recent observation per (member, animal) -> animal tier (animalTier rule:
  // worst of most-recent-of-each-kind; here one kind per animal in the sample).
  function buildDemo(days, memberFilter) {
    var memberById = {};
    DEMO_MEMBERS.forEach(function (m) { memberById[m.memberId] = m.name; });

    // animal-level tiers for totals + member rows
    var totals = { animals: 0, red: 0, amber: 0, green: 0, gray: 0 };
    var byKind = { lameness: { red: 0, amber: 0, green: 0 }, mastitis: { red: 0, amber: 0, green: 0 }, calving: { red: 0, amber: 0, green: 0 } };
    var memAgg = {};
    DEMO_MEMBERS.forEach(function (m) {
      memAgg[m.memberId] = { memberId: m.memberId, name: m.name, animals: 0, red: 0, amber: 0, green: 0, lastSync: null };
    });

    DEMO_RECORDS.forEach(function (r) {
      totals.animals++;
      totals[r.tier]++;
      if (byKind[r.kind] && byKind[r.kind][r.tier] != null) byKind[r.kind][r.tier]++;
      var ma = memAgg[r.memberId];
      ma.animals++;
      if (r.tier === 'red' || r.tier === 'amber' || r.tier === 'green') ma[r.tier]++;
      var ts = isoDaysAgo(r.daysAgo, 9);
      if (!ma.lastSync || ts > ma.lastSync) ma.lastSync = ts;
    });

    var members = DEMO_MEMBERS.map(function (m) { return memAgg[m.memberId]; });

    // flags: red/amber observations within `days`
    var flags = DEMO_RECORDS
      .filter(function (r) { return (r.tier === 'red' || r.tier === 'amber') && r.daysAgo <= days; })
      .sort(function (a, b) {
        var rank = { red: 0, amber: 1 };
        if (rank[a.tier] !== rank[b.tier]) return rank[a.tier] - rank[b.tier];
        return a.daysAgo - b.daysAgo;
      })
      .map(function (r, i) {
        return {
          id: 'flag-' + r.memberId + '-' + r.tag + '-' + r.kind,
          memberName: memberById[r.memberId],
          animalTag: r.tag,
          kind: r.kind,
          tier: r.tier,
          ts: isoDaysAgo(r.daysAgo, 9),
          reasons: r.reasons,
          acked: false
        };
      });

    return {
      org: { id: 'org-rift-valley', name: 'Rift Valley Dairy Co-op',
             validated: false, validatedBy: null, validatedAt: null },
      totals: totals,
      byKind: byKind,
      members: members,
      flags: flags
    };
  }

  function demoCsvRows(memberId) {
    var memberById = {};
    DEMO_MEMBERS.forEach(function (m) { memberById[m.memberId] = m.name; });
    return DEMO_RECORDS
      .filter(function (r) { return !memberId || r.memberId === memberId; })
      .map(function (r) {
        return {
          member: memberById[r.memberId], animal_tag: r.tag, species: r.species,
          kind: r.kind, tier: r.tier, timestamp: isoDaysAgo(r.daysAgo, 9), reasons: r.reasons
        };
      });
  }

  // ============================================================
  //  Events
  // ============================================================
  el.connForm.addEventListener('submit', function (e) {
    e.preventDefault();
    state.token = el.tokenInput.value.trim();
    state.base = el.baseInput.value.trim() || DEFAULT_BASE;
    if (!state.token) {
      showBanner('demo', ICON.warn + '<b>No token entered.</b> Showing demo data. Paste a staff token for live data.');
      loadDemo(true);
      return;
    }
    clearBanner();
    loadLive();
  });

  el.demoBtn.addEventListener('click', function () {
    state.token = '';
    loadDemo(false);
  });

  el.refreshBtn.addEventListener('click', function () {
    if (state.demo || !state.token) { loadDemo(state.demo ? false : false); }
    else { loadLive(); }
  });

  // Day-window segmented control
  document.querySelector('.controls').addEventListener('click', function (e) {
    var b = e.target.closest('.seg-btn');
    if (!b) return;
    state.days = Number(b.dataset.days);
    if (state.demo || !state.token) loadDemo(true);
    else loadLive();
  });

  el.memberFilter.addEventListener('change', function () {
    state.memberFilter = el.memberFilter.value;
    if (state.summary) renderFlags(state.summary.flags || []);
  });

  el.exportOrgBtn.addEventListener('click', function () { exportCsv('', 'org'); });

  // Acknowledge (delegated)
  el.flagList.addEventListener('click', function (e) {
    var b = e.target.closest('.ack-btn');
    if (b) onAck(b.dataset.flag, b);
  });

  // Per-member CSV (delegated)
  el.membersBody.addEventListener('click', function (e) {
    var b = e.target.closest('.csv-link');
    if (!b) return;
    var id = b.dataset.member;
    var m = (state.summary.members || []).filter(function (x) { return x.memberId === id; })[0];
    exportCsv(id, m ? m.name : id);
  });

  // ============================================================
  //  Boot
  // ============================================================
  (function init() {
    var savedToken = '', savedBase = '';
    try { savedToken = localStorage.getItem(LS_TOKEN) || ''; savedBase = localStorage.getItem(LS_BASE) || ''; } catch (e) {}
    if (savedBase) el.baseInput.value = savedBase;
    if (savedToken) {
      el.tokenInput.value = savedToken;
      state.token = savedToken;
      state.base = savedBase || DEFAULT_BASE;
      el.connHint.innerHTML = 'Reusing the staff token saved in this browser. Click <b>Load dashboard</b> to refresh, or <b>Load demo data</b> to preview.';
    } else {
      // No token: open straight into demo so the page is never blank.
      loadDemo(false);
    }
  })();
})();
