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
    // ここで外部のエラートラッキングサービスに送信することも可能
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">アプリケーションでエラーが発生しました。</h1>
            <p className="text-lg">ブラウザのコンソールを確認するか、開発者に連絡してください。</p>
            {/* 必要に応じてエラーメッセージを表示 */}
            {this.state.error && <pre className="mt-4 text-left">{this.state.error.toString()}</pre>}
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
