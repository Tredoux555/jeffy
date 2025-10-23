import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { AuthProvider } from "@/lib/auth";
import { FavoritesProvider } from "@/lib/favorites";
import { Header } from "@/components/header";
import { BackButton } from "@/components/back-button";
import { NotificationPermission } from "@/components/notification-permission";
import { BackgroundSync } from "@/components/background-sync";
import { PushNotificationService } from "@/components/push-notification-service";
import { OfflineIndicator } from "@/components/offline-indicator";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jeffy - In a Jiffy",
  description: "Discover amazing products with videos, pictures, and reviews. Bright, friendly, and ready to deliver happiness to your doorstep.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/icon-192x192.png",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#fbbf24",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <html lang="en">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <AuthProvider>
              <CartProvider>
                <FavoritesProvider>
                  <OfflineIndicator />
                  <Header />
                  {children}
                  <BackButton />
                  <NotificationPermission />
                  <BackgroundSync />
                  <PushNotificationService />
                </FavoritesProvider>
              </CartProvider>
            </AuthProvider>
          </body>
        </html>
  );
}
