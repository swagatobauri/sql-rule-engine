// Content for a single in-session practice question (the SQL Editor screen).

export const SESSION = {
  index: 4,
  total: 20,
  tag: "JOINS",
  difficulty: "Medium",
  time: 15,
  title: "Find customers who placed an order but never made a repeat purchase.",
  description:
    "Return the customer_id, customer_name and the date of their first (and only) order.",
  businessContext:
    "The marketing team wants to identify one-time customers for a re-engagement campaign.",
  database: "EcommerceDB",
};

export const EXPECTED_OUTPUT = {
  columns: ["customer_id", "customer_name", "first_order_date"],
  rows: [
    ["101", "John Doe", "2023-08-10"],
    ["205", "Alice Brown", "2023-08-15"],
    ["...", "...", "..."],
  ],
};

export const RESULT = {
  columns: ["customer_id", "customer_name", "first_order_date"],
  rows: [
    ["101", "John Doe", "2023-08-10"],
    ["205", "Alice Brown", "2023-08-15"],
  ],
  rowCount: 2,
  durationMs: 243,
};

export const SCHEMA = [
  {
    name: "customers",
    columnCount: 3,
    columns: [
      ["customer_id", "INT", "PK"],
      ["customer_name", "VARCHAR", ""],
      ["signup_date", "DATE", ""],
    ],
  },
  {
    name: "orders",
    columnCount: 4,
    columns: [
      ["order_id", "INT", "PK"],
      ["customer_id", "INT", "FK"],
      ["order_date", "DATE", ""],
      ["order_amount", "DECIMAL", ""],
    ],
  },
  {
    name: "order_items",
    columnCount: 4,
    columns: [
      ["order_id", "INT", "FK"],
      ["product_id", "INT", "FK"],
      ["quantity", "INT", ""],
      ["price", "DECIMAL", ""],
    ],
  },
];

export const DEFAULT_QUERY = `-- Write your SQL query here
SELECT
    c.customer_id,
    c.customer_name,
    MIN(o.order_date) AS first_order_date
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
WHERE c.customer_id NOT IN (
    SELECT customer_id
    FROM orders
    GROUP BY customer_id
    HAVING COUNT(*) > 1
)
GROUP BY c.customer_id, c.customer_name
ORDER BY first_order_date;`;

export const RUBRIC = [
  { icon: "Target", tint: "text-brand", label: "Correct Output (35%)", fill: 60 },
  { icon: "Brain", tint: "text-amber-500", label: "SQL Logic (25%)", fill: 38 },
  { icon: "CircleCheck", tint: "text-emerald-500", label: "Edge Cases (15%)", fill: 20 },
  { icon: "FileText", tint: "text-sky-500", label: "Explanation (15%)", fill: 14 },
  { icon: "AlignLeft", tint: "text-rose-400", label: "Query Readability (10%)", fill: 30 },
];

// Timer: 12:47 remaining of a 15:00 mock.
export const TIMER = { remainingSeconds: 767, totalSeconds: 900 };
