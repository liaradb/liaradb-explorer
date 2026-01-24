import React, { createContext, FC, ReactNode, useContext } from "react";

export type VSCode = ReturnType<typeof acquireVsCodeApi>;

const VSCodeContext = createContext({
  vscode: {} as VSCode,
});

export const VSCodeProvider: FC<{
  vscode: VSCode;
  children: ReactNode | ReactNode[];
}> = ({ vscode, children }) => (
  <VSCodeContext.Provider value={{ vscode }}>{children}</VSCodeContext.Provider>
);

export const useVSCode = () => useContext(VSCodeContext).vscode;
