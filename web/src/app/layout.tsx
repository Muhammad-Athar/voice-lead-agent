import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ava — Voice AI Lead Qualification | Northstar Digital (demo)",
  description:
    "An AI voice agent that answers inbound calls, qualifies the lead, books a discovery call on a real calendar and pushes a scored lead to HubSpot, Sheets, Slack and email. Built with Vapi, Gemini and self-hosted n8n.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0b0b0f] text-white">{children}</body>
    </html>
  );
}
