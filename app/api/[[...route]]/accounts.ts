import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { eq } from "drizzle-orm";

import { db } from "../../../db/drizzle";
import { accounts } from "../../../db/schema";

const accountsRouter = new Hono().get("/", clerkMiddleware(), async (c) => {
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
});

export default accountsRouter;
