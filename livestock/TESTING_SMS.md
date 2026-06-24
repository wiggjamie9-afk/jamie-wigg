# HerdCheck SMS Vet Alert Testing Guide

## Week 1 Phase 1: SMS Action Layer

### Feature Overview
- Red-tier screening results show "Send alert to vet?" button
- Button click composes SMS with animal history and sends to farmer-entered vet phone
- Offline queue: if no network, SMS queues and sends on reconnection
- Action stored in IndexedDB for history

### How to Test Locally

#### 1. Setup
1. Open `livestock/index.html` in a browser (mobile or desktop)
2. Add a test animal (e.g., tag "TEST-001", species "Cow")
3. Go to **Settings** tab
4. Enter a test vet phone number (e.g., `+1234567890`)
5. Save

#### 2. Create a Red-Tier Lameness Check
1. Go to **Herd** tab
2. Click the test animal card
3. Tap **Lameness check**
4. Record a short video (any movement will do)
5. Select locomotion score **4 or 5** (red tier triggers on 4-5)
6. Click **Save check**

#### 3. Observe Result Screen
- Result screen shows "🚨 Urgent" card (red tier)
- Below the result body, you see **"Send alert to vet"** button
- Button is **yellow/warning** colored (distinct from primary button)

#### 4. Test SMS Send
1. Click **"Send alert to vet"** button
2. Watch button text change to "Sending..."
3. Button temporarily disables
4. After ~300ms (mock API delay):
   - Button returns to normal state
   - **Toast notification** appears: "Alert sent to vet"
5. Check **browser console** (F12 → Console):
   - Log entry shows mock SMS delivery:
     ```
     [Mock SMS API] Sending message: {
       to: "+1234567890",
       message: "🚨 ALERT: TEST-001...",
       actionId: "<uuid>"
     }
     ```

#### 5. Verify IndexedDB Storage
1. Open DevTools (F12)
2. Go to **Application** → **IndexedDB** → **herdcheck**
3. Click **sent_actions** store
4. You should see a record with:
   - `kind: "sms_vet_alert"`
   - `status: "sent"` (if network available) or `"pending"` (if offline)
   - `vetPhone: "+1234567890"`
   - `message: "🚨 ALERT: <animal>..."`
   - `ts: "<ISO timestamp>"`
   - `response: { success: true, messageId: "...", status: "sent" }`

#### 6. Test Offline Queue (Advanced)
1. Open DevTools → **Network** tab
2. Throttle to **Offline** mode
3. Create another red-tier check (repeat steps 2-5)
4. Click "Send alert to vet"
5. Toast shows: "Alert queued (will send when online)"
6. Verify IndexedDB shows `status: "pending"`
7. Switch back **Online** in DevTools
8. Trigger `window.HC.sms.syncPendingActions()` in console
9. Toast should appear: "Alert sent to vet"
10. Verify IndexedDB now shows `status: "sent"`

#### 7. Test No Vet Phone Configured
1. Clear the **Vet phone** field in Settings
2. Create a red-tier check
3. Click "Send alert to vet"
4. Toast error: "Could not send alert: Vet phone number not configured"

#### 8. Test Non-Red Tiers
1. Create a check with score **2–3** (amber/green tier)
2. Result screen shows the result card
3. **"Send alert to vet" button is NOT visible** (only appears on red tier)

### Message Template Example

When you send an alert for a red lameness check:
```
🚨 ALERT: TEST-001 (Cow)
Lameness: RED ALERT (5/5)
—
Recommended actions:
1. Inspect hooves for ulcers/cracks
2. Move to soft bedding
3. Call vet if wound visible

Sent from HerdCheck app
```

### Files Modified / Created

**Modified:**
- `livestock/db.js` — added `sent_actions` store (v1→v2 schema)
- `livestock/index.html` — added vet phone settings field, SMS button to result screen
- `livestock/app.js` — settings handler, SMS send logic, result screen conditional rendering
- `livestock/i18n.js` — English & Hindi translations for SMS strings
- `livestock/app.css` — `.btn-warning` styling

**Created:**
- `livestock/lib/sms.js` — SMS client (send, queue, sync)
- `livestock/api/sms/send/route.js` — Cloudflare Worker (production) 
- `livestock/api-mock.js` — mock API for local testing
- `livestock/TESTING_SMS.md` — this guide

### Production Deployment

When deploying to production:

1. **Cloudflare Worker:**
   - Deploy `livestock/api/sms/send/route.js` to Cloudflare Workers
   - Set environment secrets: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`
   - Bind KV namespace `KV_SMS_LOG` for audit trail (optional)

2. **Twilio Integration:**
   - In `api/sms/send/route.js`, uncomment the Twilio code block
   - Use Twilio Node.js SDK to send real SMS

3. **Disable Mock API:**
   - Remove or comment-out the `<script src="api-mock.js">` line in index.html
   - Real endpoint at `/api/sms/send` will handle requests

### Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| "Send alert to vet" button not visible on red tier | CSS or HTML not loaded | Check DevTools → Elements for `#result-actions` div |
| Button click does nothing | SMS library not loaded | Check `<script src="lib/sms.js">` in HTML |
| Toast shows "Could not send alert: Vet phone not configured" | Vet phone field is empty | Ensure you saved a phone in Settings |
| IndexedDB has no `sent_actions` store | Schema v1 still in use | Clear browser storage (Settings → Reset) and reload |
| Console shows "TypeError: window.HC.sms is undefined" | sms.js didn't load | Check network tab for 404s; verify script src path |

### Next Steps (Phase 2)

- Co-op CSV auto-reporting (bulk exports to co-op API)
- Vet on-call callback (SMS → vet phone triggers their response workflow)
- SMS delivery status tracking (from Twilio webhook)
- Multi-language SMS templates

---
**Status:** Week 1 Phase 1 ✅ SMS vet-alert action layer
**Last Updated:** 2026-06-24
