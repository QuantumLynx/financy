import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk, Orbitron } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { ToastProvider } from "@/lib/hooks/useToast";
import { ToastContainer } from "@/components/ui/Toast";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600", "700"]
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"]
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  weight: ["400", "500", "600", "700", "800", "900"]
});

export const metadata: Metadata = {
  title: "Financy - Financial Dashboard",
  description: "Advanced financial analysis dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jetbrainsMono.variable} ${spaceGrotesk.variable} ${orbitron.variable} font-mono antialiased`}>
        <ToastProvider>
          <div className="flex min-h-screen bg-slate-950 relative z-10">
            <Sidebar />
            <div className="flex-1 flex flex-col">
              <Header />
              <main className="flex-1 p-2.5 overflow-y-auto">
                {children}
              </main>
            </div>
          </div>
          <ToastContainer />
        </ToastProvider>
      </body>
    </html>
  );
}
