# Frequency AI — landing page

Self-contained static landing page for **Frequency AI** (autonomous lead extraction &
workflows, San Antonio). Dark glassmorphism, violet accent.

## Files

| File | Purpose |
|---|---|
| `index.html` | Self-contained static page (inline CSS + JS, no build). Viewable now. |
| `FrequencyAiPage.tsx` | The original React / Tailwind component, kept for when the React app exists. |

## Static vs React

The `.tsx` needs a React + Tailwind host with the project's custom `brand-*` design
tokens (`brand-dark`, `brand-accent`, `glass-card`, `font-display`, …) and
`lucide-react`. Since that host isn't in this repo, `index.html` is a faithful
**framework-free conversion** — same layout, hero, video slideshow with lightbox
modal, radar animation, feature sections and CTA — using inline SVG icons and a
violet accent (`#8b5cf6`).

External media (mixkit demo clips, a postimg thumbnail, Kapwing embeds) load in a
real browser; the CTA button is a stub (`onclick`) — wire it to your contact/audit flow.

## Run

```bash
python3 -m http.server 8000 --directory sites/frequency-ai
# → http://localhost:8000
```
