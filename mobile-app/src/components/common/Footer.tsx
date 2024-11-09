// mobile-app/src/components/common/Footer.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Footer: React.FC = () => {
  return (
    <View style={styles.footer}>
      <Text style={styles.text}>© 2024 Pomodoro Timer. All rights reserved.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#E5E7EB', // bg-gray-200
  },
  text: {
    color: '#4B5563', // text-gray-700
    textAlign: 'center',
  },
});

export default Footer;
