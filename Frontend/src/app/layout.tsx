import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import Navbar from "@/components/Navbar";
import { headers } from "next/headers";
import AppKitProvider from "@/lib/context/AppKitProvider";

export const sfPro = localFont({
  src: [
    {
      path: "./fonts/SF-Pro-Rounded-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/SF-Pro-Rounded-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/SF-Pro-Rounded-Semibold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/SF-Pro-Rounded-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/SF-Pro-Rounded-Black.otf",
      weight: "800",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  title: "LaunchBox",
  description: "Your toolkit to Solana",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookies = headers().get("cookie");
  return (
    <html lang="en">
      <body className={`${sfPro.className} antialiased`}>
        <AppKitProvider cookies={cookies}>
          <ThemeProvider
            attribute="class"
            forcedTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <Navbar />
            {children}
          </ThemeProvider>
        </AppKitProvider>
      </body>
    </html>
  );
}
