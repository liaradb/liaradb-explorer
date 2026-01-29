import { TreeItem } from "vscode";

export abstract class ServerTreeNode {
  abstract getTreeItem(): TreeItem;
  abstract getChildren(): Promise<ServerTreeNode[]>;
}
