import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Buscador de Cumbre",
  description: "Encuentra miles de vacantes de empleo de diversas fuentes en Cumbre",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        {/* <script src="https://alwingulla.com/88/tag.min.js" data-zone="117033" async data-cfasync="false"></script> */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1449384971274211" crossorigin="anonymous"></script>

        {/* Google tag (gtag.js) */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-2T3P3L9NZX"
        ></script>

        {/* Incluir script inline */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-2T3P3L9NZX');
            `,
          }}
        ></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
