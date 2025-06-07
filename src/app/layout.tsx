'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import Navbar from "./components/layout/Navbar";
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import Chats from "./components/chat/Chats";
import BootstrapClient from '@/app/components/layout/BootstrapClient';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-100`}>
        <Provider store={store}>
          <BootstrapClient />
          <Navbar />
          <Chats/>
          {children}
        </Provider>
      </body>
    </html>
  );
}