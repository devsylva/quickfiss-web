"use client";

import { useId, useRef, useState } from "react";
import Image from "next/image";
import { GalleryAdd } from "iconsax-react";
import { prepareUpload } from "@/lib/prepareUpload";

interface FileUploadBoxProps {
  label?: string;
  helperText?: string;
  accept?: string;
  onFileSelect?: (file: File | null) => void;
}

export const FileUploadBox: React.FC<FileUploadBoxProps> = ({
  label = "Upload",
  helperText,
  accept = "image/png,image/jpeg",
  onFileSelect,
}) => {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);

  // Copy the file into memory right away so it is still readable when the form is finally submitted.
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0] ?? null;
    setError(null);
    if (!picked) {
      onFileSelect?.(null);
      setPreview(null);
      return;
    }
    try {
      const safe = await prepareUpload(picked);
      onFileSelect?.(safe);
      setPreview(URL.createObjectURL(safe));
    } catch (err: unknown) {
      onFileSelect?.(null);
      setPreview(null);
      setError(err instanceof Error ? err.message : "We couldn't read that file. Please pick it again.");
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex h-28 w-28 flex-col items-center justify-center gap-1.5 overflow-hidden rounded-input bg-primary-light text-primary transition-colors hover:bg-primary-light/70"
      >
        {preview ? (
          <Image src={preview} alt="" width={112} height={112} unoptimized className="h-full w-full object-cover" />
        ) : (
          <>
            <GalleryAdd size={22} color="#3d5afe" variant="Linear" />
            <span className="text-sm font-medium">{label}</span>
          </>
        )}
      </button>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
      {error && <p className="mt-2 text-xs font-medium text-red-600">{error}</p>}
      {helperText && <p className="mt-2 text-xs text-muted">{helperText}</p>}
    </div>
  );
};
