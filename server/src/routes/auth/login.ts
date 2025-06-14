import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { eq } from "drizzle-orm";
import { setCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import { loginSchema } from "shared/dist";

import { lucia } from "@server/services/auth";
import { userTable } from "@server/services/db/schema";
import { type ContextVariables } from "@server/types";
import { verifyHash } from "@server/utils";

export const login = new OpenAPIHono<{
  Variables: ContextVariables;
}>().openapi(
  createRoute({
    method: "post",
    path: "/api/auth/login",
    tags: ["Auth"],
    summary: "Login",
    request: {
      body: {
        description: "The user's login information.",
        content: {
          "application/json": {
            schema: loginSchema.openapi("Login"),
          },
        },
        required: true,
      },
    },
    responses: {
      200: {
        description: "The user has been logged in.",
      },
    },
  }),
  async (c) => {
    const { email, password } = c.req.valid("json");
    const db = c.get("db");

    const existingUser = await db.query.userTable.findFirst({
      where: eq(userTable.email, email),
    });

    if (!existingUser) {
      throw new HTTPException(400, {
        message: "Authentication Failed",
      });
    }

    const validPassword = await verifyHash(existingUser.password, password);
    if (!validPassword) {
      throw new HTTPException(400, {
        message: "Authentication Failed",
      });
    }

    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    c.header("Set-Cookie", sessionCookie.serialize(), { append: true });
    c.header("Location", "/", { append: true });
    /* setCookie(c, sessionCookie.name, sessionCookie.value, {
      ...sessionCookie.attributes,
      sameSite: "Strict",
    }); */

    return c.body(null);
  },
);
