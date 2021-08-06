import React from "react";

export const Select: React.FC<{
  value: string;
  onChange: (value: string) => void;
  label: string;
  options: { value: string; label: string }[];
}> = ({ value, onChange, label, options }) => {
  return (
    <div>
      <label htmlFor="">
        <div>{label}</div>
        <select value={value} onChange={(e) => onChange(e.target.value)}>
          {options.map((optionProps) => (
            <SelectOption {...optionProps} key={optionProps.value} />
          ))}
        </select>
      </label>
    </div>
  );
};

export const SelectOption: React.FC<
  React.OptionHTMLAttributes<any> & { label?: string }
> = ({ label, children, ...optionProps }) => {
  return <option {...optionProps}>{label || children}</option>;
};
