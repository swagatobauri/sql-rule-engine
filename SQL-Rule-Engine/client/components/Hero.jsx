import Link from "next/link";
import { BookOpen, Play } from "lucide-react";
import { HeroIllustration } from "./Illustrations";

export default function Hero() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-[1fr_0.92fr] gap-8 items-center pt-9 pb-2">
      <div>
        <p className="text-[12.5px] font-bold tracking-[0.12em] text-brand mb-3">
          SQL INTERVIEW PRACTICE ARENA
        </p>
        <h1 className="text-[44px] leading-[1.08] font-extrabold tracking-[-0.02em] text-ink">
          Practice SQL the way interviews actually test it.
        </h1>
        <p className="mt-4 text-[15.5px] leading-relaxed text-body max-w-[480px]">
          Write queries under time pressure, explain your logic, handle edge cases, and get
          feedback on more than just the final output.
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Link href="/practice" className="flex items-center gap-2 rounded-xl bg-brand hover:bg-brand-dark text-white text-[14.5px] font-semibold px-5 h-[46px] shadow-soft transition-colors">
            <Play size={16} fill="currentColor" strokeWidth={0} /> Start Timed SQL Mock
          </Link>
          <a href="#solved-examples" className="flex items-center gap-2 rounded-xl bg-white border border-black/10 text-ink text-[14.5px] font-semibold px-5 h-[46px] hover:bg-black/[0.02] transition-colors">
            <BookOpen size={17} /> View Solved SQL Examples
          </a>
        </div>
      </div>

      <div className="h-[300px]">
        <HeroIllustration />
      </div>
    </section>
  );
}
