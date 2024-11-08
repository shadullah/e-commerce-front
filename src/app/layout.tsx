import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Sidebard } from "@/components/Shared//Sidebard";
import { ReduxProvider } from "@/store/provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lazz Pharma",
  description: "A pharmacautical site",
};

export default function RootLayout({
  children,
}: // params,
Readonly<{
  children: React.ReactNode;
  // params: { pathname: string };
}>) {
  // const isDashboard = params.pathname.startsWith("/dashboard");
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <ReduxProvider>
          <div>
            <Toaster />
          </div>
          <Sidebard>{children}</Sidebard>
        </ReduxProvider>
      </body>
    </html>
  );
}
