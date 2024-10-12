// pages/contact-us/index.tsx

import React, { useState } from 'react'
import { Button } from "@/components/ui/Button"

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 実際の送信処理をここに実装
    alert('お問い合わせを送信しました。ありがとうございます！')
    setFormData({ name: '', email: '', message: '' })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">お問い合わせ</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">名前</label>
            <input
              type="text"
              name="name"
              id="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">メールアドレス</label>
            <input
              type="email"
              name="email"
              id="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">メッセージ</label>
            <textarea
              name="message"
              id="message"
              required
              value={formData.message}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              rows={4}
            ></textarea>
          </div>
          <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg">
            送信
          </Button>
        </form>
      </div>
    </div>
  )
}

export default ContactUs
