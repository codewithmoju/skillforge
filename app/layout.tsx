import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { LayoutContent } from "@/components/layout/LayoutContent";
import Script from "next/script";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "EDUMATE AI - AI-Powered Learning Platform",
  description: "Master any skill with AI-guided learning, gamified progress, and personalized roadmaps.",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#0f172a',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0f172a" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body
        className={`${inter.variable} ${poppins.variable} antialiased bg-slate-950 text-slate-200`}
        suppressHydrationWarning
      >
        <LayoutContent>{children}</LayoutContent>
        <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''} />
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            className: 'bg-slate-900 border-slate-800 text-white',
            duration: 4000,
          }}
        />
      </body>
    </html>
  );
}
