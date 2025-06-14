import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@/index.css";
import RootProviders from "@/providers";
import Root from "@/root";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RootProviders>
      <Root />
    </RootProviders>
  </StrictMode>,
);
