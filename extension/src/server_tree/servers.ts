import { ExtensionContext, Uri } from "vscode";

type ServerMap = Record<string, { name: string; uri: string }>;
const defaultServers: ServerMap = {};
const serversKey = "servers";

export const getServerMap = (context: ExtensionContext) =>
  context.globalState.get(serversKey, defaultServers);

export const setServerMap = (context: ExtensionContext, servers: ServerMap) =>
  context.globalState.update(serversKey, servers);

export const addServer = (context: ExtensionContext, uri: Uri, name: string) =>
  setServerMap(context, {
    ...getServerMap(context),
    [uri.toString()]: { name, uri: uri.toString() },
  });

export const clearServerMap = (context: ExtensionContext) =>
  context.globalState.update(serversKey, defaultServers);
