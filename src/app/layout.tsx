import type { Metadata } from "next";
import { JetBrains_Mono, Nunito } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";
import { site } from "@/config";

const nunito = Nunito({ variable: "--font-nunito", subsets: ["latin", "cyrillic"] });
const jetbrains = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: site.name, template: `%s · ${site.name}` },
  description: site.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="uz" className={`${nunito.variable} ${jetbrains.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
