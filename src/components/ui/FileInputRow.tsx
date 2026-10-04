"use client";

import { useId, useRef, useState } from "react";
import { DocumentUpload } from "iconsax-react";
import { prepareUpload } from "@/lib/prepareUpload";

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

  const [error, setError] = useState<string | null>(null);

  // Copy the file into memory right away: on phones a picked file can stop being readable later
  // (camera temp files, WhatsApp media), which would make the final upload fail.
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0] ?? null;
    setError(null);
    if (!picked) {
      onFileSelect?.(null);
      setFileName(null);
      return;
    }
    try {
      const safe = await prepareUpload(picked);
      onFileSelect?.(safe);
      setFileName(safe.name);
    } catch (err: unknown) {
      onFileSelect?.(null);
      setFileName(null);
      setError(err instanceof Error ? err.message : "We couldn't read that file. Please pick it again.");
    }
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
      {error && <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>}
      <input ref={inputRef} id={inputId} type="file" accept={accept} onChange={handleChange} className="hidden" />
    </div>
  );
};
