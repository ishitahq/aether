import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Map - Aether",
  description: "Explore thermal imagery across different locations worldwide.",
};

export default function MapPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
