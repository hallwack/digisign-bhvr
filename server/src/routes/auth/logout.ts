import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { getCookie, setCookie } from "hono/cookie";

import { lucia } from "@server/services/auth";
import { type ContextVariables } from "@server/types";

export const logout = new OpenAPIHono<{
  Variables: ContextVariables;
}>().openapi(
  createRoute({
    method: "post",
    path: "/api/auth/logout",
    tags: ["Auth"],
    summary: "Logout",
    responses: {
      200: {
        description: "The user has been logged out.",
      },
    },
  }),
  async (c) => {
    const session = c.get("session");
    /* const sessionId = getCookie(c, lucia.sessionCookieName); */

    if (!session) {
      return c.redirect("/");
    }

    await lucia.invalidateSession(session.id);
    c.header("Set-Cookie", lucia.createBlankSessionCookie().serialize());
    /* setCookie(c, lucia.sessionCookieName, "", {
      expires: new Date(0),
      sameSite: "Strict",
    }); */

    return c.redirect("/");
  },
);
