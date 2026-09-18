import type { Metadata } from "next";
import { Barlow_Condensed, DM_Sans } from "next/font/google";
import { AppHeader } from "@/components/AppHeader";
import { SessionProvider } from "@/components/SessionProvider";
import { SiteFooter } from "@/components/SiteFooter";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm",
  subsets: ["latin"],
});

const barlow = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Skill cash matches with friends",
    template: "%s · Skill Match",
  },
  description:
    "US skill-contest prize matches. Team up, stake the match, winners take the pot. Simulated play-money wallet in v0.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${barlow.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SessionProvider>
          <AppHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </SessionProvider>
      </body>
    </html>
  );
}
