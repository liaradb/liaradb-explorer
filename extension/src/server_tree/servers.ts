import { ExtensionContext } from "vscode";

type ServerMap = Record<string, { name: string }>;
const defaultServers: ServerMap = {};
const serversKey = "servers";

export const getServerMap = (context: ExtensionContext) =>
  context.globalState.get(serversKey, defaultServers);

export const setServerMap = (context: ExtensionContext, servers: ServerMap) =>
  context.globalState.update(serversKey, servers);

export const addServer = (
  context: ExtensionContext,
  href: string,
  name: string,
) =>
  setServerMap(context, {
    ...getServerMap(context),
    [href]: { name },
  });
