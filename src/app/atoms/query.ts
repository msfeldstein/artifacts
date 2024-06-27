"use client";
import { getDefaultStore } from "jotai";
import { currentSketchAtom, loadingAtom } from "./appstate";
import { preludeGenerate } from "../util/sketches";
import generate from "../util/ai";

const store = getDefaultStore();

export default async function query(currentSketch: string, query: string) {
  store.set(loadingAtom, true);

  const prompt =
    preludeGenerate + "[BEGIN]\n" + currentSketch + "\n[END]\n\n" + query;
  console.log("About to do it");
  const text = await generate(prompt);
  const result = text.replaceAll("[BEGIN]", "").replaceAll("[END]", "").trim();
  store.set(currentSketchAtom, result);
  store.set(loadingAtom, false);
  console.log("Got result", result);
}
