import React, { useEffect } from "react";
import Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/theme/dracula.css";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";

function Editor() {
  useEffect(() => {
    async function init() {
      Codemirror.fromTextArea(document.getElementById("realtime-editor"), {
        mode: { name: "javascript", json: true },
        theme: "dracula",
        lineNumbers: true,
        autoCloseTags: true,
        autoCloseBrackets: true,
      });
    }
    init();
  }, []);

  return <textarea id="realtime-editor"></textarea>;
}

export default Editor;
