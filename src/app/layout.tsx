"use client";

import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PensionFactNotification } from "@/components/PensionFactNotification";

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
          <PensionFactNotification />
        </body>
      </QueryClientProvider>
    </html>
  );
}
