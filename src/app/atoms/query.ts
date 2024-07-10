"use client";
import { getDefaultStore } from "jotai";
import {
  currentSketchAtom,
  lastUpdatedCharacter,
  loadingAtom,
} from "./appstate";
import { preludeGenerate } from "../util/sketches";
import generate, { stream } from "../util/ai";
import { readStreamableValue } from "ai/rsc";

const store = getDefaultStore();

export default async function query(currentSketch: string, query: string) {
  store.set(loadingAtom, true);

  const prompt =
    preludeGenerate + "[BEGIN]\n" + currentSketch + "\n[END]\n\n" + query;
  const streamResp = await stream(prompt);
  console.log({ streamResp });
  let stringBuilder = "";
  let newSketch = currentSketch;
  for await (let data of readStreamableValue(streamResp.output)) {
    stringBuilder = stringBuilder + data;
    const result = stringBuilder
      .replaceAll("[BEGIN]", "")
      .replaceAll("[END]", "")
      .trim();
    newSketch = result + newSketch.substring(result.length);
    store.set(lastUpdatedCharacter, result.length);
    store.set(currentSketchAtom, newSketch);
  }

  // store.set(currentSketchAtom, result);
  store.set(lastUpdatedCharacter, null);
  store.set(loadingAtom, false);
}
