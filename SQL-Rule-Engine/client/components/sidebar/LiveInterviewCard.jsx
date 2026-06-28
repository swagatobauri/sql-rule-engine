import { ArrowRight } from "lucide-react";
import { LiveInterviewIllustration } from "../Illustrations";

export default function LiveInterviewCard() {
  return (
    <div className="rounded-2xl bg-brand-soft border border-brand/10 p-5 overflow-hidden relative">
      <div className="max-w-[62%]">
        <h3 className="text-[16px] font-extrabold text-ink leading-tight">
          Want to experience a real SQL interview?
        </h3>
        <p className="mt-2 text-[12.5px] text-body leading-snug">
          Solve a SQL case live with an expert, explain your thought process and handle follow-up
          questions.
        </p>
      </div>

      <div className="absolute right-3 top-6">
        <LiveInterviewIllustration />
      </div>

      <button className="mt-4 w-full flex items-center justify-center gap-2 rounded-lg bg-carrot hover:bg-carrot-dark text-white text-[13.5px] font-bold h-11 shadow-soft transition-colors">
        Book Live SQL Mock Interview <ArrowRight size={16} />
      </button>
    </div>
  );
}
