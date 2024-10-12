// src/pages/index.tsx

import React from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import PomodoroTimer from '@/components/Timer/PomodoroTimer'

const Home: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <PomodoroTimer />
    </div>
  )
}

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'faq', 'settings', 'privacy', 'terms'])),
  },
})

export default Home
