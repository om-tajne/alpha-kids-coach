import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Alpha Kids · Zara AI Parenting Coach",
  description:
    "Get friendly, safe parenting guidance in English & Urdu. AI coach with human coaches in the loop — for parents in India, Pakistan, and the Gulf.",
  keywords: ["parenting", "AI coach", "kids", "urdu", "english", "alpha kids", "pakistan", "india", "gulf"],
  openGraph: {
    title: "Alpha Kids · Zara Parenting Coach",
    description: "Smart, safe parenting support — in English & Urdu",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={nunito.variable}>
      <body className={`font-sans antialiased ${nunito.className}`}>
        {children}
      </body>
    </html>
  );
}
