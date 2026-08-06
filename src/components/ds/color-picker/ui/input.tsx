import * as React from 'react';
import { cn } from '@/lib/cn';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Icon or element to display before input */
  leadingIcon?: React.ReactNode;
  /** Icon or element to display after input */
  trailingIcon?: React.ReactNode;
  /** Show error state */
  error?: boolean;
  /** Error message text */
  errorMessage?: string;
  /** Helper text below input */
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input(
    {
      className,
      type = 'text',
      leadingIcon,
      trailingIcon,
      error,
      errorMessage,
      helperText,
      disabled,
      ...props
    },
    ref,
  ) {
    return (
      <div className="flex flex-col gap-1.5">
        <div className="relative flex items-center">
          {leadingIcon && (
            <div className="absolute left-3 flex items-center text-foreground-muted pointer-events-none">
              {leadingIcon}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            disabled={disabled}
            className={cn(
              'flex w-full rounded-md border border-border bg-surface px-3 py-2 text-sm',
              'placeholder:text-foreground-muted',
              'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-surface',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'transition-colors duration-200',
              leadingIcon && 'pl-9',
              trailingIcon && 'pr-9',
              error && 'border-danger focus:ring-danger',
              className,
            )}
            {...props}
          />
          {trailingIcon && (
            <div className="absolute right-3 flex items-center text-foreground-muted pointer-events-none">
              {trailingIcon}
            </div>
          )}
        </div>
        {errorMessage && error && (
          <p className="text-xs text-danger font-medium">{errorMessage}</p>
        )}
        {helperText && !error && (
          <p className="text-xs text-foreground-muted">{helperText}</p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
