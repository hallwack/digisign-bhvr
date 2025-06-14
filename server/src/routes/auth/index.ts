import { OpenAPIHono } from "@hono/zod-openapi";

import { login } from "@server/routes/auth/login";
import { logout } from "@server/routes/auth/logout";
import { register } from "@server/routes/auth/register";
import { type ContextVariables } from "@server/types";

export const authApp = new OpenAPIHono<{ Variables: ContextVariables }>()
  .route("/", login)
  .route("/", register)
  .route("/", logout);
