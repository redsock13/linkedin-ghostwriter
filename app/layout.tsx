import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GhostIn — Votre présence LinkedIn, sans effort",
  description: "8 posts LinkedIn par mois rédigés dans votre style. 199€/mois. Résiliable à tout moment.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
