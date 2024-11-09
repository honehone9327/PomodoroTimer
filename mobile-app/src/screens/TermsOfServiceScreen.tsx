// mobile-app/src/screens/TermsOfServiceScreen.tsx

import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';

const TermsOfServiceScreen: React.FC = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>ご利用規約</Text>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>第1条（目的）</Text>
        <Text style={styles.sectionContent}>
          このご利用規約（以下、「本規約」といいます。）は、ユーザーが当アプリケーションを利用するにあたり、当社との間の権利義務関係を定めることを目的とします。
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>第2条（利用条件）</Text>
        <Text style={styles.sectionContent}>
          ユーザーは、本規約を遵守し、法令または公序良俗に反する行為を行ってはなりません。
        </Text>
      </View>
      {/* 他の条項を追加 */}
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
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default TermsOfServiceScreen;
