import { type Client, createClient } from "@libsql/client";

let client: Client | undefined;
let ready: Promise<unknown> | undefined;

function getClient(): Client {
  if (client) {
    return client;
  }

  const url = import.meta.env.TURSO_DATABASE_URL;
  if (!url) {
    throw new Error("TURSO_DATABASE_URL must be set to count image views");
  }

  client = createClient({
    url,
    authToken: import.meta.env.TURSO_AUTH_TOKEN,
  });
  return client;
}

/** Increments and returns the view count for an image slug. */
export async function incrementImageViews(
  slug: string,
): Promise<{ slug: string; count: number }> {
  const db = getClient();
  ready ??= db.execute(
    "CREATE TABLE IF NOT EXISTS ImageViews (slug TEXT PRIMARY KEY, count INTEGER NOT NULL DEFAULT 1)",
  );
  await ready;

  const result = await db.execute({
    sql: `INSERT INTO ImageViews (slug, count) VALUES (?, 1)
          ON CONFLICT(slug) DO UPDATE SET count = count + 1
          RETURNING slug, count`,
    args: [slug],
  });
  const row = result.rows[0];
  return { slug: String(row.slug), count: Number(row.count) };
}
