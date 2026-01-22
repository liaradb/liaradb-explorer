// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Only allow a single Cat Coder
  let currentPanel: vscode.WebviewPanel | undefined = undefined;

  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "liaradb-explorer" is now active!',
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  context.subscriptions.push(
    vscode.commands.registerCommand("liaradb-explorer.helloWorld", () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage(
        "Hello World from liaradb-explorer!",
      );
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("catCoding.start", async () => {
      if (currentPanel) {
        currentPanel.reveal(vscode.ViewColumn.One);
      } else {
        // Create and show panel
        const panel = vscode.window.createWebviewPanel(
          "catCoding",
          "Cat Coding",
          vscode.ViewColumn.One,
          {
            enableScripts: true,
          },
        );

        // And set its HTML content
        panel.webview.html = getWebviewContent();

        // Handle messages from the webview
        panel.webview.onDidReceiveMessage(
          (message) => {
            switch (message.command) {
              case "alert":
                vscode.window.showErrorMessage(message.text);
                return;
              case "request":
                vscode.window.showErrorMessage(
                  message.text + message.requestId,
                );
            }
          },
          undefined,
          context.subscriptions,
        );
        panel.onDidDispose(
          () => {
            currentPanel = undefined;
          },
          undefined,
          context.subscriptions,
        );

        currentPanel = panel;
      }

      const result = await fetch("https://api.sampleapis.com/coffee/hot");
      console.log(await result.json());

      await context.globalState.update("key", "value");
      const value = context.globalState.get("key", "default");
      console.log(value);
    }),
  );

  // Our new command
  context.subscriptions.push(
    vscode.commands.registerCommand("catCoding.doRefactor", () => {
      if (!currentPanel) {
        return;
      }

      // Send a message to our webview.
      // You can send any JSON serializable data.
      currentPanel.webview.postMessage({ command: "refactor" });
    }),
  );
}

function getWebviewContent() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cat Coding</title>
</head>
<body>
    <img src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif" width="300" />
    <h1 id="lines-of-code-counter">0</h1>
    <button id="send">Button</button>
      <script>
      (function() {
        const vscode = acquireVsCodeApi();
        const counter = document.getElementById('lines-of-code-counter');
        const button = document.getElementById('send');
        let requestId = 0;
        button.addEventListener('click', () => {
            vscode.postMessage({
              command: 'request',
              text: 'request',
              requestId: requestId,
            });
            requestId++;
        });

        let count = 0;
        setInterval(() => {
          counter.textContent = count++;

          // Alert the extension when our cat introduces a bug
          if (Math.random() < 0.001 * count) {
            vscode.postMessage({
              command: 'alert',
              text: '🐛  on line ' + count
            })
          }
        }, 100);


        // Handle the message inside the webview
        window.addEventListener('message', event => {

            const message = event.data; // The JSON data our extension sent

            switch (message.command) {
                case 'refactor':
                  count = 0;
                  counter.textContent = count;
                  break;
            }
        });
      }())
    </script>
</body>
</html>`;
}

// This method is called when your extension is deactivated
export function deactivate() {}
