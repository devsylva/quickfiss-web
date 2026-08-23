interface StepHeaderProps {
  step: number;
  totalSteps: number;
  title: string;
  subtitle: string;
}

export const StepHeader: React.FC<StepHeaderProps> = ({ step, totalSteps, title, subtitle }) => (
  <div className="mb-8">
    <p className="text-sm text-muted">
      Step {step} of {totalSteps}
    </p>
    <h1 className="mt-1 text-2xl font-extrabold text-primary lg:text-3xl">{title}</h1>
    <p className="mt-1 text-sm font-medium text-emerald-500">{subtitle}</p>
  </div>
);
