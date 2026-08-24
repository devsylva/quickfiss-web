"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { CloudAdd } from "iconsax-react";

interface MultiPhotoUploadProps {
  onChange?: (files: File[]) => void;
}

export const MultiPhotoUpload: React.FC<MultiPhotoUploadProps> = ({ onChange }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const filesRef = useRef<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files ?? []);
    if (newFiles.length === 0) return;
    filesRef.current = [...filesRef.current, ...newFiles];
    setPreviews((prev) => [...prev, ...newFiles.map((f) => URL.createObjectURL(f))]);
    onChange?.(filesRef.current);
    e.target.value = "";
  };

  return (
    <div className="flex flex-wrap gap-3">
      {previews.map((src, i) => (
        <div key={i} className="relative h-28 w-28 overflow-hidden rounded-input bg-zinc-100">
          <Image src={src} alt="" fill unoptimized className="object-cover" />
        </div>
      ))}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex h-28 w-28 flex-col items-center justify-center gap-1 rounded-input border-2 border-dashed border-border text-center"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50">
          <CloudAdd size={16} color="#10b981" variant="Linear" />
        </span>
        <span className="text-xs font-semibold text-primary">Click to upload</span>
        <span className="text-[11px] text-muted">or select</span>
        <span className="text-[11px] text-zinc-400">IMG, JPG</span>
      </button>
      <input ref={inputRef} type="file" accept="image/*" multiple onChange={handleChange} className="hidden" />
    </div>
  );
};
