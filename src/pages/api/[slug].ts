import type { APIRoute } from "astro";
import { db, sql, ImageViews } from "astro:db";
import { getCollection } from "astro:content";

const imageCollection = await getCollection("images");

export const GET: APIRoute = async ({ request, params }) => {
  const slug = params["slug"];

  if (!slug) {
    return new Response("Not found", { status: 404 });
  }

  let item;
  try {
    item = await db.insert(ImageViews).values({
      slug,
      count: 1,
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
    console.error("Failed writing new count: ", error);
  }

  return new Response(JSON.stringify(item), {
    status: 200,
    headers: {
      "content-type": "application/json",
      "cache-control": "public, s-maxage=60, stale-while-revalidate=25",
    },
  });
};

export function getStaticPaths() {
  return imageCollection.map((image) => ({
    params: {
      slug: image.data.id,
    },
  }));
}


