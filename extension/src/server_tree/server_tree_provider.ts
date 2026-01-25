import * as vscode from "vscode";

import { Server } from "../domain";

import { ServerNode } from "./server_node";
import { ServerTreeNode } from "./server_tree_node";
import { addServer, getServerMap } from "./servers";

export class ServerTreeProvider implements vscode.TreeDataProvider<ServerTreeNode> {
  constructor(private context: vscode.ExtensionContext) {}

  getTreeItem(element: ServerTreeNode): vscode.TreeItem {
    return element.getTreeItem();
  }

  async getChildren(element?: ServerTreeNode): Promise<ServerTreeNode[]> {
    if (!element) {
      // ServerNodes
      return Object.entries(getServerMap(this.context))
        .map(([href, { name }]) => new Server(vscode.Uri.parse(href), name))
        .map((s) => new ServerNode(s));
    }

    // All other nodes
    return [];
  }

  async addServer(href: string, name: string) {
    if (!URL.canParse(href)) {
      return false;
    }

    addServer(this.context, href, name);
    return true;
  }
}
