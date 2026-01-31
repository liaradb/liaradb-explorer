import { ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";

import { Outbox, Tenant } from "../domain";
import { ServerTreeNode } from "./server_tree_node";
import { EventSourceService } from "../service";
import { OutboxNode } from "./outbox_node";

export class OutboxListNode extends ServerTreeNode {
  constructor(
    private service: EventSourceService,
    private tenant: Tenant,
  ) {
    super();
  }

  private loaded = false;
  private outboxes: Outbox[] = [];

  getTreeItem() {
    const item = new TreeItem("Outboxes", TreeItemCollapsibleState.Collapsed);
    item.iconPath = new ThemeIcon("inbox");
    item.contextValue = "outboxList";
    return item;
  }

  async getChildren(): Promise<ServerTreeNode[]> {
    if (!this.loaded) {
      this.outboxes = await this.getOutboxes();
      this.loaded = true;
    }

    return this.outboxes.map((o) => new OutboxNode(this.tenant, o));
  }

  async getOutboxes() {
    const outboxes = await this.service.listOutboxes(this.tenant.getId());
    return outboxes.sort((a, b) => a.getLow() - b.getLow());
  }

  addOutbox(low: number, high: number) {
    return this.service.createOutbox(this.tenant.getId(), low, high);
  }
}
