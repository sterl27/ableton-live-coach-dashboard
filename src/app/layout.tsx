import type { Metadata } from "next";
import "../index.css";
import "../App.css";

export const metadata: Metadata = {
  title: "Ableton Live Coach Dashboard",
  description: "AI-native Ableton Live 12 coaching dashboard.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
