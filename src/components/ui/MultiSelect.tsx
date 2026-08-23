"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown2 } from "iconsax-react";

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  label?: string;
  placeholder?: string;
  options: Option[];
  selected: string[];
  onChange: (next: string[]) => void;
}

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M13.5 4.5L6 12L2.5 8.5"
      stroke="#3d5afe"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  placeholder = "Select",
  options,
  selected,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const toggle = (value: string) => {
    onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]);
  };

  const displayText =
    selected.length > 0
      ? options
          .filter((o) => selected.includes(o.value))
          .map((o) => o.label)
          .join(", ")
      : placeholder;

  return (
    <div ref={containerRef} className="w-full">
      {label && <label className="mb-2 block text-sm font-semibold text-foreground">{label}</label>}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex w-full items-center justify-between rounded-input border bg-white px-4 py-3.5 text-left text-sm outline-none transition-colors ${
          open ? "border-primary ring-4 ring-primary/15" : "border-border hover:border-zinc-300"
        }`}
      >
        <span className={`truncate ${selected.length > 0 ? "text-foreground" : "text-zinc-400"}`}>
          {displayText}
        </span>
        <ArrowDown2
          size={16}
          color="#a1a1aa"
          className={`shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="mt-2 rounded-input border border-border bg-white py-2 shadow-lg">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggle(opt.value)}
              className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm text-foreground hover:bg-zinc-50"
            >
              {opt.label}
              {selected.includes(opt.value) && <CheckIcon />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
