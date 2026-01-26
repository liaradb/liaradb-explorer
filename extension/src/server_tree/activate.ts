import { ExtensionContext, Uri, commands, window } from "vscode";
import { ServerTreeProvider } from "./server_tree_provider";
import { clearServerMap } from "./servers";
import { ServerNode } from "./server_node";

export function activateServerTree(context: ExtensionContext) {
  const provider = new ServerTreeProvider(context);

  window.registerTreeDataProvider("serverTree", provider);
  window.createTreeView("serverTree", {
    treeDataProvider: provider,
  });

  commands.registerCommand("serverTree.show", () => {
    window.createTreeView("serverTree", {
      treeDataProvider: provider,
    });
  });

  commands.registerCommand("serverTree.refresh", () => provider.refresh());

  commands.registerCommand("serverTree.addServer", async () => {
    const uri = await getUri(provider);
    if (!uri) {
      return;
    }

    const name = await getName(uri);
    if (name === undefined) {
      return;
    }

    await provider.addServer(uri, name);
  });

  commands.registerCommand(
    "serverTree.deleteServer",
    async (node: ServerNode) => {
      const answer = await window.showWarningMessage(
        `Are you sure you want to delete ${node.getName()}?`,
        { modal: true },
        "Delete",
      );
      if (answer !== "Delete") {
        return;
      }

      await provider.deleteServer(node.getUri());
    },
  );

  commands.registerCommand("serverTree.renameTenant", () => {});

  commands.registerCommand(
    "serverTree.renameServer",
    async (node: ServerNode) => {
      const name = await getRename(node.getName());
      if (name === undefined) {
        return;
      }

      await provider.addServer(node.getUri(), name);
    },
  );

  commands.registerCommand("serverTree.resetData", async () => {
    clearServerMap(context);
    await provider.refresh();
  });
}

async function getUri(provider: ServerTreeProvider): Promise<Uri | undefined> {
  const href = await window.showInputBox({
    prompt: "URI",
    value: "http://localhost:50055",
  });

  if (href === undefined) {
    return;
  }

  if (!URL.canParse(href)) {
    window.showErrorMessage("invalid URI");
    return getUri(provider);
  }

  const uri = Uri.parse(href);
  if (!provider.isUriUnique(uri)) {
    window.showErrorMessage("Server with URI already exists");
    return getUri(provider);
  }

  return uri;
}

async function getName(uri: Uri) {
  const name = await window.showInputBox({
    prompt: "Server name",
    value: getHost(uri) === "localhost" ? "Localhost" : undefined,
  });

  if (name === undefined) {
    return;
  }

  const trimmed = name.trim();

  if (trimmed === "") {
    window.showErrorMessage("invalid name");
    return getName(uri);
  }

  return trimmed;
}

async function getRename(base: string) {
  const name = await window.showInputBox({
    prompt: "Server name",
    value: base,
  });

  if (name === undefined) {
    return;
  }

  const trimmed = name.trim();

  if (trimmed === "") {
    window.showErrorMessage("invalid name");
    return getRename(base);
  }

  return trimmed;
}

const getHost = (uri: Uri) => uri.authority.split(":")[0];
