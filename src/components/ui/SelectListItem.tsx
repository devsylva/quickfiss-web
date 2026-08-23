interface SelectListItemProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M13.5 4.5L6 12L2.5 8.5"
      stroke="#3d5afe"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const SelectListItem: React.FC<SelectListItemProps> = ({ label, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex w-full items-center justify-between rounded-input border px-5 py-4 text-left text-base transition-colors ${
      selected ? "border-transparent bg-primary-light text-foreground" : "border-border bg-white text-foreground hover:border-zinc-300"
    }`}
  >
    {label}
    {selected && <CheckIcon />}
  </button>
);
