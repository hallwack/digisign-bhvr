import { hcWithType } from "server/src/client";

import { clientEnvs } from "@/lib/env";

const SERVER_URL = clientEnvs.VITE_SERVER_URL || "http://localhost:6969";

const honoClient = hcWithType(SERVER_URL);

export default honoClient;
