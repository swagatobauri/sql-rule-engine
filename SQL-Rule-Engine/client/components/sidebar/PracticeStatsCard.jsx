import { CheckCircle2, Clock, Lock, Star } from "lucide-react";

function Stat({ Icon, color, value, label, sub }) {
  return (
    <div className="flex flex-col items-center text-center">
      <Icon size={22} className={color} />
      <span className="mt-1.5 text-[19px] font-extrabold text-ink whitespace-nowrap">{value}</span>
      <span className="text-[12px] font-semibold text-ink/75 leading-tight">{label}</span>
      {sub && <span className="text-[10.5px] text-body leading-tight">{sub}</span>}
    </div>
  );
}

export default function PracticeStatsCard() {
  return (
    <div className="rounded-2xl bg-white border border-black/[0.07] shadow-card p-5">
      <h3 className="text-[15px] font-bold text-ink">Your SQL Practice</h3>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <Stat
          Icon={CheckCircle2}
          color="text-emerald-500"
          value="1 / 1"
          label="Free Mock Used"
          sub="(Expert-evaluated)"
        />
        <Stat Icon={Clock} color="text-brand" value="3" label="Mocks Attempted" />
        <Stat Icon={Star} color="text-amber-400" value="72" label="Avg. Score" />
      </div>

      <div className="mt-5 rounded-xl bg-brand-soft p-4">
        <div className="flex items-start gap-2.5">
          <span className="grid place-items-center w-8 h-8 rounded-lg bg-white text-brand shrink-0 shadow-sm">
            <Lock size={16} />
          </span>
          <div>
            <p className="text-[13.5px] font-bold text-ink">Upgrade to Premium</p>
            <p className="text-[12px] text-body leading-snug mt-0.5">
              Unlock all questions, detailed feedback history and company-specific SQL mocks.
            </p>
          </div>
        </div>
        <button className="mt-3 w-full flex items-center justify-center gap-2 rounded-lg bg-white border border-brand/30 text-brand text-[13px] font-bold h-9 hover:bg-white/70">
          <Lock size={14} /> Unlock Premium
        </button>
      </div>
    </div>
  );
}
