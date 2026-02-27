import { jakarta, inter } from '@/lib/fonts'
import '../../globals.css'

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${jakarta.variable} ${inter.variable}`}>
      <body className="bg-background text-foreground antialiased">{children}</body>
    </html>
  )
}
