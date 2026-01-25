import * as vscode from "vscode";

import { Tenant } from "../domain";
import { ServerTreeNode } from "./server_tree_node";

export class OutboxNode extends ServerTreeNode {
  constructor(private tenant: Tenant) {
    super();
  }

  getTreeItem() {
    return new vscode.TreeItem("Outbox", vscode.TreeItemCollapsibleState.None);
  }

  async getChildren(): Promise<ServerTreeNode[]> {
    return [];
  }
}
