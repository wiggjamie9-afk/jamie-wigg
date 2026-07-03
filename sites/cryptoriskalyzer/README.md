# hAI.CryptoRiskalyzer

Instant Krypto-Risiko-Score (0–100) auf Basis von **6 AI-Kategorien**. Reine
Frontend-Anwendung (kein Backend), Dark-Theme mit Glassmorphismus.

> ⚠️ **Keine Anlageberatung.** Nur zu Informationszwecken. Krypto-Investitionen
> sind hochriskant.

## ✨ Features

| Feature | Beschreibung |
|---|---|
| ⚡ Instant Risiko-Score (0–100) | Gewichtete Gesamtbewertung aus 6 Kategorien |
| 📋 Smart Contract Prüfung | Unverifizierter Code, Proxy-Muster, Mint/SelfDestruct |
| 💧 Liquiditäts-Check | Unlocked Liquidity (Rug-Pull), LP-Token-Locks |
| 👛 Wallet-Verteilung | Gefährliche Token-Konzentration |
| 🍯 Honeypot-Detektor | Buy/Sell-Simulation, blockierte Sells |
| 🔑 Ownership-Analyse | Owner-Rechte, Blacklist, Mint-Privilegien |
| 📊 Trading-Pattern | Wash-Trading, Bots, Pump & Dump, MEV |

Multi-Chain: Ethereum · BSC · Polygon · Base · Solana.
Animierter Ring-Score mit Counter, schrittweise Analyse-Anzeige, voll responsiv,
`prefers-reduced-motion`-freundlich.

## ⚠️ Wichtiger Hinweis zur Engine

Diese Version enthält **keinen Live-On-Chain-Abruf**. `js/analyzer.js` erzeugt
eine **deterministische Simulation** aus der eingegebenen Adresse (Hash + PRNG),
damit die UI ohne API-Keys und ohne Netzwerkzugriff reproduzierbar läuft.
Für echte Analysen müssten Explorer-/RPC-/Honeypot-APIs (z. B. Etherscan,
GoPlus, Honeypot.is) angebunden werden — die Kategorie-Struktur ist dafür bereits
vorbereitet.

## 🚀 Lokale Nutzung

```bash
# Empfohlen (wegen fetch der Marktdaten):
npx serve .
# oder
python3 -m http.server 8080
# → http://localhost:8080
```
`file://` funktioniert auch, dann greift für die Marktdaten der eingebettete
Fallback (kein `fetch`).

## 📁 Struktur

```
sites/cryptoriskalyzer/
├── index.html
├── css/style.css
├── js/analyzer.js   # 6-Kategorien-Engine (simuliert)
├── js/app.js        # UI-Controller
├── js/market.js     # Marktdaten-Banner
├── data/market-data.json
└── .github/workflows/   # REFERENZ (siehe Hinweis unten)
```

## 🤖 GitHub Actions (Referenz)

Die beiden Workflows unter `.github/workflows/` sind **Referenzkopien**. GitHub
Actions führt Workflows nur aus dem **Repository-Root** `.github/workflows/` aus —
nicht aus Unterordnern. Um sie zu aktivieren, dieses Projekt in ein eigenes Repo
auslagern (oder die Dateien ins Root verschieben und Pfade anpassen).

- `daily-data-update.yml` — holt täglich (06:00 UTC) Fear & Greed + Trending und committet `data/market-data.json`
- `pages-deploy.yml` — deployt auf GitHub Pages

## 📝 Lizenz

MIT — siehe [LICENSE](LICENSE).
