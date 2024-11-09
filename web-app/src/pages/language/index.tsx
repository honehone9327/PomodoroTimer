// pages/language/index.tsx

import React from 'react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Button } from "@/components/ui/Button"

const LanguageSelection = () => {
  const router = useRouter()
  const [selectedLanguage, setSelectedLanguage] = useState<string>('ja')

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang)
    // 実際の言語切替処理をここに実装
    // 例: i18nライブラリを使用して言語を変更
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">言語選択</h1>
        <div className="space-y-4">
          <Button
            variant={selectedLanguage === 'ja' ? 'default' : 'outline'}
            onClick={() => handleLanguageChange('ja')}
            className="w-full"
          >
            日本語
          </Button>
          <Button
            variant={selectedLanguage === 'en' ? 'default' : 'outline'}
            onClick={() => handleLanguageChange('en')}
            className="w-full"
          >
            English
          </Button>
          {/* 他の言語を追加する場合はここに */}
        </div>
      </div>
    </div>
  )
}

export default LanguageSelection
