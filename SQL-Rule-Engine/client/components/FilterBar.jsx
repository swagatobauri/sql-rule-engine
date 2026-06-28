"use client";

import { useEffect, useRef, useState } from "react";
import { Bookmark, Check, ChevronDown, Search } from "lucide-react";
import {
  DIFFICULTY_OPTIONS,
  TIME_OPTIONS,
  STATUS_OPTIONS,
  DATASET_OPTIONS,
} from "@/data/questions";

// One filter dropdown. Label shows "Name: value"; opening reveals selectable options.
function Dropdown({ name, prefix, value, options, onSelect }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  const active = value !== "All";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2 rounded-lg border px-3 h-9 text-[13px] font-medium hover:bg-black/[0.02] ${
          active ? "bg-brand-soft border-brand/30 text-brand" : "bg-white border-black/10 text-ink/80"
        }`}
      >
        {prefix}: {value}
        <ChevronDown
          size={15}
          strokeWidth={2}
          className={`${active ? "text-brand/60" : "text-ink/45"} transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute z-20 mt-1.5 min-w-[170px] rounded-xl bg-white border border-black/10 shadow-soft p-1.5">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onSelect(name, opt);
                setOpen(false);
              }}
              className={`w-full flex items-center justify-between gap-3 rounded-lg px-2.5 h-8 text-[13px] hover:bg-black/[0.03] ${
                opt === value ? "font-semibold text-brand" : "text-ink/80"
              }`}
            >
              {opt}
              {opt === value && <Check size={14} className="text-brand" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function FilterBar({
  filters,
  onFilterChange,
  search,
  onSearchChange,
  savedOnly,
  onToggleSavedOnly,
  savedCount,
  resultCount,
}) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2.5">
      <Dropdown name="difficulty" prefix="Difficulty" value={filters.difficulty} options={DIFFICULTY_OPTIONS} onSelect={onFilterChange} />
      <Dropdown name="time" prefix="Time" value={filters.time} options={TIME_OPTIONS} onSelect={onFilterChange} />
      <Dropdown name="status" prefix="Status" value={filters.status} options={STATUS_OPTIONS} onSelect={onFilterChange} />
      <Dropdown name="dataset" prefix="Dataset" value={filters.dataset} options={DATASET_OPTIONS} onSelect={onFilterChange} />

      <button
        onClick={onToggleSavedOnly}
        className={`flex items-center gap-2 rounded-lg border px-3 h-9 text-[13px] font-medium hover:bg-black/[0.02] ${
          savedOnly ? "bg-brand-soft border-brand/30 text-brand" : "bg-white border-black/10 text-ink/80"
        }`}
      >
        <Bookmark size={15} fill={savedOnly ? "currentColor" : "none"} /> Saved
        {savedCount > 0 && (
          <span className={`text-[11px] font-bold ${savedOnly ? "text-brand" : "text-ink/50"}`}>{savedCount}</span>
        )}
      </button>

      <div className="ml-auto flex items-center gap-3">
        <span className="hidden sm:block text-[12px] text-body whitespace-nowrap">
          {resultCount} {resultCount === 1 ? "question" : "questions"}
        </span>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search questions..."
            className="w-[230px] max-w-[55vw] rounded-lg bg-white border border-black/10 pl-9 pr-3 h-9 text-[13px] placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
        </div>
      </div>
    </div>
  );
}
