import type { APIRoute } from "astro";
import { db, eq, sql, Views } from "astro:db";

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const params = new URLSearchParams(url.search);

  const slug = params.get("slug");

  if (!slug) {
    return new Response("Not found", { status: 404 });
  }

  let item;
  try {
    const views = await db
      .select({
        count: Views.count,
      })
      .from(Views)
      .where(eq(Views.slug, slug));

    item = await db
      .insert(Views)
      .values({
        slug: slug,
        count: views[0]?.count ? views[0].count + 1 : 1,
      })
      .onConflictDoUpdate({
        target: Views.slug,
        set: {
          count: sql`count + 1`,
        },
      })
      .returning({
        slug: Views.slug,
        count: Views.count,
      })
      .then((res) => res[0]);
  } catch (error) {
    item = { slug, count: 1 };
  }

  console.log("ITEM,", item);

  return new Response(JSON.stringify(item), {
    status: 200,
    headers: {
      "content-type": "application/json",
      "cache-control": "public, s-maxage=60, stale-while-revalidate=25",
    },
  });
};
