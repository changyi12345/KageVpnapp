import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";
import ClientRoot from "./client-root";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
// layout.tsx (RootLayout function only)
export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={fontSans.variable}>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200..800&display=swap" rel="stylesheet" />
            </head>
            <body className="min-h-screen bg-background font-sans antialiased" suppressHydrationWarning>
                <ClientRoot>{children}</ClientRoot>
            </body>
        </html>
    )
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
