"use client";

import { useState } from "react";
import { Clock, FileText, NotebookPen } from "lucide-react";
import SchemaTable from "./SchemaTable";
import { SESSION, EXPECTED_OUTPUT, SCHEMA } from "@/data/session";

function MiniTable({ columns, rows }) {
  return (
    <div className="mt-1.5 rounded-xl border border-black/[0.08] overflow-hidden">
      <table className="w-full text-[11.5px]">
        <thead>
          <tr className="bg-[#FAFAFC] text-body">
            {columns.map((c) => (
              <th key={c} className="text-left font-semibold px-3 py-1.5 first:pl-3">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="font-mono text-ink/80">
          {rows.map((r, i) => (
            <tr
              key={i}
              className={`border-t border-black/[0.05] ${r[0] === "..." ? "text-ink/40" : ""}`}
            >
              {r.map((cell, j) => (
                <td key={j} className="px-3 py-1.5">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function QuestionTab() {
  const [sub, setSub] = useState("Schema");

  return (
    <>
      <div className="flex items-center gap-2 text-[11px]">
        <span className="rounded-md bg-violet-100 text-brand font-bold px-2 py-1 tracking-wide">
          {SESSION.tag}
        </span>
        <span className="flex items-center gap-1 font-semibold text-body">
          <span className="text-[8px] text-amber-500">●</span>
          {SESSION.difficulty}
        </span>
        <span className="flex items-center gap-1 text-body">
          <Clock size={12} />
          {SESSION.time} min
        </span>
      </div>

      <h2 className="mt-3 text-[18px] font-extrabold leading-snug">{SESSION.title}</h2>
      <p className="mt-2 text-[12.5px] text-body leading-relaxed">{SESSION.description}</p>

      <p className="mt-4 text-[12.5px] font-bold text-ink">Expected Output</p>
      <MiniTable columns={EXPECTED_OUTPUT.columns} rows={EXPECTED_OUTPUT.rows} />

      <p className="mt-4 text-[12.5px] font-bold text-ink">Business Context</p>
      <p className="mt-1 text-[12.5px] text-body leading-relaxed">{SESSION.businessContext}</p>

      <div className="mt-4 flex gap-5 border-b border-black/[0.07]">
        {["Schema", "Sample Data"].map((s) => (
          <button
            key={s}
            onClick={() => setSub(s)}
            className={`relative pb-2 text-[13px] font-semibold ${
              sub === s ? "text-brand" : "text-ink/55"
            }`}
          >
            {s}
            {sub === s && (
              <span className="absolute -bottom-px left-0 right-0 h-[2.5px] rounded-full bg-brand" />
            )}
          </button>
        ))}
      </div>

      <div className="mt-3 space-y-3">
        {SCHEMA.map((t) => (
          <SchemaTable key={t.name} table={t} />
        ))}
      </div>
    </>
  );
}

export default function PromptPanel() {
  const [tab, setTab] = useState("Question");
  const TABS = [
    ["Question", FileText],
    ["Notes", NotebookPen],
  ];

  return (
    <div className="bg-white rounded-2xl border border-black/[0.07] shadow-card flex flex-col overflow-hidden">
      <div className="flex border-b border-black/[0.07]">
        {TABS.map(([t, Icon]) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`relative flex items-center gap-2 px-5 py-3 text-[13.5px] font-semibold ${
              tab === t ? "text-brand" : "text-ink/55"
            }`}
          >
            <Icon size={15} /> {t}
            {tab === t && (
              <span className="absolute bottom-0 left-4 right-4 h-[2.5px] rounded-full bg-brand" />
            )}
          </button>
        ))}
      </div>

      <div className="p-4">
        {tab === "Question" ? (
          <QuestionTab />
        ) : (
          <p className="text-[12.5px] text-body">
            Jot down your approach, edge cases and reminders here. Notes are private and never
            evaluated.
          </p>
        )}
      </div>
    </div>
  );
}
