import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'タスク管理ガントチャート',
  description: 'YMLファイルからタスクデータを読み込んでガントチャートで表示',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}