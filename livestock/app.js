// HerdCheck — main app controller
(function() {
  const { db, vision, scoring, t, setLang, applyI18n } = window.HC;

  // App state
  const state = {
    screen: 'herd',
    currentAnimal: null,
    currentCheck: null,
    lameness: { score: null, videoBlob: null, notes: '' },
    mastitis: { signs: {}, milk: 'normal', imageBlob: null, imageMetrics: null, notes: '' },
    calving: { signs: {}, imageBlob: null, notes: '' }
  };

  // ---------- Navigation ----------
  function show(screen, opts = {}) {
    state.screen = screen;
    document.querySelectorAll('.screen').forEach(el => {
      el.hidden = el.dataset.screen !== screen;
    });
    document.querySelectorAll('.nav-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.nav === screen);
    });
    window.scrollTo(0, 0);

    if (screen === 'herd') renderHerd();
    if (screen === 'alerts') renderAlerts();
    if (screen === 'settings') loadSettings();
    if (screen === 'check' && state.currentAnimal) {
      document.getElementById('check-animal-name').textContent =
        animalLabel(state.currentAnimal);
    }
    if (screen === 'lameness') resetLamenessForm();
    if (screen === 'mastitis') resetMastitisForm();
    if (screen === 'calving') prepareCalvingForm();
    if (screen === 'history') renderHistory();
    if (screen === 'add') prepareAddForm(opts.edit);
  }

  document.addEventListener('click', (e) => {
    const navBtn = e.target.closest('[data-nav]');
    if (navBtn) {
      show(navBtn.dataset.nav);
      return;
    }
    const back = e.target.closest('[data-back]');
    if (back) {
      show(back.dataset.back);
      return;
    }
  });

  // ---------- Toast ----------
  let toastTimer = null;
  function toast(msg) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.hidden = true; }, 2200);
  }

  // ---------- Herd ----------
  function animalLabel(a) {
    if (a.name && a.tag) return `${a.name} (${a.tag})`;
    return a.name || a.tag || 'Animal';
  }

  function speciesIcon(s) {
    return { cow: '🐄', buffalo: '🐃', sheep: '🐑', goat: '🐐' }[s] || '🐾';
  }

  async function renderHerd() {
    const animals = await db.listAnimals();
    const observations = await db.listObservations();
    const empty = document.getElementById('herd-empty');
    const list = document.getElementById('animal-list');
    const summary = document.getElementById('herd-summary');

    if (animals.length === 0) {
      empty.hidden = false;
      list.innerHTML = '';
      summary.innerHTML = '';
      return;
    }
    empty.hidden = true;

    // Compute tier per animal
    const tierByAnimal = {};
    animals.forEach(a => {
      const obs = observations.filter(o => o.animalId === a.id);
      tierByAnimal[a.id] = scoring.animalTier(obs);
    });

    // Summary pills
    const counts = { red: 0, amber: 0, green: 0, gray: 0 };
    Object.values(tierByAnimal).forEach(t => counts[t]++);
    const animalWord = animals.length === 1 ? t('summary.animal') : t('summary.animals');
    summary.innerHTML = `
      <span class="summary-pill"><strong>${animals.length}</strong> ${animalWord}</span>
      ${counts.red ? `<span class="summary-pill red"><strong>${counts.red}</strong> ${t('summary.urgent')}</span>` : ''}
      ${counts.amber ? `<span class="summary-pill amber"><strong>${counts.amber}</strong> ${t('summary.watch')}</span>` : ''}
      ${counts.green ? `<span class="summary-pill green"><strong>${counts.green}</strong> ${t('summary.healthy')}</span>` : ''}
      ${counts.gray ? `<span class="summary-pill"><strong>${counts.gray}</strong> ${t('summary.unchecked')}</span>` : ''}
    `;

    // Sort: red > amber > gray > green
    const order = { red: 0, amber: 1, gray: 2, green: 3 };
    animals.sort((a, b) => {
      const d = order[tierByAnimal[a.id]] - order[tierByAnimal[b.id]];
      if (d !== 0) return d;
      return (a.tag || '').localeCompare(b.tag || '');
    });

    list.innerHTML = '';
    animals.forEach(a => {
      const tier = tierByAnimal[a.id];
      const lastObs = observations
        .filter(o => o.animalId === a.id)
        .sort((x, y) => y.ts.localeCompare(x.ts))[0];
      const card = document.createElement('button');
      card.className = 'animal-card';
      card.innerHTML = `
        <div class="animal-icon">${speciesIcon(a.species)}</div>
        <div class="animal-meta">
          <div class="animal-name">${escapeHtml(animalLabel(a))}</div>
          <div class="animal-sub">${describeAnimal(a, lastObs)}</div>
        </div>
        <div class="tier-dot ${tier}"></div>
      `;
      card.addEventListener('click', () => {
        state.currentAnimal = a;
        show('check');
      });
      list.appendChild(card);
    });
  }

  function describeAnimal(a, lastObs) {
    const bits = [];
    if (a.species) bits.push(t('species.' + a.species));
    if (lastObs) {
      const days = Math.floor((Date.now() - new Date(lastObs.ts).getTime()) / 86400000);
      if (days === 0) bits.push(t('card.today'));
      else if (days === 1) bits.push(t('card.dayAgo'));
      else bits.push(t('card.daysAgo').replace('%n', days));
    } else {
      bits.push(t('card.unchecked'));
    }
    if (a.bredISO) {
      const day = scoring.gestationDay(a.species, a.bredISO);
      const target = scoring.GESTATION[a.species] || 283;
      const left = target - day;
      if (left >= 0 && left < 90) bits.push(t('card.toCalving').replace('%n', left));
    }
    return bits.join(' · ');
  }

  // ---------- Add animal ----------
  function prepareAddForm(editAnimal) {
    document.getElementById('add-tag').value = editAnimal ? editAnimal.tag || '' : '';
    document.getElementById('add-name').value = editAnimal ? editAnimal.name || '' : '';
    document.getElementById('add-species').value = editAnimal ? editAnimal.species || 'cow' : 'cow';
    document.getElementById('add-birth').value = editAnimal ? editAnimal.birthYear || '' : '';
    document.getElementById('add-bred').value = editAnimal ? editAnimal.bredISO || '' : '';
    document.getElementById('add-save').dataset.editing = editAnimal ? editAnimal.id : '';
  }

  document.getElementById('add-animal-btn').addEventListener('click', () => show('add'));

  document.getElementById('add-save').addEventListener('click', async () => {
    const tag = document.getElementById('add-tag').value.trim();
    const name = document.getElementById('add-name').value.trim();
    const species = document.getElementById('add-species').value;
    const birthYear = document.getElementById('add-birth').value;
    const bredISO = document.getElementById('add-bred').value || null;
    const editingId = document.getElementById('add-save').dataset.editing;

    if (!tag && !name) {
      toast(t('validation.tagOrName'));
      return;
    }

    const animal = {
      id: editingId || db.uid(),
      tag, name, species, birthYear: birthYear || null, bredISO,
      createdAt: editingId ? undefined : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    if (editingId) {
      const existing = await db.getAnimal(editingId);
      Object.assign(animal, existing, animal);
    }
    await db.saveAnimal(animal);
    toast(t('toast.saved'));
    show('herd');
  });

  // ---------- Check selection ----------
  document.querySelectorAll('[data-check]').forEach(btn => {
    btn.addEventListener('click', () => {
      const kind = btn.dataset.check;
      state.currentCheck = kind;
      show(kind);
    });
  });

  // ---------- Lameness ----------
  function resetLamenessForm() {
    state.lameness = { score: null, videoBlob: null, notes: '' };
    document.querySelectorAll('#lameness-scores button').forEach(b => b.classList.remove('selected'));
    document.getElementById('lameness-notes').value = '';
    const pv = document.getElementById('lameness-preview');
    pv.hidden = true;
    pv.src = '';
  }

  document.getElementById('lameness-video-input').addEventListener('change', async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    state.lameness.videoBlob = file;
    const pv = document.getElementById('lameness-preview');
    pv.src = URL.createObjectURL(file);
    pv.hidden = false;
  });

  document.querySelectorAll('#lameness-scores button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#lameness-scores button').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      state.lameness.score = Number(btn.dataset.score);
    });
  });

  document.getElementById('lameness-save').addEventListener('click', async () => {
    if (!state.lameness.score) {
      toast(t('validation.score'));
      return;
    }
    state.lameness.notes = document.getElementById('lameness-notes').value;
    const result = scoring.scoreLameness({ locomotionScore: state.lameness.score });

    const videoDataUrl = state.lameness.videoBlob
      ? await vision.blobToDataUrl(state.lameness.videoBlob)
      : null;

    await db.saveObservation({
      id: db.uid(),
      animalId: state.currentAnimal.id,
      kind: 'lameness',
      ts: new Date().toISOString(),
      data: { locomotionScore: state.lameness.score, notes: state.lameness.notes },
      videoDataUrl,
      tier: result.tier,
      reasons: result.reasons,
      actions: result.actions
    });
    renderResult(result, 'lameness');
  });

  // ---------- Mastitis ----------
  function resetMastitisForm() {
    state.mastitis = { signs: {}, milk: 'normal', imageBlob: null, imageMetrics: null, notes: '' };
    document.querySelectorAll('#mastitis-signs input').forEach(i => i.checked = false);
    document.querySelectorAll('#mastitis-milk input').forEach(i => {
      i.checked = (i.value === 'normal');
    });
    document.getElementById('mastitis-notes').value = '';
    document.getElementById('mastitis-image-result').hidden = true;
  }

  document.getElementById('mastitis-photo-input').addEventListener('change', async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    state.mastitis.imageBlob = file;
    try {
      const metrics = await vision.analyseUdder(file);
      state.mastitis.imageMetrics = metrics;
      const img = document.getElementById('mastitis-preview');
      img.src = URL.createObjectURL(file);
      document.getElementById('mastitis-image-result').hidden = false;
      document.getElementById('mastitis-metrics').innerHTML = `
        <div class="metric"><span class="metric-label">Symmetry diff:</span> <strong>${(metrics.asymmetry * 100).toFixed(0)}%</strong></div>
        <div class="metric"><span class="metric-label">Red pixels:</span> <strong>${(metrics.rednessFraction * 100).toFixed(0)}%</strong></div>
      `;
    } catch (err) {
      console.error(err);
      toast('Could not analyse image');
    }
  });

  document.querySelectorAll('#mastitis-signs input').forEach(input => {
    input.addEventListener('change', () => {
      state.mastitis.signs[input.dataset.sign] = input.checked;
    });
  });

  document.querySelectorAll('#mastitis-milk input').forEach(input => {
    input.addEventListener('change', () => {
      if (input.checked) state.mastitis.milk = input.value;
    });
  });

  document.getElementById('mastitis-save').addEventListener('click', async () => {
    state.mastitis.notes = document.getElementById('mastitis-notes').value;
    const result = scoring.scoreMastitis({
      signs: state.mastitis.signs,
      milk: state.mastitis.milk,
      imageMetrics: state.mastitis.imageMetrics
    });

    const imageDataUrl = state.mastitis.imageBlob
      ? await vision.blobToDataUrl(state.mastitis.imageBlob)
      : null;

    await db.saveObservation({
      id: db.uid(),
      animalId: state.currentAnimal.id,
      kind: 'mastitis',
      ts: new Date().toISOString(),
      data: {
        signs: state.mastitis.signs,
        milk: state.mastitis.milk,
        imageMetrics: state.mastitis.imageMetrics ? {
          asymmetry: state.mastitis.imageMetrics.asymmetry,
          rednessFraction: state.mastitis.imageMetrics.rednessFraction,
          brightness: state.mastitis.imageMetrics.brightness
        } : null,
        notes: state.mastitis.notes
      },
      imageDataUrl,
      tier: result.tier,
      reasons: result.reasons,
      actions: result.actions
    });
    renderResult(result, 'mastitis');
  });

  // ---------- Calving ----------
  function prepareCalvingForm() {
    state.calving = { signs: {}, imageBlob: null, notes: '' };
    document.querySelectorAll('#calving-signs input').forEach(i => i.checked = false);
    document.getElementById('calving-notes').value = '';
    document.getElementById('calving-preview').hidden = true;

    // Show gestation info
    const a = state.currentAnimal;
    const info = document.getElementById('calving-gestation-info');
    if (a.bredISO) {
      const day = scoring.gestationDay(a.species, a.bredISO);
      const target = scoring.GESTATION[a.species] || 283;
      const left = target - day;
      const expected = scoring.expectedCalvingDate(a.species, a.bredISO);
      let tier = 'green';
      if (left <= 1) tier = 'red';
      else if (left <= 14) tier = 'amber';
      info.className = 'gestation-info ' + tier;
      const dayLine = t('gestation.day').replace('%d', day).replace('%t', target);
      const detailLine = left >= 0
        ? t('gestation.left').replace('%n', left).replace('%d', expected)
        : t('gestation.over').replace('%n', Math.abs(left)).replace('%d', expected);
      info.innerHTML = `<strong>${escapeHtml(dayLine)}</strong><div>${escapeHtml(detailLine)}</div>`;
    } else {
      info.className = 'gestation-info';
      info.innerHTML = `<strong>${escapeHtml(t('gestation.none'))}</strong><div>${escapeHtml(t('gestation.noneHint'))}</div>`;
    }
  }

  document.querySelectorAll('#calving-signs input').forEach(input => {
    input.addEventListener('change', () => {
      state.calving.signs[input.dataset.sign] = input.checked;
    });
  });

  document.getElementById('calving-photo-input').addEventListener('change', async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    state.calving.imageBlob = file;
    const img = document.getElementById('calving-preview');
    img.src = URL.createObjectURL(file);
    img.hidden = false;
  });

  document.getElementById('calving-save').addEventListener('click', async () => {
    state.calving.notes = document.getElementById('calving-notes').value;
    const result = scoring.scoreCalving({
      signs: state.calving.signs,
      species: state.currentAnimal.species,
      bredISO: state.currentAnimal.bredISO
    });

    const imageDataUrl = state.calving.imageBlob
      ? await vision.blobToDataUrl(state.calving.imageBlob)
      : null;

    await db.saveObservation({
      id: db.uid(),
      animalId: state.currentAnimal.id,
      kind: 'calving',
      ts: new Date().toISOString(),
      data: { signs: state.calving.signs, notes: state.calving.notes, window: result.window },
      imageDataUrl,
      tier: result.tier,
      reasons: result.reasons,
      actions: result.actions
    });
    renderResult(result, 'calving');
  });

  // ---------- Result ----------
  function renderResult(result, kind) {
    const tierTitle = t('tier.' + result.tier + '.title');
    const tierBody = t('tier.' + result.tier + '.body');
    document.getElementById('result-tier').className = 'tier-card ' + result.tier;
    document.getElementById('result-tier').innerHTML = `
      <h2>${tierTitle}</h2>
      <p>${tierBody}</p>
      ${result.window ? `<p style="margin-top:8px"><strong>${result.window}</strong></p>` : ''}
    `;
    document.getElementById('result-body').innerHTML = `
      <h3>${t('result.why')}</h3>
      <ul>${result.reasons.map(r => `<li>${escapeHtml(r)}</li>`).join('')}</ul>
      <h3>${t('result.next')}</h3>
      <ul>${result.actions.map(a => `<li>${escapeHtml(a)}</li>`).join('')}</ul>
    `;
    show('result');
  }

  // ---------- History ----------
  async function renderHistory() {
    if (!state.currentAnimal) return;
    const list = document.getElementById('history-list');
    const obs = await db.observationsFor(state.currentAnimal.id);
    if (obs.length === 0) {
      list.innerHTML = `<div class="empty-state"><p>${t('history.empty')}</p></div>`;
      return;
    }
    list.innerHTML = '';
    obs.forEach(o => {
      const card = document.createElement('div');
      card.className = 'history-item';
      const when = new Date(o.ts).toLocaleString();
      const icons = { lameness: '🦵', mastitis: '🩺', calving: '🐄' };
      const kindLabel = (icons[o.kind] || '') + ' ' + (t('kind.' + o.kind) || o.kind);
      card.innerHTML = `
        <div class="history-meta">
          <div class="history-kind">${kindLabel}</div>
          <div class="history-date">${when}</div>
          ${o.reasons && o.reasons[0] ? `<div class="history-date">${escapeHtml(o.reasons[0])}</div>` : ''}
        </div>
        <div class="tier-dot ${o.tier || 'gray'}"></div>
      `;
      list.appendChild(card);
    });
  }

  // ---------- Alerts dashboard ----------
  async function renderAlerts() {
    const animals = await db.listAnimals();
    const observations = await db.listObservations();
    const list = document.getElementById('alerts-list');
    list.innerHTML = '';

    // Build per-animal latest tier per kind
    const alerts = [];
    animals.forEach(a => {
      const obs = observations.filter(o => o.animalId === a.id)
        .sort((x, y) => y.ts.localeCompare(x.ts));
      const seenKinds = new Set();
      obs.forEach(o => {
        if (seenKinds.has(o.kind)) return;
        seenKinds.add(o.kind);
        if (o.tier === 'red' || o.tier === 'amber') {
          alerts.push({ animal: a, obs: o });
        }
      });
      // Also add upcoming calvings without observations
      if (a.bredISO) {
        const day = scoring.gestationDay(a.species, a.bredISO);
        const target = scoring.GESTATION[a.species] || 283;
        const left = target - day;
        if (left >= 0 && left <= 7 && !seenKinds.has('calving')) {
          alerts.push({
            animal: a,
            obs: {
              kind: 'calving',
              tier: left <= 1 ? 'red' : 'amber',
              reasons: [`${left} day${left !== 1 ? 's' : ''} until expected calving`],
              ts: new Date().toISOString()
            }
          });
        }
      }
    });

    // Sort by tier severity, then time
    const tierOrder = { red: 0, amber: 1, green: 2, gray: 3 };
    alerts.sort((x, y) => {
      const d = tierOrder[x.obs.tier] - tierOrder[y.obs.tier];
      if (d !== 0) return d;
      return y.obs.ts.localeCompare(x.obs.ts);
    });

    if (alerts.length === 0) {
      list.innerHTML = `<div class="empty-state"><p>${t('alerts.empty')}</p></div>`;
      document.getElementById('alert-badge').hidden = true;
      return;
    }
    document.getElementById('alert-badge').hidden = false;
    document.getElementById('alert-badge').textContent = alerts.length;

    alerts.forEach(({ animal, obs }) => {
      const card = document.createElement('div');
      card.className = 'alert-card ' + (obs.tier || 'amber');
      const kindLabel = t('kind.' + obs.kind) || obs.kind;
      card.innerHTML = `
        <div class="alert-title">${escapeHtml(animalLabel(animal))} — ${kindLabel}</div>
        <div class="alert-sub">${escapeHtml((obs.reasons && obs.reasons[0]) || '')}</div>
      `;
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => {
        state.currentAnimal = animal;
        show('check');
      });
      list.appendChild(card);
    });
  }

  // ---------- Settings ----------
  async function loadSettings() {
    const s = await db.getSettings();
    document.getElementById('settings-farm').value = s.farm || '';
    document.getElementById('settings-coop').value = s.coop || '';
    document.getElementById('settings-lang').value = window.HC.lang;
    renderOrg();
  }

  // ---------- Co-op program (opt-in org membership + consent) ----------
  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>"]/g, (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  }

  function setOrgMsg(text) {
    const m = document.getElementById('org-msg');
    if (m) { m.hidden = !text; m.textContent = text || ''; }
  }

  async function renderOrg() {
    const el = document.getElementById('org-section');
    if (!el || !window.HC.org) return;
    const st = await window.HC.org.status();

    if (!st.joined) {
      el.innerHTML =
        '<p class="hint">Join your co-op or program to share screenings with their dashboard. Optional — HerdCheck works fully without it.</p>' +
        '<label class="field"><span>Program code</span>' +
        '<input type="text" id="org-code" placeholder="e.g. GREENVALLEY-MEMBER" autocapitalize="characters"></label>' +
        '<label class="field"><span>Your name</span>' +
        '<input type="text" id="org-name" placeholder="Your name"></label>' +
        '<button class="btn btn-secondary btn-full" id="org-join">Join program</button>' +
        '<p class="hint" id="org-msg" hidden></p>';
      document.getElementById('org-join').addEventListener('click', onOrgJoin);
      return;
    }

    if (st.role === 'staff') {
      el.innerHTML =
        '<p class="hint">Joined <strong>' + esc(st.orgName) + '</strong> as staff. ' +
        'Open the co-op dashboard in your browser with your staff token to see the herd.</p>' +
        '<button class="btn btn-secondary btn-full" id="org-leave">Leave program</button>';
      document.getElementById('org-leave').addEventListener('click', onOrgLeave);
      return;
    }

    el.innerHTML =
      '<p class="hint">Joined <strong>' + esc(st.orgName) + '</strong>.</p>' +
      '<label class="org-consent"><input type="checkbox" id="org-consent"' + (st.consent ? ' checked' : '') + '>' +
      '<span>Share my screenings with ' + esc(st.orgName) + '</span></label>' +
      '<p class="hint">We send only: animal tag, species, check type, risk tier, and the reason/action text, with the time. ' +
      'Photos and videos never leave your phone.</p>' +
      '<p class="hint" id="org-share-state">' +
      (st.consent ? 'Sharing on — syncs whenever you have signal.' : 'Sharing off — nothing is sent.') + '</p>' +
      '<button class="btn btn-secondary btn-full" id="org-leave">Leave program</button>';
    document.getElementById('org-consent').addEventListener('change', onOrgConsent);
    document.getElementById('org-leave').addEventListener('click', onOrgLeave);
  }

  async function onOrgJoin() {
    const code = (document.getElementById('org-code').value || '').trim();
    const name = (document.getElementById('org-name').value || '').trim();
    if (!code) { setOrgMsg('Enter your program code.'); return; }
    setOrgMsg('Joining…');
    try {
      const r = await window.HC.org.join({ orgCode: code, memberName: name });
      if (!r.ok) { setOrgMsg(r.reason || 'Could not join. Check the code.'); return; }
      await renderOrg();
      toast('Joined ' + r.orgName);
    } catch (e) {
      setOrgMsg('No connection. Try again when you have signal.');
    }
  }

  async function onOrgConsent(e) {
    await window.HC.org.setConsent(e.target.checked);
    if (e.target.checked && window.HC.sync) window.HC.sync.flush();
    await renderOrg();
    toast(e.target.checked ? 'Sharing on' : 'Sharing off');
  }

  async function onOrgLeave() {
    if (!confirm('Leave the program? Your animals and checks stay on your phone — only sharing stops.')) return;
    await window.HC.org.leave();
    await renderOrg();
    toast('Left program');
  }

  ['settings-farm', 'settings-coop'].forEach(id => {
    document.getElementById(id).addEventListener('change', (e) => {
      db.setSetting(id.replace('settings-', ''), e.target.value);
    });
  });

  document.getElementById('settings-lang').addEventListener('change', (e) => {
    setLang(e.target.value);
  });

  document.getElementById('lang-btn').addEventListener('click', () => {
    const langs = Object.keys(window.HC_I18N);
    const idx = langs.indexOf(window.HC.lang);
    const next = langs[(idx + 1) % langs.length];
    setLang(next);
  });

  // Export CSV
  document.getElementById('export-csv').addEventListener('click', async () => {
    const animals = await db.listAnimals();
    const observations = await db.listObservations();
    const settings = await db.getSettings();
    const farm = settings.farm || 'unnamed';
    const coop = settings.coop || '';

    const rows = [
      ['farm', 'coop_id', 'animal_id', 'tag', 'name', 'species', 'check_kind', 'check_ts', 'tier', 'score', 'reasons']
    ];
    observations.forEach(o => {
      const a = animals.find(x => x.id === o.animalId);
      if (!a) return;
      rows.push([
        farm,
        coop,
        a.id,
        a.tag || '',
        a.name || '',
        a.species || '',
        o.kind,
        o.ts,
        o.tier || '',
        (o.data && (o.data.locomotionScore || '')) || '',
        (o.reasons || []).join(' | ')
      ]);
    });
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    download(csv, `herdcheck-${farm}-${new Date().toISOString().slice(0, 10)}.csv`, 'text/csv');
    toast(t('toast.exported'));
  });

  // Export JSON
  document.getElementById('export-json').addEventListener('click', async () => {
    const data = {
      exportedAt: new Date().toISOString(),
      version: '0.1.0',
      settings: await db.getSettings(),
      animals: await db.listAnimals(),
      observations: (await db.listObservations()).map(o => {
        // strip large blob fields from JSON to keep size manageable
        const copy = { ...o };
        delete copy.imageDataUrl;
        delete copy.videoDataUrl;
        return copy;
      })
    };
    download(JSON.stringify(data, null, 2), `herdcheck-full-${new Date().toISOString().slice(0, 10)}.json`, 'application/json');
    toast(t('toast.exported'));
  });

  document.getElementById('share-summary').addEventListener('click', async () => {
    const animals = await db.listAnimals();
    const observations = await db.listObservations();
    const settings = await db.getSettings();
    const tierByAnimal = {};
    animals.forEach(a => {
      tierByAnimal[a.id] = scoring.animalTier(observations.filter(o => o.animalId === a.id));
    });
    const red = animals.filter(a => tierByAnimal[a.id] === 'red');
    const amber = animals.filter(a => tierByAnimal[a.id] === 'amber');
    const lines = [
      `HerdCheck summary — ${settings.farm || 'farm'} — ${new Date().toLocaleDateString()}`,
      `${animals.length} animals · ${red.length} urgent · ${amber.length} watch`,
      ''
    ];
    if (red.length) {
      lines.push('URGENT:');
      red.forEach(a => lines.push(`- ${animalLabel(a)}`));
      lines.push('');
    }
    if (amber.length) {
      lines.push('WATCH:');
      amber.forEach(a => lines.push(`- ${animalLabel(a)}`));
    }
    const text = lines.join('\n');
    if (navigator.share) {
      try {
        await navigator.share({ text, title: 'HerdCheck summary' });
        return;
      } catch (e) { /* user cancelled */ }
    }
    download(text, `herdcheck-summary-${new Date().toISOString().slice(0, 10)}.txt`, 'text/plain');
    toast(t('toast.exported'));
  });

  document.getElementById('reset-data').addEventListener('click', async (e) => {
    e.preventDefault();
    const confirmed = prompt(t('toast.confirmReset'));
    if (confirmed === 'DELETE') {
      await db.clearAll();
      toast(t('toast.cleared'));
      show('herd');
    }
  });

  // ---------- Util ----------
  function download(content, filename, mime) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function escapeHtml(s) {
    if (s == null) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ---------- Online indicator ----------
  function updateOnline() {
    document.getElementById('online-dot').classList.toggle('offline', !navigator.onLine);
  }
  window.addEventListener('online', updateOnline);
  window.addEventListener('offline', updateOnline);
  updateOnline();

  // ---------- Service worker ----------
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(err => console.warn('SW reg failed', err));
    });
  }

  // Re-render dynamic content on language change
  window.HC.onLangChange = function() {
    show(state.screen);
  };

  // ---------- Boot ----------
  applyI18n();
  show('herd');
})();
