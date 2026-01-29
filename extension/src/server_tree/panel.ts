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

export class Panel<TParams> {
  private panel?: WebviewPanel;

  constructor(private context: ExtensionContext) {}

  init({
    type,
    title,
    route,
    params,
  }: {
    type: string;
    title: string;
    route: string;
    params: TParams;
  }) {
    if (this.reveal()) {
      return;
    }

    this.panel = window.createWebviewPanel(type, title, ViewColumn.Active, {
      enableScripts: true,
      retainContextWhenHidden: true,
    });

    const webviewUri = this.panel.webview.asWebviewUri(
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
    this.panel.webview.html = this.getWebviewContent(
      title,
      webviewUri,
      codiconsUri,
      route,
      params,
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
          this.handleRequest(this.panel.webview, message);
        }
    }
  }

  private reveal() {
    if (this.panel) {
      this.panel.reveal(ViewColumn.Active);
      return true;
    }
    return false;
  }

  getWebviewContent(
    title: string,
    webview: Uri,
    codiconsUri: Uri,
    route: string,
    params: TParams,
  ) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link href="${codiconsUri}" rel="stylesheet" />
</head>
<body>
    <div id="app"></div>
    <Script type="application/javascript">
    const globalParams = {
      route: ${JSON.stringify(route)},
      params: ${JSON.stringify(params)},
    };
    </script>
    <script src="${webview}"></script>
</body>
</html>`;
  }

  async handleRequest(webview: Webview, request: RequestMessage) {
    const service = new EventSourceService("localhost:50055");
    try {
      switch (request.data.method) {
        case "getOutbox":
          const outbox = await service.getOutbox(
            request.data.message.outboxId,
            request.data.message.tenantId,
          );

          this.send(webview, request.id, outbox);
          break;
      }
    } catch (err) {
      this.sendError(webview, request.id, `${err}`);
    }
  }

  send(webview: Webview, id: string, message: ResponseData) {
    webview.postMessage({
      command: "response",
      id,
      data: message,
    });
  }

  sendError(webview: Webview, id: string, error: string) {
    webview.postMessage({
      command: "response",
      id,
      error,
    });
  }

  dispose() {
    this.panel = undefined;
  }
}

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
