// mobile-app/src/components/common/ErrorBoundary.tsx

import React, { ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Sentry from '@sentry/react-native';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    Sentry.captureException(error, { extra: { errorInfo } });
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>アプリケーションでエラーが発生しました。</Text>
          <Text style={styles.message}>アプリを再起動するか、後ほど再度お試しください。</Text>
          {this.state.error && (
            <Text style={styles.error}>{this.state.error.toString()}</Text>
          )}
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#F3F4F6', // bg-gray-100
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  message: {
    fontSize: 18,
  },
  error: {
    marginTop: 16,
    textAlign: 'left',
    color: '#B91C1C', // text-red-600
  },
});

export default ErrorBoundary;
