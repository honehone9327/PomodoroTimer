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
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);

    // Notification APIのサポート確認とエラーハンドリング
    if ('Notification' in window && !isMobile) {
      if (Notification.permission !== 'granted') {
        Notification.requestPermission()
          .then((permission) => {
            console.log(`Notification permission: ${permission}`);
          })
          .catch((error) => {
            console.error("Notification permission request failed:", error);
          });
      }
    } else if (isMobile) {
      console.log("Notifications are not requested on mobile devices.");
    } else {
      console.warn("This browser does not support notifications.");
    }

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
