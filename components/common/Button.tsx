import React from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  className,
  ...props
}) => {
  const buttonClasses = clsx(
    'rounded-md font-medium',
    {
      'bg-brand-primary text-white hover:bg-brand-primary-dark focus:outline-none focus:ring-2 focus:ring-brand-primary-dark':
        variant === 'primary',
      'bg-brand-secondary text-white hover:bg-brand-secondary-dark focus:outline-none focus:ring-2 focus:ring-brand-secondary-dark':
        variant === 'secondary',
      'text-brand-primary border border-brand-primary hover:bg-brand-primary-light focus:outline-none focus:ring-2 focus:ring-brand-primary':
        variant === 'outline',
      'px-4 py-2 text-sm': size === 'sm',
      'px-6 py-3 text-base': size === 'md',
      'px-8 py-4 text-lg': size === 'lg',
    },
    className
  );

  return (
    <button
      type="button"
      disabled={disabled}
      className={buttonClasses}
      {...props}
    />
  );
};

export default Button;