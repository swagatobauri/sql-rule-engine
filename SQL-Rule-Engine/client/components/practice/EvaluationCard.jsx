"use client";

import { useState } from "react";
import { AlignLeft, Brain, ChevronUp, CircleCheck, FileText, Target } from "lucide-react";
import { RUBRIC } from "@/data/session";
import { usePractice } from "./PracticeProvider";

const ICONS = { Target, Brain, CircleCheck, FileText, AlignLeft };

export default function EvaluationCard() {
  const { submitted, evaluation } = usePractice();
  const [open, setOpen] = useState(true);

  // Before submission the rubric is just a preview (empty bars, "--" scores).
  const items = submitted && evaluation ? evaluation.items : RUBRIC.map((r) => ({ ...r, fill: 0, earned: null }));

  return (
    <div className="bg-white rounded-2xl border border-black/[0.07] shadow-card p-4">
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center justify-between">
        <span className="flex items-center gap-2 text-[14px] font-bold">
          How you will be evaluated
          {submitted && evaluation && (
            <span className="rounded-full bg-brand-soft text-brand text-[11px] font-bold px-2 py-0.5">
              {evaluation.total} / 100
            </span>
          )}
        </span>
        <ChevronUp size={16} className={`text-ink/40 transition-transform ${open ? "" : "rotate-180"}`} />
      </button>

      {open && (
        <div className="mt-3 space-y-3.5">
          {items.map(({ icon, tint, label, fill, earned }) => {
            const Icon = ICONS[icon];
            return (
              <div key={label} className="flex items-center gap-3">
                <Icon size={16} className={tint} />
                <div className="flex-1">
                  <p className="text-[12.5px] font-semibold text-ink">{label}</p>
                  <div className="mt-1.5 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand to-violet-400 transition-[width] duration-500"
                      style={{ width: `${fill}%` }}
                    />
                  </div>
                </div>
                <span className="text-[12px] font-semibold text-ink/60 w-6 text-right">
                  {earned == null ? "--" : earned}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
