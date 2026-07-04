# Brainwave Analyzer (Web Edition)

Self-contained, in-browser EEG/brainwave spectral tool. Import raw samples, compute
an FFT, split the spectrum into **Delta / Theta / Alpha / Beta / Gamma** bands, graph
the result, run **phase-amplitude cross-frequency coupling**, and export to CSV.
No upload, no server — everything runs client-side.

## Features

1. **Load signal** — CSV import (OpenVibe / MindwaveReader512 / generic single- or
   multi-column). Auto-detects delimiter + header, infers sample rate from a `Time`
   column, or click **Load sample signal** for a synthetic demo.
2. **Editable band ranges** — the "flexible" edition; change any band's Hz range and
   the results re-bin live.
3. **Frequency spectrum** — FFT (Hann window, DC-removed, zero-padded to a power of 2)
   with band tints.
4. **Band power** — absolute + relative % per band, bar chart + table.
5. **Cross-frequency coupling (PAC)** — bandpass + Hilbert analytic signal → phase of
   a low band vs amplitude of a high band; phase-amplitude plot, modulation index, and
   a surrogate (shuffled-amplitude) significance test. See
   [`cross-frequency-coupling.md`](cross-frequency-coupling.md).

Export the band table as `brainwave-bands.csv`.

## Run

```bash
python3 -m http.server 8000 --directory sites/brainwave-analyzer
# → http://localhost:8000
```
Or just open `index.html` (works from `file://`).

## Implementation notes

- **FFT** — iterative radix-2 Cooley–Tukey, after
  [Project Nayuki's free small FFT](https://www.nayuki.io/page/free-small-fft-in-multiple-languages).
  Inverse FFT via conjugation.
- **Bandpass** — forward FFT → zero bins outside the passband (signed frequency) →
  inverse FFT. Note: a high band must be **wide enough to include the modulation
  sidebands** (carrier ± modulation freq) or PAC will be flattened out — the defaults
  (30–50 Hz for the 40 Hz demo carrier) account for this.
- **Analytic signal / Hilbert** — zero negative frequencies, double the positives.
- Fits this repo's frequency/resonance work (`resonance.html`, `frequency.html`,
  RHYTHMIX resonance apps).

Free & open source · a project of [Brainwaves.io](http://brainwaves.io/wp/).
