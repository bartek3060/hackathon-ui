"use client";

import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { PageTransitionWrapper } from "@/components/PageTransitionWrapper";
import { ZofiaChatButton } from "@/components/ZofiaChatButton";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();

  return (
    <html lang="pl">
      <QueryClientProvider client={queryClient}>
        <body>
          <PageTransitionWrapper>{children}</PageTransitionWrapper>
          <Toaster position="top-right" richColors />
          <ZofiaChatButton />
        </body>
      </QueryClientProvider>
    </html>
  );
}
