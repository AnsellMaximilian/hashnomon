import "./globals.css";
import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";

const monts = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hashnomon",
  description: "Make Hashnode devs battle",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={monts.className}>{children}</body>
    </html>
  );
}
