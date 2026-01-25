import * as vscode from "vscode";

import { Server, Tenant } from "../domain";
import { listTenants } from "../service";
import { ServerTreeNode } from "./server_tree_node";
import { TenantNode } from "./tenant_node";

export class ServerNode extends ServerTreeNode {
  constructor(private server: Server) {
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
    return this.server.getName();
  }

  async getChildren(): Promise<ServerTreeNode[]> {
    const tenants = await this.getTenants();
    return tenants.map((t) => new TenantNode(t));
  }

  async getTenants() {
    if (!this.loaded) {
      await this.refresh();
    }
    return this.tenants;
  }

  async refresh() {
    if (!this.loading) {
      try {
        this.loading = true;
        const tenants = await listTenants();
        tenants.sort((a, b) => {
          const an = a.getName();
          const bn = b.getName();
          if (an < bn) {
            return -1;
          }
          if (an > bn) {
            return 1;
          }
          return 0;
        });
        this.tenants = tenants;
      } finally {
        this.loading = false;
      }
    }
  }
}
