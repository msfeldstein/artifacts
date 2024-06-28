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

import explore from "./atoms/explore";
import query from "./atoms/query";
import MobileBanner from "./components/mobile-header";
import P5Editor from "./components/editor";

const placeholder = `What would you like to do to the sketch?`;

export default function Home() {
  const loading = useAtomValue(loadingAtom);
  const [lastError, setLastError] = useAtom(lastErrorAtom);
  const [currentSketch, setCurrentSketch] = useAtom(currentSketchAtom);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const sketches = useAtomValue(sketchesAtom);
  const infos = useAtomValue(explorationInfoAtom);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  console.log(infos, sketches);

  const play = useCallback(() => {
    if (iframeRef.current) {
      iframeRef.current.src =
        "/viewer.html?sketch=" + encodeURIComponent(currentSketch);
    }
    setLastError(null);
  }, [setLastError, currentSketch]);

  useEffect(() => {
    if (!loading) {
      play();
    }
  }, [loading, play]);

  const onKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
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
      if (msg.data.p5Error) {
        console.log("Got error", msg);
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
      setCurrentSketch(sketches[i]);
    },
    [play, sketches]
  );

  return (
    <>
      <MobileBanner />
      <div className="App">
        <Head>
          <title>P5ai</title>
          <link rel="icon" type="image/png" href="/icon-no-bg.png" />
        </Head>

        <P5Editor />
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
                        "/viewer.html?sketch=" + encodeURIComponent(sketches[i])
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
    </>
  );
}
