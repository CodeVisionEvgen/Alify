import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { Open_Sans } from 'next/font/google'
import { Providers } from "./providers";
import { MusicProvider } from "@/context/musicContext";
import { ModalProvider } from "@/context/modalContext";


// If loading a variable font, you don't need to specify the font weight

export const metadata: Metadata = {
  title: "Alify",
  description: "A simple music app",
  icons: {
    icon: "/favicon.ico",
  },
};

const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
})

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en" className={openSans.className}>
      <head />
      <body className={"min-h-screen overflow-hidden bg-background antialiased"}>
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <div className="relative flex flex-col h-screen">
            <main className={"container mx-auto max-w-7xl pt-16 px-6 flex-grow"}>
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html >
  );
}
