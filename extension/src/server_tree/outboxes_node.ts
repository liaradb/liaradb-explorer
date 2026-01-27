import * as vscode from "vscode";

import { Outbox, Tenant } from "../domain";
import { ServerTreeNode } from "./server_tree_node";
import { EventSourceService } from "../service";
import { OutboxNode } from "./outbox_node";

export class OutboxesNode extends ServerTreeNode {
  constructor(
    private service: EventSourceService,
    private tenant: Tenant,
  ) {
    super();
  }

  private loading = false;
  private loaded = false;
  private outboxes: Outbox[] = [];

  getTreeItem() {
    const item = new vscode.TreeItem(
      "Outboxes",
      vscode.TreeItemCollapsibleState.Collapsed,
    );
    item.iconPath = new vscode.ThemeIcon("inbox");
    item.contextValue = "outboxes";
    return item;
  }

  async getChildren(): Promise<ServerTreeNode[]> {
    if (!this.loaded) {
      try {
        this.loading = true;
        this.outboxes = await this.getOutboxes();
        this.loaded = true;
      } catch (err) {
        // TODO: Show alert?
        console.error(err);
      } finally {
        this.loading = false;
      }
    }

    return this.outboxes.map((o) => new OutboxNode(this.tenant, o));
  }

  async getOutboxes() {
    const outboxes = await this.service.listOutboxes(this.tenant.getId());
    return outboxes.sort((a, b) => a.getLow() - b.getLow());
  }
}
