// mobile-app/src/instrumentation.ts

import * as Sentry from '@sentry/react-native';

export async function register() {
  Sentry.init({
    dsn: 'YOUR_SENTRY_DSN', // SentryのDSNをここに入力
    // その他の設定オプション
  });
}

export const onRequestError = (error: any) => {
  Sentry.captureException(error);
};
