import "./globals.css";
import Script from "next/script";

export const metadata = {
  title: "Bayswater - Elite Managed IT & Cybersecurity Architecture",
  description: "Sovereign Australian managed infrastructure and defense-grade cybersecurity for enterprises that demand uncompromising uptime.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark overflow-x-hidden" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link crossOrigin="anonymous" href="https://fonts.gstatic.com" rel="preconnect" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;500;700&family=Syne:wght@400;700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased overflow-x-hidden selection:bg-primary/30" suppressHydrationWarning>
        {children}
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js" strategy="beforeInteractive" />
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js" strategy="beforeInteractive" />
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js" strategy="beforeInteractive" />
        <Script src="https://unpkg.com/@studio-freight/lenis@1.0.33/dist/lenis.min.js" strategy="beforeInteractive" />
      </body>
    </html>
  );
}
