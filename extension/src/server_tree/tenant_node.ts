import * as vscode from "vscode";

import { Tenant } from "../domain";
import { ServerTreeNode } from "./server_tree_node";

export class TenantNode extends ServerTreeNode {
  constructor(private tenant: Tenant) {
    super();
  }

  private loading = false;
  private loaded = false;
  private tenants: Tenant[] = [];

  getTreeItem() {
    return new vscode.TreeItem(
      this.getName(),
      vscode.TreeItemCollapsibleState.Expanded,
    );
  }

  getName() {
    return this.tenant.getName();
  }

  async getChildren(): Promise<ServerTreeNode[]> {
    return [];
  }
}
