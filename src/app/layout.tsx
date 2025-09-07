import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Poppins, Bodoni_Moda } from 'next/font/google';
import localFont from 'next/font/local';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'aperture',
  description: 'Smart Property Viewing Scheduler',
};

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['400', '600', '700'],
});

const bodoni = Bodoni_Moda({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-bodoni-moda',
  axes: ['opsz'],
});

const fkGrotesk = localFont({
  src: [
    {
      path: '../assets/fonts/FKGroteskTrial-Light.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../assets/fonts/FKGroteskTrial-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../assets/fonts/FKGroteskTrial-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../assets/fonts/FKGroteskTrial-Bold.otf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-fk-grotesk',
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn('h-full', poppins.variable, bodoni.variable, fkGrotesk.variable)}
    >
      <head />
      <body className="font-body antialiased h-full bg-background">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
