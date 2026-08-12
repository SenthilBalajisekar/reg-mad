import type { Metadata } from "next";
import "./globals.css";

const inter = { variable: "--font-inter" };
const orbitron = { variable: "--font-orbitron" };

export const metadata: Metadata = {
  title: "MOBILE APP CLUB | HACKATHON 2026",
  description: "Join the ultimate technology hackathon challenge - Build the Unexpected. Innovate, collaborate, and compete for a ₹50,000 prize pool.",
  keywords: ["hackathon", "mobile app club", "coding", "programming", "college hackathon", "AI & ML", "web design"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${orbitron.variable} scroll-smooth`}>
      <body className="bg-white text-slate-900 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
