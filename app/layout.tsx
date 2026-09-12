import type { Metadata } from "next";
import { Providers } from "@/context/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "SmartShopping Admin",
  description: "SmartShopping commerce administration dashboard.",
};

// Applies the persisted theme before first paint so there's no flash of the
// wrong theme. This mutates <html> ahead of React hydration, which is why
// suppressHydrationWarning is set below (scoped to just that element).
const themeInitScript = `
(function () {
  try {
    var stored = window.localStorage.getItem("rl.theme");
    var dark = stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (dark) document.documentElement.classList.add("dark");
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
