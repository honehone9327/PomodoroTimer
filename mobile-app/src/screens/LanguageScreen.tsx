// mobile-app/src/screens/LanguageScreen.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Button } from '../components/ui/Button';

const LanguageScreen: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('ja');

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    // 実際の言語切替処理をここに実装
    // 例: i18nライブラリを使用して言語を変更
    Alert.alert('言語変更', `${lang === 'ja' ? '日本語' : 'English'}に変更しました。`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>言語選択</Text>
      <View style={styles.buttonContainer}>
        <Button
          variant={selectedLanguage === 'ja' ? 'default' : 'outline'}
          onPress={() => handleLanguageChange('ja')}
          style={styles.languageButton}
        >
          日本語
        </Button>
        <Button
          variant={selectedLanguage === 'en' ? 'default' : 'outline'}
          onPress={() => handleLanguageChange('en')}
          style={styles.languageButton}
        >
          English
        </Button>
        {/* 他の言語を追加する場合はここに */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F3F4F6', // bg-gray-100
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#1E40AF', // text-blue-800
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
    gap: 15,
  },
  languageButton: {
    paddingVertical: 12,
    borderRadius: 8,
  },
});

export default LanguageScreen;
