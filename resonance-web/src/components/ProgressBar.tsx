'use client';

interface ProgressBarProps {
  completed: number;
  total: number;
  label?: string;
  showPercentage?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export function ProgressBar({
  completed,
  total,
  label,
  showPercentage = true,
  variant = 'default',
}: ProgressBarProps) {
  const percentage = Math.round((completed / total) * 100);

  const variantClasses = {
    default: 'from-blue-400 to-blue-600',
    success: 'from-green-400 to-green-600',
    warning: 'from-yellow-400 to-yellow-600',
    danger: 'from-red-400 to-red-600',
  };

  return (
    <div className="w-full">
      {label && (
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-700">{label}</p>
          {showPercentage && (
            <p className="text-sm font-semibold text-gray-600">{percentage}%</p>
          )}
        </div>
      )}

      <div className="h-3 w-full rounded-full bg-gray-200 shadow-inner">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${variantClasses[variant]} transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {!label && showPercentage && (
        <p className="mt-1 text-xs text-gray-600">
          {completed} of {total}
        </p>
      )}
    </div>
  );
}
