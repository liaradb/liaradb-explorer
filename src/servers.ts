import { ExtensionContext } from "vscode";

type ServerMap = Record<string, { href: string }>;
const defaultServers: ServerMap = {};

const getServerMap = (context: ExtensionContext) =>
  context.globalState.get("servers", defaultServers);

const setServerMap = (context: ExtensionContext, servers: ServerMap) =>
  context.globalState.update("servers", servers);

const addServer = (context: ExtensionContext, name: string, href: string) =>
  setServerMap(context, {
    ...getServerMap(context),
    [name]: { href },
  });
