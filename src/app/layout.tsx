import type { Metadata } from "next";
import {ClerkProvider} from '@clerk/nextjs'
import "./globals.css";
import {dark} from '@clerk/themes'
import { ThemeProvider } from "@/providers/theme-provide";




export const metadata: Metadata = {
  title: "Fluxion",
  description: "Your all-in-one agency solution",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"
    suppressHydrationWarning >
    <body
      >
      <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      >
      
        {children}
      
      </ThemeProvider>
      </body>
    </html>

  );
}
