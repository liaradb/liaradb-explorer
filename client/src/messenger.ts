export type Message = UnknownMessage | ResponseMessage;

export type UnknownMessage = {
  command: "refactor";
};

export type ResponseMessage = {
  command: "response";
  id: string;
  data: unknown;
  error: string | undefined;
};

export type RequestMessage = {
  command: "request";
  id: string;
  data: unknown;
};

export type WebviewApi = ReturnType<typeof acquireVsCodeApi>;

export class Messenger {
  constructor(private vscode: WebviewApi) {}

  private handlers: Record<
    string,
    (result: any, error: string | undefined) => void
  > = {};

  handleResponse(message: ResponseMessage) {
    const handler = this.handlers[message.id];
    if (!handler) {
      return;
    }

    handler(message.data, message.error);
  }

  async sendRequest<Req, Res>(data: Req) {
    const id = crypto.randomUUID();

    this.vscode.postMessage({
      command: "request",
      id,
      data,
    });

    return new Promise<Res>((resolve, reject) => {
      this.handlers[id] = (result: Res, error: string | undefined) => {
        if (error) {
          reject(new Error(error));
        } else {
          resolve(result);
        }
      };
    });
  }
}
