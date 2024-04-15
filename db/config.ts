import { column, defineDb, defineTable } from "astro:db";

const Views = defineTable({
  columns: {
    slug: column.text({ primaryKey: true }),
    count: column.number({
      default: 1,
    }),
  },
});

export default defineDb({
  tables: { Views },
});
