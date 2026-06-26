# Studio License Flow — Dry-Run Notes & Gaps (T1.6)

*What the license path does today, and what's needed to make a real dollar flow.
Read directly from `studio/workers/license/src/index.ts`.*

---

## The path, end to end

```
Buyer pays on Gumroad ($149 lifetime SKU)
        │  Gumroad issues a license key (XXXXXXXX-XXXXXXXX-…)
        ▼
Studio client  POST https://license.studio.starlightmix.com/api/license  { key }
        │
        ▼
license Worker
  1. CORS check (origin must be allowed — see gap #1)
  2. soft IP rate-limit (20/min/isolate)
  3. validate key shape ([A-Za-z0-9-], 8–128 chars)
  4. KV cache hit?  →  { valid: true, tier }   (24 h TTL)
  5. else verify with Gumroad  POST /v2/licenses/verify { product_id, license_key }
  6. success → deriveTier() → cache → { valid: true, tier: "lifetime"|"monthly" }
  7. failure → { valid: false }  (NOT cached — a Gumroad blip won't lock a buyer out)
```

The Worker is **well-built**: never logs the key/PII, caches valid-only, fails
open on KV errors, returns 503 (not a false "invalid") on Gumroad transport
errors. It does **not** see the user's Replicate token (correct — that's separate).

---

## What's required to go live (the `You` gates)

1. **Create the Gumroad product** — a lifetime SKU. The code already expects
   `$149` and matches the word **"lifetime"** in the variant/product name, so
   name the variant accordingly.
2. **`wrangler secret put GUMROAD_PRODUCT_ID`** in `studio/workers/license/`.
3. **Bind the KV namespace** `LICENSE_CACHE` in `wrangler.toml`.
4. **Deploy** the Worker (`wrangler deploy`) and confirm it answers at
   `license.studio.starlightmix.com/api/license`.
5. **One test purchase** → confirm the key validates and Studio unlocks.

---

## Findings (worth fixing before launch)

### Gap #1 — Preview-deploy CORS origin mismatch (likely real bug)
The Worker allows preview origins ending in **`.studio.rhythmixapp-pages.dev`**
(`index.ts:34`). But `CLAUDE.md` documents Studio previews deploying to
**`https://<branch>.starlightmix-studio.pages.dev`**. If the Pages project domain
is `starlightmix-studio.pages.dev`, **preview deploys will fail license CORS** and
licensing won't work on any non-production branch.
→ **Action:** confirm the real Pages preview domain and reconcile the allowed
suffix. Trivial fix, but it silently breaks preview testing of the paid path.

### Gap #2 — Price inconsistency in our own docs
The Worker comments hard-code the **$149 lifetime** price (`index.ts:286`). The
first draft of `BUSINESS-GUIDE.md` suggested a $49–$99 anchor. **$149 is the
source of truth** (it's in shipped code). The business guide's pricing line
should be read as "validate the $149 anchor," not "pick a new number."
→ **Action:** treat $149 as the live price; A/B only after baseline conversion data.

### Note — tier semantics are lenient by design
`deriveTier()` treats any non-subscription purchase as `lifetime`, and a refunded/
cancelled purchase still returns valid *if* Gumroad returns `success: true`
(Gumroad would return `success: false` for a refund). This is intentional and
fine — just know that revocation depends on Gumroad's own success flag, not our
logic.

---

## Verdict

The hard part (a correct, private, abuse-resistant license endpoint) is **done**.
Remaining work is **configuration + one test purchase**, plus the small CORS
reconciliation (Gap #1). This is the closest thing in the whole ecosystem to a
working revenue loop — which is why the backlog makes it Week-1 critical path.
```
