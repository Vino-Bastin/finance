import { Hono } from "hono";

import { db } from "../../../db/drizzle";
import { accounts } from "../../../db/schema";

const accountsRouter = new Hono().get("/", async (c) => {
  const accountsData = await db
    .select({
      id: accounts.id,
      name: accounts.name,
    })
    .from(accounts);
  return c.json({ ok: true, accounts: accountsData });
});

export default accountsRouter;
