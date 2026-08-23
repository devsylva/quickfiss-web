import React from "react";
import { ArrowDown2 } from "iconsax-react";

interface CategoryAccordionProps {
  icon: React.ReactNode;
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export const CategoryAccordion: React.FC<CategoryAccordionProps> = ({
  icon,
  title,
  expanded,
  onToggle,
  children,
}) => (
  <div className="border-b border-border">
    <button type="button" onClick={onToggle} className="flex w-full items-center justify-between gap-3 py-4">
      <span className="flex items-center gap-3">
        <span className="text-primary">{icon}</span>
        <span className="text-base text-foreground">{title}</span>
      </span>
      <ArrowDown2
        size={18}
        color="#a1a1aa"
        className={`shrink-0 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
      />
    </button>
    <div className={`grid transition-[grid-template-rows] duration-300 ${expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
      <div className="overflow-hidden">
        <div className="flex flex-wrap gap-2 pb-4">{children}</div>
      </div>
    </div>
  </div>
);
