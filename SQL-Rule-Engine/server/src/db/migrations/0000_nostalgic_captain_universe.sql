CREATE TYPE "public"."difficulty_level" AS ENUM('easy', 'medium', 'hard');--> statement-breakpoint
CREATE TYPE "public"."plan_type" AS ENUM('free', 'paid');--> statement-breakpoint
CREATE TYPE "public"."session_mode" AS ENUM('practice', 'interview');--> statement-breakpoint
CREATE TYPE "public"."session_status" AS ENUM('active', 'completed', 'abandoned');--> statement-breakpoint
CREATE TYPE "public"."sq_status" AS ENUM('pending', 'answered', 'skipped', 'timed_out');--> statement-breakpoint
CREATE TYPE "public"."sub_status" AS ENUM('active', 'cancelled', 'expired', 'trailing');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'user', 'mentor');--> statement-breakpoint
CREATE TABLE "attempt_feedback" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"attempt_id" uuid NOT NULL,
	"rubric_scores" jsonb NOT NULL,
	"summary" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "attempt_feedback_attempt_id_unique" UNIQUE("attempt_id")
);
--> statement-breakpoint
CREATE TABLE "attempt_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"attempt_id" uuid,
	"session_question_id" uuid NOT NULL,
	"query_text" text NOT NULL,
	"query_hash" text NOT NULL,
	"output" jsonb,
	"error_text" text,
	"runtime_ms" integer,
	"rule_version_used" integer NOT NULL,
	"ran_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_question_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"final_query" text,
	"status" text NOT NULL,
	"score" integer,
	"submitted_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "concepts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "expected_results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"problem_id" uuid NOT NULL,
	"solution_id" uuid NOT NULL,
	"rows" jsonb NOT NULL,
	"rows_hash" text NOT NULL,
	"rule_version_snapshot" integer NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"generated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "interview_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"mode" "session_mode" NOT NULL,
	"status" "session_status" DEFAULT 'active' NOT NULL,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"ended_at" timestamp,
	"readiness_check_passed" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "problem_concepts" (
	"problem_id" uuid NOT NULL,
	"concept_id" uuid NOT NULL,
	CONSTRAINT "problem_concepts_problem_id_concept_id_pk" PRIMARY KEY("problem_id","concept_id")
);
--> statement-breakpoint
CREATE TABLE "problem_rules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"problem_id" uuid NOT NULL,
	"rules" jsonb NOT NULL,
	"rule_version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "problem_solutions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"problem_id" uuid NOT NULL,
	"reference_solution_query" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "problem_solutions_problem_id_unique" UNIQUE("problem_id")
);
--> statement-breakpoint
CREATE TABLE "problems" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"schema_id" uuid NOT NULL,
	"title" text NOT NULL,
	"question_text" text NOT NULL,
	"difficulty" "difficulty_level" NOT NULL,
	"is_free" boolean DEFAULT false NOT NULL,
	"is_order_sensitive" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "schema_columns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"schema_table_id" uuid NOT NULL,
	"column_name" text NOT NULL,
	"data_type" text NOT NULL,
	"is_pk" boolean DEFAULT false NOT NULL,
	"is_fk" boolean DEFAULT false NOT NULL,
	"fk_reference" text,
	"is_nullable" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "schema_tables" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"schema_id" uuid NOT NULL,
	"table_name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "schemas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session_questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"problem_id" uuid NOT NULL,
	"order_index" integer NOT NULL,
	"timer_enabled" boolean DEFAULT false NOT NULL,
	"time_limit_seconds" integer,
	"status" "sq_status" DEFAULT 'pending' NOT NULL,
	"used_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"plan" "plan_type" NOT NULL,
	"status" "sub_status" DEFAULT 'active' NOT NULL,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp,
	"cancelled_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "attempt_feedback" ADD CONSTRAINT "attempt_feedback_attempt_id_attempts_id_fk" FOREIGN KEY ("attempt_id") REFERENCES "public"."attempts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attempt_runs" ADD CONSTRAINT "attempt_runs_attempt_id_attempts_id_fk" FOREIGN KEY ("attempt_id") REFERENCES "public"."attempts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attempt_runs" ADD CONSTRAINT "attempt_runs_session_question_id_session_questions_id_fk" FOREIGN KEY ("session_question_id") REFERENCES "public"."session_questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attempts" ADD CONSTRAINT "attempts_session_question_id_session_questions_id_fk" FOREIGN KEY ("session_question_id") REFERENCES "public"."session_questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attempts" ADD CONSTRAINT "attempts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expected_results" ADD CONSTRAINT "expected_results_problem_id_problems_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."problems"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expected_results" ADD CONSTRAINT "expected_results_solution_id_problem_solutions_id_fk" FOREIGN KEY ("solution_id") REFERENCES "public"."problem_solutions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interview_sessions" ADD CONSTRAINT "interview_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "problem_concepts" ADD CONSTRAINT "problem_concepts_problem_id_problems_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."problems"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "problem_concepts" ADD CONSTRAINT "problem_concepts_concept_id_concepts_id_fk" FOREIGN KEY ("concept_id") REFERENCES "public"."concepts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "problem_rules" ADD CONSTRAINT "problem_rules_problem_id_problems_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."problems"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "problem_solutions" ADD CONSTRAINT "problem_solutions_problem_id_problems_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."problems"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "problems" ADD CONSTRAINT "problems_schema_id_schemas_id_fk" FOREIGN KEY ("schema_id") REFERENCES "public"."schemas"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schema_columns" ADD CONSTRAINT "schema_columns_schema_table_id_schema_tables_id_fk" FOREIGN KEY ("schema_table_id") REFERENCES "public"."schema_tables"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schema_tables" ADD CONSTRAINT "schema_tables_schema_id_schemas_id_fk" FOREIGN KEY ("schema_id") REFERENCES "public"."schemas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_questions" ADD CONSTRAINT "session_questions_session_id_interview_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."interview_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_questions" ADD CONSTRAINT "session_questions_problem_id_problems_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."problems"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "attempt_runs_attempt_id_idx" ON "attempt_runs" USING btree ("attempt_id");--> statement-breakpoint
CREATE INDEX "attempt_runs_session_question_id_idx" ON "attempt_runs" USING btree ("session_question_id");--> statement-breakpoint
CREATE INDEX "attempt_runs_query_hash_idx" ON "attempt_runs" USING btree ("query_hash");--> statement-breakpoint
CREATE INDEX "attempts_session_question_id_idx" ON "attempts" USING btree ("session_question_id");--> statement-breakpoint
CREATE INDEX "attempts_user_id_idx" ON "attempts" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "concepts_name_idx" ON "concepts" USING btree ("name");--> statement-breakpoint
CREATE INDEX "expected_results_problem_id_idx" ON "expected_results" USING btree ("problem_id");--> statement-breakpoint
CREATE INDEX "expected_results_solution_id_idx" ON "expected_results" USING btree ("solution_id");--> statement-breakpoint
CREATE INDEX "interview_sessions_user_id_idx" ON "interview_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "problem_rules_problem_id_idx" ON "problem_rules" USING btree ("problem_id");--> statement-breakpoint
CREATE INDEX "problems_schema_id_idx" ON "problems" USING btree ("schema_id");--> statement-breakpoint
CREATE INDEX "problems_difficulty_idx" ON "problems" USING btree ("difficulty");--> statement-breakpoint
CREATE INDEX "schema_columns_table_id_idx" ON "schema_columns" USING btree ("schema_table_id");--> statement-breakpoint
CREATE INDEX "schema_tables_schema_id_idx" ON "schema_tables" USING btree ("schema_id");--> statement-breakpoint
CREATE UNIQUE INDEX "schemas_name_idx" ON "schemas" USING btree ("name");--> statement-breakpoint
CREATE INDEX "session_questions_session_id_idx" ON "session_questions" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "session_questions_problem_id_idx" ON "session_questions" USING btree ("problem_id");--> statement-breakpoint
CREATE INDEX "subscriptions_user_id_idx" ON "subscriptions" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");