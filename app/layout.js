import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

export const metadata = {
  title: "Guia de Bolso",
  description: "Explore Imbituba — natureza, gastronomia e noite",
};

/**
 * Root HTML layout with global fonts and metadata for the app.
 * @param {{ children: import("react").ReactNode }} props - Layout children.
 * @returns {import("react").ReactElement}
 */
export default function RootLayout({ children }) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${plusJakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
