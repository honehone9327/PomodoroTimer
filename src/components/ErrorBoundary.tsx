// src/components/ErrorBoundary.tsx

import React, { ErrorInfo, ReactNode } from 'react';
import * as Sentry from '@sentry/nextjs';

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
    // エラーが発生した際に状態を更新
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // エラー情報をコンソールにログ出力
    console.error("Uncaught error:", error, errorInfo);
    // Sentryにエラーを送信
    Sentry.captureException(error, { extra: { errorInfo: errorInfo } });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
            アプリケーションでエラーが発生しました。
          </h1>
          <p style={{ fontSize: '18px' }}>
            ページをリロードするか、後ほど再度お試しください。
          </p>
          {this.state.error && (
            <pre style={{ marginTop: '16px', textAlign: 'left' }}>
              {this.state.error.toString()}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
