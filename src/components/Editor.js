import React, { useEffect, useRef } from "react";
import Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/theme/dracula.css";
import "codemirror/theme/monokai.css";
import "codemirror/theme/solarized.css";
import "codemirror/theme/material.css";
import "codemirror/theme/cobalt.css";
import "codemirror/theme/tomorrow-night-bright.css";
import "codemirror/theme/base16-light.css";
import "codemirror/theme/ayu-dark.css";
import "codemirror/theme/zenburn.css";
import "codemirror/theme/3024-night.css";
import "codemirror/theme/material-darker.css";
import "codemirror/theme/neo.css";
import "codemirror/theme/paraiso-dark.css";
import "codemirror/theme/seti.css";
import "codemirror/theme/xq-dark.css";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import "codemirror/mode/clike/clike";
import ACTIONS from "../Actions";

// Inside Editor component
function Editor({
  socketRef,
  roomId,
  code,
  setCode,
  onCodeChange,
  selectedTheme,
  currentLanguage,
}) {
  const editorRef = useRef(null);
  const editorContainerRef = useRef(null);

  useEffect(() => {
    async function init() {
      // to collapse old editor when code changes
      if (!editorRef.current) {
        editorRef.current = Codemirror.fromTextArea(
          document.getElementById("realtime-editor"),
          {
            mode: { name: currentLanguage, json: true },
            theme: selectedTheme,
            lineNumbers: true,
            autoCloseTags: true,
            autoCloseBrackets: true,
            autoIndent: true,
          }
        );
      } else {
        editorRef.current.setOption("theme", selectedTheme);
      }

      editorRef.current.on("change", (instance, changes) => {
        const { origin } = changes;
        const newCode = instance.getValue();
        onCodeChange(code); // syncing in the beggining
        if (origin !== "setValue") {
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            code: newCode, // Emit newCode
          });
        }
        setCode(newCode); // Update code state
      });
    }
    init();
  }, [selectedTheme, currentLanguage]);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null) {
          editorRef.current.setValue(code);
          setCode(code); // Update code state
        }
      });
    }

    return () => {
      socketRef.current.off(ACTIONS.CODE_CHANGE);
    };
  }, [socketRef.current]);

  return (
    <>
      <p id="code-driver"></p>
      <textarea id="realtime-editor" style={{ fontSize: "12px" }}></textarea>
    </>
  );
}

export default Editor;

// new code (REFERENCE : Dynamic theme change ) **********************************
// function Editor({ selectedTheme }) {
//   const editorRef = useRef(null);
//   const editorContainerRef = useRef(null);

//   useEffect(() => {
//     if (!editorRef.current) {
//       editorRef.current = Codemirror.fromTextArea(
//         document.getElementById("realtime-editor"),
//         {
//           mode: { name: "javascript", json: true },
//           theme: selectedTheme,
//           lineNumbers: true,
//         }
//       );
//     } else {
//       editorRef.current.setOption("theme", selectedTheme);
//     }
//   }, [selectedTheme]);

//   useEffect(() => {
//     if (editorRef.current) {
//       editorRef.current.refresh();
//     }
//   }, [editorContainerRef.current]);

//   return (
//     <div ref={editorContainerRef}>
//       <textarea id="realtime-editor" style={{ fontSize: "12px" }}></textarea>
//     </div>
//   );
// }

// export default Editor;
