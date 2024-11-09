// mobile-app/src/screens/HomeScreen.tsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import PomodoroTimer from '../components/Timer/PomodoroTimer';

const HomeScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <PomodoroTimer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#F3F4F6', // bg-gray-100
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
