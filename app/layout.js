import { IBM_Plex_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ClerkProvider, SignInButton, SignUpButton, SignedIn, SignedOut, UserButton, } from '@clerk/nextjs'

const IBMPlex = IBM_Plex_Sans({
  variable: "--font-ibm-plex",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata = {
  title: "Aivana",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider appearance={{ variables: { colorPrimary: "#624cf5" } }}>
      <html lang="en">
        <body className={cn("antialiased border ", IBMPlex.variable)}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
