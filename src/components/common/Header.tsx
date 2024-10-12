// src/components/common/Header.tsx

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center p-4 bg-green-500 text-white">
      <h1 className="text-xl font-bold">Pomodoro Timer</h1>
      <nav className="space-x-4">
        <Link href="/">
          <Button variant="link">ホーム</Button>
        </Link>
        <Link href="/faq">
          <Button variant="link">FAQ</Button>
        </Link>
        <Link href="/contact-us">
          <Button variant="link">お問い合わせ</Button>
        </Link>
      </nav>
    </header>
  )
}

export default Header
