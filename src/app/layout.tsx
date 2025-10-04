"use client";

import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
          {children}
        </body>
      </QueryClientProvider>
    </html>
  );
}
