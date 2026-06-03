import type { Metadata } from "next";
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "@/components/auth/session-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-heading",
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
    icon: [
      { url: "/favicon.png", type: "image/png" },
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.png",
    apple: "/favicon.png",
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
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} ${jetbrainsMono.variable} antialiased bg-background text-foreground font-sans`}
        suppressHydrationWarning
      >
        <SessionProvider>
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
        </SessionProvider>
      </body>
    </html>
  );
}
