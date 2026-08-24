interface WizardStepHeadingProps {
  step?: number;
  totalSteps?: number;
  title: string;
  accentColor?: string;
  stepColor?: string;
  rightSlot?: React.ReactNode;
}

export const WizardStepHeading: React.FC<WizardStepHeadingProps> = ({
  step,
  totalSteps,
  title,
  accentColor = "#3d5afe",
  stepColor = "#10b981",
  rightSlot,
}) => (
  <div className="mb-6">
    {(step !== undefined || rightSlot) && (
      <div className="flex items-center justify-between">
        {step !== undefined && totalSteps !== undefined ? (
          <p className="text-sm font-semibold" style={{ color: stepColor }}>
            Step {step}/{totalSteps}
          </p>
        ) : (
          <span />
        )}
        {rightSlot}
      </div>
    )}
    <div className="mt-1 flex items-start gap-2.5">
      <span className="mt-1 h-6 w-1 shrink-0 rounded-full" style={{ backgroundColor: accentColor }} />
      <h1 className="text-2xl font-extrabold leading-snug text-foreground lg:text-3xl">{title}</h1>
    </div>
  </div>
);
