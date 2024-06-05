import { ChangeEvent, HTMLInputTypeAttribute } from "react";

type InputType = {
  value: string | number;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
  placeholder?: string;
  required?: boolean;
  type: HTMLInputTypeAttribute;
  pattern?: string | undefined;
  min?: number | undefined;
  max?: number | undefined;
  disabled?: boolean;
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
  max = undefined,
  disabled = false,
}: InputType) => {
  return (
    <div className="px-4 py-3 border bg-tertiary flex flex-row gap-3 flex-1 rounded">
      {icon && icon}
      <input
        type={type}
        placeholder={placeholder}
        required={required}
        value={value}
        pattern={pattern}
        min={min}
        max={max}
        onChange={onChange}
        className="text-base text-secondary outline-none flex-1 w-full"
        disabled={disabled}
      />
    </div>
  );
};

type NewInputType = {
  value: string | number;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
  placeholder?: string;
  required?: boolean;
  type: HTMLInputTypeAttribute;
  pattern?: string | undefined;
  min?: any | undefined;
  max?: number | undefined;
  disabled?: boolean;
  label?: string;
};

export const NewInput = ({
  value,
  onChange,
  icon,
  placeholder = "",
  required = false,
  type,
  pattern = undefined,
  min = undefined,
  max = undefined,
  disabled = false,
  label = "",
}: NewInputType) => {
  return (
    <div className="flex-1 flex flex-col gap-[6px]">
      <label className="font-semibold">{label}</label>
      <div className="px-4 py-3 border bg-tertiary flex flex-row gap-3 flex-1 rounded-2xl">
        {icon && icon}
        <input
          type={type}
          placeholder={placeholder}
          required={required}
          value={value}
          pattern={pattern}
          min={min}
          max={max}
          onChange={onChange}
          className="text-base text-secondary outline-none flex-1 w-full"
          disabled={disabled}
        />
      </div>
    </div>
  );
};
