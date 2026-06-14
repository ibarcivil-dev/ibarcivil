import type { Metadata } from "next";
import { Fraunces, Inter, Noto_Nastaliq_Urdu } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ScrollToTop } from "@/components/ScrollToTop";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const notoNastaliqUrdu = Noto_Nastaliq_Urdu({
  variable: "--font-noto-urdu",
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "IBAR — Long-form Thinking & Editorial Depth",
    template: "%s | IBAR"
  },
  description: "A digital publication focused on essays, ideas, culture, society, technology, politics, philosophy, and science for readers who value depth over speed.",
  openGraph: {
    title: "IBAR — Long-form Thinking & Editorial Depth",
    description: "A digital publication focused on essays, ideas, culture, society, technology, politics, philosophy, and science.",
    url: "https://ibar-webzine.vercel.app",
    siteName: "IBAR",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IBAR — Long-form Thinking & Editorial Depth",
    description: "A digital publication focused on essays, ideas, culture, society, technology, politics, philosophy, and science.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${notoNastaliqUrdu.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ScrollToTop />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
