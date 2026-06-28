export const SCHEMA_NAMES = ["ecommerce", "banking", "social", "inventory", "analytics"] as const;

export type SchemaName = (typeof SCHEMA_NAMES)[number];

export interface NormalizeRequest {
  sql: string;
}

export interface NormalizeResponse {
  normalized_sql: string | null;
  error: string | null;
}

export interface FingerprintRequest {
  sql: string;
  schema_name: SchemaName;
  problem_id?: string;
}

export interface FingerprintResponse {
  fingerprint: string;
  normalized_sql: string;
}

export interface RulesRequest {
  sql: string;
}

export interface RuleIssue {
  triggered: boolean;
  issue: string;
  category: string;
  explanation: string;
}

export interface RulesResponse {
  normalized_sql: string;
  issues_count: number;
  issues: RuleIssue[];
}

export interface EvaluateRequest {
  sql: string;
  schema_name: SchemaName;
  problem_id: string;
}

export interface QuestionAttempt {
  problem_id?: string;
  raw_sql?: string;
  normalized_sql?: string;
  runtime_status?: string;
  preview_columns?: string[];
  preview_rows?: Record<string, unknown>[];
  row_count?: number;
}

export interface EvaluateResponse {
  cached?: boolean;
  fingerprint?: string;
  result_hash?: string;
  correct?: boolean;
  rule_results?: RuleIssue[];
  feedback?: {
    is_correct: boolean;
    score: number;
    rule_issues: RuleIssue[];
    messages: string[];
  };
  question_attempt?: QuestionAttempt;
  error?: string;
}

export interface ProblemResponse {
  problem_id: string;
  title: string;
  pattern: string;
  schema: string;
  query: string;
}
