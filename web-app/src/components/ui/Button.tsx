// src/components/ui/Button.tsx

import React, { ElementType } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'link';
  size?: 'small' | 'medium' | 'large';
  as?: ElementType; // 'as' プロパティを追加
}

const Button: React.FC<ButtonProps> = ({
  as: Component = 'button', // デフォルトは 'button'（小文字）
  variant = 'default',
  size = 'medium',
  children,
  className = '',
  ...props
}) => {
  const baseStyles = 'px-4 py-2 rounded';
  const variantStyles = {
    default: 'bg-blue-500 text-white hover:bg-blue-600',
    outline: 'border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white',
    link: 'text-blue-500 hover:underline'
  };

  const sizeStyles = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  return (
    <Component
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

export { Button };
