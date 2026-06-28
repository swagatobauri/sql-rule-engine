"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown, ChevronLeft, ChevronRight, HelpCircle, LogOut, Target,
} from "lucide-react";
import { Logo } from "../Illustrations";
import { SESSION } from "@/data/session";
import { usePractice } from "./PracticeProvider";

function ModeToggle({ mode, onChange }) {
  return (
    <div className="flex items-center bg-[#F1F0FA] rounded-lg p-1">
      <button
        onClick={() => onChange("Interview")}
        className={`flex items-center gap-1.5 rounded-md px-3 h-8 text-[13px] font-semibold ${
          mode === "Interview" ? "bg-white shadow-sm text-brand" : "text-ink/55 font-medium"
        }`}
      >
        <Target size={15} /> Interview Mode
      </button>
      <button
        onClick={() => onChange("Practice")}
        className={`flex items-center gap-1.5 rounded-md px-3 h-8 text-[13px] ${
          mode === "Practice" ? "bg-white shadow-sm text-brand font-semibold" : "text-ink/55 font-medium"
        }`}
      >
        <span className={`w-3.5 h-3.5 rounded-full border-2 ${mode === "Practice" ? "border-brand" : "border-ink/30"}`} />
        Practice Mode
      </button>
    </div>
  );
}

export default function SessionTopBar() {
  const { questionIndex, goPrev, goNext } = usePractice();
  const [mode, setMode] = useState("Interview");

  return (
    <header className="bg-white border-b border-black/[0.07] sticky top-0 z-30">
      <div className="min-h-[60px] px-5 py-2 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <Logo />
          <button className="hidden sm:flex items-center gap-2 rounded-lg border border-black/10 px-3 h-9 text-[13.5px] font-bold text-brand bg-white hover:bg-black/[0.02]">
            SQL Practice Arena <ChevronDown size={15} strokeWidth={2} className="text-ink/40" />
          </button>
        </div>

        <div className="flex items-center gap-3 order-last w-full justify-center sm:order-none sm:w-auto">
          <button
            onClick={goPrev}
            disabled={questionIndex <= 1}
            aria-label="Previous question"
            className="grid place-items-center w-8 h-8 rounded-lg border border-black/10 text-ink/50 hover:bg-black/[0.02] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={17} />
          </button>
          <span className="text-[14px] font-semibold whitespace-nowrap">
            Question {questionIndex} of {SESSION.total}
          </span>
          <button
            onClick={goNext}
            disabled={questionIndex >= SESSION.total}
            aria-label="Next question"
            className="grid place-items-center w-8 h-8 rounded-lg border border-black/10 text-ink/50 hover:bg-black/[0.02] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight size={17} />
          </button>
        </div>

        <div className="flex items-center gap-2.5">
          <ModeToggle mode={mode} onChange={setMode} />
          <button className="hidden sm:flex items-center gap-1.5 rounded-lg border border-black/10 px-3 h-9 text-[13px] font-semibold text-ink/75 hover:bg-black/[0.02]">
            <HelpCircle size={16} /> Help
          </button>
          <Link href="/" className="flex items-center gap-1.5 rounded-lg border border-rose-200 text-rose-500 px-3 h-9 text-[13px] font-semibold hover:bg-rose-50">
            <LogOut size={16} /> End Session
          </Link>
        </div>
      </div>
    </header>
  );
}
