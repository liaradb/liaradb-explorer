import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

import { Dependency } from "./dependency";

export class NodeDependenciesProvider implements vscode.TreeDataProvider<Dependency> {
  constructor(private workspaceRoot: string) {}

  getTreeItem(element: Dependency): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: Dependency): Promise<Dependency[]> {
    if (!this.workspaceRoot) {
      vscode.window.showInformationMessage("No dependency in empty workspace");
      return [];
    }

    if (element) {
      return this.getDepsInPackageJson(
        path.join(
          this.workspaceRoot,
          "node_modules",
          element.label,
          "package.json",
        ),
      );
    }

    const packageJsonPath = path.join(this.workspaceRoot, "package.json");
    if (!this.pathExists(packageJsonPath)) {
      vscode.window.showInformationMessage("Workspace has no package.json");
      return [];
    }

    return this.getDepsInPackageJson(packageJsonPath);
  }

  /**
   * Given the path to package.json, read all its dependencies and devDependencies.
   */
  private getDepsInPackageJson(packageJsonPath: string): Dependency[] {
    if (!this.pathExists(packageJsonPath)) {
      return [];
    }

    const packageJson: PackageJson = JSON.parse(
      fs.readFileSync(packageJsonPath, "utf-8"),
    );

    return [
      ...this.toDeps(packageJson.dependencies),
      ...this.toDeps(packageJson.devDependencies),
    ];
  }

  private toDeps(dependencies?: Dependencies) {
    if (!dependencies) {
      return [];
    }

    return Object.keys(dependencies).map((dep) =>
      this.toDep(dep, dependencies[dep]),
    );
  }

  private toDep(moduleName: string, version: string): Dependency {
    if (
      this.pathExists(path.join(this.workspaceRoot, "node_modules", moduleName))
    ) {
      return new Dependency(
        moduleName,
        version,
        vscode.TreeItemCollapsibleState.Collapsed,
      );
    }

    return new Dependency(
      moduleName,
      version,
      vscode.TreeItemCollapsibleState.None,
    );
  }

  private pathExists(p: string): boolean {
    try {
      fs.accessSync(p);
    } catch (err) {
      return false;
    }
    return true;
  }

  private _onDidChangeTreeData: vscode.EventEmitter<
    Dependency | undefined | null | void
  > = new vscode.EventEmitter<Dependency | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<
    Dependency | undefined | null | void
  > = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }
}

type Dependencies = Record<string, string>;

type PackageJson = {
  dependencies?: Dependencies;
  devDependencies?: Dependencies;
};
