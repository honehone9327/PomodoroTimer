// mobile-app/src/components/ui/Slider.tsx

import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import SliderRN from '@react-native-community/slider';

interface SliderProps {
  id: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onValueChange: (value: number) => void;
  className?: string;
}

const Slider: React.FC<SliderProps> = ({
  id,
  min,
  max,
  step = 1,
  value,
  onValueChange,
  className,
}) => {
  return (
    <View style={styles.sliderContainer}>
      <SliderRN
        minimumValue={min}
        maximumValue={max}
        step={step}
        value={value}
        onValueChange={onValueChange}
        style={styles.slider}
        minimumTrackTintColor="#3B82F6" // bg-blue-500
        maximumTrackTintColor="#D1D5DB" // bg-gray-300
        thumbTintColor="#3B82F6"
      />
      <Text style={styles.valueText}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  sliderContainer: {
    width: '100%',
    alignItems: 'center',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  valueText: {
    marginTop: 8,
    fontSize: 14,
    color: '#374151', // text-gray-700
  },
});

export { Slider };
