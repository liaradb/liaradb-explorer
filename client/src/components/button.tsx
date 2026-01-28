import React, { FC, MouseEventHandler, ReactNode } from "react";
import styled from "styled-components";

export const Button: FC<{
  block?: boolean;
  children?: ReactNode | ReactNode[];
  disabled?: boolean;
  id?: string;
  onClick?: MouseEventHandler;
  secondary?: boolean;
}> = ({ block, children, disabled, id, onClick, secondary }) => {
  const classNames = ["vscode-button"];
  if (block) {
    classNames.push("block");
  }
  if (secondary) {
    classNames.push("secondary");
  }

  return (
    <StyledButton
      type="button"
      id={id}
      className={classNames.join(" ")}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </StyledButton>
  );
};

const StyledButton = styled.button`
  gap: 8px;
`;
