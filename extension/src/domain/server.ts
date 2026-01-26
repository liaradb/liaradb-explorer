import { Uri } from "vscode";

export class Server {
  constructor(
    private uri: Uri,
    private name: string,
  ) {}

  getUri() {
    return this.uri;
  }

  getName() {
    return this.name;
  }
}
