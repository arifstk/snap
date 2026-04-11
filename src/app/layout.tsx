import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Provider from "@/provider";
import StoreProvider from "@/redux/StoreProvider";
import InitUser from "@/InitUser";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Snap",
  description: "Ten minutes grocery delivery app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="max-w-7xl mx-auto w-full min-h-screen bg-linear-to-b from-green-50 to-white ">
        <Provider>
          <StoreProvider> {/*redux Provider wrapper */}
            <InitUser/>  
            {children}
          </StoreProvider>
        </Provider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}

