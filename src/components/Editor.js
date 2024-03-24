import React, { useEffect, useRef } from "react";
import Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/theme/dracula.css";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import ACTIONS from "../Actions";

function Editor({ socketRef, roomId }) {
  const editorRef = useRef(null);

  useEffect(() => {
    async function init() {
      editorRef.current = Codemirror.fromTextArea(
        document.getElementById("realtime-editor"),
        {
          mode: { name: "javascript", json: true },
          theme: "dracula",
          lineNumbers: true,
          autoCloseTags: true,
          autoCloseBrackets: true,
        }
      );

      editorRef.current.on("change", (instance, changes) => {
        console.log(changes);
        const { origin } = changes;
        const code = instance.getValue();
        if (origin !== "setValue") {
          console.log("working", code);
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            code,
          });
        }
        console.log(code);
      });
    }
    init();
  }, []);

  ////////////////////  CODE change   //////////////////////////

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null) {
          editorRef.current.setValue(code);
        }
      });
    }
  }, [socketRef.current]);

  /////////////////////////////////////////

  return <textarea id="realtime-editor"></textarea>;
}

export default Editor;

// useEffect(() => {
//   if (socketRef.current) {
//     socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
//       if (code !== null) {
//         editorRef.current.setValue(code);
//       }
//     });
//   }

//   return () => {
//     socketRef.current.off(ACTIONS.CODE_CHANGE);
//   };
// }, [socketRef.current]);
