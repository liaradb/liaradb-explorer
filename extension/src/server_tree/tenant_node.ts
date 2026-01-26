import * as vscode from "vscode";

import { Tenant } from "../domain";
import { ServerTreeNode } from "./server_tree_node";
import { EventLogNode } from "./event_log_node";
import { OutboxNode } from "./outbox_node";

export class TenantNode extends ServerTreeNode {
  constructor(private tenant: Tenant) {
    super();

    this.eventLog = new EventLogNode(this.tenant);
    this.outbox = new OutboxNode(this.tenant);

    this.children = [this.eventLog, this.outbox];
  }

  private eventLog: EventLogNode;
  private outbox: OutboxNode;
  private children: ServerTreeNode[];

  getTreeItem() {
    const item = new vscode.TreeItem(
      this.getName(),
      vscode.TreeItemCollapsibleState.Collapsed,
    );
    item.iconPath = new vscode.ThemeIcon("database");
    item.contextValue = "tenant";
    return item;
  }

  getName() {
    return this.tenant.getName();
  }

  async getChildren(): Promise<ServerTreeNode[]> {
    return this.children;
  }
}
