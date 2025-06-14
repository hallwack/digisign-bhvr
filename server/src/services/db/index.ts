import { type PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { serverEnvs } from "shared/dist";

import * as schema from "@server/services/db/schema";

declare global {
  var globalDb: PostgresJsDatabase<typeof schema> | undefined;
}

let db: PostgresJsDatabase<typeof schema>;

if (serverEnvs.NODE_ENV === "production") {
  db = drizzle(postgres(serverEnvs.DATABASE_URL, { prepare: true }), {
    schema,
  });
} else {
  if (!global.globalDb)
    global.globalDb = drizzle(
      postgres(serverEnvs.DATABASE_URL, { prepare: true }),
      {
        schema,
      },
    );

  db = global.globalDb;
}

export { db };
