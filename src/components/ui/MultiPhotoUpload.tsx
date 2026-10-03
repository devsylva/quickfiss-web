"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { CloseCircle, CloudAdd } from "iconsax-react";

const MAX_BYTES = 4 * 1024 * 1024;

interface MultiPhotoUploadProps {
  /** Photos already chosen (e.g. restored after a refresh). */
  initialFiles?: File[];
  maxFiles?: number;
  onChange?: (files: File[]) => void;
}

interface Entry {
  file: File;
  url: string;
}

const toEntry = (file: File): Entry => ({ file, url: URL.createObjectURL(file) });

export const MultiPhotoUpload: React.FC<MultiPhotoUploadProps> = ({ initialFiles = [], maxFiles = 8, onChange }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  // A preview URL is created once per photo (when it is added or restored) and revoked when it is removed.
  const [entries, setEntries] = useState<Entry[]>(() => initialFiles.map(toEntry));
  const [error, setError] = useState<string | null>(null);

  const update = (next: Entry[]) => {
    setEntries(next);
    onChange?.(next.map((entry) => entry.file));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (picked.length === 0) return;

    const accepted: File[] = [];
    let problem: string | null = null;
    for (const file of picked) {
      if (!file.type.startsWith("image/")) problem = `${file.name} isn't an image.`;
      else if (file.size > MAX_BYTES) problem = `${file.name} is larger than 4MB.`;
      else if (entries.length + accepted.length >= maxFiles) problem = `You can add up to ${maxFiles} photos.`;
      else accepted.push(file);
    }
    setError(problem);
    if (accepted.length > 0) update([...entries, ...accepted.map(toEntry)]);
  };

  const remove = (index: number) => {
    URL.revokeObjectURL(entries[index].url);
    update(entries.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {entries.map((entry, i) => (
          <div key={entry.url} className="relative h-28 w-28 overflow-hidden rounded-input bg-zinc-100">
            <Image src={entry.url} alt="" fill unoptimized className="object-cover" />
            <button
              type="button"
              onClick={() => remove(i)}
              aria-label="Remove photo"
              className="absolute right-1 top-1 rounded-full bg-white/90"
            >
              <CloseCircle size={20} color="#171717" variant="Bold" />
            </button>
          </div>
        ))}
        {entries.length < maxFiles && (
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
        )}
        <input ref={inputRef} type="file" accept="image/*" multiple onChange={handleChange} className="hidden" />
      </div>
      {error && <p className="mt-2 text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
};
