interface StepHeaderProps {
  title: string;
  subtitle: string;
}

export function StepHeader({ title, subtitle }: StepHeaderProps) {
  return (
    <div className="space-y-3 mb-8">
      <h1 className="text-4xl font-bold text-gray-900">
        {title}
      </h1>
      <p className="text-lg text-gray-600 leading-relaxed">
        {subtitle}
      </p>
    </div>
  );
}

