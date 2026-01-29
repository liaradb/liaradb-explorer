import React, { FC } from "react";
import { Root } from "react-dom/client";
import { ThemeProvider } from "styled-components";

import { Router } from "./features";
import { MessengerProvider } from "./messenger_context";
import { VSCode, VSCodeProvider } from "./vscode_context";

import "./styles";

export function main(root: Root, vscode: ReturnType<typeof acquireVsCodeApi>) {
  root.render(<Main vscode={vscode} />);
}

const Main: FC<{ vscode: VSCode }> = ({ vscode }) => {
  return (
    <VSCodeProvider vscode={vscode}>
      <MessengerProvider>
        <ThemeProvider theme={{}}>
          <Router route={globalParams} />
        </ThemeProvider>
      </MessengerProvider>
    </VSCodeProvider>
  );
};
