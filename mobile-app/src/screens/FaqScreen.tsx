// mobile-app/src/screens/FaqScreen.tsx

import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';

const FaqScreen: React.FC = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>よくある質問</Text>
      <View style={styles.faqItem}>
        <Text style={styles.question}>Q1: Pomodoro Timerとは何ですか？</Text>
        <Text style={styles.answer}>
          A1: Pomodoro Techniqueに基づいたタイマーアプリで、集中と休憩を交互に繰り返すことで効率的に作業を進めることができます。
        </Text>
      </View>
      <View style={styles.faqItem}>
        <Text style={styles.question}>Q2: 音楽を選択できますか？</Text>
        <Text style={styles.answer}>
          A2: はい、設定からさまざまな音楽を選択することができます。
        </Text>
      </View>
      {/* 他の質問を追加 */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F3F4F6', // bg-gray-100
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  faqItem: {
    marginBottom: 16,
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  answer: {
    fontSize: 16,
    color: '#374151', // text-gray-700
  },
});

export default FaqScreen;
