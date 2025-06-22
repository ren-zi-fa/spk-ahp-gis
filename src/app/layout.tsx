import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";

import "./globals.css";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { ClientWrapper } from "@/components/Layout-Client-Wrapper";

export const metadata: Metadata = {
  title: "My-SPK",
  description:
    "sebuah system yang berfungsi untuk membandingkan alternatif wilayah kecamatan yang ada di pasaman barat untuk keperluan pemilihan lahan kosong ",
};

export default function RootLayout({
  children,
}: Readonly<{
  
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={GeistSans.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Toaster position="top-center" />
          <ClientWrapper>{children}</ClientWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
