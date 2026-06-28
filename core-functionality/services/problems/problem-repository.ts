import { pool } from "../../db/index.js";
import type { ProblemResponse } from "../../types/api.js";

interface ProblemRow {
  problem_id: string;
  title: string;
  pattern: string;
  schema_name: string;
  query: string;
}

function toProblemResponse(row: ProblemRow): ProblemResponse {
  return {
    problem_id: row.problem_id,
    title: row.title,
    pattern: row.pattern,
    schema: row.schema_name,
    query: row.query,
  };
}

export async function getProblems(): Promise<ProblemResponse[]> {
  const result = await pool.query<ProblemRow>(
    `SELECT problem_id, title, pattern, schema_name, query
     FROM problems
     ORDER BY problem_id`,
  );

  return result.rows.map(toProblemResponse);
}

export async function getProblemById(problemId: string): Promise<ProblemResponse | undefined> {
  const result = await pool.query<ProblemRow>(
    `SELECT problem_id, title, pattern, schema_name, query
     FROM problems
     WHERE problem_id = $1
     LIMIT 1`,
    [problemId],
  );

  return result.rows[0] ? toProblemResponse(result.rows[0]) : undefined;
}
