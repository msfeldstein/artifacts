import monaco from "monaco-editor";
import { Editor, Monaco } from "@monaco-editor/react";
import { types } from "../util/p5types";
import { currentSketchAtom, lastUpdatedCharacter } from "../atoms/appstate";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useRef } from "react";

type Position = {
  line: number;
  column: number;
};

function findLineAndColumn(code: string, index: number): Position {
  console.log(index, code.length);
  if (index < 0 || index > code.length) {
    throw new Error("Index out of bounds");
  }

  let line = 1;
  let column = 1;

  for (let i = 0; i < index; i++) {
    if (code[i] === "\n") {
      line++;
      column = 1;
    } else {
      column++;
    }
  }

  return { line, column };
}

export default function P5Editor() {
  const [currentSketch, setCurrentSketch] = useAtom(currentSketchAtom);
  const lastUpdatedCharacterValue = useAtomValue(lastUpdatedCharacter);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  function handleEditorDidMount(
    editor: monaco.editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) {
    editorRef.current = editor;
    // play();
    // editor.addAction({
    //   id: "run-sketch",
    //   label: "Run Sketch",
    //   keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
    //   run: play,
    // });
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2016,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      typeRoots: ["node_modules/@types"],
      jsx: monaco.languages.typescript.JsxEmit.React,
      jsxFactory: "JSXAlone.createElement",
    });
  }

  useEffect(() => {
    if (!lastUpdatedCharacterValue) return;
    const start = findLineAndColumn(currentSketch, lastUpdatedCharacterValue);
    const end = findLineAndColumn(
      currentSketch,
      lastUpdatedCharacterValue - 10
    );
    const selection = {
      startColumn: Math.max(0, start.column),
      startLineNumber: Math.max(0, start.line),
      endColumn: Math.max(0, end.column),
      endLineNumber: Math.max(0, end.line),
    };
    console.log("Setting selection", selection);
    editorRef.current?.setSelection(selection);
  }, [lastUpdatedCharacterValue, currentSketch]);

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
