import * as path from "path";

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import {
  commands,
  ExtensionContext,
  Uri,
  ViewColumn,
  Webview,
  WebviewPanel,
  window,
  workspace,
} from "vscode";
import { NodeDependenciesProvider } from "./tree/node_dependencies_provider";
import { activateServerTree } from "./server_tree";
import { EventSourceService } from "./service";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
  activateServerTree(context);
  // Only allow a single Cat Coder
  let currentPanel: WebviewPanel | undefined = undefined;

  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "liaradb-explorer" is now active!',
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  context.subscriptions.push(
    commands.registerCommand("liaradb-explorer.helloWorld", () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      window.showInformationMessage("Hello World from liaradb-explorer!");
    }),
  );

  let registered = false;
  context.subscriptions.push(
    commands.registerCommand("catCoding.start", async () => {
      const rootPath =
        workspace.workspaceFolders && workspace.workspaceFolders.length > 0
          ? workspace.workspaceFolders[0].uri.fsPath
          : undefined;

      if (!registered) {
        if (rootPath) {
          registered = true;
          const nodeDependenciesProvider = new NodeDependenciesProvider(
            rootPath,
          );
          window.createTreeView("nodeDependencies", {
            treeDataProvider: nodeDependenciesProvider,
          });

          // window.registerTreeDataProvider(
          //   "nodeDependencies",
          //   nodeDependenciesProvider,
          // );

          commands.registerCommand("nodeDependencies.refreshEntry", () =>
            nodeDependenciesProvider.refresh(),
          );
        }

        registered = true;
      }

      if (currentPanel) {
        currentPanel.reveal(ViewColumn.One);
      } else {
        // Create and show panel
        const panel = window.createWebviewPanel(
          "catCoding",
          "Cat Coding",
          ViewColumn.One,
          {
            enableScripts: true,
          },
        );

        const webview = panel.webview.asWebviewUri(
          Uri.file(path.join(__dirname, "..", "clientdist", "webview.js")),
        );

        // And set its HTML content
        panel.webview.html = getWebviewContent(webview);

        // Handle messages from the webview
        panel.webview.onDidReceiveMessage(
          (message: Message) => {
            switch (message.command) {
              case "alert":
                window.showErrorMessage(message.text);
                return;
              case "request":
                window.showErrorMessage(message.data + message.id);
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

      // const tenants = await listTenants();
      // console.log(tenants);
      // const result = await fetch("https://api.sampleapis.com/coffee/hot");
      // console.log(await result.json());

      // await context.globalState.update("key", "value");
      // const value = context.globalState.get("key", "default");
      // console.log(value);
    }),
  );

  // Our new command
  context.subscriptions.push(
    commands.registerCommand("catCoding.doRefactor", () => {
      if (!currentPanel) {
        return;
      }

      // Send a message to our webview.
      // You can send any JSON serializable data.
      currentPanel.webview.postMessage({ command: "refactor" });
    }),
  );
}

const handleRequest = async (webview: Webview, request: RequestMessage) => {
  const service = new EventSourceService("localhost:50055");
  try {
    switch (request.data.method) {
      case "getOutbox":
        const outbox = await service.getOutbox(
          request.data.message.outboxId,
          request.data.message.tenantId,
        );

        send(webview, request.id, outbox);
        break;
    }
  } catch (err) {
    sendError(webview, request.id, `${err}`);
  }
};

const send = (webview: Webview, id: string, message: ResponseData) => {
  webview.postMessage({
    command: "response",
    id,
    data: message,
  });
};

const sendError = (webview: Webview, id: string, error: string) => {
  webview.postMessage({
    command: "response",
    id,
    error,
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
  data: GetOutboxRequest;
};

export type ResponseMessage = {
  command: "response";
  id: string;
  data: ResponseData;
  error: string | undefined;
};

type ResponseData = GetOutboxResponse;

type GetOutboxRequest = {
  method: "getOutbox";
  message: {
    outboxId: string;
    tenantId: string;
  };
};

type GetOutboxResponse = {
  globalVersion: number;
  low: number;
  high: number;
};

function getWebviewContent(webview: Uri) {
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
