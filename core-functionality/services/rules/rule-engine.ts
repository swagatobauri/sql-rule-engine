import { ruleAggregateNoGroup } from "./rule-aggregate-no-group.js";
import { ruleCartesianJoin } from "./rule-cartesian-join.js";
import { ruleMissingWhere } from "./rule-missing-where.js";
import { ruleRightJoin } from "./rule-right-join.js";
import { ruleSelectStar } from "./rule-select-star.js";
import type { RuleResult } from "../../types/rules.js";

export function runRules(ast: any): RuleResult[] {
  const statements = Array.isArray(ast) ? ast : [ast];
  const results: RuleResult[] = [];

  for (const statement of statements) {
    if (!statement || typeof statement !== "object") {
      continue;
    }
    results.push(
      ruleSelectStar(statement),
      ruleMissingWhere(statement),
      ruleCartesianJoin(statement),
      ruleAggregateNoGroup(statement),
      ruleRightJoin(statement),
    );
  }

  return results;
}
