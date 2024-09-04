import type { Metadata } from "next";
import { Mulish } from "next/font/google";
import "./globals.css";
import Providers from "@/components/layout/providers";
import { ThemeProvider } from '@/components/layout/themes/ThemeProvider'
import { Toaster } from "@/components/ui/toaster";

const mulish = Mulish({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Accesspilot",
  description: "Role manager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={mulish.className}>
        {/* <Providers>
          <Toaster />
          {children}
        </Providers> */}
        <ThemeProvider
          defaultTheme="light"
          enableColorScheme
          themes={['light', 'dark', 'tangerine']}
        >
          <Toaster />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
