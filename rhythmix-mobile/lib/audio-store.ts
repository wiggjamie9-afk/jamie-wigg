import { create } from 'zustand';

export interface Track {
  id: string;
  title: string;
  artist: string;
  artworkUrl?: string;
  audioUrl: string;
  durationSec?: number;
}

interface AudioState {
  current: Track | null;
  queue: Track[];
  isPlaying: boolean;
  positionSec: number;

  setCurrent: (t: Track | null) => void;
  setQueue: (q: Track[]) => void;
  setPlaying: (p: boolean) => void;
  setPosition: (s: number) => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  current: null,
  queue: [],
  isPlaying: false,
  positionSec: 0,

  setCurrent: (t) => set({ current: t }),
  setQueue: (q) => set({ queue: q }),
  setPlaying: (p) => set({ isPlaying: p }),
  setPosition: (s) => set({ positionSec: s }),
}));
