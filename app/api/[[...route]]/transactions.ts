import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { zValidator } from "@hono/zod-validator";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { z } from "zod";
import { parse, subDays } from "date-fns";
import { and, desc, eq, gte, inArray, lte, sql } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

import { db } from "@/db/drizzle";
import {
  categories,
  transactions,
  insertTransactionSchema,
  accounts,
} from "@/db/schema";

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
  .get(
    "/",
    zValidator(
      "query",
      z.object({
        from: z.string().optional(),
        to: z.string().optional(),
        accountId: z.string().optional(),
      })
    ),
    async (c) => {
      const userId = c.get("userId");
      const { accountId, from, to } = c.req.valid("query");

      const defaultTo = new Date();
      const defaultFrom = subDays(defaultTo, 30);
      const startDate = from
        ? parse(from, "yyyy-MM-dd", new Date())
        : defaultFrom;
      const endDate = to ? parse(to, "yyyy-MM-dd", new Date()) : defaultTo;

      const tractionsData = await db
        .select({
          id: transactions.id,
          date: transactions.date,
          amount: transactions.amount,
          payee: transactions.payee,
          notes: transactions.notes,
          account: accounts.name,
          accountId: transactions.accountId,
          category: categories.name,
          categoryId: transactions.categoryId,
        })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .leftJoin(categories, eq(transactions.categoryId, categories.id))
        .where(
          and(
            accountId ? eq(transactions.accountId, accountId) : undefined,
            eq(accounts.userId, userId),
            gte(transactions.date, startDate),
            lte(transactions.date, endDate)
          )
        )
        .orderBy(desc(transactions.date));
      return c.json({ ok: true, transactions: tractionsData });
    }
  )
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
            error: "Transaction ID is required",
          }),
        });
      }

      const [transaction] = await db
        .select({
          id: transactions.id,
          date: transactions.date,
          amount: transactions.amount,
          payee: transactions.payee,
          notes: transactions.notes,
          accountId: transactions.accountId,
          categoryId: transactions.categoryId,
        })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .where(and(eq(transactions.id, id), eq(accounts.userId, userId)));

      if (!transaction) {
        throw new HTTPException(404, {
          res: c.json({
            ok: false,
            error: "transaction not found",
          }),
        });
      }

      return c.json({ ok: true, transaction });
    }
  )
  .post(
    "/",
    zValidator(
      "json",
      insertTransactionSchema.omit({
        id: true,
      })
    ),
    async (c) => {
      const values = c.req.valid("json");

      const [newTransaction] = await db
        .insert(transactions)
        .values({
          id: createId(),
          ...values,
        })
        .returning();
      return c.json({ ok: true, transaction: newTransaction });
    }
  )
  .post(
    "/bulk-create",
    zValidator(
      "json",
      z.array(
        insertTransactionSchema.omit({
          id: true,
        })
      )
    ),
    async (c) => {
      const values = c.req.valid("json");

      await db.insert(transactions).values(
        values.map((value) => ({
          id: createId(),
          ...value,
        }))
      );

      return c.json({ ok: true });
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

      const transactionsToDelete = db.$with("transactions_to_delete").as(
        db
          .select({ id: transactions.id })
          .from(transactions)
          .innerJoin(accounts, eq(transactions.accountId, accounts.id))
          .where(
            and(inArray(transactions.id, ids), eq(accounts.userId, userId))
          )
      );

      const tractionsData = await db
        .with(transactionsToDelete)
        .delete(transactions)
        .where(
          inArray(categories.id, sql`(select id from ${transactionsToDelete})`)
        )
        .returning({
          id: transactions.id,
        });

      return c.json({ ok: true, transactions: tractionsData });
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
      insertTransactionSchema.omit({
        id: true,
      })
    ),
    async (c) => {
      const userId = c.get("userId");
      const { id } = c.req.valid("param");
      const values = c.req.valid("json");

      if (!id) {
        throw new HTTPException(400, {
          res: c.json({
            ok: false,
            error: "Transaction ID is required",
          }),
        });
      }

      const transactionsToUpdate = db.$with("transactions_to_update").as(
        db
          .select({ id: transactions.id })
          .from(transactions)
          .innerJoin(accounts, eq(transactions.accountId, accounts.id))
          .where(and(eq(transactions.id, id), eq(accounts.userId, userId)))
      );

      const [updatedTransaction] = await db
        .with(transactionsToUpdate)
        .update(transactions)
        .set(values)
        .where(
          inArray(
            transactions.id,
            sql`(select id from ${transactionsToUpdate})`
          )
        )
        .returning();

      if (!updatedTransaction) {
        throw new HTTPException(404, {
          res: c.json({
            ok: false,
            error: "Transaction not found",
          }),
        });
      }

      return c.json({ ok: true, category: updatedTransaction });
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
            error: "Transaction ID is required",
          }),
        });
      }

      const transactionsToDelete = db.$with("transactions_to_delete").as(
        db
          .select({ id: transactions.id })
          .from(transactions)
          .innerJoin(accounts, eq(transactions.accountId, accounts.id))
          .where(and(eq(transactions.id, id), eq(accounts.userId, userId)))
      );

      await db
        .with(transactionsToDelete)
        .delete(transactions)
        .where(
          inArray(
            transactions.id,
            sql`(select id from ${transactionsToDelete})`
          )
        );

      return c.json({ ok: true });
    }
  );

export default accountsRouter;
