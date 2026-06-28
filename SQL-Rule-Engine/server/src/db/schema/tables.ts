import {
  pgTable,
  uuid,
  text,
  varchar,
  boolean,
  integer,
  timestamp,
  jsonb,
  index,
  uniqueIndex,
  primaryKey,
} from "drizzle-orm/pg-core";
import {
  userRoleEnum,
  planTypeEnum,
  subStatusEnum,
  difficultyLevelEnum,
  sessionModeEnum,
  sessionStatusEnum,
  sqStatusEnum
} from "./enums.ts";

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    role: userRoleEnum("role").notNull().default("user"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    deletedAt: timestamp("deleted_at"),
  },
  (t) => [uniqueIndex("users_email_idx").on(t.email)]
);


export const subscriptions = pgTable(
  "subscriptions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    plan: planTypeEnum("plan").notNull(),
    status: subStatusEnum("status").notNull().default("active"),
    startedAt: timestamp("started_at").notNull().defaultNow(),
    expiresAt: timestamp("expires_at"),
    cancelledAt: timestamp("cancelled_at"),
  },
  (t) => [index("subscriptions_user_id_idx").on(t.userId)]
);


export const schemas = pgTable(
  "schemas",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [uniqueIndex("schemas_name_idx").on(t.name)]
);


export const schemaTables = pgTable(
  "schema_tables",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    schemaId: uuid("schema_id")
      .notNull()
      .references(() => schemas.id, { onDelete: "cascade" }),
    tableName: text("table_name").notNull(),
  },
  (t) => [index("schema_tables_schema_id_idx").on(t.schemaId)]
);


export const schemaColumns = pgTable(
  "schema_columns",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    schemaTableId: uuid("schema_table_id")
      .notNull()
      .references(() => schemaTables.id, { onDelete: "cascade" }),
    columnName: text("column_name").notNull(),
    dataType: text("data_type").notNull(),
    isPk: boolean("is_pk").notNull().default(false),
    isFk: boolean("is_fk").notNull().default(false),
    fkReference: text("fk_reference"),
    isNullable: boolean("is_nullable").notNull().default(true),
  },
  (t) => [index("schema_columns_table_id_idx").on(t.schemaTableId)]
);


export const problems = pgTable(
  "problems",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    schemaId: uuid("schema_id")
      .notNull()
      .references(() => schemas.id, { onDelete: "restrict" }),
    title: text("title").notNull(),
    questionText: text("question_text").notNull(),
    difficulty: difficultyLevelEnum("difficulty").notNull(),
    isFree: boolean("is_free").notNull().default(false),
    is_order_sensitive : boolean("is_order_sensitive").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    index("problems_schema_id_idx").on(t.schemaId),
    index("problems_difficulty_idx").on(t.difficulty),
  ]
);


export const problemSolutions = pgTable("problem_solutions", {
  id: uuid("id").primaryKey().defaultRandom(),
  problemId: uuid("problem_id")
    .notNull()
    .unique()
    .references(() => problems.id, { onDelete: "cascade" }),
  referenceSolutionQuery: text("reference_solution_query").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});


export const problemRules = pgTable(
  "problem_rules",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    problemId: uuid("problem_id")
      .notNull()
      .references(() => problems.id, { onDelete: "cascade" }),
    rules: jsonb("rules").notNull(),
    ruleVersion: integer("rule_version").notNull().default(1),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("problem_rules_problem_id_idx").on(t.problemId)]
);


export const expectedResults = pgTable(
  "expected_results",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    problemId: uuid("problem_id")
      .notNull()
      .references(() => problems.id, { onDelete: "cascade" }),
    solutionId: uuid("solution_id")
      .notNull()
      .references(() => problemSolutions.id, { onDelete: "cascade" }),
    rows: jsonb("rows").notNull(),
    rowsHash: text("rows_hash").notNull(),
    ruleVersionSnapshot: integer("rule_version_snapshot").notNull(),
    isActive: boolean("is_active").notNull().default(true),
    generatedAt: timestamp("generated_at").notNull().defaultNow(),
  },
  (t) => [
    index("expected_results_problem_id_idx").on(t.problemId),
    index("expected_results_solution_id_idx").on(t.solutionId),
  ]
);


export const concepts = pgTable(
  "concepts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    description: text("description").notNull(),
  },
  (t) => [uniqueIndex("concepts_name_idx").on(t.name)]
);


export const problemConcepts = pgTable(
  "problem_concepts",
  {
    problemId: uuid("problem_id")
      .notNull()
      .references(() => problems.id, { onDelete: "cascade" }),
    conceptId: uuid("concept_id")
      .notNull()
      .references(() => concepts.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.problemId, t.conceptId] })]
);


export const interviewSessions = pgTable(
  "interview_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    mode: sessionModeEnum("mode").notNull(),
    status: sessionStatusEnum("status").notNull().default("active"),
    startedAt: timestamp("started_at").notNull().defaultNow(),
    endedAt: timestamp("ended_at"),
    readinessCheckPassed: boolean("readiness_check_passed")
      .notNull()
      .default(false),
  },
  (t) => [index("interview_sessions_user_id_idx").on(t.userId)]
);


export const sessionQuestions = pgTable(
  "session_questions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sessionId: uuid("session_id")
      .notNull()
      .references(() => interviewSessions.id, { onDelete: "cascade" }),
    problemId: uuid("problem_id")
      .notNull()
      .references(() => problems.id, { onDelete: "restrict" }),
    orderIndex: integer("order_index").notNull(),
    timerEnabled: boolean("timer_enabled").notNull().default(false),
    timeLimitSeconds: integer("time_limit_seconds"),
    status: sqStatusEnum("status").notNull().default("pending"),
    usedAt: timestamp("used_at"),
  },
  (t) => [
    index("session_questions_session_id_idx").on(t.sessionId),
    index("session_questions_problem_id_idx").on(t.problemId),
  ]
);


export const attempts = pgTable(
  "attempts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sessionQuestionId: uuid("session_question_id")
      .notNull()
      .references(() => sessionQuestions.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    finalQuery: text("final_query"),
    status: text("status").notNull(),
    score: integer("score"),
    submittedAt: timestamp("submitted_at").notNull().defaultNow(),
  },
  (t) => [
    index("attempts_session_question_id_idx").on(t.sessionQuestionId),
    index("attempts_user_id_idx").on(t.userId),
  ]
);


export const attemptRuns = pgTable(
  "attempt_runs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    // nullable: backfilled from a finalized attempt, null during live drafting
    attemptId: uuid("attempt_id").references(() => attempts.id, {
      onDelete: "set null",
    }),
    sessionQuestionId: uuid("session_question_id")
      .notNull()
      .references(() => sessionQuestions.id, { onDelete: "cascade" }),
    queryText: text("query_text").notNull(),
    queryHash: text("query_hash").notNull(),
    output: jsonb("output"),
    errorText: text("error_text"),
    runtimeMs: integer("runtime_ms"),
    ruleVersionUsed: integer("rule_version_used").notNull(),
    ranAt: timestamp("ran_at").notNull().defaultNow(),
  },
  (t) => [
    index("attempt_runs_attempt_id_idx").on(t.attemptId),
    index("attempt_runs_session_question_id_idx").on(t.sessionQuestionId),
    index("attempt_runs_query_hash_idx").on(t.queryHash),
  ]
);


export const attemptFeedback = pgTable("attempt_feedback", {
  id: uuid("id").primaryKey().defaultRandom(),
  attemptId: uuid("attempt_id")
    .notNull()
    .unique()
    .references(() => attempts.id, { onDelete: "cascade" }),
  rubricScores: jsonb("rubric_scores").notNull(),
  summary: text("summary"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});


export const authSessions = pgTable("auth_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  refreshToken: varchar("refresh_token", { length: 500 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});