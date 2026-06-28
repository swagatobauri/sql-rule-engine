"use client";

import { useMemo, useState } from "react";
import { ChevronDown, SearchX } from "lucide-react";
import PracticeTabs from "./PracticeTabs";
import FilterBar from "./FilterBar";
import QuestionCard from "./QuestionCard";
import { QUESTIONS } from "@/data/questions";

const PAGE_SIZE = 6;

function matchesTime(time, bucket) {
  if (bucket === "All") return true;
  if (bucket === "≤ 10 min") return time <= 10;
  if (bucket === "15 min") return time === 15;
  if (bucket === "20+ min") return time >= 20;
  return true;
}

// Client island: owns the active-tab + filter state and renders the filtered grid.
export default function QuestionExplorer() {
  const [activeTab, setActiveTab] = useState("All");
  const [filters, setFilters] = useState({
    difficulty: "All",
    time: "All",
    status: "All",
    dataset: "All",
  });
  const [search, setSearch] = useState("");
  const [savedOnly, setSavedOnly] = useState(false);
  const [saved, setSaved] = useState(() => new Set());
  const [visible, setVisible] = useState(PAGE_SIZE);

  function toggleSave(id) {
    setSaved((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return QUESTIONS.filter((item) => {
      if (activeTab === "Interview Favorites" && !item.favorite) return false;
      if (activeTab !== "All" && activeTab !== "Interview Favorites" && item.category !== activeTab) return false;
      if (filters.difficulty !== "All" && item.difficulty !== filters.difficulty) return false;
      if (!matchesTime(item.time, filters.time)) return false;
      if (filters.status === "Solved" && !item.solved) return false;
      if (filters.status === "Unsolved" && item.solved) return false;
      if (filters.dataset !== "All" && item.dataset !== filters.dataset) return false;
      if (savedOnly && !saved.has(item.id)) return false;
      if (q && !(`${item.title} ${item.tag} ${item.dataset} ${item.common}`.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [activeTab, filters, search, savedOnly, saved]);

  // Reset paging whenever the active filter set changes.
  const shown = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  function changeTab(tab) {
    setActiveTab(tab);
    setVisible(PAGE_SIZE);
  }
  function changeFilters(updater) {
    setFilters(updater);
    setVisible(PAGE_SIZE);
  }

  return (
    <div className="mt-6" id="questions">
      <PracticeTabs active={activeTab} onChange={changeTab} />
      <FilterBar
        filters={filters}
        onFilterChange={(key, value) => changeFilters((f) => ({ ...f, [key]: value }))}
        search={search}
        onSearchChange={(v) => {
          setSearch(v);
          setVisible(PAGE_SIZE);
        }}
        savedOnly={savedOnly}
        onToggleSavedOnly={() => {
          setSavedOnly((v) => !v);
          setVisible(PAGE_SIZE);
        }}
        savedCount={saved.size}
        resultCount={filtered.length}
      />

      {shown.length > 0 ? (
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {shown.map((q) => (
            <QuestionCard
              key={q.id}
              question={q}
              saved={saved.has(q.id)}
              onToggleSave={() => toggleSave(q.id)}
            />
          ))}
        </div>
      ) : (
        <div className="mt-5 flex flex-col items-center justify-center rounded-2xl bg-white border border-black/[0.07] shadow-card py-14 text-center">
          <SearchX size={28} className="text-ink/30" />
          <p className="mt-3 text-[14px] font-semibold text-ink">No questions match your filters</p>
          <p className="mt-1 text-[12.5px] text-body">Try clearing the search or switching tabs.</p>
        </div>
      )}

      {hasMore && (
        <div className="mt-5 flex justify-center">
          <button
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="flex items-center gap-2 rounded-lg bg-white border border-black/10 px-5 h-9 text-[13px] font-semibold text-ink/80 hover:bg-black/[0.02]"
          >
            Load More Questions <ChevronDown size={15} strokeWidth={2} />
          </button>
        </div>
      )}
    </div>
  );
}
