// HerdCheck — SMS Action Handler
// Sends vet alerts via Twilio, with offline queue support

(function() {
  const API_ENDPOINT = '/api/sms/send'; // Cloudflare Worker

  async function sendVetAlert(animalId, animalLabel, photoUrl, vetPhone) {
    if (!vetPhone) {
      throw new Error('Vet phone number not configured');
    }

    // Fetch recent observations for context
    const { db } = window.HC;
    const animal = await db.getAnimal(animalId);
    const obs = await db.observationsFor(animalId);
    const latest = obs[0];

    // Build message
    const message = buildSmsMessage(animal, latest, photoUrl);

    // Try to send immediately
    const actionId = db.uid();
    const action = {
      id: actionId,
      animalId,
      kind: 'sms_vet_alert',
      ts: new Date().toISOString(),
      status: 'pending',
      vetPhone,
      message,
      photoUrl,
      response: null,
      error: null
    };

    try {
      const result = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vetPhone,
          message,
          photoUrl,
          animalId,
          actionId
        })
      });

      if (!result.ok) {
        const err = await result.json();
        throw new Error(err.error || result.statusText);
      }

      const data = await result.json();
      action.status = 'sent';
      action.response = data;
    } catch (err) {
      // Queue for later if network error
      console.warn('SMS send failed (will queue):', err.message);
      action.status = 'pending';
      action.error = err.message;
    }

    // Always save the action record
    await db.saveSentAction(action);
    return action;
  }

  function buildSmsMessage(animal, latestObs, photoUrl) {
    const animalLabel = animal.name && animal.tag
      ? `${animal.name} (${animal.tag})`
      : (animal.name || animal.tag || 'Animal');

    let msg = `🚨 ALERT: ${animalLabel}\n`;

    if (latestObs) {
      const kind = latestObs.kind;
      const tier = latestObs.tier || 'unknown';

      if (kind === 'lameness') {
        const score = latestObs.data?.locomotionScore;
        msg += `Lameness: RED ALERT (${score}/5)\n`;
        msg += `—\n`;
        msg += `Recommended actions:\n`;
        msg += `1. Inspect hooves for ulcers/cracks\n`;
        msg += `2. Move to soft bedding\n`;
        msg += `3. Call vet if wound visible\n`;
      } else if (kind === 'mastitis') {
        msg += `Mastitis: ${tier.toUpperCase()} ALERT\n`;
        msg += `—\n`;
        msg += `Recommended actions:\n`;
        msg += `1. Check all 4 quarters\n`;
        msg += `2. Culture milk if available\n`;
        msg += `3. Start treatment per local protocol\n`;
      } else if (kind === 'calving') {
        msg += `Calving: ${tier.toUpperCase()} ALERT\n`;
        msg += `—\n`;
        msg += `Recommended actions:\n`;
        msg += `1. Prepare calving area\n`;
        msg += `2. Monitor closely\n`;
        msg += `3. Call vet if straining > 2 hours\n`;
      }
    }

    if (photoUrl) {
      msg += `\nPhoto: ${photoUrl}\n`;
    }

    msg += `\nSent from HerdCheck app`;

    return msg;
  }

  // Sync pending actions when back online
  async function syncPendingActions() {
    const { db } = window.HC;
    const pending = await db.pendingSentActions();

    for (const action of pending) {
      try {
        const result = await fetch(API_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            vetPhone: action.vetPhone,
            message: action.message,
            photoUrl: action.photoUrl,
            animalId: action.animalId,
            actionId: action.id
          })
        });

        if (result.ok) {
          const data = await result.json();
          action.status = 'sent';
          action.response = data;
          action.error = null;
          await db.saveSentAction(action);
        }
      } catch (err) {
        console.warn(`Failed to sync action ${action.id}:`, err.message);
      }
    }
  }

  // Attach sync to online event
  window.addEventListener('online', syncPendingActions);

  window.HC = window.HC || {};
  window.HC.sms = {
    sendVetAlert,
    syncPendingActions,
    buildSmsMessage
  };
})();
