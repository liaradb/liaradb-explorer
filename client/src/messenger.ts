export type Message = UnknownMessage | ResponseMessage;

export type UnknownMessage = {
  command: "refactor";
};

export type ResponseMessage = {
  command: "response";
  id: string;
  data: unknown;
};

export type RequestMessage = {
  command: "request";
  id: string;
  data: unknown;
};

export type WebviewApi = ReturnType<typeof acquireVsCodeApi>;

export class Messenger {
  constructor(private vscode: WebviewApi) {}

  private handlers: Record<string, (result: any) => void> = {};

  handleResponse(message: ResponseMessage) {
    const handler = this.handlers[message.id];
    if (!handler) {
      return;
    }

    handler(message.data);
  }

  async sendRequest<R, T>(data: R) {
    const id = crypto.randomUUID();

    this.vscode.postMessage({
      command: "request",
      id,
      data,
    });

    return new Promise<T>((resolve, reject) => {
      this.handlers[id] = (result: T) => {
        resolve(result);
      };
    });
  }
}
