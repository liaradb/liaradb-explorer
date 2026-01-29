import {
  ExtensionContext,
  ThemeIcon,
  TreeItem,
  TreeItemCollapsibleState,
} from "vscode";

import { Tenant } from "../domain";
import { ServerTreeNode } from "./server_tree_node";
import { EventLogWebview } from "./event_log_webview";

export class EventLogNode extends ServerTreeNode {
  constructor(private tenant: Tenant) {
    super();
  }

  webview?: EventLogWebview;

  getTreeItem() {
    const item = new TreeItem("Event Log", TreeItemCollapsibleState.None);
    item.iconPath = new ThemeIcon("list-ordered");
    item.contextValue = "eventLog";
    return item;
  }

  async getChildren(): Promise<ServerTreeNode[]> {
    return [];
  }

  openWebview(context: ExtensionContext) {
    if (this.webview) {
      this.webview.init();
      return;
    }

    this.webview = new EventLogWebview(context, this.tenant);
    this.webview.init();
  }
}
