import React, { useId } from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, className = "", id, rows = 4, ...props }) => {
  const generatedId = useId();
  const textareaId = id ?? generatedId;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={textareaId} className="mb-2 block text-sm font-semibold text-foreground">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        rows={rows}
        className={`w-full resize-none rounded-input border border-border bg-white px-4 py-3.5 text-sm text-foreground placeholder-zinc-400 outline-none transition-all duration-200 hover:border-zinc-300 focus:border-primary focus:ring-4 focus:ring-primary/15 ${className}`}
        {...props}
      />
    </div>
  );
};
