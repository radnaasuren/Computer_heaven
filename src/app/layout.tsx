import "./globals.css";
import { Providers } from "./providers";
import Header from "./layout/header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F6F8FB] text-[#4A5468]">
        <Providers>
          <Header />

          <main className="px-6 md:px-12 py-10">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}