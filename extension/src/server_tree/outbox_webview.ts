import path from "path";
import {
  ExtensionContext,
  Uri,
  ViewColumn,
  Webview,
  WebviewPanel,
  window,
} from "vscode";

import { EventSourceService } from "../service";
import { Outbox, Tenant } from "../domain";

export class OutboxWebview {
  panel?: WebviewPanel;

  constructor(
    private context: ExtensionContext,
    private tenant: Tenant,
    private outbox: Outbox,
  ) {}

  init() {
    if (this.reveal()) {
      return;
    }

    this.panel = window.createWebviewPanel(
      "outboxWebview",
      "Outbox",
      ViewColumn.Active,
      {
        enableScripts: true,
      },
    );

    const webview = this.panel.webview.asWebviewUri(
      Uri.file(path.join(__dirname, "..", "..", "clientdist", "webview.js")),
    );

    const codiconsUri = this.panel.webview.asWebviewUri(
      Uri.joinPath(
        this.context.extensionUri,
        "node_modules",
        "@vscode/codicons",
        "dist",
        "codicon.css",
      ),
    );

    // And set its HTML content
    this.panel.webview.html = getWebviewContent(
      webview,
      codiconsUri,
      this.tenant,
      this.outbox,
    );

    // Handle messages from the webview
    this.panel.webview.onDidReceiveMessage(
      this.onMessage,
      this,
      this.context.subscriptions,
    );

    this.panel.onDidDispose(this.dispose, this, this.context.subscriptions);
  }

  // Handle messages from the webview
  onMessage(message: Message) {
    switch (message.command) {
      case "request":
        if (this.panel?.webview) {
          handleRequest(this.panel.webview, message);
        }
    }
  }

  reveal() {
    if (this.panel) {
      this.panel.reveal(ViewColumn.Active);
      return true;
    }
    return false;
  }

  dispose() {
    this.panel = undefined;
  }
}

export function activateOutboxWebview(context: ExtensionContext) {
  let currentPanel: WebviewPanel | undefined = undefined;

  return function run(tenant: Tenant, outbox: Outbox) {
    if (currentPanel) {
      currentPanel.reveal(ViewColumn.One);
      return;
    }

    // Create and show panel
    const panel = window.createWebviewPanel(
      "outboxWebview",
      "Outbox",
      ViewColumn.One,
      {
        enableScripts: true,
      },
    );

    const webview = panel.webview.asWebviewUri(
      Uri.file(path.join(__dirname, "..", "..", "clientdist", "webview.js")),
    );

    const codiconsUri = panel.webview.asWebviewUri(
      Uri.joinPath(
        context.extensionUri,
        "node_modules",
        "@vscode/codicons",
        "dist",
        "codicon.css",
      ),
    );

    // And set its HTML content
    panel.webview.html = getWebviewContent(
      webview,
      codiconsUri,
      tenant,
      outbox,
    );

    // Handle messages from the webview
    panel.webview.onDidReceiveMessage(
      (message: Message) => {
        switch (message.command) {
          case "request":
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
  };
}

function getWebviewContent(
  webview: Uri,
  codiconsUri: Uri,
  tenant: Tenant,
  outbox: Outbox,
) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cat Coding</title>
    <link href="${codiconsUri}" rel="stylesheet" />
</head>
<body>
    <div id="app"></div>
    <Script type="application/javascript">
    const globalParams = {
        tenantId: "${tenant.getId()}",
        outboxId: "${outbox.getId()}",
    };
    </script>
    <script src="${webview}"></script>
</body>
</html>`;
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
