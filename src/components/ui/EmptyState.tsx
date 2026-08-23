import { Box1 } from "iconsax-react";

interface EmptyStateProps {
  message: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-24 text-center">
    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-zinc-100">
      <Box1 size={36} color="#d4d4d8" variant="Linear" />
    </div>
    <p className="mt-4 text-sm text-muted">{message}</p>
  </div>
);
