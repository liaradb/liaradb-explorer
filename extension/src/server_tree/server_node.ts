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
    if (!this.loaded) {
      try {
        this.loading = true;
        this.tenants = await this.getTenants();
        this.loaded = true;
      } catch (err) {
        // TODO: Show alert?
        console.error(err);
      } finally {
        this.loading = false;
      }
    }

    return this.tenants.map((t) => new TenantNode(t));
  }

  async getTenants() {
    const tenants = await this.service.listTenants();
    return tenants.sort((a, b) => a.getName().localeCompare(b.getName()));
  }

  async refresh() {
    this.loaded = false;
  }
}
