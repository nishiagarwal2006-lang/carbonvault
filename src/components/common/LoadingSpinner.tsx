import React from 'react';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ fullScreen = false, size = 'md' }) => {
  const sizes = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
  };

  const spinner = (
    <div className="flex items-center justify-center gap-3" role="status" aria-label="Loading">
      <div className={`${sizes[size]} animate-spin rounded-full border-4 border-primary-500 border-t-transparent`}></div>
      <span className="sr-only">Loading...</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-200">
        {spinner}
      </div>
    );
  }

  return spinner;
};