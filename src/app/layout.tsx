import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ConsultLegal - AI-Powered Legal Document Platform",
  description: "Create professional legal documents with AI assistance. NDA, Employment Agreements, Service Agreements and more. Trusted by businesses across India.",
  keywords: ["legal documents", "NDA", "employment agreement", "AI legal", "legal tech", "India"],
  authors: [{ name: "ConsultLegal" }],
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "ConsultLegal - AI-Powered Legal Document Platform",
    description: "Create professional legal documents with AI assistance. NDA, Employment Agreements, Service Agreements and more.",
    url: "https://consultlegal.in",
    siteName: "ConsultLegal",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ConsultLegal - AI-Powered Legal Document Platform",
    description: "Create professional legal documents with AI assistance. NDA, Employment Agreements, Service Agreements and more.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-background text-foreground font-sans`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
