import { ChangeEvent, HTMLInputTypeAttribute } from "react";

type InputType = {
  value: string | number;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
  placeholder?: string;
  required?: boolean;
  type: HTMLInputTypeAttribute;
  pattern?: string | undefined;
  min?: number | undefined;
};

export const Input = ({
  value,
  onChange,
  icon,
  placeholder = "",
  required = false,
  type,
  pattern = undefined,
  min = undefined,
}: InputType) => {
  return (
    <div className="px-4 py-3 border bg-tertiary flex flex-row gap-3 flex-1">
      {icon && icon}
      <input
        type={type}
        placeholder={placeholder}
        required={required}
        value={value}
        pattern={pattern}
        min={min}
        onChange={onChange}
        className="text-base text-secondary outline-none flex-1 w-full"
      />
    </div>
  );
};
