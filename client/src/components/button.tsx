import React, { FC, MouseEventHandler, ReactNode } from "react";

export const Button: FC<{
  block?: boolean;
  children?: ReactNode | ReactNode[];
  id?: string;
  onClick: MouseEventHandler;
}> = ({ block, children, id, onClick }) => {
  const classNames = ["vscode-button"];
  if (block) {
    classNames.push("block");
  }

  return (
    <button
      type="button"
      id={id}
      className={classNames.join(" ")}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
