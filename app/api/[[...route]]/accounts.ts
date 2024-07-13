import { Hono } from "hono";
import { z } from "zod";
import { HTTPException } from "hono/http-exception";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { and, eq, inArray } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";

import { db } from "../../../db/drizzle";
import { accounts, insertAccountSchema } from "../../../db/schema";

const accountsRouter = new Hono()
  .get("/", clerkMiddleware(), async (c) => {
    const auth = getAuth(c);
    if (!auth?.userId) {
      throw new HTTPException(401, {
        res: c.json({
          ok: false,
          error: "Unauthorized",
        }),
      });
    }
    const accountsData = await db
      .select({
        id: accounts.id,
        name: accounts.name,
      })
      .from(accounts)
      .where(eq(accounts.userId, auth.userId));
    return c.json({ ok: true, accounts: accountsData });
  })
  .post(
    "/",
    clerkMiddleware(),
    zValidator(
      "json",
      insertAccountSchema.pick({
        name: true,
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      if (!auth?.userId) {
        throw new HTTPException(401, {
          res: c.json({
            ok: false,
            error: "Unauthorized",
          }),
        });
      }
      const { name } = c.req.valid("json");
      const [newAccount] = await db
        .insert(accounts)
        .values({
          name,
          userId: auth.userId,
          id: createId(),
        })
        .returning({
          name: accounts.name,
          id: accounts.id,
        });
      return c.json({ ok: true, account: newAccount });
    }
  )
  .post(
    "/bulk-delete",
    clerkMiddleware(),
    zValidator(
      "json",
      z.object({
        ids: z.array(z.string()),
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      if (!auth?.userId) {
        throw new HTTPException(401, {
          res: c.json({
            ok: false,
            error: "Unauthorized",
          }),
        });
      }
      const { ids } = c.req.valid("json");
      await db
        .delete(accounts)
        .where(
          and(eq(accounts.userId, auth.userId), inArray(accounts.id, ids))
        );
      return c.json({ ok: true });
    }
  );

export default accountsRouter;
