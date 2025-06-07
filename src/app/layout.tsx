'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import Navbar from "./components/Navbar";
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import Chats from "./components/Chats";

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
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-100 d-flex flex-column `}>
        <Provider store={store}>
          <Navbar />
          <Chats/>
          {children}
        </Provider>
      </body>
    </html>
  );
}