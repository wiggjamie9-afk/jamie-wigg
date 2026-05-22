// HerdCheck — risk scoring algorithms
// Combines structured veterinary observations with image heuristics.
// References:
//   - Sprecher DJ et al. (1997) 5-point locomotion scoring (cattle)
//   - Williamson NB / Mee JF — calving sign timing windows
//   - California Mastitis Test (CMT) clinical-sign correlates

(function() {

  // Gestation length defaults (days)
  const GESTATION = {
    cow: 283,
    buffalo: 310,
    sheep: 147,
    goat: 150
  };

  function daysBetween(a, b) {
    const ms = (new Date(b)).getTime() - (new Date(a)).getTime();
    return Math.floor(ms / 86400000);
  }

  function expectedCalvingDate(species, bredISO) {
    if (!bredISO) return null;
    const length = GESTATION[species] || 283;
    const d = new Date(bredISO);
    d.setDate(d.getDate() + length);
    return d.toISOString().slice(0, 10);
  }

  function gestationDay(species, bredISO) {
    if (!bredISO) return null;
    return daysBetween(bredISO, new Date().toISOString());
  }

  // --- Lameness ---
  // Sprecher locomotion score is the primary signal; tier follows it directly.
  function scoreLameness({ locomotionScore }) {
    const s = Number(locomotionScore) || 0;
    let tier = 'green';
    if (s >= 4) tier = 'red';
    else if (s >= 3) tier = 'amber';
    else if (s >= 2) tier = 'amber';

    const reasons = [];
    if (s >= 4) reasons.push('Locomotion score ' + s + '/5 — clear lameness.');
    else if (s === 3) reasons.push('Locomotion score 3/5 — arched back and short strides.');
    else if (s === 2) reasons.push('Locomotion score 2/5 — early lameness sign.');
    else reasons.push('Locomotion score 1/5 — normal gait.');

    const actions = [];
    if (tier === 'red') {
      actions.push('Inspect hooves today — look for sole ulcers, white-line cracks, foot rot.');
      actions.push('Move the animal to soft bedding. Avoid concrete or rocky pasture.');
      actions.push('If a wound or swelling is visible, call vet / extension worker.');
    } else if (tier === 'amber') {
      actions.push('Trim and clean hooves. Check between digits for foreign objects.');
      actions.push('Re-score in 48 hours. Track here under History.');
    } else {
      actions.push('Routine hoof care. Re-check monthly.');
    }
    return { tier, reasons, actions, score: s };
  }

  // --- Mastitis ---
  // Risk combines visible signs + milk appearance + image heuristics.
  function scoreMastitis({ signs = {}, milk = 'normal', imageMetrics = null }) {
    const reasons = [];
    let points = 0;

    // Visible signs (binary)
    const signWeights = {
      swelling: 2,
      asymmetry: 2,
      redness: 2,
      heat: 2,
      pain: 3,
      yieldDrop: 2
    };
    Object.entries(signs).forEach(([k, v]) => {
      if (v && signWeights[k]) {
        points += signWeights[k];
        reasons.push('Sign: ' + k.replace(/([A-Z])/g, ' $1').toLowerCase() + '.');
      }
    });

    // Milk appearance (single-select)
    const milkPoints = { normal: 0, watery: 2, clotted: 5, blood: 6 };
    points += milkPoints[milk] || 0;
    if (milk !== 'normal') {
      reasons.push('Milk appearance: ' + milk + '.');
    }

    // Image heuristics — corroborate, never override the checklist
    if (imageMetrics) {
      if (imageMetrics.asymmetry > 0.18) {
        points += 1;
        reasons.push('Photo shows left/right udder asymmetry.');
      }
      if (imageMetrics.rednessFraction > 0.15) {
        points += 1;
        reasons.push('Photo shows red-tinged skin pixels (' + Math.round(imageMetrics.rednessFraction * 100) + '%).');
      }
    }

    let tier = 'green';
    if (points >= 7 || milk === 'blood' || milk === 'clotted') tier = 'red';
    else if (points >= 3) tier = 'amber';

    const actions = [];
    if (tier === 'red') {
      actions.push('STOP selling milk from this animal — withhold for human consumption.');
      actions.push('Isolate from the rest of the herd if possible.');
      actions.push('Strip all four quarters; record which quarter is affected.');
      actions.push('Contact vet — likely needs antibiotic intramammary treatment.');
    } else if (tier === 'amber') {
      actions.push('Strip the suspected quarter onto a black surface — look for clots.');
      actions.push('Wash and disinfect teats before and after milking.');
      actions.push('Re-check in 12 hours. Escalate if symptoms worsen.');
    } else {
      actions.push('No mastitis signs detected today. Maintain teat hygiene.');
    }

    return { tier, reasons, actions, score: points };
  }

  // --- Calving ---
  // Combines gestation day with observed pre-calving signs.
  function scoreCalving({ signs = {}, species = 'cow', bredISO = null }) {
    const day = gestationDay(species, bredISO);
    const target = GESTATION[species] || 283;
    const reasons = [];
    let points = 0;

    if (day !== null) {
      const daysLeft = target - day;
      if (daysLeft <= 0) reasons.push('Past expected calving date (' + Math.abs(daysLeft) + ' days over).');
      else reasons.push(daysLeft + ' days until expected calving (gestation day ' + day + ').');

      if (daysLeft <= 1) points += 6;
      else if (daysLeft <= 3) points += 4;
      else if (daysLeft <= 7) points += 2;
      else if (daysLeft <= 14) points += 1;
    }

    const signWeights = {
      vulvaSwelling: 2,
      mucusDischarge: 2,
      udderFilling: 1,
      restlessness: 2,
      tailRaised: 2,
      pelvicRelaxed: 2,
      appetiteLoss: 1,
      waterBag: 8 // water bag = active labour
    };
    let signCount = 0;
    Object.entries(signs).forEach(([k, v]) => {
      if (v && signWeights[k]) {
        points += signWeights[k];
        signCount++;
        reasons.push('Sign: ' + k.replace(/([A-Z])/g, ' $1').toLowerCase() + '.');
      }
    });

    let tier = 'green';
    let window = null;
    if (signs.waterBag) {
      tier = 'red';
      window = 'Active labour — within hours';
    } else if (points >= 8 || (day !== null && (target - day) <= 1)) {
      tier = 'red';
      window = 'Within 24 hours';
    } else if (points >= 4 || (day !== null && (target - day) <= 7 && signCount >= 1)) {
      tier = 'amber';
      window = 'Within 1–7 days';
    } else if (day !== null && (target - day) <= 14) {
      tier = 'amber';
      window = '1–2 weeks';
    } else if (day !== null) {
      window = (target - day) + ' days out (estimate)';
    }

    const actions = [];
    if (tier === 'red') {
      actions.push('Move to a clean, quiet calving area now.');
      actions.push('Have clean towels, iodine for navel, and your vet number ready.');
      actions.push('If straining for more than 1 hour with no progress, call for help.');
    } else if (tier === 'amber') {
      actions.push('Prepare calving area. Check twice daily.');
      actions.push('Make sure the cow is not isolated from feed/water.');
    } else {
      actions.push('Continue routine monitoring.');
    }

    return { tier, reasons, actions, score: points, window, gestationDay: day, expectedDay: target };
  }

  // Aggregate risk tier across multiple observations for a single animal.
  // Most-recent of each kind dominates; red > amber > green.
  function animalTier(observations) {
    if (!observations || observations.length === 0) return 'gray';
    const order = { red: 3, amber: 2, green: 1, gray: 0 };
    // Take most recent of each kind
    const byKind = {};
    [...observations].sort((a, b) => b.ts.localeCompare(a.ts)).forEach(o => {
      if (!byKind[o.kind]) byKind[o.kind] = o;
    });
    const tiers = Object.values(byKind).map(o => o.tier || 'gray');
    return tiers.reduce((best, t) => order[t] > order[best] ? t : best, 'green');
  }

  window.HC = window.HC || {};
  window.HC.scoring = {
    GESTATION,
    expectedCalvingDate,
    gestationDay,
    scoreLameness,
    scoreMastitis,
    scoreCalving,
    animalTier
  };
})();
