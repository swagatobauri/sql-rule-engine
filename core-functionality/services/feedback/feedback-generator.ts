interface FeedbackInput {
  isCorrect: boolean;
  ruleIssues: Array<{
    triggered: boolean;
    issue: string;
    category: string;
    explanation: string;
  }>;
}

export function generateFeedback({ isCorrect, ruleIssues }: FeedbackInput) {
  const messages: string[] = [];

  if (isCorrect) {
    messages.push("✅ Your query produces the correct result!");
  } else {
    messages.push("❌ Query output does not match the expected result.");
  }

  if (ruleIssues.length === 0) {
    messages.push("✓ Rule Engine: no issues found.");
  } else {
    ruleIssues.forEach((r) => messages.push(`⚠️ ${r.issue}: ${r.explanation}`));
  }

  return {
    is_correct: isCorrect,
    score: isCorrect ? 100 : 0,
    rule_issues: ruleIssues,
    messages,
  };
}
