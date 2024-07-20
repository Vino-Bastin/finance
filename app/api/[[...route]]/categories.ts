import { Hono } from "hono";
import { z } from "zod";
import { HTTPException } from "hono/http-exception";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { and, eq, inArray } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";

import { db } from "@/db/drizzle";
import { categories, insertCategorySchema } from "@/db/schema";

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
    const categoriesData = await db
      .select({
        id: categories.id,
        name: categories.name,
      })
      .from(categories)
      .where(eq(categories.userId, userId));
    return c.json({ ok: true, categories: categoriesData });
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

      const [category] = await db
        .select({
          id: categories.id,
          name: categories.name,
        })
        .from(categories)
        .where(and(eq(categories.userId, userId), eq(categories.id, id)));

      if (!category) {
        throw new HTTPException(404, {
          res: c.json({
            ok: false,
            error: "Account not found",
          }),
        });
      }

      return c.json({ ok: true, category });
    }
  )
  .post(
    "/",
    zValidator(
      "json",
      insertCategorySchema.pick({
        name: true,
      })
    ),
    async (c) => {
      const userId = c.get("userId");
      const { name } = c.req.valid("json");
      const [newCategory] = await db
        .insert(categories)
        .values({
          name,
          userId: userId,
          id: createId(),
        })
        .returning({
          name: categories.name,
          id: categories.id,
        });
      return c.json({ ok: true, category: newCategory });
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
        .delete(categories)
        .where(and(eq(categories.userId, userId), inArray(categories.id, ids)));
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
      insertCategorySchema.pick({
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

      const [updatedCategory] = await db
        .update(categories)
        .set({
          name,
        })
        .where(and(eq(categories.userId, userId), eq(categories.id, id)))
        .returning({
          id: categories.id,
          name: categories.name,
        });

      if (!updatedCategory) {
        throw new HTTPException(404, {
          res: c.json({
            ok: false,
            error: "Account not found",
          }),
        });
      }

      return c.json({ ok: true, category: updatedCategory });
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
        .delete(categories)
        .where(and(eq(categories.userId, userId), eq(categories.id, id)));

      return c.json({ ok: true });
    }
  );

export default accountsRouter;
