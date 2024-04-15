import type { APIRoute } from "astro";
import { db, eq, sql, ImageViews } from "astro:db";

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
        count: ImageViews.count,
      })
      .from(ImageViews)
      .where(eq(ImageViews.slug, slug));

    console.log('VIEW ITEM')

    item = await db.insert(ImageViews).values({
      slug,
      count: 1
    }).returning({
      slug: ImageViews.slug,
      count: ImageViews.count,
    }).onConflictDoUpdate({
      target: ImageViews.slug,
      set: {
        count: sql`count + 1`,
      },
    }).then((res) => res[0]);
  } catch (error) {
    item = { slug, count: 1 };
    console.error('Hello',error);
  }

  console.log("ITEM,", item);

  return new Response(JSON.stringify(item ?? {}), {
    status: 200,
    headers: {
      "content-type": "application/json",
      "cache-control": "public, s-maxage=60, stale-while-revalidate=25",
    },
  });
};
