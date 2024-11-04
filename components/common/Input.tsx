import React from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  type?: string;
  value?: string;
  placeholder?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const Input: React.FC<InputProps> = ({
  id,
  type = 'text',
  value,
  placeholder,
  onChange,
  className,
  ...props
}) => {
  return (
    <input
      id={id}
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      className={clsx(
        'w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500',
        className
      )}
      {...props}
    />
  );
};

export default Input;