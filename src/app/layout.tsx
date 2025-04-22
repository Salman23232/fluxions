import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { dark } from "@clerk/themes";
import { ThemeProvider } from "@/providers/theme-provide";
import { Toaster } from "@/components/ui/sonner";

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
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster /> {/* ✅ Now correctly inside <body> */}
        </ThemeProvider>
      </body>
    </html>
  );
}
