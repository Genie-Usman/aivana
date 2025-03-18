import { IBM_Plex_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const IBMPlex = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Aivana",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={cn("antialiased", IBMPlex.variable, geistMono.variable)}>
        {children}
      </body>
    </html>
  );
}
