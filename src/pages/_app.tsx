// src/pages/_app.tsx

import { AppProps } from 'next/app'
import { appWithTranslation } from 'next-i18next'
import '../styles/globals.css'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import { useEffect } from 'react'

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission()
    }
  }, [])

  return (
    <>
      <Header />
      <Component {...pageProps} />
      <Footer />
    </>
  )
}

export default appWithTranslation(MyApp)
