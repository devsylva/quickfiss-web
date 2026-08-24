import { Star1 } from "iconsax-react";

interface StarRatingDisplayProps {
  rating: number;
  size?: number;
}

export const StarRatingDisplay: React.FC<StarRatingDisplayProps> = ({ rating, size = 16 }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star1 key={star} size={size} color={star <= Math.round(rating) ? "#f5b400" : "#e4e4e7"} variant="Bold" />
    ))}
  </div>
);
