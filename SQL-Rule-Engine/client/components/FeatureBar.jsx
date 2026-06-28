import { MessageSquare, Clock, Database, Settings } from "lucide-react";

const FEATURES = [
  {
    Icon: Settings,
    tint: "bg-violet-100 text-brand",
    title: "Rule Engine Evaluation",
    sub: "Queries evaluated using deterministic rules",
  },
  {
    Icon: Clock,
    tint: "bg-emerald-100 text-emerald-600",
    title: "Timed Interview Mode",
    sub: "10, 15 & 20 minute interview simulations",
  },
  {
    Icon: Database,
    tint: "bg-orange-100 text-carrot",
    title: "Realistic Datasets",
    sub: "Industry-grade schemas and sample data",
  },
  {
    Icon: MessageSquare,
    tint: "bg-sky-100 text-sky-600",
    title: "Interview Feedback",
    sub: "Feedback on result, logic, explanation & edge cases",
  },
];

export default function FeatureBar() {
  return (
    <div className="mt-5 rounded-2xl bg-white border border-black/[0.07] shadow-card px-5 py-4 grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-4">
      {FEATURES.map(({ Icon, tint, title, sub }, i) => (
        <div
          key={title}
          className={`flex items-start gap-3 ${
            i < FEATURES.length - 1 ? "lg:border-r lg:border-black/[0.06] lg:pr-5" : ""
          }`}
        >
          <span className={`grid place-items-center w-10 h-10 rounded-xl shrink-0 ${tint}`}>
            <Icon size={19} />
          </span>
          <div>
            <p className="text-[13.5px] font-bold text-ink leading-tight">{title}</p>
            <p className="text-[12.5px] text-body leading-snug mt-0.5">{sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
