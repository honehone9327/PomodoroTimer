// pages/announcements/index.tsx

import React from 'react'

type Announcement = {
  title: string
  date: string
  content: string
}

const announcements: Announcement[] = [
  {
    title: "バージョン1.1リリース",
    date: "2024-04-01",
    content: "新しい言語選択機能とバグ修正が追加されました！"
  },
  {
    title: "バージョン1.2リリース",
    date: "2024-05-15",
    content: "お問い合わせフォームが改善され、より迅速なサポートが可能になりました。"
  },
  // 他のお知らせを追加
]

const Announcements = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">お知らせ</h1>
        <div className="space-y-6">
          {announcements.map((announcement, index) => (
            <div key={index} className="border-b pb-4">
              <h2 className="text-xl font-semibold">{announcement.title}</h2>
              <p className="text-sm text-gray-500">{announcement.date}</p>
              <p className="mt-2 text-gray-700">{announcement.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Announcements
