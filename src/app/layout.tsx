import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";
import ClientRoot from "./client-root";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="min-h-dvh bg-gradient-to-b from-[#050a1f] to-[#0a173a] text-white antialiased"
      >
        <ClientRoot>{children}</ClientRoot>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NODE_ENV === 'production' ? 'https://kagevpn.com' : 'http://localhost:3000'),
  title: "Kage VPN Store - Premium VPN Accounts",
  description: "Your trusted source for premium VPN accounts. Fast, secure, and reliable access to global content with ExpressVPN, NordVPN, Surfshark and more.",
  keywords: ["VPN", "ExpressVPN", "NordVPN", "Surfshark", "Premium VPN", "VPN Store", "Secure Internet"],
  authors: [{ name: "Kage VPN Store" }],
  creator: "Kage VPN Store",
  publisher: "Kage VPN Store",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://kagevpn.com",
    siteName: "Kage VPN Store",
    title: "Kage VPN Store - Premium VPN Accounts",
    description: "Your trusted source for premium VPN accounts. Fast, secure, and reliable access to global content.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Kage VPN Store",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kage VPN Store - Premium VPN Accounts",
    description: "Your trusted source for premium VPN accounts. Fast, secure, and reliable access to global content.",
    images: ["/og-image.jpg"],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#00FFF5',
};
            