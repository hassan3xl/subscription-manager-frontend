import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Navbar } from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import ModalProvider from "@/providers/ModalProvider";
import { ToastProvider } from "@/providers/ToastProvider";

export const metadata: Metadata = {
  title: "Subscription Manager",
  description: "Subscription Manager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {/* Global modals can use auth state if needed */}
            <ToastProvider>
              <ModalProvider>
                <Navbar />
                <main className="my-20 px-4 sm:px-6 transition-colors duration-300">
                  {children}
                </main>
                <Footer />
              </ModalProvider>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
