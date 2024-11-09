// mobile-app/src/components/ui/Label.tsx

import React from 'react';
import { Text, StyleSheet, TextProps } from 'react-native';

interface LabelProps extends TextProps {
  children: React.ReactNode;
}

const Label: React.FC<LabelProps> = ({ children, style, ...props }) => {
  return (
    <Text style={[styles.label, style]} {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563', // text-gray-700
  },
});

export { Label };
