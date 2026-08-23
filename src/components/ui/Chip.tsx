import React from "react";

interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected: boolean;
}

export const Chip: React.FC<ChipProps> = ({ selected, className = "", ...props }) => (
  <button
    type="button"
    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
      selected ? "bg-primary text-white" : "bg-primary-light text-primary hover:bg-primary-light/70"
    } ${className}`}
    {...props}
  />
);
