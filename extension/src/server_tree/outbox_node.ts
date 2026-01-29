import { ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";

import { Outbox, Tenant } from "../domain";
import { ServerTreeNode } from "./server_tree_node";

export class OutboxNode extends ServerTreeNode {
  constructor(
    private tenant: Tenant,
    private outbox: Outbox,
  ) {
    super();
  }

  getTreeItem() {
    const item = new TreeItem(
      `Partition ${this.outbox.getLow()} - ${this.outbox.getHigh()}`,
      TreeItemCollapsibleState.None,
    );
    item.iconPath = new ThemeIcon("checklist");
    item.contextValue = "outbox";
    return item;
  }

  async getChildren(): Promise<ServerTreeNode[]> {
    return [];
  }

  getOutbox() {
    return this.outbox;
  }

  getTenant() {
    return this.tenant;
  }
}
