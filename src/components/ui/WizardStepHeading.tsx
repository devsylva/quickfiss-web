interface WizardStepHeadingProps {
  step: number;
  totalSteps: number;
  title: string;
  accentColor?: string;
  stepColor?: string;
}

export const WizardStepHeading: React.FC<WizardStepHeadingProps> = ({
  step,
  totalSteps,
  title,
  accentColor = "#3d5afe",
  stepColor = "#10b981",
}) => (
  <div className="mb-6">
    <p className="text-sm font-semibold" style={{ color: stepColor }}>
      Step {step}/{totalSteps}
    </p>
    <div className="mt-1 flex items-start gap-2.5">
      <span className="mt-1 h-6 w-1 shrink-0 rounded-full" style={{ backgroundColor: accentColor }} />
      <h1 className="text-2xl font-extrabold leading-snug text-foreground lg:text-3xl">{title}</h1>
    </div>
  </div>
);
