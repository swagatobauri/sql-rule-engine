import nodeSqlParser from "node-sql-parser";

const { Parser } = nodeSqlParser;

const parser = new Parser();

export interface NormalizeSqlResult {
  ast: unknown;
  normalized_sql: string | null;
  error: string | null;
}

function normalize(sql: string): string {
  const ast = parser.astify(sql, { database: "PostgreSQL" });
  return parser.sqlify(ast, { database: "PostgreSQL" }).trim();
}

function parseToAst(sql: string): unknown {
  return parser.astify(sql, { database: "PostgreSQL" });
}

export function normalizeSql(sql: string): NormalizeSqlResult {
  try {
    const ast = parseToAst(sql);
    return {
      ast,
      normalized_sql: normalize(sql),
      error: null,
    };
  } catch (error) {
    return {
      ast: null,
      normalized_sql: null,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
