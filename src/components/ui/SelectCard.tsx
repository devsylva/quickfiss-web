import React from "react";

interface SelectCardProps {
  selected: boolean;
  onSelect: () => void;
  illustration: React.ReactNode;
  title: string;
  description: string;
}

export const SelectCard: React.FC<SelectCardProps> = ({ selected, onSelect, illustration, title, description }) => (
  <button
    type="button"
    onClick={onSelect}
    className={`relative w-full rounded-card border p-6 text-center transition-colors ${
      selected ? "border-primary" : "border-border hover:border-zinc-300"
    }`}
  >
    <span
      className={`absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full border-2 ${
        selected ? "border-primary" : "border-border"
      }`}
    >
      {selected && <span className="h-3 w-3 rounded-full bg-primary" />}
    </span>
    <div className="mx-auto mb-4 flex h-28 w-28 items-center justify-center">{illustration}</div>
    <h3 className="text-base font-semibold text-foreground">{title}</h3>
    <p className="mt-1 text-sm text-muted">{description}</p>
  </button>
);
