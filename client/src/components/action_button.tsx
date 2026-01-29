import React, { FC, MouseEventHandler } from "react";
import { CodiconType, Icon } from "./icon";

export const ActionButton: FC<{
  title?: string;
  type?: "button" | "submit" | "reset";
  icon: CodiconType;
  onClick?: MouseEventHandler;
}> = ({ title, type = "button", icon, onClick }) => {
  return (
    <button
      className="vscode-action-button"
      type={type}
      title={title}
      onClick={onClick}
    >
      <Icon type={icon} />
    </button>
  );
};
