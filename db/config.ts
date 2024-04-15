import { column, defineDb, defineTable } from "astro:db";

const Views = defineTable({
  deprecated: true,
  columns: {
    slug: column.text({ primaryKey: true }),
    count: column.number({
      default: 1,
    }),
  },
});

const ImageViews = defineTable({
  columns: {
    slug: column.text({ primaryKey: true }),
    count: column.number({
      default: 1,
    }),
  },
});

export default defineDb({
  tables: { ImageViews },
});
