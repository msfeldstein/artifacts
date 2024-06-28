"use client";

import { getDefaultStore } from "jotai";
import {
  ExplorationInfo,
  explorationInfoAtom,
  loadingAtom,
  sketchesAtom,
} from "./appstate";
import { preludeExplore } from "../util/sketches";
import generate from "../util/ai";

const store = getDefaultStore();

const fetchExploration = async (
  existingSketch: string,
  newIdea: ExplorationInfo
) => {
  const prompt = `We have an existing p5.js sketch that we'd like to explore a new direction for.  
  Return only the code with no editorialization (comments are ok).  
  Please rewrite it using this new idea: ${newIdea.title}: ${newIdea.description}
  
  ${existingSketch}`;
  console.log("Prompt", prompt);

  let sketch = await generate(prompt);
  sketch = sketch.replaceAll("```javascript", "").replaceAll("```", "");
  return sketch;
};

export default async function explore(existingSketch: string) {
  store.set(loadingAtom, true);
  const newSketches: string[] = [];
  let newInfos: ExplorationInfo[] = [];
  store.set(explorationInfoAtom, newInfos);

  const explorations = await generate(
    `Help me generate 3 different variations on this creative p5.js sketch.  Give me 3 ideas, one on each new line, with nothing else. Your response should be nothing but three lines of ideas.  Each line should have a short title of the sketch and then a description of what you will try.  I'll provide the existing code below
    
    ${existingSketch}`
  );
  console.log("Got explorations", explorations);
  newInfos = explorations
    .split("\n")
    .filter((s) => s.length > 0)
    .map((s) => {
      const parts = s.split(": ");
      return {
        title: parts[0].trim(),
        description: parts[1].trim(),
      };
    });
  store.set(explorationInfoAtom, newInfos);

  for (var i = 0; i < 3; i++) {
    console.log("Querying", i);
    // @ts-ignore
    let sketch = await fetchExploration(existingSketch, newInfos[i]);
    newSketches.push(sketch);
    store.set(sketchesAtom, newSketches);
  }
  store.set(loadingAtom, false);
}
