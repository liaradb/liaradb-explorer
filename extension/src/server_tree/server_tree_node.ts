import * as vscode from "vscode";

export abstract class ServerTreeNode {
  abstract getTreeItem(): vscode.TreeItem;
  abstract getChildren(): Promise<ServerTreeNode[]>;
}
