import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'reel paglu',
  description: 'Rahul + Peeyush + Ray — full AI reel pipeline',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist+Mono:wght@300;400&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: "'Geist Mono', monospace", fontWeight: 300 }}>{children}</body>
    </html>
  )
}
