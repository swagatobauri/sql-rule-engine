"use client";

import { useRef, useState } from "react";
import {
  AlignLeft, ChevronDown, Database, CircleAlert, CircleCheck, Info, Maximize2,
  Minimize2, Play, SquareTerminal, Trash2,
} from "lucide-react";
import { tokenizeLine, TOKEN_CLASS } from "@/lib/sqlHighlight";
import { SESSION } from "@/data/session";
import { usePractice } from "./PracticeProvider";

// Highlighted, read-only render of the source. Sits *behind* a transparent
// textarea so the user edits real text while seeing colourised tokens.
function HighlightLayer({ source, innerRef }) {
  const lines = source.split("\n");
  return (
    <pre
      ref={innerRef}
      aria-hidden
      className="absolute inset-0 m-0 overflow-auto bg-white font-mono text-[12.5px] leading-[1.55] py-3 pointer-events-none"
    >
      {lines.map((line, i) => {
        const tokens = tokenizeLine(line);
        return (
          <div key={i} className="flex">
            <span className="select-none w-10 shrink-0 text-right pr-3 text-slate-300">{i + 1}</span>
            <code className="whitespace-pre">
              {tokens.length === 0
                ? " "
                : tokens.map((t, j) => (
                    <span key={j} className={TOKEN_CLASS[t.type]}>
                      {t.value}
                    </span>
                  ))}
            </code>
          </div>
        );
      })}
    </pre>
  );
}

function CodeEditor({ value, onChange, onRun, tall }) {
  const taRef = useRef(null);
  const preRef = useRef(null);

  function syncScroll() {
    if (preRef.current && taRef.current) {
      preRef.current.scrollTop = taRef.current.scrollTop;
      preRef.current.scrollLeft = taRef.current.scrollLeft;
    }
  }

  function onKeyDown(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      onRun();
      return;
    }
    if (e.key === "Tab") {
      e.preventDefault();
      const el = e.target;
      const { selectionStart: s, selectionEnd: end } = el;
      const next = value.slice(0, s) + "  " + value.slice(end);
      onChange(next);
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = s + 2;
      });
    }
  }

  return (
    <div className={`relative ${tall ? "h-[calc(100vh-220px)]" : "h-[300px]"}`}>
      <HighlightLayer source={value || ""} innerRef={preRef} />
      <textarea
        ref={taRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={syncScroll}
        onKeyDown={onKeyDown}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        wrap="off"
        aria-label="SQL editor"
        className="absolute inset-0 m-0 resize-none overflow-auto bg-transparent font-mono text-[12.5px] leading-[1.55] py-3 pr-3 text-transparent caret-ink outline-none whitespace-pre"
        style={{ paddingLeft: "2.5rem" }}
      />
    </div>
  );
}

function ResultTable({ columns, rows }) {
  return (
    <div className="mt-3 rounded-xl border border-black/[0.08] overflow-x-auto">
      <table className="w-full text-[12.5px]">
        <thead>
          <tr className="bg-[#FAFAFC] text-body">
            {columns.map((c) => (
              <th key={c} className="text-left font-semibold px-4 py-2.5">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-black/[0.06]">
              {r.map((cell, j) => (
                <td key={j} className="px-4 py-2.5">
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

function ResultBody({ tab, runResult, previousRuns, runCount, maxRuns }) {
  if (!runResult) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg bg-[#F7F8FA] border border-black/[0.05] py-10 text-center">
        <Play size={20} className="text-ink/30" fill="currentColor" strokeWidth={0} />
        <p className="mt-2 text-[12.5px] font-semibold text-ink/70">Run your query to see results</p>
        <p className="text-[11.5px] text-body">Press Run Query or Ctrl+Enter.</p>
      </div>
    );
  }

  if (tab === "Previous Runs") {
    if (previousRuns.length === 0) {
      return <p className="text-[12.5px] text-body py-4 text-center">No runs yet.</p>;
    }
    return (
      <div className="rounded-xl border border-black/[0.08] divide-y divide-black/[0.06]">
        {previousRuns.map((r) => (
          <div key={r.n} className="flex items-center justify-between px-3.5 py-2.5 text-[12.5px]">
            <span className="flex items-center gap-2 font-semibold">
              {r.success ? (
                <CircleCheck size={14} className="text-emerald-500" />
              ) : (
                <CircleAlert size={14} className="text-rose-500" />
              )}
              Run #{r.n}
            </span>
            <span className="text-body">
              {r.success ? `${r.rowCount} rows` : "failed"}
              <span className="mx-1.5 text-ink/20">|</span>
              {(r.durationMs / 1000).toFixed(3)}s
            </span>
          </div>
        ))}
      </div>
    );
  }

  if (tab === "Query Stats") {
    const stats = runResult.success
      ? [
          ["Status", "Success"],
          ["Rows returned", String(runResult.rowCount)],
          ["Columns", String(runResult.columns.length)],
          ["Execution time", `${(runResult.durationMs / 1000).toFixed(3)}s`],
          ["Runs used", `${runCount} / ${maxRuns}`],
        ]
      : [
          ["Status", "Failed"],
          ["Error", runResult.error],
          ["Runs used", `${runCount} / ${maxRuns}`],
        ];
    return (
      <div className="rounded-xl border border-black/[0.08] divide-y divide-black/[0.06]">
        {stats.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between px-3.5 py-2.5 text-[12.5px]">
            <span className="text-body">{k}</span>
            <span className="font-semibold text-ink text-right">{v}</span>
          </div>
        ))}
      </div>
    );
  }

  // Query Result
  if (!runResult.success) {
    return (
      <>
        <div className="flex items-center gap-2 rounded-lg bg-rose-50 border border-rose-100 px-3 py-2">
          <CircleAlert size={15} className="text-rose-500 shrink-0" />
          <span className="text-[12.5px] font-semibold text-rose-600">{runResult.error}</span>
        </div>
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-[#F7F8FA] border border-black/[0.05] px-3 py-2.5 text-[12px] text-body">
          <Info size={15} className="text-ink/35 shrink-0" />
          Fix the query and run again. You have {maxRuns - runCount} run{maxRuns - runCount === 1 ? "" : "s"} left.
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between rounded-lg bg-emerald-50 border border-emerald-100 px-3 py-2">
        <span className="flex items-center gap-2 text-[12.5px] font-semibold text-emerald-600">
          <CircleCheck size={15} /> Query executed successfully
        </span>
        <span className="text-[12px] text-body">
          Rows: <b className="text-ink">{runResult.rowCount}</b>
          <span className="mx-1 text-ink/20">|</span>
          {(runResult.durationMs / 1000).toFixed(3)}s
        </span>
      </div>

      <ResultTable columns={runResult.columns} rows={runResult.rows} />

      <div className="mt-3 flex items-center gap-2 rounded-lg bg-[#F7F8FA] border border-black/[0.05] px-3 py-2.5 text-[12px] text-body">
        <Info size={15} className="text-ink/35 shrink-0" />
        This is a preview of your result. Click &apos;Submit Final Answer&apos; to get full evaluation.
      </div>
    </>
  );
}

export default function SqlEditor() {
  const { query, setQuery, runQuery, runResult, runCount, maxRuns, previousRuns, format, clear } = usePractice();
  const [resultTab, setResultTab] = useState("Query Result");
  const [fullscreen, setFullscreen] = useState(false);

  function handleRun() {
    const r = runQuery();
    if (!r?.capped) setResultTab("Query Result");
  }

  const atCap = runCount >= maxRuns;

  return (
    <div
      className={`bg-white border border-black/[0.07] shadow-card flex flex-col overflow-hidden ${
        fullscreen ? "fixed inset-3 z-50 rounded-2xl" : "rounded-2xl"
      }`}
    >
      {/* header */}
      <div className="flex items-center justify-between px-4 h-12 border-b border-black/[0.07]">
        <span className="flex items-center gap-2 text-[14px] font-bold">
          <SquareTerminal size={17} className="text-brand" /> SQL Editor
        </span>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 rounded-lg border border-black/10 px-3 h-8 text-[12.5px] font-semibold text-ink/80 hover:bg-black/[0.02]">
            <Database size={14} className="text-ink/50" /> {SESSION.database}
            <ChevronDown size={14} strokeWidth={2} className="text-ink/40" />
          </button>
          <button
            onClick={() => setFullscreen((f) => !f)}
            aria-label={fullscreen ? "Exit fullscreen" : "Fullscreen"}
            className="grid place-items-center w-8 h-8 rounded-lg border border-black/10 text-ink/50 hover:bg-black/[0.02]"
          >
            {fullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        </div>
      </div>

      {/* code */}
      <CodeEditor value={query} onChange={setQuery} onRun={handleRun} tall={fullscreen} />

      {/* actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-t border-black/[0.07]">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleRun}
            disabled={atCap}
            className="flex items-center gap-2 rounded-lg bg-brand hover:bg-brand-dark text-white px-3.5 h-9 text-[13px] font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play size={13} fill="currentColor" strokeWidth={0} /> Run Query
            <span className="text-white/70 font-medium text-[12px]">Ctrl+Enter</span>
          </button>
          <button
            onClick={format}
            className="flex items-center gap-2 rounded-lg border border-black/10 px-3 h-9 text-[13px] font-semibold text-ink/75 hover:bg-black/[0.02]"
          >
            <AlignLeft size={15} /> Format
          </button>
          <button
            onClick={clear}
            className="flex items-center gap-2 rounded-lg border border-black/10 px-3 h-9 text-[13px] font-semibold text-rose-500 hover:bg-rose-50"
          >
            <Trash2 size={14} /> Clear
          </button>
        </div>
        <span className="flex items-center gap-1.5 text-[12.5px] text-body">
          Runs: <b className={atCap ? "text-rose-500" : "text-ink"}>{runCount} / {maxRuns}</b>
          <Info size={14} className="text-ink/35" />
        </span>
      </div>

      {/* result tabs */}
      <div className="px-4 border-t border-black/[0.07] flex gap-5 overflow-x-auto">
        {["Query Result", "Query Stats", "Previous Runs"].map((t) => (
          <button
            key={t}
            onClick={() => setResultTab(t)}
            className={`relative whitespace-nowrap py-2.5 text-[13px] font-semibold ${
              resultTab === t ? "text-brand" : "text-ink/55"
            }`}
          >
            {t}
            {t === "Previous Runs" && previousRuns.length > 0 && (
              <span className="ml-1.5 text-[11px] text-ink/40">{previousRuns.length}</span>
            )}
            {resultTab === t && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] rounded-full bg-brand" />
            )}
          </button>
        ))}
      </div>

      {/* result body */}
      <div className="p-4 overflow-y-auto">
        <ResultBody
          tab={resultTab}
          runResult={runResult}
          previousRuns={previousRuns}
          runCount={runCount}
          maxRuns={maxRuns}
        />
      </div>
    </div>
  );
}
