"use client";
import Image from "next/image";
import styles from "./page.module.css";
import Communing from "./components/communing";
import { useAtom, useAtomValue } from "jotai";
import {
  currentSketchAtom,
  explorationInfoAtom,
  lastErrorAtom,
  loadingAtom,
  sketchesAtom,
} from "./atoms/appstate";
import Head from "next/head";
import monaco from "monaco-editor";
import { Editor, Monaco } from "@monaco-editor/react";
import { useCallback, useEffect, useRef } from "react";
import { types } from "./util/p5types";
import explore from "./atoms/explore";
import query from "./atoms/query";

const placeholder = `What would you like to do to the sketch?`;

export default function Home() {
  const loading = useAtomValue(loadingAtom);
  const [lastError, setLastError] = useAtom(lastErrorAtom);
  const [currentSketch, setCurrentSketch] = useAtom(currentSketchAtom);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const sketches = useAtomValue(sketchesAtom);
  const infos = useAtomValue(explorationInfoAtom);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  console.log(infos, sketches);

  function handleEditorDidMount(
    editor: monaco.editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) {
    editorRef.current = editor;
    play();
    editor.addAction({
      id: "run-sketch",
      label: "Run Sketch",
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
      run: play,
    });
    monaco.languages.typescript.javascriptDefaults.addExtraLib(types);
  }

  const play = useCallback(() => {
    if (iframeRef.current && editorRef.current) {
      iframeRef.current.src =
        "/viewer.html?sketch=" +
        encodeURIComponent(editorRef.current.getValue());
    }
    setLastError(null);
  }, [setLastError]);

  useEffect(() => {
    if (!loading) {
      play();
    }
  }, [loading, play]);

  const onKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && editorRef.current) {
      e.preventDefault();
      await query(currentSketch, e.currentTarget.value);
    }
  };

  function askForHelp() {
    textareaRef.current!.value = `I'm getting the following error.  Can you fix it and add comments directly above the changes with what you did? \n\n ${lastError}`;
    setLastError(null);
  }

  useEffect(() => {
    const onMessage = function (msg: MessageEvent) {
      console.log("Got error", msg);
      if (msg.data.p5Error) {
        setLastError(msg.data.p5Error);
      }
    };
    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("message", onMessage);
    };
  });

  const choose = useCallback(
    (i: number) => {
      const editor = editorRef.current;
      if (editor) {
        // Need to do this instead of calling setValue so you can cmd+z it
        editor.pushUndoStop();
        editor.executeEdits("update-from-gpt", [
          {
            range: editor.getModel()!.getFullModelRange(),
            text: sketches[i],
          },
        ]);
        editor.pushUndoStop();
        play();
      }
    },
    [play, sketches]
  );

  return (
    <>
      <div className="MobileBanner">
        <div>
          <Image src="/icon-no-bg.png" alt="logo" width={320} height={320} />
        </div>
        <div>
          P5ai is a p5js editor with an AI assistant, but sadly only works on
          desktop
        </div>
      </div>
      <div className="App">
        <Head>
          <title>P5ai</title>
          <link rel="icon" type="image/png" href="/icon-no-bg.png" />
        </Head>

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
              automaticLayout: true,
              language: "javascript",
              hideCursorInOverviewRuler: true,
              overviewRulerBorder: false,
            }}
          />
        </div>
        <div id="controls">
          <div id="button-row">
            <button disabled={loading} className="button" onClick={play}>
              Play
            </button>
            <button
              disabled={loading}
              className="button"
              onClick={(e) => explore(currentSketch)}
            >
              Explore
            </button>
          </div>
          <div className="PreviewContainer">
            <iframe
              title="preview"
              ref={iframeRef}
              width={600}
              height={600}
            ></iframe>

            <div className="ExplorationsContainer">
              {infos.map((info, i) => {
                return (
                  <div key={`frame${i}`} onClick={() => choose(i)}>
                    <div className="ExplorationInfo">{info.title}</div>
                    <div className="iframeContainer">
                      <iframe
                        src={
                          "/viewer.html?sketch=" +
                          encodeURIComponent(sketches[i])
                        }
                        width={600}
                        height={600}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="PromptContainer">
              <textarea
                rows={9}
                disabled={loading}
                ref={textareaRef}
                onKeyDown={onKeyDown}
                placeholder={placeholder}
              ></textarea>
            </div>
            {lastError && (
              <div className="ErrorBox">
                {lastError}
                <div>
                  <div className="button" onClick={askForHelp}>
                    Ask for help
                  </div>
                </div>
              </div>
            )}
            {loading && <Communing />}
            {loading && <div>Communing...</div>}
          </div>
        </div>
      </div>
    </>
  );
}
