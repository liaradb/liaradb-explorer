import {
  ExtensionContext,
  ThemeIcon,
  TreeItem,
  TreeItemCollapsibleState,
} from "vscode";

import { Outbox, Tenant } from "../domain";
import { ServerTreeNode } from "./server_tree_node";
import { OutboxWebview } from "./outbox_webview";

export class OutboxNode extends ServerTreeNode {
  constructor(
    private tenant: Tenant,
    private outbox: Outbox,
  ) {
    super();
  }

  webview?: OutboxWebview;

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

  openWebview(context: ExtensionContext) {
    if (this.webview) {
      this.webview.reveal();
      return;
    }

    this.webview = new OutboxWebview(context, this.tenant, this.outbox);
    this.webview.init();
  }
}
