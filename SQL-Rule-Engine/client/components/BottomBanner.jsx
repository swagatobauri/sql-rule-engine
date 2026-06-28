import { ArrowRight, Lock } from "lucide-react";

export default function BottomBanner() {
  return (
    <div className="border-t border-amber-200/60 bg-[#FCF6EC]">
      <div className="px-6 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid place-items-center w-8 h-8 rounded-lg bg-amber-100 text-amber-600 shrink-0">
            <Lock size={16} />
          </span>
          <div>
            <p className="text-[13.5px] font-bold text-ink">
              Just getting started? You get 1 expert-reviewed SQL Mock for free.
            </p>
            <p className="text-[12.5px] text-body">Verify your mobile number to start your free mock.</p>
          </div>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-white border border-black/10 px-4 h-10 text-[13.5px] font-semibold text-ink shadow-card whitespace-nowrap hover:bg-black/[0.02]">
          Verify &amp; Start Free Mock <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}
