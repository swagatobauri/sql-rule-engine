import nodeSqlParser from "node-sql-parser";
import { SCHEMA_NAMES, type SchemaName } from "../../types/api.js";
import { pool } from "../../db/index.js";

const { Parser } = nodeSqlParser;
const parser = new Parser();

const BLOCKED = ["INSERT", "UPDATE", "DELETE", "DROP", "ALTER", "TRUNCATE", "CREATE"];

export async function executeQuery(
  sql: string,
  schemaName: SchemaName,
): Promise<{
  rows: Record<string, unknown>[];
  columns: string[];
  row_count: number;
  execution_time: number;
  error: string | null;
}> {
  const upper = sql.toUpperCase();
  for (const kw of BLOCKED) {
    if (upper.includes(kw)) {
      throw new Error(`Blocked keyword: ${kw}`);
    }
  }

  const ast = parser.astify(sql, { database: "PostgreSQL" });
  const statements = Array.isArray(ast) ? ast : [ast];
  const hasOnlyReadStatements = statements.every((statement: any) =>
    ["select"].includes(String(statement?.type).toLowerCase()),
  );
  if (!hasOnlyReadStatements) {
    throw new Error("Only SELECT statements are allowed.");
  }

  if (!SCHEMA_NAMES.includes(schemaName)) {
    throw new Error(`Invalid schema name: ${schemaName}`);
  }

  const client = await pool.connect();
  const startedAt = Date.now();

  try {
    await client.query("BEGIN");
    await client.query("SET TRANSACTION READ ONLY");
    await client.query(`SET search_path TO "${schemaName}"`);
    const result = await client.query(sql);
    await client.query("COMMIT");
    return {
      rows: result.rows as Record<string, unknown>[],
      columns: result.fields.map((field) => field.name),
      row_count: result.rowCount ?? result.rows.length,
      execution_time: (Date.now() - startedAt) / 1000,
      error: null,
    };
  } catch (err) {
    await client.query("ROLLBACK");
    return {
      rows: [],
      columns: [],
      row_count: 0,
      execution_time: (Date.now() - startedAt) / 1000,
      error: err instanceof Error ? err.message : String(err),
    };
  } finally {
    client.release();
  }
}
