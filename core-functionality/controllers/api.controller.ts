import type { Request, Response } from "express";

import { normalizeSql } from "../services/normalization/query-normalizer.js";
import { generateFingerprint } from "../services/utils/fingerprint.js";
import { runRules } from "../services/rules/rule-engine.js";
import { evaluateQuery } from "../services/evaluation/evaluator.js";
import { getProblemById, getProblems } from "../services/problems/problem-repository.js";
import { ApiError, ApiSuccess } from "../utils/api-response.utils.js";
import {
  evaluateSchema,
  fingerprintSchema,
  normalizeSchema,
  problemIdParamSchema,
  rulesSchema,
  validateSchema,
} from "./validation/index.js";

// Problems Controllers
export const getAllProblems = async (_req: Request, res: Response): Promise<void> => {
  try {
    const problems = await getProblems();
    ApiSuccess(res, "Problems fetched successfully", 200, problems);
  } catch (ex) {
    console.error("Error occurred in problems: ", ex);
    ApiError(res, "Internal Server Error", 500);
  }
};

export const getProblemByIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    const validation = validateSchema(problemIdParamSchema, {
      problemId: req.params.problemId,
    });

    if (!validation.success) {
      ApiError(res, validation.error, 400);
      return;
    }

    const { problemId } = validation.data;
    const problem = await getProblemById(problemId);

    if (!problem) {
      ApiError(res, `Problem '${problemId}' not found`, 404);
      return;
    }

    ApiSuccess(res, "Problem fetched successfully", 200, problem);
  } catch {
    ApiError(res, "Internal Server Error", 500);
  }
};

// Normalize Controller
export const normalize = (req: Request, res: Response): void => {
  try {
    const validation = validateSchema(normalizeSchema, req.body);

    if (!validation.success) {
      ApiError(res, validation.error, 400);
      return;
    }

    const { sql } = validation.data;
    const parsed = normalizeSql(sql);

    if (parsed.error || !parsed.normalized_sql) {
      ApiError(res, parsed.error ?? "Invalid SQL query", 400);
      return;
    }

    ApiSuccess(res, "SQL normalized successfully", 200, {
      normalized_sql: parsed.normalized_sql,
      error: null,
    });
  } catch {
    ApiError(res, "Internal Server Error", 500);
  }
};

// Fingerprint Controller
export const generateFingerprintController = (req: Request, res: Response): void => {
  try {
    const validation = validateSchema(fingerprintSchema, req.body);

    if (!validation.success) {
      ApiError(res, validation.error, 400);
      return;
    }

    const { sql, schema_name, problem_id } = validation.data;
    const parsed = normalizeSql(sql);

    if (parsed.error || !parsed.normalized_sql) {
      ApiError(res, parsed.error ?? "Invalid SQL query", 400);
      return;
    }

    const problemId = typeof problem_id === "string" && problem_id.trim() ? problem_id : "global";

    const fingerprint = generateFingerprint(problemId, schema_name, parsed.normalized_sql);

    ApiSuccess(res, "Fingerprint generated successfully", 200, {
      fingerprint,
      normalized_sql: parsed.normalized_sql,
    });
  } catch {
    ApiError(res, "Internal Server Error", 500);
  }
};

// Rules Controller
export const runRulesController = (req: Request, res: Response): void => {
  try {
    const validation = validateSchema(rulesSchema, req.body);

    if (!validation.success) {
      ApiError(res, validation.error, 400);
      return;
    }

    const { sql } = validation.data;
    const parsed = normalizeSql(sql);

    if (parsed.error || !parsed.normalized_sql) {
      ApiError(res, parsed.error ?? "Invalid SQL query", 400);
      return;
    }

    const issues = runRules(parsed.ast);

    ApiSuccess(res, "Rules executed successfully", 200, {
      normalized_sql: parsed.normalized_sql,
      issues_count: issues.length,
      issues,
    });
  } catch {
    ApiError(res, "Internal Server Error", 500);
  }
};

// Evaluate Controller
export const evaluateQueryController = async (req: Request, res: Response): Promise<void> => {
  try {
    const validation = validateSchema(evaluateSchema, req.body);
    if (!validation.success) {
      ApiError(res, validation.error, 400);
      return;
    }

    const { sql, schema_name, problem_id } = validation.data;

    const result = await evaluateQuery(sql, schema_name, problem_id);
    if (result.error) {
      ApiError(res, result.error, 400);
      return;
    }

    ApiSuccess(res, "Query evaluated successfully", 200, result);
  } catch (e) {
    console.error(e);
    ApiError(res, "Internal Server Error", 500);
  }
};
