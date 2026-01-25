import * as vscode from "vscode";

import { Server } from "../domain";

import { ServerNode } from "./server_node";
import { ServerTreeNode } from "./server_tree_node";
import { addServer, getServerMap } from "./servers";

export class ServerTreeProvider implements vscode.TreeDataProvider<ServerTreeNode> {
  constructor(private context: vscode.ExtensionContext) {
    this.servers = this.listServers();
  }

  private servers: ServerNode[];

  getTreeItem(element: ServerTreeNode): vscode.TreeItem {
    return element.getTreeItem();
  }

  async getChildren(element?: ServerTreeNode): Promise<ServerTreeNode[]> {
    if (!element) {
      return this.servers;
    }

    return element.getChildren();
  }

  async addServer(href: string, name: string) {
    if (!URL.canParse(href)) {
      return false;
    }

    addServer(this.context, href, name);
    return true;
  }

  async refresh() {
    this.servers = this.listServers();
    await Promise.all(this.servers.map((s) => s.refresh()));
    this._onDidChangeTreeData.fire();
  }

  listServers() {
    return Object.entries(getServerMap(this.context))
      .map(([href, { name }]) => new Server(vscode.Uri.parse(href), name))
      .map((s) => new ServerNode(s));
  }

  private _onDidChangeTreeData =
    new vscode.EventEmitter<ServerTreeNodeNullable>();

  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;
}

type ServerTreeNodeNullable = ServerTreeNode | undefined | null | void;
