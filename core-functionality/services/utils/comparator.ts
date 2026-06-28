import { normalizeResult } from "./result-normalizer.js";
import { generateSha256Hash } from "./fingerprint.js";

// Note: This function is not currently being used in the codebase yet.
export function hashResult(rows: Record<string, unknown>[]): string {
  return generateSha256Hash(normalizeResult(rows));
}

export function compareHashes(a: string, b: string): boolean {
  return a === b;
}

export function hashAndCompare(
  normalizedResult: string,
  expectedHash: string,
): { correct: boolean; result_hash: string; expected_hash: string } {
  const resultHash = generateSha256Hash(normalizedResult).toLowerCase();
  const expected = expectedHash.toLowerCase();

  return {
    correct: resultHash === expected,
    result_hash: resultHash,
    expected_hash: expected,
  };
}
