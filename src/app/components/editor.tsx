import monaco from "monaco-editor";
import { Editor, Monaco } from "@monaco-editor/react";
import { types } from "../util/p5types";
import { currentSketchAtom } from "../atoms/appstate";
import { useAtom } from "jotai";
import { useRef } from "react";

export default function P5Editor() {
  const [currentSketch, setCurrentSketch] = useAtom(currentSketchAtom);

  function handleEditorDidMount(
    editor: monaco.editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) {
    // play();
    // editor.addAction({
    //   id: "run-sketch",
    //   label: "Run Sketch",
    //   keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
    //   run: play,
    // });
    monaco.languages.typescript.javascriptDefaults.addExtraLib(types);
  }

  return (
    <div className="EditorContainer">
      <Editor
        value={currentSketch}
        onChange={(v) => {
          setCurrentSketch(v!);
        }}
        theme="vs-dark"
        onMount={handleEditorDidMount}
        defaultLanguage="javascript"
        options={{
          minimap: { enabled: false },
          language: "javascript",
          hideCursorInOverviewRuler: true,
          overviewRulerBorder: false,
          overviewRulerLanes: 0,
          scrollBeyondLastLine: false,
        }}
      />
    </div>
  );
}
