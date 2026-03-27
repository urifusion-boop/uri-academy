import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'URI Academy - Sales Training & Certification',
  description: 'Master modern sales strategies with our comprehensive training program. Get certified and accelerate your career in sales.',
  keywords: 'sales training, sales certification, sales academy, professional development',
  icons: {
    icon: '/assets/uri-logo.png',
    apple: '/assets/uri-logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
