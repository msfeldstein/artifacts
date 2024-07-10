import { useAtomValue } from "jotai";
import { currentSketchAtom, loadingAtom } from "../atoms/appstate";
import explore from "../atoms/explore";

export default function ActionButtons() {
  const loading = useAtomValue(loadingAtom);
  const currentSketch = useAtomValue(currentSketchAtom);
  return (
    <div id="floating-action-buttons">
      <button
        disabled={loading}
        className="button"
        onClick={(e) => explore(currentSketch)}
      >
        Create Explorations
      </button>
    </div>
  );
}
