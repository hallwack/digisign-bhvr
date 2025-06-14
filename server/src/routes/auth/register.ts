import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import { generateId } from "lucia";
import { registerSchema } from "shared/dist";

import { userTable } from "@server/services/db/schema";
import { type ContextVariables } from "@server/types";
import { generateHash } from "@server/utils";

export const register = new OpenAPIHono<{
  Variables: ContextVariables;
}>().openapi(
  createRoute({
    method: "post",
    path: "/api/auth/register",
    tags: ["Auth"],
    summary: "Register",
    request: {
      body: {
        description: "The user's register information.",
        content: {
          "application/json": {
            schema: registerSchema.openapi("Register"),
          },
        },
        required: true,
      },
    },
    responses: {
      200: {
        description: "The user has been registered.",
      },
    },
  }),
  async (c) => {
    const { fullName, email, password } = c.req.valid("json");
    const db = c.get("db");

    const existingUser = await db.query.userTable.findFirst({
      where: eq(userTable.email, email),
    });

    if (existingUser) {
      return c.body(null);
    }

    const validPassword = await generateHash(password);

    const user = await db.insert(userTable).values({
      id: generateId(15),
      name: fullName,
      email,
      password: validPassword,
    });

    if (!user) {
      throw new HTTPException(400, {
        message: "Authentication Failed",
      });
    }

    return c.body(null);
  },
);
