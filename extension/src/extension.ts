// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { commands, ExtensionContext, window, workspace } from "vscode";
import { NodeDependenciesProvider } from "./tree/node_dependencies_provider";
import { activateServerTree } from "./server_tree";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
  activateServerTree(context);

  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "liaradb-explorer" is now active!',
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  context.subscriptions.push(
    commands.registerCommand("liaradb-explorer.helloWorld", () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      window.showInformationMessage("Hello World from liaradb-explorer!");
    }),
  );

  let registered = false;
  context.subscriptions.push(
    commands.registerCommand("catCoding.start", async () => {
      const rootPath =
        workspace.workspaceFolders && workspace.workspaceFolders.length > 0
          ? workspace.workspaceFolders[0].uri.fsPath
          : undefined;

      if (!registered) {
        if (rootPath) {
          registered = true;
          const nodeDependenciesProvider = new NodeDependenciesProvider(
            rootPath,
          );
          window.createTreeView("nodeDependencies", {
            treeDataProvider: nodeDependenciesProvider,
          });

          // window.registerTreeDataProvider(
          //   "nodeDependencies",
          //   nodeDependenciesProvider,
          // );

          commands.registerCommand("nodeDependencies.refreshEntry", () =>
            nodeDependenciesProvider.refresh(),
          );
        }

        registered = true;
      }

      // const tenants = await listTenants();
      // console.log(tenants);
      // const result = await fetch("https://api.sampleapis.com/coffee/hot");
      // console.log(await result.json());

      // await context.globalState.update("key", "value");
      // const value = context.globalState.get("key", "default");
      // console.log(value);
    }),
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
