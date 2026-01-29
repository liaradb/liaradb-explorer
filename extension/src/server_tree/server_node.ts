import { ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";

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
  private loaded = false;
  private tenants: Tenant[] = [];

  getTreeItem() {
    const item = new TreeItem(
      this.getName(),
      TreeItemCollapsibleState.Collapsed,
    );
    item.iconPath = new ThemeIcon("server");
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
      this.tenants = await this.getTenants();
      this.loaded = true;
    }

    return this.tenants.map((t) => new TenantNode(this.service, t));
  }

  async getTenants() {
    const tenants = await this.service.listTenants();
    return tenants.sort((a, b) => a.getName().localeCompare(b.getName()));
  }

  async refresh() {
    this.loaded = false;
  }
}
