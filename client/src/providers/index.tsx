import { NuqsAdapter } from "nuqs/adapters/react";
import { BrowserRouter } from "react-router";
import { Toaster } from "sonner";

import ReactQueryClientProvider from "@/providers/query-provider";

export default function RootProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BrowserRouter>
      <ReactQueryClientProvider>
        <NuqsAdapter>{children}</NuqsAdapter>
        <Toaster />
      </ReactQueryClientProvider>
    </BrowserRouter>
  );
}
