"use client";

import { ArrowUp2, ArrowDown2 } from "iconsax-react";

export interface TimeValue {
  hour: number;
  minute: number;
  meridiem: "AM" | "PM";
}

interface TimePickerProps {
  value: TimeValue;
  onChange: (value: TimeValue) => void;
}

const pad = (n: number) => String(n).padStart(2, "0");

const Column: React.FC<{ label: string; onUp: () => void; onDown: () => void }> = ({ label, onUp, onDown }) => (
  <div className="flex flex-col items-center gap-2">
    <button type="button" onClick={onUp} aria-label="Increase">
      <ArrowUp2 size={16} color="#171717" variant="Linear" />
    </button>
    <span className="w-10 text-center text-lg font-semibold text-foreground">{label}</span>
    <button type="button" onClick={onDown} aria-label="Decrease">
      <ArrowDown2 size={16} color="#171717" variant="Linear" />
    </button>
  </div>
);

export const TimePicker: React.FC<TimePickerProps> = ({ value, onChange }) => {
  const stepHour = (delta: number) =>
    onChange({ ...value, hour: ((value.hour - 1 + delta + 12) % 12) + 1 });
  const stepMinute = (delta: number) => onChange({ ...value, minute: (value.minute + delta + 60) % 60 });
  const toggleMeridiem = () => onChange({ ...value, meridiem: value.meridiem === "AM" ? "PM" : "AM" });

  return (
    <div className="rounded-input border border-border p-5">
      <div className="flex items-center justify-center gap-6">
        <Column label={pad(value.hour)} onUp={() => stepHour(1)} onDown={() => stepHour(-1)} />
        <span className="text-lg font-semibold text-foreground">:</span>
        <Column label={pad(value.minute)} onUp={() => stepMinute(1)} onDown={() => stepMinute(-1)} />
        <Column label={value.meridiem} onUp={toggleMeridiem} onDown={toggleMeridiem} />
      </div>
    </div>
  );
};
