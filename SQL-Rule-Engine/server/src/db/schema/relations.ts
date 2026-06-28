import { relations } from "drizzle-orm";
import { users, subscriptions, schemas, schemaTables, schemaColumns, problems, problemSolutions, problemRules, expectedResults, concepts, problemConcepts, interviewSessions, sessionQuestions, attempts, attemptRuns, attemptFeedback } from "./tables.ts";

export const usersRelations = relations(users, ({ many }) => ({
  subscriptions: many(subscriptions),
  interviewSessions: many(interviewSessions),
  attempts: many(attempts),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, { fields: [subscriptions.userId], references: [users.id] }),
}));

export const schemasRelations = relations(schemas, ({ many }) => ({
  tables: many(schemaTables),
  problems: many(problems),
}));

export const schemaTablesRelations = relations(schemaTables, ({ one, many }) => ({
  schema: one(schemas, { fields: [schemaTables.schemaId], references: [schemas.id] }),
  columns: many(schemaColumns),
}));

export const schemaColumnsRelations = relations(schemaColumns, ({ one }) => ({
  table: one(schemaTables, {
    fields: [schemaColumns.schemaTableId],
    references: [schemaTables.id],
  }),
}));

export const problemsRelations = relations(problems, ({ one, many }) => ({
  schema: one(schemas, { fields: [problems.schemaId], references: [schemas.id] }),
  solution: one(problemSolutions),
  rules: many(problemRules),
  expectedResults: many(expectedResults),
  concepts: many(problemConcepts),
  sessionQuestions: many(sessionQuestions),
}));

export const problemSolutionsRelations = relations(
  problemSolutions,
  ({ one, many }) => ({
    problem: one(problems, {
      fields: [problemSolutions.problemId],
      references: [problems.id],
    }),
    expectedResults: many(expectedResults),
  })
);

export const problemRulesRelations = relations(problemRules, ({ one }) => ({
  problem: one(problems, {
    fields: [problemRules.problemId],
    references: [problems.id],
  }),
}));

export const expectedResultsRelations = relations(expectedResults, ({ one }) => ({
  problem: one(problems, {
    fields: [expectedResults.problemId],
    references: [problems.id],
  }),
  solution: one(problemSolutions, {
    fields: [expectedResults.solutionId],
    references: [problemSolutions.id],
  }),
}));

export const conceptsRelations = relations(concepts, ({ many }) => ({
  problems: many(problemConcepts),
}));

export const problemConceptsRelations = relations(problemConcepts, ({ one }) => ({
  problem: one(problems, {
    fields: [problemConcepts.problemId],
    references: [problems.id],
  }),
  concept: one(concepts, {
    fields: [problemConcepts.conceptId],
    references: [concepts.id],
  }),
}));

export const interviewSessionsRelations = relations(
  interviewSessions,
  ({ one, many }) => ({
    user: one(users, {
      fields: [interviewSessions.userId],
      references: [users.id],
    }),
    questions: many(sessionQuestions),
  })
);

export const sessionQuestionsRelations = relations(
  sessionQuestions,
  ({ one, many }) => ({
    session: one(interviewSessions, {
      fields: [sessionQuestions.sessionId],
      references: [interviewSessions.id],
    }),
    problem: one(problems, {
      fields: [sessionQuestions.problemId],
      references: [problems.id],
    }),
    attempts: many(attempts),
    runs: many(attemptRuns),
  })
);

export const attemptsRelations = relations(attempts, ({ one, many }) => ({
  sessionQuestion: one(sessionQuestions, {
    fields: [attempts.sessionQuestionId],
    references: [sessionQuestions.id],
  }),
  user: one(users, { fields: [attempts.userId], references: [users.id] }),
  runs: many(attemptRuns),
  feedback: one(attemptFeedback),
}));

export const attemptRunsRelations = relations(attemptRuns, ({ one }) => ({
  attempt: one(attempts, {
    fields: [attemptRuns.attemptId],
    references: [attempts.id],
  }),
  sessionQuestion: one(sessionQuestions, {
    fields: [attemptRuns.sessionQuestionId],
    references: [sessionQuestions.id],
  }),
}));

export const attemptFeedbackRelations = relations(attemptFeedback, ({ one }) => ({
  attempt: one(attempts, {
    fields: [attemptFeedback.attemptId],
    references: [attempts.id],
  }),
}));