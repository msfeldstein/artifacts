import { atom } from "jotai";
import { defaultScript } from "../util/sketches";

export const loadingAtom = atom<boolean>(false);
export const lastErrorAtom = atom<string | null>(null);

export const currentSketchAtom = atom<string>(defaultScript);
export const sketchesAtom = atom<string[]>([]);
export const explorationInfoAtom = atom<string[]>([]);
