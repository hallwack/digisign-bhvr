import type { Session, User } from "lucia";

import { db } from "@server/services/db";

export type ContextVariables = {
  db: typeof db;
  user: User | null;
  session: Session | null;
};
