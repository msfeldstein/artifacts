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
  const response = await fetch("/api/ai", {
    method: "POST",
    body: JSON.stringify({ prompt }),
  });
  const data = response.body;
  if (!data) {
    return;
  }
  const reader = data.getReader();
  const decoder = new TextDecoder();
  let done = false;

  let stringBuilder = "";
  let newSketch = currentSketch;
  while (!done) {
    const { value, done: doneReading } = await reader.read();
    done = doneReading;
    const chunkValue = decoder.decode(value);
    stringBuilder = stringBuilder + chunkValue;
    const result = stringBuilder
      .replaceAll("[BEGIN]", "")
      .replaceAll("[END]", "")
      .trim();
    newSketch = result + newSketch.substring(result.length);
    store.set(lastUpdatedCharacter, result.length);
    store.set(currentSketchAtom, newSketch);
  }

  store.set(lastUpdatedCharacter, null);
  store.set(loadingAtom, false);
}
