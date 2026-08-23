import React, { useId } from "react";
import { ArrowDown2 } from "iconsax-react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  placeholder?: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({
  label,
  placeholder,
  options,
  className = "",
  id,
  ...props
}) => {
  const generatedId = useId();
  const selectId = id ?? generatedId;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="mb-2 block text-sm font-semibold text-foreground">
          {label}
        </label>
      )}
      <div className="relative w-full">
        <select
          id={selectId}
          className={`w-full appearance-none rounded-input border border-border bg-white px-4 py-3.5 text-sm outline-none transition-all duration-200 hover:border-zinc-300 focus:border-primary focus:ring-4 focus:ring-primary/15 ${
            props.value ? "text-foreground" : "text-zinc-400"
          } ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ArrowDown2
          size={16}
          color="#a1a1aa"
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
        />
      </div>
    </div>
  );
};
