import type { Metadata } from 'next';
import './globals.css';
import { Manrope } from 'next/font/google';
import { ThemeProvider } from 'next-themes';

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
  weight: ['400', '600', '800'],
});

export const metadata: Metadata = {
  title: {
    template: '%s | The Famous ERP',
    default: 'The Famous ERP | Pizza & Beer',
  },
  description: 'Sistema de planificación de recursos empresariales para The Famous Pizza & Beer. Control de inventarios, recetas, servicios y analíticas.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${manrope.className} antialiased bg-[var(--background)] text-[var(--foreground)]`}
      >
        <ThemeProvider attribute="class" defaultTheme="light">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
