// src/pages/_app.tsx

import { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import '../styles/globals.css';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import ErrorBoundary from '@/components/ErrorBoundary'; // インポート
import { useEffect } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (typeof window !== 'undefined' && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
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
