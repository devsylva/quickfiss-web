interface ProgressBarProps {
  percent: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ percent }) => (
  <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-200">
    <div
      className="h-full rounded-full bg-emerald-500 transition-all duration-300"
      style={{ width: `${percent}%` }}
    />
  </div>
);
