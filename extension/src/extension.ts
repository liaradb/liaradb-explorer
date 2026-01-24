import * as path from "path";

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

        const webview = panel.webview.asWebviewUri(
          vscode.Uri.file(
            path.join(__dirname, "..", "clientdist", "webview.js"),
          ),
        );

        // And set its HTML content
        panel.webview.html = getWebviewContent(webview);

        // Handle messages from the webview
        panel.webview.onDidReceiveMessage(
          (message: Message) => {
            switch (message.command) {
              case "alert":
                vscode.window.showErrorMessage(message.text);
                return;
              case "request":
                vscode.window.showErrorMessage(message.data + message.id);
                if (currentPanel?.webview) {
                  handleRequest(currentPanel.webview, message);
                }
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

const handleRequest = (webview: vscode.Webview, request: RequestMessage) => {
  webview.postMessage({
    command: "response",
    id: request.id,
    data: {
      value: "Response value",
    },
  });
};

export type Message = UnknownMessage | RequestMessage;

export type UnknownMessage = {
  command: "alert";
  text: string;
};

export type RequestMessage = {
  command: "request";
  id: string;
  data: unknown;
};

export type ResponseMessage = {
  command: "response";
  id: string;
  data: unknown;
};

function getWebviewContent(webview: vscode.Uri) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cat Coding</title>
</head>
<body>
    <div id="app"></div>
    <script src="${webview}"></script>
</body>
</html>`;
}

// This method is called when your extension is deactivated
export function deactivate() {}
