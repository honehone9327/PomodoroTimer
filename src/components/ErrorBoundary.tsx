// src/components/ErrorBoundary.tsx

import React, { ErrorInfo, ReactNode } from 'react';

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
    // 必要に応じてエラートラッキングサービスに送信
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>アプリケーションでエラーが発生しました。</h1>
          <p>ページをリロードするか、後ほど再度お試しください。</p>
          {this.state.error && <pre>{this.state.error.toString()}</pre>}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
