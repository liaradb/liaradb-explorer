import React, { FC, MouseEventHandler } from "react";
import { CodiconType, Icon } from "./icon";

export const ActionButton: FC<{
  title?: string;
  icon: CodiconType;
  onClick?: MouseEventHandler;
}> = ({ title, icon, onClick }) => {
  return (
    <button className="vscode-action-button" title={title} onClick={onClick}>
      <Icon type={icon} />
    </button>
  );
};
