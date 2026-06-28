import Link from "next/link";
import { Bookmark, Check, Clock, Play } from "lucide-react";
import { TAG_STYLES, DIFFICULTY_COLOR } from "@/lib/styles";

export default function QuestionCard({ question, saved = false, onToggleSave }) {
  const { id, tag, difficulty, time, title, dataset, common, solved } = question;

  return (
    <div className="rounded-2xl bg-white border border-black/[0.07] shadow-card p-4 flex flex-col">
      <div className="flex items-center justify-between">
        <span
          className={`whitespace-nowrap text-[10.5px] font-bold tracking-wide rounded-md px-2 py-1 ${TAG_STYLES[tag]}`}
        >
          {tag}
        </span>
        <div className="flex items-center gap-3 text-[12px] text-body">
          {solved && (
            <span className="flex items-center gap-1 font-semibold text-emerald-600">
              <Check size={13} strokeWidth={3} /> Solved
            </span>
          )}
          <span className="flex items-center gap-1 font-semibold">
            <span className={`text-[8px] ${DIFFICULTY_COLOR[difficulty]}`}>●</span>
            {difficulty}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={13} />
            {time} min
          </span>
        </div>
      </div>

      <h3 className="mt-3 text-[15.5px] font-bold leading-snug text-ink min-h-[44px]">{title}</h3>

      <p className="mt-3 text-[12.5px] text-body">
        Dataset: <span className="text-ink/70 font-medium">{dataset}</span>
      </p>
      <p className="text-[12.5px] text-body">
        Common in: <span className="text-ink/70 font-medium">{common}</span>
      </p>

      <div className="mt-4 flex items-center gap-2">
        <Link href={`/practice?q=${id}`} className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-brand hover:bg-brand-dark text-white text-[13px] font-semibold h-[38px] transition-colors">
          <Play size={13} fill="currentColor" strokeWidth={0} /> Start Timed Mock
        </Link>
        <button
          onClick={onToggleSave}
          aria-label={saved ? "Remove from saved" : "Save question"}
          aria-pressed={saved}
          className={`grid place-items-center w-[38px] h-[38px] rounded-lg border transition-colors ${
            saved
              ? "border-brand/30 bg-brand-soft text-brand"
              : "border-black/10 text-ink/50 hover:bg-black/[0.02]"
          }`}
        >
          <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>
    </div>
  );
}
