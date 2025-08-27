"use client";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

let client: QueryClient | null = null;

function getQueryClient() {
  if (!client) {
    client = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60_000,
          gcTime: 5 * 60_000,
          retry: 2,
          refetchOnWindowFocus: false,
        },
      },
    });
  }
  return client;
}

export default function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={getQueryClient()}>{children}</QueryClientProvider>;
}
