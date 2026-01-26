import {
  EventEmitter,
  ExtensionContext,
  TreeDataProvider,
  TreeItem,
  Uri,
} from "vscode";

import { Server } from "../domain";

import { ServerNode } from "./server_node";
import { ServerTreeNode } from "./server_tree_node";
import { addServer, deleteServer, getServerMap } from "./servers";

export class ServerTreeProvider implements TreeDataProvider<ServerTreeNode> {
  constructor(private context: ExtensionContext) {
    this.servers = this.listServers();
  }

  private servers: ServerNode[];

  getTreeItem(element: ServerTreeNode): TreeItem {
    return element.getTreeItem();
  }

  async getChildren(element?: ServerTreeNode): Promise<ServerTreeNode[]> {
    if (!element) {
      return this.servers;
    }

    return element.getChildren();
  }

  isUriUnique(uri: Uri) {
    return !this.servers.some((s) => {
      const aUri = s.getUri();
      const a = aUri.toString();
      const b = uri.toString();
      return s.getUri().toString() === uri.toString();
    });
  }

  async addServer(uri: Uri, name: string) {
    await addServer(this.context, uri, name);
    this._onDidChangeTreeData.fire();
    await this.refresh();
  }

  async deleteServer(uri: Uri) {
    await deleteServer(this.context, uri);
    await this.refresh();
  }

  async refresh() {
    this.servers = this.listServers();
    await Promise.all(this.servers.map((s) => s.refresh()));
    this._onDidChangeTreeData.fire();
  }

  async refreshServer(node: ServerNode) {
    await node.refresh();
    this._onDidChangeTreeData.fire();
  }

  listServers() {
    return Object.values(getServerMap(this.context))
      .sort(({ name: a }, { name: b }) => a.localeCompare(b))
      .map(({ name, uri }) => new Server(Uri.parse(uri), name))
      .map((s) => new ServerNode(s));
  }

  private _onDidChangeTreeData = new EventEmitter<ServerTreeNodeNullable>();

  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;
}

type ServerTreeNodeNullable = ServerTreeNode | undefined | null | void;
