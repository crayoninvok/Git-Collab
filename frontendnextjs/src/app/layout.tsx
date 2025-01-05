import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Footer from "@/components/Footer";
import { ToastContainer } from "react-toastify";
import { Comfortaa } from "next/font/google";
import NavbarWrapper from "@/components/NavbarWrapper";
import { SessionProvider } from "@/context/sessionProvider";
import "react-toastify/dist/ReactToastify.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const comfortaa = Comfortaa({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TIKO",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${comfortaa.className} antialiased`}
      >
        <SessionProvider>
          <div className="min-h-screen flex flex-col">
            <NavbarWrapper />
            <main className="flex-1">{children}</main>
            <ToastContainer />
            <Footer />
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}