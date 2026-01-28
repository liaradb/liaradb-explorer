import React, {
  DetailedHTMLProps,
  FC,
  InputHTMLAttributes,
  ReactNode,
  useMemo,
} from "react";

type InputProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

type TextFieldProps = Omit<InputProps, "type" | "className"> & {
  label?: string;
  before?: ReactNode;
  after?: ReactNode;
};

export const TextField: FC<TextFieldProps> = ({
  id,
  label: fieldLabel,
  before,
  after,
  ...props
}) => {
  const fieldId = useId(id);
  if (fieldLabel) {
    return (
      <div className="vscode-form-group">
        {fieldLabel && (
          <>
            <label htmlFor={fieldId} className="vscode-label">
              {fieldLabel}
            </label>{" "}
          </>
        )}
        <div className="vscode-textfield">
          {before}
          <input type="text" id={fieldId} {...props} />
          {after}
        </div>
      </div>
    );
  }

  return (
    <div className="vscode-form-group">
      <input type="text" className="vscode-textfield" id={fieldId} {...props} />
    </div>
  );
};

let count = 0;
const useId = (id?: string) => id || useMemo(() => `__id${count++}`, []);
