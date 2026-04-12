import type { Metadata } from "next";
import { Manrope, Unbounded } from "next/font/google";
import "./globals.css";
import { JsonLd } from "@/components/landing/JsonLd";
import {
  business,
  defaultDescription,
  defaultTitle,
  siteUrl,
} from "@/lib/seo-config";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const ogImage =
  "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=1200&h=630&fit=crop&q=85";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: `%s · JetSurf Севастополь`,
  },
  description: defaultDescription,
  applicationName: business.name,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: siteUrl,
    siteName: business.name,
    title: defaultTitle,
    description: defaultDescription,
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "Катание на джетсёрфе в Крыму — аренда с инструктажом",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: [ogImage],
  },
  category: "sports",
  keywords: [
    "аренда джетсёрфа Севастополь",
    "прокат jet surf в Крыму",
    "катание на джетсёрфе Севастополь",
    "джетсёрф Крым цена",
    "jetsurf Севастополь",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${manrope.variable} ${unbounded.variable} min-h-screen antialiased`}
      >
        <JsonLd />
        {children}
      </body>
    </html>
  );
}
