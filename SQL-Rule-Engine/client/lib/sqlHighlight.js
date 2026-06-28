// Tiny SQL syntax highlighter -> returns an array of {type, value} tokens per line.
// Deterministic and dependency-free so it runs in a server component.

const KEYWORDS = new Set([
  "SELECT", "FROM", "JOIN", "LEFT", "RIGHT", "INNER", "OUTER", "ON", "WHERE",
  "NOT", "IN", "GROUP", "BY", "HAVING", "ORDER", "AS", "AND", "OR", "NULL",
  "DESC", "ASC", "DISTINCT", "LIMIT", "UNION", "ALL", "EXISTS", "BETWEEN", "LIKE",
]);
const FUNCTIONS = new Set([
  "MIN", "MAX", "COUNT", "SUM", "AVG", "COALESCE", "ROUND", "NOW", "CAST",
]);

const TOKEN_RE = /(\s+)|([A-Za-z_][A-Za-z0-9_]*)|(\d+)|(\*|=|>|<|>=|<=|<>|\(|\)|,|;|\.)|(.)/g;

export function tokenizeLine(line) {
  if (line.trimStart().startsWith("--")) {
    return [{ type: "comment", value: line }];
  }
  const tokens = [];
  let m;
  while ((m = TOKEN_RE.exec(line)) !== null) {
    const [, ws, word, num, op, other] = m;
    if (ws) tokens.push({ type: "ws", value: ws });
    else if (word) {
      const upper = word.toUpperCase();
      if (KEYWORDS.has(upper)) tokens.push({ type: "keyword", value: word });
      else if (FUNCTIONS.has(upper)) tokens.push({ type: "fn", value: word });
      else tokens.push({ type: "ident", value: word });
    } else if (num) tokens.push({ type: "number", value: num });
    else if (op) tokens.push({ type: "op", value: op });
    else tokens.push({ type: "other", value: other });
  }
  return tokens;
}

export const TOKEN_CLASS = {
  comment: "text-slate-400",
  keyword: "text-indigo-500 font-semibold",
  fn: "text-cyan-600 font-semibold",
  number: "text-orange-500",
  op: "text-ink/60",
  ident: "text-ink/80",
  other: "text-ink/80",
  ws: "",
};
