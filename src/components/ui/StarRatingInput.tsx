"use client";

import { Star1 } from "iconsax-react";

interface StarRatingInputProps {
  value: number;
  onChange: (value: number) => void;
}

export const StarRatingInput: React.FC<StarRatingInputProps> = ({ value, onChange }) => (
  <div className="flex items-center justify-center gap-2">
    {[1, 2, 3, 4, 5].map((star) => (
      <button key={star} type="button" onClick={() => onChange(star)} aria-label={`Rate ${star} stars`}>
        <Star1 size={32} color={star <= value ? "#f5b400" : "#e4e4e7"} variant="Bold" />
      </button>
    ))}
  </div>
);
