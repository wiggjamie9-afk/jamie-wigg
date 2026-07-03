import { interpolate } from "remotion";

/**
 * Shared motion language for the promo. The goal is coordinated, music-reactive
 * movement — everything pulses to the same beat and drifts with the same slow
 * "camera" — which is what separates a premium piece from stacked fades.
 */

/** Tempo of the imaginary track driving the pulses. Energetic but not frantic. */
export const BPM = 100;

/** Confident eases per DESIGN.md — fast in, decisive hold, no bounce. */
export const expoOut = (x: number): number =>
  x >= 1 ? 1 : 1 - Math.pow(2, -10 * x);
export const cubicOut = (x: number): number => 1 - Math.pow(1 - x, 3);
export const cubicInOut = (x: number): number =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

/**
 * A decaying beat envelope: 1.0 on the downbeat, easing to 0 before the next.
 * Feed it into glow/scale so the whole frame breathes on tempo.
 */
export const beatPulse = (frame: number, fps: number): number => {
  const framesPerBeat = (60 / BPM) * fps;
  const phase = (frame % framesPerBeat) / framesPerBeat;
  return Math.pow(1 - phase, 2.4);
};

/** Slow continuous zoom for life in otherwise-static scenes (Ken Burns). */
export const kenBurns = (
  frame: number,
  duration: number,
  from = 1,
  to = 1.07,
): number =>
  interpolate(frame, [0, duration], [from, to], {
    extrapolateRight: "clamp",
  });

/** Ease a value in over [start, start+len] with a supplied easing fn. */
export const ramp = (
  frame: number,
  start: number,
  len: number,
  easing: (x: number) => number = expoOut,
): number =>
  interpolate(frame, [start, start + len], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });
