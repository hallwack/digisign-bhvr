import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const clientEnvs = createEnv({
  clientPrefix: "VITE_",
  client: {
    VITE_PUBLIC_DOMAIN: z.string().default("http://localhost:5173"),
    VITE_SERVER_URL: z.string().default("http://localhost:3000"),
  },
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
});

export type ClientEnvs = typeof clientEnvs;
