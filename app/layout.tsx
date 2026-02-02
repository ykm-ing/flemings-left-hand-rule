import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Fleming's Left Hand Rule - Interactive Drilling",
  description: 'Interactive 3D drilling app for HKDSE students to learn and practice Fleming\'s Left Hand Rule',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  )
}
