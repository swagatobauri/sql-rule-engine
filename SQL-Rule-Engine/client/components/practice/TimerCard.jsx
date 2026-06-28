"use client";

import { useEffect, useState } from "react";
import { Pause, Play, Target } from "lucide-react";
import { TIMER } from "@/data/session";

function TimerRing({ remaining, total }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const frac = total > 0 ? remaining / total : 0;
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");

  return (
    <div className="relative grid place-items-center w-[130px] h-[130px] mx-auto">
      <svg width="130" height="130" className="-rotate-90">
        <circle cx="65" cy="65" r={r} fill="none" stroke="#EDEBF6" strokeWidth="9" />
        <circle
          cx="65"
          cy="65"
          r={r}
          fill="none"
          stroke="#6C4DE0"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - frac)}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-[26px] font-extrabold tracking-tight tabular-nums">
          {mm}:{ss}
        </div>
        <div className="text-[11px] text-body">of 15:00</div>
      </div>
    </div>
  );
}

export default function TimerCard() {
  const [remaining, setRemaining] = useState(TIMER.remainingSeconds);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setRemaining((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <div className="bg-white rounded-2xl border border-black/[0.07] shadow-card p-4">
      <div className="flex items-center justify-between">
        <span className="text-[14px] font-bold">Time Left</span>
        <button
          onClick={() => setPaused((p) => !p)}
          className="flex items-center gap-1.5 rounded-lg border border-black/10 px-2.5 h-8 text-[12.5px] font-semibold text-ink/75 hover:bg-black/[0.02]"
        >
          {paused ? <Play size={13} fill="currentColor" strokeWidth={0} /> : <Pause size={13} fill="currentColor" strokeWidth={0} />}
          {paused ? "Resume" : "Pause"}
        </button>
      </div>

      <div className="mt-3">
        <TimerRing remaining={remaining} total={TIMER.totalSeconds} />
      </div>

      <div className="mt-2 text-center">
        <p className="flex items-center justify-center gap-1.5 text-[13px] font-bold text-brand">
          <Target size={14} /> Interview Mode
        </p>
        <p className="mt-1 text-[11.5px] text-body leading-snug px-3">
          This is a timed mock. Complete and submit before time runs out.
        </p>
      </div>
    </div>
  );
}
