# Cross-Frequency Coupling (phase–amplitude) — method notes

Reference notes for §5 of the Brainwave Analyzer. The method follows the standard
phase-amplitude coupling (PAC) recipe from computational-neuroscience teaching
material (Kramer & Eden, *Case-Studies-Python*), reimplemented here to run entirely
in the browser (no SciPy / MATLAB / `.mat` files needed).

> **Goal:** determine whether the *phase* of a low-frequency rhythm modulates the
> *amplitude* of a high-frequency rhythm.

## The three steps (and where they live in `index.html`)

1. **Filter into low- and high-frequency bands.**
   The reference notebook uses an FIR filter (`scipy.signal.firwin` + `filtfilt`);
   here we filter in the frequency domain — forward FFT, zero every bin whose |frequency|
   is outside the passband, inverse FFT (`bandpass()`).

2. **Extract phase and amplitude via the analytic signal (Hilbert transform).**
   The analytic signal `z = x + i·H(x)` has no negative frequencies; we build it by
   zeroing negative-frequency FFT bins and doubling the positives (`analytic()`).
   - low band → **phase** `φ = atan2(Im z, Re z)`
   - high band → **amplitude** `A = |z|`

3. **Relate phase to amplitude.**
   Bin `φ` into 18 bins over `[-π, π]`, take the mean `A` per bin → the
   phase-amplitude plot. Two summary statistics:
   - **h** = max − min of the mean-amplitude curve.
   - **Modulation Index (MI)** — Kullback–Leibler divergence of the normalized
     amplitude distribution from uniform (Tort et al.), normalized by `log(nBins)`.
   Significance is assessed with a **surrogate test**: shuffle the amplitude series
   (breaking its timing relationship to phase) N times, recompute `h`, and report the
   fraction of surrogate `h` values ≥ the observed `h` as a p-value.

## Practical caveat baked into the tool

A modulated high-frequency carrier at `f_c` with modulation frequency `f_m` has
**sidebands at `f_c ± f_m`**. If the high band is narrower than `2·f_m`, the bandpass
removes those sidebands and the extracted amplitude envelope goes flat — PAC vanishes
even when it exists. The demo signal (40 Hz γ modulated by 6 Hz θ) therefore uses a
high band of **30–50 Hz**, not 35–45 Hz, so the 34/46 Hz sidebands survive.

## Citation

For academic work using frequency-resolved brain-network analysis, cite:

> Rosso, M., Fernández-Rubio, G., Keller, P. E., Brattico, E., Vuust, P.,
> Kringelbach, M. L., & Bonetti, L. (2025). *FREQ-NESS Reveals the Dynamic
> Reconfiguration of Frequency-Resolved Brain Networks During Auditory Stimulation.*
> Advanced Science, 2413195. https://doi.org/10.1002/advs.202413195

Method/pedagogy after Kramer & Eden, *Case-Studies-Python* (Hilbert transform,
analytic signal, PAC, surrogate resampling).
