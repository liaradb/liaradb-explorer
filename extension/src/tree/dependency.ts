import { ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";

export class Dependency extends TreeItem {
  constructor(
    public readonly label: string,
    private version: string,
    public readonly collapsibleState: TreeItemCollapsibleState,
  ) {
    super(label, collapsibleState);
    this.tooltip = `${this.label}-${this.version}`;
    this.description = this.version;
    this.contextValue =
      collapsibleState === TreeItemCollapsibleState.None
        ? "dependency"
        : undefined;
  }

  iconPath = new ThemeIcon("gear");
}
