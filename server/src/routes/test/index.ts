import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import type { ApiResponse } from "shared/dist";

import type { ContextVariables } from "@server/types";

export const testApp = new OpenAPIHono<{
  Variables: ContextVariables;
}>().openapi(
  createRoute({
    method: "get",
    path: "/api/hello",
    tags: ["Test"],
    summary: "Test",
    responses: {
      200: {
        description: "Returns a greeting message.",
      },
    },
  }),
  async (c) => {
    const data: ApiResponse = {
      message: "Hello BHVR!",
      success: true,
    };

    return c.json(data, { status: 200 });
  },
);
