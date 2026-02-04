import { ExtensionContext, Uri, commands, window } from "vscode";

import { EventLogNode } from "./event_log_node";
import { OutboxNode } from "./outbox_node";
import { ServerNode } from "./server_node";
import { ServerTreeProvider } from "./server_tree_provider";
import { clearServerMap } from "./servers";
import { OutboxListNode } from "./outbox_list_node";
import { TenantNode } from "./tenant_node";

enum Command {
  show = "liaradb.show",
  refresh = "liaradb.refresh",
  addServer = "liaradb.addServer",
  deleteServer = "liaradb.deleteServer",
  addTenant = "liaradb.addTenant",
  renameTenant = "liaradb.renameTenant",
  deleteTenant = "liaradb.deleteTenant",
  renameServer = "liaradb.renameServer",
  refreshServer = "liaradb.refreshServer",
  resetData = "liaradb.resetData",
  viewEventLog = "liaradb.viewEventLog",
  viewOutbox = "liaradb.viewOutbox",
}

export function activateServerTree(context: ExtensionContext) {
  const provider = new ServerTreeProvider(context);

  window.registerTreeDataProvider("serverTree", provider);
  window.createTreeView("serverTree", {
    treeDataProvider: provider,
  });

  registerCommand(context, Command.show, () => {
    window.createTreeView("serverTree", {
      treeDataProvider: provider,
    });
  });

  registerCommand(context, Command.refresh, () => provider.refresh());

  registerCommand(context, Command.addServer, async () => {
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

  registerCommand(context, Command.deleteServer, async (node: ServerNode) => {
    const answer = await window.showWarningMessage(
      `Are you sure you want to delete ${node.getName()}?`,
      { modal: true },
      "Delete",
    );
    if (answer !== "Delete") {
      return;
    }

    await provider.deleteServer(node.getUri());
  });

  registerCommand(context, Command.addTenant, async (node: ServerNode) => {
    const name = await getName("Tenant name");
    if (name === undefined) {
      return;
    }

    await provider.addTenant(node, name);
  });

  registerCommand(context, Command.renameTenant, async (node: TenantNode) => {
    const name = await getName("Tenant name", node.getName());
    if (name === undefined) {
      return;
    }

    await provider.renameTenant(node, name);
  });

  registerCommand(context, Command.deleteTenant, async (node: TenantNode) => {
    const answer = await window.showWarningMessage(
      `Are you sure you want to delete ${node.getName()}?`,
      { modal: true },
      "Delete",
    );
    if (answer !== "Delete") {
      return;
    }
  });

  registerCommand(context, Command.renameServer, async (node: ServerNode) => {
    const name = await getName("Server name", node.getName());
    if (name === undefined) {
      return;
    }

    await provider.addServer(node.getUri(), name);
  });

  registerCommand(context, Command.refreshServer, async (node: ServerNode) => {
    await provider.refreshServer(node);
  });

  registerCommand(context, Command.resetData, async () => {
    clearServerMap(context);
    provider.refresh();
  });

  registerCommand(context, Command.viewEventLog, (node: EventLogNode) => {
    node.openWebview(context);
  });

  registerCommand(
    context,
    "liaradb.addOutbox",
    async (node: OutboxListNode) => {
      const low = await getNumber("Low range", "0");
      if (low === undefined) {
        return;
      }

      const high = await getNumber("High range", low);
      if (high === undefined) {
        return;
      }

      await provider.addOutbox(node, parseInt(low), parseInt(high));
    },
  );

  registerCommand(context, Command.viewOutbox, (node: OutboxNode) => {
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

async function getNumber(prompt: string, value?: string) {
  const result = await window.showInputBox({
    prompt,
    value,
    validateInput: (value) => {
      const t = value.trim();
      if (!t.length || isNaN(t.trim() as any)) {
        return "Invalid number";
      }
      return undefined;
    },
  });

  return result?.trim();
}

const getHost = (uri: Uri) => uri.authority.split(":")[0];

function registerCommand(
  context: ExtensionContext,
  command: string,
  callback: (...args: any[]) => any,
  thisArg?: any,
) {
  const disposable = commands.registerCommand(
    command,
    async (...args: any[]) => {
      try {
        await callback(...args);
      } catch (err) {
        window.showErrorMessage(`${err}`);
      }
    },
    thisArg,
  );
  context.subscriptions.push(disposable);
  return disposable;
}
