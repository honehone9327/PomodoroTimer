// mobile-app/src/screens/SentryExampleScreen.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Linking } from 'react-native';
import * as Sentry from '@sentry/react-native';

const SentryExampleScreen: React.FC = () => {
  const throwError = async () => {
    try {
      await Sentry.startSpan({
        name: 'Example Frontend Span',
        op: 'test',
      }, async () => {
        const response = await fetch("https://your-api-endpoint.com/api/sentry-example-api");
        if (!response.ok) {
          throw new Error("Sentry Example Frontend Error");
        }
      });
    } catch (error) {
      Sentry.captureException(error);
      Alert.alert('エラー', 'Sentryにエラーが送信されました。');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sentry Onboarding</Text>
      <TouchableOpacity style={styles.button} onPress={throwError}>
        <Text style={styles.buttonText}>Throw error!</Text>
      </TouchableOpacity>
      <Text style={styles.infoText}>
        Next, look for the error on the{' '}
        <Text style={styles.link} onPress={() => Linking.openURL('https://funsunevery.sentry.io/issues/?project=4508123835858944')}>
          Issues Page
        </Text>.
      </Text>
      <Text style={styles.infoText}>
        For more information, see{' '}
        <Text style={styles.link} onPress={() => Linking.openURL('https://docs.sentry.io/platforms/javascript/guides/react-native/')}>
          https://docs.sentry.io/platforms/javascript/guides/react-native/
        </Text>
      </Text>
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
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#1E40AF', // text-blue-800
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#AD6CAA',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#374151', // text-gray-700
    textAlign: 'center',
    marginBottom: 10,
  },
  link: {
    color: '#3B82F6',
    textDecorationLine: 'underline',
  },
});

export default SentryExampleScreen;
