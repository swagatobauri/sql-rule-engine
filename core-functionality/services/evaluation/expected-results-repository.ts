import { readFileSync } from "fs";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { pool } from "../../db/index.js";

interface ExpectedResultRecord {
  problem_id: string;
  result_hash: string;
}

const __dirname = fileURLToPath(new URL(".", import.meta.url));

function getExpectedResultsFilePath(): string {
  return resolve(__dirname, "../../data/expected-results.json");
}

let cachedExpectedResults: ExpectedResultRecord[] | null = null;

function getExpectedResultsFromFile(): ExpectedResultRecord[] {
  if (!cachedExpectedResults) {
    cachedExpectedResults = JSON.parse(readFileSync(getExpectedResultsFilePath(), "utf-8")) as ExpectedResultRecord[];
  }
  return cachedExpectedResults;
}

export async function getExpectedHash(problemId: string): Promise<string | null> {
  try {
    const result = await pool.query<{ result_hash: string }>(
      `SELECT result_hash
       FROM expected_results
       WHERE problem_id = $1
       LIMIT 1`,
      [problemId],
    );

    if (result.rowCount && result.rows[0]?.result_hash) {
      return result.rows[0].result_hash;
    }
  } catch {
    // Fall back to local JSON so the service remains usable without DB seed data.
  }

  const fileRecord = getExpectedResultsFromFile().find((item) => item.problem_id === problemId);
  return fileRecord?.result_hash ?? null;
}
