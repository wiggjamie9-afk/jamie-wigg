# PLUMB

**Walk the job. Get the punchlist.**

## Pitch
Solo contractor walks the site with their phone. AR auto-annotates defects: off-plumb walls, missing trim, paint scuffs, code violations. App generates a client-facing report + change-order. Buildots/OpenSpace charge $50k+/year and only sell to general contractors. The 700k US small contractors + millions of solo remodelers globally have nothing.

## TAM
- **US small construction:** 700k firms < 10 employees (Census Bureau). Solo trades + 1-truck shops.
- **Canada / UK / AU:** ~300k equivalent (adjusted for population).
- **Latin America / Asia:** millions more — Brazil alone has 1.5M+ small construction firms.
- **Enterprise penetration:** <2% of small-firm market uses any digital punchlist tool today. The market is clipboards and iPhone photos.

## Who buys
- Remodelers (kitchen / bath / whole-home)
- Painters (residential + light commercial)
- Drywallers, finishers
- Electricians and plumbers (different defect taxonomy)
- Home inspectors (different SKU — buyer's report)
- Insurance claims adjusters (third-party niche)

## Why now
- iPhone Pro models ship LiDAR — plumb / level / squareness measurable without a separate tool.
- Small on-device vision models (sub-100MB) can detect common construction defects in real-time.
- ARKit / ARCore mature — overlaying annotations on live video is one API call.
- Insurance industry digitizing claim documentation; punchlists are claims input.

## Tech
- **Detection:** custom vision model on common defects (paint, drywall, trim, electrical cover plates, fixture installs). Trained on annotated job-site photo dataset.
- **Measurement:** ARKit RoomPlan + LiDAR for plumb / level / dimension. Android: Google ARCore with reduced feature set.
- **Report engine:** templated PDFs with photo grids, severity, estimated remediation cost (lookup table per region).
- **Offline-first:** job sites have terrible cell coverage. Captures local; syncs when in coverage.
- **Client signature flow:** in-app e-sign; PDF emailed.

## Pricing
- **$39/mo solo** — single user, unlimited jobs.
- **$79/mo crew** — up to 5 users, shared job library.
- **$399/yr** — annual prepay lifetime-ish.
- **Insurance B2B:** $2-5 per claim documentation, white-label.

## 90-day GTM
- **Days 1-30:** Ship MVP for ONE trade — kitchen/bath remodelers. Defect taxonomy of 25 common findings. Test with 10 contractors via Reddit r/Contractor and YouTube DIY-remodel community.
- **Days 31-60:** TikTok partnership with one-truck-influencers (e.g. "@thefinishcarpenter" types). High organic engagement in trades content. UGC videos of contractors using PLUMB on real jobs.
- **Days 61-90:** Home Depot Pro counter pilot — Pro account holders get free trial. The Pro Desk is where solo contractors gather; gets in front of the buyer.

## Moat
- **Defect taxonomy depth:** kitchen-bath vs. exterior paint vs. electrical require different models. Each vertical = 6+ months of training data.
- **Insurance partnerships:** if Lemonade/Hippo accept PLUMB punchlists as primary claim documentation, contractors must use it to get paid faster.
- **Trade-specific UX:** electricians don't want a remodeler's UI. Per-trade SKUs are hard to copy fast.

## Tone notes
Marketing copy stays blue-collar, blunt, no-bullshit, money-forward. No SaaS jargon, no glassmorphism, no "platform." Contractors smell startup-y design from a mile away and reject it.
