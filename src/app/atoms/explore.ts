"use client";

import { getDefaultStore } from "jotai";
import { explorationInfoAtom, loadingAtom, sketchesAtom } from "./appstate";
import { preludeExplore } from "../util/sketches";
import generate from "../util/ai";

const store = getDefaultStore();

const fetchExploration = async (
  existingSketch: string,
  existingIdeas: string[]
) => {
  let existingIdeasStr =
    existingIdeas.length > 0
      ? `We've already tried ${existingIdeas
          .map((i) => `"${i.trim()}"`)
          .join(" and ")} so please try a different direction\n\n`
      : "";

  const prompt = preludeExplore + existingIdeasStr + existingSketch;
  const result = await generate(prompt);
  let [info, sketch] = result.split("```");
  console.log({ result, info, sketch });
  sketch = sketch.replace("javascript", "");
  console.log({ info, sketch });
  return [info, sketch];
};

export default async function explore(existingSketch: string) {
  store.set(loadingAtom, true);
  const newSketches = [];
  const newInfos = [];
  for (var i = 0; i < 3; i++) {
    console.log("Querying", i);
    // @ts-ignore
    let [info, sketch] = await fetchExploration(existingSketch, newInfos);
    newSketches.push(sketch);
    newInfos.push(info);
  }
  store.set(sketchesAtom, newSketches);
  store.set(explorationInfoAtom, newInfos);
  store.set(loadingAtom, false);
}
