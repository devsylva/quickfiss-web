"use client";

import { useId, useRef, useState } from "react";
import { DocumentUpload } from "iconsax-react";

interface FileInputRowProps {
  label: string;
  description?: string;
  accept?: string;
  onFileSelect?: (file: File | null) => void;
}

export const FileInputRow: React.FC<FileInputRowProps> = ({ label, description, accept, onFileSelect }) => {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    onFileSelect?.(file);
    setFileName(file?.name ?? null);
  };

  return (
    <div className="w-full">
      <label htmlFor={inputId} className="mb-2 block text-sm font-semibold text-foreground">
        {label} {description && <span className="font-normal text-muted">{description}</span>}
      </label>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex w-full items-center justify-between rounded-input border border-border bg-white px-4 py-3.5 text-left text-sm outline-none transition-colors hover:border-zinc-300"
      >
        <span className={fileName ? "text-foreground" : "text-zinc-400"}>
          {fileName ?? "Please choose a file"}
        </span>
        <DocumentUpload size={18} color="#a1a1aa" className="shrink-0" />
      </button>
      <input ref={inputRef} id={inputId} type="file" accept={accept} onChange={handleChange} className="hidden" />
    </div>
  );
};
