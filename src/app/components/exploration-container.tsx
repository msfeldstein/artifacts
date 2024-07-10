import { useAtomValue, useSetAtom } from "jotai";
import {
  currentSketchAtom,
  explorationInfoAtom,
  sketchesAtom,
} from "../atoms/appstate";
import { useCallback } from "react";

export default function ExplorationContainer() {
  const infos = useAtomValue(explorationInfoAtom);
  const sketches = useAtomValue(sketchesAtom);
  const setCurrentSketch = useSetAtom(currentSketchAtom);

  const choose = useCallback(
    (i: number) => {
      setCurrentSketch(sketches[i]);
    },
    [setCurrentSketch, sketches]
  );
  if (infos.length === 0) return null;
  return (
    <div className="ExplorationsContainer">
      {infos.map((info, i) => {
        return (
          <div key={`frame${i}`} onClick={() => choose(i)}>
            <div className="ExplorationInfo">{info.title}</div>
            <div className="iframeContainer">
              <iframe
                src={"/viewer.html?sketch=" + encodeURIComponent(sketches[i])}
                width={600}
                height={600}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
