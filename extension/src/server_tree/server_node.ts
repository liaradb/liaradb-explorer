import * as vscode from "vscode";

import { Server, Tenant } from "../domain";
import { EventSourceService } from "../service";
import { ServerTreeNode } from "./server_tree_node";
import { TenantNode } from "./tenant_node";

export class ServerNode extends ServerTreeNode {
  constructor(private server: Server) {
    super();
    this.service = new EventSourceService(this.getAuthority());
  }

  private service: EventSourceService;
  private loading = false;
  private loaded = false;
  private tenants: Tenant[] = [];

  getTreeItem() {
    const item = new vscode.TreeItem(
      this.getName(),
      vscode.TreeItemCollapsibleState.Expanded,
    );
    item.iconPath = new vscode.ThemeIcon("server");
    item.contextValue = "server";
    return item;
  }

  getName() {
    return this.server.getName();
  }

  getUri() {
    return this.server.getUri();
  }

  private getAuthority() {
    const parts = this.getUri().authority.split(":");
    return `${parts[0]}:${parts[1] ?? "80"}`;
  }

  async getChildren(): Promise<ServerTreeNode[]> {
    try {
      const tenants = await this.getTenants();
      return tenants.map((t) => new TenantNode(t));
    } catch (err) {
      return [];
    }
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
        const tenants = await this.service.listTenants();
        this.tenants = tenants.sort((a, b) =>
          a.getName().localeCompare(b.getName()),
        );
      } finally {
        this.loading = false;
      }
    }
  }
}
