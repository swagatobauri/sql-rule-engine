import { Database, MessageSquare, Settings, Star } from "lucide-react";
import { SOLVED_EXAMPLES } from "@/data/questions";

// Map serialisable icon names from the data layer to lucide components.
const ICONS = { Database, Settings, MessageSquare, Star };

export default function SolvedExamplesCard() {
  return (
    <div id="solved-examples" className="scroll-mt-24 rounded-2xl bg-white border border-black/[0.07] shadow-card p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-[15px] font-bold text-ink whitespace-nowrap">Solved SQL Examples</h3>
        <a href="#" className="text-[12.5px] font-semibold text-brand whitespace-nowrap">
          View all
        </a>
      </div>

      <div className="mt-3 divide-y divide-black/[0.06]">
        {SOLVED_EXAMPLES.map((e) => {
          const Icon = ICONS[e.icon];
          return (
            <div key={e.title} className="flex items-center gap-3 py-3">
              <span className={`grid place-items-center w-9 h-9 rounded-lg shrink-0 ${e.tint}`}>
                <Icon size={16} />
              </span>
              <div className="flex-1">
                <p className="text-[13.5px] font-bold text-ink leading-tight">{e.title}</p>
                <p className="text-[12px] text-body">{e.sub}</p>
              </div>
              <span className="text-[12px] font-medium text-body">{e.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
