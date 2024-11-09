// mobile-app/src/screens/ContactUsScreen.tsx

import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Button } from '../components/ui/Button';

const ContactUsScreen: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = () => {
    // 実際の送信処理をここに実装
    Alert.alert('お問い合わせを送信しました。ありがとうございます！');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.inner}>
        <Text style={styles.title}>お問い合わせ</Text>
        <View style={styles.formGroup}>
          <Text style={styles.label}>名前</Text>
          <TextInput
            style={styles.input}
            placeholder="名前を入力してください"
            value={formData.name}
            onChangeText={(text) => handleChange('name', text)}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>メールアドレス</Text>
          <TextInput
            style={styles.input}
            placeholder="メールアドレスを入力してください"
            value={formData.email}
            onChangeText={(text) => handleChange('email', text)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>メッセージ</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="メッセージを入力してください"
            value={formData.message}
            onChangeText={(text) => handleChange('message', text)}
            multiline
            numberOfLines={4}
          />
        </View>
        <Button onPress={handleSubmit} style={styles.submitButton}>
          送信
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6', // bg-gray-100
  },
  inner: {
    padding: 20,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    color: '#4B5563', // text-gray-700
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB', // border-gray-300
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
    color: '#374151', // text-gray-700
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#3B82F6', // bg-blue-500
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
});

export default ContactUsScreen;
