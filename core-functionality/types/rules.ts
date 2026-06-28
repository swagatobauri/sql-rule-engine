export type RuleCategory = "logic" | "performance" | "best_practice" | "readability";

export interface RuleResult {
  triggered: boolean;
  issue: string;
  category: RuleCategory;
  explanation: string;
}
