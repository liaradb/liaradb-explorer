import { createRoot } from "react-dom/client";
import "vscode-webview";

import { main } from "./main";

function init() {
  const app = document.getElementById("app");
  if (!app) {
    return;
  }

  const vscode = acquireVsCodeApi();
  const root = createRoot(app);
  main(root, vscode);
}

init();
