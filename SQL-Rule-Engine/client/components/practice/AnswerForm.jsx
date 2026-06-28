"use client";

import { useState } from "react";
import { CircleCheck, Send } from "lucide-react";
import { usePractice } from "./PracticeProvider";

function CharCount({ value, max }) {
  return (
    <div className="text-right text-[11px] text-ink/40 mt-1">
      {value} / {max}
    </div>
  );
}

export default function AnswerForm() {
  const { submit, submitted, evaluation } = usePractice();
  const [logic, setLogic] = useState("");
  const [edge, setEdge] = useState("");
  const [error, setError] = useState("");

  function handleSubmit() {
    if (logic.trim().length < 10) {
      setError("Please explain your logic before submitting (at least a sentence).");
      return;
    }
    setError("");
    submit({ logic, edge });
  }

  function onKeyDown(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  }

  if (submitted && evaluation) {
    return (
      <div className="bg-white rounded-2xl border border-black/[0.07] shadow-card p-4">
        <div className="flex items-center gap-2 text-emerald-600">
          <CircleCheck size={18} />
          <span className="text-[14px] font-bold">Answer submitted</span>
        </div>
        <p className="mt-2 text-[12.5px] text-body leading-relaxed">
          Your query and explanation were evaluated. You scored{" "}
          <b className="text-ink">{evaluation.total} / 100</b>. See the breakdown in the rubric above.
        </p>
        <div className="mt-3 rounded-lg bg-brand-soft px-3 py-2.5 text-[12px] text-body">
          Review the per-criterion scores, then move to the next question to keep practicing.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-black/[0.07] shadow-card p-4" onKeyDown={onKeyDown}>
      <label className="text-[13px] font-bold">
        Explain your logic <span className="text-rose-500">*</span>
      </label>
      <textarea
        value={logic}
        onChange={(e) => {
          setLogic(e.target.value.slice(0, 2000));
          if (error) setError("");
        }}
        placeholder="Explain your joins, filters, grouping and assumptions."
        className={`mt-2 w-full h-[78px] resize-none rounded-lg border p-2.5 text-[12.5px] placeholder:text-ink/35 focus:outline-none focus:ring-2 ${
          error ? "border-rose-300 focus:ring-rose-200" : "border-black/10 focus:ring-brand/25"
        }`}
      />
      <CharCount value={logic.length} max={2000} />

      <label className="mt-3 block text-[13px] font-bold">
        Edge cases considered <span className="text-body font-medium">(optional)</span>
      </label>
      <textarea
        value={edge}
        onChange={(e) => setEdge(e.target.value.slice(0, 1000))}
        placeholder="List the edge cases you considered, such as duplicates, nulls, date range boundaries, etc."
        className="mt-2 w-full h-[72px] resize-none rounded-lg border border-black/10 p-2.5 text-[12.5px] placeholder:text-ink/35 focus:outline-none focus:ring-2 focus:ring-brand/25"
      />
      <CharCount value={edge.length} max={1000} />

      {error && <p className="mt-1 text-[11.5px] font-medium text-rose-500">{error}</p>}

      <button
        onClick={handleSubmit}
        className="mt-3 w-full flex items-center justify-center gap-2 rounded-lg bg-brand hover:bg-brand-dark text-white h-11 text-[14px] font-bold transition-colors"
      >
        <Send size={16} /> Submit Final Answer
        <span className="text-white/70 font-medium text-[12px]">Ctrl+Enter</span>
      </button>
      <p className="mt-2 text-center text-[11px] text-body">
        You can run the query multiple times before submitting.
      </p>
    </div>
  );
}
