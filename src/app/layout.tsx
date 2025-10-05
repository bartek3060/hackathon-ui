"use client";

import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { ZofiaChatButton } from "@/components/ZofiaChatButton";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();
  const pathname = usePathname();
  const isGameRoute = pathname?.startsWith("/game");

  return (
    <html lang="pl">
      <QueryClientProvider client={queryClient}>
        <body>
          {children}
          <Toaster position="top-right" richColors />
          {!isGameRoute && <ZofiaChatButton />}
        </body>
      </QueryClientProvider>
    </html>
  );
}
