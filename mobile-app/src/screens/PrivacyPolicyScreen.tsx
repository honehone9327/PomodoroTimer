// mobile-app/src/screens/PrivacyPolicyScreen.tsx

import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';

const PrivacyPolicyScreen: React.FC = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>プライバシーポリシー</Text>
      {/* プライバシーポリシーのコンテンツをここに追加 */}
      <Text style={styles.content}>
        ここにプライバシーポリシーの内容が表示されます。
      </Text>
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
    marginBottom: 16,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default PrivacyPolicyScreen;
