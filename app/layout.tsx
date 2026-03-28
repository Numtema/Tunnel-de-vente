import type {Metadata} from 'next';
import {Poppins} from 'next/font/google';
import './globals.css'; // Global styles

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Générateur de Tunnel de Vente',
  description: 'Générateur de Tunnel de Vente inspiré du Flight Dashboard',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="font-sans bg-[#2C423F] text-white" suppressHydrationWarning>{children}</body>
    </html>
  );
}
