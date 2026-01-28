import React, { DetailedHTMLProps, FC, InputHTMLAttributes } from "react";

type InputProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

type TextInputProps = Omit<InputProps, "type" | "className">;

export const TextInput: FC<TextInputProps> = ({ ...props }) => {
  return <input type="text" className="vscode-textfield" {...props} />;
};
