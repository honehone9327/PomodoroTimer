// mobile-app/src/components/ui/Button.tsx

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface ButtonProps {
  variant?: 'default' | 'outline' | 'link';
  size?: 'small' | 'medium' | 'large';
  onPress?: () => void;
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  size = 'medium',
  onPress,
  children,
  style,
  textStyle,
}) => {
  const variantStyles = {
    default: styles.default,
    outline: styles.outline,
    link: styles.link,
  };

  const sizeStyles = {
    small: styles.small,
    medium: styles.medium,
    large: styles.large,
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        variantStyles[variant],
        sizeStyles[size],
        style,
      ]}
      onPress={onPress}
    >
      <Text style={[styles.text, variant === 'link' ? styles.linkText : styles.defaultText, textStyle]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  default: {
    backgroundColor: '#3B82F6', // bg-blue-500
  },
  outline: {
    borderWidth: 1,
    borderColor: '#3B82F6', // border-blue-500
    backgroundColor: 'transparent',
  },
  link: {
    backgroundColor: 'transparent',
  },
  small: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  medium: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  large: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 16,
  },
  defaultText: {
    color: '#FFFFFF', // text-white
  },
  linkText: {
    color: '#3B82F6', // text-blue-500
    textDecorationLine: 'underline',
  },
});

export { Button };
