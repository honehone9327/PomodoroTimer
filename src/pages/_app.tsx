// src/pages/_app.tsx

import { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import '../styles/globals.css';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // 通知許可のリクエストを一時的に無効化
    // if (typeof window !== 'undefined' && Notification.permission !== 'granted') {
    //   Notification.requestPermission();
    // }

    // グローバルエラーハンドリングの追加
    window.onerror = function(message, source, lineno, colno, error) {
      console.error("Global error caught:", message, source, lineno, colno, error);
    };

    window.onunhandledrejection = function(event) {
      console.error("Unhandled promise rejection:", event.reason);
    };
  }, []);

  return (
    <ErrorBoundary>
      <Header />
      <Component {...pageProps} />
      <Footer />
    </ErrorBoundary>
  );
}

export default appWithTranslation(MyApp);
