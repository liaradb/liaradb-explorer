import React, {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { Message, Messenger } from "./messenger";
import { useVSCode } from "./vscode_context";

export type VSCode = ReturnType<typeof acquireVsCodeApi>;

const MessengerContext = createContext({
  messenger: {} as Messenger,
});

export const MessengerProvider: FC<{
  children: ReactNode | ReactNode[];
}> = ({ children }) => {
  const vscode = useVSCode();
  const messenger = useMemo(() => new Messenger(vscode), [vscode]);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      const message: Message = event.data;
      if (message.command === "response") {
        messenger.handleResponse(message);
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  return (
    <MessengerContext.Provider value={{ messenger }}>
      {children}
    </MessengerContext.Provider>
  );
};

export const useMessenger = () => useContext(MessengerContext).messenger;
