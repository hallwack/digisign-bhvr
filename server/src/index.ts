import { OpenAPIHono } from "@hono/zod-openapi";
import { getCookie, setCookie } from "hono/cookie";
import { cors } from "hono/cors";
import { requestId } from "hono/request-id";

import { authApp } from "@server/routes/auth";
import { testApp } from "@server/routes/test";
import { lucia } from "@server/services/auth";
import { db } from "@server/services/db";
import type { ContextVariables } from "@server/types";

export const app = new OpenAPIHono<{ Variables: ContextVariables }>();

app.use(cors());
app.use(requestId());
app.notFound((c) => {
  return c.json({ message: `NOT-FOUND - ${c.req.path}` }, 404);
});

app.use(async (c, next) => {
  c.set("db", db);

  const sessionId = getCookie(c, lucia.sessionCookieName);

  if (!sessionId) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }

  const { session, user } = await lucia.validateSession(sessionId);

  if (session && session.fresh) {
    const sessionCookie = lucia.createSessionCookie(session.id);
    setCookie(c, lucia.sessionCookieName, sessionCookie.serialize(), {
      ...sessionCookie.attributes,
      sameSite: "Strict",
    });
  }

  if (!session) {
    const sessionCookie = lucia.createBlankSessionCookie();
    setCookie(c, lucia.sessionCookieName, sessionCookie.serialize(), {
      ...sessionCookie.attributes,
      sameSite: "Strict",
    });
  }

  c.set("user", user);
  c.set("session", session);

  return next();
});

app.doc31("/api/swagger.json", {
  openapi: "3.1.0",
  info: {
    title: "Digsig Thesis API",
    version: "1.0.0",
  },
});

const routes = app.route("/", testApp).route("/", authApp);
/* .route("/", documentsApp)
  .route("/", keysApp); */

export type AppServer = typeof routes;

export default app;
