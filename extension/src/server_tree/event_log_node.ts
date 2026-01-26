import * as vscode from "vscode";

import { Tenant } from "../domain";
import { ServerTreeNode } from "./server_tree_node";

export class EventLogNode extends ServerTreeNode {
  constructor(private tenant: Tenant) {
    super();
  }

  getTreeItem() {
    const item = new vscode.TreeItem(
      "Event Log",
      vscode.TreeItemCollapsibleState.None,
    );
    item.iconPath = new vscode.ThemeIcon("list-ordered");
    return item;
  }

  async getChildren(): Promise<ServerTreeNode[]> {
    return [];
  }
}
