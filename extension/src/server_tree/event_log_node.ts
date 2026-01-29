import { ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";

import { Tenant } from "../domain";
import { ServerTreeNode } from "./server_tree_node";

export class EventLogNode extends ServerTreeNode {
  constructor(private tenant: Tenant) {
    super();
  }

  getTreeItem() {
    const item = new TreeItem("Event Log", TreeItemCollapsibleState.None);
    item.iconPath = new ThemeIcon("list-ordered");
    return item;
  }

  async getChildren(): Promise<ServerTreeNode[]> {
    return [];
  }
}
