import type { Metadata } from "next";
import Header from "../layout/header";

export const metadata: Metadata = {
  title: "PC Build",
  description: "Configure your PC from mock parts data.",
};

export default function BuildLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
    </>
  );  
}
