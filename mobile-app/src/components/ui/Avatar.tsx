// mobile-app/src/components/ui/Avatar.tsx

import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: number;
  children?: React.ReactNode;
}

const Avatar: React.FC<AvatarProps> = ({ src, alt, size = 50, children }) => {
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
      {src ? (
        <Image source={{ uri: src }} style={styles.image} />
      ) : (
        <View style={styles.fallback}>
          <Text style={styles.fallbackText}>{children}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    overflow: 'hidden',
    backgroundColor: '#E5E7EB', // bg-gray-200
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  fallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackText: {
    color: '#6B7280', // text-gray-500
    fontSize: 16,
  },
});

export default Avatar;
