interface RadioListItemProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export const RadioListItem: React.FC<RadioListItemProps> = ({ label, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex w-full items-center justify-between rounded-input border px-4 py-3.5 text-sm transition-colors ${
      selected ? "border-primary ring-4 ring-primary/15" : "border-border hover:border-zinc-300"
    }`}
  >
    <span className="text-foreground">{label}</span>
    <span
      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
        selected ? "border-primary" : "border-border"
      }`}
    >
      {selected && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
    </span>
  </button>
);
