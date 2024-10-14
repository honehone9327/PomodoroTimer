// src/pages/index.tsx

import React, { useState } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import PomodoroTimer from '@/components/Timer/PomodoroTimer';

const Home: React.FC = () => {
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
  };

  if (hasError) {
    throw new Error("テストエラー");
  }

  return (
    <div className="container mx-auto p-4">
      {/* 開発環境のみエラーを発生させるボタン */}
      {process.env.NODE_ENV === 'development' && (
        <button
          onClick={handleError}
          className="px-4 py-2 bg-red-500 text-white rounded mb-4"
        >
          テストエラーを発生させる
        </button>
      )}
      <PomodoroTimer />
    </div>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'faq', 'settings', 'privacy', 'terms'])),
  },
});

export default Home;
