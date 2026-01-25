import * as vscode from "vscode";
import { ServerTreeProvider } from "./server_tree_provider";

export function activateServerTree(context: vscode.ExtensionContext) {
  const provider = new ServerTreeProvider(context);

  vscode.window.registerTreeDataProvider("serverTree", provider);
  vscode.window.createTreeView("serverTree", {
    treeDataProvider: provider,
  });

  vscode.commands.registerCommand("serverTree.show", () => {
    vscode.window.createTreeView("serverTree", {
      treeDataProvider: provider,
    });
  });

  vscode.commands.registerCommand("serverTree.refresh", () =>
    provider.refresh(),
  );

  vscode.commands.registerCommand("serverTree.addServer", async () => {
    const name = await vscode.window.showInputBox({
      prompt: "Server name",
    });

    if (!name) {
      vscode.window.showErrorMessage("invalid name");
      return;
    }

    const href = await vscode.window.showInputBox({
      prompt: "URI",
      value: "http://localhost:50055",
    });

    if (!href) {
      vscode.window.showErrorMessage("invalid URI");
      return;
    }

    if (!provider.addServer(href, name)) {
      vscode.window.showErrorMessage("invalid URI");
    }
  });
}
