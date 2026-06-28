import { index, pgTable, text, uniqueIndex, jsonb } from "drizzle-orm/pg-core";

export const problems = pgTable("problems", {
  problemId: text("problem_id").primaryKey(),
  title: text("title").notNull(),
  pattern: text("pattern").notNull(),
  schemaName: text("schema_name").notNull(),
  query: text("query").notNull(),
});

export const expectedResults = pgTable(
  "expected_results",
  {
    problemId: text("problem_id")
      .notNull()
      .references(() => problems.problemId, { onDelete: "cascade" }),
    schemaName: text("schema_name").notNull(),
    resultHash: text("result_hash").notNull(),
    resultRows: jsonb("result_rows"),
  },
  (table) => [
    index("idx_expected_results_problem_id").on(table.problemId),
    uniqueIndex("uniq_expected_results_problem_schema").on(table.problemId, table.schemaName),
  ],
);
