import { ExtensionContext, Uri, commands, window } from "vscode";

import { EventLogNode } from "./event_log_node";
import { OutboxNode } from "./outbox_node";
import { ServerNode } from "./server_node";
import { ServerTreeProvider } from "./server_tree_provider";
import { clearServerMap } from "./servers";
import { TenantNode } from "./tenant_node";

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

    const name = await getName(
      "Server name",
      getHost(uri) === "localhost" ? "Localhost" : undefined,
    );
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

  commands.registerCommand("serverTree.addTenant", (node: ServerNode) => {
    const name = getName("Tenant name");
    if (name === undefined) {
      return;
    }
  });

  commands.registerCommand("serverTree.renameTenant", (node: TenantNode) => {
    const name = getName("Tenant name", node.getName());
    if (name === undefined) {
      return;
    }
  });

  commands.registerCommand(
    "serverTree.deleteTenant",
    async (node: TenantNode) => {
      const answer = await window.showWarningMessage(
        `Are you sure you want to delete ${node.getName()}?`,
        { modal: true },
        "Delete",
      );
      if (answer !== "Delete") {
        return;
      }
    },
  );

  commands.registerCommand(
    "serverTree.renameServer",
    async (node: ServerNode) => {
      const name = await getName("Server name", node.getName());
      if (name === undefined) {
        return;
      }

      await provider.addServer(node.getUri(), name);
    },
  );

  commands.registerCommand(
    "serverTree.refreshServer",
    async (node: ServerNode) => {
      await provider.refreshServer(node);
    },
  );

  commands.registerCommand("serverTree.resetData", async () => {
    clearServerMap(context);
    await provider.refresh();
  });

  commands.registerCommand("serverTree.viewEventLog", (node: EventLogNode) => {
    node.openWebview(context);
  });

  commands.registerCommand("serverTree.viewOutbox", (node: OutboxNode) => {
    node.openWebview(context);
  });
}

async function getUri(provider: ServerTreeProvider): Promise<Uri | undefined> {
  const href = await window.showInputBox({
    prompt: "URI",
    value: "http://localhost:50055",
    validateInput: (href) => {
      if (!URL.canParse(href)) {
        return "invalid URI";
      }

      if (!provider.isUriUnique(Uri.parse(href))) {
        return "Server with URI already exists";
      }
    },
  });

  if (href === undefined) {
    return;
  }

  return Uri.parse(href);
}

async function getName(prompt: string, value?: string) {
  const name = await window.showInputBox({
    prompt,
    value,
    validateInput: (name) => {
      if (name.trim() === "") {
        return "invalid name";
      }
    },
  });

  return name?.trim();
}

const getHost = (uri: Uri) => uri.authority.split(":")[0];
