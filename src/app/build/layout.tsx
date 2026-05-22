import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PC Build",
  description: "Configure your PC from the PC Parts API catalog.",
};

export default function BuildLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}