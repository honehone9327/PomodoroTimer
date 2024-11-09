// pages/faq/index.tsx

import React from 'react'

const FAQ = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">よくある質問</h1>
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Q1: Pomodoro Timerとは何ですか？</h2>
            <p className="mt-2">A1: Pomodoro Techniqueに基づいたタイマーアプリで、集中と休憩を交互に繰り返すことで効率的に作業を進めることができます。</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Q2: 音楽を選択できますか？</h2>
            <p className="mt-2">A2: はい、設定からさまざまな音楽を選択することができます。</p>
          </div>
          {/* 他の質問を追加 */}
        </div>
      </div>
    </div>
  )
}

export default FAQ
