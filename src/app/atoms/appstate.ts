import { atom } from "jotai";
import { defaultScript } from "../util/sketches";

export const loadingAtom = atom<boolean>(false);
export const lastErrorAtom = atom<string | null>(null);
export const lastUpdatedCharacter = atom<number | null>(null);

export const currentSketchAtom = atom<string>(defaultScript);
export const sketchesAtom = atom<string[]>([]);

export type ExplorationInfo = {
  title: string;
  description: string;
};
export const explorationInfoAtom = atom<ExplorationInfo[]>([]);
