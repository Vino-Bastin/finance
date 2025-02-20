import { Hono } from "hono";
import { z } from "zod";
import { HTTPException } from "hono/http-exception";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { and, eq, inArray } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";

import { db } from "@/db/drizzle";
import { accounts, insertAccountSchema } from "@/db/schema";

const accountsRouter = new Hono<{ Variables: { userId: string } }>()
  .use(clerkMiddleware())
  .use((c, next) => {
    const auth = getAuth(c);
    if (!auth?.userId) {
      throw new HTTPException(401, {
        res: c.json({
          ok: false,
          error: "Unauthorized",
        }),
      });
    }

    c.set("userId", auth.userId);
    return next();
  })
  .get("/", async (c) => {
    const userId = c.get("userId");
    const accountsData = await db
      .select({
        id: accounts.id,
        name: accounts.name,
      })
      .from(accounts)
      .where(eq(accounts.userId, userId));
    return c.json({ ok: true, accounts: accountsData });
  })
  .get(
    "/:id",
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      })
    ),
    async (c) => {
      const userId = c.get("userId");
      const { id } = c.req.valid("param");

      if (!id) {
        throw new HTTPException(400, {
          res: c.json({
            ok: false,
            error: "Account ID is required",
          }),
        });
      }

      const [account] = await db
        .select({
          id: accounts.id,
          name: accounts.name,
        })
        .from(accounts)
        .where(and(eq(accounts.userId, userId), eq(accounts.id, id)));

      if (!account) {
        throw new HTTPException(404, {
          res: c.json({
            ok: false,
            error: "Account not found",
          }),
        });
      }

      return c.json({ ok: true, account });
    }
  )
  .post(
    "/",
    zValidator(
      "json",
      insertAccountSchema.pick({
        name: true,
      })
    ),
    async (c) => {
      const userId = c.get("userId");
      const { name } = c.req.valid("json");
      const [newAccount] = await db
        .insert(accounts)
        .values({
          name,
          userId: userId,
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
    zValidator(
      "json",
      z.object({
        ids: z.array(z.string()),
      })
    ),
    async (c) => {
      const userId = c.get("userId");
      const { ids } = c.req.valid("json");
      await db
        .delete(accounts)
        .where(and(eq(accounts.userId, userId), inArray(accounts.id, ids)));
      return c.json({ ok: true });
    }
  )
  .patch(
    "/:id",
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      })
    ),
    zValidator(
      "json",
      insertAccountSchema.pick({
        name: true,
      })
    ),
    async (c) => {
      const userId = c.get("userId");
      const { id } = c.req.valid("param");
      const { name } = c.req.valid("json");

      if (!id) {
        throw new HTTPException(400, {
          res: c.json({
            ok: false,
            error: "Account ID is required",
          }),
        });
      }

      const [updatedAccount] = await db
        .update(accounts)
        .set({
          name,
        })
        .where(and(eq(accounts.userId, userId), eq(accounts.id, id)))
        .returning({
          id: accounts.id,
          name: accounts.name,
        });

      if (!updatedAccount) {
        throw new HTTPException(404, {
          res: c.json({
            ok: false,
            error: "Account not found",
          }),
        });
      }

      return c.json({ ok: true, account: updatedAccount });
    }
  )
  .delete(
    "/:id",
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      })
    ),
    async (c) => {
      const userId = c.get("userId");
      const { id } = c.req.valid("param");

      if (!id) {
        throw new HTTPException(400, {
          res: c.json({
            ok: false,
            error: "Account ID is required",
          }),
        });
      }

      await db
        .delete(accounts)
        .where(and(eq(accounts.userId, userId), eq(accounts.id, id)));

      return c.json({ ok: true });
    }
  );

export default accountsRouter;
