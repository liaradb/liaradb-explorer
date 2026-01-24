import { createRoot } from "react-dom/client";
import "vscode-webview";
import { main } from "./main";
import { Message, Messenger } from "./messenger";

const vscode = acquireVsCodeApi();

function init() {
  const counter = document.getElementById("lines-of-code-counter");
  const button = document.getElementById("send");
  const app = document.getElementById("app");
  if (!counter || !button || !app) {
    return;
  }

  // Render your React component instead
  const root = createRoot(app);
  main(root);
  run(button, counter);
}

function run(button: HTMLElement, counter: HTMLElement) {
  const messenger = new Messenger(vscode);

  let requestId = 0;

  button?.addEventListener("click", async () => {
    const result = await messenger.sendRequest({
      text: "request",
      requestId: requestId,
    });
    console.log(result);
    requestId++;
  });

  // Handle the message inside the webview
  window.addEventListener("message", (event) => {
    const message: Message = event.data; // The JSON data our extension sent

    switch (message.command) {
      case "refactor":
        break;
      case "response":
        messenger.handleResponse(message);
        break;
    }
  });
}

init();
