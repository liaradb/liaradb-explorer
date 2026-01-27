import React, { FC, MouseEventHandler, ReactNode } from "react";
import styled from "styled-components";

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
    <StyledButton
      type="button"
      id={id}
      className={classNames.join(" ")}
      onClick={onClick}
    >
      {children}
    </StyledButton>
  );
};

const StyledButton = styled.button`
  gap: 8px;
`;
