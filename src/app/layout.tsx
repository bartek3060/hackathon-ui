"use client";

import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PageTransitionWrapper } from "@/components/PageTransitionWrapper";

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
          <PageTransitionWrapper>
            {children}
          </PageTransitionWrapper>
        </body>
      </QueryClientProvider>
    </html>
  );
}
