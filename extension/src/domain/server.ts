import { Uri } from "vscode";

export class Server {
  constructor(
    private href: Uri,
    private name: string,
  ) {}

  getHref() {
    return this.href;
  }

  getName() {
    return this.name;
  }
}
