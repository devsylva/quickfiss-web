"use client";

interface RangeSliderProps {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  formatLabel?: (value: number) => string;
}

const thumbClasses =
  "pointer-events-none absolute inset-0 h-1.5 w-full appearance-none bg-transparent " +
  "[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer " +
  "[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer";

export const RangeSlider: React.FC<RangeSliderProps> = ({
  min,
  max,
  step = 1,
  value,
  onChange,
  formatLabel = (v) => String(v),
}) => {
  const [lo, hi] = value;
  const pct = (v: number) => ((v - min) / (max - min)) * 100;

  const handleLo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = Math.min(Number(e.target.value), hi - step);
    onChange([next, hi]);
  };
  const handleHi = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = Math.max(Number(e.target.value), lo + step);
    onChange([lo, next]);
  };

  return (
    <div className="w-full">
      <div className="relative h-5 w-full">
        <div className="absolute top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full bg-zinc-200" />
        <div
          className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-primary"
          style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={lo}
          onChange={handleLo}
          className={thumbClasses}
          style={{ zIndex: 3 }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={hi}
          onChange={handleHi}
          className={thumbClasses}
          style={{ zIndex: 4 }}
        />
      </div>
      <div className="mt-2 flex justify-between text-sm text-muted">
        <span>{formatLabel(min)}</span>
        <span>{formatLabel(max)}</span>
      </div>
    </div>
  );
};
