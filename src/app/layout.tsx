import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './Providers';
import './globals.css';
export const metadata: Metadata = {
  title: 'Dividimos Cuentas',
  description:
    'Dividimos cuentas es una app para dividir cuentas entre amigos, familiares o compañeros de trabajo.',
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
