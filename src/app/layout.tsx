import type { Metadata, Viewport } from "next";
import { Cairo, Manrope } from "next/font/google";
import { content } from "@/lib/content";
import { LangProvider } from "@/lib/lang";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-cairo",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ramsesservice.com"),
  title: content.ar.meta.title,
  description: content.ar.meta.description,
  openGraph: {
    title: content.ar.meta.title,
    description: content.ar.meta.description,
    images: ["/og.jpg"],
    type: "website",
  },
  icons: { icon: "/ramses-logo.png" },
};

export const viewport: Viewport = {
  themeColor: "#2A060B",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // Arabic + RTL is the default; LangProvider swaps these on the client.
    <html lang="ar" dir="rtl" data-lang="ar" className={`${cairo.variable} ${manrope.variable}`}>
      <head>
        {/* Every reload is a fresh visit: kill the browser's scroll restoration
            and sit at the top before anything paints, so the loader never opens
            over a scrolled page and the hero always starts at frame 1. Runs
            before hydration; the late re-assert catches engines that restore
            after the load event. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              'try{history.scrollRestoration="manual"}catch(e){}' +
              "window.scrollTo(0,0);" +
              'addEventListener("load",function(){window.scrollTo(0,0)},{once:true});',
          }}
        />
      </head>
      <body data-locked="true">
        {/* Without JS the loader never clears the scroll lock — release it. */}
        <noscript>
          <style>{`body[data-locked="true"]{overflow:auto!important}`}</style>
        </noscript>
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
