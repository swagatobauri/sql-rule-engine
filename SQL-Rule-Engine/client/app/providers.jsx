"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthBootstrap from "@/components/auth/AuthBootstrap";

// App-wide client providers. react-query needs a QueryClient available via
// context for useMutation/useQuery to work. Created once per browser session
// with useState so it survives re-renders but isn't shared across requests.
export default function Providers({ children }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthBootstrap />
      {children}
    </QueryClientProvider>
  );
}
