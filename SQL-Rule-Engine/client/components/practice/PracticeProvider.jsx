"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { DEFAULT_QUERY, RESULT, EXPECTED_OUTPUT, RUBRIC, TIMER } from "@/data/session";

const PracticeContext = createContext(null);

export function usePractice() {
  const ctx = useContext(PracticeContext);
  if (!ctx) throw new Error("usePractice must be used within <PracticeProvider>");
  return ctx;
}

const MAX_RUNS = 5;

// Naive but deterministic SQL pretty-printer: breaks major clauses onto their
// own lines and normalises keyword casing. Good enough for the "Format" action.
function formatSql(sql) {
  const clauses = ["SELECT", "FROM", "WHERE", "GROUP BY", "HAVING", "ORDER BY", "LIMIT", "JOIN", "LEFT JOIN", "RIGHT JOIN", "INNER JOIN"];
  let out = sql.replace(/[ \t]+/g, " ").trim();
  clauses
    .sort((a, b) => b.length - a.length)
    .forEach((c) => {
      const re = new RegExp(`\\s*\\b${c.replace(/ /g, "\\s+")}\\b`, "gi");
      out = out.replace(re, `\n${c}`);
    });
  return out
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .join("\n")
    .trim();
}

function countMatches(sql, words) {
  const upper = sql.toUpperCase();
  return words.reduce((n, w) => n + (upper.includes(w) ? 1 : 0), 0);
}

// Translate the query + written answer into rubric fill percentages (0-100).
function evaluate(sql, runOk, logic, edge) {
  const upper = sql.toUpperCase();
  const lines = sql.split("\n").filter((l) => l.trim() && !l.trim().startsWith("--"));

  const correct = runOk ? (upper.includes("GROUP BY") || upper.includes("MIN(") ? 92 : 70) : 12;

  const logicFeatures = countMatches(sql, ["JOIN", "WHERE", "GROUP BY", "HAVING", "ORDER BY", "SELECT"]);
  const sqlLogic = Math.min(100, 25 + logicFeatures * 13);

  const edgeLen = edge.trim().length;
  const edgeCases = edgeLen === 0 ? 8 : Math.min(100, 30 + Math.floor(edgeLen / 4));

  const logicLen = logic.trim().length;
  const explanation = logicLen === 0 ? 0 : Math.min(100, 25 + Math.floor(logicLen / 4));

  const upperKw = countMatches(sql, ["SELECT", "FROM", "WHERE"]);
  const readability = Math.min(100, 35 + lines.length * 7 + upperKw * 4);

  const items = RUBRIC.map((r) => {
    const fill =
      r.label.startsWith("Correct") ? correct :
      r.label.startsWith("SQL Logic") ? sqlLogic :
      r.label.startsWith("Edge") ? edgeCases :
      r.label.startsWith("Explanation") ? explanation :
      readability;
    const weight = Number(r.label.match(/\((\d+)%\)/)?.[1] ?? 0);
    return { ...r, fill, weight, earned: Math.round((fill / 100) * weight) };
  });

  const total = items.reduce((sum, i) => sum + i.earned, 0);
  return { items, total };
}

export default function PracticeProvider({ children }) {
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [runResult, setRunResult] = useState(null);
  const [runCount, setRunCount] = useState(0);
  const [previousRuns, setPreviousRuns] = useState([]);
  const [evaluation, setEvaluation] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(4);

  const runQuery = useCallback(() => {
    if (runCount >= MAX_RUNS) return { capped: true };
    const trimmed = query.replace(/--.*$/gm, "").trim();
    const ok = /\bselect\b/i.test(trimmed) && /\bfrom\b/i.test(trimmed);
    const durationMs = 150 + (query.length % 180);

    const result = ok
      ? {
          success: true,
          columns: RESULT.columns,
          rows: RESULT.rows,
          rowCount: RESULT.rows.length,
          durationMs,
        }
      : {
          success: false,
          error: trimmed ? "Syntax error: a valid query needs SELECT … FROM …" : "Query is empty.",
          durationMs,
        };

    setRunResult(result);
    setRunCount((c) => c + 1);
    setPreviousRuns((prev) => [
      { n: prev.length + 1, success: result.success, rowCount: result.rowCount ?? 0, durationMs },
      ...prev,
    ].slice(0, 8));
    return result;
  }, [query, runCount]);

  const format = useCallback(() => setQuery((q) => formatSql(q)), []);
  const clear = useCallback(() => {
    setQuery("");
    setRunResult(null);
  }, []);

  const submit = useCallback(
    ({ logic, edge }) => {
      const runOk = runResult?.success ?? false;
      const result = evaluate(query, runOk, logic, edge);
      setEvaluation(result);
      setSubmitted(true);
      return result;
    },
    [query, runResult]
  );

  const goPrev = useCallback(() => setQuestionIndex((i) => Math.max(1, i - 1)), []);
  const goNext = useCallback(() => setQuestionIndex((i) => Math.min(20, i + 1)), []);

  const value = useMemo(
    () => ({
      query, setQuery,
      runResult, runQuery, runCount, maxRuns: MAX_RUNS,
      previousRuns,
      format, clear,
      evaluation, submitted, submit,
      expected: EXPECTED_OUTPUT,
      timer: TIMER,
      questionIndex, goPrev, goNext,
    }),
    [query, runResult, runQuery, runCount, previousRuns, format, clear, evaluation, submitted, submit, questionIndex, goPrev, goNext]
  );

  return <PracticeContext.Provider value={value}>{children}</PracticeContext.Provider>;
}
