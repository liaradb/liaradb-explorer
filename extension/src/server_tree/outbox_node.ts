import * as vscode from "vscode";

import { Tenant } from "../domain";
import { ServerTreeNode } from "./server_tree_node";

export class OutboxNode extends ServerTreeNode {
  constructor(private tenant: Tenant) {
    super();
  }

  getTreeItem() {
    const item = new vscode.TreeItem(
      "Outbox",
      vscode.TreeItemCollapsibleState.None,
    );
    item.iconPath = new vscode.ThemeIcon("inbox");
    return item;
  }

  async getChildren(): Promise<ServerTreeNode[]> {
    return [];
  }
}
