import { Verify } from "iconsax-react";

/** The Verified Provider mark shown for providers on a paid plan. */
export function VerifiedBadge({ size = 16 }: { size?: number }) {
  return (
    <span title="Verified Provider" aria-label="Verified Provider" className="inline-flex shrink-0">
      <Verify size={size} color="#3d5afe" variant="Bold" />
    </span>
  );
}
