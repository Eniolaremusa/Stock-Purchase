import { Inter } from "next/font/google";
import localFont from "next/font/local";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const lastik = localFont({
  src: "../fonts/Lastik-Regular.ttf",
  variable: "--font-lastik",
  weight: "400",
  display: "swap",
});
