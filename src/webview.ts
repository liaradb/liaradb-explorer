import "vscode-webview";

const vscode = acquireVsCodeApi();

function init() {
  const counter = document.getElementById("lines-of-code-counter");
  const button = document.getElementById("send");
  if (!counter || !button) {
    return;
  }

  run(button, counter);
}

function run(button: HTMLElement, counter: HTMLElement) {
  let requestId = 0;
  button?.addEventListener("click", () => {
    vscode.postMessage({
      command: "request",
      text: "request",
      requestId: requestId,
    });
    requestId++;
  });

  let count = 0;
  setInterval(() => {
    counter.textContent = `${count++}`;

    // Alert the extension when our cat introduces a bug
    if (Math.random() < 0.001 * count) {
      vscode.postMessage({
        command: "alert",
        text: "🐛  on line " + count,
      });
    }
  }, 100);

  // Handle the message inside the webview
  window.addEventListener("message", (event) => {
    const message = event.data; // The JSON data our extension sent

    switch (message.command) {
      case "refactor":
        count = 0;
        counter.textContent = `${count}`;
        break;
    }
  });
}

init();
