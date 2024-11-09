// mobile-app/src/screens/TimerScreen.tsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import PomodoroTimer from '../components/Timer/PomodoroTimer';

const TimerScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Header />
      <PomodoroTimer />
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default TimerScreen;
