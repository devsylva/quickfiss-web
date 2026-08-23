"use client";

import { useId, useRef, useState } from "react";
import Image from "next/image";
import { GalleryAdd } from "iconsax-react";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    onFileSelect?.(file);
    setPreview(file ? URL.createObjectURL(file) : null);
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
      {helperText && <p className="mt-2 text-xs text-muted">{helperText}</p>}
    </div>
  );
};
